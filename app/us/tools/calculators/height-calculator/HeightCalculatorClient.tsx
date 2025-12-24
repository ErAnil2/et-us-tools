'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "How accurate are height prediction calculators?",
    answer: "Height prediction calculators using the mid-parent height method achieve moderate accuracy, typically within ±4 inches (10 cm) of actual adult height for 68% of children, and within ±8 inches (20 cm) for 95% of children. Accuracy improves as children age and approach their final adult height. The mid-parent formula calculates the average of both parents' heights, then adds 6.5 cm (2.5 inches) for boys or subtracts 6.5 cm for girls to account for sex-based height differences. This method works because height is highly heritable—genetic factors account for approximately 80% of height variation in populations, with environmental factors (nutrition, health, lifestyle) contributing the remaining 20%. However, several factors limit prediction accuracy: genetic variation beyond simple inheritance (recessive tall/short genes, genetic mutations), nutritional status during critical growth periods (particularly ages 0-3 and puberty), chronic health conditions affecting growth (growth hormone deficiency, celiac disease, hypothyroidism), extreme environmental factors (malnutrition, chronic illness, certain medications), and regression to the mean (very tall or very short parents tend to have children closer to population average). More sophisticated prediction methods improve accuracy: the Khamis-Roche method incorporates child's current height, weight, and mid-parent height (accurate within ±2 inches for 50% of children), bone age assessment via hand/wrist X-rays comparing skeletal maturity to chronological age (most accurate method, particularly for children with growth disorders), and growth chart tracking showing a child's height percentile trajectory over time tends to remain consistent, allowing future projection.",
    order: 1
  },
  {
    id: '2',
    question: "What factors besides genetics affect how tall a child will grow?",
    answer: "While genetics determines approximately 80% of adult height potential, environmental and health factors significantly influence whether children reach their genetic height potential. Nutrition during growth periods: Adequate protein intake (supporting collagen and bone matrix formation, muscle development) is crucial—children need 0.95-1.0 g protein per kg bodyweight daily during growth spurts. Calcium and vitamin D (600-1000 IU daily for children) are essential for bone mineralization and lengthening. Micronutrient deficiencies, particularly zinc, iron, and vitamin A, impair growth—studies show stunting prevalence correlates strongly with nutritional deficiency. The first 1,000 days (conception through age 2) represent the most critical nutrition window—malnutrition during this period causes irreversible height deficits. Sleep quality and duration: Growth hormone secretion peaks during deep sleep (slow-wave sleep stages 3-4), with 70% of daily growth hormone released at night. Children need 9-12 hours nightly during growth periods—chronic sleep deprivation (consistently <8 hours) can reduce adult height by 1-2 inches. Sleep timing matters: growth hormone pulses occur 1-2 hours after sleep onset, so consistent bedtimes optimize hormone release patterns. Physical activity and exercise: Weight-bearing activities (running, jumping, sports) stimulate bone growth through mechanical loading, increasing bone density and potentially enhancing long bone growth. Resistance training in adolescents, contrary to myths, does NOT stunt growth when performed with proper form—studies show it may actually enhance bone density. However, extreme training in young athletes (elite gymnastics, ballet) with energy deficits can delay puberty and reduce final height. Medical conditions and treatments: Growth hormone deficiency (1 in 3,500 children) causes severe short stature if untreated—GH replacement therapy can add 4-6 inches to adult height when started early. Hypothyroidism, celiac disease, inflammatory bowel disease, and chronic kidney disease all impair growth. Corticosteroid medications (for asthma, autoimmune conditions) suppress growth—prolonged use can reduce adult height by 1-1.5 cm per year of treatment. Precocious puberty (early onset) causes initial height advantage but earlier growth plate closure, ultimately reducing adult height. Psychosocial factors: Chronic severe stress (abuse, neglect) can cause psychosocial short stature through cortisol elevation and growth hormone suppression—children removed from abusive situations often show catch-up growth.",
    order: 2
  },
  {
    id: '3',
    question: "At what age do children stop growing taller?",
    answer: "The age when growth ceases varies by sex, individual genetics, and pubertal timing, but follows predictable patterns. Girls typically complete linear growth earlier: Growth spurt onset occurs at ages 8-13 (average age 10-11), coinciding with early puberty and breast development (thelarche). Peak height velocity—the fastest growth rate—occurs approximately 6-12 months before menarche (first menstruation), averaging 8-9 cm (3-3.5 inches) per year. After menarche, girls typically grow an additional 5-7 cm (2-3 inches) over 1-2 years as growth decelerates. Most girls reach final adult height by ages 14-16, though some continue minimal growth until age 18. Total puberty-related growth in girls averages 25 cm (10 inches) from growth spurt onset to cessation. Boys complete growth later: Growth spurt begins at ages 10-16 (average age 12-13), coinciding with testicular enlargement and other pubertal changes. Peak height velocity occurs later than girls, around age 13-14, averaging 10-11 cm (4-4.5 inches) per year—boys grow faster at peak than girls. After peak velocity, boys continue growing 3-4 more years at decelerating rates. Most boys reach final adult height by ages 16-18, though some continue minimal growth until ages 19-21. Total puberty-related growth in boys averages 28 cm (11 inches), explaining the average adult male-female height difference. Growth plate closure determines final height: Long bones grow at growth plates (epiphyseal plates)—cartilaginous regions near bone ends that ossify (harden into bone) when growth completes. Estrogen triggers growth plate fusion—this occurs in both sexes but earlier in females due to higher estrogen levels. Growth plates close sequentially, not simultaneously: hand and foot bones close first (ages 14-16 in girls, 16-18 in boys), then arm and leg bones (ages 15-17 girls, 17-19 boys), with spine continuing growth latest (into early 20s in some individuals). X-ray bone age assessment can determine remaining growth potential by examining growth plate status. Late bloomers (delayed puberty): Children entering puberty later than average continue growing after peers stop, sometimes reaching similar or taller final heights despite being shorter during childhood. Constitutional growth delay (family pattern of late puberty and late growth cessation) allows extended growth periods. Growth after age 18-21 is extremely rare and typically indicates: growth hormone excess (pituitary tumor), or extremely delayed puberty (medical condition).",
    order: 3
  },
  {
    id: '4',
    question: "Why are children sometimes much taller or shorter than their parents?",
    answer: "While children's heights correlate with parental heights (correlation coefficient ~0.5-0.7), significant variation occurs due to complex genetic inheritance and environmental factors. Polygenic inheritance complexity: Height is influenced by 700+ genetic variants (identified by genome-wide association studies) across multiple chromosomes, each contributing small effects. Children inherit random combinations of height-influencing alleles from both parents—siblings can differ substantially in height despite identical parents. Recessive genes: Parents may carry 'hidden' tall or short alleles that don't affect their own heights but combine in children, creating unexpected outcomes. Genetic mutations: Spontaneous mutations (occurring in ~1 in 100 births) can affect growth pathways, causing children to be much taller or shorter than genetic predictions. Regression to the mean (statistical phenomenon): Very tall parents (both 95th percentile) tend to have children slightly shorter than themselves, though still tall—averaging closer to population mean. Very short parents tend to have children slightly taller than themselves. This occurs because extreme parental heights partially result from favorable/unfavorable combinations of genetic variants that rarely fully transmit to offspring. For example, 6'4\" father and 5'10\" mother (both very tall) might have a son who reaches only 6'1\"—tall by population standards but shorter than expected from simple averaging. Environmental differences between generations: Improved nutrition: Children growing up with better nutrition than parents (particularly in immigrant families or developing countries) often exceed parental heights by 2-4 inches—this explains increasing average heights in populations over time (secular trend). Access to healthcare: Treatment of childhood illnesses, growth disorders, and nutritional deficiencies allows children to reach genetic potential their parents couldn't. Economic improvement: Studies show each generation tends to be taller in developing economies with improving living standards. Negative environmental factors: Conversely, children experiencing worse nutrition, chronic illness, or stress than parents may fall short of genetic potential. Assortative mating and genetic diversity: Tall individuals tend to partner with tall individuals (positive assortative mating), but this isn't universal—when very different-height parents reproduce, children heights cluster around mid-parent height with wide variation. Mixed ancestry: Children of parents from populations with different average heights (e.g., Northern European × Southeast Asian) show wide height variation depending on which genetic variants inherited. Sex chromosome effects: Sons and daughters inherit X chromosomes differently—some height genes reside on X chromosomes, causing different expression patterns. Girls inherit one X from each parent while boys inherit mother's X and father's Y, creating sex-specific height outcomes. Epigenetic factors: Environmental influences on gene expression (nutrition, stress, toxins) during prenatal development and early childhood can modify how height genes function, independent of DNA sequence inherited.",
    order: 4
  },
  {
    id: '5',
    question: "Can you increase your height after puberty or as an adult?",
    answer: "After growth plates fully close (typically ages 16-18 for females, 18-21 for males), increasing skeletal height through bone lengthening is biologically impossible through natural means—no supplements, exercises, or lifestyle changes can make bones grow longer once fused. However, several factors can influence measured height in adults: Spinal decompression and posture improvement: The spine contains 23 intervertebral discs that compress throughout the day under body weight and gravity—adults are typically 1-2 cm (0.4-0.8 inches) taller in the morning than evening. Chronic poor posture (forward head, rounded shoulders, excessive lumbar curve) can reduce height by 1-3 cm (0.4-1.2 inches) by compressing spine and creating mechanical inefficiency. Correcting posture through strengthening exercises (core stabilization, back extensors, scapular retractors) and stretching tight muscles (hip flexors, hamstrings, pectorals) can restore 0.5-2 cm of height. Spinal health and disc integrity: Degenerative disc disease (natural aging process) causes disc height loss of approximately 0.5-1 cm per decade after age 40, with total height loss averaging 2-5 cm (1-2 inches) from age 30 to 80. Maintaining hydration, avoiding smoking (reduces disc nutrition), and regular exercise (promotes disc health) slows this process. Preventing osteoporosis: Bone density loss in aging (particularly post-menopausal women) causes vertebral compression fractures and kyphosis (dowager's hump), reducing height by 2-5+ cm. Prevention through adequate calcium/vitamin D, weight-bearing exercise, and medications when indicated preserves height. Surgical limb lengthening: The only method that actually increases skeletal height involves surgical breaking of leg bones (tibia and/or femur) and gradual separation using external fixators (Ilizarov method) or internal telescoping rods (PRECICE nail). The procedure can add 2-3 inches per bone segment over 3-6 months of gradual distraction (1mm/day) followed by 3-6 months of consolidation. Risks include infection (10-30%), nerve damage (5-10%), joint stiffness, chronic pain, and very high cost ($75,000-150,000 in US). Primarily performed for leg length discrepancies or severe short stature (dwarfism), rarely for cosmetic reasons due to risks and prolonged disability. Ineffective height-increase claims to avoid: Growth hormone supplements: After growth plates close, GH cannot increase height—it only causes acromegaly (abnormal bone thickening, joint pain, organ enlargement) without vertical growth. Stretching exercises: While improving flexibility and posture, no stretching routine lengthens bones after epiphyseal fusion. Hanging/inversion tables: Temporary spinal decompression (0.5-1 cm) reverses within hours—no permanent height gain. Supplements (arginine, glutamine, collagen): No scientific evidence supports adult height increase from any supplement after growth plate closure. Maximizing height during growth years: For children/adolescents still growing, optimizing factors that support growth maximizes adult height potential: adequate protein (0.95-1.0 g/kg bodyweight), calcium (1,300 mg daily ages 9-18), vitamin D (600-1,000 IU daily), 9-11 hours sleep nightly, regular physical activity (especially weight-bearing), avoiding smoking and excessive alcohol, treating medical conditions affecting growth (hormone deficiencies, celiac disease, etc.), and maintaining healthy body weight (both underweight and obesity can impair growth).",
    order: 5
  },
  {
    id: '6',
    question: "What are the average heights for adults in different countries?",
    answer: "Average adult heights vary significantly worldwide due to genetics, nutrition, healthcare access, and economic development. Understanding these differences provides context for individual height assessments. Tallest average populations (males/females): Netherlands: 183.8 cm (6'0\") / 170.4 cm (5'7\")—tallest population globally, attributed to excellent nutrition, healthcare, and dairy consumption genetics. Montenegro: 183.2 cm (6'0\") / 169.5 cm (5'7\")—Balkans region shows tall averages. Denmark: 182.6 cm (6'0\") / 169.1 cm (5'6.5\")—Scandinavian countries consistently rank in top 10. Norway: 182.4 cm (6'0\") / 168.7 cm (5'6.5\")—Nordic genetics and high living standards. Germany: 180.3 cm (5'11\") / 166.9 cm (5'5.5\")—Central European average. Iceland: 181.8 cm (5'11.5\") / 168.0 cm (5'6\")—isolated population with distinct genetics. United States averages (males/females): Overall average: 175.4 cm (5'9\") / 161.7 cm (5'3.5\")—ranks around 40th globally. White Americans: 177.5 cm (5'10\") / 163.3 cm (5'4\"). Black Americans: 175.5 cm (5'9\") / 162.6 cm (5'4\"). Hispanic Americans: 170.8 cm (5'7\") / 158.0 cm (5'2\"). Asian Americans: 170.5 cm (5'7\") / 158.2 cm (5'2\"). Age cohort differences: Americans born in 1990s average 2-3 cm taller than those born in 1950s, reflecting improved nutrition and healthcare (secular trend). Asian region averages: China: 175.7 cm (5'9\") / 163.5 cm (5'4.5\")—rapid increase over past 50 years due to economic development. Japan: 172.0 cm (5'7.5\") / 158.5 cm (5'2.5\")—heights increased dramatically post-WWII with Western diet adoption. South Korea: 175.5 cm (5'9\") / 162.5 cm (5'4\")—among fastest height increases globally (6 cm in 50 years). Vietnam: 168.1 cm (5'6\") / 156.2 cm (5'1.5\")—Southeast Asian populations generally shorter averages. India: 166.3 cm (5'5.5\") / 152.6 cm (5'0\")—significant regional and socioeconomic variation. Latin American averages: Mexico: 170.5 cm (5'7\") / 157.0 cm (5'2\")—heights vary by indigenous ancestry percentage. Brazil: 173.0 cm (5'8\") / 161.0 cm (5'3.5\")—European, African, and indigenous admixture creates variation. Argentina: 174.5 cm (5'8.5\") / 161.0 cm (5'3.5\")—higher European ancestry correlates with taller averages. Middle East and Africa: Egypt: 170.3 cm (5'7\") / 158.9 cm (5'2.5\"). Turkey: 175.6 cm (5'9\") / 161.4 cm (5'3.5\"). Nigeria: 163.8 cm (5'4.5\") / 157.8 cm (5'2\")—sub-Saharan Africa shows wide ethnic variation. South Africa: 169.0 cm (5'6.5\") / 159.0 cm (5'2.5\")—varies by ethnic group. Shortest average populations: Timor-Leste: 160.1 cm (5'3\") / 151.4 cm (4'11.5\")—shortest country average. Guatemala: 160.3 cm (5'3\") / 147.4 cm (4'10\")—high indigenous Mayan ancestry and poverty affect nutrition. Yemen: 164.0 cm (5'4.5\") / 153.9 cm (5'0.5\")—chronic malnutrition and conflict impact. Nepal: 163.0 cm (5'4\") / 150.8 cm (4'11\")—mountainous terrain and nutritional challenges. Factors explaining international height differences: Genetic ancestry: Populations evolved in different environments with distinct selection pressures—Northern Europeans adapted to cold climates with larger bodies, while equatorial populations evolved smaller, heat-adapted frames. Nutrition quality and availability: Protein intake, micronutrient adequacy (calcium, zinc, vitamin D), and caloric sufficiency during childhood determine whether genetic height potential is reached. Healthcare access: Treating childhood illnesses, parasitic infections, and growth disorders prevents height loss from treatable conditions. Economic development: GDP per capita correlates strongly (r=0.65) with average population height—wealthier countries provide better nutrition and healthcare. Secular trends: Most countries show increasing average heights over the past century as living conditions improve—some East Asian countries gained 5-8 cm in average height since 1960.",
    order: 6
  }
];

export default function HeightCalculatorClient() {
  // Height Predictor state
  const [childGender, setChildGender] = useState<string>('male');
  const [fatherHeightUnit, setFatherHeightUnit] = useState<'ft' | 'cm'>('ft');
  const [motherHeightUnit, setMotherHeightUnit] = useState<'ft' | 'cm'>('ft');
  const [fatherFeet, setFatherFeet] = useState<number>(5);
  const [fatherInches, setFatherInches] = useState<number>(10);
  const [fatherCm, setFatherCm] = useState<number>(178);
  const [motherFeet, setMotherFeet] = useState<number>(5);
  const [motherInches, setMotherInches] = useState<number>(4);
  const [motherCm, setMotherCm] = useState<number>(163);

  // Predictor results
  const [predictedHeightFt, setPredictedHeightFt] = useState<string>("5' 8\"");
  const [predictedHeightCm, setPredictedHeightCm] = useState<string>('173 cm');
  const [heightRangeLow, setHeightRangeLow] = useState<string>("5' 4\" (163 cm)");
  const [heightRangeHigh, setHeightRangeHigh] = useState<string>("6' 0\" (183 cm)");
  const [heightPercentile, setHeightPercentile] = useState<string>('50th percentile');
  const [growthTimeline, setGrowthTimeline] = useState<string>('• Ages 12-16 (boys)');

  // Height Converter state
  const [convertFeet, setConvertFeet] = useState<number>(5);
  const [convertInches, setConvertInches] = useState<number>(8);
  const [convertCm, setConvertCm] = useState<number>(173);

  // Converter results
  const [convertedFtIn, setConvertedFtIn] = useState<string>("5' 8\"");
  const [convertedCm, setConvertedCm] = useState<string>('173 cm');
  const [totalInches, setTotalInches] = useState<string>('68 inches');
  const [meters, setMeters] = useState<string>('1.73 m');
  const [millimeters, setMillimeters] = useState<string>('1730 mm');
  const [heightCategory, setHeightCategory] = useState<string>('Average height');

  // Utility functions
  const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return { feet, inches: remainingInches };
  };

  const feetInchesToCm = (feet: number, inches: number): number => {
    return Math.round((feet * 12 + inches) * 2.54);
  };

  const getHeightCategory = (cm: number, gender: string): string => {
    if (gender === 'male') {
      if (cm < 160) return 'Below average';
      if (cm < 170) return 'Slightly below average';
      if (cm < 180) return 'Average';
      if (cm < 190) return 'Above average';
      return 'Well above average';
    } else {
      if (cm < 150) return 'Below average';
      if (cm < 160) return 'Slightly below average';
      if (cm < 170) return 'Average';
      if (cm < 180) return 'Above average';
      return 'Well above average';
    }
  };

  const getPercentile = (cm: number, gender: string): string => {
    if (gender === 'male') {
      if (cm < 165) return '10th percentile';
      if (cm < 170) return '25th percentile';
      if (cm < 178) return '50th percentile';
      if (cm < 185) return '75th percentile';
      return '90th percentile';
    } else {
      if (cm < 155) return '10th percentile';
      if (cm < 160) return '25th percentile';
      if (cm < 165) return '50th percentile';
      if (cm < 170) return '75th percentile';
      return '90th percentile';
    }
  };

  // Toggle father height unit
  const toggleFatherHeightUnit = () => {
    if (fatherHeightUnit === 'ft') {
      setFatherHeightUnit('cm');
      if (fatherFeet > 0 || fatherInches > 0) {
        setFatherCm(feetInchesToCm(fatherFeet, fatherInches));
      }
    } else {
      setFatherHeightUnit('ft');
      if (fatherCm > 0) {
        const ftIn = cmToFeetInches(fatherCm);
        setFatherFeet(ftIn.feet);
        setFatherInches(ftIn.inches);
      }
    }
  };

  // Toggle mother height unit
  const toggleMotherHeightUnit = () => {
    if (motherHeightUnit === 'ft') {
      setMotherHeightUnit('cm');
      if (motherFeet > 0 || motherInches > 0) {
        setMotherCm(feetInchesToCm(motherFeet, motherInches));
      }
    } else {
      setMotherHeightUnit('ft');
      if (motherCm > 0) {
        const ftIn = cmToFeetInches(motherCm);
        setMotherFeet(ftIn.feet);
        setMotherInches(ftIn.inches);
      }
    }
  };

  // Height prediction function
  const predictHeight = () => {
    // Get father's height in cm
    let fatherCmValue = 0;
    if (fatherHeightUnit === 'ft') {
      if (fatherFeet > 0 || fatherInches > 0) {
        fatherCmValue = feetInchesToCm(fatherFeet, fatherInches);
      }
    } else {
      fatherCmValue = fatherCm;
    }

    // Get mother's height in cm
    let motherCmValue = 0;
    if (motherHeightUnit === 'ft') {
      if (motherFeet > 0 || motherInches > 0) {
        motherCmValue = feetInchesToCm(motherFeet, motherInches);
      }
    } else {
      motherCmValue = motherCm;
    }

    if (!fatherCmValue || !motherCmValue || fatherCmValue < 100 || motherCmValue < 100) {
      setPredictedHeightFt('Enter parent heights');
      setPredictedHeightCm('to predict');
      setHeightRangeLow('Range will appear here');
      setHeightRangeHigh('Range will appear here');
      setHeightPercentile('Percentile info');
      return;
    }

    // Mid-parent height calculation
    const midParentHeight = (fatherCmValue + motherCmValue) / 2;

    // Gender adjustment
    let predictedHeightValue: number;
    if (childGender === 'male') {
      predictedHeightValue = midParentHeight + 6.5;
    } else {
      predictedHeightValue = midParentHeight - 6.5;
    }

    // Calculate range (±10 cm)
    const rangeLow = predictedHeightValue - 10;
    const rangeHigh = predictedHeightValue + 10;

    // Convert to feet/inches
    const predictedFtIn = cmToFeetInches(predictedHeightValue);
    const rangeLowFtIn = cmToFeetInches(rangeLow);
    const rangeHighFtIn = cmToFeetInches(rangeHigh);

    // Update results
    setPredictedHeightFt(`${predictedFtIn.feet}' ${predictedFtIn.inches}"`);
    setPredictedHeightCm(`${Math.round(predictedHeightValue)} cm`);
    setHeightRangeLow(
      `${rangeLowFtIn.feet}' ${rangeLowFtIn.inches}" (${Math.round(rangeLow)} cm)`
    );
    setHeightRangeHigh(
      `${rangeHighFtIn.feet}' ${rangeHighFtIn.inches}" (${Math.round(rangeHigh)} cm)`
    );
    setHeightPercentile(getPercentile(predictedHeightValue, childGender));
    setGrowthTimeline(
      childGender === 'male' ? '• Ages 12-16 (boys)' : '• Ages 10-14 (girls)'
    );
  };

  // Height conversion function
  const convertHeightFromFtIn = () => {
    if (convertFeet === 0 && convertInches === 0) {
      setConvertedFtIn('Enter height');
      setConvertedCm('to convert');
      setTotalInches('0 inches');
      setMeters('0 m');
      setMillimeters('0 mm');
      setHeightCategory('Height category');
      return;
    }

    const cm = feetInchesToCm(convertFeet, convertInches);
    const totalInchesValue = convertFeet * 12 + convertInches;
    const metersValue = (cm / 100).toFixed(2);
    const millimetersValue = cm * 10;

    // Update results
    setConvertedFtIn(`${convertFeet}' ${convertInches}"`);
    setConvertedCm(`${cm} cm`);
    setConvertCm(cm);
    setTotalInches(`${totalInchesValue} inches`);
    setMeters(`${metersValue} m`);
    setMillimeters(`${millimetersValue} mm`);
    setHeightCategory(getHeightCategory(cm, 'male'));
  };

  const convertHeightFromCm = () => {
    if (convertCm === 0) {
      setConvertedFtIn('Enter height');
      setConvertedCm('to convert');
      setTotalInches('0 inches');
      setMeters('0 m');
      setMillimeters('0 mm');
      setHeightCategory('Height category');
      return;
    }

    const ftIn = cmToFeetInches(convertCm);
    const totalInchesValue = Math.round(convertCm / 2.54);
    const metersValue = (convertCm / 100).toFixed(2);
    const millimetersValue = convertCm * 10;

    // Update results
    setConvertedFtIn(`${ftIn.feet}' ${ftIn.inches}"`);
    setConvertedCm(`${Math.round(convertCm)} cm`);
    setConvertFeet(ftIn.feet);
    setConvertInches(ftIn.inches);
    setTotalInches(`${totalInchesValue} inches`);
    setMeters(`${metersValue} m`);
    setMillimeters(`${millimetersValue} mm`);
    setHeightCategory(getHeightCategory(convertCm, 'male'));
  };

  const setQuickHeight = (feet: number, inches: number) => {
    setConvertFeet(feet);
    setConvertInches(inches);
  };

  // Effects for real-time updates
  useEffect(() => {
    predictHeight();
  }, [
    childGender,
    fatherHeightUnit,
    motherHeightUnit,
    fatherFeet,
    fatherInches,
    fatherCm,
    motherFeet,
    motherInches,
    motherCm,
  ]);

  useEffect(() => {
    convertHeightFromFtIn();
  }, [convertFeet, convertInches]);

  // Initialize on mount
  useEffect(() => {
    predictHeight();
    convertHeightFromFtIn();
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Height Calculator & Converter</h1>
        <p className="text-lg text-gray-600">
          Predict adult height for children and convert between height units
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Height Predictor Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="text-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Height Predictor</h2>
          <p className="text-gray-600 mt-2">
            Predict your child&apos;s adult height based on parental heights
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Child&apos;s Information</h2>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Child&apos;s Gender
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="childGender"
                    value="male"
                    checked={childGender === 'male'}
                    onChange={(e) => setChildGender(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Male</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="childGender"
                    value="female"
                    checked={childGender === 'female'}
                    onChange={(e) => setChildGender(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {/* Father's Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Father&apos;s Height
              </label>

              {/* Height Unit Toggle */}
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-sm font-medium text-gray-700">ft/in</span>
                <div
                  className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                    fatherHeightUnit === 'cm' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={toggleFatherHeightUnit}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                      fatherHeightUnit === 'cm' ? 'transform translate-x-6' : ''
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-500">cm</span>
              </div>

              {/* Height Inputs */}
              <div>
                {fatherHeightUnit === 'ft' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        min="4"
                        max="7"
                        placeholder="5"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={fatherFeet || ''}
                        onChange={(e) => setFatherFeet(parseInt(e.target.value) || 0)}
                      />
                      <label className="block text-xs text-gray-500 mt-1">Feet</label>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        placeholder="10"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={fatherInches || ''}
                        onChange={(e) => setFatherInches(parseInt(e.target.value) || 0)}
                      />
                      <label className="block text-xs text-gray-500 mt-1">Inches</label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="number"
                      min="120"
                      max="220"
                      placeholder="178"
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={fatherCm || ''}
                      onChange={(e) => setFatherCm(parseFloat(e.target.value) || 0)}
                    />
                    <label className="block text-xs text-gray-500 mt-1">Centimeters</label>
                  </div>
                )}
              </div>
            </div>

            {/* Mother's Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mother&apos;s Height
              </label>

              {/* Height Unit Toggle */}
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-sm font-medium text-gray-700">ft/in</span>
                <div
                  className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                    motherHeightUnit === 'cm' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={toggleMotherHeightUnit}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                      motherHeightUnit === 'cm' ? 'transform translate-x-6' : ''
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-500">cm</span>
              </div>

              {/* Height Inputs */}
              <div>
                {motherHeightUnit === 'ft' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        min="4"
                        max="7"
                        placeholder="5"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={motherFeet || ''}
                        onChange={(e) => setMotherFeet(parseInt(e.target.value) || 0)}
                      />
                      <label className="block text-xs text-gray-500 mt-1">Feet</label>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        placeholder="4"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={motherInches || ''}
                        onChange={(e) => setMotherInches(parseInt(e.target.value) || 0)}
                      />
                      <label className="block text-xs text-gray-500 mt-1">Inches</label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="number"
                      min="120"
                      max="200"
                      placeholder="163"
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={motherCm || ''}
                      onChange={(e) => setMotherCm(parseFloat(e.target.value) || 0)}
                    />
                    <label className="block text-xs text-gray-500 mt-1">Centimeters</label>
                  </div>
                )}
              </div>
            </div>

            {/* Method Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Calculation Method</h4>
              <p className="text-blue-700 text-sm">
                Uses the mid-parent height method with gender adjustment. Accuracy: ±4 inches (10
                cm) in most cases.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Predicted Adult Height</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{predictedHeightFt}</div>
                <div className="text-green-700">Feet & Inches</div>
              </div>

              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{predictedHeightCm}</div>
                <div className="text-blue-700">Centimeters</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Range (low):</span>
                  <span className="font-semibold">{heightRangeLow}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Range (high):</span>
                  <span className="font-semibold">{heightRangeHigh}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Percentile:</span>
                  <span className="font-semibold">{heightPercentile}</span>
                </div>
              </div>

              {/* Growth Timeline */}
              <div className="bg-yellow-100 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Growth Timeline</h4>
                <div className="text-yellow-700 text-sm">
                  <p>Most growth occurs during:</p>
                  <p>{growthTimeline}</p>
                  <p>• Final height typically reached by age 18-21</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Height Converter Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="text-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Height Converter</h2>
          <p className="text-gray-600 mt-2">Convert between feet/inches and centimeters</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Convert Height Units</h3>

            {/* Height Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Height in Feet & Inches
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    placeholder="5"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={convertFeet || ''}
                    onChange={(e) => setConvertFeet(parseInt(e.target.value) || 0)}
                  />
                  <label className="block text-xs text-gray-500 mt-1">Feet</label>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder="8"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={convertInches || ''}
                    onChange={(e) => setConvertInches(parseInt(e.target.value) || 0)}
                  />
                  <label className="block text-xs text-gray-500 mt-1">Inches</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Height in Centimeters
              </label>
              <input
                type="number"
                min="50"
                max="250"
                placeholder="173"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={convertCm || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setConvertCm(value);
                  if (value > 0) {
                    convertHeightFromCm();
                  }
                }}
              />
              <label className="block text-xs text-gray-500 mt-1">Centimeters</label>
            </div>

            {/* Quick Heights */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Common Heights</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button
                  onClick={() => setQuickHeight(5, 0)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  5&apos;0&quot;
                </button>
                <button
                  onClick={() => setQuickHeight(5, 4)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  5&apos;4&quot;
                </button>
                <button
                  onClick={() => setQuickHeight(5, 6)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  5&apos;6&quot;
                </button>
                <button
                  onClick={() => setQuickHeight(5, 8)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  5&apos;8&quot;
                </button>
                <button
                  onClick={() => setQuickHeight(5, 10)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  5&apos;10&quot;
                </button>
                <button
                  onClick={() => setQuickHeight(6, 0)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  6&apos;0&quot;
                </button>
                <button
                  onClick={() => setQuickHeight(6, 2)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  6&apos;2&quot;
                </button>
                <button
                  onClick={() => setQuickHeight(6, 4)}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  6&apos;4&quot;
                </button>
              </div>
            </div>
          </div>

          {/* Conversion Results */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Conversion Results</h3>

            <div className="space-y-4">
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">{convertedFtIn}</div>
                <div className="text-purple-700">Feet & Inches</div>
              </div>

              <div className="bg-orange-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{convertedCm}</div>
                <div className="text-orange-700">Centimeters</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total inches:</span>
                  <span className="font-semibold">{totalInches}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Meters:</span>
                  <span className="font-semibold">{meters}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Millimeters:</span>
                  <span className="font-semibold">{millimeters}</span>
                </div>
              </div>

              {/* Height Categories */}
              <div className="bg-indigo-100 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Height Category</h4>
                <div className="text-indigo-700 text-sm">{heightCategory}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">
          About Height Prediction & Conversion
        </h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Height Prediction:</h4>
            <ul className="space-y-2">
              <li>• Based on mid-parent height formula</li>
              <li>• Accuracy: ±4 inches (10 cm) typically</li>
              <li>• Genetics account for ~80% of height</li>
              <li>• Nutrition and health affect final height</li>
              <li>• Most accurate for children 2-16 years old</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Height Factors:</h4>
            <ul className="space-y-2">
              <li>• Genetics (parents&apos; heights)</li>
              <li>• Nutrition during growth periods</li>
              <li>• Sleep quality and duration</li>
              <li>• Physical activity and exercise</li>
              <li>• Medical conditions or treatments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Height: Genetics, Growth, and Prediction Science</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6 text-gray-700">
          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">The Mid-Parent Height Formula Explained</h3>
            <p className="mb-3">
              Height prediction calculators employ the mid-parent height method, a scientifically-validated formula developed through decades of pediatric growth research. This approach accurately predicts adult height for the majority of children by averaging parental heights and applying a gender-specific adjustment:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-3 text-sm font-mono">
              <div className="mb-2"><strong>For Boys:</strong> [(Father&apos;s Height + Mother&apos;s Height) / 2] + 6.5 cm (2.5 inches)</div>
              <div><strong>For Girls:</strong> [(Father&apos;s Height + Mother&apos;s Height) / 2] - 6.5 cm (2.5 inches)</div>
            </div>
            <p>
              The 6.5 cm adjustment accounts for the average height difference between adult males and females, reflecting sex-based differences in growth hormone exposure, estrogen levels (which trigger earlier growth plate closure in females), and testosterone effects on bone development in males. This formula achieves ±4 inches (10 cm) accuracy for approximately 68% of children, with 95% falling within ±8 inches of the prediction. The method works because height is highly heritable (genetic heritability ~80%), meaning children&apos;s heights strongly correlate with their parents&apos; heights through polygenic inheritance—over 700 genetic variants across the genome collectively determine adult height potential.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">The Genetics of Height: Why Children Resemble Parents</h3>
            <p className="mb-3">
              Height inheritance follows complex polygenic patterns, meaning hundreds of genes each contribute small effects that sum to determine final adult height. Recent genome-wide association studies (GWAS) identified over 700 genetic variants associated with height, explaining approximately 80% of height variation in populations:
            </p>
            <p className="mb-3">
              <strong>Additive Genetic Effects:</strong> Each parent contributes half their genetic variants to their child, creating a blend that typically results in heights near the mid-parent average. If both parents are tall (possessing many height-increasing alleles), their children inherit a combination of these favorable variants and tend toward tall stature. Conversely, short parents pass predominantly height-limiting alleles to offspring, resulting in shorter children on average.
            </p>
            <p>
              <strong>Regression to the Mean:</strong> Very tall parents tend to have children slightly shorter than themselves, while very short parents tend to have children slightly taller—both groups regressing toward the population average. This statistical phenomenon occurs because extreme heights result from unusually favorable (or unfavorable) combinations of genetic variants that rarely transmit completely to the next generation. For example, a 6&apos;4&quot; father and 5&apos;10&quot; mother might have a son reaching 6&apos;1&quot;—tall by absolute standards but shorter than the mid-parent formula predicts, as the child inherited a more average combination of height alleles.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Growth Patterns and Puberty Timing</h3>
            <p className="mb-3">
              Human height development follows distinct phases from birth through adolescence, with most rapid growth occurring during infancy and puberty:
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-800">Infant and Early Childhood Growth (Birth to Age 3)</p>
                <p>The most rapid growth period outside the womb—infants grow approximately 25 cm (10 inches) in the first year, 12 cm (5 inches) in year two, and 8 cm (3 inches) in year three. This phase is heavily influenced by nutrition, with malnutrition during the first 1,000 days (conception through age 2) causing irreversible stunting.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Childhood Steady Growth (Ages 3-10)</p>
                <p>Growth rate stabilizes at approximately 5-6 cm (2-2.5 inches) per year. Children typically maintain consistent height percentiles during this phase—a child at the 75th percentile at age 4 usually remains near 75th percentile through elementary school, barring significant environmental changes or medical conditions.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Pubertal Growth Spurt (Ages 8-16)</p>
                <p>The second most rapid growth period, driven by sex hormone surges. Girls enter puberty earlier (average age 10-11) and experience peak height velocity before boys, but boys ultimately grow taller due to longer growth duration and higher peak velocity (10-11 cm/year vs 8-9 cm/year for girls). Pubertal timing significantly affects adult height: early maturers (entering puberty 2+ years before average) tend to be shorter adults despite being tallest during childhood, as their growth plates close earlier. Late bloomers continue growing after peers stop, often reaching similar or greater final heights despite being shorter throughout childhood.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-orange-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Environmental Factors That Influence Final Height</h3>
            <p className="mb-3">
              While genetics sets the potential range for adult height, environmental factors determine whether individuals reach their genetic ceiling or fall short:
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-800">Nutrition and Growth</p>
                <p>Adequate protein (0.95-1.0 g/kg bodyweight daily), calcium (1,300 mg ages 9-18), vitamin D (600-1,000 IU), and overall caloric sufficiency are essential for optimal growth. The secular trend—increasing average heights over generations—demonstrates nutrition&apos;s impact: South Korean men averaged 163 cm in 1960 vs 175 cm today, attributed primarily to improved nutrition and living standards. Conversely, populations experiencing famine or chronic malnutrition show height decreases across generations.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Sleep and Growth Hormone</p>
                <p>70% of daily growth hormone secretion occurs during deep sleep (stages 3-4), primarily in the first 2-3 hours after sleep onset. Children consistently sleeping {'<'}8 hours nightly may lose 1-2 inches of potential adult height. Sleep timing matters—growth hormone pulses are stronger and more frequent with consistent bedtimes (circadian rhythm alignment) compared to irregular sleep schedules.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Medical Conditions and Treatment</p>
                <p>Growth hormone deficiency (1 in 3,500 children) causes severe short stature if untreated—early diagnosis and GH replacement therapy can add 4-6 inches to adult height. Hypothyroidism, celiac disease, inflammatory bowel disease, chronic kidney disease, and poorly controlled diabetes all impair growth. Conversely, certain treatments affect height: prolonged corticosteroid use (for asthma, autoimmune conditions) suppresses growth by 1-1.5 cm per treatment year, while treating previously undiagnosed celiac disease often triggers catch-up growth as nutrient absorption normalizes.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Maximizing Height Potential During Growth Years</h3>
            <p className="mb-3">
              For children and adolescents still growing, optimizing modifiable factors maximizes the likelihood of reaching genetic height potential:
            </p>
            <ul className="space-y-2 text-sm">
              <li><strong>Prioritize Protein:</strong> Aim for 0.95-1.0 g per kg bodyweight daily from diverse sources (meat, fish, dairy, legumes, eggs). Protein provides amino acids essential for collagen synthesis, bone matrix formation, and muscle development.</li>
              <li><strong>Ensure Calcium and Vitamin D:</strong> 1,300 mg calcium daily (4 servings dairy or fortified alternatives) and 600-1,000 IU vitamin D support bone mineralization and lengthening. Vitamin D deficiency impairs calcium absorption regardless of intake.</li>
              <li><strong>Optimize Sleep:</strong> 9-11 hours nightly for children ages 6-13, 8-10 hours for teens 14-18. Maintain consistent bedtimes to align circadian rhythms with growth hormone secretion patterns.</li>
              <li><strong>Encourage Physical Activity:</strong> Weight-bearing activities (running, jumping, sports) and resistance training (contrary to myths, does NOT stunt growth) stimulate bone growth through mechanical loading and improve bone density.</li>
              <li><strong>Address Medical Issues Promptly:</strong> Evaluate children falling off their growth curve (dropping percentiles) or showing delayed puberty for underlying conditions. Early treatment of growth-affecting conditions prevents irreversible height loss.</li>
              <li><strong>Avoid Growth Inhibitors:</strong> Smoking, excessive alcohol, and certain medications impair growth. Corticosteroids should be used at minimum effective doses when medically necessary.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <FirebaseFAQs pageId="height-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
