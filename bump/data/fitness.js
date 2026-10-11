/* Movement: exercises, routines, trimester rules, and the daily plan. Written for
   someone with a sore lower back in a previous pregnancy and a core and pelvic
   floor that never fully came back. The logic: breath first, deep core second,
   glutes third, then load. */
window.BUMP = window.BUMP || {};

BUMP.EXERCISES = {
  breath360: { name: "360 breathing", dose: "8 slow breaths", tri: [1, 2, 3],
    how: "Sit tall or lie on your side. Inhale through the nose and feel the ribs expand sideways and back, belly softens, pelvic floor gently lowers. Exhale through pursed lips, ribs knit together, pelvic floor lifts lightly, lower belly draws in. No breath holding.",
    why: "This is the foundation of everything else. The diaphragm, deep abdominals and pelvic floor work as one pressure system. Learning to exhale on effort is what protects against diastasis recti and leaking." },
  pfLift: { name: "Pelvic floor lifts (long holds)", dose: "8 holds of 6 to 10 seconds, full relax between", tri: [1, 2, 3],
    how: "Exhale and gently lift as if picking up a blueberry with the vagina and holding in wind at the same time. Front to back, then up. Hold while breathing. Then fully let go for the same length of time. The let-go is as important as the lift.",
    why: "Slow-twitch endurance holds support the growing weight of the uterus. A pelvic floor that cannot fully relax is as much of a problem as a weak one, and matters for birth." },
  pfQuick: { name: "Pelvic floor quick flicks", dose: "10 fast lifts, then fully relax", tri: [1, 2, 3],
    how: "Quick lift and quick release, one per second. Then rest completely for 10 seconds.",
    why: "Fast-twitch fibres catch a sneeze, cough or jump. Postpartum leaking is usually a fast-twitch problem." },
  pfRelax: { name: "Pelvic floor release", dose: "6 breaths in each position", tri: [2, 3],
    how: "Child's pose with knees wide, or a deep supported squat holding a doorframe. Breathe into the back of the pelvis and imagine the pelvic floor widening and softening on each inhale.",
    why: "Birth needs the pelvic floor to open. Release work from the second trimester reduces tearing and is linked to shorter pushing stages." },
  taHeelSlide: { name: "Heel slides with core connection", dose: "8 each side", tri: [1, 2],
    how: "Lie on your back (first trimester) or on an incline of pillows (second trimester). Knees bent. Exhale, draw the lower belly gently toward the spine, slide one heel away along the floor, inhale to return. Belly stays flat, no doming.",
    why: "Trains the transverse abdominis to stabilise the pelvis while a leg moves, which is exactly what walking and stairs ask for." },
  taFallout: { name: "Bent-knee fallouts", dose: "8 each side", tri: [1, 2],
    how: "Same position. Exhale and let one knee fall slowly out to the side only as far as the pelvis stays perfectly still. Inhale to return.",
    why: "Deep core control against rotation. Protects the lower back and the sacroiliac joints." },
  bridge: { name: "Glute bridge", dose: "12 reps, 2 second squeeze at top", tri: [1, 2, 3],
    how: "On your back (or on an incline after 20 weeks; or skip and use the hip thrust on a bench). Feet hip width, heels close to the body. Exhale and press through the heels to lift the hips until the body is a straight line from knees to shoulders. Ribs stay down. Squeeze the glutes, lower slowly.",
    why: "Glutes that switch off are the single biggest driver of pregnancy back pain. Bridges turn them back on and take load off the lumbar spine." },
  clam: { name: "Side-lying clam", dose: "15 each side", tri: [1, 2, 3],
    how: "Lie on your side, knees bent at 90, heels in line with your bottom. Keep the feet together and lift the top knee without rolling the pelvis back. Slow down, slow up.",
    why: "Gluteus medius stabilises the pelvis every time you stand on one leg (every step). Weak glute med is behind most sacroiliac and one-sided hip pain." },
  sideLegLift: { name: "Side-lying leg lift", dose: "12 each side", tri: [1, 2, 3],
    how: "Lie on your side, bottom knee bent, top leg straight and slightly behind you. Lift the top leg to hip height with the foot flexed, toes pointing forward not up. Lower slowly.",
    why: "Lateral hip strength for pelvic stability and to prevent the waddle that strains the lower back." },
  birdDog: { name: "Bird dog", dose: "8 each side, 3 second hold", tri: [1, 2, 3],
    how: "On hands and knees, wrists under shoulders, knees under hips. Exhale and extend the opposite arm and leg only as far as the back stays flat and the belly stays lifted. No arching. Hold, return, swap.",
    why: "Anti-rotation and anti-extension core work in a position that is safe at any stage. Also decompresses the lower back." },
  catCow: { name: "Cat cow", dose: "10 slow cycles", tri: [1, 2, 3],
    how: "On hands and knees. Inhale and let the belly drop while lifting the chest and tailbone. Exhale and round the spine, tuck the tailbone and draw the belly up. Move slowly through every segment.",
    why: "Spinal mobility and a gentle pelvic floor stretch. Hands and knees is also a good position for an optimal baby position and for back labour." },
  squat: { name: "Squat (bodyweight or goblet)", dose: "12 reps", tri: [1, 2, 3],
    how: "Feet slightly wider than hips, toes a little out. Inhale to lower, sending the hips back and down as if sitting on a chair, knees tracking over toes. Exhale to stand, squeezing the glutes. Hold a weight at the chest if comfortable. Shallow is fine as the belly grows.",
    why: "Full lower body strength, pelvic floor lengthening at the bottom, and a position you may well use in labour." },
  hipHinge: { name: "Hip hinge or Romanian deadlift (light)", dose: "10 reps", tri: [1, 2, 3],
    how: "Feet hip width, soft knees. Push the hips straight back while keeping the spine long, lowering a light weight or just your hands down the thighs until you feel the hamstrings. Exhale and drive the hips forward to stand. Think of closing a car door with your bottom.",
    why: "Teaches picking things up (toddlers, car seats) with the hips rather than the back. Strengthens hamstrings and glutes. This is the most protective single pattern for a sore pregnant back." },
  rowBand: { name: "Band or dumbbell row", dose: "12 reps", tri: [1, 2, 3],
    how: "Anchor a band or hold a dumbbell. Hinge slightly, pull the elbow back toward the hip while keeping the shoulder down, squeeze between the shoulder blades, return slowly.",
    why: "Counters the forward pull of breasts and belly and prepares you for feeding and carrying a newborn. Upper back strength reduces mid-back and neck pain." },
  wallPush: { name: "Incline push-up", dose: "10 reps", tri: [1, 2, 3],
    how: "Hands on a wall, counter or bench. Body in one line, exhale as you push away. Belly stays drawn in; stop if you see a ridge down the midline.",
    why: "Pressing strength with the belly supported by gravity, not fighting it. Safer than floor planks as the bump grows." },
  sidePlankKnee: { name: "Modified side plank (knees)", dose: "20 to 30 seconds each side", tri: [1, 2, 3],
    how: "Lie on your side, knees bent and stacked, elbow under shoulder. Exhale and lift the hips so the body is a straight line from knees to head. Breathe.",
    why: "Oblique and lateral core strength without front-loading the abdominal wall. Research suggests side planks are the safest plank variant for diastasis." },
  pelvicTilt: { name: "Standing or wall pelvic tilt", dose: "12 slow reps", tri: [1, 2, 3],
    how: "Stand with your back to a wall, feet a step away. Exhale and flatten the lower back toward the wall by gently tucking the tailbone and drawing the lower belly in. Inhale and release.",
    why: "Directly counters the exaggerated lumbar curve of pregnancy. Immediate relief for an achy back and a cue you can use any time you are standing in a queue." },
  hipFlexorStretch: { name: "Half-kneeling hip flexor stretch", dose: "30 to 45 seconds each side", tri: [1, 2, 3],
    how: "Kneel on one knee (pad it), other foot forward. Tuck the tailbone, squeeze the glute of the kneeling side and shift forward slightly until you feel a stretch at the front of the hip. Do not arch the back.",
    why: "Tight hip flexors tip the pelvis forward and load the lower back. Sitting makes them tighter." },
  piriformis: { name: "Figure-four stretch", dose: "30 to 45 seconds each side", tri: [1, 2, 3],
    how: "Sit on a chair. Cross one ankle over the opposite knee, sit tall and hinge forward from the hips until you feel it in the back of the hip. Keep breathing.",
    why: "Relieves sciatic-type pain, which in pregnancy is usually the piriformis and glutes clamping down, not a disc." },
  thoracicRotation: { name: "Open book thoracic rotation", dose: "8 each side", tri: [1, 2, 3],
    how: "Lie on your side with knees bent and stacked, arms straight out in front. Open the top arm up and over like a book, following with the eyes, letting the upper back rotate while the knees stay together. Return.",
    why: "Mid-back mobility. A stiff thoracic spine forces the lower back to do the rotating, which it hates." },
  childsPose: { name: "Wide-knee child's pose", dose: "8 breaths", tri: [1, 2, 3],
    how: "Kneel with knees wide, big toes together, sit back toward the heels and walk the hands forward. Rest the forehead on a cushion. Breathe into the lower back and pelvic floor.",
    why: "Decompresses the lower back and releases the pelvic floor. The best 60 seconds of the day for a sore back." },
  calfStretch: { name: "Calf stretch", dose: "30 seconds each side", tri: [1, 2, 3],
    how: "Hands on a wall, one leg back with the heel down, lean in until you feel the calf. Then bend the back knee slightly for the deeper calf.",
    why: "Reduces night cramps when done before bed." },
  walk: { name: "Brisk walk", dose: "20 to 30 minutes", tri: [1, 2, 3],
    how: "A pace where you can talk but not sing. Swing the arms, land softly, keep the ribs stacked over the pelvis rather than leaning back.",
    why: "Cardiovascular fitness, blood sugar control, mood, sleep and a measurable reduction in gestational diabetes and preeclampsia risk. 150 minutes a week of moderate activity is the standard recommendation." },
  stepUp: { name: "Step-ups", dose: "10 each leg", tri: [1, 2, 3],
    how: "Use a low step or stair. Step up with the whole foot, drive through the heel, stand tall at the top, lower slowly with control. Hold a rail if balance is off.",
    why: "Single-leg strength for stairs, hills and carrying a toddler. Trains the glutes and balance." },
  farmerCarry: { name: "Farmer carry", dose: "2 lengths of 20 to 30 steps", tri: [1, 2, 3],
    how: "Hold a moderately heavy weight (or a full shopping bag) in each hand. Walk tall, ribs down, shoulders back, breathing normally.",
    why: "Grip, posture and deep core under real-life load. The most functional exercise for parenting." }
};

BUMP.ROUTINES = {
  coreFloor: { name: "Core and Floor", minutes: 10, tag: "daily",
    desc: "The daily non-negotiable. Breath, pelvic floor, deep core, glutes. Ten minutes, no equipment, side-lying and hands-and-knees positions that are safe at every stage.",
    steps: ["breath360", "pfLift", "pfQuick", "taHeelSlide", "taFallout", "bridge", "clam", "birdDog", "childsPose"],
    steps3: ["breath360", "pfLift", "pfQuick", "pfRelax", "clam", "sideLegLift", "birdDog", "sidePlankKnee", "childsPose"] },
  backRelief: { name: "Back Relief", minutes: 12, tag: "as needed",
    desc: "For days when the lower back aches. Mobilise, stretch what is tight, switch on what is weak.",
    steps: ["catCow", "pelvicTilt", "hipFlexorStretch", "piriformis", "thoracicRotation", "bridge", "clam", "childsPose"] },
  strength: { name: "Full Body Strength", minutes: 25, tag: "2 to 3 times a week",
    desc: "Two or three rounds. Weights optional; use what you have. Exhale on the hard part of every rep. Stop a set when form slips.",
    steps: ["squat", "hipHinge", "rowBand", "wallPush", "stepUp", "farmerCarry", "sidePlankKnee"] },
  mobility: { name: "Evening Unwind", minutes: 8, tag: "before bed",
    desc: "Stretch and release before sleep. Helps cramps, back ache and falling asleep.",
    steps: ["catCow", "hipFlexorStretch", "piriformis", "calfStretch", "pfRelax", "childsPose", "breath360"] },
  walk: { name: "Walk", minutes: 25, tag: "most days",
    desc: "A brisk walk, ideally after a meal. Counts toward the 150 minutes a week.",
    steps: ["walk"] }
};

/* Weekly template. 0 = Sunday. */
BUMP.MOVE_PLAN = {
  0: ["walk", "mobility"],
  1: ["coreFloor", "strength"],
  2: ["coreFloor", "walk"],
  3: ["coreFloor", "strength"],
  4: ["coreFloor", "walk"],
  5: ["coreFloor", "strength"],
  6: ["walk", "mobility"]
};

BUMP.MOVE_RULES = [
  { h: "The rules that matter", items: [
    "Exhale on effort. Every lift, every push, every stand-up. This manages pressure on the abdominal wall and pelvic floor.",
    "Watch for coning or doming: a ridge down the midline of the belly during an exercise means the pressure is too high for your core today. Make it easier or skip it.",
    "After 20 weeks, avoid lying flat on your back for more than a couple of minutes. Use an incline, side-lying, or standing versions.",
    "Skip crunches, sit-ups, full planks, double leg lowers and anything that bulges the belly from the second trimester on.",
    "Avoid contact sports, anything with a fall risk (cycling outdoors late on, skiing), hot yoga, and scuba.",
    "Keep the talk test: you should be able to hold a conversation. Heart rate limits are outdated.",
    "Relaxin loosens joints. Go slightly shallower and lighter than you could, and avoid bouncing stretches.",
    "Hydrate before, during and after. Stop in heat.",
    "Pelvic girdle pain (pubic bone, one-sided buttock pain, pain turning in bed): narrow your stance, avoid single-leg work and wide-step movements, keep knees together when rolling, and see a pelvic physiotherapist." ] },
  { h: "Stop and call your provider if", items: [
    "Vaginal bleeding or fluid leaking",
    "Regular painful contractions",
    "Chest pain, or breathlessness before you start exercising",
    "Dizziness or faintness that does not settle with rest",
    "Headache with visual changes",
    "Calf pain or swelling in one leg",
    "Reduced fetal movement after exercise (after 28 weeks)" ] },
  { h: "Your history: a sore back and a core and floor that did not come back", items: [
    "Back pain in a first pregnancy usually comes from three things: glutes switching off, hip flexors tightening from sitting, and a deep core that cannot stabilise. The Core and Floor routine addresses all three in ten minutes. Do it most days from now, not from when it hurts.",
    "A pelvic floor that never fully recovered is extremely common and very treatable. The single most effective step is one assessment with a pelvic floor physiotherapist in the second trimester. They will tell you whether yours is weak, tight, or both, which changes what you should be doing. Many are tight and weak, and doing more kegels makes a tight floor worse.",
    "Diastasis recti (abdominal separation) from your first pregnancy may not have closed fully. That is not a reason to avoid core work; it is a reason to do the right core work. Breath, transverse abdominis and oblique loading in side-lying and hands-and-knees positions improve tension across the midline. Avoid anything that domes.",
    "Think of this pregnancy as rehab plus prevention. Everything in the Move tab is also the postpartum recovery programme, so you will know it cold when you need it.",
    "A support belt for the second half of pregnancy, worn when walking or standing for long, takes real load off the sacroiliac joints and is worth trying if the back starts to complain." ] },
  { h: "Postpartum preview", items: [
    "Weeks 0 to 2: 360 breathing and gentle pelvic floor lifts only. Walk to the kitchen.",
    "Weeks 2 to 6: short walks, breathing, heel slides. Nothing that strains.",
    "Week 6 onward (after your check and ideally a pelvic physio review): the Core and Floor routine as written here, then gradually the strength routine.",
    "Running and impact: usually not before 12 weeks postpartum and only when you can hop, jump and jog on the spot without leaking, heaviness or pain.",
    "Check for diastasis at 6 to 8 weeks: lie on your back, knees bent, lift your head slightly and feel along the midline above and below the navel for a gap and how firm it feels. More than two finger widths or a soft, squishy gap deserves a physiotherapist." ] }
];

BUMP.routineSteps = function (routineId, trimester) {
  var r = BUMP.ROUTINES[routineId];
  if (!r) return [];
  var ids = (trimester === 3 && r.steps3) ? r.steps3 : r.steps;
  return ids.filter(function (id) { return BUMP.EXERCISES[id].tri.indexOf(trimester) !== -1; });
};
