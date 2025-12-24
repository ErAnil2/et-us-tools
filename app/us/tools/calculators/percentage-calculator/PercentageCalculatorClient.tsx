'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a percentage and how does it work mathematically?",
    answer: "A percentage is a fraction or ratio expressed as a number out of 100, derived from the Latin 'per centum' meaning 'by the hundred.' Percentages provide a standardized way to express proportions, making comparisons intuitive regardless of the underlying absolute values. Mathematically, a percentage represents the numerator of a fraction with denominator 100: X% = X/100 as a decimal = X:100 as a ratio. For example, 25% = 25/100 = 0.25 as a decimal = 1:4 as a simplified ratio. This standardization to a base of 100 enables straightforward mental calculations and comparisons across different contexts—whether comparing test scores, interest rates, discounts, or statistical data. The percentage concept originated in ancient civilizations for taxation and trade calculations, formalized by medieval European merchants who used per cento notation before the modern % symbol emerged in the 17th century. Mathematical operations with percentages: Converting percentage to decimal: Divide by 100. Example: 35% = 35 ÷ 100 = 0.35. This conversion enables multiplication with other numbers. Converting decimal to percentage: Multiply by 100. Example: 0.75 = 0.75 × 100 = 75%. Converting fraction to percentage: Divide numerator by denominator, then multiply by 100. Example: 3/4 = 0.75 × 100 = 75%. Or, create equivalent fraction with denominator 100: 3/4 = 75/100 = 75%. Converting percentage to fraction: Write as fraction over 100, then simplify. Example: 40% = 40/100 = 2/5 (simplified by dividing by greatest common divisor 20). Finding percentage of a value: Multiply the value by the percentage expressed as a decimal. Formula: X% of Y = Y × (X/100). Example: 20% of 150 = 150 × (20/100) = 150 × 0.2 = 30. The logic: taking 20 parts out of every 100 parts of 150. Alternative method: (X × Y) / 100 = (20 × 150) / 100 = 3000 / 100 = 30. Finding what percentage one number is of another: Divide the part by the whole, then multiply by 100. Formula: X is what % of Y = (X/Y) × 100. Example: 30 is what % of 150 = (30/150) × 100 = 0.2 × 100 = 20%. The logic: determining how many parts out of 100 the ratio X:Y represents. Percentage increase/decrease: Calculate change as percentage of original value. Formula: % Change = ((New Value - Original Value) / Original Value) × 100. Example: Price increases from $80 to $100. Change = ((100-80)/80) × 100 = (20/80) × 100 = 0.25 × 100 = 25% increase. Negative result indicates decrease: $100 to $80 gives ((80-100)/100) × 100 = -20% (a 20% decrease). Increasing a value by a percentage: Multiply by (1 + percentage as decimal). Formula: Value × (1 + X/100). Example: Increase $200 by 15% = $200 × (1 + 15/100) = $200 × 1.15 = $230. Logic: keeping the original 100% (1.00) plus adding 15% (0.15) = 115% total (1.15). Decreasing a value by a percentage: Multiply by (1 - percentage as decimal). Formula: Value × (1 - X/100). Example: Decrease $200 by 15% = $200 × (1 - 15/100) = $200 × 0.85 = $170. Logic: keeping 85% of original (100% - 15% = 85%). Common percentage applications: Business and finance: Profit margins ((Profit/Revenue) × 100), interest rates (simple: Principal × Rate × Time; compound: Principal × (1 + Rate)^Time), tax calculations (Price × (1 + Tax Rate)), discounts (Price × (1 - Discount Rate)), commission (Sale Price × Commission Rate), return on investment ((Gain - Cost)/Cost × 100). Statistics and data: Growth rates year-over-year, market share percentages, probability expressed as percent (Favorable Outcomes / Total Outcomes × 100), confidence intervals, error margins, demographic distributions. Academia: Grade calculations: (Points Earned / Total Points) × 100, weighted averages where categories have percentage weights, grade curves and standardization. Everyday use: Tips at restaurants (Bill × Tip%), sales tax on purchases, mortgage down payments, smartphone battery percentage, weather precipitation probability. Key mathematical properties: Percentages are additive only under specific conditions. If Population A is 30% female and Population B is 40% female, the combined population is not necessarily 70% female—it depends on the relative sizes of the populations. Weighted average required: (30% × Size_A + 40% × Size_B) / (Size_A + Size_B). Multiple percentage changes are multiplicative, not additive. Increasing by 10% then 10% again is not +20% total. Correct calculation: 1.10 × 1.10 = 1.21 = 21% increase. Similarly, +10% then -10% does not return to original: 100 × 1.10 × 0.90 = 99 (1% net decrease). Percentage of percentage: To find X% of Y%, multiply as decimals then convert back. Example: 50% of 80% = 0.50 × 0.80 = 0.40 = 40%. Not 50 + 80 = 130%. Percentage points vs. percentage change: Critical distinction. If interest rate goes from 5% to 7%, it increased by 2 percentage points (arithmetic difference: 7 - 5 = 2) but by 40% relative change ((7-5)/5 × 100 = 40%). Media often confuses these, saying '2%' when meaning 2 percentage points. Common percentage errors to avoid: Percentage of different bases: 50% of A ≠ A × 50% of B. Each percentage must reference its specific base value. Reversing percentage changes: Increasing by X% then decreasing by X% does not return to original value. Example: $100 +20% = $120, then $120 -20% = $96, not $100. To reverse +20%, must decrease by 16.67% ($120 × (1 - 16.67%) ≈ $100). Formula to reverse: If increased by X%, decrease by X/(100+X) × 100%. Comparing absolute changes with percentage changes: A 10% increase on $1,000 ($100 change) is very different from 10% increase on $100 ($10 change)—same percentage, different absolute amounts. Context determines which matters more.",
    order: 1
  },
  {
    id: '2',
    question: "How do I calculate percentage increase and decrease accurately?",
    answer: "Percentage increase and decrease quantify proportional change relative to an original value, providing meaningful comparison independent of absolute scale. The fundamental formula: Percentage Change = ((New Value - Original Value) / Original Value) × 100. Positive results indicate increase; negative results indicate decrease. Critical principle: The denominator must always be the original/starting value—the reference point before the change occurred. Using the new value as denominator produces incorrect results. Detailed calculation methodology: Percentage Increase calculation: Step 1: Identify original value (before) and new value (after). Step 2: Calculate absolute change: New Value - Original Value. Step 3: Divide absolute change by original value: (New - Original) / Original. Step 4: Multiply by 100 to express as percentage. Example: Product price increased from $50 to $65. Absolute change: $65 - $50 = $15. Relative change: $15 / $50 = 0.30. Percentage: 0.30 × 100 = 30% increase. Interpretation: The new price is 30% higher than the original price. Alternative verification: $50 × (1 + 30/100) = $50 × 1.30 = $65 ✓. Percentage Decrease calculation: Same formula; negative result indicates decrease. Example: Product price decreased from $80 to $60. Absolute change: $60 - $80 = -$20 (negative indicates decrease). Relative change: -$20 / $80 = -0.25. Percentage: -0.25 × 100 = -25%. Interpretation: The new price is 25% lower (decreased by 25%). Verification: $80 × (1 - 25/100) = $80 × 0.75 = $60 ✓. Why the original value must be the denominator: The question answered by percentage change is: 'The new value represents what percentage of the original value?' Using original as denominator: From $50 to $75 = ($75-$50)/$50 × 100 = 50% increase. Correct: $75 is 150% of original $50 (100% original + 50% increase). Using new as denominator (incorrect): ($75-$50)/$75 × 100 = 33.3%. This incorrectly states the relationship—$50 is 66.7% of $75, not the increase percentage. Asymmetry in percentage changes (critical concept): Percentage increase and decrease are not symmetric. Increasing by X% then decreasing by X% does NOT return to the original value. Example demonstrating asymmetry: Start: $100. Increase by 20%: $100 × 1.20 = $120. Decrease by 20% (from $120): $120 × 0.80 = $96. Final value $96 ≠ original $100. Lost $4 (4% of original). The asymmetry arises because the 20% decrease applies to a larger base ($120) than the increase applied to ($100). 20% of $120 = $24, while 20% of $100 = $20. To reverse a percentage change: If value increased by X%, calculate reversal percentage: Reverse % = X / (100 + X) × 100. Example: Reverse a 20% increase: 20 / (100 + 20) × 100 = 20/120 × 100 = 16.67%. Verification: $120 × (1 - 16.67%) = $120 × 0.8333 = $100 ✓. If value decreased by X%, calculate reversal percentage: Reverse % = X / (100 - X) × 100. Example: Reverse a 20% decrease: 20 / (100 - 20) × 100 = 20/80 × 100 = 25%. Verification: $80 × (1 + 25%) = $80 × 1.25 = $100 ✓. Applications and practical examples: Business revenue growth: Year 1 revenue: $500,000. Year 2 revenue: $625,000. Growth: ((625,000 - 500,000) / 500,000) × 100 = 25% increase. Year 3 revenue: $687,500. Year 2→3 growth: ((687,500 - 625,000) / 625,000) × 100 = 10% increase. Total Year 1→3 growth: ((687,500 - 500,000) / 500,000) × 100 = 37.5% increase. Note: 25% + 10% ≠ 37.5% because the 10% applies to a larger base. Compound calculation: $500,000 × 1.25 × 1.10 = $687,500 ✓. Population change: City population decreased from 250,000 to 225,000. Change: ((225,000 - 250,000) / 250,000) × 100 = -10% (10% decrease). If population returns to 250,000, increase = ((250,000 - 225,000) / 225,000) × 100 = 11.11% increase (not 10%, due to smaller base). Stock market changes: Stock price: $150 → $180 = ((180-150)/150) × 100 = 20% increase. Stock price: $180 → $150 = ((150-180)/180) × 100 = -16.67% decrease. Weight loss: Starting weight: 200 lbs. Goal: Lose 10% = 200 × 0.10 = 20 lbs. Target: 180 lbs. Achieved: 185 lbs. Actual loss: ((185-200)/200) × 100 = -7.5% (7.5% decrease). Remaining to goal: 185 - 180 = 5 lbs. As percentage of current weight: (5/185) × 100 = 2.7% additional loss needed. Multiple consecutive changes: Calculating cumulative effect of multiple percentage changes requires multiplication, not addition. Three consecutive 10% increases: Year 1: $1,000. Year 2: $1,000 × 1.10 = $1,100. Year 3: $1,100 × 1.10 = $1,210. Year 4: $1,210 × 1.10 = $1,331. Total increase: ((1,331 - 1,000) / 1,000) × 100 = 33.1%, not 30% (10% + 10% + 10%). Formula for n identical changes: Final = Initial × (1 + rate)^n = $1,000 × (1.10)^3 = $1,331. Mixed increases and decreases: +10%, +5%, -8% consecutively: $1,000 × 1.10 × 1.05 × 0.92 = $1,062.60. Net change: ((1,062.60 - 1,000) / 1,000) × 100 = 6.26% increase. Common errors to avoid: Reversibility error: Assuming +X% followed by -X% returns to original. Always calculate from the intermediate value's base. Base confusion: Using ending value as denominator instead of starting value. The question is: 'What changed relative to where we started?' Additive assumption: Adding percentage changes when they should be multiplied (compounded). Each change applies to the result of the previous change. Rounding too early: Calculate with full precision, round only final result. Intermediate rounding accumulates errors, especially in multi-step calculations. Comparing percentage changes across different bases: 10% increase on $100 is $10; 10% increase on $1,000 is $100. Same percentage, very different absolute amounts. Context determines whether percentage or absolute change is more meaningful. When percentage change exceeds 100%: Values can increase by more than 100%. Example: $50 to $150 = ((150-50)/50) × 100 = 200% increase. The new value is triple the original (300% of original = 100% original + 200% increase). Decreases cannot exceed 100% (would require negative final value). Maximum decrease is approaching 100% (value approaching zero). $100 to $1 = 99% decrease.",
    order: 2
  },
  {
    id: '3',
    question: "What's the difference between percentage and percentage points?",
    answer: "Percentage and percentage points represent fundamentally different types of measurement that are frequently confused in media, business, and everyday conversation—understanding the distinction prevents serious misinterpretation of statistical data, financial reports, and policy changes. Percentage points measure the arithmetic difference between two percentages, while percentage (relative change) measures the proportional relationship between values. The confusion arises because both involve percentages, but they answer different questions. Percentage Points (Absolute Difference): Definition: The arithmetic (simple) difference between two percentage values, calculated by subtraction. Notation: 'percentage points' (pp or ppts), sometimes 'basis points' (1 bp = 0.01 percentage points = 0.0001 as a decimal) in finance. Formula: Percentage Point Change = New Percentage - Original Percentage. Example: Interest rate increases from 5% to 7%. Change: 7% - 5% = 2 percentage points (pp). Interpretation: The rate increased by an absolute amount of 2 percentage points. Another example: Unemployment rate decreases from 8% to 6%. Change: 6% - 8% = -2 percentage points (a decrease of 2 pp). Percentage (Relative Change): Definition: The proportional change in a value relative to its original amount, calculated using the percentage change formula. Formula: Percentage Change = ((New Value - Original Value) / Original Value) × 100. Same example: Interest rate increases from 5% to 7%. Change: ((7 - 5) / 5) × 100 = (2/5) × 100 = 40% increase. Interpretation: The rate increased by 40% relative to its original value. Unemployment example: Rate decreases from 8% to 6%. Change: ((6 - 8) / 8) × 100 = -25% (a 25% relative decrease). Critical distinction illustrated: Starting value: 5%. Ending value: 7%. Percentage point change: 2 percentage points (7 - 5 = 2). Relative percentage change: 40% increase ((7-5)/5 × 100 = 40%). Both describe the same change but from different perspectives. The percentage point change answers: 'How many points did the percentage value move?' The relative percentage change answers: 'By what proportion did the percentage value grow?' Why the distinction matters - Real-world consequences: Political polling: Poll shows candidate support at 30%, next poll shows 33%. Media report: 'Support increased by 3%' (ambiguous—percentage points or percent increase?). Correct: 'Support increased by 3 percentage points' (30% → 33%, absolute change). Also correct: 'Support increased by 10%' ((33-30)/30 × 100 = 10% relative increase). Incorrect: 'Support increased by 3% to 33%'—this statement confuses the two measures. Interest rates: Central bank raises interest rate from 2% to 2.5%. Percentage point change: 0.5 percentage points increase. Relative percentage change: 25% increase ((2.5-2)/2 × 100). Newspaper headline: 'Rates jump 25%!' sounds dramatic but refers to relative change. More measured: 'Rates rise 0.5 percentage points.' Both correct but convey different emphasis. Impact: A $100,000 mortgage payment calculation uses the absolute rate (2.5%), not the relative change (25%). Tax policy: Corporate tax rate decreases from 35% to 21% (actual U.S. 2017 change). Percentage point change: -14 percentage points (21 - 35 = -14 pp). Relative percentage change: -40% decrease ((21-35)/35 × 100 ≈ -40%). Political framing: Proponents might say '40% tax cut!' (emphasizing relative change). Critics might say '14 point reduction' (sounding more modest). Both mathematically correct, rhetorically different. Company profits: Company profit margin increases from 8% to 12%. Percentage point change: 4 percentage points increase. Relative percentage change: 50% increase ((12-8)/8 × 100 = 50%). Business report: 'Margins improved 50%!' (relative) sounds more impressive than 'Margins increased 4 points' (absolute). For a $10M revenue company: 8% margin = $800K profit. 12% margin = $1.2M profit. Absolute profit increased by $400K, which is 50% more profit than before. The margin's percentage point increase (4 pp) drove a 50% relative profit increase. Test scores: Class average increases from 70% to 77%. Percentage point change: 7 percentage points. Relative percentage change: 10% increase ((77-70)/70 × 100 = 10%). If a student's score increased from 70% to 77%, they improved by 7 percentage points, representing a 10% relative improvement in their scoring. When to use percentage points vs. relative percentage: Use Percentage Points when: Comparing two values already expressed as percentages or rates (interest rates, tax rates, unemployment rates, poll results, test scores, profit margins). The original values are themselves percentages, making arithmetic difference the natural measure. Example: 'The savings account interest rate increased from 1.5% to 2.0%—a gain of 0.5 percentage points.' Emphasizing absolute change in policy or rate. Example: 'The Federal Reserve raised rates 0.25 percentage points' (standard Federal Reserve communication). Avoiding confusion or misrepresentation. When the relative change is very large due to small original percentage, percentage points may be clearer. Example: Rate increases from 0.5% to 1.0%. Percentage points: 0.5 pp (modest-sounding). Relative change: 100% increase (dramatic-sounding but potentially misleading given small absolute values). Use Relative Percentage when: Describing growth or change in absolute quantities (revenue, population, weight, distance, prices). The original values are not percentages. Example: 'Revenue increased 15% from $2M to $2.3M.' Showing proportional impact relative to starting point. Example: 'Our profit margin improving from 3% to 6% represents a 100% relative increase in profitability—we doubled our margin.' Comparing changes across different scales. Relative percentages normalize comparisons. Example: Company A profit margin increased from 5% to 8% (3 pp, 60% relative increase). Company B margin increased from 15% to 18% (3 pp, 20% relative increase). Same absolute improvement (3 pp), but relative improvement much greater for Company A. Compound changes requiring multiplication. Example: 'Prices increased 5% per year for three years' uses relative percentage because compounding: Year 0: $100. Year 3: $100 × (1.05)^3 = $115.76. Cannot add percentage points across years when compounding occurs. Mathematical relationship: For small percentage changes, percentage points and relative percentage are similar. For large changes, they diverge significantly. When initial percentage is P and changes to P + ΔP: Percentage point change: ΔP. Relative percentage change: (ΔP / P) × 100. If P is small, ΔP / P can be very large. Example: 0.5% to 1.5%: Percentage points: 1.0 pp. Relative: (1.0 / 0.5) × 100 = 200% increase. Example: 40% to 42%: Percentage points: 2 pp. Relative: (2 / 40) × 100 = 5% increase. Communication best practices: Always specify units: Say 'percentage points' explicitly when using absolute difference. Don't say just '2%'—say '2 percentage points' or '2% relative increase.' Provide context: When impactful, provide both measures. 'Interest rates increased 0.5 percentage points from 2% to 2.5%, a relative increase of 25%.' Consider audience: General audiences may find percentage points more intuitive for rate changes. Financial audiences expect relative percentage for returns and growth. Avoid ambiguity: The phrase 'increased to 7%' is clear. The phrase 'increased by 7%' is ambiguous—7 percentage points or 7% relative increase? Clarify which is meant.",
    order: 3
  },
  {
    id: '4',
    question: "How do I work with percentages greater than 100% or negative percentages?",
    answer: "Percentages extending beyond the conventional 0-100% range are mathematically valid and frequently encountered in real-world applications, though they sometimes cause confusion because percentage originally means 'per hundred,' seemingly limiting values to 100%. Understanding these extended ranges enables accurate interpretation of financial gains, statistical comparisons, growth rates, and scientific measurements. Percentages Greater Than 100%: Meaning: A percentage greater than 100% indicates a value or change exceeding the whole reference amount. 100% represents the complete original value; anything above represents more than the original. Examples of valid >100% scenarios: Profit margin in markup: If a product costs $50 to produce and sells for $150, the markup is $100 profit on $50 cost. Markup percentage: ($100 / $50) × 100 = 200%. The profit is double the cost. The selling price is 300% of cost (100% original cost + 200% markup). Growth and increase: Population grows from 100,000 to 350,000. Growth: ((350,000 - 100,000) / 100,000) × 100 = 250% increase. The new population is 3.5 times the original (100% original + 250% growth = 350% total). Investment returns: Invest $10,000, value grows to $45,000. Return: ((45,000 - 10,000) / 10,000) × 100 = 350% return. The investment gained 3.5 times its original value. Final value is 450% of initial (100% principal + 350% gains). Test scores and performance: Student averages 60% on first half of course, 90% on second half. The second-half performance is 150% of the first-half performance (90/60 × 100 = 150%). This doesn't mean they scored 150% on tests (impossible), but rather their performance improved to 150% of the previous level (50% relative improvement). Over-subscription or capacity: Concert tickets: 10,000 seats available, 15,000 tickets requested. Demand is 150% of capacity ((15,000 / 10,000) × 100 = 150%), meaning 50% over capacity. Production efficiency: Factory expected to produce 1,000 units, actually produced 2,200 units. Achieved 220% of target, or exceeded target by 120%. Common misunderstanding about >100%: Some interpret >100% as impossible, conflating 'percentage of something' with 'percentage as a score or probability.' Probability and scores are bounded 0-100% (cannot score 110% on test or have 150% probability). Percentages expressing ratios, changes, or multiples have no upper bound (can have 200% growth, 500% return, etc.). Calculations involving >100%: Percentage of a value when percentage >100%: 150% of $80 = $80 × (150/100) = $80 × 1.5 = $120. Interpretation: Taking 1.5 times the value, or the original $80 plus an additional 50% ($40). Increasing a value by >100%: Increase $50 by 120%: $50 × (1 + 120/100) = $50 × 2.2 = $110. Original $50 + 120% of $50 ($60) = $110. The value more than doubled. Finding what % one number is of another when result >100%: $180 is what % of $75? ($180 / $75) × 100 = 240%. $180 is 240% of $75, meaning 2.4 times as large, or 140% more than $75. Reversing a >100% increase: If value increased by 150% (more than doubled), what decrease % returns to original? Increase example: $100 → $100 × (1 + 150/100) = $100 × 2.5 = $250. Reverse formula: X / (100 + X) × 100 = 150 / 250 × 100 = 60%. Verification: $250 × (1 - 60%) = $250 × 0.4 = $100 ✓. The 60% decrease on larger base ($250) reverses the 150% increase on smaller base ($100). Negative Percentages: Meaning: Negative percentages indicate decrease, reduction, loss, or values below zero reference points. Most commonly seen as percentage change (decrease) or performance below baseline. Examples of negative percentages: Percentage decrease: Stock price drops from $120 to $90. Change: ((90 - 120) / 120) × 100 = -25%. The negative sign indicates decrease; magnitude (25%) shows how much below original. Temperature change: Temperature drops from 10°C to -5°C. Change: ((-5 - 10) / 10) × 100 = -150%. Temperature decreased by 150%, going below zero. Note: Percentage change with absolute zero reference (Kelvin temperature, absolute quantities) requires care—percentages work best for interval scales without absolute zero meaning. Business loss: Company profit was $500K last year, loss of $200K this year (negative profit). Change: ((-200K - 500K) / 500K) × 100 = -140%. Profit decreased by more than 100%, swinging from positive to negative. Below-baseline performance: Student scores 40% when passing is 70%. Performance relative to passing: ((40 - 70) / 70) × 100 = -42.86%. Performed 42.86% below the passing standard. Calculations involving negative percentages: Decreasing a value by percentage (always produces smaller positive result): Decrease $200 by 30%: $200 × (1 - 30/100) = $200 × 0.70 = $140. Cannot decrease by more than 100% using this formula in practical contexts—decreasing by 100% means reducing to zero; >100% decrease would imply negative final value (sometimes conceptually valid for profits/losses, generally not for physical quantities). Applying negative percentage change: If percentage change = -15%, starting value was $80. Final value: $80 × (1 + (-15)/100) = $80 × 0.85 = $68. The negative change reduces the value. Reversing a negative change: Value decreased by 40% (from $100 to $60). To return to original: Reversal % = X / (100 - X) × 100 = 40 / (100-40) × 100 = 40/60 × 100 = 66.67%. Verification: $60 × (1 + 66.67%) = $60 × 1.6667 = $100 ✓. Negative percentages in complex scenarios: Compounded negative changes: Three consecutive 10% decreases: $1,000 × 0.90 × 0.90 × 0.90 = $1,000 × (0.90)^3 = $729. Total change: ((729 - 1,000) / 1,000) × 100 = -27.1% decrease, not -30% (three separate -10% are multiplicative, not additive). Mixed positive and negative changes: +20%, -15%, +10%: $100 × 1.20 × 0.85 × 1.10 = $112.20. Net: +12.2% despite one negative change. Order doesn't matter for final result (multiplication commutative) but affects intermediate values. Negative growth rates: Economy shrinks 3% per year for two years. Year 0: $1,000B GDP. Year 1: $1,000B × 0.97 = $970B. Year 2: $970B × 0.97 = $940.90B. Total change: -5.91%, not -6% (compounded negative growth). Percentages below zero base: Profit/loss swings: Year 1 profit: $200K. Year 2 loss: -$100K. Change: ((-100K - 200K) / 200K) × 100 = -150%. Profit decreased by more than 100%, turning into loss. Temperature (interval scale): Earlier example: 10°C to -5°C = -150% change. However, percentage change for temperatures should use absolute scale (Kelvin) for scientific accuracy. Kelvin: 283K to 268K = ((268-283)/283) × 100 = -5.3% (more meaningful for physical temperature change). Common contexts for >100% or negative %: Finance: Returns exceeding 100% (successful investments, cryptocurrency, startup equity), losses exceeding 100% (margin trading, leveraged positions), profit margins >100% (markup-based pricing). Business: Sales growth >100% year-over-year (successful product launches), revenue decline (negative growth), production efficiency relative to baseline. Statistics: Values more than double (200%+ of original), percentage point swings across zero (unemployment falling >100% of its value—e.g., 6% to 2% = -66.67% change). Science: Concentration changes, percentage error in measurements (can be negative if measurement under-estimates), efficiency ratings (sometimes >100% for heat pumps using energy transfer rather than generation). Interpretation tips: When seeing >100% increase: The value more than doubled. 100% increase = doubling, 200% increase = tripling, etc. When seeing negative percentage: Value decreased. Magnitude shows how much (in percentage terms) below the original. When seeing change >100% in magnitude (positive or negative): The value changed drastically—more than doubled (positive) or decreased to near-zero or below-zero (negative, in contexts allowing negative values like profits/losses). Contextual clues: Is the underlying quantity bounded (test score, probability) or unbounded (money, population, growth rate)? Bounded: Maximum 100%. Unbounded: Can exceed 100%.",
    order: 4
  },
  {
    id: '5',
    question: "How do compounding percentages work and why can't I just add them?",
    answer: "Compounding percentages involve multiple sequential percentage changes where each change applies to the result of the previous change, not the original value. This multiplicative nature means percentage changes cannot simply be added together—they must be multiplied (compounded) to determine the cumulative effect. Understanding compounding is essential for financial calculations (interest, investments, inflation), business growth projections, and accurately interpreting multi-period changes. Why percentages compound (don't add): Each percentage change operates on a different base value. The first change applies to the original value, but the second change applies to the already-changed value, which is different from the original. This changing base makes the operations multiplicative rather than additive. Simple example demonstrating non-additivity: Starting value: $100. First change: +10% increase. $100 × 1.10 = $110. Second change: +10% increase (applied to $110, not original $100). $110 × 1.10 = $121. Total change: $121 - $100 = $21 = 21% increase, not 20% (10% + 10%). Why not 20%? The second 10% increase includes two components: 10% of original $100 = $10 (similar to first increase). 10% of the first increase's $10 = $1 (extra compounding effect). Total second increase: $11, not $10. The $1 extra comes from 'earning interest on interest' (10% on the first period's $10 gain). Mathematical compounding formula: For n consecutive percentage changes (rates r₁, r₂, ..., rₙ expressed as decimals): Final Value = Initial Value × (1 + r₁) × (1 + r₂) × ... × (1 + rₙ). Each (1 + r) term represents keeping 100% of the current value plus the r% change. For n identical changes at rate r: Final Value = Initial Value × (1 + r)^n. Total percentage change = [((1 + r)^n - 1] × 100. Example: Three consecutive 10% increases starting from $100: $100 × (1.10)^3 = $100 × 1.331 = $133.10. Total change: ((1.331 - 1) × 100 = 33.1% increase, not 30% (3 × 10%). Cumulative effect exceeds simple addition because each increase builds on previous increases. Compound interest - The classic application: Principal grows through repeated interest applications: Formula: A = P(1 + r/n)^(nt). A = Final amount. P = Principal (initial investment). r = Annual interest rate (as decimal). n = Number of compounding periods per year. t = Number of years. Example: $10,000 invested at 5% annual interest, compounded annually for 10 years: A = $10,000 × (1 + 0.05/1)^(1×10) = $10,000 × (1.05)^10 = $10,000 × 1.6289 = $16,289. Total growth: 62.89%, far exceeding simple 50% (5% × 10 years) if interest didn't compound. The difference ($1,289) represents 'interest on interest'—cumulative compounding effect. More frequent compounding increases returns: Same example with quarterly compounding (n = 4): A = $10,000 × (1 + 0.05/4)^(4×10) = $10,000 × (1.0125)^40 = $10,000 × 1.6436 = $16,436. Quarterly compounding earns $147 more than annual compounding due to more frequent application of interest to growing balance. Continuous compounding (theoretical limit, used in advanced finance): A = Pe^(rt), where e ≈ 2.71828. Same example: $10,000 × e^(0.05×10) = $10,000 × e^0.5 = $10,000 × 1.6487 = $16,487. Continuous compounding represents maximum possible return for given rate. Mixed increases and decreases: Compounding applies equally to mixed changes; order of multiplication doesn't affect final result (commutative property), but affects intermediate values. Example: $100 subject to +15%, -10%, +20% changes: Method 1 (order given): $100 × 1.15 = $115. $115 × 0.90 = $103.50. $103.50 × 1.20 = $124.20. Method 2 (different order: +15%, +20%, -10%): $100 × 1.15 = $115. $115 × 1.20 = $138. $138 × 0.90 = $124.20 (same final result). Total: 24.2% cumulative increase. Cannot obtain by adding (15% - 10% + 20% = 25%, incorrect). Compound formula: $100 × 1.15 × 0.90 × 1.20 = $100 × 1.242 = $124.20. Cumulative percentage change = (1.242 - 1) × 100 = 24.2%. Inflation and purchasing power: Multi-year inflation compounds, eroding purchasing power multiplicatively. Example: $1,000 purchasing power with 3% annual inflation over 20 years: Future value in nominal dollars: $1,000 × (1.03)^20 = $1,000 × 1.8061 = $1,806.10. Purchasing power of original $1,000 in future: $1,000 / 1.8061 = $553.68 (declined 44.6%). Total inflation: 80.61%, far exceeding simple 60% (3% × 20 years). $1,806.10 in future dollars equals $1,000 in today's buying power due to cumulative inflation. Population growth: Population growth/decline compounds annually. Example: City population 500,000 growing at 2% annually for 25 years: Population = 500,000 × (1.02)^25 = 500,000 × 1.6406 = 820,300. Growth: 64.06%, not 50% (2% × 25 years). Extra 14% results from compounding (population growth on previously added population). Investment returns over time: Stock portfolio grows at varying annual returns: Year 1: +15% (10,000 → 11,500). Year 2: -5% (11,500 → 10,925). Year 3: +22% (10,925 → 13,329). Year 4: +8% (13,329 → 14,395). Year 5: -3% (14,395 → 13,963). Final value: $13,963. Total return: (13,963 - 10,000) / 10,000 × 100 = 39.63%. Average annual simple return: (15 - 5 + 22 + 8 - 3) / 5 = 7.4% per year. But $10,000 × (1.074)^5 = $14,312 ≠ actual $13,963. The arithmetic mean doesn't account for compounding. Geometric mean (correct average for compounding): [(1.15 × 0.95 × 1.22 × 1.08 × 0.97)^(1/5)] - 1 = [1.3963^0.2] - 1 = 0.0691 = 6.91% per year. Verification: $10,000 × (1.0691)^5 = $13,963 ✓. Key insight: For volatile returns, geometric mean < arithmetic mean due to compounding effects and volatility drag. Negative compounding (decay): Repeated percentage decreases compound similarly to increases. Example: Asset value declining 8% annually for 5 years starting at $50,000: Year 5 value: $50,000 × (0.92)^5 = $50,000 × 0.6591 = $32,955. Total decline: -34.09%, not -40% (8% × 5). The declining base means each year's loss is smaller in absolute dollars: Year 1 loss: $4,000 (8% of $50,000). Year 5 loss: $2,876 (8% of $35,847 beginning Year 5 value). Rule of 72 (quick compounding approximation): Estimates doubling time for compound growth: Years to Double ≈ 72 / Annual Growth Rate (as whole number). Example: 6% annual growth doubles in 72/6 = 12 years. Verification: (1.06)^12 = 2.012 ≈ 2 (doubled). Example: 10% growth doubles in 72/10 = 7.2 years. Verification: (1.10)^7.2 = 2.038 ≈ 2. Works reasonably well for rates 5-15%; less accurate outside this range. Origin: 72 is close to 100×ln(2) ≈ 69.3, and divisible by many numbers, making mental math easier. Practical implications: Retirement savings: Small increases in contribution rate or return dramatically impact final value due to compounding over decades. Increasing annual contribution by 1% or finding investment with 1% higher return compounds to substantially larger retirement funds. Debt and credit cards: Credit card interest compounds (often daily), making minimum payments ineffective at reducing principal. Missing payments allows compounding to accelerate debt growth. Business growth: Companies with 20% annual revenue growth don't triple in 10 years (10 × 20% = 200% simple). They multiply by (1.20)^10 = 6.19×, or 519% growth. Startup valuations with hypergrowth assumptions rely on compounding projections. Why understanding compounding matters: Accurate forecasting: Linear projections (adding percentages) dramatically underestimate compound growth or decay over time. Investment decisions: Comparing investment options requires understanding compound annual growth rate (CAGR), not simple averages. Debt management: Recognizing how quickly compound interest grows unpaid debt motivates aggressive repayment strategies. Economic policy: Inflation targets (e.g., 2% annual) compound, requiring consideration of cumulative long-term purchasing power erosion. Calculating compound annual growth rate (CAGR): Determines the single annual rate that, if compounded, produces observed total growth. Formula: CAGR = [(Ending Value / Beginning Value)^(1/Number of Years)] - 1. Example: Investment grows from $25,000 to $45,000 over 8 years: CAGR = [($45,000 / $25,000)^(1/8)] - 1 = [1.8^0.125] - 1 = 1.0752 - 1 = 0.0752 = 7.52% annually. Verification: $25,000 × (1.0752)^8 = $45,000 ✓. The 7.52% CAGR tells you the equivalent constant annual growth rate, smoothing out year-to-year variations. Summary principle: Whenever multiple percentage changes occur sequentially, they compound (multiply) rather than add. Always use multiplicative formulas: multiply (1 + rate) terms together, or use (1 + rate)^n for identical repeated rates. The cumulative effect exceeds simple addition for increases and is less severe than simple addition suggests for decreases, due to changing base values.",
    order: 5
  },
  {
    id: '6',
    question: "What are the most common percentage calculation mistakes and how do I avoid them?",
    answer: "Percentage calculations, despite being fundamental arithmetic, are prone to systematic errors that lead to misinterpretation in finance, business, statistics, and everyday decisions. Recognizing these common mistakes and implementing verification strategies prevents costly errors and improves numerical literacy. Most Common Percentage Errors: 1. Wrong Base Value in Percentage Change Calculations: Error: Using the ending value as the denominator instead of the starting value when calculating percentage change. Wrong: Price changes from $80 to $100. Someone calculates: ($100 - $80) / $100 × 100 = 20% increase. Correct: ($100 - $80) / $80 × 100 = 25% increase. Why wrong: The question is 'how much did the original value change?'—the original ($80) must be the reference (denominator). Using $100 asks 'what is $80 as a percentage of $100?' (80%), not the increase percentage. Verification: Apply the calculated percentage to original value. If correct, should yield ending value: $80 × (1 + 25%) = $80 × 1.25 = $100 ✓. $80 × (1 + 20%) = $96 ≠ $100 ✗. Prevention: Always identify which value is 'before' (original/starting) and which is 'after' (new/ending). The 'before' value is always the denominator. 2. Adding Sequential Percentage Changes Instead of Compounding: Error: Treating consecutive percentage changes as additive when they're multiplicative. Wrong: Three 10% annual raises over three years = 30% total raise. Correct: (1.10)^3 - 1 = 0.331 = 33.1% total raise. Why wrong: Each raise applies to the new salary (including previous raises), not the original salary. The second 10% includes 10% of the first raise, creating compounding. Verification: Calculate step-by-step: Year 0: $50,000. Year 1: $50,000 × 1.10 = $55,000. Year 2: $55,000 × 1.10 = $60,500. Year 3: $60,500 × 1.10 = $66,550. Total increase: $16,550 = 33.1% of original, not 30%. Prevention: Always multiply (1 + rate) factors for consecutive changes, or use (1 + rate)^n for identical repeated changes. Never add percentages for sequential changes. 3. Confusing Percentage Points with Percentage Change: Error: Reporting absolute difference in percentages as percentage change or vice versa. Wrong: Interest rate increases from 4% to 6%. Someone reports: '50% increase' (technically correct as relative change) but audience interprets as 50 percentage points (4% to 54%). Correct ambiguity-free: '2 percentage point increase from 4% to 6%, representing a 50% relative increase.' Why wrong: Without explicit units, numerical statement '50%' or '2%' in context of percentages creates confusion. Is it 2 pp or 2% relative change? Prevention: Always specify 'percentage points' for absolute difference or 'percent increase/decrease' for relative change. Provide both when communicating to avoid misunderstanding. 4. Reversibility Error: Assuming +X% Then -X% Returns to Original: Error: Thinking that increasing by X% then decreasing by X% returns to the original value. Wrong: Price increased 25%, then decreased 25%, so price returned to original. Correct: $100 → +25% → $125 → -25% → $93.75 (6.25% below original). Why wrong: The 25% increase applies to $100 ($25), but the 25% decrease applies to $125 ($31.25), a larger absolute amount. The decrease operates on a larger base. Calculation: $100 × 1.25 × 0.75 = $93.75. To reverse +25%, must decrease by 20%: 25/(100+25) = 0.20 = 20%. $125 × 0.80 = $100 ✓. Prevention: Never assume symmetry in percentage changes. To reverse a change, calculate the specific reversal percentage using formulas: To reverse +X%: divide by (1 + X/100) or decrease by [X/(100+X) × 100]%. To reverse -X%: divide by (1 - X/100) or increase by [X/(100-X) × 100]%. 5. Comparing Percentages with Different Bases (Apples to Oranges): Error: Directly comparing percentage values that reference different bases. Wrong: Company A profit margin is 15%, Company B profit margin improved 15%. Conclusion: Both have same profitability change. Correct: Company A profit margin being 15% describes absolute profitability (profit as % of revenue). Company B improving 15% describes relative change in their margin (e.g., from 20% to 23%, a 15% relative improvement in margin percentage, calculated as (23-20)/20 × 100). These are incomparable without context. Prevention: Identify what each percentage represents—absolute value (percentage of whole) vs. change (percentage increase/decrease of previous value). Ensure comparisons use the same type of percentage measurement. 6. Percentage of Percentage Errors: Error: Incorrectly calculating what percentage of a percentage is, or misunderstanding the relationship. Wrong: 50% of 80% = 50 + 80 = 130% or 50 - 80 = -30%. Correct: 50% of 80% = 0.50 × 0.80 = 0.40 = 40%. Why wrong: 'Of' in mathematics means multiply. 'Percentage of a percentage' multiplies the decimal equivalents. Prevention: Convert percentages to decimals, perform the operation, convert back to percentage. X% of Y% = (X/100) × (Y/100) × 100 = (X × Y) / 100 percent. 7. Rounding Errors in Multi-Step Calculations: Error: Rounding intermediate values, then using rounded numbers in subsequent calculations, accumulating errors. Wrong: Calculate 7% sales tax on $284.37, then 15% tip on total. Sales tax: $284.37 × 0.07 = $19.91 (rounded from $19.9059). Subtotal: $284.37 + $19.91 = $304.28. Tip: $304.28 × 0.15 = $45.64 (rounded from $45.642). Total: $284.37 + $19.91 + $45.64 = $349.92. Correct (full precision): Tax: $284.37 × 0.07 = $19.9059. Subtotal: $304.2759. Tip: $304.2759 × 0.15 = $45.641385. Total: $349.916285 ≈ $349.92. In this case, same final result, but in complex calculations or large numbers, early rounding compounds errors. Prevention: Maintain full precision through calculations (use calculator memory or write full decimal values), round only the final result. For financial calculations, use appropriate decimal places (typically 2 for currency, more for intermediate steps). 8. Percentage Error in Scientific Measurements: Error: Incorrectly calculating or interpreting percentage error between measured and true values. Wrong: True value: 50. Measured value: 60. Error: (60 - 50) / 60 × 100 = 16.67%. Correct: Percentage error = |Measured - True| / |True| × 100 = |60 - 50| / 50 × 100 = 20%. Why wrong: Percentage error uses true value as reference (when known), not measured value. The question is 'how much did the measurement deviate from truth relative to the true value?' Prevention: In scientific contexts, percentage error formula: (|Experimental - Theoretical| / |Theoretical|) × 100. Use absolute values to ensure positive error percentage (or keep sign for signed error indicating over/under-estimation). 9. Percentage vs. Percentage Point Growth Rates: Error: Reporting growth using wrong metric or misunderstanding compounding. Wrong: Population growth rate increased from 1.5% to 2.0% annually. Reporting: 'Growth rate increased 33%' (relative change in the rate: (2.0-1.5)/1.5 × 100). Audience understands: 'Population grew 33%' (total population change). Correct communication: 'Annual population growth rate increased by 0.5 percentage points, from 1.5% to 2.0%, representing a 33% increase in the growth rate itself.' Why confusing: The growth rate (itself a percentage) increased. The percentage change in a percentage needs careful wording to avoid confusing it with the underlying percentage's effect. Prevention: Distinguish between changes in rates (percentage of percentage) and the rates themselves. Over-communicate context when discussing percentage changes of percentages. 10. Misapplying Percentage Formulas: Error: Using formulas in inappropriate contexts, such as percentage change for values crossing zero or percentages for categorical data. Wrong: Temperature changes from -10°C to +10°C. Change: ((10 - (-10)) / -10) × 100 = -200%. Nonsensical: Negative percentage increase. Correct approach: For interval scales crossing zero, report absolute change (20°C increase) or use ratio scale (Kelvin): 263K to 283K = 7.6% increase. Why wrong: Percentage change formula assumes a positive reference value. Crossing zero makes the calculation meaningless (dividing by zero or negative reference creates unintuitive results). Prevention: Recognize when percentage change is appropriate (positive ratio scale values) vs. when absolute change or other metrics better describe the situation (interval scales, categorical changes, values crossing zero). Verification Strategies to Catch Errors: Reverse calculation: After calculating a percentage change or finding a percentage of a value, apply the result backward to check if you return to the original value. Example: Calculated 30% of 250 = 75. Check: Does 75 represent 30% of 250? 75/250 × 100 = 30% ✓. Sanity check: Does the result make intuitive sense? If a $50 item has a $20 discount, is 80% off reasonable? 20/50 = 40% off (not 80%). 80% would be $40 discount. Order of magnitude: Is the result approximately right? Quick mental math can catch errors like decimal point mistakes (20% of 500 should be around 100, not 10 or 1,000). Alternative method: Calculate the same value using a different approach and compare. Example: 15% increase on $200. Method 1: $200 × 1.15 = $230. Method 2: $200 + ($200 × 0.15) = $200 + $30 = $230 ✓. Benchmark comparisons: Compare calculated percentage to known benchmarks. Example: If calculating 'percentage of daily calories from protein,' and result is 85%, something is wrong (typical range 10-35%). Units and context: Ensure the percentage references the correct base and the result makes sense in context (profit margin can't be 300% using standard definition; return on investment can be >100% in some scenarios). Calculator double-entry: For critical calculations, perform the calculation twice independently or have someone else verify. Best Practices to Prevent Percentage Errors: Always identify 'before' and 'after' values or 'part' and 'whole' before calculating. Use formulas explicitly rather than intuiting calculations. Maintain precision through calculation; round only final results. Communicate percentages clearly, specifying percentage points vs. relative percentage when relevant. Verify results through reverse calculations or alternative methods. Recognize contexts where percentages are inappropriate or require special handling. Understand compounding for sequential changes; never add percentages blindly. Common error patterns to watch for: Any time you add percentages for sequential changes—probably wrong. Any time you use the ending value as the denominator for percentage change—probably wrong. Any time you assume symmetry (±X% reversibility)—probably wrong. Any time percentages exceed 100% or are negative—verify that the context allows this (it often does, but double-check interpretation). Any time you report 'X% increase' without specifying what X refers to—potentially ambiguous. By systematically applying these verification strategies and avoiding common error patterns, percentage calculation accuracy dramatically improves, preventing misinterpretation and flawed decision-making based on numerical errors.",
    order: 6
  }
];

type CalculationType = 'percentOf' | 'whatPercent' | 'percentChange' | 'increaseBy' | 'decreaseBy';

const calculationTypes = [
  { value: 'percentOf' as CalculationType, label: 'X% of Y', description: 'Find a percentage of a number' },
  { value: 'whatPercent' as CalculationType, label: 'X is ?% of Y', description: 'Find what percent X is of Y' },
  { value: 'percentChange' as CalculationType, label: 'Change %', description: 'Calculate percentage change' },
  { value: 'increaseBy' as CalculationType, label: 'Increase by %', description: 'Increase a number by percentage' },
  { value: 'decreaseBy' as CalculationType, label: 'Decrease by %', description: 'Decrease a number by percentage' },
];

export default function PercentageCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('percentage-calculator');

  const [calcType, setCalcType] = useState<CalculationType>('percentOf');
  const [value1, setValue1] = useState<number>(20);
  const [value2, setValue2] = useState<number>(100);

  const relatedCalculators = [
    { href: '/us/tools/calculators/fraction-calculator', title: 'Fraction Calculator', description: 'Work with fractions' },
    { href: '/us/tools/calculators/average-calculator', title: 'Average Calculator', description: 'Statistical averages' },
    { href: '/us/tools/calculators/modulo-calculator', title: 'Modulo Calculator', description: 'Find remainders' },
    { href: '/us/tools/calculators/ratio-calculator', title: 'Ratio Calculator', description: 'Calculate ratios' },
  ];

  const calculate = (): { result: number; explanation: string; formula: string } => {
    switch (calcType) {
      case 'percentOf':
        const percentOfResult = (value1 / 100) * value2;
        return {
          result: percentOfResult,
          explanation: `${value1}% of ${value2} = ${percentOfResult.toFixed(4)}`,
          formula: `${value2} × (${value1}/100) = ${percentOfResult.toFixed(4)}`
        };
      case 'whatPercent':
        const whatPercentResult = (value1 / value2) * 100;
        return {
          result: whatPercentResult,
          explanation: `${value1} is ${whatPercentResult.toFixed(2)}% of ${value2}`,
          formula: `(${value1} / ${value2}) × 100 = ${whatPercentResult.toFixed(4)}%`
        };
      case 'percentChange':
        const changeResult = ((value2 - value1) / value1) * 100;
        return {
          result: changeResult,
          explanation: `Change from ${value1} to ${value2} is ${changeResult >= 0 ? '+' : ''}${changeResult.toFixed(2)}%`,
          formula: `((${value2} - ${value1}) / ${value1}) × 100 = ${changeResult.toFixed(4)}%`
        };
      case 'increaseBy':
        const increaseResult = value2 * (1 + value1 / 100);
        return {
          result: increaseResult,
          explanation: `${value2} increased by ${value1}% = ${increaseResult.toFixed(4)}`,
          formula: `${value2} × (1 + ${value1}/100) = ${increaseResult.toFixed(4)}`
        };
      case 'decreaseBy':
        const decreaseResult = value2 * (1 - value1 / 100);
        return {
          result: decreaseResult,
          explanation: `${value2} decreased by ${value1}% = ${decreaseResult.toFixed(4)}`,
          formula: `${value2} × (1 - ${value1}/100) = ${decreaseResult.toFixed(4)}`
        };
      default:
        return { result: 0, explanation: '', formula: '' };
    }
  };

  const { result, explanation, formula } = calculate();

  const getInputLabels = () => {
    switch (calcType) {
      case 'percentOf':
        return { label1: 'Percentage (%)', label2: 'of Value' };
      case 'whatPercent':
        return { label1: 'Value (X)', label2: 'of Total (Y)' };
      case 'percentChange':
        return { label1: 'Original Value', label2: 'New Value' };
      case 'increaseBy':
        return { label1: 'Increase by (%)', label2: 'Value' };
      case 'decreaseBy':
        return { label1: 'Decrease by (%)', label2: 'Value' };
      default:
        return { label1: 'Value 1', label2: 'Value 2' };
    }
  };

  const { label1, label2 } = getInputLabels();

  const getResultColor = () => {
    if (calcType === 'percentChange') {
      return result >= 0 ? 'from-green-50 to-emerald-50 border-green-100' : 'from-red-50 to-rose-50 border-red-100';
    }
    return 'from-blue-50 to-indigo-50 border-blue-100';
  };

  const getResultTextColor = () => {
    if (calcType === 'percentChange') {
      return result >= 0 ? 'text-green-700' : 'text-red-700';
    }
    return 'text-blue-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Percentage Calculator')}</h1>
          <p className="text-gray-600">Calculate percentages, increases, decreases, and changes</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          {/* Calculation Type Selection */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {calculationTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setCalcType(type.value)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    calcType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium block">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Values</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label1}</label>
                  <input
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    step="any"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label2}</label>
                  <input
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    step="any"
                  />
                </div>
              </div>

              {/* Quick Percentages */}
              {(calcType === 'percentOf' || calcType === 'increaseBy' || calcType === 'decreaseBy') && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 15, 20, 25, 50, 75, 100].map((p) => (
                      <button
                        key={p}
                        onClick={() => setValue1(p)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                          value1 === p
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Result Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

              {/* Main Result */}
              <div className={`bg-gradient-to-br ${getResultColor()} rounded-lg p-5 border mb-4`}>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getResultTextColor()} mb-2`}>
                    {calcType === 'percentChange' || calcType === 'whatPercent'
                      ? `${result >= 0 && calcType === 'percentChange' ? '+' : ''}${result.toFixed(2)}%`
                      : result.toFixed(4)
                    }
                  </div>
                  <div className={`text-sm ${getResultTextColor()} opacity-80`}>{explanation}</div>
                </div>
              </div>

              {/* Formula */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">Formula Used</div>
                <div className="font-mono text-sm text-gray-700">{formula}</div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Quick Reference Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-gray-700 font-medium">Value</th>
                  {[10, 15, 20, 25, 50].map(p => (
                    <th key={p} className="px-3 py-2 text-center text-gray-700 font-medium">{p}%</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[50, 100, 200, 500, 1000].map(v => (
                  <tr key={v}>
                    <td className="px-3 py-2 font-medium text-gray-800">{v}</td>
                    {[10, 15, 20, 25, 50].map(p => (
                      <td key={p} className="px-3 py-2 text-center text-gray-600">{(v * p / 100).toFixed(0)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulas */}
        <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Basic Formulas</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium text-gray-800">X% of Y:</span> Y × (X/100)</li>
              <li><span className="font-medium text-gray-800">X is what % of Y:</span> (X/Y) × 100</li>
              <li><span className="font-medium text-gray-800">Find Y from X%:</span> X / (Percent/100)</li>
            </ul>
          </div>
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Change Formulas</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium text-gray-800">% Change:</span> ((New - Old) / Old) × 100</li>
              <li><span className="font-medium text-gray-800">Increase by X%:</span> Value × (1 + X/100)</li>
              <li><span className="font-medium text-gray-800">Decrease by X%:</span> Value × (1 - X/100)</li>
            </ul>
          </div>
        </div>

        {/* Common Uses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Common Percentage Uses</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800 text-sm">Sales Tax</div>
              <div className="text-xs text-gray-500 mt-1">Price × (1 + Tax%)</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800 text-sm">Discount</div>
              <div className="text-xs text-gray-500 mt-1">Price × (1 - Disc%)</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800 text-sm">Tip</div>
              <div className="text-xs text-gray-500 mt-1">Bill × Tip%</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800 text-sm">Profit Margin</div>
              <div className="text-xs text-gray-500 mt-1">(Profit/Revenue) × 100</div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Mastering Percentages: Mathematical Foundations and Practical Applications</h2>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">The Mathematical Nature of Percentages</h3>
            <p className="mb-4">
              Percentages represent one of mathematics' most practical and widely-used concepts, providing a standardized method for expressing proportions, changes, and relationships. A percentage expresses a number as a fraction of 100, enabling intuitive comparisons regardless of absolute scale. When comparing test scores of 45/50 versus 90/100, percentages (90% versus 90%) immediately reveal equivalence that raw scores obscure. This normalization to a base of 100 makes percentages invaluable across finance, statistics, science, and daily decision-making.
            </p>
            <p className="mb-4">
              The mathematical foundation rests on the equivalence: X% = X/100 (fraction) = 0.0X (decimal) = X:100 (ratio). These interchangeable representations enable flexible calculation approaches. Finding 25% of 200 can be computed as 200 × (25/100) = 200 × 0.25 = 50, or recognizing 25% = 1/4, thus 200 ÷ 4 = 50. This multiplicative relationship differs fundamentally from additive operations, causing common errors when percentages compound across multiple periods or reference changing bases.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Core Percentage Calculations</h3>
            <p className="mb-4">
              Five fundamental percentage calculations address virtually all practical scenarios: finding a percentage of a value, determining what percentage one value represents of another, calculating percentage change between values, increasing values by percentages, and decreasing values by percentages. Each requires specific formula application to avoid the systematic errors that plague percentage calculations.
            </p>
            <p className="mb-4">
              Finding X% of Y multiplies the value by the percentage expressed as decimal: Result = Y × (X/100). Calculating 18% sales tax on $45 purchase yields $45 × 0.18 = $8.10 tax. The inverse operation—determining what percentage X represents of Y—divides the part by the whole then scales to 100: Percentage = (X/Y) × 100. If $12 of a $80 restaurant bill is tip, the tip percentage is ($12/$80) × 100 = 15%. These two operations form the basis for more complex percentage manipulations.
            </p>
            <p className="mb-4">
              Percentage change quantifies proportional difference relative to an original value using the critical formula: % Change = ((New - Original)/Original) × 100. This formula's denominator must always be the original/starting value—the reference before change occurred. If stock price increases from $75 to $90, the change calculates as ((90-75)/75) × 100 = 20% increase, not ((90-75)/90) × 100 = 16.67% (wrong denominator). Positive results indicate increases; negative results indicate decreases. This asymmetry creates non-reversibility: increasing by 20% then decreasing by 20% doesn't return to the original value ($75 × 1.20 × 0.80 = $72, not $75).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Percentage Points vs. Relative Percentage Change</h3>
            <p className="mb-4">
              The distinction between percentage points and percentage change represents a common source of confusion with significant consequences for interpreting economic data, political polling, and financial reports. Percentage points measure arithmetic difference between two percentage values through simple subtraction, while percentage change measures proportional relationship using division and scaling. When interest rates increase from 3% to 5%, the change can be described two ways: a 2 percentage point increase (5 - 3 = 2 pp), or a 66.67% relative increase ((5-3)/3 × 100 = 66.67%).
            </p>
            <p className="mb-4">
              Media often reports these measures ambiguously or incorrectly, creating misunderstanding. A headline stating "unemployment fell 2%" could mean either a 2 percentage point decrease (8% to 6%) or a 2% relative decrease (8% to 7.84%). Without explicit clarification, audiences guess—often incorrectly. Financial contexts demand precision: mortgage calculations use absolute interest rates (percentage points), while investment return comparisons use relative percentages. Saying a savings account interest "increased 50%" sounds dramatic but may only mean 0.5 percentage points (from 1.0% to 1.5%), while the accurate "0.5 percentage point increase" sounds modest despite being the same change.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Compounding and the Multiplicative Nature of Sequential Changes</h3>
            <p className="mb-4">
              Multiple consecutive percentage changes cannot simply be added—they must be compounded (multiplied) because each change operates on a different base value. This multiplicative property underlies compound interest, investment returns, inflation adjustments, and business growth calculations. Three consecutive 10% annual salary increases don't total 30% cumulative increase; they compound to 33.1% ((1.10)³ - 1 = 33.1%). The extra 3.1% arises from the second increase including 10% of the first increase, and the third including 10% of both previous increases plus their interaction.
            </p>
            <p className="mb-4">
              Compound interest illustrates this principle most famously. Investing $10,000 at 6% annual interest compounded annually for 20 years grows to $10,000 × (1.06)²⁰ = $32,071—a 220.7% increase far exceeding simple interest's 120% (6% × 20 years). The $10,071 difference represents "interest on interest"—earnings from previous periods generating their own returns. More frequent compounding amplifies this effect: quarterly compounding at the same 6% annual rate yields $32,620, extracting an additional $549 through more frequent application of interest to growing balances.
            </p>
            <p className="mb-4">
              The Rule of 72 provides quick mental approximation for doubling time under compound growth: Years to Double ≈ 72 / Annual Rate. At 8% annual return, investments double in approximately 72/8 = 9 years. Verification: (1.08)⁹ = 1.999 ≈ 2. This approximation works well for rates 5-15%, enabling rapid assessment of long-term growth implications. Understanding compounding transforms retirement planning—recognizing that consistent 7% returns double wealth every 10 years motivates early savings when compounding has maximum time to operate.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Common Applications and Real-World Contexts</h3>
            <p className="mb-4">
              Percentages pervade daily financial decisions and business analytics. Retail discounts require calculating both percentage off and final price: a $120 item with 35% discount costs $120 × (1 - 0.35) = $78. Sales tax adds percentage to subtotal: $78 purchase with 7.5% tax totals $78 × (1 + 0.075) = $83.85. Restaurant tips commonly use percentage of pre-tax bill: 18% tip on $65 bill equals $65 × 0.18 = $11.70. These everyday calculations benefit from recognizing patterns—20% equals 1/5 (divide by 5), 25% equals 1/4 (divide by 4), 10% simply moves decimal one place left.
            </p>
            <p className="mb-4">
              Business metrics rely heavily on percentages: profit margins express profit as percentage of revenue ((Profit/Revenue) × 100), enabling comparison across different-sized companies. Return on investment measures gains relative to cost (((Value - Cost)/Cost) × 100), standardizing performance evaluation. Year-over-year growth rates track business expansion (((Current Year - Previous Year)/Previous Year) × 100), revealing trends independent of absolute scale. Market share percentages allocate competitive position ((Company Sales/Total Market Sales) × 100), guiding strategic planning.
            </p>
            <p className="mb-4">
              Statistical contexts use percentages for probability (favorable outcomes / total outcomes × 100), confidence intervals (95% confidence means 5% error probability), error margins in polling, and demographic distributions. Academic grading converts raw scores to percentages ((Points Earned/Total Points) × 100), enabling standardized comparison across different assignments and courses. Healthcare expresses body fat percentage, blood test results against reference ranges, and medication dosages per kilogram bodyweight.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Avoiding Common Percentage Calculation Errors</h3>
            <p className="mb-4">
              Systematic errors plague percentage calculations despite their fundamental simplicity. The most frequent mistake involves using the wrong base value when calculating percentage change—using the ending value as denominator instead of the starting value. This error stems from confusion about the question being answered: "How much did the original value change?" requires the original value as reference (denominator). Verification through reverse calculation catches this error: if calculated percentage applied to original value doesn't yield ending value, the base value is wrong.
            </p>
            <p className="mb-4">
              Assuming reversibility—that increasing by X% then decreasing by X% returns to the original value—creates another common error. The mathematics proves otherwise: $100 increased 25% becomes $125; decreasing $125 by 25% yields $93.75, losing $6.25 from the original. To reverse a percentage increase, the decrease percentage must be calculated as: Decrease% = (Increase% / (100 + Increase%)) × 100. Reversing a 25% increase requires (25/125) × 100 = 20% decrease. This asymmetry reflects the changing base values—the increase applies to $100, the decrease to $125.
            </p>
            <p className="mb-4">
              Adding sequential percentage changes rather than multiplying them produces dramatic errors in multi-period calculations. Three consecutive 15% declines don't total -45%; they compound to (1 - 0.15)³ - 1 = -38.6%. Each decline applies to a progressively smaller base, making subsequent absolute decreases smaller even though the percentage remains constant. Investment returns, inflation calculations, and population growth all require multiplicative compounding, never simple addition.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Advanced Percentage Concepts and Edge Cases</h3>
            <p className="mb-4">
              Percentages exceeding 100% or becoming negative sometimes confuse those expecting 0-100% bounds. These extended ranges are mathematically valid in specific contexts. Percentages expressing ratios, changes, or multiples have no upper bound—a 200% increase means tripling (original 100% + 200% growth = 300% total), a 500% investment return means sixfolding. Negative percentages indicate decreases or below-baseline performance. However, percentages representing probabilities or test scores are bounded 0-100% by definition—cannot have 150% probability or score 120% on a test (unless extra credit explicitly allows).
            </p>
            <p className="mb-4">
              Percentage changes crossing zero create mathematical ambiguity. Temperature changing from -10°C to +10°C yields ((10-(-10))/-10) × 100 = -200%, a nonsensical negative percentage increase. The issue: percentage change formulas assume positive reference values. For interval scales like Celsius where zero is arbitrary (not absolute absence), percentage change proves inappropriate. Converting to ratio scale (Kelvin) or reporting absolute change (20°C increase) resolves this. Similarly, profit/loss swings from +$500K to -$200K calculate as ((-200K - 500K)/500K) × 100 = -140%—a meaningful &gt;100% decrease reflecting the profit-to-loss transition.
            </p>
            <p className="mb-4">
              Weighted averages complicate simple percentage aggregation. If Population A is 40% female and Population B is 60% female, the combined population percentage female depends on relative population sizes, not simple averaging. If A has 10,000 people and B has 30,000 people: Combined = ((0.40 × 10,000) + (0.60 × 30,000)) / (10,000 + 30,000) = (4,000 + 18,000) / 40,000 = 55%, not (40% + 60%)/2 = 50%. Percentages require their base values for accurate combination.
            </p>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs Section */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <FirebaseFAQs pageId="percentage-calculator" fallbackFaqs={fallbackFaqs} />
        </div>

{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCalculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700">{calc.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{calc.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
