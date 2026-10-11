/* The intelligence loop. Builds a compact, honest brief from the logs and either
   1. opens it in claude.ai (uses the existing Claude subscription, no API cost), or
   2. if an API key has been added in Settings, asks Claude directly from the app. */
window.BUMP = window.BUMP || {};
(function () {
  var C = BUMP.coach = {};

  C.systemPrompt = function (ctx) {
    return "You are a careful, warm perinatal coach combining the knowledge of an obstetrician, a registered dietitian specialising in vegetarian pregnancy, and a pelvic health physiotherapist. " +
      "You are advising a " + (ctx.profile.age || 39) + "-year-old in her second pregnancy, currently " + ctx.week + " weeks and " + ctx.day + " days, due " + ctx.profile.dueDate + ". " +
      "She is vegetarian but open to eating meat or fish if there is a clear benefit. In her first pregnancy her lower back became very sore by the end, and she feels her core and pelvic floor never fully recovered. " +
      "She takes a prenatal split into three doses and an algal DHA split into two, with magnesium sometimes. " +
      "Give specific, prioritised, evidence-based recommendations grounded in what she has actually logged, not generic advice for her week. Say what to do, why it matters physiologically, and how to fit it into a day with a toddler. " +
      "Flag anything that needs her provider and be plain about it. Use short paragraphs or a short numbered list. No em dashes. Be honest about uncertainty. Keep it under 400 words unless she asks for more.";
  };

  C.brief = function (ctx, question) {
    var days = ctx.days, lines = [];
    var sympNames = { nausea: "nausea", fatigue: "fatigue", back: "back pain", pelvic: "pelvic/pubic pain", headache: "headache", swelling: "swelling", heartburn: "heartburn", constipation: "constipation", cramps: "leg cramps", mood: "low mood/anxiety", bh: "Braxton Hicks" };
    lines.push("Week " + ctx.week + "+" + ctx.day + " (trimester " + ctx.trimester + "), due " + ctx.profile.dueDate + ". Age " + (ctx.profile.age || 39) + ". Second pregnancy. Diet: " + (ctx.profile.diet || "vegetarian") + ".");
    if (ctx.profile.notes) lines.push("Background: " + ctx.profile.notes);
    var supps = (ctx.profile.supplements || []).map(function (s) { return s.name + " x" + s.doses + (s.optional ? " (optional)" : ""); }).join(", ");
    lines.push("Supplements: " + supps + ". Adherence last 7 days: " + (ctx.suppAdherence === null || ctx.suppAdherence === undefined ? "not enough data" : ctx.suppAdherence + "%") + ".");
    lines.push("");
    lines.push("Last 14 days (newest first):");
    var any = false;
    for (var i = 0; i < 14; i++) {
      var k = BUMP.shiftDate(ctx.todayKey, -i), e = days[k];
      if (!e) continue;
      any = true;
      var parts = [];
      var sym = e.sym || {};
      var s = Object.keys(sym).filter(function (id) { return typeof sym[id] === "number" && sym[id] >= 1 && sympNames[id]; }).map(function (id) { return sympNames[id] + " " + sym[id] + "/3"; });
      Object.keys(sym).filter(function (id) { return sym[id] === true; }).forEach(function (id) { s.push(id); });
      if (s.length) parts.push("symptoms: " + s.join(", "));
      if (typeof e.sleepH === "number") parts.push("sleep " + e.sleepH + "h" + (e.sleepQ ? " q" + e.sleepQ + "/3" : ""));
      var n = e.nut || {};
      var nt = Object.keys(n).filter(function (id) { return n[id]; }).map(function (id) { return id + " " + n[id]; });
      if (nt.length) parts.push("food targets: " + nt.join(", "));
      var sp = e.supp || {};
      var taken = Object.keys(sp).map(function (id) { var def = (ctx.profile.supplements || []).find(function (x) { return x.id === id; }); return (def ? def.name : id) + " " + sp[id].filter(Boolean).length + "/" + sp[id].length; });
      if (taken.length) parts.push("supplements: " + taken.join(", "));
      if (e.move && e.move.length) parts.push("movement: " + e.move.map(function (m) { return (BUMP.ROUTINES[m.id] ? BUMP.ROUTINES[m.id].name : m.id) + (m.min ? " " + m.min + "min" : ""); }).join(", "));
      if (e.pf) parts.push("pelvic floor done");
      if (e.weight) parts.push("weight " + e.weight + "kg");
      if (e.bp && e.bp.s) parts.push("BP " + e.bp.s + "/" + e.bp.d);
      if (typeof e.kicks === "number") parts.push("kicks " + e.kicks + (e.kicksMin ? " in " + e.kicksMin + "min" : ""));
      if (e.notes) parts.push("note: " + e.notes.replace(/\s+/g, " ").slice(0, 200));
      if (parts.length) lines.push(k + ": " + parts.join("; "));
    }
    if (!any) lines.push("(nothing logged yet)");
    if (ctx.weight) lines.push("Weight gained so far " + ctx.weight.gained.toFixed(1) + " kg (typical total range " + ctx.weight.total[0] + " to " + ctx.weight.total[1] + " kg).");
    var ins = (ctx.insights || []).slice(0, 6).map(function (x) { return "[" + x.level + "] " + x.title; });
    if (ins.length) { lines.push(""); lines.push("The app's own rule-based flags right now: " + ins.join("; ") + "."); }
    lines.push("");
    lines.push("Question: " + (question && question.trim() ? question.trim() : "Based on this, what are the three most useful things for me to focus on in the next week, and is anything here worth raising with my provider?"));
    return lines.join("\n");
  };

  C.openInClaude = function (text) {
    var url = "https://claude.ai/new?q=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
  };

  C.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } finally { ta.remove(); }
    return Promise.resolve();
  };

  /* Direct API call from the browser. Requires the person's own key, stored
     only in this browser. Costs a few cents per question on Opus 5.5 and a
     fraction of a cent on Haiku 5.5. */
  C.ask = function (api, system, brief) {
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": api.key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: api.model || "claude-opus-5-5",
        max_tokens: 2000,
        system: system,
        messages: [{ role: "user", content: brief }]
      })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error((j.error && j.error.message) || ("HTTP " + r.status)); return j; }); })
      .then(function (j) {
        if (j.stop_reason === "refusal") throw new Error("Claude declined to answer this one. Try rephrasing, or open it in claude.ai instead.");
        return (j.content || []).filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("\n").trim();
      });
  };
})();
