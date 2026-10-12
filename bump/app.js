/* Bump: a small pregnancy tracker. Plain JavaScript, no build step.
   State lives in localStorage and optionally in an encrypted private Gist. */
window.BUMP = window.BUMP || {};
(function () {
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var uid = function () { return Math.random().toString(36).slice(2, 8); };

  /* ---------------- state ---------------- */
  var DEFAULT_SUPPS = [
    { id: "prenatal", name: "Prenatal", doses: 3, optional: false },
    { id: "dha", name: "DHA (algal)", doses: 2, optional: false },
    { id: "mag", name: "Magnesium", doses: 1, optional: true }
  ];
  var state = BUMP.store.load() || {
    v: 1,
    profile: { name: "", dueDate: "", age: 39, diet: "vegetarian", heightCm: null, prePregWeightKg: null, notes: "", supplements: DEFAULT_SUPPS, milestones: {}, gist: {}, api: {} },
    profileUpdatedAt: 0, days: {}, coach: { answers: [] }, ui: { tab: "today", learn: "baby" }
  };
  state.profile.supplements = state.profile.supplements || DEFAULT_SUPPS;
  state.profile.milestones = state.profile.milestones || {};
  state.profile.gist = state.profile.gist || {};
  state.profile.api = state.profile.api || {};
  state.days = state.days || {};
  state.coach = state.coach || { answers: [] };
  state.ui = state.ui || { tab: "today", learn: "baby" };
  BUMP.state = state;

  var saveTimer = null, syncTimer = null;
  function persist(opts) {
    BUMP.store.save(state);
    if (!(opts && opts.quiet)) scheduleSync();
  }
  function touchProfile() { state.profileUpdatedAt = Date.now(); persist(); }
  function day(key) {
    key = key || todayKey();
    if (!state.days[key]) state.days[key] = { supp: {}, nut: {}, sym: {}, move: [], updatedAt: 0 };
    var d = state.days[key];
    d.supp = d.supp || {}; d.nut = d.nut || {}; d.sym = d.sym || {}; d.move = d.move || [];
    return d;
  }
  function touchDay(key) { day(key).updatedAt = Date.now(); persist(); }

  /* ---------------- sync ---------------- */
  var syncStatus = { state: "idle", msg: "" };
  function scheduleSync() {
    if (!state.profile.gist.token) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { syncNow(false); }, 4000);
  }
  function syncNow(interactive) {
    if (!state.profile.gist.token) return Promise.resolve();
    syncStatus = { state: "busy", msg: "Syncing" }; renderSyncBadge();
    var pull = state.profile.gist.id ? BUMP.store.gistPull(state) : Promise.resolve(null);
    return pull.then(function (remote) {
      if (remote) {
        var merged = BUMP.store.merge(state, remote);
        state.days = merged.days; state.profile = merged.profile; state.profileUpdatedAt = merged.profileUpdatedAt; state.coach = merged.coach;
        BUMP.store.save(state);
      }
      return BUMP.store.gistPush(state);
    }).then(function (res) {
      state.profile.gist.id = res.id; state.profile.gist.lastSync = res.at;
      BUMP.store.save(state);
      syncStatus = { state: "ok", msg: "Backed up" }; renderSyncBadge();
      if (interactive) { toast("Backed up to your private Gist."); render(); }
    }).catch(function (e) {
      syncStatus = { state: "err", msg: e.message }; renderSyncBadge();
      if (interactive) toast("Backup failed: " + e.message, true);
    });
  }
  function renderSyncBadge() {
    var el = $("#syncBadge"); if (!el) return;
    if (!state.profile.gist.token) { el.textContent = ""; el.className = "sync"; return; }
    el.className = "sync " + syncStatus.state;
    el.title = syncStatus.msg;
    el.textContent = syncStatus.state === "busy" ? "…" : syncStatus.state === "err" ? "!" : "✓";
  }

  /* ---------------- pregnancy math ---------------- */
  function todayKey() { return BUMP.dateKey(new Date()); }
  function parseKey(k) { var p = k.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function ctxFor(key) {
    key = key || todayKey();
    var due = state.profile.dueDate ? parseKey(state.profile.dueDate) : null;
    var d = parseKey(key);
    if (!due) return { ok: false, week: 0, day: 0, trimester: 1, dayOfPregnancy: 0, daysToGo: null, todayKey: key };
    var lmp = new Date(due.getFullYear(), due.getMonth(), due.getDate() - 280);
    var dop = Math.round((d - lmp) / 86400000);
    var week = Math.floor(dop / 7), dayIn = ((dop % 7) + 7) % 7;
    var tri = week < 14 ? 1 : week < 28 ? 2 : 3;
    return { ok: true, week: week, day: dayIn, trimester: tri, dayOfPregnancy: dop, daysToGo: Math.round((due - d) / 86400000), todayKey: key, days: state.days, profile: state.profile };
  }
  function fmtLen(cm) { if (cm < 1) return (cm * 10).toFixed(0) + " mm"; return cm.toFixed(1) + " cm / " + (cm / 2.54).toFixed(1) + " in"; }
  function fmtWt(g) { if (!g) return "under a gram"; if (g < 1000) return g + " g / " + (g / 28.35).toFixed(1) + " oz"; return (g / 1000).toFixed(2) + " kg / " + Math.floor(g / 453.6) + " lb " + Math.round((g % 453.6) / 28.35) + " oz"; }
  function fmtDate(key) { var d = parseKey(key); return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }); }

  /* ---------------- toast ---------------- */
  var toastTimer;
  function toast(msg, bad) {
    var t = $("#toast"); t.textContent = msg; t.className = "toast show" + (bad ? " bad" : "");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.className = "toast"; }, 3200);
  }

  /* ---------------- rendering ---------------- */
  var view = $("#view");
  function render() {
    renderSyncBadge();
    $$(".tabbar button").forEach(function (b) { b.classList.toggle("on", b.dataset.tab === state.ui.tab); });
    if (!state.profile.dueDate && state.ui.tab !== "settings") { view.innerHTML = onboardingHTML(); return; }
    var fn = { today: todayHTML, log: logHTML, learn: learnHTML, coach: coachHTML, settings: settingsHTML }[state.ui.tab] || todayHTML;
    view.innerHTML = fn();
    view.className = ({ today: 1, log: 1, coach: 1, settings: 1 })[state.ui.tab] ? "view-grid" : "";
    window.scrollTo(0, state.ui.scrollKeep ? window.scrollY : 0);
    state.ui.scrollKeep = false;
  }
  function rerender() { state.ui.scrollKeep = true; render(); }

  function onboardingHTML() {
    return '<section class="card hero span"><h1>Welcome to Bump</h1><p>Your own tracker: baby facts by the day, nutrition with the why, supplements, symptoms, movement, and a coach that reads what you log.</p>' +
      '<label>Due date<input type="date" id="obDue" value="' + esc(state.profile.dueDate) + '"></label>' +
      '<p class="muted">Or work it out from your last period:</p><label>First day of last period<input type="date" id="obLmp"></label>' +
      '<label>Your name (optional)<input type="text" id="obName" placeholder="Kari" value="' + esc(state.profile.name) + '"></label>' +
      '<button class="primary" data-action="onboard">Start</button>' +
      '<details class="restore"><summary>Already using Bump somewhere else? Bring your data here</summary>' +
      '<p class="tiny">In the other copy, open Settings and tap Copy all data. Then paste it here.</p><textarea id="pasteData" rows="3" placeholder="Paste here"></textarea><button class="small" data-action="pasteRestore">Restore pasted data</button>' +
      '<p class="tiny">Or restore a backup file:</p><label class="btn">' + BUMP.icon('upload') + 'Restore from file<input type="file" accept="application/json" id="importFile" hidden></label></details>' +
      '<p class="tiny">Everything stays on this device until you turn on backup in Settings. This app gives general guidance and is not a substitute for your own provider.</p></section>';
  }

  /* ----- Today ----- */
  function todayHTML() {
    var key = todayKey(), c = ctxFor(key), d = day(key), w = BUMP.weekInfo(c.week);
    var pct = Math.max(0, Math.min(100, Math.round(100 * c.dayOfPregnancy / 280)));
    var fact = w.baby[c.day % w.baby.length];
    var focus = BUMP.dailyFocus(c.dayOfPregnancy, c.trimester);
    var insights = BUMP.generateInsights(c);
    var top = insights.filter(function (i) { return i.level !== "win"; })[0] || insights[0];
    var h = '';
    h += '<section class="hero card span">' +
      '<div class="row between"><div><div class="eyebrow">' + (state.profile.name ? esc(state.profile.name) + ", you are" : "You are") + '</div><h1>Week ' + c.week + ' <span class="plus">+ ' + c.day + '</span></h1></div>' +
      '<div class="right"><div class="big">' + (c.daysToGo >= 0 ? c.daysToGo : 0) + '</div><div class="eyebrow">days to go</div></div></div>' +
      '<div class="bar"><div style="width:' + pct + '%"></div></div>' +
      '<div class="row between tiny muted"><span>Trimester ' + c.trimester + '</span><span>' + pct + '% there</span><span>Due ' + fmtDate(state.profile.dueDate) + '</span></div></section>';
    h += '<section class="card baby" data-action="goLearn" data-learn="baby"><div class="artwrap">' + BUMP.sizeArt(c.week) + '</div><div><div class="eyebrow">About the size of</div><h2>' + esc(cap(w.size)) + '</h2>' +
      '<div class="tiny muted">' + fmtLen(w.len) + ' · ' + fmtWt(w.wt) + '</div><p>' + esc(fact) + '</p><span class="link">This week in detail</span></div></section>';
    if (top) h += insightCard(top, true);
    h += '<section class="card"><div class="row between"><h3>' + BUMP.icon('pill') + 'Supplements</h3><span class="tiny muted">' + suppSummary(d) + '</span></div>' + suppBoxesHTML(d, key) + '</section>';
    h += '<section class="card"><div class="row between"><h3>' + BUMP.icon('leaf') + 'Eat today</h3><button class="ghost small" data-action="goLearn" data-learn="eat">Library</button></div>' +
      '<div class="focus"><div class="eyebrow">Nutrient focus for ' + fmtDate(key) + '</div><h4>' + esc(focus.nutrient.name) + '</h4><div class="tiny muted">' + esc(focus.nutrient.target) + '</div>' +
      '<p>' + esc(focus.nutrient.why) + '</p><details><summary>Where to get it</summary><ul>' + focus.nutrient.veg.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      (focus.nutrient.meat.length ? '<div class="eyebrow">If you choose to eat meat or fish</div><ul>' + focus.nutrient.meat.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="tiny">' + esc(focus.nutrient.tips) + '</p></details></div>' + foodTargetsHTML(d, key) + '</section>';
    h += '<section class="card"><div class="row between"><h3>' + BUMP.icon('move') + 'Move today</h3><button class="ghost small" data-action="goLearn" data-learn="move">Library</button></div>' + movePlanHTML(d, key, c) + '</section>';
    h += '<section class="card"><div class="row between"><h3>' + BUMP.icon('heart') + 'How are you today?</h3><button class="ghost small" data-action="goTab" data-tab="log">Full check-in</button></div>' + quickSymHTML(d, key, c) + '</section>';
    return h;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function suppSummary(d) {
    var tot = 0, got = 0;
    state.profile.supplements.forEach(function (s) { if (s.optional) return; tot += s.doses; got += (d.supp[s.id] || []).filter(Boolean).length; });
    return got + " of " + tot + " today";
  }
  function suppBoxesHTML(d, key) {
    return state.profile.supplements.map(function (s) {
      var arr = d.supp[s.id] || [];
      var boxes = ''; for (var i = 0; i < s.doses; i++) boxes += '<button class="tick' + (arr[i] ? ' on' : '') + (s.optional ? ' opt' : '') + '" data-action="supp" data-key="' + key + '" data-id="' + s.id + '" data-i="' + i + '" aria-label="' + esc(s.name) + ' dose ' + (i + 1) + '">' + (arr[i] ? '✓' : (i + 1)) + '</button>';
      return '<div class="supp"><div><div class="name">' + esc(s.name) + (s.optional ? ' <span class="tag">optional</span>' : '') + '</div><div class="tiny muted">' + s.doses + (s.doses === 1 ? ' dose' : ' doses') + ' a day</div></div><div class="ticks">' + boxes + '</div></div>';
    }).join('') + '<p class="tiny muted">Tip: prenatal with food, an hour away from coffee or tea. DHA with a meal that has some fat. Magnesium at night.</p>';
  }
  function foodTargetsHTML(d, key) {
    return '<div class="targets">' + BUMP.FOOD_TARGETS.map(function (t) {
      var n = d.nut[t.id] || 0, done = n >= t.count;
      var dots = '';
      if (t.count <= 4) { for (var i = 0; i < t.count; i++) dots += '<span class="dot' + (i < n ? ' on' : '') + '"></span>'; }
      else dots = '<span class="count">' + n + '/' + t.count + '</span>';
      return '<div class="target' + (done ? ' done' : '') + '"><button class="hit" data-action="nut" data-key="' + key + '" data-id="' + t.id + '" title="' + esc(t.why) + '"><span class="lbl">' + esc(t.label) + '</span><span class="dots">' + dots + '</span></button><button class="minus" data-action="nutMinus" data-key="' + key + '" data-id="' + t.id + '" aria-label="remove one">−</button></div>';
    }).join('') + '</div><p class="tiny muted">Tap a row each time you have one. Hold or hover a row for the why.</p>';
  }
  function movePlanHTML(d, key, c) {
    var wd = parseKey(key).getDay(), plan = BUMP.MOVE_PLAN[wd];
    var doneIds = d.move.map(function (m) { return m.id; });
    var h = plan.map(function (id) {
      var r = BUMP.ROUTINES[id], done = doneIds.indexOf(id) !== -1;
      return '<div class="routine' + (done ? ' done' : '') + '"><div><div class="name">' + esc(r.name) + '</div><div class="tiny muted">' + r.minutes + ' min · ' + esc(r.tag) + '</div></div>' +
        (done ? '<button class="ghost small" data-action="unmove" data-key="' + key + '" data-id="' + id + '">Undo</button>' : '<button class="small" data-action="openRoutine" data-key="' + key + '" data-id="' + id + '">Start</button>') + '</div>';
    }).join('');
    var others = Object.keys(BUMP.ROUTINES).filter(function (id) { return plan.indexOf(id) === -1; });
    h += '<details class="more"><summary>Something else</summary>' + others.map(function (id) { var r = BUMP.ROUTINES[id]; var done = doneIds.indexOf(id) !== -1; return '<div class="routine' + (done ? ' done' : '') + '"><div><div class="name">' + esc(r.name) + '</div><div class="tiny muted">' + r.minutes + ' min · ' + esc(r.tag) + '</div></div>' + (done ? '<button class="ghost small" data-action="unmove" data-key="' + key + '" data-id="' + id + '">Undo</button>' : '<button class="small" data-action="openRoutine" data-key="' + key + '" data-id="' + id + '">Start</button>') + '</div>'; }).join('') +
      '<div class="routine"><div><div class="name">Other activity</div><div class="tiny muted">Swim, yoga class, bike at the gym, anything</div></div><button class="small" data-action="otherMove" data-key="' + key + '">Log</button></div></details>';
    h += '<label class="check"><input type="checkbox" data-action="pf" data-key="' + key + '"' + (d.pf ? ' checked' : '') + '> Pelvic floor practice done today</label>';
    if (state.ui.routine && state.ui.routine.key === key) h += routineHTML(state.ui.routine, c);
    return h;
  }
  function routineHTML(ro, c) {
    var r = BUMP.ROUTINES[ro.id], steps = BUMP.routineSteps(ro.id, c.trimester);
    return '<div class="sheet"><div class="row between"><h4>' + esc(r.name) + '</h4><button class="ghost small" data-action="closeRoutine">Close</button></div><p class="tiny muted">' + esc(r.desc) + '</p>' +
      steps.map(function (id, i) { var e = BUMP.EXERCISES[id]; var on = ro.done.indexOf(id) !== -1; return '<div class="step' + (on ? ' on' : '') + '"><button class="tick' + (on ? ' on' : '') + '" data-action="step" data-id="' + id + '">' + (on ? '✓' : (i + 1)) + '</button><div><div class="name">' + esc(e.name) + ' <span class="tiny muted">' + esc(e.dose) + '</span></div><details><summary>How and why</summary><p>' + esc(e.how) + '</p><p class="why">' + esc(e.why) + '</p></details></div></div>'; }).join('') +
      '<div class="row gap"><label class="inline">Minutes <input type="number" id="roMin" value="' + r.minutes + '" min="1" max="180"></label><button class="primary" data-action="finishRoutine">Done, log it</button></div></div>';
  }
  var QUICK = [["nausea", "Nausea"], ["fatigue", "Fatigue"], ["back", "Back pain"], ["pelvic", "Pelvic pain"], ["headache", "Headache"], ["swelling", "Swelling"], ["heartburn", "Heartburn"], ["constipation", "Constipation"], ["cramps", "Leg cramps"], ["mood", "Low mood"], ["bh", "Braxton Hicks"]];
  function quickSymHTML(d, key, c) {
    return '<div class="chips">' + QUICK.map(function (q) { var v = d.sym[q[0]] || 0; return '<button class="chip lvl' + v + '" data-action="symCycle" data-key="' + key + '" data-id="' + q[0] + '">' + q[1] + (v ? ' <b>' + ["", "mild", "mod", "severe"][v] + '</b>' : '') + '</button>'; }).join('') + '</div>' +
      '<div class="row gap wrap"><label class="inline">Sleep <input type="number" step="0.5" min="0" max="16" data-bind="sleepH" data-key="' + key + '" value="' + (d.sleepH == null ? '' : d.sleepH) + '" placeholder="h"> h</label>' +
      (c.week >= 28 ? '<label class="inline">Kicks <input type="number" min="0" max="200" data-bind="kicks" data-key="' + key + '" value="' + (d.kicks == null ? '' : d.kicks) + '" placeholder="10"> in <input type="number" min="1" max="240" data-bind="kicksMin" data-key="' + key + '" value="' + (d.kicksMin == null ? '' : d.kicksMin) + '" placeholder="min"> min</label>' : '') + '</div>' +
      '<p class="tiny muted">Tap a symptom to cycle none, mild, moderate, severe. Bleeding, fluid loss, reduced movement and blood pressure are in the full check-in.</p>';
  }

  /* ----- Log ----- */
  function logHTML() {
    var key = state.ui.logKey || todayKey(), c = ctxFor(key), d = day(key);
    var h = '<section class="card span"><div class="row between"><button class="ghost" data-action="logShift" data-n="-1" aria-label="previous day">' + BUMP.icon('left') + '</button><div class="center"><h2>' + fmtDate(key) + '</h2><div class="tiny muted">Week ' + c.week + ' + ' + c.day + (key === todayKey() ? ' · today' : '') + '</div></div><button class="ghost" data-action="logShift" data-n="1" aria-label="next day"' + (key >= todayKey() ? ' disabled' : '') + '>' + BUMP.icon('right') + '</button></div>' + (key !== todayKey() ? '<button class="ghost small" data-action="logToday">Jump to today</button>' : '') + '</section>';
    h += '<section class="card"><h3>Symptoms</h3>' + QUICK.map(function (q) { var v = d.sym[q[0]] || 0; return '<div class="symrow"><span>' + q[1] + '</span><div class="seg">' + ["None", "Mild", "Mod", "Severe"].map(function (l, i) { return '<button class="' + (v === i ? 'on' : '') + '" data-action="sym" data-key="' + key + '" data-id="' + q[0] + '" data-v="' + i + '">' + l + '</button>'; }).join('') + '</div></div>'; }).join('') +
      '<h4>Anything that needs a call</h4><div class="flags">' + [["bleeding", "Bleeding or spotting"], ["fluid", "Fluid leaking"], ["contractions", "Regular painful contractions"], ["visual", "Visual disturbance (flashing, blurring)"], ["ribPain", "Pain under the ribs on the right"], ["reducedMovement", "Baby moving less than usual" + (c.week < 24 ? " (from 24 weeks)" : "")]].map(function (f) { return '<label class="check"><input type="checkbox" data-action="flag" data-key="' + key + '" data-id="' + f[0] + '"' + (d.sym[f[0]] === true ? ' checked' : '') + '> ' + f[1] + '</label>'; }).join('') + '</div></section>';
    h += '<section class="card"><h3>Sleep and body</h3><div class="grid2">' +
      '<label>Sleep hours<input type="number" step="0.5" min="0" max="16" data-bind="sleepH" data-key="' + key + '" value="' + (d.sleepH == null ? '' : d.sleepH) + '"></label>' +
      '<label>Sleep quality<select data-bind="sleepQ" data-key="' + key + '"><option value="">—</option><option value="1"' + (d.sleepQ == 1 ? ' selected' : '') + '>Poor</option><option value="2"' + (d.sleepQ == 2 ? ' selected' : '') + '>OK</option><option value="3"' + (d.sleepQ == 3 ? ' selected' : '') + '>Good</option></select></label>' +
      '<label>Weight (kg)<input type="number" step="0.1" min="30" max="200" data-bind="weight" data-key="' + key + '" value="' + (d.weight == null ? '' : d.weight) + '" placeholder="weekly is plenty"></label>' +
      '<label>Blood pressure<div class="row gap"><input type="number" min="60" max="250" data-bind="bpS" data-key="' + key + '" value="' + (d.bp && d.bp.s ? d.bp.s : '') + '" placeholder="120"><span>/</span><input type="number" min="30" max="160" data-bind="bpD" data-key="' + key + '" value="' + (d.bp && d.bp.d ? d.bp.d : '') + '" placeholder="80"></div></label>' +
      (c.week >= 24 ? '<label>Kick count<input type="number" min="0" max="200" data-bind="kicks" data-key="' + key + '" value="' + (d.kicks == null ? '' : d.kicks) + '"></label><label>Over how many minutes<input type="number" min="1" max="240" data-bind="kicksMin" data-key="' + key + '" value="' + (d.kicksMin == null ? '' : d.kicksMin) + '"></label>' : '') +
      '</div><label>Notes<textarea data-bind="notes" data-key="' + key + '" rows="3" placeholder="Anything worth remembering: appointments, what helped, questions for your provider">' + esc(d.notes || '') + '</textarea></label></section>';
    h += '<section class="card"><h3>Supplements</h3>' + suppBoxesHTML(d, key) + '</section>';
    h += '<section class="card"><h3>Food targets</h3>' + foodTargetsHTML(d, key) + '</section>';
    h += '<section class="card"><h3>Movement</h3>' + movePlanHTML(d, key, c) + '</section>';
    h += '<section class="card span"><h3>Last 14 days</h3>' + historyHTML(key) + '</section>';
    return h;
  }
  function historyHTML(fromKey) {
    var rows = [];
    for (var i = 0; i < 14; i++) {
      var k = BUMP.shiftDate(todayKey(), -i), e = state.days[k];
      var supp = "·", food = "·", move = "·", back = "·", sleep = "·";
      if (e) {
        var tot = 0, got = 0; state.profile.supplements.forEach(function (s) { if (s.optional) return; tot += s.doses; got += ((e.supp || {})[s.id] || []).filter(Boolean).length; });
        supp = tot ? got + "/" + tot : "·";
        var hit = BUMP.FOOD_TARGETS.filter(function (t) { return ((e.nut || {})[t.id] || 0) >= t.count; }).length; food = hit + "/" + BUMP.FOOD_TARGETS.length;
        move = (e.move && e.move.length ? e.move.map(function (m) { return (BUMP.ROUTINES[m.id] || { name: m.name || "Other" }).name.split(" ")[0]; }).join(", ") : "") + (e.pf ? (e.move && e.move.length ? " + PF" : "PF") : "") || "·";
        back = e.sym && e.sym.back ? ["", "mild", "mod", "severe"][e.sym.back] : "·";
        sleep = e.sleepH != null ? e.sleepH + "h" : "·";
      }
      rows.push('<tr class="' + (k === fromKey ? 'cur' : '') + '" data-action="logGo" data-key="' + k + '"><td>' + fmtDate(k).replace(/,.*$/, '') + ' ' + k.slice(8) + '</td><td>' + supp + '</td><td>' + food + '</td><td>' + esc(move) + '</td><td>' + back + '</td><td>' + sleep + '</td></tr>');
    }
    return '<div class="tablewrap"><table><thead><tr><th>Day</th><th>Supps</th><th>Food</th><th>Move</th><th>Back</th><th>Sleep</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div><p class="tiny muted">Tap a row to edit that day.</p>';
  }

  /* ----- Learn ----- */
  function learnHTML() {
    var seg = state.ui.learn || "baby";
    var h = '<div class="segbar">' + [["baby", "Baby"], ["eat", "Eat"], ["move", "Move"]].map(function (s) { return '<button class="' + (seg === s[0] ? 'on' : '') + '" data-action="learnSeg" data-learn="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>';
    if (seg === "baby") h += learnBabyHTML();
    else if (seg === "eat") h += learnEatHTML();
    else h += learnMoveHTML();
    return h;
  }
  function learnBabyHTML() {
    var c = ctxFor(), wk = state.ui.learnWeek || Math.max(4, Math.min(42, c.week)), w = BUMP.weekInfo(wk);
    var chips = ''; for (var i = 4; i <= 42; i++) chips += '<button class="chip' + (i === wk ? ' on' : '') + (i === c.week ? ' now' : '') + '" data-action="learnWeek" data-w="' + i + '">' + i + '</button>';
    return '<div class="weekchips">' + chips + '</div>' +
      '<section class="card baby static"><div class="artwrap">' + BUMP.sizeArt(wk) + '</div><div><div class="eyebrow">Week ' + wk + (wk === c.week ? ' · this week' : '') + '</div><h2>' + esc(cap(w.size)) + '</h2><div class="tiny muted">' + fmtLen(w.len) + ' · ' + fmtWt(w.wt) + '</div></div></section>' +
      '<section class="card"><h3>Baby</h3><ul>' + w.baby.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><h3>You</h3><ul>' + w.you.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="card note"><div class="eyebrow">Worth knowing this week</div><p>' + esc(w.note) + '</p></section>' +
      '<section class="card"><h3>To do</h3><ul class="todo">' + w.todo.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>';
  }
  function learnEatHTML() {
    var c = ctxFor();
    var keys = Object.keys(BUMP.NUTRIENTS).sort(function (a, b) { var pa = BUMP.NUTRIENTS[a].peak.indexOf(c.trimester) !== -1 ? 0 : 1, pb = BUMP.NUTRIENTS[b].peak.indexOf(c.trimester) !== -1 ? 0 : 1; return pa - pb; });
    return '<section class="card"><h3>Nutrients, and why each one matters</h3><p class="tiny muted">Sorted with the ones that matter most in trimester ' + c.trimester + ' first.</p>' +
      keys.map(function (k) { var n = BUMP.NUTRIENTS[k]; return '<details class="nut"><summary><span>' + esc(n.name) + '</span>' + (n.peak.indexOf(c.trimester) !== -1 ? '<span class="tag">now</span>' : '') + '</summary><div class="tiny muted">' + esc(n.target) + '</div><p>' + esc(n.why) + '</p><div class="eyebrow">Vegetarian sources</div><ul>' + n.veg.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' + (n.meat.length ? '<div class="eyebrow">If you add meat or fish</div><ul>' + n.meat.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + '<p class="why">' + esc(n.tips) + '</p></details>'; }).join('') + '</section>' +
      '<section class="card"><h3>Vegetarian pregnancy, honestly</h3>' + BUMP.VEG_GUIDE.map(function (g) { return '<details><summary>' + esc(g.h) + '</summary><p>' + esc(g.p) + '</p></details>'; }).join('') + '</section>' +
      '<section class="card"><h3>Food safety</h3>' + BUMP.FOOD_SAFETY.map(function (g) { return '<details><summary>' + esc(g.title) + '</summary><ul>' + g.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></details>'; }).join('') + '</section>';
  }
  function learnMoveHTML() {
    var c = ctxFor();
    return '<section class="card"><h3>Routines</h3>' + Object.keys(BUMP.ROUTINES).map(function (id) { var r = BUMP.ROUTINES[id]; var steps = BUMP.routineSteps(id, c.trimester); return '<details class="nut"><summary><span>' + esc(r.name) + '</span><span class="tag">' + r.minutes + ' min</span></summary><p>' + esc(r.desc) + '</p>' + steps.map(function (sid) { var e = BUMP.EXERCISES[sid]; return '<div class="ex"><div class="name">' + esc(e.name) + ' <span class="tiny muted">' + esc(e.dose) + '</span></div><p>' + esc(e.how) + '</p><p class="why">' + esc(e.why) + '</p></div>'; }).join('') + '</details>'; }).join('') + '</section>' +
      '<section class="card"><h3>Weekly rhythm</h3><p class="tiny muted">Core and Floor most weekdays, strength three times, walks on the other days, Evening Unwind when you need it. Swap days freely.</p><table class="plan"><tbody>' + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function (n, i) { return '<tr><th>' + n + '</th><td>' + BUMP.MOVE_PLAN[i].map(function (id) { return esc(BUMP.ROUTINES[id].name); }).join(' · ') + '</td></tr>'; }).join('') + '</tbody></table></section>' +
      BUMP.MOVE_RULES.map(function (g) { return '<section class="card"><h3>' + esc(g.h) + '</h3><ul>' + g.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>'; }).join('');
  }

  /* ----- Coach ----- */
  function insightCard(i, compact) {
    return '<section class="card insight ' + i.level + (compact ? ' span' : '') + '"><div class="eyebrow">' + BUMP.icon({ urgent: "alert", attention: "flag", tip: "bulb", win: "check" }[i.level]) + { urgent: "Needs a call", attention: "Worth acting on", tip: "Worth knowing", win: "Going well" }[i.level] + '</div><h3>' + esc(i.title) + '</h3><p>' + esc(i.body) + '</p>' + (i.action ? '<div class="tiny act">' + esc(i.action) + '</div>' : '') + (compact ? '<button class="ghost small" data-action="goTab" data-tab="coach">All recommendations</button>' : '') + '</section>';
  }
  function coachHTML() {
    var c = ctxFor(); var insights = BUMP.generateInsights(c); c.insights = insights;
    var brief = BUMP.coach.brief(c, state.ui.question || "");
    var api = state.profile.api || {};
    var h = '<section class="card hero span"><h2>Coach</h2><p class="tiny muted">Recommendations below are built from what you have logged over the last two weeks, not just from how far along you are. They are general guidance; your provider knows you.</p></section>';
    h += insights.map(function (i) { return insightCard(i, false); }).join('');
    h += '<section class="card"><h3>Ask Claude</h3><p class="tiny muted">This bundles your last two weeks of logs, your context, and your question into one brief. Opening it in Claude uses your existing Claude account and costs nothing extra.</p>' +
      '<textarea id="question" rows="3" placeholder="Optional. For example: my back has been worse this week and I am not sleeping, what should I change? Or: build me a three-day vegetarian meal plan that hits iron and choline.">' + esc(state.ui.question || '') + '</textarea>' +
      '<div class="row gap wrap"><button class="primary" data-action="askOpen">' + BUMP.icon('external') + 'Open in Claude</button><button data-action="askCopy">' + BUMP.icon('copy') + 'Copy brief</button>' + (api.key ? '<button data-action="askApi">Ask here' + (state.ui.asking ? '…' : '') + '</button>' : '') + '</div>' +
      '<details><summary>See the brief Claude will get</summary><pre class="brief">' + esc(BUMP.coach.systemPrompt(c) + "\n\n---\n\n" + brief) + '</pre></details>' +
      '<details><summary>Paste an answer to keep it here</summary><textarea id="pasteAnswer" rows="4" placeholder="Paste Claude\'s reply"></textarea><button class="small" data-action="savePaste">Save answer</button></details>' +
      (api.key ? '' : '<p class="tiny muted">Want answers inside the app? Add an Anthropic API key in Settings. A question costs a few cents.</p>') + '</section>';
    if (state.ui.lastAnswer) h += '<section class="card answer"><div class="eyebrow">Claude, just now</div>' + md(state.ui.lastAnswer) + '</section>';
    if (state.coach.answers.length) h += '<section class="card"><h3>Saved answers</h3>' + state.coach.answers.slice(0, 10).map(function (a) { return '<details><summary>' + fmtDate(a.date) + ' · week ' + a.week + (a.q ? ' · ' + esc(a.q.slice(0, 60)) : '') + '</summary>' + md(a.a) + '<button class="ghost small" data-action="delAnswer" data-ts="' + a.ts + '">Delete</button></details>'; }).join('') + '</section>';
    return h;
  }
  function md(t) { // tiny markdown: paragraphs, bullets, bold
    return esc(t).split(/\n{2,}/).map(function (p) {
      if (/^(\s*([-*]|\d+\.)\s)/m.test(p)) return '<ul>' + p.split(/\n/).map(function (l) { return '<li>' + l.replace(/^\s*([-*]|\d+\.)\s*/, '') + '</li>'; }).join('') + '</ul>';
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }

  /* ----- Settings ----- */
  function settingsHTML() {
    var p = state.profile, g = p.gist || {}, api = p.api || {};
    var ms = [["firstVisit", "First prenatal visit"], ["nipt", "NIPT drawn"], ["ntScan", "11 to 14 week scan"], ["aspirin", "Low-dose aspirin discussed"], ["pelvicPT", "Pelvic floor physio assessment booked"], ["anatomy", "Anatomy scan"], ["glucose", "Glucose screen"], ["tdap", "Tdap vaccine"], ["rsv", "RSV vaccine (or not in season)"], ["monitoring", "Third-trimester monitoring plan discussed"], ["delivery", "Delivery timing discussed"], ["gbs", "GBS swab"], ["perineal", "Perineal massage started"], ["bag", "Bag packed, handover planned"]];
    return '<section class="card"><h2>You</h2><div class="grid2">' +
      '<label>Due date<input type="date" data-prof="dueDate" value="' + esc(p.dueDate) + '"></label>' +
      '<label>Name<input type="text" data-prof="name" value="' + esc(p.name) + '"></label>' +
      '<label>Age<input type="number" data-prof="age" value="' + esc(p.age) + '"></label>' +
      '<label>Diet<select data-prof="diet"><option' + (p.diet === "vegetarian" ? ' selected' : '') + '>vegetarian</option><option' + (p.diet === "vegetarian, open to fish" ? ' selected' : '') + '>vegetarian, open to fish</option><option' + (p.diet === "vegetarian, open to meat" ? ' selected' : '') + '>vegetarian, open to meat</option><option' + (p.diet === "omnivore" ? ' selected' : '') + '>omnivore</option><option' + (p.diet === "vegan" ? ' selected' : '') + '>vegan</option></select></label>' +
      '<label>Height (cm)<input type="number" data-prof="heightCm" value="' + esc(p.heightCm || '') + '"></label>' +
      '<label>Pre-pregnancy weight (kg)<input type="number" step="0.1" data-prof="prePregWeightKg" value="' + esc(p.prePregWeightKg || '') + '"></label></div>' +
      '<label>Background for the coach<textarea data-prof="notes" rows="3" placeholder="Anything Claude should know every time: history, conditions, medications, what your provider has said, your first birth">' + esc(p.notes || '') + '</textarea></label>' +
      '<p class="tiny muted">Height and pre-pregnancy weight are optional. If you add them, the coach can gently compare weight gain to the typical range.</p></section>' +
      '<section class="card"><h2>Supplements</h2>' + p.supplements.map(function (s, i) { return '<div class="supprow"><input type="text" data-supp="name" data-i="' + i + '" value="' + esc(s.name) + '"><input type="number" min="1" max="6" data-supp="doses" data-i="' + i + '" value="' + s.doses + '" title="doses a day"><label class="check tiny"><input type="checkbox" data-supp="optional" data-i="' + i + '"' + (s.optional ? ' checked' : '') + '> optional</label><button class="ghost small" data-action="delSupp" data-i="' + i + '" aria-label="remove">' + BUMP.icon('x') + '</button></div>'; }).join('') +
      '<button class="small" data-action="addSupp">' + BUMP.icon('plus') + 'Add a supplement</button><p class="tiny muted">Doses a day become tick boxes. Optional ones are not counted against you.</p></section>' +
      '<section class="card"><h2>Milestones</h2><p class="tiny muted">Tick these off and the coach stops reminding you.</p>' + ms.map(function (m) { return '<label class="check"><input type="checkbox" data-ms="' + m[0] + '"' + (p.milestones[m[0]] ? ' checked' : '') + '> ' + m[1] + '</label>'; }).join('') + '</section>' +
      '<section class="card"><h2>Do not lose your data</h2>' +
      '<h3>Move to the Home Screen app or another device</h3><p class="tiny">On iPhone, the Home Screen version of Bump keeps its own separate storage, so it starts empty. Tap Copy all data here, open the other copy, and paste it in on the welcome screen or below.</p>' +
      '<div class="row gap wrap"><button class="primary" data-action="copyData">' + BUMP.icon('copy') + 'Copy all data</button></div>' +
      '<details><summary>Paste data from another copy</summary><textarea id="pasteData" rows="3" placeholder="Paste here"></textarea><button class="small" data-action="pasteRestore">Restore pasted data</button></details>' +
      '<h3>Backup file</h3><div class="row gap wrap"><button data-action="export">' + BUMP.icon('download') + 'Download backup file</button><label class="btn">' + BUMP.icon('upload') + 'Restore from file<input type="file" accept="application/json" id="importFile" hidden></label></div>' +
      '<h3>Automatic cloud backup</h3><p class="tiny">Backs up to a private, encrypted Gist on your own GitHub account every time you log something, and pulls it back on any device you open this on. You already have a GitHub account because this app lives in it.</p>' +
      '<details' + (g.token ? '' : ' open') + '><summary>How to get a token (two minutes)</summary><ol class="tiny"><li>On GitHub, click your photo, then Settings, then Developer settings (bottom of the left menu).</li><li>Personal access tokens, then Fine-grained tokens, then Generate new token.</li><li>Name it Bump. Set expiration to the longest option or no expiration. Under Account permissions, set Gists to Read and write. Leave repository access as none.</li><li>Generate, copy the token, paste it below. It is stored only in this browser and is never uploaded.</li></ol></details>' +
      '<label>GitHub token<input type="password" data-gist="token" value="' + esc(g.token || '') + '" placeholder="github_pat_..."></label>' +
      '<label>Passphrase (encrypts the backup; use the same one on every device)<input type="password" data-gist="passphrase" value="' + esc(g.passphrase || '') + '" placeholder="something you will remember"></label>' +
      '<div class="row gap wrap"><button class="primary" data-action="syncNow">' + (g.id ? 'Sync now' : 'Connect and back up') + '</button>' + (g.token ? '<button class="ghost" data-action="disconnect">Disconnect</button>' : '') + '</div>' +
      '<p class="tiny muted">' + (g.lastSync ? 'Last backup ' + new Date(g.lastSync).toLocaleString() + '. ' : 'Not connected yet. ') + (syncStatus.state === 'err' ? 'Last error: ' + esc(syncStatus.msg) : '') + '</p></section>' +
      '<section class="card"><h2>Claude inside the app (optional)</h2><p class="tiny">Without this, the Coach opens your brief in claude.ai, which uses your existing account. With an API key from console.anthropic.com, you can get the answer right here. A typical question costs about 3 to 5 cents on Opus and under a cent on Haiku. The key stays in this browser only.</p>' +
      '<label>Anthropic API key<input type="password" data-api="key" value="' + esc(api.key || '') + '" placeholder="sk-ant-..."></label>' +
      '<label>Model<select data-api="model"><option value="claude-opus-5-5"' + ((api.model || "claude-opus-5-5") === "claude-opus-5-5" ? ' selected' : '') + '>Claude Opus 5.5 (best, a few cents)</option><option value="claude-sonnet-5-5"' + (api.model === "claude-sonnet-5-5" ? ' selected' : '') + '>Claude Sonnet 5.5</option><option value="claude-haiku-5-5"' + (api.model === "claude-haiku-5-5" ? ' selected' : '') + '>Claude Haiku 5.5 (cheapest)</option></select></label></section>' +
      '<section class="card"><h2>About</h2><p class="tiny">Bump is a personal tool. The information in it reflects mainstream guidance from bodies like ACOG, NICE, the Academy of Nutrition and Dietetics and pelvic health physiotherapy practice, written for one person\'s situation. It is not medical advice and cannot know your history. When in doubt, call your provider; when the app says call, call.</p>' +
      '<button class="ghost small danger" data-action="reset">Erase everything on this device</button></section>';
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-action]"); if (!el) return;
    var a = el.dataset.action, key = el.dataset.key;
    if (a === "goTab") { state.ui.tab = el.dataset.tab; persist({ quiet: true }); render(); }
    else if (a === "goLearn") { state.ui.tab = "learn"; state.ui.learn = el.dataset.learn; state.ui.learnWeek = null; persist({ quiet: true }); render(); }
    else if (a === "learnSeg") { state.ui.learn = el.dataset.learn; persist({ quiet: true }); render(); }
    else if (a === "learnWeek") { state.ui.learnWeek = +el.dataset.w; rerender(); }
    else if (a === "onboard") {
      var due = $("#obDue").value, lmp = $("#obLmp").value;
      if (!due && lmp) { var l = parseKey(lmp); due = BUMP.dateKey(new Date(l.getFullYear(), l.getMonth(), l.getDate() + 280)); }
      if (!due) return toast("Enter a due date or your last period date.", true);
      state.profile.dueDate = due; state.profile.name = $("#obName").value.trim(); touchProfile(); render();
    }
    else if (a === "supp") { var d = day(key), arr = d.supp[el.dataset.id] = d.supp[el.dataset.id] || []; arr[+el.dataset.i] = !arr[+el.dataset.i]; for (var i = 0; i < arr.length; i++) arr[i] = !!arr[i]; touchDay(key); rerender(); }
    else if (a === "nut") { var dd = day(key), t = BUMP.FOOD_TARGETS.find(function (x) { return x.id === el.dataset.id; }); dd.nut[t.id] = Math.min((dd.nut[t.id] || 0) + 1, t.count + 4); touchDay(key); rerender(); }
    else if (a === "nutMinus") { var d2 = day(key); d2.nut[el.dataset.id] = Math.max((d2.nut[el.dataset.id] || 0) - 1, 0); touchDay(key); rerender(); }
    else if (a === "symCycle") { var d3 = day(key); d3.sym[el.dataset.id] = ((d3.sym[el.dataset.id] || 0) + 1) % 4; touchDay(key); rerender(); }
    else if (a === "sym") { var d4 = day(key); d4.sym[el.dataset.id] = +el.dataset.v; touchDay(key); rerender(); }
    else if (a === "openRoutine") { state.ui.routine = { key: key, id: el.dataset.id, done: [] }; rerender(); setTimeout(function () { var s = $(".sheet"); if (s) s.scrollIntoView({ behavior: "smooth", block: "start" }); }, 30); }
    else if (a === "closeRoutine") { state.ui.routine = null; rerender(); }
    else if (a === "step") { var ro = state.ui.routine, ix = ro.done.indexOf(el.dataset.id); if (ix === -1) ro.done.push(el.dataset.id); else ro.done.splice(ix, 1); rerender(); }
    else if (a === "finishRoutine") { var ro2 = state.ui.routine, d5 = day(ro2.key); var min = parseInt(($("#roMin") || {}).value, 10) || BUMP.ROUTINES[ro2.id].minutes; d5.move.push({ id: ro2.id, min: min, steps: ro2.done.length }); if (ro2.id === "coreFloor") d5.pf = true; state.ui.routine = null; touchDay(ro2.key); toast("Logged. Nice work."); rerender(); }
    else if (a === "unmove") { var d6 = day(key); d6.move = d6.move.filter(function (m) { return m.id !== el.dataset.id; }); touchDay(key); rerender(); }
    else if (a === "otherMove") { var what = prompt("What did you do?", "Swim"); if (what === null) return; var mins = parseInt(prompt("How many minutes?", "30"), 10) || 30; day(key).move.push({ id: "other", name: what, min: mins }); touchDay(key); rerender(); }
    else if (a === "logShift") { var cur = state.ui.logKey || todayKey(); var nk = BUMP.shiftDate(cur, +el.dataset.n); if (nk > todayKey()) return; state.ui.logKey = nk; render(); }
    else if (a === "logToday") { state.ui.logKey = null; render(); }
    else if (a === "logGo") { state.ui.logKey = key; render(); }
    else if (a === "askOpen" || a === "askCopy" || a === "askApi") {
      state.ui.question = ($("#question") || {}).value || "";
      var c = ctxFor(); c.insights = BUMP.generateInsights(c);
      var brief = BUMP.coach.brief(c, state.ui.question), sys = BUMP.coach.systemPrompt(c);
      if (a === "askOpen") { BUMP.coach.openInClaude(sys + "\n\n---\n\n" + brief); toast("Opened in Claude. Paste the answer back here if you want to keep it."); }
      else if (a === "askCopy") { BUMP.coach.copy(sys + "\n\n---\n\n" + brief).then(function () { toast("Brief copied."); }); }
      else {
        if (state.ui.asking) return; state.ui.asking = true; rerender();
        BUMP.coach.ask(state.profile.api, sys, brief).then(function (ans) {
          state.ui.lastAnswer = ans; state.coach.answers.unshift({ ts: Date.now(), date: todayKey(), week: c.week, q: state.ui.question, a: ans }); state.coach.answers = state.coach.answers.slice(0, 50); persist();
        }).catch(function (e) { toast(e.message, true); }).then(function () { state.ui.asking = false; rerender(); });
      }
    }
    else if (a === "savePaste") { var txt = ($("#pasteAnswer") || {}).value || ""; if (!txt.trim()) return; var c2 = ctxFor(); state.coach.answers.unshift({ ts: Date.now(), date: todayKey(), week: c2.week, q: state.ui.question || "", a: txt.trim() }); persist(); toast("Saved."); rerender(); }
    else if (a === "delAnswer") { state.coach.answers = state.coach.answers.filter(function (x) { return String(x.ts) !== el.dataset.ts; }); persist(); rerender(); }
    else if (a === "addSupp") { state.profile.supplements.push({ id: uid(), name: "New supplement", doses: 1, optional: true }); touchProfile(); rerender(); }
    else if (a === "delSupp") { if (!confirm("Remove this supplement from the list? Past ticks stay in your history.")) return; state.profile.supplements.splice(+el.dataset.i, 1); touchProfile(); rerender(); }
    else if (a === "export") { BUMP.store.exportJSON(state); }
    else if (a === "copyData") { var copy = JSON.parse(JSON.stringify(state)); delete copy.ui; BUMP.coach.copy("BUMP1:" + btoa(unescape(encodeURIComponent(JSON.stringify(copy))))).then(function () { toast("Copied. Now open the other copy of Bump and paste it in."); }, function () { toast("Could not copy. Use Download backup file instead.", true); }); }
    else if (a === "pasteRestore") {
      var raw = (($("#pasteData") || {}).value || "").trim();
      if (!raw) return toast("Paste the copied data first.", true);
      try {
        var json = raw.indexOf("BUMP1:") === 0 ? decodeURIComponent(escape(atob(raw.slice(6).replace(/\s+/g, "")))) : raw;
        var data = JSON.parse(json);
        if (!data || !data.days || !data.profile) throw new Error("bad");
        var merged = BUMP.store.merge(state, data);
        state.days = merged.days; state.profile = merged.profile; state.coach = merged.coach; state.profileUpdatedAt = merged.profileUpdatedAt;
        if (!state.profile.dueDate && data.profile.dueDate) state.profile.dueDate = data.profile.dueDate;
        state.ui.tab = "today"; persist(); toast("Restored. Welcome back."); render();
      } catch (e) { toast("That does not look like Bump data. Copy it again from the other app.", true); }
    }
    else if (a === "syncNow") { if (!state.profile.gist.token) return toast("Paste a GitHub token first.", true); var t = state.profile.gist.token; (state.profile.gist.id ? Promise.resolve(state.profile.gist.id) : BUMP.store.gistFind(t)).then(function (id) { if (id) state.profile.gist.id = id; return syncNow(true); }).catch(function (e) { toast("Could not reach GitHub: " + e.message, true); }); }
    else if (a === "disconnect") { if (!confirm("Stop backing up to GitHub? Your data stays on this device and the Gist stays on GitHub.")) return; state.profile.gist = {}; persist({ quiet: true }); render(); }
    else if (a === "reset") { if (!confirm("Erase all Bump data on this device? If you have a backup it can be restored.")) return; localStorage.removeItem("bump.v1"); location.reload(); }
  });

  document.addEventListener("change", function (ev) {
    var el = ev.target;
    if (el.id === "importFile" && el.files[0]) {
      BUMP.store.importJSON(el.files[0]).then(function (data) {
        if (!data || !data.days) throw new Error("That file is not a Bump backup.");
        var merged = BUMP.store.merge(state, data);
        state.days = merged.days; state.profile = merged.profile; state.coach = merged.coach; state.profileUpdatedAt = merged.profileUpdatedAt;
        persist(); toast("Restored."); render();
      }).catch(function (e) { toast(e.message, true); });
      return;
    }
    if (el.dataset.action === "pf") { day(el.dataset.key).pf = el.checked; touchDay(el.dataset.key); return; }
    if (el.dataset.action === "flag") { var d = day(el.dataset.key); if (el.checked) d.sym[el.dataset.id] = true; else delete d.sym[el.dataset.id]; touchDay(el.dataset.key); if (el.checked) { state.ui.tab = "coach"; render(); } return; }
    if (el.dataset.ms) { state.profile.milestones[el.dataset.ms] = el.checked; touchProfile(); return; }
    if (el.dataset.supp !== undefined) { var s = state.profile.supplements[+el.dataset.i]; if (!s) return; if (el.dataset.supp === "optional") s.optional = el.checked; else if (el.dataset.supp === "doses") s.doses = Math.max(1, Math.min(6, parseInt(el.value, 10) || 1)); else s.name = el.value; touchProfile(); return; }
    if (el.dataset.prof) { var v = el.value; if (["age", "heightCm", "prePregWeightKg"].indexOf(el.dataset.prof) !== -1) v = v === "" ? null : +v; state.profile[el.dataset.prof] = v; touchProfile(); if (el.dataset.prof === "dueDate") toast("Due date saved."); return; }
    if (el.dataset.gist) { state.profile.gist[el.dataset.gist] = el.value.trim(); persist({ quiet: true }); return; }
    if (el.dataset.api) { state.profile.api[el.dataset.api] = el.value.trim(); persist({ quiet: true }); return; }
    if (el.dataset.bind) { bindValue(el); }
  });
  document.addEventListener("input", function (ev) { var el = ev.target; if (el.dataset.bind && el.tagName !== "TEXTAREA") bindValue(el); if (el.id === "question") state.ui.question = el.value; });
  function bindValue(el) {
    var d = day(el.dataset.key), f = el.dataset.bind, v = el.value;
    if (f === "notes") d.notes = v;
    else if (f === "bpS" || f === "bpD") { d.bp = d.bp || {}; d.bp[f === "bpS" ? "s" : "d"] = v === "" ? null : +v; }
    else d[f] = v === "" ? null : +v;
    touchDay(el.dataset.key);
  }

  /* ---------------- boot ---------------- */
  $$(".tabbar button").forEach(function (b) { b.addEventListener("click", function () { state.ui.tab = b.dataset.tab; state.ui.routine = null; persist({ quiet: true }); render(); }); });
  $("#gear").addEventListener("click", function () { state.ui.tab = "settings"; persist({ quiet: true }); render(); });
  if (!state.profile.dueDate) state.ui.tab = "today";
  render();
  if (state.profile.gist.token) syncNow(false).then(render);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
