/* The recommendation engine. Reads what has actually been logged and returns
   ranked cards. Levels: urgent (call someone), attention (do something today),
   tip (worth knowing), win (keep going). Everything here is general guidance
   and does not replace the person's own provider. */
window.BUMP = window.BUMP || {};

BUMP.generateInsights = function (ctx) {
  var out = [];
  var week = ctx.week, tri = ctx.trimester, days = ctx.days, todayKey = ctx.todayKey, profile = ctx.profile;
  var last = function (n) { // entries for the last n days including today, newest first
    var arr = [];
    for (var i = 0; i < n; i++) {
      var k = BUMP.shiftDate(todayKey, -i);
      arr.push({ key: k, e: days[k] || null });
    }
    return arr;
  };
  var l7 = last(7), l3 = last(3), l14 = last(14);
  var today = days[todayKey] || {};
  var sym = function (e, id) { return e && e.sym && typeof e.sym[id] === "number" ? e.sym[id] : 0; };
  var flag = function (e, id) { return !!(e && e.sym && e.sym[id] === true); };
  var countDays = function (list, fn) { return list.filter(function (d) { return d.e && fn(d.e); }).length; };
  var avg = function (list, fn) { var v = list.map(function (d) { return d.e ? fn(d.e) : null; }).filter(function (x) { return typeof x === "number" && !isNaN(x); }); return v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : null; };
  var add = function (level, id, title, body, action) { out.push({ level: level, id: id, title: title, body: body, action: action || null }); };
  var bp = today.bp || {};
  var loggedDays7 = countDays(l7, function () { return true; });

  /* ---------- Red flags first ---------- */
  if (flag(today, "bleeding")) add("urgent", "bleeding", "Bleeding logged today", "Spotting can be harmless, but bleeding like a period, bleeding with pain, or any bleeding after 20 weeks needs a same-day call to your provider or labour ward. Note the amount and colour.", "Call your provider now");
  if (flag(today, "fluid")) add("urgent", "fluid", "Fluid leaking logged", "If you suspect your waters have broken, call now regardless of the week. Note the time, colour and amount. Do not use tampons or have a bath.", "Call now");
  if (week >= 28 && flag(today, "reducedMovement")) add("urgent", "movement", "Reduced movement logged", "A change in your baby's normal pattern is a reason to call the maternity unit straight away, at any hour. Do not wait until tomorrow, do not rely on a home doppler, and do not try to provoke movement with sugar first. They would much rather check you.", "Call the maternity unit now");
  if (bp.s >= 160 || bp.d >= 110) add("urgent", "bp-severe", "Blood pressure " + bp.s + "/" + bp.d + " is in the severe range", "A reading of 160/110 or above needs urgent assessment today, even if you feel fine. Recheck after five minutes sitting quietly; if it is still high, go in.", "Go to maternity assessment today");
  else if (bp.s >= 140 || bp.d >= 90) add("urgent", "bp-high", "Blood pressure " + bp.s + "/" + bp.d + " is above 140/90", "This is the threshold for pregnancy hypertension. Recheck after five minutes of rest. If it stays at or above 140/90, call your provider today, especially with any headache, visual changes, upper abdominal pain or sudden swelling.", "Recheck, then call");
  var preeclampsiaSigns = (week >= 20) && ((sym(today, "headache") >= 2 && sym(today, "swelling") >= 2) || flag(today, "visual") || (sym(today, "headache") >= 2 && flag(today, "ribPain")));
  if (preeclampsiaSigns) add("urgent", "pet", "Headache with swelling, visual changes or upper abdominal pain", "Together these can be early signs of preeclampsia, which is more common over 35. Call your provider today. If you have a cuff, check your blood pressure now and tell them the reading.", "Call today");
  if (sym(today, "nausea") >= 3 && countDays(l3, function (e) { return sym(e, "nausea") >= 3; }) >= 2) add("urgent", "hg", "Severe nausea for several days", "If you cannot keep fluids down for 24 hours, are dizzy, or have dark urine, call. Hyperemesis is treatable and IV fluids plus anti-sickness medication early prevents a miserable spiral. B6 plus doxylamine is the safe first-line option; ask about it.", "Call your provider");
  if (flag(today, "contractions") && week < 37) add("urgent", "preterm", "Regular contractions before 37 weeks", "Painful, regular tightenings before 37 weeks, especially more than four an hour, need assessment. Drink two glasses of water, lie on your left side and call.", "Call now");

  /* ---------- Supplements ---------- */
  var supps = profile.supplements || [];
  var reqSupps = supps.filter(function (s) { return !s.optional; });
  if (reqSupps.length) {
    var totalDoses = 0, taken = 0, dayCount = 0;
    l7.forEach(function (d) {
      if (!d.e) return; dayCount++;
      reqSupps.forEach(function (s) { totalDoses += s.doses; var arr = (d.e.supp && d.e.supp[s.id]) || []; taken += arr.filter(Boolean).length; });
    });
    var pct = totalDoses ? Math.round(100 * taken / totalDoses) : null;
    ctx.suppAdherence = pct;
    if (pct !== null && dayCount >= 3) {
      if (pct < 70) add("attention", "supp-low", "Supplements at " + pct + "% this week", "Your prenatal is the safety net under the whole nutrition plan (folate, iodine, B12, iron, vitamin D), and DHA matters most in the third trimester. Splitting doses makes it easy to drop one. Try anchoring each dose to a meal you never skip, or keep a dose by your toothbrush.", "Set a routine for each dose");
      else if (pct >= 90) add("win", "supp-great", "Supplements at " + pct + "% this week", "That consistency is doing more for the baby than any single food choice. Keep it going.");
    }
    var dhaS = supps.find(function (s) { return /dha|omega|fish|algal/i.test(s.name); });
    if (dhaS && tri === 3 && dayCount >= 3) {
      var dhaTotal = 0, dhaTaken = 0;
      l7.forEach(function (d) { if (!d.e) return; dhaTotal += dhaS.doses; dhaTaken += ((d.e.supp && d.e.supp[dhaS.id]) || []).filter(Boolean).length; });
      if (dhaTotal && dhaTaken / dhaTotal < 0.7) add("attention", "dha-tri3", "DHA matters most right now", "Weeks 28 to 40 are when the baby's brain takes up DHA fastest. Your DHA doses were under 70% this week. Pair them with a meal that has some fat (eggs, nut butter, avocado) and they absorb better and are easier to remember.");
    }
  }

  /* ---------- Symptoms, with the why ---------- */
  var backDays = countDays(l7, function (e) { return sym(e, "back") >= 2; });
  if (backDays >= 3) add("attention", "back", "Back pain on " + backDays + " of the last 7 days", "This is the pattern from your first pregnancy starting early. The fix is strength, not rest: glute bridges, clams and hip hinges switch the glutes back on so the lumbar spine stops doing their job. Do the Back Relief routine today and the Core and Floor routine most days. Change position every 30 minutes if you sit for work. If pain is one-sided at the buttock or at the pubic bone, that is pelvic girdle pain and a pelvic physiotherapist is the right call.", "Do Back Relief today");
  else if (sym(today, "back") >= 2) add("tip", "back-today", "Sore back today", "Try the Back Relief routine (12 minutes) and a wide-knee child's pose before bed. Heat on the lower back is fine; avoid lying flat on your back after 20 weeks.", "Open Back Relief");
  var pfDays = countDays(l7, function (e) { return e.pf; });
  var moveDays = countDays(l7, function (e) { return e.move && e.move.length; });
  if (loggedDays7 >= 4 && pfDays <= 2) add("attention", "pf", "Pelvic floor work only " + pfDays + " days this week", "You said your floor and core never fully came back after your first. Daily practice of the lifts and the let-go, ten minutes, is what changes that. Have you booked a pelvic floor physio assessment? One session tells you whether yours is weak, tight or both, which changes the plan.", "Do Core and Floor today");
  if (loggedDays7 >= 5 && moveDays <= 1) add("attention", "move-low", "Movement logged on " + moveDays + " of 7 days", "Regular movement in pregnancy reduces gestational diabetes risk by roughly 30%, lowers the chance of preeclampsia, improves sleep and shortens labour on average. It does not need to be a workout: a 20-minute walk after dinner counts and is the single best thing for blood sugar.", "Walk after your next meal");
  if (moveDays >= 5) add("win", "move-great", "Moved on " + moveDays + " of the last 7 days", "That is above the recommended 150 minutes a week for most people. Your back and your blood sugar are both thanking you.");
  if (countDays(l7, function (e) { return sym(e, "constipation") >= 2; }) >= 3) add("attention", "constipation", "Constipation most of this week", "Progesterone slows the gut and iron supplements slow it further. Stack the fixes: 28 g of fibre (lentils, chia, pears, prunes, two kiwis), 10 cups of fluid, a daily walk, and magnesium citrate at night (200 to 300 mg) is the form that helps here. If you take a separate iron tablet, every other day dosing absorbs just as well and is gentler.", "Add magnesium citrate tonight");
  if (countDays(l7, function (e) { return sym(e, "cramps") >= 2; }) >= 2) add("tip", "cramps", "Leg cramps this week", "Magnesium glycinate at night (200 to 400 mg), calf stretches before bed, staying hydrated and enough potassium (potato, banana, beans) are the evidence-based options. Cramps peak in the third trimester and usually ease after birth.", "Calf stretch tonight");
  if (countDays(l7, function (e) { return sym(e, "heartburn") >= 2; }) >= 3) add("tip", "heartburn", "Heartburn on several days", "Smaller meals, nothing within two hours of lying down, head of the bed raised, and avoiding your personal triggers (often tomato, chocolate, spicy, fatty). Calcium carbonate antacids are safe and count toward calcium; take them two hours away from your prenatal so they do not block iron. If it is daily and disruptive, ask about a safe acid reducer.");
  var sleepAvg = avg(l7, function (e) { return e.sleepH; });
  if (sleepAvg !== null && sleepAvg < 6.5 && loggedDays7 >= 3) add("attention", "sleep", "Averaging " + sleepAvg.toFixed(1) + " hours of sleep", "Short sleep in pregnancy is linked to higher blood pressure, gestational diabetes and longer labour. Things that help: left side with a pillow between the knees and under the belly, magnesium glycinate at night, no screens in bed, a protein snack before bed to prevent 3am hunger, and the Evening Unwind routine. If snoring or gasping started in pregnancy, mention it; sleep apnoea is under-diagnosed and treatable.", "Try Evening Unwind tonight");
  if (sleepAvg !== null && sleepAvg >= 7.5 && loggedDays7 >= 4) add("win", "sleep-good", "Sleeping " + sleepAvg.toFixed(1) + " hours on average", "Good sleep is a genuine protective factor against pregnancy hypertension. Protect it.");
  var waterAvg = avg(l7, function (e) { return e.nut && typeof e.nut.water === "number" ? e.nut.water : null; });
  if (waterAvg !== null && waterAvg < 6 && loggedDays7 >= 3) add("tip", "water", "About " + Math.round(waterAvg) + " cups of water a day this week", "Target is about 10 cups of fluid. Dehydration causes Braxton Hicks, headaches, constipation and dizziness. A bottle you refill three times is easier than counting.");
  if (countDays(l7, function (e) { return sym(e, "nausea") >= 2; }) >= 4 && tri === 1) add("tip", "nausea", "Nausea most days", "Normal in the first trimester but worth managing: eat every two to three hours, protein before bed, ginger (tea, chews, 250 mg capsules), take the prenatal at night with food, and ask about vitamin B6 10 to 25 mg three times a day. Cold foods smell less. If vomiting is frequent, B6 plus doxylamine is safe and effective.");
  var moodDays = countDays(l7, function (e) { return sym(e, "mood") >= 2; });
  if (moodDays >= 4) add("attention", "mood", "Low mood or anxiety on " + moodDays + " of 7 days", "One in seven people experience anxiety or depression during pregnancy, and it is more likely with sleep disruption and a demanding first child at home. It is as treatable in pregnancy as at any other time. Tell your provider or midwife; talking therapies and some medications are safe. Daylight, movement and protected sleep help but are not a substitute for support.", "Mention this at your next visit");
  if (sym(today, "swelling") >= 2 && week >= 20 && !preeclampsiaSigns) add("tip", "swelling", "Swelling logged today", "End-of-day swelling in feet and ankles is normal. Elevate, compression socks, and keep salt normal (restricting it does not help). Sudden swelling of face or hands, or swelling with headache, is different and needs a same-day call.");
  var rlp = sym(today, "pelvic");
  if (rlp >= 2) add("tip", "pelvic", "Pelvic or pubic pain today", "Pain at the pubic bone or one side of the pelvis when walking, turning in bed or on one leg is pelvic girdle pain, not back pain. Narrow your stance, keep knees together when rolling and getting out of the car, skip single-leg exercises, and see a pelvic physiotherapist. A support belt often helps a lot.");

  /* ---------- Food targets ---------- */
  var ironDays = countDays(l7, function (e) { return e.nut && e.nut.iron >= 2; });
  if (loggedDays7 >= 4 && ironDays <= 2 && tri >= 2) add("attention", "iron-food", "Iron-rich meals logged on " + ironDays + " of 7 days", "From the second trimester your iron need nearly doubles and plant iron absorbs at a fraction of meat iron. Two iron-focused meals a day with vitamin C (lentils with lemon, tofu with peppers, fortified oats with strawberries), coffee and tea an hour away, and a ferritin check if you have not had one. Low ferritin is the most common reason a vegetarian pregnancy feels exhausting.", "Plan tomorrow's iron meals");
  var cholDays = countDays(l7, function (e) { return e.nut && e.nut.choline >= 1; });
  if (loggedDays7 >= 4 && cholDays <= 2) add("tip", "choline", "Choline source on only " + cholDays + " days", "Most prenatals contain little choline and vegetarian diets run low. Two eggs a day is the simplest fix. If you do not eat eggs, soy, quinoa and cruciferous vegetables help, and a 250 to 350 mg choline supplement is cheap and reasonable.");
  var protDays = countDays(l7, function (e) { return e.nut && e.nut.protein >= 3; });
  if (loggedDays7 >= 4 && protDays <= 2) add("tip", "protein", "Protein at all three meals on " + protDays + " days", "Breakfast is almost always the gap. Greek yogurt, eggs, tofu scramble or a protein smoothie gets 20 to 30 g in before the day starts and steadies blood sugar and nausea.");
  var fullDays = countDays(l7, function (e) { return e.nut && e.nut.veg >= 4 && e.nut.protein >= 3 && e.nut.calcium >= 3; });
  if (fullDays >= 4) add("win", "food-great", "Hit the main food targets on " + fullDays + " days", "Vegetables, protein and calcium all on target most of the week. That is the foundation.");

  /* ---------- Weight trend (only if logged, and gently) ---------- */
  var weights = [];
  Object.keys(days).sort().forEach(function (k) { if (days[k].weight) weights.push({ k: k, w: days[k].weight }); });
  if (weights.length >= 2 && profile.prePregWeightKg && profile.heightCm) {
    var bmi = profile.prePregWeightKg / Math.pow(profile.heightCm / 100, 2);
    var gained = weights[weights.length - 1].w - profile.prePregWeightKg;
    var range = bmi < 18.5 ? [12.5, 18] : bmi < 25 ? [11.5, 16] : bmi < 30 ? [7, 11.5] : [5, 9];
    var ratePerWk = bmi < 25 ? 0.45 : bmi < 30 ? 0.3 : 0.22;
    var expected = week <= 13 ? [0.5, 2] : [0.5 + ratePerWk * (week - 13) * 0.7, 2 + ratePerWk * (week - 13) * 1.3];
    ctx.weight = { gained: gained, total: range, expected: expected };
    if (week > 16 && gained < expected[0] - 2) add("tip", "wt-low", "Weight gain is a little under the typical range", "Total gained: " + gained.toFixed(1) + " kg; typical by now is roughly " + expected[0].toFixed(1) + " to " + expected[1].toFixed(1) + " kg. This is not a problem if the baby is growing well on scans, but it is worth mentioning. Nausea, aversions or just busyness with a first child can suppress intake. Energy-dense snacks (nut butter, avocado, full-fat dairy, smoothies) help.");
    else if (week > 16 && gained > expected[1] + 3) add("tip", "wt-high", "Weight gain is running ahead of the typical range", "Total gained: " + gained.toFixed(1) + " kg; typical by now is roughly " + expected[0].toFixed(1) + " to " + expected[1].toFixed(1) + " kg. Fluid retention can account for some of this. Not a reason to restrict, but protein and fibre with each carbohydrate, a walk after meals and watching liquid calories keeps blood sugar steadier, which matters more over 35. Sudden rapid gain with swelling should be checked.");
  }

  /* ---------- Kick counts ---------- */
  if (week >= 28) {
    var kickDays = countDays(l7, function (e) { return typeof e.kicks === "number"; });
    if (loggedDays7 >= 4 && kickDays <= 2) add("attention", "kicks", "Kick counts logged on " + kickDays + " of 7 days", "From 28 weeks, a daily count at a consistent time is the single best early-warning tool you have, and it matters more with maternal age over 35. Lie on your left side after a meal and count distinct movements; note how long it takes to reach ten. The real signal is a change from your baby's normal.", "Count tonight");
    if (typeof today.kicks === "number" && today.kicks < 10 && !flag(today, "reducedMovement")) add("attention", "kicks-low", "Fewer than 10 movements logged today", "If that count was over two hours of focused attention on your left side, call the maternity unit now. If it was a shorter window, have a snack, lie on your left side and count again for up to two hours. Fewer than ten, or a clear change from normal, means call.");
  }

  /* ---------- Week-based (dynamic to what has been done) ---------- */
  var done = profile.milestones || {};
  var ms = function (id, from, to, level, title, body) { if (week >= from && week <= to && !done[id]) add(level, "ms-" + id, title, body, "Mark done in Settings when complete"); };
  ms("firstVisit", 6, 11, "tip", "First prenatal visit", "Usually at 8 to 10 weeks. Bring your questions: NIPT, low-dose aspirin, exercise clearance, pelvic floor physio referral, baseline bloods including ferritin, vitamin D and thyroid.");
  ms("nipt", 10, 14, "tip", "Cell-free DNA screening (NIPT) window", "Can be drawn from 10 weeks. Highly accurate screen for trisomies 21, 18 and 13. Often recommended over 35, and often covered. It is a screen; a positive result is followed by a diagnostic test.");
  ms("ntScan", 11, 14, "tip", "11 to 14 week scan", "Nuchal translucency and early anatomy. Confirms dates, checks for twins, and gives an early look at the heart and brain.");
  ms("aspirin", 11, 16, "attention", "Ask about low-dose aspirin", "81 mg a day from 12 to 16 weeks reduces preeclampsia risk by about a quarter in people with risk factors. Age 35 and over counts as a moderate risk factor; combined with any other (BMI over 30, family history, more than ten years since your last pregnancy, IVF, a first-degree relative with preeclampsia), it is generally recommended. Ask specifically.");
  ms("pelvicPT", 12, 24, "attention", "Book a pelvic floor physiotherapy assessment", "Given your history, one session in the second trimester is the highest-value appointment you can make. They assess strength and tension, check for diastasis, and give you a plan for pregnancy, birth and recovery.");
  ms("anatomy", 18, 22, "tip", "Anatomy scan window", "The detailed 18 to 22 week scan. Ask about placenta position and whether cervical length was measured.");
  ms("glucose", 24, 28, "tip", "Glucose screen window", "Between 24 and 28 weeks. Risk is slightly higher over 35. Do not change your diet before the test; just do the test as instructed.");
  ms("tdap", 27, 36, "attention", "Tdap vaccine", "Between 27 and 36 weeks, every pregnancy. Passes whooping cough antibodies to the baby for their first two months.");
  ms("rsv", 32, 36, "tip", "RSV vaccine (if in season)", "Offered at 32 to 36 weeks during RSV season (roughly September to January in the northern hemisphere). Protects the newborn for six months. Flu and COVID vaccines are recommended at any point.");
  ms("monitoring", 30, 34, "tip", "Ask about third-trimester monitoring", "Because stillbirth risk rises modestly with age in the final weeks, many providers offer growth scans or weekly non-stress tests from 32 to 36 weeks for people over 35. Ask what the plan is.");
  ms("delivery", 34, 38, "attention", "Discuss delivery timing", "Ask about induction at 39 to 40 weeks versus expectant management to 41. The evidence (ARRIVE trial and age-specific data) supports offering 39-week induction to people over 35 without increasing caesarean rates. Either choice is reasonable with full information.");
  ms("gbs", 35, 37, "tip", "Group B Strep swab", "At 36 to 37 weeks. Routine; if positive you get antibiotics in labour.");
  ms("perineal", 34, 36, "tip", "Perineal massage", "From 34 weeks, four minutes a day, three to four times a week. Modest but real reduction in tearing, particularly in second births.");
  ms("bag", 35, 38, "tip", "Pack the bag and plan the handover", "Second labours are often faster. Who takes your first child, and how do you get to the hospital quickly?");
  if (week >= 28 && week <= 29) add("tip", "kicks-start", "Start kick counts this week", "28 weeks is when daily counts become meaningful. Pick a time your baby is usually active and make it a ritual.");
  if (week >= 20 && week <= 21) add("tip", "supine", "From now, avoid lying flat on your back for long", "The uterus can compress the vein returning blood to the heart. Side-lying or an incline for exercise and sleep. Left side is ideal but either side is fine.");

  /* ---------- Baseline encouragement when there is nothing else ---------- */
  if (loggedDays7 === 0) add("tip", "start", "Start with today", "Tick your supplements and tap a few food targets. After three or four days of logging, this page starts giving you recommendations built from your own patterns rather than generic advice.");

  var order = { urgent: 0, attention: 1, tip: 2, win: 3 };
  out.sort(function (a, b) { return order[a.level] - order[b.level]; });
  return out;
};

BUMP.shiftDate = function (key, deltaDays) {
  var p = key.split("-").map(Number);
  var d = new Date(p[0], p[1] - 1, p[2] + deltaDays);
  return BUMP.dateKey(d);
};
BUMP.dateKey = function (d) {
  var m = d.getMonth() + 1, day = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
};
