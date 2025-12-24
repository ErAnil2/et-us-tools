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
    question: "What are fractions and how do they represent parts of a whole?",
    answer: "A fraction represents a part of a whole, expressing the division of a quantity into equal parts. Mathematically, a fraction consists of two integers: the numerator (top number) indicating how many parts are being considered, and the denominator (bottom number) indicating how many equal parts the whole is divided into. The fraction a/b means 'a parts out of b equal parts,' or equivalently, the result of dividing a by b. For example, 3/4 represents three parts out of four equal parts, equivalent to 0.75 as a decimal or 75% as a percentage. Fractions provide precise representation of quantities between whole numbers, essential for mathematics, science, cooking, construction, and everyday measurements. Historical development: Fractions emerged independently in ancient civilizations—Egyptian mathematics (circa 1800 BCE) used unit fractions (1/n), representing all fractions as sums of distinct unit fractions (e.g., 3/4 = 1/2 + 1/4). Babylonians used base-60 fractional notation (still visible in our 60-minute hours and 360-degree circles). Ancient Greeks developed formal fraction theory, distinguishing proper fractions (numerator < denominator) from improper fractions (numerator ≥ denominator). Medieval India and Islamic mathematics refined fraction arithmetic, transmitting these methods to medieval Europe where the modern notation emerged during the Renaissance. The fraction bar evolved from horizontal lines separating numerator and denominator, standardizing by the 16th century. Fraction terminology and components: Numerator: The top number (from Latin 'numerare,' to count), indicating the number of parts selected. In 5/8, the numerator 5 means five parts are being considered. Denominator: The bottom number (from Latin 'denominare,' to name), indicating into how many equal parts the whole is divided. In 5/8, the denominator 8 means the whole is divided into eight equal parts. Fraction bar (vinculum): The horizontal line separating numerator and denominator, representing division. The fraction 5/8 literally means 5 ÷ 8 = 0.625. Types of fractions: Proper fractions: Numerator smaller than denominator (value less than 1). Examples: 1/2, 3/4, 7/10. Represent parts of a whole less than the complete whole. Improper fractions: Numerator greater than or equal to denominator (value ≥ 1). Examples: 5/4, 9/7, 8/8. Represent quantities equal to or exceeding one whole. 5/4 = 1.25, representing one whole plus one-quarter more. Mixed numbers: Combination of whole number and proper fraction. Examples: 1½, 2¾, 3⅓. Express the same values as improper fractions but emphasize the whole number component. 1¾ means 1 + 3/4 = 7/4 as improper fraction. Unit fractions: Fractions with numerator 1. Examples: 1/2, 1/3, 1/10. Represent one part of the whole divided into the denominator's number of parts. Unit fractions form the basis for Egyptian fraction decomposition. Equivalent fractions: Different fractions representing the same value. Examples: 1/2 = 2/4 = 3/6 = 4/8 = 50/100. Created by multiplying or dividing both numerator and denominator by the same non-zero number, which doesn't change the fraction's value (multiplying by n/n = 1). Understanding equivalence enables fraction comparison, addition, and simplification. Fraction as division: Every fraction represents a division operation: a/b = a ÷ b. This interpretation connects fractions to decimals (performing the division gives decimal equivalent: 3/4 = 3 ÷ 4 = 0.75) and connects fraction operations to division properties. Fraction as ratio: Fractions express ratios comparing two quantities. A recipe calling for 2/3 cup sugar to 1 cup flour represents a 2:3 sugar-to-flour ratio (when both measured in thirds of cups). This ratio interpretation connects fractions to proportions and scaling. Fraction as operator: Fractions can act as operators indicating 'take this fraction of.' Finding 3/4 of 20 means multiply: 20 × 3/4 = 60/4 = 15. This operator interpretation explains why multiplying by a proper fraction produces a smaller result (taking a part of the whole), while multiplying by an improper fraction produces a larger result. Visual fraction representations: Area models: Shapes (circles, rectangles, bars) divided into equal regions, with some regions shaded. A rectangle divided into 8 equal parts with 5 shaded represents 5/8. Area models effectively demonstrate equivalent fractions (two shapes with different divisions but same shaded area) and addition (combining shaded regions). Number lines: Marking fractions as points between integers. Dividing the segment from 0 to 1 into n equal parts creates marks at 1/n, 2/n, ..., (n-1)/n, n/n=1. Number lines show fraction ordering, demonstrate improper fractions extending beyond 1, and visualize fraction addition as jumps along the line. Set models: Collections of objects where the fraction indicates the portion selected. In a set of 12 marbles with 4 red, the fraction of red marbles is 4/12 = 1/3. Set models connect fractions to probability and statistics. Fraction operations preview: Addition/Subtraction: Require common denominators (same-sized parts). 1/4 + 1/2 requires converting to common denominator: 1/4 + 2/4 = 3/4. Cannot add fractions with different denominators directly because you're adding different-sized parts. Multiplication: Multiply numerators and multiply denominators. 2/3 × 3/4 = 6/12 = 1/2 (simplified). Geometrically, represents taking a fraction of a fraction (2/3 of 3/4). Division: Multiply by the reciprocal (flip the second fraction). 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2. Answers the question: 'How many 1/4s fit into 1/2?' Simplification: Divide numerator and denominator by their greatest common divisor (GCD). 8/12 = 4/6 = 2/3 (GCD of 8 and 12 is 4; 8÷4=2, 12÷4=3). Simplified fractions provide the most concise representation. Fraction-decimal-percentage relationships: Every fraction converts to a decimal by performing the division: 3/5 = 3 ÷ 5 = 0.6. Decimals convert to percentages by multiplying by 100: 0.6 × 100 = 60%. Therefore: 3/5 = 0.6 = 60%. This three-way equivalence enables flexible problem-solving—use whichever representation suits the context. Some fractions produce terminating decimals (decimal expansion ends): 1/2 = 0.5, 1/4 = 0.25, 3/8 = 0.375. Occur when denominator's only prime factors are 2 and 5 (the factors of 10, our decimal base). Other fractions produce repeating decimals (pattern repeats infinitely): 1/3 = 0.333..., 2/7 = 0.285714285714..., 5/11 = 0.454545.... Occur when denominator has prime factors other than 2 and 5. Practical fraction applications: Cooking and recipes: Measuring ingredients (1½ cups flour, ¾ teaspoon salt), scaling recipes (multiply all ingredients by 3/2 to scale recipe by 50%), converting measurements (1 cup = 16 tablespoons, so ¾ cup = 12 tablespoons). Construction and carpentry: Measurements in inches and fractions (2⅜ inches, 5/16 inch drill bit), cutting materials into fractional portions, calculating board feet (1 board foot = 144 cubic inches = 1 inch × 12 inches × 12 inches or equivalent). Medicine: Dosage calculations based on body weight (child weighing 2/3 of reference weight receives 2/3 of adult dose), dilution ratios for medications, concentration fractions (mg drug per mL solution). Finance: Stock prices (historically traded in fractions: $45⅜ meant $45.375, now decimalized), interest rates as fractions of principal, share ownership fractions in partnerships, portion of income for budgeting (1/3 housing, 1/4 savings). Music: Note duration as fractions of whole notes (half note = 1/2 whole note, quarter note = 1/4, eighth note = 1/8, sixteenth note = 1/16), time signatures (3/4 time = three quarter notes per measure), frequency ratios for musical intervals (octave = 2/1 ratio, perfect fifth = 3/2 ratio). Sports statistics: Batting averages (hits per at-bats: 45 hits in 150 at-bats = 45/150 = 3/10 = 0.300 average), completion percentages in football (18 completions in 25 attempts = 18/25 = 72%), shooting percentages in basketball. Common fraction misconceptions: Larger denominator means larger fraction (FALSE): Students sometimes think 1/8 > 1/4 because 8 > 4. Reality: Larger denominator means smaller pieces; 1/8 is smaller than 1/4. Each eighth is half the size of each quarter. Adding fractions by adding numerators and denominators (WRONG): 1/2 + 1/3 ≠ 2/5. This gives incorrect results because it doesn't account for different-sized pieces. Correct: Find common denominator (6), convert (3/6 + 2/6), add numerators (5/6). Multiplying makes bigger (NOT ALWAYS): While multiplying whole numbers makes bigger, multiplying by proper fractions makes smaller. 8 × 1/2 = 4, smaller than 8. Multiplying by fraction means 'taking a part of,' which reduces the quantity. Dividing makes smaller (NOT ALWAYS): Dividing by proper fractions makes bigger. 8 ÷ 1/2 = 16, larger than 8. Division by fraction asks 'how many of these small parts fit into the whole?'—more small parts fit, so quotient is larger. Thinking fractions and decimals are separate concepts: They're different representations of the same values. 0.5 = 1/2 = 50% are identical values, just expressed differently. Converting between representations is a tool, not magic—simply different notation systems. Understanding fractions deeply—as parts of wholes, division operations, ratios, operators, and points on number lines—builds foundational mathematical literacy essential for algebra, advanced mathematics, science, and quantitative reasoning in everyday life.",
    order: 1
  },
  {
    id: '2',
    question: "How do I add and subtract fractions with different denominators?",
    answer: "Adding and subtracting fractions requires a common denominator—the same-sized pieces—because you cannot directly combine parts of different sizes. The process involves finding a common denominator (usually the least common denominator), converting each fraction to equivalent fractions with this common denominator, then adding or subtracting the numerators while keeping the common denominator. Step-by-step addition/subtraction procedure: Step 1: Find a common denominator. The denominators must match for addition/subtraction. Any common multiple of the original denominators works, but the least common denominator (LCD) produces the simplest calculation. The LCD equals the least common multiple (LCM) of the denominators. Example: Add 1/4 + 1/6. Denominators are 4 and 6. Multiples of 4: 4, 8, 12, 16, 20, 24... Multiples of 6: 6, 12, 18, 24, 30... Least common multiple: 12 (first shared multiple). LCD = 12. Alternative quick method for finding LCM: Factorize denominators into primes: 4 = 2², 6 = 2 × 3. LCM = product of highest powers of all prime factors = 2² × 3 = 4 × 3 = 12. For small numbers or if no LCM is obvious, multiplying the denominators together always gives a common denominator (not necessarily the least): 4 × 6 = 24 works as common denominator, though 12 is smaller. Step 2: Convert each fraction to equivalent fraction with common denominator. Multiply numerator and denominator by the factor needed to reach the LCD. For 1/4 with LCD 12: What multiplies 4 to get 12? 12 ÷ 4 = 3. Multiply both numerator and denominator by 3: 1/4 = (1×3)/(4×3) = 3/12. For 1/6 with LCD 12: What multiplies 6 to get 12? 12 ÷ 6 = 2. Multiply both numerator and denominator by 2: 1/6 = (1×2)/(6×2) = 2/12. Both fractions now have denominator 12: 3/12 and 2/12. Step 3: Add or subtract the numerators; keep the common denominator. Addition: 3/12 + 2/12 = (3+2)/12 = 5/12. Subtraction: 3/12 - 2/12 = (3-2)/12 = 1/12. The denominator stays 12 because we're combining pieces of the same size (twelfths). Step 4: Simplify the result if possible. Check if numerator and denominator share common factors. Find GCD (greatest common divisor), divide both by GCD. Example result 5/12: GCD(5,12) = 1 (5 and 12 share no common factors; 5 is prime, 12 = 2²×3). Already simplified. Example requiring simplification: 6/12 = (6÷6)/(12÷6) = 1/2 (GCD(6,12) = 6). Why common denominators are necessary—conceptual understanding: Fractions represent parts of specific sizes. 1/4 is a quarter-sized piece; 1/6 is a sixth-sized piece. These are different-sized pieces—you cannot simply add 1 quarter + 1 sixth and get '2 something' without first making the pieces the same size. Analogy: Adding 1 dollar + 1 euro doesn't equal 2 of anything until you convert to common currency. Similarly, adding fractions with different denominators requires conversion to common 'fraction currency' (common denomination). Visual demonstration: Draw two rectangles of equal size. Divide first rectangle into 4 equal parts, shade 1 part (1/4). Divide second rectangle into 6 equal parts, shade 1 part (1/6). To combine, redivide both rectangles into same-sized parts. First rectangle with 4 parts: divide each quarter into 3 sub-parts = 12 total parts, 3 shaded (3/12). Second rectangle with 6 parts: divide each sixth into 2 sub-parts = 12 total parts, 2 shaded (2/12). Now both rectangles divided into twelfths; combining gives 5 shaded parts out of 12 total parts = 5/12. Complex examples: Example 1: Mixed addition 2/3 + 3/4 + 1/6. Find LCD of 3, 4, 6: Multiples of 3: 3, 6, 9, 12, 15, 18... Multiples of 4: 4, 8, 12, 16... Multiples of 6: 6, 12, 18... LCM = 12. Convert each fraction: 2/3 = 8/12 (multiply by 4/4), 3/4 = 9/12 (multiply by 3/3), 1/6 = 2/12 (multiply by 2/2). Add: 8/12 + 9/12 + 2/12 = 19/12. Simplify: 19 and 12 share no common factors (19 is prime). Result is improper fraction; convert to mixed number: 19/12 = 1 7/12 (1 whole and 7 twelfths). Example 2: Subtraction with larger numbers 7/10 - 3/15. Find LCD of 10, 15: Prime factorization: 10 = 2 × 5, 15 = 3 × 5. LCM = 2 × 3 × 5 = 30. Convert: 7/10 = 21/30 (multiply by 3/3), 3/15 = 6/30 (multiply by 2/2). Subtract: 21/30 - 6/30 = 15/30. Simplify: GCD(15, 30) = 15. 15/30 = (15÷15)/(30÷15) = 1/2. Example 3: Subtraction requiring borrowing (mixed numbers) 3 1/4 - 1 3/4. Convert to improper fractions: 3 1/4 = 13/4 (3×4+1=13), 1 3/4 = 7/4. Denominators already common (both fourths). Subtract: 13/4 - 7/4 = 6/4. Simplify: 6/4 = 3/2 = 1 1/2. Alternative: Keep as mixed numbers, but 'borrow' from whole number: 3 1/4 = 2 + 1 + 1/4 = 2 + 4/4 + 1/4 = 2 5/4. Now subtract: 2 5/4 - 1 3/4 = (2-1) + (5/4 - 3/4) = 1 + 2/4 = 1 + 1/2 = 1 1/2. Special cases and shortcuts: Adding/subtracting fractions with same denominator: Skip to Step 3. Example: 5/8 + 3/8 = 8/8 = 1. No conversion needed; denominators already match. One denominator is multiple of the other: Use larger denominator as LCD. Example: 1/3 + 1/6. Since 6 is multiple of 3 (6 = 3×2), LCD = 6. Convert 1/3 = 2/6. Add: 2/6 + 1/6 = 3/6 = 1/2. Adding/subtracting with denominators that are coprime (share no common factors except 1): LCD equals product of denominators. Example: 1/5 + 1/7. Since GCD(5,7) = 1 (both prime), LCD = 5×7 = 35. Convert: 1/5 = 7/35, 1/7 = 5/35. Add: 7/35 + 5/35 = 12/35. Common errors and how to avoid them: Adding numerators AND denominators (WRONG): 1/4 + 1/6 ≠ 2/10. This violates the principle that parts must be same size to add. Always find common denominator first. Using different denominators for the converted fractions: Each fraction must be converted to the SAME common denominator, not different denominators. Both must become twelfths (or whatever LCD you chose). Forgetting to multiply BOTH numerator and denominator: To create equivalent fraction, must multiply both parts by same number. 1/4 ≠ 1/12 (only denominator changed). Must do 1×3 and 4×3 to get 3/12. Not simplifying final answer: While mathematically correct, unsimplified fractions (6/12 instead of 1/2) are harder to interpret and don't follow mathematical convention of reducing to simplest form. Always simplify. Real-world applications: Recipe scaling: Recipe calls for 2/3 cup flour plus 1/4 cup flour (different stages). Total flour: 2/3 + 1/4. LCD = 12. 2/3 = 8/12, 1/4 = 3/12. Total: 11/12 cup. Construction measurements: Cutting board 3 5/8 inches wide. Remove 1 1/4 inches. Remaining width: 3 5/8 - 1 1/4 = 3 5/8 - 1 2/8 = 2 3/8 inches (after borrowing if needed, or converting to improper fractions). Time calculations: Task A takes 1/2 hour, task B takes 1/3 hour. Total time: 1/2 + 1/3 = 3/6 + 2/6 = 5/6 hour = 50 minutes. Probability: Drawing red card (1/2) or face card (3/13) from deck. If mutually exclusive events: P(red or face) requires finding cards that are red OR face, accounting for overlap. If adding probabilities (for mutually exclusive), need common denominator. Budget allocation: Allocate 1/4 income to housing, 1/6 to transportation. Total allocated: 1/4 + 1/6 = 3/12 + 2/12 = 5/12 of income. Remaining for other expenses: 1 - 5/12 = 12/12 - 5/12 = 7/12. Fraction addition/subtraction in context of rational number properties: Fractions form the rational numbers (ℚ), which are closed under addition and subtraction: sum or difference of any two rational numbers is rational. Commutative property: a/b + c/d = c/d + a/b (order doesn't matter for addition). Associative property: (a/b + c/d) + e/f = a/b + (c/d + e/f) (grouping doesn't matter). Additive identity: a/b + 0 = a/b (zero is additive identity). Additive inverse: Every fraction a/b has additive inverse -a/b such that a/b + (-a/b) = 0. Practice strategy: Start with same denominators to master numerator addition. Progress to denominators where one is multiple of the other (e.g., halves and fourths). Advance to coprime denominators requiring finding LCM. Master mixed number addition/subtraction through practice converting to improper fractions or borrowing technique. Verify answers by converting to decimals: 1/4 + 1/6 = 5/12 = 0.4167. Check: 0.25 + 0.1667 ≈ 0.4167 ✓.",
    order: 2
  },
  {
    id: '3',
    question: "How do I multiply and divide fractions?",
    answer: "Multiplying and dividing fractions follows simpler procedures than addition/subtraction because these operations don't require common denominators. Multiplication multiplies numerators together and denominators together, while division multiplies by the reciprocal of the divisor. Understanding the conceptual meaning behind these procedures deepens comprehension and prevents mechanical errors. Fraction Multiplication—Procedure and Understanding: Basic multiplication rule: To multiply fractions, multiply the numerators to get the new numerator, and multiply the denominators to get the new denominator. Formula: a/b × c/d = (a × c)/(b × d). Example: 2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2 (simplified). Step-by-step process: Step 1: Multiply numerators: 2 × 3 = 6. Step 2: Multiply denominators: 3 × 4 = 12. Step 3: Write result as fraction: 6/12. Step 4: Simplify by dividing both numerator and denominator by their GCD. GCD(6,12) = 6. Result: 6/12 = 1/2. Simplification before multiplication (canceling): Often easier to simplify before multiplying by canceling common factors between any numerator and any denominator. Example: 2/3 × 3/4. Notice 3 appears in numerator of second fraction and denominator of first fraction. Cancel the 3s: 2/3 × 3/4 = 2/1 × 1/4 = 2/4 = 1/2 (then simplify). Or more systematically: 2/3 × 3/4 = (2×3)/(3×4) = (2/2) × (3/3) × (1/2) = 1 × 1 × 1/2 = 1/2. Early cancellation prevents working with large numbers. Example benefiting from cancellation: 15/28 × 14/45. Before multiplying: Notice 15 and 45 share factor 15: 15/45 = 1/3 (after dividing by 15). Notice 14 and 28 share factor 14: 14/28 = 1/2 (after dividing by 14). Simplified multiplication: 1/2 × 1/3 = 1/6. Without cancellation: (15×14)/(28×45) = 210/1260, requiring finding GCD(210, 1260) = 210, then simplifying 210/1260 = 1/6. Much harder! Multiplying mixed numbers: Convert mixed numbers to improper fractions first, then multiply. Example: 2 1/2 × 1 3/4. Convert: 2 1/2 = 5/2 (2×2+1 = 5), 1 3/4 = 7/4 (1×4+3 = 7). Multiply: 5/2 × 7/4 = 35/8. Convert back to mixed: 35/8 = 4 3/8 (35 ÷ 8 = 4 remainder 3). Multiplying whole numbers and fractions: Treat whole number as fraction with denominator 1. Example: 5 × 2/3 = 5/1 × 2/3 = 10/3 = 3 1/3. Conceptual understanding of multiplication: 'Of' means multiply: 'Find 2/3 of 12' means 2/3 × 12 = 8. Taking a fraction of a quantity. Multiplication as scaling: Multiplying by fraction less than 1 (proper fraction) makes result smaller. Example: 8 × 1/2 = 4. Taking half of 8 gives 4, smaller than original. Multiplying by fraction greater than 1 (improper fraction) makes result larger. Example: 8 × 3/2 = 12. Taking one-and-a-half times 8 gives 12, larger than original. Multiplying by 1 (any form: 2/2, 5/5, etc.) leaves value unchanged—this is how we create equivalent fractions. Area interpretation: Fraction multiplication finds area of rectangle with fractional dimensions. Rectangle with width 2/3 and length 3/4 has area (2/3) × (3/4) = 6/12 = 1/2 square units. Visual: Divide unit square into 3 columns (each 1/3 wide) and 4 rows (each 1/4 tall), creating 12 small rectangles. Shading 2 columns and 3 rows overlaps in 6 small rectangles, which is 6/12 = 1/2 of the unit square. Fraction Division—Procedure and Understanding: Basic division rule: To divide by a fraction, multiply by its reciprocal (flip the second fraction). Formula: a/b ÷ c/d = a/b × d/c = (a × d)/(b × c). Example: 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2. Step-by-step process: Step 1: Keep the first fraction as is: 1/2. Step 2: Change division to multiplication: ÷ becomes ×. Step 3: Flip the second fraction (find reciprocal): 1/4 becomes 4/1. Step 4: Multiply: 1/2 × 4/1 = 4/2 = 2. The reciprocal: The reciprocal of fraction a/b is b/a (flip numerator and denominator). Examples: Reciprocal of 3/4 is 4/3. Reciprocal of 5 (which is 5/1) is 1/5. Reciprocal of 1/8 is 8/1 = 8. Key property: A number multiplied by its reciprocal equals 1. Example: 3/4 × 4/3 = 12/12 = 1. This property explains why division works by multiplying by reciprocal: a/b ÷ c/d equals 'How many (c/d)s fit into (a/b)?' Multiplying by reciprocal (d/c) answers this question. Dividing mixed numbers: Convert mixed numbers to improper fractions, then divide. Example: 2 1/2 ÷ 1 1/4. Convert: 2 1/2 = 5/2, 1 1/4 = 5/4. Divide: 5/2 ÷ 5/4 = 5/2 × 4/5 = 20/10 = 2. Dividing fractions by whole numbers: Treat whole number as fraction over 1, then apply division rule. Example: 3/4 ÷ 2 = 3/4 ÷ 2/1 = 3/4 × 1/2 = 3/8. Alternative: Dividing by whole number n is same as multiplying by 1/n. 3/4 ÷ 2 = 3/4 × 1/2 = 3/8. Dividing whole numbers by fractions: Example: 6 ÷ 1/2 = 6/1 × 2/1 = 12. Interpretation: 'How many halves in 6 wholes?' Answer: 12 halves (each whole contains 2 halves; 6 wholes contain 6×2 = 12 halves). Conceptual understanding of division: Division answers 'How many?' question: a/b ÷ c/d asks 'How many (c/d)-sized pieces fit into (a/b)?' Example: 1/2 ÷ 1/4 = 2 asks 'How many quarters fit into one half?' Answer: 2 quarters make one half. Division is inverse of multiplication: If a/b × c/d = e/f, then e/f ÷ c/d = a/b. Example: Since 2/3 × 3/4 = 1/2, we know 1/2 ÷ 3/4 = 2/3. This inverse relationship connects multiplication and division. Why flip and multiply works (mathematical justification): Division by a number is equivalent to multiplication by its multiplicative inverse (reciprocal). a/b ÷ c/d = a/b × (1 ÷ c/d) = a/b × d/c. Algebraic proof: (a/b) ÷ (c/d) = (a/b) / (c/d) = (a/b) × (1/(c/d)) = (a/b) × (d/c) = (ad)/(bc). Complex fraction interpretation: a/b divided by c/d creates a complex fraction: (a/b)/(c/d). To simplify complex fractions, multiply numerator and denominator by LCD of all fractions involved. LCD of b and d is bd. Multiply numerator and denominator by bd: [(a/b) × bd] / [(c/d) × bd] = ad / bc. This equals a/b × d/c, confirming the flip-and-multiply rule. Real-world applications of multiplication: Recipe scaling: Recipe for 4 servings requires 2/3 cup sugar. For 6 servings (1.5 times recipe): 2/3 × 3/2 = 6/6 = 1 cup sugar. Fractional scaling: Cook 1/2 of recipe: multiply all ingredients by 1/2. Percentage calculations: Find 3/4 of 80. 80 × 3/4 = 60. Finding fractional part of quantity. Area and volume: Rectangle 2 1/2 feet by 1 3/4 feet. Area = 5/2 × 7/4 = 35/8 = 4 3/8 square feet. Probability: Independent events multiply. Probability of flipping heads (1/2) AND rolling 6 on die (1/6): 1/2 × 1/6 = 1/12. Real-world applications of division: Sharing/partitioning: Divide 3/4 of pizza among 3 people. Each person gets (3/4) ÷ 3 = 3/4 × 1/3 = 1/4 of the whole pizza. Rate problems: Travel 1/2 mile in 1/4 hour. Speed = distance ÷ time = (1/2) ÷ (1/4) = 2 miles per hour. Unit conversions: Convert 3/4 yard to inches. 1 yard = 36 inches, so 3/4 yard = (3/4) × 36 = 27 inches. Or: (3/4 yard) × (36 inches / 1 yard) = 27 inches (dimensional analysis using fraction multiplication). How many portions: 6 cups soup, serving size 3/4 cup. Number of servings = 6 ÷ 3/4 = 6 × 4/3 = 24/3 = 8 servings. Common errors: Flipping the wrong fraction: When dividing a/b ÷ c/d, flip the second fraction (the divisor c/d), not the first (the dividend a/b). Wrong: 1/2 ÷ 1/4 = 2/1 × 1/4 = 1/2. Correct: 1/2 ÷ 1/4 = 1/2 × 4/1 = 2. Adding instead of multiplying denominators: a/b × c/d ≠ (a×c)/(b+d). Must multiply denominators: (a×c)/(b×d). Not simplifying: 6/12 is correct but should simplify to 1/2 for clearest representation. Confusion about when to find common denominators: Multiplication and division do NOT require common denominators (only addition/subtraction do). Don't waste time finding LCD for multiplication/division. Forgetting to convert mixed numbers: Must convert mixed numbers to improper fractions before multiplying/dividing. Can't multiply or divide mixed numbers directly in their mixed form. Combined operations with order of operations: When expression has multiple operations, follow PEMDAS/BODMAS (order of operations): Example: 1/2 + 1/3 × 1/4. Multiply first: 1/3 × 1/4 = 1/12. Then add: 1/2 + 1/12 = 6/12 + 1/12 = 7/12. Example: (1/2 + 1/3) × 1/4. Parentheses first: 1/2 + 1/3 = 5/6. Then multiply: 5/6 × 1/4 = 5/24. Parentheses change the order and result. Practice strategy: Master basic multiplication (proper fractions). Learn cancellation technique to simplify before multiplying. Practice multiplying mixed numbers. Master reciprocal concept and division by flipping. Practice division with mixed numbers and whole numbers. Combine operations following order of operations. Verify by converting to decimals: 1/2 ÷ 1/4 = 2. Check: 0.5 ÷ 0.25 = 2 ✓.",
    order: 3
  },
  {
    id: '4',
    question: "How do I simplify fractions to their lowest terms?",
    answer: "Simplifying (or reducing) a fraction means finding an equivalent fraction with the smallest possible numerator and denominator by dividing both by their greatest common divisor (GCD). A simplified fraction is in lowest terms when the numerator and denominator share no common factors except 1 (are coprime). Simplification doesn't change the fraction's value—only its representation—making fractions easier to understand, compare, and use in further calculations. The Simplification Procedure: Basic rule: Divide both numerator and denominator by their greatest common divisor (GCD), also called greatest common factor (GCF) or highest common factor (HCF). Formula: a/b in simplest form = (a ÷ GCD(a,b)) / (b ÷ GCD(a,b)). Example: Simplify 12/18. Find GCD(12, 18) = 6. Divide both by 6: 12÷6 = 2, 18÷6 = 3. Simplified: 2/3. Step-by-step process: Step 1: Find the GCD of the numerator and denominator. Methods for finding GCD (described below): listing factors, prime factorization, or Euclidean algorithm. Step 2: Divide both numerator and denominator by the GCD. The GCD is the largest number that divides both evenly. Step 3: Verify the result is in lowest terms. Numerator and denominator should share no common factors except 1. If they still share factors, you didn't find the true GCD; repeat. Methods for Finding GCD: Method 1—Listing factors: List all factors of each number, find the largest factor appearing in both lists. Example: Simplify 24/36. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. Common factors: 1, 2, 3, 4, 6, 12. Greatest common factor: 12. Simplify: 24÷12 = 2, 36÷12 = 3. Result: 2/3. Advantage: Straightforward, works for small numbers. Disadvantage: Tedious for large numbers with many factors. Method 2—Prime factorization: Express each number as product of prime factors, identify shared primes, multiply shared primes to get GCD. Example: Simplify 48/72. Prime factorization of 48: 48 = 2 × 24 = 2 × 2 × 12 = 2 × 2 × 2 × 6 = 2 × 2 × 2 × 2 × 3 = 2⁴ × 3. Prime factorization of 72: 72 = 2 × 36 = 2 × 2 × 18 = 2 × 2 × 2 × 9 = 2 × 2 × 2 × 3 × 3 = 2³ × 3². Shared prime factors: 2³ (both have at least three 2s; 48 has four 2s, 72 has three 2s, take minimum: 3). 3¹ (both have at least one 3; 48 has one 3, 72 has two 3s, take minimum: 1). GCD = 2³ × 3 = 8 × 3 = 24. Simplify: 48÷24 = 2, 72÷24 = 3. Result: 2/3. Advantage: Systematic, works for any size numbers, reveals mathematical structure. Disadvantage: Requires knowing how to factor numbers into primes. Method 3—Euclidean algorithm (most efficient for large numbers): Repeatedly divide, using remainder as new divisor, until remainder is 0. The last non-zero remainder is the GCD. Example: Find GCD(48, 72) using Euclidean algorithm. Divide 72 by 48: 72 = 1 × 48 + 24 (quotient 1, remainder 24). Divide 48 by 24: 48 = 2 × 24 + 0 (quotient 2, remainder 0). When remainder is 0, the previous divisor (24) is the GCD. GCD(48, 72) = 24. Advantage: Very efficient even for large numbers; doesn't require factoring. Disadvantage: Less intuitive initially; requires understanding division with remainders. Method 4—Successive division by small primes (practical compromise): Divide both numbers by obvious small common factors (2, 3, 5, etc.) until no more common factors. Multiply all factors used to get GCD. Example: Simplify 24/36. Both even; divide by 2: 24÷2 = 12, 36÷2 = 18. Result so far: 12/18. Both even again; divide by 2: 12÷2 = 6, 18÷2 = 9. Result so far: 6/9. Both divisible by 3: 6÷3 = 2, 9÷3 = 3. Result: 2/3. No more common factors (2 and 3 are coprime). GCD = 2 × 2 × 3 = 12 (product of all factors used). Advantage: Intuitive, progressive simplification, catches errors early. Disadvantage: May miss larger common factors if you don't test them, resulting in multiple steps. Special Cases and Shortcuts: Numerator and denominator differ by 1: Numbers differing by 1 are always coprime (share no factors except 1). Example: 7/8, 15/16, 23/24 are already in simplest form. GCD of consecutive integers is always 1. Numerator divides denominator or vice versa: Example: 4/12. Numerator 4 divides denominator 12 (12 ÷ 4 = 3). Simplify: 4/12 = 1/3 (divide both by 4). One number is prime: If numerator or denominator is prime, check if the prime divides the other number. If not, fraction is already simplified. Example: 7/15. 7 is prime. Does 7 divide 15? No (15 = 3 × 5). GCD(7, 15) = 1. Already simplified. Example: 6/13. 13 is prime. Does 13 divide 6? No. Already simplified. But 9/3: 3 is prime and divides 9. Simplify: 9/3 = 3. Both numbers even: Immediately divide both by 2 as first step, then repeat if still both even. Example: 18/24. Both even: 18÷2 = 9, 24÷2 = 12. Result: 9/12. Both divisible by 3: 9÷3 = 3, 12÷3 = 4. Result: 3/4 (final). Both numbers end in 0 or 5: Both divisible by 5. Divide by 5. Example: 15/45. Both divisible by 5: 15÷5 = 3, 45÷5 = 9. Result: 3/9. Both divisible by 3: 3÷3 = 1, 9÷3 = 3. Result: 1/3 (final). Or directly find GCD(15, 45) = 15. 15/45 = 1/3. Why Simplification Matters: Clarity and communication: 1/2 is clearer and more recognizable than 50/100 or 17/34, even though these are equivalent. Simplified fractions communicate the same value more concisely. Easier calculations: Working with smaller numbers in subsequent operations is simpler and less error-prone. Adding 1/2 + 1/3 is easier than adding 50/100 + 33/100 (though both give 5/6 or 83/100 when simplified). Comparison: Comparing simplified fractions is easier. Is 4/6 larger or smaller than 6/9? Simplify both to 2/3—they're equal! Standard form: Mathematics convention presents final answers in simplified form unless otherwise specified. Tests and homework expect simplified fractions. Pattern recognition: Simplified fractions reveal patterns. 2/4, 3/6, 4/8 all simplify to 1/2, showing they're equivalent. Fraction equivalence: Simplification is the inverse process of creating equivalent fractions. Creating equivalent: 1/2 = 2/4 = 3/6 = 4/8 (multiply both numerator and denominator by same number). Simplifying: 4/8 = 2/4 = 1/2 (divide both numerator and denominator by same number). Both use the fundamental property: multiplying or dividing both parts by the same non-zero number doesn't change the fraction's value (multiplying by n/n = 1 or dividing by n/n = 1). Improper fractions and mixed numbers: Simplify improper fractions before or after converting to mixed numbers. Example: 24/18 (improper fraction). Simplify: GCD(24, 18) = 6. 24÷6 = 4, 18÷6 = 3. Result: 4/3 (simplified improper fraction). Convert to mixed: 4/3 = 1 1/3. Or convert first: 24/18 = 1 6/18, then simplify fractional part: 6/18 = 1/3, giving 1 1/3. Both paths reach same answer. Mixed number simplification: If mixed number has unsimplified fraction part, simplify that part. Example: 3 4/6 simplifies to 3 2/3 (simplify 4/6 to 2/3). Negative fractions: Simplify absolute values, retain negative sign. Convention: Place negative sign in numerator or in front of fraction, not in denominator. Example: Simplify -12/18 or 12/-18. GCD(12, 18) = 6. Simplify: -12/18 = -2/3 or 12/-18 = -2/3. Standard form: -2/3 (not 2/-3). Common errors: Dividing only numerator OR only denominator: Must divide both to maintain equivalence. 12/18 ≠ 6/18 (only numerator divided). 12/18 ≠ 12/9 (only denominator divided). Correct: 12/18 = 6/9 = 2/3 (divide both). Subtracting instead of dividing: Simplification uses division, not subtraction. 12/18 ≠ (12-6)/(18-6) = 6/12. (That's not simplification; that's a different, meaningless operation.) Stopping before fully simplified: 24/36 = 12/18 (divided by 2). Stop here? No! 12/18 = 6/9 (divide by 2 again). Still not done! 6/9 = 2/3 (divide by 3). Now fully simplified. Always find the GCD to ensure one-step simplification, or check final result shares no common factors. Changing the fraction's value: Simplification must not change value. Verify by converting to decimal: 12/18 = 0.6667. 2/3 = 0.6667 ✓. Simplification preserved value. Practical applications: Measurement precision: Ruler marked in 16ths. Measure 12/16 inches. Simplify: 12/16 = 3/4 inches (clearer, easier to communicate). Recipe fractions: Recipe requires 6/8 cup milk. Simplify: 6/8 = 3/4 cup (standard measuring cups have 3/4 cup markings, not 6/8). Probability: 12 favorable outcomes out of 36 total. Probability = 12/36 = 1/3 (simplified form clearer). Aspect ratios: Screen resolution 1920 × 1080 pixels. Aspect ratio 1920/1080 = 16/9 (simplified by dividing by GCD 120). Test scores: 36 correct out of 48 total. Score = 36/48 = 3/4 = 75% (simplified fraction easier to convert to percentage). Irreducible (fully simplified) fractions: A fraction in lowest terms is irreducible—cannot be reduced further because numerator and denominator are coprime (GCD = 1). Example: 5/7 is irreducible. GCD(5, 7) = 1 (both prime, not the same prime). Fractions where numerator and denominator share no common factors except 1 are already fully simplified.",
    order: 4
  },
  {
    id: '5',
    question: "How do I convert between improper fractions, mixed numbers, and decimals?",
    answer: "Fractions appear in three primary forms—improper fractions (numerator ≥ denominator), mixed numbers (whole number plus proper fraction), and decimals—each suited to different contexts. Converting between these representations enables flexible problem-solving and clearer communication depending on the application. Understanding the conversion procedures and when to use each form enhances mathematical fluency. Improper Fractions vs. Mixed Numbers: Definitions: Improper fraction: Numerator greater than or equal to denominator. Value ≥ 1. Examples: 7/4, 13/5, 9/9, 22/7. Represents quantity equal to or exceeding one whole. Mixed number: Whole number combined with proper fraction. Examples: 1¾, 2⅗, 1, 3 1/7 (note: 9/9 = 1 is whole number, no fractional part). Represents same quantities as improper fractions but separates whole and fractional parts. Converting Improper Fraction to Mixed Number: Procedure: Divide numerator by denominator. Quotient becomes whole number part. Remainder becomes numerator of fractional part. Original denominator remains denominator of fractional part. Example: Convert 17/5 to mixed number. Divide: 17 ÷ 5 = 3 remainder 2 (or 3.4, but we want remainder). Quotient: 3 (whole number part). Remainder: 2 (numerator of fractional part). Denominator: 5 (unchanged). Mixed number: 3 2/5. Verification: 3 2/5 = 3 + 2/5 = 15/5 + 2/5 = 17/5 ✓. Visual interpretation: 17/5 means 17 fifths. How many complete groups of 5 fifths (one whole) fit into 17 fifths? 3 complete wholes (3 × 5 = 15 fifths used), with 2 fifths remaining. Result: 3 wholes and 2 fifths = 3 2/5. Alternative mental method: Subtract denominator from numerator repeatedly until remainder < denominator; count subtractions. 17/5: 17 - 5 = 12 (1 whole), 12 - 5 = 7 (2 wholes), 7 - 5 = 2 (3 wholes, remainder 2). Result: 3 2/5. Special cases: If remainder is 0, result is whole number with no fractional part. Example: 15/5 = 3 (exactly). If numerator = denominator, result is 1. Example: 8/8 = 1. If numerator < denominator (proper fraction), already in simplest form; no whole number part. Converting Mixed Number to Improper Fraction: Procedure: Multiply whole number by denominator. Add the numerator to this product. Result becomes numerator of improper fraction. Denominator remains the same. Formula: a b/c = (a × c + b) / c. Example: Convert 4 3/8 to improper fraction. Whole number: 4. Fraction: 3/8. Multiply: 4 × 8 = 32. Add numerator: 32 + 3 = 35. Improper fraction: 35/8. Verification: 35/8 ÷ 8 = 4 remainder 3, giving 4 3/8 ✓. Visual interpretation: 4 3/8 means 4 complete wholes plus 3 eighths. Each whole contains 8 eighths. 4 wholes = 4 × 8 = 32 eighths. Add remaining 3 eighths: 32 + 3 = 35 eighths total. Result: 35/8. Mnemonic: 'Multiply, add, denominator stays.' Multiply whole by denominator, add numerator, put over same denominator. Converting Fractions to Decimals: Procedure: Divide numerator by denominator. The quotient is the decimal equivalent. Method: Perform long division or use calculator. Example: Convert 3/4 to decimal. Divide: 3 ÷ 4 = 0.75. Result: 0.75. Long division: 4 doesn't go into 3, so 0. Add decimal point and zero: 3.0 ÷ 4. 4 goes into 30 seven times (7 × 4 = 28, remainder 2). Result so far: 0.7. Bring down another 0: 20 ÷ 4 = 5 exactly. Final: 0.75. Mixed numbers to decimals: Convert whole number part, add decimal part. Example: Convert 2 3/4 to decimal. Whole: 2. Fraction: 3/4 = 0.75. Total: 2 + 0.75 = 2.75. Or convert to improper first: 2 3/4 = 11/4 = 11 ÷ 4 = 2.75. Terminating vs. repeating decimals: Terminating decimals: Division results in finite decimal that ends. Example: 1/2 = 0.5, 3/8 = 0.375, 7/16 = 0.4375. Occur when denominator (in simplest form) has only prime factors 2 and/or 5 (factors of 10, our base). Examples: 1/2 (denominator 2), 3/5 (denominator 5), 7/40 (denominator 40 = 2³ × 5). Repeating (recurring) decimals: Division results in infinite decimal with repeating pattern. Example: 1/3 = 0.333..., 2/7 = 0.285714285714..., 5/11 = 0.454545.... Occur when denominator (in simplest form) has prime factors other than 2 and 5. Examples: 1/3 (denominator 3), 5/6 (denominator 6 = 2 × 3, has factor 3), 4/15 (denominator 15 = 3 × 5, has factor 3). Notation: Repeating portion marked with bar: 1/3 = 0.3̄ (bar over 3), 5/11 = 0.4̄5̄ (bar over 45), 2/7 = 0.2̄8̄5̄7̄1̄4̄ (bar over entire repeating block 285714). Converting Decimals to Fractions: Terminating decimals to fractions: Count decimal places; use as power of 10 for denominator. Place digits after decimal as numerator. Simplify. Example: Convert 0.75 to fraction. Two decimal places: denominator = 10² = 100. Digits after decimal: 75. Fraction: 75/100. Simplify: GCD(75, 100) = 25. 75÷25 = 3, 100÷25 = 4. Result: 3/4. Example: Convert 0.125 to fraction. Three decimal places: denominator = 10³ = 1000. Numerator: 125. Fraction: 125/1000. Simplify: GCD(125, 1000) = 125. 125÷125 = 1, 1000÷125 = 8. Result: 1/8. Decimals greater than 1: Separate whole number and decimal part. Example: Convert 2.6 to fraction. Whole: 2. Decimal: 0.6 = 6/10 = 3/5. Mixed number: 2 3/5. Improper fraction: 13/5. Repeating decimals to fractions (more complex): Use algebraic method. Example: Convert 0.333... (0.3̄) to fraction. Let x = 0.333.... Multiply by 10: 10x = 3.333.... Subtract original: 10x - x = 3.333... - 0.333.... Simplify: 9x = 3. Solve: x = 3/9 = 1/3. Example: Convert 0.454545... (0.4̄5̄) to fraction. Let x = 0.454545.... Repeating block has 2 digits; multiply by 10² = 100: 100x = 45.454545.... Subtract: 100x - x = 45.454545... - 0.454545.... Simplify: 99x = 45. Solve: x = 45/99 = 5/11 (simplified). General rule: If n digits repeat, multiply by 10ⁿ, subtract, solve for x. When to Use Each Form: Improper fractions: Best for calculations: Multiplying, dividing, adding, subtracting fractions is easier with improper fractions than mixed numbers. Algebraic expressions: Improper fractions integrate seamlessly into equations and formulas. Precision: No ambiguity; single fraction representation. Mixed numbers: Real-world measurements: '2 and a half hours' (2½) is clearer than '5/2 hours.' Quantities exceeding one: Easier to visualize and communicate. '3¾ cups flour' clearer than '15/4 cups.' Reading and speaking: More natural to say 'three and three-quarters' than 'fifteen-fourths.' Decimals: Scientific calculations: Calculators and computers use decimals. Money: $2.75 clearer than 2¾ dollars or 11/4 dollars. Precision and measurement: 3.14159... for π, 2.54 cm per inch. Percentages: 0.75 = 75% (direct relationship). Comparison: 0.625 vs. 0.75 is easier to compare at a glance than 5/8 vs. 3/4 for many people. Conversion Examples Across All Three Forms: Example 1: 7/4 (improper) ↔ 1¾ (mixed) ↔ 1.75 (decimal). Improper to mixed: 7 ÷ 4 = 1 R3, so 1 3/4. Mixed to decimal: 1 + 3/4 = 1 + 0.75 = 1.75. Decimal to fraction: 1.75 = 1 75/100 = 1 3/4 = 7/4. Example 2: 3 2/5 (mixed) ↔ 17/5 (improper) ↔ 3.4 (decimal). Mixed to improper: 3×5+2 = 17, so 17/5. Improper to decimal: 17 ÷ 5 = 3.4. Decimal to fraction: 3.4 = 3 4/10 = 3 2/5 = 17/5. Example 3: 0.625 (decimal) ↔ 5/8 (improper/proper) ↔ (no mixed needed, <1). Decimal to fraction: 0.625 = 625/1000 = 5/8 (simplified). Fraction to decimal: 5 ÷ 8 = 0.625. (No mixed number because value < 1.) Applications: Recipe scaling: Recipe calls for 1¾ cups milk (mixed number). To triple recipe: Convert to improper: 1¾ = 7/4. Multiply: 7/4 × 3 = 21/4. Convert back: 21/4 = 5¼ cups (mixed number clearer for measuring). Or use decimals: 1.75 × 3 = 5.25 cups (but ¼ cup is standard measure, so mixed form better here). Time calculations: Work 2.5 hours (decimal). Convert to mixed: 2.5 = 2½ hours = 2 hours 30 minutes. Construction measurements: Board 3 5/8 inches wide (mixed). For calculations, convert: 3 5/8 = 29/8 = 3.625 inches (decimal useful for precision tools). Financial calculations: Interest rate 0.05 (decimal) = 5/100 (fraction) = 5% (percentage) = 1/20 (simplified fraction). Different forms suit different contexts. Common pitfalls: Forgetting to add when converting mixed to improper: 4 3/8 ≠ 12/8 (forgot to add the 3). Correct: (4×8+3)/8 = 35/8. Improper decimal to fraction conversion: 2.5 ≠ 2/5 (treating 5 as single digit after decimal, ignoring position). Correct: 2.5 = 2 5/10 = 2½ or 5/2. Mixing representations in calculations: Can't add 1/2 + 0.5 + 1¼ directly. Convert all to same form first. Improper fraction confusion: Some students think 7/4 > 7 because 'fractions are small.' Reality: 7/4 = 1.75, less than 7 but greater than 1. Improper fraction is between its numerator (7) and numerator÷denominator (1.75).",
    order: 5
  },
  {
    id: '6',
    question: "What are the most common mistakes with fractions and how do I avoid them?",
    answer: "Fraction operations present numerous pitfalls that lead to systematic errors. Recognizing these common mistakes and implementing verification strategies dramatically improves fraction calculation accuracy and conceptual understanding. Most students struggle with the same errors—mastering these trouble spots transforms fraction proficiency. Critical Fraction Errors and Prevention Strategies: 1. Adding fractions by adding both numerators AND denominators (MOST COMMON ERROR): Wrong: 1/3 + 1/4 = 2/7 (adding numerators: 1+1=2, denominators: 3+4=7). Correct: 1/3 + 1/4 = 4/12 + 3/12 = 7/12 (finding common denominator 12, converting, adding numerators). Why wrong: Fractions represent different-sized pieces (thirds vs. fourths). Cannot combine different-sized pieces by counting them together. Would be like adding 1 dollar + 1 euro = 2 'something'—meaningless without conversion. Prevention: ALWAYS find common denominator for addition/subtraction. Ask yourself: 'Are these the same size pieces?' If no, convert first. Verification: Check by converting to decimals: 1/3 + 1/4 ≈ 0.333 + 0.25 = 0.583. Is 2/7 ≈ 0.286? NO! Is 7/12 ≈ 0.583? YES! ✓. Visual check: Draw two identical shapes, divide one into thirds (shade 1), divide second into fourths (shade 1). Does the combined shading equal 2/7 of total area? Clearly not—it's more than half (7/12 > 1/2), while 2/7 < 1/2. 2. Thinking larger denominator means larger fraction: Wrong thinking: 1/8 > 1/4 because 8 > 4. Correct: 1/4 > 1/8 because each quarter is larger than each eighth. Why wrong: Denominator indicates number of equal parts dividing the whole. More parts means smaller individual pieces. Cutting pizza into 8 slices creates smaller slices than cutting into 4 slices. Visualization: 1/2 > 1/3 > 1/4 > 1/5 > 1/6 > 1/7 > 1/8... Unit fractions decrease as denominator increases. Prevention: Remember: denominator tells 'How many pieces is the whole divided into?' More divisions = smaller pieces. For unit fractions (numerator 1), larger denominator always means smaller fraction. Comparison trick: Convert to common denominator or decimals. 1/4 = 2/8; clearly 2/8 > 1/8, so 1/4 > 1/8. Or: 1/4 = 0.25, 1/8 = 0.125; 0.25 > 0.125 ✓. General fractions: Compare 3/8 vs. 2/4. Common denominator: 3/8 vs. 4/8. Now obvious: 4/8 > 3/8, so 2/4 > 3/8. 3. Forgetting to flip (reciprocal) when dividing: Wrong: 1/2 ÷ 1/4 = 1/8 (multiplying straight across). Correct: 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2 (multiplying by reciprocal). Why wrong: Division by fraction is NOT the same as multiplication. Division asks 'How many of these fit?' Multiplication asks 'What is this much of?' Forgetting to flip treats division as multiplication, giving wrong answer. Conceptual check: 'How many quarters fit into one half?' Obviously 2 quarters make a half. So answer should be 2, not 1/8. Prevention: Memorize and verbalize: 'Dividing by a fraction means multiply by its reciprocal (flip).' First fraction stays same (keep), division becomes multiplication (change), second fraction flips (flip). KCF mnemonic: Keep, Change, Flip. Verification: Does answer make sense? Dividing by fraction less than 1 should give answer LARGER than starting number. 1/2 ÷ 1/4 should be bigger than 1/2. Is 2 bigger? Yes ✓. Is 1/8 bigger? No ✗. 4. Flipping the wrong fraction when dividing: Wrong: 1/2 ÷ 1/4 = 2/1 × 1/4 = 2/4 = 1/2 (flipping first fraction instead of second). Correct: 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2 (flipping second fraction, the divisor). Why wrong: Flip the divisor (the fraction you're dividing BY), not the dividend (the fraction being divided). a/b ÷ c/d: Flip c/d, not a/b. Prevention: Write it clearly: 'First ÷ Second' means 'First × (Second flipped).' The fraction after the ÷ sign is the one you flip. Or think: 'Keep the first, change ÷ to ×, flip the second.' KCF applies to second fraction. Example labels: (Keep this) ÷ (Flip this) = (Keep this) × (This flipped). 5. Multiplying by wrong factor when finding common denominator: Wrong: Converting 1/4 to denominator 12: 1/4 = 1/12 (just changing denominator without adjusting numerator). Correct: 1/4 = 3/12 (multiply both numerator AND denominator by 3, because 4×3=12). Why wrong: Changing only denominator creates different fraction with different value. Must multiply/divide BOTH parts by same number to maintain equivalent value (multiplying by n/n = 1, which doesn't change value). Prevention: Ask: 'What do I multiply the denominator by to get the LCD?' Then multiply BOTH numerator and denominator by that number. 1/4 to twelfths: 4 × ? = 12. Answer: 3. So 1×3=3 and 4×3=12, giving 3/12. Verification: Convert to decimals. 1/4 = 0.25. 3/12 = 0.25 ✓. 1/12 = 0.0833 ✗. Visual: Divide a shape into 4 parts, shade 1 (1/4). Subdivide each fourth into 3 pieces, creating 12 total parts. How many parts shaded? 3 out of 12 (3/12), not 1 out of 12. 6. Not simplifying final answers: Not technically wrong, but unprofessional and harder to interpret. Example: Answering 6/12 instead of 1/2, or 15/45 instead of 1/3. Why matters: Simplified fractions clearer, easier to understand and use. Tests expect simplified answers. Comparison easier with simplified fractions. Prevention: ALWAYS simplify at the end. Find GCD of numerator and denominator, divide both by GCD. Or simplify progressively: if both even, divide by 2; if both divisible by 3, divide by 3; repeat until no common factors. Check: Are numerator and denominator coprime (share no factors except 1)? If yes, simplified. If no, simplify more. Quick tricks: If both end in 5 or 0, divisible by 5. If digits sum to multiple of 3, divisible by 3. If even, divisible by 2. 7. Confusing multiplication and addition procedures: Wrong: Trying to find common denominators for multiplication. '2/3 × 3/4 = ?': Incorrectly thinking need common denominators, wasting time finding LCD 12. Correct: Just multiply across: 2/3 × 3/4 = 6/12 = 1/2. No common denominators needed. Why wrong: Common denominators only required for addition and subtraction (combining different-sized pieces). Multiplication means 'fraction of fraction'—different operation not requiring common sizes. Prevention: Memorize: Addition/Subtraction → NEED common denominators. Multiplication/Division → NO common denominators needed, just multiply (or multiply by reciprocal for division). If operation is + or -, find LCD. If operation is × or ÷, skip LCD step. 8. Improper mixed number conversion errors: Wrong: Converting 3 1/2 to improper: 3×1=3, so 3/2. Correct: 3 1/2 = (3×2+1)/2 = 7/2. Why wrong: Forgot to include the numerator of the fractional part. Formula is (whole × denominator + numerator) / denominator, not just (whole × numerator) / denominator. Prevention: Use formula explicitly: a b/c = (a×c + b) / c. 3 1/2: a=3, b=1, c=2. (3×2 + 1) / 2 = 7/2. Check: 7/2 = 3.5. Does 3 1/2 = 3.5? Yes ✓. Mnemonic: 'Multiply whole by bottom, add top, over bottom.' Whole=3, bottom=2: 3×2=6. Top=1: 6+1=7. Over bottom=2: 7/2. 9. Negative fraction sign placement confusion: Incorrect/confusing: Writing -3/4, 3/-4, or -(3/4) inconsistently. Standard form: -3/4 (negative in numerator or in front of fraction, not in denominator). Why matters: Mathematical convention for clarity. 3/-4 technically correct but unconventional. Prevention: Place negative sign in front of fraction or in numerator: -3/4 or (-3)/4. Never in denominator unless there's good reason and it's clear. For calculations: Factor out negative sign, calculate with positive fractions, apply negative to result. Example: -1/2 + -1/4 = -(1/2 + 1/4) = -( 2/4 + 1/4) = -3/4. 10. Division/Multiplication misconceptions about result size: Wrong thinking: 'Multiplication always makes bigger; division always makes smaller.' Reality: Multiplying by fraction less than 1 makes smaller. Dividing by fraction less than 1 makes bigger. Examples: 8 × 1/2 = 4 (smaller). 8 ÷ 1/2 = 16 (bigger). Why: Multiplying by 1/2 means 'take half of,' which reduces. Dividing by 1/2 asks 'how many halves fit into 8?'—answer is 16 halves, more than original 8. Prevention: Understand operations conceptually: Multiply by proper fraction (< 1) → result smaller (taking part of). Multiply by improper fraction (> 1) → result bigger (taking more than whole). Divide by proper fraction (< 1) → result bigger (more small pieces fit). Divide by improper fraction (> 1) → result smaller (fewer large pieces fit). Estimate before calculating: Is answer likely bigger or smaller than starting number? Verification Techniques for All Fraction Calculations: Convert to decimals and check: Fractions 1/2 + 1/3 = 5/6. Check: 0.5 + 0.333... = 0.833... = 5/6 ≈ 0.833 ✓. Estimate and test reasonableness: 1/2 + 1/3 should be less than 1 (neither fraction is whole, so sum can't reach 2). Is 5/6 < 1? Yes ✓. Should be more than 1/2 (adding positive amount to 1/2). Is 5/6 > 1/2? Yes (5/6 > 3/6 = 1/2) ✓. Visual models: Draw area models, number lines, or use fraction manipulatives to verify. Reverse operations: If a/b × c/d = e/f, then e/f ÷ c/d should equal a/b. If 2/3 × 3/4 = 1/2, does 1/2 ÷ 3/4 = 2/3? Yes: 1/2 × 4/3 = 4/6 = 2/3 ✓. Use online calculators as verification (but understand process, don't rely blindly). Practice with known results: 1/2 + 1/2 = 1. 1/4 × 4 = 1. 1 ÷ 2 = 1/2. Master these simple cases first to build pattern recognition. General Study Strategies: Master one operation fully before combining: Addition first, then subtraction, multiplication, division, finally mixed operations. Learn WHY rules work, not just HOW to apply: Understanding conceptual basis prevents errors and enables troubleshooting. Practice identifying error patterns in worked examples: Review mistakes, categorize by type, practice those specific error-prone scenarios. Use fraction calculator to check work while learning, gradually phase out as confidence builds. Teach someone else: Explaining fraction concepts reveals gaps in understanding. Strongest learning occurs when teaching. Connect to real-world contexts: Cooking, construction, music, sports statistics provide meaningful fraction practice and motivation. Building fraction fluency takes practice, but recognizing these common pitfalls accelerates mastery and prevents ingrained misconceptions.",
    order: 6
  }
];

type OperationType = 'add' | 'subtract' | 'multiply' | 'divide' | 'simplify';

interface FractionResult {
  numerator: number;
  denominator: number;
  decimal: number;
  simplified: { num: number; den: number };
  mixed?: { whole: number; num: number; den: number };
}

export default function FractionCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('fraction-calculator');

  const [num1, setNum1] = useState<number>(3);
  const [den1, setDen1] = useState<number>(4);
  const [num2, setNum2] = useState<number>(1);
  const [den2, setDen2] = useState<number>(2);
  const [operation, setOperation] = useState<OperationType>('add');
  const [result, setResult] = useState<FractionResult | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  const relatedCalculators = [
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' },
    { href: '/us/tools/calculators/average-calculator', title: 'Average Calculator', description: 'Statistical averages' },
    { href: '/us/tools/calculators/modulo-calculator', title: 'Modulo Calculator', description: 'Find remainders' },
    { href: '/us/tools/calculators/ratio-calculator', title: 'Ratio Calculator', description: 'Calculate ratios' },
  ];

  const operations = [
    { value: 'add' as OperationType, label: 'Add', symbol: '+' },
    { value: 'subtract' as OperationType, label: 'Subtract', symbol: '−' },
    { value: 'multiply' as OperationType, label: 'Multiply', symbol: '×' },
    { value: 'divide' as OperationType, label: 'Divide', symbol: '÷' },
    { value: 'simplify' as OperationType, label: 'Simplify', symbol: '→' },
  ];

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    return b === 0 ? a : gcd(b, a % b);
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const simplify = (num: number, den: number): { num: number; den: number } => {
    if (den === 0) return { num: 0, den: 1 };
    const divisor = gcd(num, den);
    let simpNum = num / divisor;
    let simpDen = den / divisor;
    if (simpDen < 0) {
      simpNum = -simpNum;
      simpDen = -simpDen;
    }
    return { num: simpNum, den: simpDen };
  };

  const toMixed = (num: number, den: number): { whole: number; num: number; den: number } => {
    if (den === 0) return { whole: 0, num: 0, den: 1 };
    const whole = Math.floor(Math.abs(num) / Math.abs(den));
    const remainder = Math.abs(num) % Math.abs(den);
    const sign = (num < 0 && den > 0) || (num > 0 && den < 0) ? -1 : 1;
    return {
      whole: sign * whole,
      num: remainder,
      den: Math.abs(den)
    };
  };

  const calculate = () => {
    if (den1 === 0 || (operation !== 'simplify' && den2 === 0)) {
      return;
    }

    if (operation === 'divide' && num2 === 0) {
      return;
    }

    let resNum = 0;
    let resDen = 1;
    const calculationSteps: string[] = [];

    switch (operation) {
      case 'add': {
        const commonDen = lcm(den1, den2);
        const newNum1 = num1 * (commonDen / den1);
        const newNum2 = num2 * (commonDen / den2);
        resNum = newNum1 + newNum2;
        resDen = commonDen;

        calculationSteps.push(`Find LCD of ${den1} and ${den2}: ${commonDen}`);
        calculationSteps.push(`Convert: ${num1}/${den1} = ${newNum1}/${commonDen}`);
        calculationSteps.push(`Convert: ${num2}/${den2} = ${newNum2}/${commonDen}`);
        calculationSteps.push(`Add numerators: ${newNum1} + ${newNum2} = ${resNum}`);
        calculationSteps.push(`Result: ${resNum}/${resDen}`);
        break;
      }
      case 'subtract': {
        const commonDen = lcm(den1, den2);
        const newNum1 = num1 * (commonDen / den1);
        const newNum2 = num2 * (commonDen / den2);
        resNum = newNum1 - newNum2;
        resDen = commonDen;

        calculationSteps.push(`Find LCD of ${den1} and ${den2}: ${commonDen}`);
        calculationSteps.push(`Convert: ${num1}/${den1} = ${newNum1}/${commonDen}`);
        calculationSteps.push(`Convert: ${num2}/${den2} = ${newNum2}/${commonDen}`);
        calculationSteps.push(`Subtract numerators: ${newNum1} - ${newNum2} = ${resNum}`);
        calculationSteps.push(`Result: ${resNum}/${resDen}`);
        break;
      }
      case 'multiply': {
        resNum = num1 * num2;
        resDen = den1 * den2;

        calculationSteps.push(`Multiply numerators: ${num1} × ${num2} = ${resNum}`);
        calculationSteps.push(`Multiply denominators: ${den1} × ${den2} = ${resDen}`);
        calculationSteps.push(`Result: ${resNum}/${resDen}`);
        break;
      }
      case 'divide': {
        resNum = num1 * den2;
        resDen = den1 * num2;

        calculationSteps.push(`Flip the second fraction: ${num2}/${den2} → ${den2}/${num2}`);
        calculationSteps.push(`Multiply: ${num1}/${den1} × ${den2}/${num2}`);
        calculationSteps.push(`= ${resNum}/${resDen}`);
        break;
      }
      case 'simplify': {
        resNum = num1;
        resDen = den1;

        const divisor = gcd(num1, den1);
        calculationSteps.push(`Find GCD of ${num1} and ${den1}: ${divisor}`);
        calculationSteps.push(`Divide both by GCD: ${num1}/${divisor} and ${den1}/${divisor}`);
        calculationSteps.push(`Result: ${num1 / divisor}/${den1 / divisor}`);
        break;
      }
    }

    const simplified = simplify(resNum, resDen);
    const decimal = simplified.num / simplified.den;
    const mixed = toMixed(simplified.num, simplified.den);

    if (simplified.num !== resNum || simplified.den !== resDen) {
      calculationSteps.push(`Simplified: ${simplified.num}/${simplified.den}`);
    }

    setSteps(calculationSteps);
    setResult({
      numerator: resNum,
      denominator: resDen,
      decimal: decimal,
      simplified: simplified,
      mixed: Math.abs(simplified.num) > Math.abs(simplified.den) ? mixed : undefined,
    });
  };

  const needsSecondFraction = ['add', 'subtract', 'multiply', 'divide'].includes(operation);

  // Auto-calculate on change
  useState(() => {
    calculate();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Fraction Calculator')}</h1>
          <p className="text-gray-600">Add, subtract, multiply, divide, and simplify fractions</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          {/* Operation Selection */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Operation</label>
            <div className="grid grid-cols-5 gap-2">
              {operations.map((op) => (
                <button
                  key={op.value}
                  onClick={() => setOperation(op.value)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    operation === op.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xl font-medium">{op.symbol}</div>
                  <div className="text-xs mt-1">{op.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Fractions</h2>

              {/* Fraction Display */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {/* First Fraction */}
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <label className="block text-xs font-medium text-blue-700 mb-2">First</label>
                  <input
                    type="number"
                    value={num1}
                    onChange={(e) => setNum1(Number(e.target.value))}
                    className="w-20 px-2 py-2 text-xl font-bold text-center border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="h-0.5 bg-blue-400 mx-2 my-1.5 rounded"></div>
                  <input
                    type="number"
                    value={den1}
                    onChange={(e) => setDen1(Number(e.target.value))}
                    className="w-20 px-2 py-2 text-xl font-bold text-center border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {needsSecondFraction && (
                  <>
                    {/* Operation Symbol */}
                    <div className="text-2xl font-bold text-gray-400">
                      {operations.find(o => o.value === operation)?.symbol}
                    </div>

                    {/* Second Fraction */}
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <label className="block text-xs font-medium text-green-700 mb-2">Second</label>
                      <input
                        type="number"
                        value={num2}
                        onChange={(e) => setNum2(Number(e.target.value))}
                        className="w-20 px-2 py-2 text-xl font-bold text-center border border-green-200 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                      <div className="h-0.5 bg-green-400 mx-2 my-1.5 rounded"></div>
                      <input
                        type="number"
                        value={den2}
                        onChange={(e) => setDen2(Number(e.target.value))}
                        className="w-20 px-2 py-2 text-xl font-bold text-center border border-green-200 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors"
              >
                Calculate
              </button>

              {/* Quick Fractions */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Quick fractions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { n: 1, d: 2 },
                    { n: 1, d: 3 },
                    { n: 1, d: 4 },
                    { n: 2, d: 3 },
                    { n: 3, d: 4 },
                  ].map((f, i) => (
                    <button
                      key={i}
                      onClick={() => { setNum1(f.n); setDen1(f.d); }}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      {f.n}/{f.d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

              {result ? (
                <div className="space-y-4">
                  {/* Main Result */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-100">
                    <div className="text-center">
                      <div className="text-sm text-purple-600 mb-2">Simplified Result</div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700">
                        {result.simplified.num}/{result.simplified.den}
                      </div>
                    </div>
                  </div>

                  {/* Additional Results */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Decimal</div>
                      <div className="font-semibold text-gray-800">{result.decimal.toFixed(6)}</div>
                    </div>
                    {result.mixed && result.mixed.whole !== 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Mixed Number</div>
                        <div className="font-semibold text-gray-800">
                          {result.mixed.whole} {result.mixed.num}/{result.mixed.den}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Steps */}
                  {steps.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-700 mb-2 text-sm">Solution Steps</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {steps.map((step, index) => (
                          <div key={index}>{step}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-5 md:p-8 text-center">
                  <p className="text-gray-500">Click Calculate to see the result</p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Formulas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Fraction Formulas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Operation</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Formula</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 px-3 font-medium">Addition</td>
                  <td className="py-2 px-3 font-mono text-xs">a/b + c/d = (ad + bc) / bd</td>
                  <td className="py-2 px-3 text-gray-600">1/2 + 1/3 = 5/6</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Subtraction</td>
                  <td className="py-2 px-3 font-mono text-xs">a/b - c/d = (ad - bc) / bd</td>
                  <td className="py-2 px-3 text-gray-600">3/4 - 1/4 = 1/2</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Multiplication</td>
                  <td className="py-2 px-3 font-mono text-xs">a/b × c/d = ac / bd</td>
                  <td className="py-2 px-3 text-gray-600">2/3 × 3/4 = 1/2</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Division</td>
                  <td className="py-2 px-3 font-mono text-xs">a/b ÷ c/d = a/b × d/c</td>
                  <td className="py-2 px-3 text-gray-600">1/2 ÷ 1/4 = 2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Fractions Reference */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Common Fractions Reference</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { f: '1/2', d: '0.5', p: '50%' },
              { f: '1/3', d: '0.333', p: '33.3%' },
              { f: '1/4', d: '0.25', p: '25%' },
              { f: '1/5', d: '0.2', p: '20%' },
              { f: '2/3', d: '0.667', p: '66.7%' },
              { f: '3/4', d: '0.75', p: '75%' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="font-bold text-gray-800">{item.f}</div>
                <div className="text-xs text-gray-500 mt-1">{item.d}</div>
                <div className="text-xs text-gray-500">{item.p}</div>
              </div>
            ))}
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
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
        {/* Mobile MREC2 - Before FAQs */}

        <CalculatorMobileMrec2 />


        {/* FAQs */}
        <FirebaseFAQs
          pageId="fraction-calculator"
          fallbackFaqs={fallbackFaqs}
        />
      </div>
    </div>
  );
}
