/* Nutrition reference: nutrients with the why, vegetarian-first food sources,
   an optional meat/fish column, daily food targets, and food safety. */
window.BUMP = window.BUMP || {};

BUMP.NUTRIENTS = {
  folate: { name: "Folate", target: "600 mcg DFE a day", peak: [1],
    why: "Closes the neural tube in weeks 4 to 6 and keeps driving the explosive cell division that builds every organ. Needs stay high all pregnancy because red blood cell production doubles. Low folate is linked to neural tube defects, anaemia and possibly preterm birth.",
    veg: ["Lentils (1 cup cooked: 360 mcg)", "Edamame and chickpeas", "Spinach, asparagus, broccoli, romaine", "Avocado", "Fortified breakfast cereal and bread", "Oranges"],
    meat: ["Liver is very high but also very high in vitamin A, so it is not recommended in pregnancy"],
    tips: "Your prenatal covers the baseline; food folate is the top-up. Folate is destroyed by long cooking, so lightly steam greens. If you have the MTHFR variant or were told to, methylfolate is the absorbable form." },
  iron: { name: "Iron", target: "27 mg a day (vegetarians may need up to 1.8 times more because plant iron absorbs less well)", peak: [2, 3],
    why: "Blood volume expands by about 45 percent and the baby and placenta stockpile iron for the first six months of life. Iron deficiency anaemia is the most common nutritional problem in pregnancy. It causes fatigue, breathlessness, poor exercise tolerance and is linked to preterm birth and low birth weight. For a vegetarian, this is the nutrient most worth being deliberate about.",
    veg: ["Lentils, chickpeas, kidney beans, tofu, tempeh", "Pumpkin seeds (1/4 cup: 2.5 mg), hemp seeds, cashews", "Fortified cereals and oats", "Spinach, Swiss chard, beet greens (cooked)", "Blackstrap molasses (1 tbsp: 3.5 mg)", "Dried apricots, prunes", "Quinoa, amaranth"],
    meat: ["Red meat and dark poultry contain haem iron, absorbed 2 to 3 times better than plant iron. If you add meat for any reason, iron is the strongest case for it.", "Sardines and other small oily fish count twice (iron and DHA)"],
    tips: "Pair every iron food with vitamin C (peppers, citrus, strawberries, tomato) and keep tea, coffee and calcium supplements at least an hour away. Cooking in cast iron adds iron. If your ferritin is under 30, ask about a separate iron supplement; taking it every other day is absorbed as well as daily with fewer side effects." },
  choline: { name: "Choline", target: "450 mg a day", peak: [1, 2, 3],
    why: "Builds the baby's brain and memory centre (hippocampus), supports placental function and works alongside folate. Trials show higher maternal choline intake improves infant attention and processing speed. Most prenatals contain little or none, and vegetarian diets are usually well below target.",
    veg: ["Eggs (1 egg: 150 mg, mostly in the yolk)", "Soybeans and tofu", "Quinoa", "Cruciferous vegetables: broccoli, Brussels sprouts, cauliflower", "Peanuts and peanut butter", "Shiitake mushrooms", "Wheat germ"],
    meat: ["Chicken, beef, fish and liver are the richest animal sources"],
    tips: "Two eggs a day gets you most of the way there. If you do not eat eggs, a 250 to 350 mg choline supplement (choline bitartrate or citicoline) is reasonable and cheap. Ask your provider." },
  dha: { name: "DHA (omega-3)", target: "At least 200 to 300 mg DHA a day", peak: [3],
    why: "DHA is the main structural fat in the brain and retina. Transfer to the baby peaks in the third trimester when the brain grows fastest. Adequate DHA is associated with a lower risk of early preterm birth and supports visual and cognitive development. Plant omega-3 (ALA, from flax and walnuts) converts to DHA at only a few percent, so vegetarians need a direct source.",
    veg: ["Algal oil DHA supplement (your two doses)", "Omega-3 fortified eggs", "Flax, chia, walnuts and hemp for ALA (useful but not a substitute)"],
    meat: ["Low-mercury oily fish 2 to 3 times a week: salmon, sardines, trout, anchovies, herring", "Avoid high-mercury fish: shark, swordfish, king mackerel, tilefish, bigeye tuna"],
    tips: "Take DHA with a meal containing fat for better absorption. If you ever feel like adding fish, salmon and sardines are the best choice: DHA, iron, protein, vitamin D and B12 together." },
  calcium: { name: "Calcium", target: "1000 mg a day", peak: [3],
    why: "Builds the baby's skeleton (250 mg a day drawn from you in the third trimester) and is involved in muscle, nerve and blood pressure regulation. Adequate calcium reduces preeclampsia risk, especially where intake is low. If you fall short, your bones donate the difference.",
    veg: ["Fortified plant milk or dairy milk (1 cup: 300 mg)", "Yogurt and cheese", "Calcium-set tofu (check the label: calcium sulfate)", "Tahini and sesame seeds", "Kale, bok choy, collards, broccoli", "Almonds, figs, white beans", "Fortified orange juice"],
    meat: ["Canned sardines or salmon with bones"],
    tips: "Spread calcium across the day; the body absorbs about 500 mg at a time. Take it separately from iron. Spinach calcium is poorly absorbed because of oxalates; kale and bok choy are better." },
  vitd: { name: "Vitamin D", target: "600 IU minimum; 1000 to 2000 IU is commonly advised, more if your blood level is low", peak: [1, 2, 3],
    why: "Needed to absorb calcium and for immune and placental function. Deficiency is common in pregnancy and is associated with preeclampsia, gestational diabetes and low birth weight. Most prenatals contain 400 to 1000 IU.",
    veg: ["Sunlight on skin (hard to rely on in winter or with sunscreen)", "Fortified milk, plant milk and cereal", "Egg yolks", "UV-exposed mushrooms", "A separate D3 supplement if your level is low (vegan D3 from lichen exists)"],
    meat: ["Oily fish (salmon: 400 to 600 IU per serving)"],
    tips: "Ask for a 25-hydroxy vitamin D blood test if you have not had one. Aim for a level above 30 ng/mL (75 nmol/L)." },
  b12: { name: "Vitamin B12", target: "2.6 mcg a day", peak: [1, 2, 3],
    why: "Essential for the baby's nervous system and for making red blood cells. B12 only occurs naturally in animal foods, so vegetarians who eat little dairy or eggs are at real risk of deficiency, which can cause irreversible neurological harm to the baby and anaemia in you.",
    veg: ["Dairy: milk, yogurt, cheese", "Eggs", "Fortified nutritional yeast, fortified plant milks and cereals (check labels)", "Your prenatal (confirm it contains B12)"],
    meat: ["Meat, fish, poultry all contain B12"],
    tips: "If you eat little dairy or eggs, make sure your prenatal has at least 2.6 mcg, and consider having your B12 checked. Supplement B12 is well absorbed and safe." },
  iodine: { name: "Iodine", target: "220 mcg a day", peak: [1, 2],
    why: "Thyroid hormone, which depends on iodine, drives the baby's brain development, especially in the first half of pregnancy before the baby's own thyroid works. Even mild deficiency is linked to lower IQ. Many prenatals contain 150 mcg; some contain none.",
    veg: ["Iodised salt (check the label, sea salt and kosher salt usually are not)", "Dairy and eggs", "Seaweed in small amounts (avoid kelp supplements and large quantities; they can contain too much)", "Fortified bread in some countries"],
    meat: ["White fish such as cod and haddock"],
    tips: "Check that your prenatal lists iodine (150 mcg is the standard). If it does not, iodised salt plus dairy usually covers it." },
  protein: { name: "Protein", target: "About 1.1 g per kg of body weight a day from the second trimester, roughly 75 to 100 g; more in the third trimester", peak: [2, 3],
    why: "Every new cell in the baby, placenta and your expanding blood supply and uterus is built from protein. Adequate protein also steadies blood sugar, reduces nausea for many, and protects your muscle mass. Vegetarian diets can meet this easily but it takes intention: aim for 25 to 30 g at each meal.",
    veg: ["Greek yogurt (1 cup: 20 g), cottage cheese, cheese", "Eggs (6 g each)", "Tofu (1/2 block: 20 g), tempeh (1/2 cup: 15 g), edamame", "Lentils and beans (1 cup: 15 to 18 g)", "Seitan (very high if you tolerate gluten)", "Protein powder (pea, soy or whey) in a smoothie", "Quinoa, nuts, seeds, nut butters"],
    meat: ["Chicken, fish, eggs, lean beef are the most protein-dense options"],
    tips: "A simple check: does each meal have a visible protein source the size of your palm or bigger? If breakfast is toast or fruit alone, that is the easiest meal to fix." },
  zinc: { name: "Zinc", target: "11 mg a day", peak: [1, 2],
    why: "Cell growth, DNA synthesis and immune function. Phytates in grains and legumes reduce absorption, so vegetarian needs are about 50 percent higher.",
    veg: ["Pumpkin seeds, hemp seeds, cashews", "Chickpeas, lentils, beans", "Oats, whole grains (soaking or sprouting improves absorption)", "Cheese and yogurt", "Tofu and tempeh"],
    meat: ["Beef, lamb, shellfish (oysters cooked only)"],
    tips: "Your prenatal almost certainly includes zinc. Food sources double up as iron sources, so the same meals serve both." },
  magnesium: { name: "Magnesium", target: "350 to 360 mg a day", peak: [2, 3],
    why: "Involved in muscle relaxation (leg cramps, uterine irritability), blood pressure regulation, blood sugar control and sleep. Intake is often low. Supplementing has modest evidence for reducing leg cramps and may lower the risk of pregnancy hypertension.",
    veg: ["Pumpkin seeds (1/4 cup: 190 mg)", "Almonds, cashews, peanuts", "Spinach, Swiss chard", "Black beans, edamame", "Dark chocolate (70 percent or more)", "Whole grains, oats, quinoa", "Avocado, banana"],
    meat: [],
    tips: "Your magnesium supplement is a reasonable optional addition. Glycinate is gentlest and best for sleep and cramps; citrate helps constipation; oxide is poorly absorbed. Keep supplemental magnesium under 350 mg a day unless your provider says otherwise." },
  fibre: { name: "Fibre", target: "28 g a day", peak: [1, 2, 3],
    why: "Progesterone slows the gut and iron supplements slow it further. Fibre with fluid prevents constipation and haemorrhoids, steadies blood sugar (relevant for gestational diabetes prevention) and feeds the gut bacteria that help seed the baby's microbiome.",
    veg: ["Lentils, beans, chickpeas (1 cup: 12 to 16 g)", "Chia and flax (2 tbsp: 8 to 10 g)", "Raspberries, pears, apples with skin", "Oats, barley, whole grains", "Broccoli, Brussels sprouts, artichokes", "Avocado, sweet potato with skin"],
    meat: [],
    tips: "Increase gradually with plenty of water or you will feel worse before better. Prunes or two kiwis a day are well studied for constipation." },
  vitc: { name: "Vitamin C", target: "85 mg a day", peak: [1, 2, 3],
    why: "Builds collagen (skin, blood vessels, the amniotic sac) and multiplies absorption of plant iron several-fold when eaten in the same meal. It is the lever that makes a vegetarian iron intake work.",
    veg: ["Red and yellow peppers (one pepper: 150 mg)", "Kiwi, strawberries, oranges, grapefruit", "Broccoli, Brussels sprouts, kale", "Tomatoes, potatoes"],
    meat: [],
    tips: "Think of vitamin C as the sidekick: squeeze lemon on lentils, add peppers to the tofu stir fry, have strawberries with the fortified oats." },
  vita: { name: "Vitamin A (as beta-carotene)", target: "770 mcg RAE a day; avoid supplements over 10,000 IU of preformed retinol", peak: [2, 3],
    why: "Eyes, skin, immune system and lung development. The plant form (beta-carotene) is safe at any intake; preformed retinol from liver or high-dose supplements can cause birth defects in excess.",
    veg: ["Sweet potato, carrots, butternut squash", "Spinach, kale, collards", "Red peppers, cantaloupe, mango, apricots"],
    meat: ["Avoid liver and pâté in pregnancy"],
    tips: "Orange and dark green vegetables most days covers this with no risk." },
  water: { name: "Water", target: "About 2.3 litres (10 cups) of fluids a day, more when exercising or in heat", peak: [1, 2, 3],
    why: "Amniotic fluid, a 45 percent larger blood volume, nutrient transport and temperature regulation. Dehydration triggers Braxton Hicks, headaches, constipation and dizziness and is a common cause of a day that feels off.",
    veg: ["Water, sparkling water, herbal teas (ginger, peppermint, rooibos)", "Milk and fortified plant milk", "Watery foods: cucumber, melon, soups, oranges"],
    meat: [],
    tips: "Pale yellow urine is the simplest check. A bottle you refill three times is easier than counting glasses." },
  potassium: { name: "Potassium", target: "2900 mg a day", peak: [2, 3],
    why: "Balances fluid, supports healthy blood pressure and reduces leg cramps. Works with magnesium.",
    veg: ["Potatoes and sweet potatoes with skin", "Bananas, oranges, apricots, cantaloupe", "White beans, lentils", "Spinach, beet greens, avocado", "Yogurt, coconut water"],
    meat: ["Fish, chicken"],
    tips: "A baked potato has more potassium than a banana. Salt your food to taste; avoiding salt does not prevent swelling or preeclampsia." },
  probiotics: { name: "Fermented foods and the microbiome", target: "A serving of fermented food most days", peak: [2, 3],
    why: "Your gut and vaginal microbiome help seed your baby's immune system at birth. Diverse fibre and fermented foods are associated with lower rates of gestational diabetes, and some evidence suggests fewer infant eczema and allergy outcomes. Probiotics are not a replacement for a varied plant-rich diet.",
    veg: ["Live yogurt and kefir", "Sauerkraut and kimchi (refrigerated, unpasteurised)", "Miso and tempeh", "Kombucha (check caffeine and alcohol content, keep to small amounts)"],
    meat: [],
    tips: "Variety matters more than quantity: aim for 30 different plant foods a week (herbs, spices, nuts and seeds count)." },
  b6: { name: "Vitamin B6", target: "1.9 mg a day; 10 to 25 mg three times daily is used for nausea", peak: [1],
    why: "Supports brain development and amino acid metabolism, and is the first-line treatment for nausea and vomiting of pregnancy, with or without doxylamine (an antihistamine). Both are considered safe.",
    veg: ["Chickpeas (1 cup: 1.1 mg)", "Potatoes, bananas, avocado", "Pistachios, sunflower seeds", "Fortified cereals", "Tofu"],
    meat: ["Chicken, salmon, tuna"],
    tips: "If nausea is interfering with eating, ask your provider about B6 plus doxylamine (sold as Diclegis or Bonjesta, or doxylamine from the sleep aid Unisom with B6 separately). Do not wait until you are losing weight." }
};

/* Which nutrient to spotlight each day. Rotation is weighted by trimester so the
   most relevant nutrients come up more often, and it is keyed to the day of
   pregnancy so the same day always shows the same focus. */
BUMP.FOCUS_ROTATION = {
  1: ["folate", "choline", "b6", "iron", "protein", "iodine", "water", "b12", "vitd", "folate", "fibre", "dha", "choline", "vitc"],
  2: ["iron", "protein", "calcium", "choline", "fibre", "dha", "vitc", "magnesium", "iodine", "vitd", "iron", "zinc", "probiotics", "water", "b12", "potassium", "vita"],
  3: ["dha", "iron", "calcium", "protein", "magnesium", "fibre", "choline", "vitc", "water", "dha", "potassium", "iron", "vitd", "probiotics", "b12", "calcium", "protein"]
};
BUMP.dailyFocus = function (dayOfPregnancy, trimester) {
  var list = BUMP.FOCUS_ROTATION[trimester] || BUMP.FOCUS_ROTATION[2];
  var key = list[Math.abs(dayOfPregnancy) % list.length];
  return { key: key, nutrient: BUMP.NUTRIENTS[key] };
};

/* Daily food targets: the tick boxes under "Eat today". Counts are servings. */
BUMP.FOOD_TARGETS = [
  { id: "protein", label: "Protein at each meal", count: 3, why: "25 to 30 g per meal steadies blood sugar and meets the roughly 75 to 100 g daily need." },
  { id: "veg", label: "Vegetable servings", count: 4, why: "Folate, fibre, potassium, vitamin C and the plant diversity that feeds your microbiome." },
  { id: "fruit", label: "Fruit servings", count: 2, why: "Vitamin C for iron absorption, fibre and potassium." },
  { id: "iron", label: "Iron-rich food with vitamin C", count: 2, why: "The vegetarian iron strategy: plant iron plus vitamin C in the same meal, away from coffee and tea." },
  { id: "calcium", label: "Calcium sources", count: 3, why: "About 300 mg each, spread out because absorption caps around 500 mg at a time." },
  { id: "choline", label: "Choline source (eggs, soy, quinoa, cruciferous)", count: 1, why: "Most prenatals skip choline. Two eggs or a solid soy or supplement source closes the gap." },
  { id: "omega", label: "Omega-3 food (walnuts, chia, flax, hemp, or fish)", count: 1, why: "Supports your DHA supplement and adds fibre and magnesium." },
  { id: "wholegrain", label: "Whole grains or legumes", count: 3, why: "Fibre, B vitamins, zinc, magnesium and steady energy." },
  { id: "water", label: "Cups of water", count: 10, why: "Roughly 2.3 litres a day. Dehydration drives Braxton Hicks, headaches and constipation." }
];

BUMP.FOOD_SAFETY = [
  { title: "Avoid", items: ["Unpasteurised milk, soft cheeses made from it (brie, camembert, feta, blue, queso fresco) unless the label says pasteurised", "Raw or undercooked eggs unless pasteurised (homemade mayo, mousse, runny eggs from unpasteurised sources)", "Raw sprouts (alfalfa, mung bean, clover) unless cooked", "Unwashed produce; wash everything, including pre-bagged salad", "Deli meats and hot dogs unless heated steaming hot (listeria)", "Refrigerated smoked seafood and pâté", "High-mercury fish: shark, swordfish, king mackerel, tilefish, marlin, orange roughy, bigeye tuna", "Raw fish and shellfish", "Alcohol in any amount", "Liver and liver products (vitamin A excess)", "Kelp supplements and large amounts of seaweed (iodine excess)", "Herbal supplements not cleared by your provider"] },
  { title: "Limit", items: ["Caffeine to 200 mg a day (one 12 oz coffee; green and black tea have 30 to 50 mg a cup)", "Canned light tuna to 2 to 3 servings a week; albacore to 1", "Highly processed meat substitutes high in sodium", "Artificial sweeteners in moderation; avoid saccharin", "Liquorice root (the real thing, not the flavouring)"] },
  { title: "Good news", items: ["Hard cheeses, pasteurised soft cheeses, cooked cheese dishes are fine", "Sushi with cooked fillings or vegetables is fine", "Hummus, nut butters, tofu and tempeh are all fine", "Spicy food, pineapple and papaya (ripe) do not cause labour", "Honey is fine for you (the infant warning is for babies under one)"] }
];

BUMP.VEG_GUIDE = [
  { h: "The six nutrients a vegetarian pregnancy has to be deliberate about", p: "Iron, B12, choline, DHA, zinc and iodine. Everything else a varied vegetarian diet covers easily, and often better than an average omnivore diet (fibre, folate, magnesium, vitamin C, potassium). Your prenatal plus DHA covers B12, iodine, zinc and DHA if the labels check out. That leaves iron and choline as the two to track in food." },
  { h: "Should you add meat?", p: "Not required. Well-planned vegetarian pregnancies have outcomes equal to omnivorous ones. The one place meat has a clear edge is haem iron, which is absorbed two to three times better than plant iron. If your ferritin comes back low and you find supplements hard on your stomach, adding small amounts of red meat or oily fish two or three times a week is a reasonable, evidence-based option. Oily fish (salmon, sardines) is the single most useful addition because it brings DHA, iron, B12, vitamin D and protein together. Eggs and dairy, if you eat them, already close most gaps." },
  { h: "A day that hits the targets", p: "Breakfast: two eggs with spinach and tomato on wholegrain toast, or fortified oats with chia, berries and Greek yogurt. Snack: an orange and a handful of pumpkin seeds. Lunch: lentil and vegetable soup with lemon squeezed in, plus a piece of cheese. Snack: hummus with red pepper strips. Dinner: tofu stir fry with broccoli, bok choy and cashews over quinoa or brown rice. Evening: kefir or milk, two squares of dark chocolate. Prenatal with lunch, DHA with dinner." },
  { h: "Supplement timing", p: "Prenatal with food, split doses if yours is a three-a-day. Keep iron-containing doses at least an hour from coffee, tea and calcium-rich meals. DHA with a meal that contains fat. Magnesium at night. If nausea is a problem, take the prenatal with your largest meal or at bedtime." },
  { h: "Why the second and third trimesters matter more for iron and DHA", p: "In the first trimester, you are not menstruating and the baby is tiny, so iron needs are actually lower than before pregnancy. From the second trimester, blood volume expansion and the baby's growth drive iron needs up sharply, and the third trimester is when the baby stores iron and DHA for its first six months. This is why the app spotlights these nutrients more often later on." },
  { h: "Being 39", p: "Maternal age over 35 slightly raises the chance of gestational diabetes, high blood pressure, and placental issues. Nutrition is one of the few levers fully in your hands: protein and fibre with every carbohydrate, a walk after meals, adequate calcium and vitamin D, and enough sleep all measurably lower those risks. Consistent iron intake protects your reserves for birth. None of this needs to be perfect; consistency beats intensity." }
];
