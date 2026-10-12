/* Persistence. Local first (localStorage), with:
   1. export and import of a JSON file,
   2. optional encrypted backup to a private GitHub Gist, synced automatically.
   The Gist is the "do not lose my data" layer: it survives a cleared browser,
   a lost phone, or switching devices. */
window.BUMP = window.BUMP || {};
(function () {
  var KEY = "bump.v1";
  var S = BUMP.store = {};

  S.load = function () {
    try { var raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  };
  S.save = function (state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch (e) { console.warn("local save failed", e); return false; }
  };

  /* ----- file export / import ----- */
  S.exportJSON = function (state) {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bump-backup-" + BUMP.dateKey(new Date()) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  };
  S.importJSON = function (file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { try { resolve(JSON.parse(r.result)); } catch (e) { reject(new Error("That file is not a Bump backup.")); } };
      r.onerror = function () { reject(new Error("Could not read the file.")); };
      r.readAsText(file);
    });
  };

  /* ----- merge: newest updatedAt wins per day; profile newest wins ----- */
  S.merge = function (local, remote) {
    if (!remote) return local;
    if (!local) return remote;
    var out = JSON.parse(JSON.stringify(local));
    out.days = out.days || {};
    var rd = remote.days || {};
    Object.keys(rd).forEach(function (k) {
      var l = out.days[k];
      if (!l || (rd[k].updatedAt || 0) > (l.updatedAt || 0)) out.days[k] = rd[k];
    });
    if ((remote.profileUpdatedAt || 0) > (local.profileUpdatedAt || 0) || (!local.profile.dueDate && remote.profile && remote.profile.dueDate)) {
      var keepSync = out.profile.gist; // never let a remote copy overwrite local credentials
      var keepApi = out.profile.api;
      out.profile = remote.profile;
      out.profile.gist = keepSync; out.profile.api = keepApi;
      out.profileUpdatedAt = remote.profileUpdatedAt;
    }
    var seen = {};
    out.coach = out.coach || { answers: [] };
    (remote.coach && remote.coach.answers || []).concat(out.coach.answers || []).forEach(function (a) { seen[a.ts] = a; });
    out.coach.answers = Object.keys(seen).map(function (k) { return seen[k]; }).sort(function (a, b) { return b.ts - a.ts; }).slice(0, 50);
    return out;
  };

  /* ----- crypto (AES-GCM with a passphrase) ----- */
  var enc = new TextEncoder(), dec = new TextDecoder();
  function b64(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); }
  function unb64(s) { var bin = atob(s), arr = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i); return arr; }
  function deriveKey(pass, salt) {
    return crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]).then(function (km) {
      return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: 200000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    });
  }
  S.encrypt = function (text, pass) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    return deriveKey(pass, salt).then(function (key) { return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, enc.encode(text)); })
      .then(function (ct) { return JSON.stringify({ v: 1, enc: "aes-gcm", salt: b64(salt), iv: b64(iv), data: b64(ct) }); });
  };
  S.decrypt = function (payload, pass) {
    var o = JSON.parse(payload);
    if (!o.enc) return Promise.resolve(payload); // plain
    return deriveKey(pass, unb64(o.salt)).then(function (key) { return crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(o.iv) }, key, unb64(o.data)); })
      .then(function (pt) { return dec.decode(pt); });
  };

  /* ----- GitHub Gist backup ----- */
  var FILE = "bump-data.json";
  function gh(token, method, url, body) {
    return fetch(url, { method: method, headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error("GitHub " + r.status + ": " + (t || r.statusText).slice(0, 200)); }); return r.status === 204 ? null : r.json(); });
  }
  S.gistPush = function (state) {
    var g = state.profile.gist || {};
    if (!g.token) return Promise.reject(new Error("No GitHub token saved."));
    var copy = JSON.parse(JSON.stringify(state));
    delete copy.profile.gist; delete copy.profile.api; // never upload credentials
    var text = JSON.stringify(copy);
    var p = g.passphrase ? S.encrypt(text, g.passphrase) : Promise.resolve(text);
    return p.then(function (content) {
      var files = {}; files[FILE] = { content: content };
      if (g.id) return gh(g.token, "PATCH", "https://api.github.com/gists/" + g.id, { files: files });
      return gh(g.token, "POST", "https://api.github.com/gists", { description: "Bump pregnancy tracker backup (private)", public: false, files: files });
    }).then(function (res) { return { id: res.id, at: Date.now() }; });
  };
  S.gistPull = function (state) {
    var g = state.profile.gist || {};
    if (!g.token || !g.id) return Promise.resolve(null);
    return gh(g.token, "GET", "https://api.github.com/gists/" + g.id).then(function (res) {
      var f = res.files && res.files[FILE];
      if (!f) return null;
      var get = f.truncated ? fetch(f.raw_url).then(function (r) { return r.text(); }) : Promise.resolve(f.content);
      return get.then(function (content) { return g.passphrase || /"enc"/.test(content.slice(0, 40)) ? S.decrypt(content, g.passphrase || "") : content; })
        .then(function (text) { return JSON.parse(text); });
    });
  };
  S.gistFind = function (token) { // find an existing backup gist on this account
    return gh(token, "GET", "https://api.github.com/gists?per_page=100").then(function (list) {
      var hit = (list || []).find(function (x) { return x.files && x.files[FILE]; });
      return hit ? hit.id : null;
    });
  };
})();
