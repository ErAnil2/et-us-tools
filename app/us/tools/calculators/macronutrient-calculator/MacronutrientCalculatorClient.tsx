'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What are macronutrients and why do they matter?",
    answer: "Macronutrients are the three primary nutrients your body requires in substantial quantities to function, provide energy, and support physiological processes: protein, carbohydrates, and fats. Each macronutrient serves distinct essential roles that cannot be substituted by the others. Protein (4 calories per gram) functions as the structural building block of all tissues—skeletal muscle, cardiac muscle, smooth muscle in organs, skin, hair, nails, enzymes catalyzing biochemical reactions, hormones regulating metabolism (insulin, growth hormone, thyroid), antibodies supporting immune function, and transporters moving nutrients across cell membranes. Dietary protein provides the 20 amino acids required for these functions, including 9 essential amino acids the body cannot synthesize and must obtain from food. Beyond structure, protein exhibits the highest satiety effect of all macronutrients through gut peptide release (GLP-1, PYY, CCK) signaling fullness to the brain, and the highest thermic effect of food—20-30% of protein calories are expended during digestion and absorption (versus 5-10% for carbs, 0-3% for fats). Carbohydrates (4 calories per gram) serve as the body's preferred energy source, particularly for high-intensity exercise and brain function. Dietary carbohydrates break down into glucose, which powers cellular energy production through glycolysis and oxidative phosphorylation. Excess glucose stores as glycogen in skeletal muscle (300-400g) and liver (70-100g), providing readily accessible energy reserves. The brain exclusively uses glucose for fuel, consuming approximately 120g daily (480 calories)—without adequate carbohydrate intake, the body must convert protein to glucose via gluconeogenesis, a metabolically expensive process that can compromise muscle mass. Fiber, a specific carbohydrate type, supports digestive health, feeds beneficial gut bacteria producing short-chain fatty acids that reduce inflammation, and improves insulin sensitivity. Fats (9 calories per gram) enable critical functions despite popular misconceptions: cell membrane structure (phospholipid bilayer surrounding every cell requires fatty acids), hormone production (testosterone, estrogen, progesterone, cortisol are cholesterol derivatives requiring adequate fat intake), vitamin absorption (vitamins A, D, E, K are fat-soluble and cannot absorb without dietary fats), neurological function (brain is 60% fat by dry weight; myelin sheaths insulating neurons require essential fatty acids), and satiety (fats slow gastric emptying, prolonging fullness). Essential fatty acids omega-3 (anti-inflammatory, supporting cardiovascular and cognitive health) and omega-6 (pro-inflammatory in excess but necessary for immune function and tissue repair) must come from diet since the body cannot synthesize them. Macronutrient distribution matters because different goals, activity levels, and metabolic conditions benefit from varied ratios: athletes performing high-intensity training require higher carbohydrates (45-65%) to maintain glycogen stores and performance; individuals with insulin resistance or metabolic syndrome may benefit from lower carbohydrates (20-40%) and higher fats to improve insulin sensitivity and reduce postprandial glucose spikes; those in calorie deficits for fat loss need higher protein (30-40%) to preserve muscle mass and support satiety; sedentary individuals may function well with balanced distributions (30/40/30). Beyond percentages, absolute gram amounts matter—a 140-pound woman needs approximately 100-140g protein daily for muscle preservation regardless of total calories, meaning protein percentage must increase during calorie restriction to maintain absolute intake. Individual responses to macronutrient distributions vary substantially based on genetics, gut microbiome composition, activity patterns, insulin sensitivity, and food preferences—some thrive on higher carbohydrates while others experience better energy and satiety with higher fats. Self-experimentation tracking subjective wellbeing (energy, hunger, mood, performance) and objective outcomes (body composition changes, blood markers, athletic performance) guides optimal personal macronutrient distribution.",
    order: 1
  },
  {
    id: '2',
    question: "How much protein do I really need daily?",
    answer: "Protein requirements depend on body weight, training status, calorie intake, age, and goals—recommendations range from 0.36 g/lb (0.8 g/kg) for sedentary adults to 1.2+ g/lb (2.6+ g/kg) for athletes in calorie deficits. The Recommended Dietary Allowance (RDA) of 0.36 g/lb bodyweight represents the minimum needed to prevent deficiency and nitrogen loss in sedentary adults—sufficient to avoid muscle wasting but suboptimal for body composition, satiety, and metabolic health. For individuals engaged in resistance training, pursuing fat loss, or optimizing body composition, substantially higher intakes prove beneficial. Muscle building (calorie surplus): 0.7-1.0 g/lb (1.6-2.2 g/kg) bodyweight supports maximal muscle protein synthesis. Example: 180 lb man = 126-180g protein daily. Research shows protein synthesis plateaus beyond ~0.8 g/lb for most individuals in surplus—additional protein provides minimal muscle-building benefit but may improve satiety and diet quality by displacing less nutritious foods. Fat loss (calorie deficit): 0.8-1.2 g/lb (1.8-2.6 g/kg) bodyweight preserves muscle mass during energy restriction. Example: 150 lb woman = 120-180g protein. Higher protein during deficits serves multiple purposes: maintains muscle protein synthesis despite reduced anabolic signaling from lower insulin and mTOR activity, increases satiety through gut peptide release reducing hunger and improving adherence, increases energy expenditure through higher thermic effect of food, and prevents metabolic adaptation by supporting maintenance of metabolically active lean tissue. Maintenance and general health: 0.6-0.8 g/lb (1.4-1.8 g/kg) bodyweight balances muscle preservation with dietary flexibility. Example: 160 lb person = 96-128g protein. Older adults (60+ years): 0.8-1.0 g/lb (1.8-2.2 g/kg) bodyweight combats age-related muscle loss (sarcopenia) and anabolic resistance—older muscles require higher protein doses per meal (40g vs. 20-25g for younger adults) to maximally stimulate muscle protein synthesis due to reduced sensitivity to leucine signaling. Endurance athletes: 0.6-0.8 g/lb (1.4-1.8 g/kg) supports recovery from high training volumes, though lower than strength athletes since endurance training creates less muscle damage. Very high protein (>1.2 g/lb): Safe for most individuals with healthy kidney function but provides minimal additional benefit beyond 1.0 g/lb for muscle building or retention. May be useful during aggressive fat loss for maximal satiety and muscle preservation, or for individuals who enjoy high-protein foods. Protein distribution timing: While total daily protein intake matters most, spreading intake across 3-6 meals optimizes muscle protein synthesis through repeated leucine threshold stimulation. Each protein feeding should contain 20-40g protein (0.25-0.4 g/kg bodyweight) with approximately 2-3g leucine (the amino acid triggering anabolic signaling) to maximally stimulate synthesis. Protein quality considerations: Complete proteins containing all essential amino acids in adequate ratios (animal sources: meat, fish, eggs, dairy; plant sources: soy, quinoa, buckwheat) are most efficient for muscle protein synthesis. Incomplete proteins (most plant sources) can achieve equivalent effects when combined throughout the day to provide all essential amino acids (beans + rice, peanut butter + bread, hummus + pita). Plant-based diets may benefit from 10-15% higher protein targets (0.9-1.1 g/lb vs. 0.8-1.0 g/lb) to compensate for lower digestibility and reduced leucine content. Protein safety: Extensive research shows high protein intakes (1.0-2.0 g/lb) are safe for healthy adults with normal kidney function. Concerns about kidney damage from high protein originate from studies on individuals with pre-existing kidney disease—healthy kidneys adapt to higher protein loads through increased glomerular filtration without damage. However, individuals with diagnosed kidney disease should consult physicians before increasing protein above RDA levels. Common protein intake errors: Calculating protein from calories rather than bodyweight (e.g., '30% of 1,800 calories' = only 135g for a 200 lb man = 0.68 g/lb, suboptimal during deficit). Not adjusting protein percentage upward during calorie restriction to maintain absolute gram intake. Inadequate protein per meal (<20g) failing to reach leucine threshold for muscle protein synthesis. Over-reliance on single protein source missing amino acid variety. Key principle: Protein requirements should be calculated as grams per pound bodyweight based on goals and training status, not as percentage of total calories. During calorie restriction, protein percentage must increase to maintain absolute gram intake necessary for muscle preservation.",
    order: 2
  },
  {
    id: '3',
    question: "Are low-carb or keto diets better for fat loss than balanced macros?",
    answer: "Low-carb (<100g/day or <25% calories) and ketogenic (<50g/day or <10% calories) diets offer no metabolic advantage for fat loss compared to higher-carb diets when protein and total calories are matched—fat loss fundamentally depends on calorie deficit, not carbohydrate restriction. However, carbohydrate manipulation affects hunger, energy, adherence, and performance in highly individual ways that can indirectly impact fat loss success. Metabolic fat loss equivalence: Controlled metabolic ward studies where participants cannot misreport intake consistently demonstrate that low-carb and higher-carb diets produce identical fat loss when protein (preserving lean mass and satiety) and total calories (determining energy balance) are equated. The temporary rapid weight loss seen in keto diets' first 1-2 weeks (often 5-10 lbs) primarily reflects water loss, not accelerated fat oxidation: each gram of stored glycogen binds 3-4 grams water, so depleting 400-500g glycogen releases 1,200-2,000g water weight. Additionally, low-carb diets' natriuretic effect (increased sodium excretion) further reduces water retention. After the initial water drop, fat loss rates match calorie-equated higher-carb diets. Ketosis and fat oxidation: Ketogenic diets force metabolic adaptation to fat-based fuel by restricting carbohydrates below 50g daily, typically achieved through <10% carbs, 70-75% fats, 20-25% protein. After 3-7 days of glycogen depletion, the liver increases ketone body production (beta-hydroxybutyrate, acetoacetate, acetone) from fatty acids to fuel the brain and tissues normally relying on glucose. While keto-adapted individuals show dramatically increased fat oxidation rates during exercise and rest, this simply reflects increased dietary fat intake being oxidized—there is no preferential mobilization of stored body fat compared to higher-carb diets at equal calorie deficits. Weight loss still requires consuming fewer calories than expended; ketosis merely changes fuel source, not energy balance. Individual response variability creates dramatically different experiences: Keto responders (benefit from low-carb): Individuals with severe insulin resistance, PCOS, or metabolic syndrome often experience improved insulin sensitivity, reduced glucose variability, decreased inflammation markers, and superior hunger control on low-carb diets. Sedentary or low-intensity exercisers (walking, yoga, light resistance training) maintain energy well on ketogenic macros since these activities efficiently use fat oxidation pathways. People who experience carbohydrate cravings, blood sugar crashes, or reactive hypoglycemia may find keto eliminates these triggers, improving adherence. Those who find fats more satiating than carbs naturally adhere better to higher-fat distributions. Higher-carb responders (struggle with keto): Athletes performing high-intensity training (HIIT, CrossFit, sprinting, heavy resistance training) experience significant performance decrements on keto—these activities depend on glycolytic energy systems requiring glucose unavailable during carb restriction. While 'keto-adaptation' (3-6 weeks) can restore some endurance performance, explosive power and strength typically remain 10-20% below glycogen-fueled capacity. Individuals who find carbohydrates more satiating (fiber-rich whole grains, fruits, vegetables providing volume and fullness) struggle with hunger on higher-fat diets. Active individuals with high TDEE (2,500+ calories) often find eating enough fat (200-300g) to meet calorie needs difficult and unpalatable. People with genetic variations affecting fat metabolism may experience elevated LDL cholesterol and inflammatory markers on very high-fat diets. Practical adherence considerations: Low-carb diets eliminate or severely restrict entire food categories (grains, most fruits, legumes, starchy vegetables), creating social challenges (restaurants, family meals, travel) and requiring significant meal planning. Some individuals find these restrictions clarifying and preferable to moderation approaches; others find them unsustainable long-term. Long-term sustainability research shows equivalent adherence rates and weight regain between low-carb and balanced diets at 12-24 months—initial enthusiasm for any diet tends to wane, and success correlates more with individual preference match than diet type. Hybrid approaches gaining popularity: Carb cycling—higher carbs on training days (supporting performance and glycogen restoration), lower carbs on rest days (enhancing fat oxidation). Example: 200g carbs training days, 80g rest days, weekly average 140g. Targeted keto—maintaining ketosis most days but consuming 25-50g fast-digesting carbs pre-workout to fuel high-intensity training without exiting ketosis long-term. Moderate low-carb (100-150g daily)—low enough to reduce insulin levels and improve glucose control in insulin-resistant individuals, high enough to support some glycogen restoration and performance. Medical applications where low-carb shows specific benefits beyond fat loss: Type 2 diabetes and pre-diabetes—carb restriction directly reduces blood glucose elevation and medication requirements. PCOS—low-carb improves insulin sensitivity and androgen levels. Epilepsy—ketogenic diet reduces seizure frequency through neuroprotective mechanisms. Certain neurological conditions—emerging research on ketones for Alzheimer's, Parkinson's, and traumatic brain injury. Key principle: Choose carbohydrate intake based on insulin sensitivity, training intensity, individual satiety response, and adherence preference—not based on claims about metabolic fat loss advantage that don't exist when calories and protein are controlled. A diet you can sustain long-term at appropriate calories always outperforms the theoretically 'optimal' diet you abandon after 8 weeks.",
    order: 3
  },
  {
    id: '4',
    question: "How many carbs should I eat for my activity level?",
    answer: "Carbohydrate needs scale primarily with training intensity and volume rather than total activity—high-intensity exercise depletes glycogen stores requiring substantial carbohydrate for replenishment, while low-intensity activity efficiently uses fat oxidation requiring minimal carbohydrate beyond brain needs (~120g daily). Evidence-based carbohydrate recommendations by activity level: Sedentary or minimal exercise (<30 min light activity daily): 100-150g (20-30% of 2,000 cal) or 0.5-1.0 g/lb bodyweight meets basic brain glucose needs (~120g/day) plus modest glycogen turnover. Lower end (100g) suits individuals with insulin resistance or preference for higher fats/protein; higher end (150g) accommodates inclusion of fruits, vegetables, and some whole grains without compromising fat loss or metabolic health. At this activity level, carb intake is primarily a preference variable—some thrive on 100g while others prefer 200g without meaningful difference in outcomes if calories and protein are matched. Light exercise or active lifestyle (30-60 min daily moderate activity): 150-200g (30-40% of 2,000 cal) or 1.0-1.5 g/lb bodyweight supports glycogen restoration from light resistance training, walking, recreational sports, or active occupations. This intake allows dietary flexibility including fruits, vegetables, whole grains, and modest portions of rice, oats, or bread while maintaining body composition. Individuals training primarily for general fitness and health can function well in this range. Moderate regular training (60-90 min daily, 4-6 days/week): 200-300g (40-50% of 2,500 cal) or 1.5-2.5 g/lb bodyweight optimizes recovery from consistent moderate-intensity resistance training, running, cycling, or mixed modalities. Athletes training at this volume performing at moderate intensities (conversations possible during exercise) deplete glycogen partially but not completely, requiring substantial but not maximal carbohydrate for restoration. This range supports strength progression, workout quality, and recovery while allowing balanced macronutrient distribution. High-volume or high-intensity training (90-120+ min daily): 300-450g (50-60% of 3,000+ cal) or 2.5-3.5 g/lb bodyweight necessary for athletes performing high-intensity interval training, CrossFit, competitive endurance sports, or two-a-day training sessions. These activities substantially deplete muscle glycogen (50-90% depletion per session) requiring aggressive carbohydrate restoration to maintain performance in subsequent sessions. Inadequate carbs at this training volume results in: progressive glycogen depletion across days (each session starting with less stored energy), decreased training intensity and power output (glycolytic energy system impaired), increased cortisol and decreased testosterone (hormonal response to perceived starvation during high energy demands), impaired recovery and increased injury risk, and potentially suppressed immune function from chronic energy deficiency. Elite endurance athletes (training 15-25+ hours weekly): 400-700g (55-65% of 4,000+ cal) or 3.5-5.5 g/lb bodyweight matches extreme glycogen demands from prolonged daily training. Tour de France cyclists, marathon runners logging 80-120 mile weeks, and triathletes require carbohydrate intake resembling full-time fuel consumption—their training volume creates energy expenditure of 4,000-7,000 calories daily, most from glycolytic pathways demanding constant carbohydrate replenishment. At this level, carbohydrate becomes performance-essential, not optional. Carbohydrate timing strategies for optimization: Pre-workout (1-3 hours before): 25-75g carbs depending on training intensity and duration provides readily available glucose to top off glycogen stores and prevent early fatigue. Lower-intensity or shorter sessions (<60 min) need minimal pre-workout carbs; high-intensity or longer sessions (>90 min) benefit from substantial pre-fueling. Intra-workout (during training): Generally unnecessary for sessions <90 minutes. For prolonged moderate-high intensity exercise exceeding 90 minutes, consuming 30-60g carbs hourly (sports drinks, gels, fruit) maintains blood glucose and delays glycogen depletion, improving performance in latter portions of training. Post-workout (0-2 hours after): 50-100g fast-digesting carbs (white rice, white potatoes, fruit, sports nutrition products) rapidly restore muscle glycogen depleted during training. The 'anabolic window' for protein is largely overstated, but glycogen restoration specifically occurs fastest in the 0-4 hours post-exercise when GLUT4 transporters remain elevated on muscle cell surfaces, increasing glucose uptake efficiency. Critical for athletes training again within 24 hours; less important if 48+ hours until next session. Daily distribution: Remaining carbohydrates distributed throughout other meals maintains energy, supports cognitive function, and provides glucose for general cellular metabolism. Carbohydrate quality considerations: Complex carbohydrates (oats, brown rice, quinoa, sweet potatoes, whole grains) provide sustained glucose release, higher fiber content supporting gut health and satiety, and superior micronutrient density (B vitamins, magnesium, iron). Simple/fast carbohydrates (white rice, white potatoes, fruit, sports drinks) cause rapid glucose elevation useful immediately pre/post-workout for quick energy availability or glycogen restoration, but provide minimal micronutrients and poor satiety when consumed away from training. Balanced intake emphasizing complex carbs for most meals with strategic simple carbs around training optimizes both performance and health. Individual metabolic factors: Insulin sensitivity—highly insulin-sensitive individuals efficiently store carbohydrates as muscle glycogen with minimal fat storage, functioning well on higher carb intakes (50-60%). Insulin-resistant individuals experience greater glucose elevation and fat storage from high carbs, often benefiting from moderate intakes (30-40%) with emphasis on low-glycemic sources. Body composition—leaner individuals (men <12% body fat, women <22%) typically maintain higher insulin sensitivity tolerating more carbs; higher body fat often correlates with reduced insulin sensitivity benefiting from lower carbs. Training history—athletes with years of endurance training develop greater glycogen storage capacity (trained muscles store 20-50% more glycogen than untrained) and improved fat oxidation at submaximal intensities, potentially requiring fewer carbs than untrained individuals performing identical exercise. Key principle: Carbohydrate intake should primarily match training glycogen demands, with sedentary individuals requiring only basic brain glucose needs (~120g) while high-volume athletes need 300-500+ grams daily. Adjust carbs based on training intensity changes—increasing carbs on heavy training days, reducing on rest or light days—rather than maintaining static intake regardless of activity fluctuations.",
    order: 4
  },
  {
    id: '5',
    question: "What's the minimum fat intake needed for health?",
    answer: "Minimum fat intake for basic health and hormonal function is approximately 0.3-0.4 g/lb (0.7-0.9 g/kg) bodyweight or 20-30% of total calories, with emphasis on essential fatty acids omega-3 and omega-6 that cannot be synthesized by the body. Extremely low-fat diets below these minimums risk hormonal disruption, vitamin deficiencies, inflammation, and neurological impairment despite allowing greater protein and carbohydrate intake within calorie budgets. Essential fatty acids (must obtain from diet): Omega-3 fatty acids (EPA and DHA from marine sources; ALA from plant sources)—crucial for: cardiovascular health through triglyceride reduction and blood pressure improvement, anti-inflammatory effects countering chronic inflammation underlying metabolic disease, cognitive function and neuroprotection (DHA is primary structural fat in brain), mood regulation (EPA shows antidepressant effects in clinical trials), and vision health (DHA concentrates in retinal photoreceptors). Minimum omega-3 intake: 250-500mg combined EPA/DHA daily for basic health; 1,000-2,000mg for anti-inflammatory and cardiovascular optimization. Sources: fatty fish (salmon, mackerel, sardines, anchovies) provide EPA/DHA directly; plant sources (flaxseed, chia, walnuts) provide ALA requiring conversion to EPA/DHA (conversion efficiency only 5-15%, making direct EPA/DHA sources superior). Omega-6 fatty acids (linoleic acid from plant oils, nuts, seeds)—necessary for: immune function and inflammatory responses to injury (controlled inflammation aids healing; chronic excess promotes disease), skin barrier function and moisture retention, blood clotting through prostaglandin production, and reproductive function. Minimum omega-6 intake: 12-17g daily (approximately 5-6% of 2,000 cal diet). However, most Western diets provide excessive omega-6 relative to omega-3 (typical ratio 15-20:1 versus optimal 4:1 or lower), contributing to chronic inflammation. Reducing vegetable oils (soybean, corn, sunflower high in omega-6) while increasing omega-3 sources improves fatty acid balance. Hormonal health and fat intake: Testosterone production requires adequate cholesterol and fat intake—studies show men consuming <20% calories from fat experience 10-15% decreased testosterone compared to 30-40% fat intake. This effect appears most pronounced below 0.3 g/lb (0.7 g/kg) bodyweight. Example: 180 lb man should consume minimum 54g fat daily to support hormonal health. Women's reproductive hormones (estrogen, progesterone) similarly depend on adequate fat for synthesis and regulation—extremely low-fat diets can disrupt menstrual cycles and impair fertility. Fat-soluble vitamin absorption: Vitamins A (vision, immune function, cellular differentiation), D (bone health, immune modulation, mood regulation), E (antioxidant protecting cells from oxidative damage), and K (blood clotting, bone metabolism) require dietary fats for intestinal absorption. Meals containing these vitamins but lacking fat result in minimal vitamin uptake. Example: eating a salad with carrots (vitamin A) but fat-free dressing drastically reduces vitamin A absorption compared to including olive oil or avocado. Cell membrane structure: Every cell in the body (approximately 37 trillion cells) is surrounded by a phospholipid bilayer membrane requiring fatty acids for structure and fluidity. Inadequate fat intake impairs membrane integrity, affecting nutrient transport, cellular signaling, and organelle function. Brain composition: The brain is approximately 60% fat by dry weight, with myelin sheaths insulating neurons consisting primarily of cholesterol and fatty acids. Inadequate fat intake during development impairs cognitive function; in adults, very low-fat diets may negatively affect memory, focus, and mood. Practical minimum fat recommendations by calorie intake: 1,500 calories: 50-60g fat (30-36% of calories) or ~0.3 g/lb for 150 lb person. 2,000 calories: 65-75g fat (29-34%) or ~0.3-0.4 g/lb for 170 lb person. 2,500 calories: 70-85g fat (25-31%) or ~0.3-0.4 g/lb for 200 lb person. 3,000 calories: 85-100g fat (26-30%) or ~0.3-0.4 g/lb for 230 lb person. Notice that minimum fat percentage decreases slightly at higher calorie intakes because absolute gram amounts (what matters physiologically) are met at lower percentages. A 200 lb athlete consuming 3,000 calories can meet minimum fat needs (~70g = 0.35 g/lb) at 21% fat, while a 130 lb person consuming 1,500 calories needs ~40g = 0.3 g/lb = 24% fat to reach the same relative intake. Fat quality considerations: Saturated fats (animal products, coconut oil, palm oil): Previously vilified but current research shows neutral-to-positive effects in context of whole-food sources (meat, eggs, dairy) when replacing refined carbohydrates. Limit processed sources (baked goods, fried foods) while including whole-food saturated fats as part of balanced intake. Moderate intake 7-10% of calories considered safe. Monounsaturated fats (olive oil, avocados, nuts, seeds): Consistently associated with improved cardiovascular health, insulin sensitivity, and inflammation markers. Mediterranean diet research emphasizes these fats as cornerstone of health. Should comprise largest fat category, 10-15% of calories. Polyunsaturated fats (omega-3 and omega-6 from fish, flaxseed, nuts, vegetable oils): Essential for health but oxidize easily—consume fresh sources, avoid heating polyunsaturated oils to high temperatures (creates harmful oxidation products). Emphasize omega-3-rich sources to balance typical omega-6 excess. 5-10% of calories. Trans fats (partially hydrogenated oils in processed foods): Artificial fats conclusively linked to cardiovascular disease, inflammation, and metabolic dysfunction. Avoid completely. Naturally occurring trans fats in small amounts in dairy/meat are not concerning. Scenarios where higher fat intakes (35-50% calories) may be beneficial: Ketogenic diets for medical conditions (epilepsy, certain metabolic disorders, therapeutic applications in neurological conditions). Individuals with severe insulin resistance who experience better glucose control and satiety on lower carbohydrate, higher fat distributions. Athletes in ultra-endurance events where fat oxidation efficiency provides fuel-sparing effects during prolonged low-moderate intensity exercise. Personal preference—some individuals genuinely find higher-fat foods more satiating and enjoyable, improving long-term adherence. Common errors with low-fat approaches: Replacing fats with refined carbohydrates (low-fat cookies, fat-free sweetened yogurt)—creates high-sugar, low-satiety diet promoting overconsumption and poor metabolic health. Better to replace fats with whole-food carbohydrates (fruits, vegetables, whole grains, legumes) when reducing fat percentage. Eliminating all oils and high-fat whole foods (nuts, seeds, avocados, fatty fish)—loses beneficial micronutrients, phytochemicals, and essential fatty acids these foods provide. Not considering absolute gram amounts—a 150 lb person in aggressive deficit eating 1,200 calories with '30% fat' only gets 40g fat (0.27 g/lb), below minimum needs despite seemingly adequate percentage. Key principle: Minimum fat intake should be calculated as grams per pound bodyweight (0.3-0.4 g/lb minimum) or absolute gram amount (50-70g minimum for most adults), not purely as calorie percentage. During calorie restriction, fat percentage must increase to maintain absolute gram intake necessary for hormonal and cellular health. Optimal intake ranges 25-35% of calories for most individuals balancing health, satiety, and macronutrient flexibility, with adjustments based on individual response, training demands, and metabolic health.",
    order: 5
  },
  {
    id: '6',
    question: "How do I track macros accurately and should I track every day?",
    answer: "Accurate macronutrient tracking requires systematic food measurement, database selection, consistency protocols, and understanding of tracking limitations—most people significantly underestimate intake by 20-50% without structured tracking methods. However, tracking intensity should match goals and individual psychology, ranging from meticulous daily logging for competitive physique athletes to intuitive eating for general health maintenance. Essential tracking methods for accuracy: Digital food scale (critical): Measuring food by weight (grams) rather than volume (cups, tablespoons) or eyeballing portions dramatically improves accuracy. Common errors without scale: '1 tablespoon' peanut butter typically measures 25-35g when weighed versus standardized 16g = 50-100 extra calories per serving. 'Medium' banana ranges 90-140g = 30-50 calorie variance. '1 cup' cooked rice varies 140-200g depending on grain type and packing = 60-90 calorie difference. Even 20-30 calories error across 5-6 daily items creates 100-180 calorie tracking gap—enough to eliminate a fat loss deficit. Weigh foods raw when possible (meat, grains, pasta) since cooking changes water content creating weight variability—100g raw chicken breast = 165 calories, but after cooking may weigh 65g (water loss) despite unchanged calories, causing confusion if tracked cooked without adjusting database entry. Reliable food database: MyFitnessPal, Cronometer, MacroFactor, and Lose It offer extensive databases, but user-submitted entries frequently contain errors. Verification strategies: Cross-reference entries against USDA FoodData Central database or product nutrition labels. For whole foods (chicken breast, broccoli, rice), search 'USDA chicken breast raw' to find verified entries. For packaged foods, scan barcodes or manually enter nutrition facts from label rather than searching by product name (user entries often outdated or incorrect). Create custom frequent foods for items you eat regularly to avoid re-searching and potential selection of wrong entries. Consistent measurement timing and preparation: Track foods as purchased/consumed: raw weight for ingredients you cook, package weight for prepared foods. Cooking oils count—1 tablespoon (14g) oil adds 120 calories often forgotten when cooking. Track 25-50% of added cooking oil depending on cooking method (some remains in pan). Condiments, sauces, beverages add up: 'splash' of milk in coffee (30ml) = 20 calories × 3 daily coffees = 60 calories. Ketchup, BBQ sauce, salad dressing easily add 100-200 calories if not tracked. Weekend and social eating—studies show people maintain strict tracking weekdays but underreport weekend intake by 30-40%, eliminating weekly deficits. Track weekend meals with same diligence as weekdays. Tracking intensity levels by goal: Competitive physique athletes (bodybuilding, physique competitions): Daily meticulous tracking with food scale, pre-planning meals, hitting macro targets within ±5g protein, ±10g carbs/fats. This precision optimizes body composition for stage-ready conditioning (men 5-8% body fat, women 12-15%) where small calorie errors meaningfully impact outcomes. Tracking typically 12-20 weeks pre-competition, with less rigid off-season approaches. Active fat loss or muscle gain phases: Daily tracking hitting protein targets precisely (±5-10g), allowing more flexibility with carbs/fats (±20-30g) as long as total calories align with goals. Weigh most foods but allow estimation for low-calorie vegetables, condiments <50 calories. This approach balances results with sustainability for 8-16 week focused phases. Most people find this level manageable medium-term but exhausting long-term. Maintenance or general fitness: Tracking 5-6 days weekly, taking 1-2 days 'off' eating intuitively (often weekends). Still weighing portions for calorie-dense foods (oils, nuts, grains, proteins) but estimating vegetables and using hand-portion methods occasionally. Hitting weekly macro averages rather than daily precision. This semi-structured approach maintains body composition while reducing tracking fatigue and allowing dietary flexibility for social events. Habit-building phase (learning portion sizes and food composition): Daily tracking for 4-12 weeks to develop intuitive sense of portion sizes and macro content. After education period, many successfully transition to intuitive eating having internalized what appropriate portions and balanced meals look like. Tracking occasionally (1 week monthly) to calibrate and ensure intuition remains accurate. General health without specific body composition goals: No tracking or occasional 3-day tracking assessment (1 weekend day, 2 weekdays) quarterly to check baseline intake quality. Focus on food quality, hunger/fullness cues, and overall dietary patterns rather than macro precision. Appropriate for individuals maintaining stable weight without physique goals. Tracking accuracy limitations to understand: Food label regulations allow ±20% calorie variance from stated nutrition facts—a '200 calorie' packaged meal may legally contain 160-240 calories. This regulatory tolerance means even perfect tracking includes inherent error. Restaurant meals extremely variable—even chain restaurants with published nutrition show ±20-30% calorie variance between locations due to cooking methods and portion inconsistency. Assume restaurant meals may be 20% higher than listed calories. Macronutrient rounding—foods listed as '0g fat' may contain 0.4g per serving (FDA allows rounding <0.5g to zero), and multiple such servings create untracked fat intake. Particularly common with cooking sprays ('0 calories per 0.25 second spray'—but actual spray is 1-2 seconds = 20-50 calories). Fiber paradox—high-fiber foods' calories are partially unavailable due to fermentation by gut bacteria and incomplete absorption. Calorie counts assume 4 cal/g for all carbohydrates, but resistant starch and fiber provide closer to 2 cal/g. Very high-fiber diets may effectively provide 5-10% fewer absorbable calories than tracked. Digestive efficiency varies—individuals with inflammatory bowel conditions, SIBO, low stomach acid, or other GI issues may absorb 10-20% fewer calories than individuals with optimal digestion eating identical food. Tracking shows identical intake but actual energy absorption differs. Given these limitations, even perfect tracking includes ±10-15% error margin. This reinforces that tracking provides valuable estimates and consistency tools but not absolute truth—real-world results (scale weight, measurements, photos) over 3-4 weeks indicate if tracked intake aligns with goals, requiring adjustment based on outcomes rather than assuming calculations are perfect. Psychological considerations: Tracking benefits: Removes guesswork, provides data-driven adjustments, increases awareness of portion sizes and food composition, creates accountability, and empowers individuals who like structure and control. Tracking risks: Can promote obsessive behaviors in susceptible individuals, creates stress and anxiety around food choices, reduces dietary spontaneity and social enjoyment, may trigger or worsen disordered eating patterns in vulnerable populations, and risks defining self-worth by adherence to numbers rather than overall health. Who should avoid detailed tracking: Individuals with current or history of eating disorders (anorexia, bulimia, orthorexia, binge eating), those experiencing significant food-related anxiety, people for whom tracking creates more stress than benefit, and anyone noticing tracking negatively affecting relationship with food or social functioning. These individuals benefit from alternative approaches: hunger-fullness scales, hand-portion methods, plate composition (1/2 vegetables, 1/4 protein, 1/4 starch), or work with registered dietitians specializing in intuitive eating. Practical hybrid approach: Track diligently during active fat loss or muscle gain phases (8-16 weeks), then transition to tracking 2-3 days weekly during maintenance to spot-check intake remains appropriate without daily burden. Use periodic diet breaks (2 weeks every 8-12 weeks during prolonged diets) where tracking pauses, eating at estimated maintenance intuitively to provide psychological relief while metabolically beneficial. Key principle: Macronutrient tracking is a tool for education, consistency, and data-driven adjustment—not a permanent life requirement or measure of dietary virtue. Use tracking intensity matching your goals and psychology: meticulous during focused physique phases, moderate during general fitness pursuits, minimal during maintenance or if tracking causes more harm than benefit. Results (body composition changes, energy levels, performance, health markers) over 4-8 weeks determine if current approach works, regardless of tracking precision—if not progressing toward goals, adjust intake based on real-world feedback, not adherence to theoretical calculations.",
    order: 6
  }
];

export default function MacronutrientCalculatorClient() {
  const [calories, setCalories] = useState(2000);
  const [goal, setGoal] = useState('balanced');
  const [customProtein, setCustomProtein] = useState(30);
  const [customCarbs, setCustomCarbs] = useState(40);
  const [customFats, setCustomFats] = useState(30);
  const [useCustom, setUseCustom] = useState(false);
  const [results, setResults] = useState<any>(null);

  const macroPresets: any = {
    'balanced': { protein: 30, carbs: 40, fats: 30, name: 'Balanced Diet' },
    'high-protein': { protein: 40, carbs: 30, fats: 30, name: 'High Protein' },
    'low-carb': { protein: 35, carbs: 20, fats: 45, name: 'Low Carb' },
    'keto': { protein: 25, carbs: 5, fats: 70, name: 'Ketogenic' },
    'low-fat': { protein: 30, carbs: 55, fats: 15, name: 'Low Fat' },
    'zone': { protein: 30, carbs: 40, fats: 30, name: 'Zone Diet' },
    'athlete': { protein: 25, carbs: 55, fats: 20, name: 'Athletic Performance' }
  };

  const calculateMacros = () => {
    let proteinPct, carbsPct, fatsPct;

    if (useCustom) {
      proteinPct = customProtein;
      carbsPct = customCarbs;
      fatsPct = customFats;
    } else {
      const preset = macroPresets[goal];
      proteinPct = preset.protein;
      carbsPct = preset.carbs;
      fatsPct = preset.fats;
    }

    const proteinCal = calories * (proteinPct / 100);
    const carbsCal = calories * (carbsPct / 100);
    const fatsCal = calories * (fatsPct / 100);

    const proteinGrams = proteinCal / 4;
    const carbsGrams = carbsCal / 4;
    const fatsGrams = fatsCal / 9;

    const total = proteinPct + carbsPct + fatsPct;

    setResults({
      proteinPct,
      carbsPct,
      fatsPct,
      proteinCal: Math.round(proteinCal),
      carbsCal: Math.round(carbsCal),
      fatsCal: Math.round(fatsCal),
      proteinGrams: Math.round(proteinGrams),
      carbsGrams: Math.round(carbsGrams),
      fatsGrams: Math.round(fatsGrams),
      total,
      isValid: Math.abs(total - 100) < 1
    });
  };

  useEffect(() => {
    calculateMacros();
  }, [calories, goal, customProtein, customCarbs, customFats, useCustom]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Macronutrient Calculator</h1>
        <p className="text-lg text-gray-600">Calculate optimal protein, carbohydrates, and fats distribution for your diet goals</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Calorie & Diet Goals</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calorie Target</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                min="1000"
                max="5000"
                step="50"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Macro Distribution</label>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Use custom ratios</span>
              </div>

              {!useCustom ? (
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(macroPresets).map(([key, preset]: any) => (
                    <option key={key} value={key}>
                      {preset.name} ({preset.protein}/{preset.carbs}/{preset.fats})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Protein: {customProtein}%</label>
                    <input
                      type="range"
                      value={customProtein}
                      onChange={(e) => setCustomProtein(Number(e.target.value))}
                      min="10"
                      max="60"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Carbs: {customCarbs}%</label>
                    <input
                      type="range"
                      value={customCarbs}
                      onChange={(e) => setCustomCarbs(Number(e.target.value))}
                      min="5"
                      max="70"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Fats: {customFats}%</label>
                    <input
                      type="range"
                      value={customFats}
                      onChange={(e) => setCustomFats(Number(e.target.value))}
                      min="10"
                      max="70"
                      className="w-full"
                    />
                  </div>
                  {results && !results.isValid && (
                    <div className="text-sm text-red-600">
                      ⚠️ Total should equal 100% (currently {results.total}%)
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Macro Functions</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Protein (4 cal/g):</strong> Muscle building & repair</p>
                <p><strong>Carbs (4 cal/g):</strong> Primary energy source</p>
                <p><strong>Fats (9 cal/g):</strong> Hormones & cell structure</p>
              </div>
            </div>
          </div>
        </div>

        {results && results.isValid && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Macro Targets</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-800">Protein</span>
                    <span className="text-sm text-blue-600">{results.proteinPct}%</span>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1">{results.proteinGrams}g</div>
                  <div className="text-sm text-blue-700">{results.proteinCal} calories</div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${results.proteinPct}%` }}></div>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-800">Carbohydrates</span>
                    <span className="text-sm text-green-600">{results.carbsPct}%</span>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-1">{results.carbsGrams}g</div>
                  <div className="text-sm text-green-700">{results.carbsCal} calories</div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${results.carbsPct}%` }}></div>
                  </div>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-orange-800">Fats</span>
                    <span className="text-sm text-orange-600">{results.fatsPct}%</span>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mb-1">{results.fatsGrams}g</div>
                  <div className="text-sm text-orange-700">{results.fatsCal} calories</div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${results.fatsPct}%` }}></div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Calories:</span>
                    <span>{calories} cal/day</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-3 sm:p-4 md:p-6">
              <h4 className="font-semibold text-purple-800 mb-3">📊 Meal Planning Tips</h4>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Spread protein evenly across meals</li>
                <li>• Time carbs around workouts</li>
                <li>• Include healthy fats in each meal</li>
                <li>• Track using a food diary app</li>
                <li>• Adjust based on progress</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-blue-800 mb-2">High Protein Foods</h3>
          <p className="text-sm text-blue-700">Chicken, fish, eggs, Greek yogurt, lean beef, tofu, legumes</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-green-800 mb-2">Healthy Carbs</h3>
          <p className="text-sm text-green-700">Oats, rice, quinoa, sweet potato, fruits, whole grains</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-orange-800 mb-2">Healthy Fats</h3>
          <p className="text-sm text-orange-700">Avocado, nuts, olive oil, salmon, eggs, nut butter</p>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Mastering Macronutrients: The Science of Optimal Nutrition</h2>

        <div className="prose prose-lg max-w-none text-gray-700">
          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">The Three Macronutrients: Essential Roles and Functions</h3>
          <p className="mb-4">
            Macronutrients—protein, carbohydrates, and fats—represent the cornerstone of human nutrition, each serving indispensable and non-interchangeable physiological functions. Understanding their distinct roles enables strategic nutritional planning aligned with individual goals, activity demands, and metabolic health. Protein functions as the structural and functional foundation of human physiology, comprising approximately 16% of total body weight in adults with lean body composition. Every tissue, enzyme, hormone, antibody, and transport molecule requires protein-derived amino acids for synthesis and maintenance. Skeletal muscle, the largest protein reservoir in the body (approximately 40% of total body mass in healthy adults), undergoes constant turnover—synthesizing and breaking down 1-2% daily, creating substantial ongoing protein requirements to maintain or build muscle tissue.
          </p>
          <p className="mb-4">
            The 20 amino acids required for protein synthesis include 9 essential amino acids (EAAs) that cannot be manufactured by human metabolism and must be obtained through dietary intake: histidine, isoleucine, leucine, lysine, methionine, phenylalanine, threonine, tryptophan, and valine. Leucine specifically triggers muscle protein synthesis through mTOR pathway activation, requiring approximately 2-3 grams per feeding to maximally stimulate anabolic signaling. Beyond structural functions, protein exhibits unique metabolic properties: the thermic effect of food (TEF) for protein reaches 20-30%, meaning 20-30% of protein calories are expended during digestion, absorption, and processing—substantially higher than carbohydrates (5-10%) or fats (0-3%). This increased energy expenditure from protein metabolism contributes modestly but meaningfully to total daily energy expenditure, particularly at higher protein intakes.
          </p>
          <p className="mb-4">
            Carbohydrates serve as the body's preferred rapid energy source, particularly for high-intensity exercise and obligate glucose-dependent tissues. The brain consumes approximately 120 grams of glucose daily (480 calories) under normal conditions, representing 20% of resting metabolism despite comprising only 2% of body weight. While the brain can adapt to utilize ketone bodies during prolonged carbohydrate restriction (ketogenic diets), this metabolic shift requires 3-7 days of adaptation and may not fully restore cognitive performance for all individuals. Dietary carbohydrates, digested into glucose, either oxidize immediately for energy through glycolysis and the citric acid cycle, or store as glycogen in skeletal muscle (300-400 grams) and liver (70-100 grams) for later use. Glycogen serves as the primary fuel for high-intensity exercise—activities above 60-70% VO2 max rely predominantly on glycolytic pathways that cannot efficiently utilize fat oxidation.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Protein Requirements: From Deficiency Prevention to Optimization</h3>
          <p className="mb-4">
            The Recommended Dietary Allowance (RDA) for protein—0.36 g/lb (0.8 g/kg) bodyweight—represents the minimum intake necessary to prevent deficiency and maintain nitrogen balance in sedentary adults. However, this baseline recommendation proves inadequate for individuals engaged in resistance training, pursuing body composition goals, restricting calories, or aging adults experiencing anabolic resistance. Contemporary sports nutrition research establishes higher protein requirements across diverse populations and goals.
          </p>
          <p className="mb-4">
            For muscle building in calorie surplus, 0.7-1.0 g/lb (1.6-2.2 g/kg) bodyweight optimizes muscle protein synthesis and supports hypertrophic adaptations to resistance training. Meta-analyses show protein intakes above 0.8 g/lb provide minimal additional muscle-building benefit in surplus conditions—the anabolic stimulus from adequate calories and training stimulus saturates protein synthesis pathways. During fat loss in calorie deficit, protein requirements increase substantially to 0.8-1.2 g/lb (1.8-2.6 g/kg) to preserve lean mass against catabolic pressures from energy restriction. Higher protein during deficits serves multiple protective functions: maintains muscle protein synthesis despite reduced insulin and mTOR signaling, increases satiety through gut hormone release (GLP-1, PYY, CCK) improving dietary adherence, elevates total energy expenditure through increased thermic effect of food, and prevents metabolic adaptation by supporting maintenance of metabolically active tissue.
          </p>
          <p className="mb-4">
            Older adults (60+ years) require 0.8-1.0 g/lb (1.8-2.2 g/kg) to combat sarcopenia and anabolic resistance—the age-related decline in muscle protein synthesis sensitivity to amino acid stimulation. Research demonstrates older adults require approximately 40 grams protein per meal (versus 20-25 grams for younger adults) to maximally stimulate muscle protein synthesis, attributed to reduced leucine sensitivity and impaired amino acid transport. Distribution of protein intake across 3-6 daily feedings optimizes muscle protein synthesis through repeated leucine threshold stimulation, though total daily protein intake matters substantially more than precise timing for most individuals.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Carbohydrate Strategy: Matching Intake to Activity Demands</h3>
          <p className="mb-4">
            Carbohydrate requirements vary dramatically based on training intensity and volume rather than total activity. Sedentary individuals require only basic brain glucose needs (approximately 120 grams daily) plus modest amounts for general cellular metabolism, totaling 100-150 grams for metabolic function without performance considerations. This baseline allows substantial dietary flexibility—some individuals thrive on 100 grams while others prefer 200+ grams daily without meaningful outcome differences when total calories and protein remain controlled. Individual carbohydrate tolerance depends heavily on insulin sensitivity, which varies based on body composition (leaner individuals typically maintain higher insulin sensitivity), genetics (PPAR-gamma and other variants affect glucose metabolism), and training status (endurance-trained athletes develop enhanced glycogen storage capacity and improved fat oxidation at submaximal intensities).
          </p>
          <p className="mb-4">
            Athletes performing high-intensity training require substantially elevated carbohydrate intakes to support glycogen restoration and performance. Moderate training (60-90 minutes daily, 4-6 days weekly) necessitates 200-300 grams (1.5-2.5 g/lb bodyweight) to optimize recovery and maintain training quality across consecutive sessions. High-volume or high-intensity athletes (90-120+ minutes daily) need 300-450 grams (2.5-3.5 g/lb) to prevent progressive glycogen depletion, hormonal disruption (elevated cortisol, suppressed testosterone from perceived energy deficit), and performance decrements. Elite endurance athletes may require 400-700 grams daily (3.5-5.5 g/lb) matching extreme glycogen demands from prolonged daily training creating total energy expenditure of 4,000-7,000 calories.
          </p>
          <p className="mb-4">
            Carbohydrate timing strategies can modestly enhance performance and recovery: pre-workout carbohydrates (25-75 grams 1-3 hours before training) top off glycogen stores and provide readily available glucose; intra-workout carbohydrates (30-60 g/hour during sessions exceeding 90 minutes) maintain blood glucose and delay glycogen depletion; post-workout carbohydrates (50-100 grams within 0-2 hours) rapidly restore muscle glycogen when GLUT4 transporters remain elevated on muscle cell surfaces. However, total daily carbohydrate intake matters substantially more than precise nutrient timing for individuals training once daily with 24+ hours between sessions.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Dietary Fats: Essential Functions and Minimum Requirements</h3>
          <p className="mb-4">
            Dietary fats enable critical physiological functions often underappreciated in fat-phobic dietary approaches. Cell membrane structure depends on phospholipid bilayers surrounding the approximately 37 trillion cells in the human body—inadequate fat intake compromises membrane fluidity affecting nutrient transport, cellular signaling, and organelle function. Steroid hormones including testosterone, estrogen, progesterone, and cortisol derive from cholesterol, requiring adequate fat and cholesterol intake for synthesis. Research demonstrates men consuming less than 20% of calories from fat experience 10-15% decreased testosterone compared to 30-40% fat intake, with effects most pronounced below 0.3 g/lb (0.7 g/kg) bodyweight.
          </p>
          <p className="mb-4">
            Essential fatty acids—omega-3 (EPA, DHA, ALA) and omega-6 (linoleic acid)—cannot be synthesized by human metabolism and must be obtained through diet. Omega-3 fatty acids provide anti-inflammatory effects countering chronic inflammation underlying metabolic disease, support cardiovascular health through triglyceride reduction and blood pressure improvement, enable cognitive function and neuroprotection (DHA is the primary structural fat in brain gray matter), and regulate mood (EPA demonstrates antidepressant effects in clinical trials). Minimum omega-3 intake of 250-500mg combined EPA/DHA daily supports basic health; 1,000-2,000mg optimizes anti-inflammatory and cardiovascular benefits. Fatty fish (salmon, mackerel, sardines, anchovies) provide EPA/DHA directly, while plant sources (flaxseed, chia, walnuts) provide ALA requiring conversion to EPA/DHA—conversion efficiency of only 5-15% makes marine sources superior for meeting omega-3 requirements.
          </p>
          <p className="mb-4">
            Fat-soluble vitamins A, D, E, and K require dietary fats for intestinal absorption—meals containing these vitamins but minimal fat result in substantially reduced vitamin uptake. For example, consuming a salad with carrots (rich in vitamin A precursor beta-carotene) but fat-free dressing provides minimal vitamin A absorption compared to including olive oil or avocado. Minimum fat intake for hormonal health and essential fatty acid requirements is approximately 0.3-0.4 g/lb (0.7-0.9 g/kg) bodyweight or 20-30% of total calories. Extremely low-fat diets below these minimums risk hormonal disruption, vitamin deficiencies, increased inflammation from essential fatty acid insufficiency, and potentially impaired neurological function.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Macronutrient Distribution Strategies: Popular Approaches and Individual Optimization</h3>
          <p className="mb-4">
            Multiple macronutrient distribution patterns can successfully support various goals when total calories and protein remain appropriate. Balanced macronutrient distributions (30% protein, 40% carbs, 30% fats) provide dietary flexibility, support diverse food preferences, and suit individuals with average insulin sensitivity and moderate activity levels. This approach accommodates both whole-food carbohydrates (fruits, vegetables, whole grains, legumes) and healthy fats (nuts, seeds, avocados, olive oil, fatty fish) within calorie budgets while meeting protein requirements.
          </p>
          <p className="mb-4">
            Higher-carbohydrate distributions (25% protein, 50-60% carbs, 15-25% fats) benefit athletes performing high-volume training, individuals with high insulin sensitivity efficiently storing carbohydrates as muscle glycogen rather than fat, and those who experience superior satiety and adherence with higher-carb intake. Athletic performance diets often emphasize carbohydrates to support glycogen restoration, maintain training intensity, and optimize recovery. However, very active individuals must ensure absolute fat intake remains adequate (minimum 0.3-0.4 g/lb) despite lower fat percentages—a 180-pound athlete consuming 3,000 calories can meet minimum fat needs at 20% fat (67 grams), but must not reduce percentages further without compromising hormonal health.
          </p>
          <p className="mb-4">
            Lower-carbohydrate distributions (30-40% protein, 20-35% carbs, 35-45% fats) suit individuals with insulin resistance or metabolic syndrome who experience improved glucose control and reduced postprandial glucose spikes with carbohydrate restriction, sedentary or low-intensity exercisers whose energy demands allow adequate function on reduced glycogen availability, and those who find higher-fat foods more satiating improving dietary adherence. Ketogenic distributions (20-25% protein, 5-10% carbs, 70-75% fats) force metabolic adaptation to fat-based fuel through severe carbohydrate restriction ({'<'}50 grams daily), creating nutritional ketosis where the liver produces ketone bodies from fatty acids to fuel the brain and tissues normally relying on glucose. While ketogenic diets offer no metabolic fat loss advantage when calories and protein are controlled—fat loss fundamentally depends on calorie deficit, not carbohydrate restriction—some individuals experience superior hunger control, improved markers in insulin resistance or metabolic syndrome, and medical benefits for specific conditions (epilepsy, certain neurological disorders).
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Practical Implementation: Tracking, Adjustment, and Long-Term Sustainability</h3>
          <p className="mb-4">
            Successful macronutrient management requires systematic tracking during learning and optimization phases, followed by potential transition to more intuitive approaches once nutritional literacy develops. Digital food scales provide accuracy essential for initial calibration—measuring food by weight in grams eliminates the substantial errors inherent in volume measurements or visual estimation, which typically underestimate intake by 20-50%. Common tracking errors include forgetting cooking oils (1 tablespoon = 120 calories), underreporting condiments and beverages, and weekend intake underreporting by 30-40% compared to weekday tracking, collectively eliminating intended calorie deficits.
          </p>
          <p className="mb-4">
            Tracking intensity should match goals and individual psychology. Competitive physique athletes require meticulous daily tracking hitting targets within ±5 grams protein, ±10 grams carbs/fats to optimize body composition for stage-ready conditioning (men 5-8% body fat, women 12-15%) where small errors meaningfully impact outcomes. Active fat loss or muscle gain phases benefit from daily tracking hitting protein targets precisely (±5-10g) while allowing flexibility with carbs/fats (±20-30g) as long as total calories align—this approach balances results with sustainability for 8-16 week focused phases. Maintenance or general fitness allows tracking 5-6 days weekly with 1-2 intuitive days, hitting weekly averages rather than daily precision. General health without specific body composition goals may require no tracking or occasional 3-day assessments quarterly to check baseline intake quality.
          </p>
          <p className="mb-4">
            Critical to long-term success is understanding that calculated macronutrient targets provide starting estimates requiring real-world validation and individualized adjustment. Even perfect tracking includes ±10-15% error from food label tolerances (regulations allow ±20% variance), restaurant meal inconsistency, digestive efficiency variation, and macronutrient rounding on labels. Therefore, body composition changes, energy levels, performance metrics, and subjective wellbeing over 4-8 weeks determine if current macronutrient distribution works—not adherence to theoretical calculations. If not progressing toward goals, adjust intake based on real-world feedback: losing weight too quickly suggests increasing calories slightly to preserve muscle; not losing weight despite consistent deficit tracking suggests reducing calories by 100-200 or reassessing portion accuracy; experiencing persistent hunger, fatigue, or hormonal dysfunction suggests reassessing macronutrient distribution prioritizing adequate protein and minimum fat requirements.
          </p>
          <p className="mb-4">
            Psychological considerations warrant careful attention. Macronutrient tracking benefits individuals who appreciate structure, data-driven decision-making, and accountability, but risks promoting obsessive behaviors, food-related anxiety, and disordered eating patterns in susceptible individuals. Those with current or historical eating disorders, significant food-related stress, or noticing tracking negatively affecting quality of life should pursue alternative approaches: hunger-fullness scales, hand-portion methods (palm-sized protein, fist-sized carbs, thumb-sized fats), plate composition guidelines (1/2 vegetables, 1/4 protein, 1/4 starch), or professional guidance from registered dietitians specializing in intuitive eating. A successful nutritional approach balances physiological optimization with psychological sustainability—the theoretically perfect diet abandoned after 8 weeks due to adherence failure underperforms the sustainable good-enough approach maintained long-term.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <FirebaseFAQs pageId="macronutrient-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
