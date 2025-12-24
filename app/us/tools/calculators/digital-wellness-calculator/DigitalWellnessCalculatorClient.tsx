'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "How much screen time is healthy for adults?",
    answer: "Healthy screen time varies by activity type and individual circumstances, but evidence-based guidelines provide general frameworks for adults. Recreational screen time (non-work): Medical organizations including the American Heart Association recommend limiting recreational screen time to 2-3 hours daily for optimal health outcomes. Research shows recreational screen time exceeding 4-5 hours daily correlates with increased risks of: obesity (sedentary behavior and mindless eating), cardiovascular disease (reduced physical activity), depression and anxiety (social comparison, FOMO, reduced face-to-face interaction), sleep disruption (blue light exposure, mental stimulation before bed), and digital eye strain (Computer Vision Syndrome affecting 50-90% of screen workers). Work-related screen time: For knowledge workers spending 6-9 hours daily on computers, health depends more on break frequency and posture than total time. The 20-20-20 rule (every 20 minutes, view something 20 feet away for 20 seconds) and hourly 5-minute breaks significantly reduce eye strain and musculoskeletal problems. Standing desk usage and ergonomic setups further mitigate negative effects. Screen time quality matters as much as quantity: Passive consumption (scrolling social media, binge-watching) shows stronger associations with negative mental health outcomes compared to active engagement (video calling friends, creative work, learning). The key is intentionality—ask 'Am I choosing this activity or defaulting to it?' Context-specific considerations: Parents and caregivers may need more screen time for work-life management without negative effects if balanced with movement and social interaction. Gamers and creative professionals using screens for hobbies show better outcomes when activities are purposeful rather than escapist. Video calls with distant family/friends provide social connection benefits outweighing screen time concerns. Age-specific adult guidelines: Young adults (18-30): Most vulnerable to social media's mental health impacts—limit social media to 30-60 minutes daily, restrict before bed. Middle adults (30-55): Balance work demands with screen-free family time; avoid work emails after hours to prevent burnout. Older adults (55+): Screen time for cognitive games and social connection shows potential benefits; prioritize video calls over passive TV watching. Practical screen time audit: Track one week of screen usage (phone settings show this automatically). Categorize as work-necessary, educational/productive, social connection, or passive/mindless. Reduce passive category by 25-50% weekly until reaching 2-3 hours recreational total. Replace screen time with physical activity, hobbies, or face-to-face social interaction.",
    order: 1
  },
  {
    id: '2',
    question: "Why does excessive screen time harm sleep quality?",
    answer: "Excessive screen time, particularly before bedtime, severely disrupts sleep through multiple physiological and psychological mechanisms. Blue light and circadian rhythm disruption: Digital screens emit short-wavelength blue light (400-490nm) that powerfully suppresses melatonin—the hormone signaling sleep readiness. Evening blue light exposure shifts circadian rhythm later (delayed sleep phase), making it harder to fall asleep and wake at desired times. Research shows 2 hours of tablet use before bed suppresses melatonin by 23%, delaying sleep onset by 60-90 minutes and reducing REM sleep (critical for memory consolidation and emotional regulation). The retina contains intrinsically photosensitive retinal ganglion cells (ipRGCs) most sensitive to blue light—these cells signal the brain's suprachiasmatic nucleus (master circadian clock) that it's daytime, inhibiting melatonin release from the pineal gland. Mental and emotional stimulation: Screen content activates the sympathetic nervous system ('fight or flight'), elevating cortisol and adrenaline when the body should be transitioning to parasympathetic ('rest and digest') dominance for sleep. Social media, news, work emails, and exciting content trigger emotional responses (anger, anxiety, excitement, FOMO) that maintain alertness and racing thoughts. The brain interprets emotional stimulation as requiring continued wakefulness to process and respond. Interactive screen activities (gaming, messaging, browsing) demand cognitive engagement and decision-making, keeping the prefrontal cortex active when it should be powering down for sleep. Displaced sleep time: Binge-watching, gaming sessions, or social media scrolling directly replace sleep hours—the average person loses 30-45 minutes of sleep on nights with bedtime screen use. The 'just one more episode/level/post' phenomenon exploits dopamine-driven reward systems, making it psychologically difficult to stop despite fatigue. Late-night screen use often correlates with later bedtimes but unchanged morning wake times (work/school schedules), creating cumulative sleep debt. Sleep quality degradation beyond duration: Even when sleep duration remains adequate, screen use reduces deep sleep (slow-wave sleep) percentages—the most restorative sleep stage for physical recovery and immune function. REM sleep, essential for emotional processing and memory consolidation, decreases with blue light exposure before bed. Users report more frequent night wakings and difficulty returning to sleep when engaging in bedtime screen use. Age-specific vulnerabilities: Children and adolescents show greater circadian disruption from evening screens because their eyes transmit more blue light than aging adult eyes (lens yellowing in adulthood filters some blue light). Teenagers' natural circadian rhythm already shifts later during puberty; evening screens exacerbate this, contributing to chronic sleep deprivation and next-day academic/mood impairment. Older adults generally experience earlier circadian timing (advanced sleep phase) but remain vulnerable to blue light's melatonin suppression, though potentially requiring less exposure time to cause effects. Mitigating strategies: Digital sunset: Complete screen cessation 1-2 hours before target sleep time (most effective intervention). Blue light filtering: Use device night mode/blue light filters (reduces but doesn't eliminate effects), or wear blue-blocking glasses after 8 PM. Bedroom environment: Keep phones/tablets outside the bedroom; use traditional alarm clocks instead of phone alarms that tempt morning scrolling. Alternative wind-down activities: Reading physical books, gentle stretching, meditation, journaling replace screen stimulation with sleep-promoting calm. Screen timing exceptions: Low-brightness reading apps using dark mode with minimal notifications cause less disruption than social media or video. E-readers with e-ink displays (Kindle Paperwhite) emit minimal blue light and cause negligible sleep disruption compared to tablets.",
    order: 2
  },
  {
    id: '3',
    question: "What is digital eye strain and how can I prevent it?",
    answer: "Digital eye strain (Computer Vision Syndrome) affects 50-90% of regular screen users, causing discomfort, reduced productivity, and potential long-term vision changes. Understanding its causes enables effective prevention. Symptoms and prevalence: Eye discomfort, dryness, burning, or grittiness affecting 65% of screen workers. Blurred vision during or after screen use (difficulty focusing at distance after prolonged near work). Headaches (often frontal or temporal) in 40-50% of users. Neck, shoulder, and back pain from poor posture and screen positioning. Light sensitivity and difficulty with nighttime driving after day-long screen exposure. Symptoms typically worsen throughout workday and improve with screen breaks—distinguishing this from eye diseases requiring medical treatment. Underlying mechanisms: Reduced blink rate: Normal blink frequency is 15-20 blinks/minute, distributing tear film and moistening eyes. Screen users blink only 5-7 times/minute—66% reduction causing tear film evaporation and dry eye symptoms. Sustained near focus: Prolonged near work (typical screen distance 20-26 inches) requires continuous ciliary muscle contraction to focus. This 'accommodative stress' causes fatigue, especially for users over 40 experiencing presbyopia (age-related near focus difficulty). Vergence demand: Eyes must converge (turn inward) for near viewing—sustained convergence effort fatigues extraocular muscles, causing eye strain and headaches. Blue light exposure: While not proven to cause permanent damage, blue light wavelengths scatter more than longer wavelengths, reducing contrast and potentially contributing to eyestrain. Screen glare and reflections: Light reflecting off screens or shining directly into eyes forces pupils to constantly adjust, causing fatigue. Poor contrast and small fonts: Difficulty distinguishing text from background increases accommodation effort and eye strain. Evidence-based prevention strategies: 20-20-20 Rule (most effective intervention): Every 20 minutes, shift focus to an object 20+ feet away for 20 seconds minimum. This relaxes ciliary muscles from sustained near focus. Stand and move during this break to address posture-related symptoms. Set automated 20-minute reminders until the habit becomes automatic. Blink exercises and artificial tears: Consciously blink 10-15 times fully (squeeze eyes shut) every hour to redistribute tear film. Use preservative-free artificial tears 3-4 times daily for persistent dryness. Consider a desktop humidifier in dry environments (office air conditioning). Optimal screen positioning and ergonomics: Position screen 20-26 inches from eyes (arm's length)—closer increases accommodation demand. Top of screen at or slightly below eye level (0-30 degrees downward gaze reduces dry eye by minimizing exposed ocular surface). Tilt screen slightly backward (10-20 degrees) to reduce glare and neck strain. Ensure adequate ambient lighting—avoid dark rooms with bright screens or bright rooms causing screen glare. Use matte screen protectors to reduce reflections. Position screens perpendicular to windows; close blinds or adjust screen brightness to minimize glare. Display settings optimization: Increase text size to reduce squinting and accommodate effort (125-150% scaling often ideal). Maximize contrast—dark text on light background for bright rooms; consider dark mode in dim environments. Adjust screen brightness to match ambient lighting (not significantly brighter or dimmer than surroundings). Enable blue light filters (Night Shift, f.lux) especially for evening use, though primarily benefits sleep rather than eye strain. Prescription considerations: Computer glasses: Single-vision lenses prescribed specifically for computer working distance reduce accommodation effort. Particularly beneficial for users over 40 with presbyopia. Progressive lenses: Multifocal users often benefit from computer-specific progressives with larger intermediate zones than general-wear progressives. Prescription accuracy: Outdated prescriptions force eyes to work harder—get eye exams every 1-2 years. Anti-reflective coatings: Reduce glare and reflections that contribute to strain. Workplace accommodations: Take regular breaks every 1-2 hours (5-10 minutes away from screen). Alternate tasks between screen-intensive and non-screen work when possible. Use document holders placed at screen height to minimize head/eye movement when typing. Ensure proper desk height (elbows at 90 degrees) and chair support (lumbar support, feet flat on floor). When to seek professional care: Symptoms persist despite prevention strategies—may indicate uncorrected refractive error, binocular vision dysfunction, or dry eye disease. New onset of floaters, flashes, or peripheral vision loss (emergency symptoms). Persistent headaches or eye pain (rule out underlying conditions). Regular comprehensive eye exams detect conditions before symptoms develop.",
    order: 3
  },
  {
    id: '4',
    question: "How does social media use affect mental health?",
    answer: "Social media's relationship with mental health is complex and bidirectional—usage patterns, platform features, individual vulnerabilities, and content types all influence outcomes. Research reveals both risks and potential benefits. Documented mental health risks: Depression and anxiety: Longitudinal studies show dose-response relationship—each additional hour of daily social media use correlates with 13-18% increased depression/anxiety risk in adolescents and young adults. Mechanisms include: upward social comparison (viewing curated highlight reels of others' lives), FOMO (Fear of Missing Out on rewarding experiences), reduced face-to-face social interaction displacing protective factors, cyberbullying and online harassment (affecting 40% of users), and sleep disruption from evening use and anticipatory anxiety about notifications. The comparison trap: Social media platforms algorithmically curate content to maximize engagement, disproportionately showing aspirational content (achievements, attractiveness, experiences). Users engage in automatic upward social comparison—judging their behind-the-scenes reality against others' highlight reels. This triggers feelings of inadequacy, envy, and reduced life satisfaction. Particularly damaging for body image: Instagram and TikTok's visual focus and photo editing tools create unrealistic beauty standards. Studies show 30 minutes of Instagram browsing significantly increases body dissatisfaction in young women. Appearance-focused accounts and 'fitspo' content correlate with eating disorder symptoms. Dopamine-driven addiction patterns: Social media platforms exploit variable reward schedules (unpredictable likes, comments, messages) that trigger dopamine release—the same neurotransmitter system activated by gambling and substance use. The scroll-refresh pattern becomes habitual and automatic, often occurring without conscious decision ('autopilot' use). Notifications create anticipatory anxiety and compulsive checking behaviors—average user checks phone 96 times daily, often in response to phantom vibrations. Prolonged use desensitizes dopamine receptors, requiring increasing stimulation for satisfaction (tolerance). Attention fragmentation: Frequent social media checking (average every 6-7 minutes during waking hours) prevents sustained attention needed for deep work, learning, and problem-solving. Task-switching between work and social media reduces productivity by 40% and increases mental fatigue. Constant connectivity eliminates psychological 'downtime' necessary for creativity, reflection, and emotional processing. Sleep disruption mechanisms: Evening use suppresses melatonin and delays sleep onset (blue light and mental stimulation). Fear of missing out drives bedtime scrolling and morning checking upon waking. Notifications during sleep fragment sleep architecture, reducing restorative deep sleep. Individual vulnerability factors: Pre-existing mental health conditions (depression, anxiety, ADHD) increase susceptibility to negative effects and problematic use patterns. Adolescents and young adults (ages 13-25) show greatest vulnerability during critical periods of identity formation and peer influence sensitivity. Personality traits: high neuroticism, low self-esteem, and social anxiety predict more harmful usage patterns. Potential benefits (context-dependent): Social connection and support: Maintaining long-distance relationships and connecting with others sharing niche interests or health conditions. Online support communities for mental health, chronic illness, or marginalized identities provide validation and information. Video calling shows protective effects compared to text-based interaction. Access to information and mental health resources: Psychoeducation, therapy directories, crisis hotlines, and peer support reduce barriers to care. Activism and social movements mobilize around important causes. Identity exploration: LGBTQ+ youth and other marginalized groups find affirming communities unavailable locally. Creative expression and skill development through content creation. Harm reduction strategies: Time limits: Restrict social media to 30-60 minutes daily—research shows under 30 minutes daily shows no negative mental health effects, while 3+ hours shows substantial risk. Use app timers (Screen Time on iOS, Digital Wellbeing on Android). Intentional usage: Identify purpose before opening apps ('checking messages from friends' vs. mindless scrolling). Active engagement (posting, commenting, messaging) shows better outcomes than passive scrolling. Curate feeds: Unfollow accounts triggering comparison, inadequacy, or anxiety. Follow accounts providing education, inspiration, or genuine connection. Disable notifications: Check social media at designated times rather than responding to interruptions. Remove apps from home screen to reduce automatic checking. Phone-free periods: Establish screen-free morning routine (first 30-60 minutes awake) and bedtime routine (last 1-2 hours before sleep). Designated phone-free times during meals, family time, exercise. Reality check: Remember social media shows curated highlights, not complete reality. Practice gratitude for your own life rather than comparing to others' presentations. Professional help: Seek therapy if social media use interferes with daily functioning, relationships, work, or causes significant distress. Cognitive-behavioral therapy and dialectical behavior therapy show effectiveness for problematic social media use.",
    order: 4
  },
  {
    id: '5',
    question: "What are practical strategies to reduce screen time?",
    answer: "Reducing screen time requires both environmental design (removing triggers, creating friction) and behavioral strategies (replacement activities, accountability). Evidence-based interventions with highest success rates: Environmental modifications (highest impact): Remove apps from phone: Delete social media apps; use browser versions with intentional login barriers. The 5-second delay of opening a browser and logging in reduces impulsive checking by 40-60%. Turn off all non-essential notifications: Disable badges, banners, sounds for all apps except calls/texts. Notification anxiety drives 30-50% of phone checking—eliminating them dramatically reduces usage. Create phone-free zones: Charge phone outside bedroom (use traditional alarm clock). Designate dining table, bedrooms, bathrooms as device-free spaces. Store phone in different room during focused work or family time. Grayscale mode: Switch phone to black-and-white display (Accessibility settings)—removes dopamine-triggering color rewards, reducing appeal by 20-30%. Use app timers and blockers: iOS Screen Time and Android Digital Wellbeing set daily app limits. Freedom, Forest, and Cold Turkey block distracting apps/websites during designated focus time. Replacement strategies (critical for sustaining reductions): Identify trigger → response pattern: Log what triggers phone checking (boredom, anxiety, transitions, waiting). Develop alternative responses: bored → read physical book; anxious → 5 deep breaths; waiting → observe surroundings. Physical alternatives: Keep a book, puzzle, knitting, or sketchpad where you previously used phone. Boredom tolerance: Practice sitting with discomfort of boredom without immediately reaching for stimulation—this builds attention span and reduces compulsive checking. Social and active replacement: Schedule face-to-face social activities, exercise classes, or hobby groups during former screen time. Physical activity provides dopamine release without digital dependency. Social accountability: Share reduction goals with family/friends. Use apps tracking progress (Moment, RescueTime) and sharing with accountability partners. Family 'phone stacking': During meals, everyone stacks phones face-down; first person to check pays for meal/does dishes. Mindfulness and intentionality practices: Pause before picking up phone: Ask 'What is my intention?' Most checking is automatic rather than purposeful. Scheduled checking times: Batch email/social media checking to 2-3 designated times daily rather than constant availability. Morning and evening routines: Replace morning phone checking with 10 minutes of gratitude journaling, exercise, or meditation. Replace bedtime scrolling with reading, stretching, or planning next day. Workday strategies (for knowledge workers): Separate devices: Use different devices for work and personal activities when possible. Block social media on work computer: Use website blockers (Freedom, Cold Turkey) during work hours. Pomodoro Technique: 25-minute focused work sessions with 5-minute breaks (screen-free breaks when possible). Close unnecessary tabs: Keep only task-relevant tabs open; close email except during designated checking times. Phone in drawer: Place phone out of sight during deep work—mere presence impairs cognitive performance even when not checking. Gradual reduction approach (sustainable long-term): Week 1-2: Track current usage without changes—build awareness of patterns and triggers. Week 3-4: Implement environmental modifications (remove apps, disable notifications, phone-free bedroom). Week 5-6: Add one replacement activity daily (morning walk, evening reading, hobby). Week 7-8: Set app time limits 20% below baseline usage. Week 9-12: Continue reducing limits by 10% weekly until reaching target 2-3 hours recreational screen time. Ongoing maintenance: Review screen time weekly—celebrate progress and troubleshoot setbacks. Update systems as needed—new temptations (new apps) require new solutions. Balance is goal: Some screen time provides value (connection, learning, entertainment)—aim for intentional use, not elimination. Addressing withdrawal and resistance: Acknowledge difficulty: Reduced dopamine from decreased use can cause temporary boredom, anxiety, FOMO—these diminish within 1-2 weeks. Expect urges and cravings: Practice urge surfing (observe urge without acting) rather than white-knuckling resistance. Focus on gains: Improved sleep, better mood, enhanced relationships, increased productivity typically emerge within 2-3 weeks. Relapse planning: Slip-ups are normal—return to strategies without self-criticism. Professional support: Consider therapy if screen use significantly impairs functioning or results from underlying anxiety, depression, or ADHD requiring treatment.",
    order: 5
  },
  {
    id: '6',
    question: "How does screen time affect children and teenagers differently than adults?",
    answer: "Children and adolescents experience distinct and often more severe impacts from screen time due to ongoing neurological development, identity formation, and social-emotional vulnerability. Age-specific guidelines and concerns: Infants and toddlers (0-18 months): American Academy of Pediatrics recommends zero screen time except video chatting. Critical period for: language development (requires face-to-face interaction, not screens), sensorimotor development (requires physical exploration and manipulation of objects), attachment formation (responsive caregiving, not passive screen watching). Screen exposure correlates with delayed language development, reduced attention span, and sleep disruption even in infancy. Young children (18 months - 5 years): Limit to 1 hour daily of high-quality educational programming (co-viewed with parent for context). Critical period for: executive function development (planning, working memory, impulse control), social-emotional learning (emotion regulation, empathy, perspective-taking), and physical development (gross and fine motor skills). Passive screen time displaces crucial pretend play, physical activity, and social interaction that build these capacities. Screen exposure correlates with increased tantrums, attention problems, and obesity risk. School-age children (6-12 years): Limit to 1-2 hours recreational screen time (separate from homework use). Risks include: academic impact (screen time correlates with lower grades and reading scores), reduced physical activity (contributing to childhood obesity epidemic), sleep disruption (particularly from evening screens), and early exposure to inappropriate content (violence, sexual content, cyberbullying). Benefits of limited, intentional use: educational apps supporting learning, video calls with distant family, collaborative gaming teaching teamwork. Establish clear rules: no screens during meals, 1 hour before bed, or during family activities. Adolescents (13-18 years): Most vulnerable period—identity formation, peer influence sensitivity, and neurological changes create unique risks. Brain development: Prefrontal cortex (impulse control, decision-making, consequence assessment) doesn't fully mature until mid-20s. Teens are neurologically vulnerable to impulsive phone use, social media addiction, and poor digital citizenship decisions (sexting, oversharing). Dopamine sensitivity peaks during adolescence—social media's reward mechanisms (likes, comments, streaks) create stronger addictive potential than in adults. Social and mental health impacts: Social media comparison particularly harmful during identity-sensitive adolescent years—90% of teens with Instagram report experiencing cyberbullying or negative comparison. Body image concerns peak during puberty; appearance-focused platforms exacerbate dissatisfaction and eating disorder risk. FOMO and exclusion anxiety heightened when peers share social activities in real-time. Sleep deprivation epidemic: 60% of high school students report <7 hours sleep nightly (need 8-10 hours). Evening screen use delays circadian rhythm when teenager biology already shifts later (teens naturally fall asleep later, wake later). Academic and attention impacts: Phones in classroom reduce test scores even when not actively used. Homework with concurrent phone use takes 40-50% longer and shows 25% lower retention. Constant task-switching reduces ability to sustain attention for reading, studying, complex problem-solving. Sexting and online risks: 12-15% of teens report sending sexually explicit images; 25-40% report receiving them. Permanent digital footprints from poor judgment decisions. Increased exposure to pornography, particularly violent or non-consensual content that shapes sexual expectations. Positive uses: Maintaining friendships, accessing mental health resources and peer support, creative expression, and learning opportunities. Developmental considerations across ages: Screen content matters more for younger children (educational vs. entertainment), but time limits matter for all ages. Interactive use (video calls, educational games) superior to passive consumption (watching videos). Parent co-viewing and discussion dramatically improves outcomes by providing context and processing. Parental strategies by age: Infants/toddlers: Model minimal phone use around children; prioritize face-to-face interaction, reading, play. Young children: Co-view all content; use screens as occasional tool, not babysitter; establish screen-free routines (meals, bedtime). School-age: Set clear, consistent rules; monitor content; teach digital literacy; encourage balance with physical activity and hobbies. Adolescents: Negotiate limits collaboratively; maintain open communication about online experiences; model healthy use; delay smartphone ownership when possible (basic phone for safety without internet access). Universal principles: No screens in bedrooms—charge devices in common area overnight. No screens 1 hour before bedtime. Family media plan (American Academy of Pediatrics provides templates): designate screen-free times/zones, balance screen with non-screen activities. Monitor and discuss content: Ask about apps, friends, experiences; address concerning content non-punitively. Prioritize family connection: Regular family meals, activities, conversations without device interruption. Teach critical thinking: Evaluate online information, recognize advertising/manipulation, understand privacy and digital citizenship. When to seek professional help: Screen use interferes with sleep, school, relationships, or physical activity. Signs of depression, anxiety, or social withdrawal associated with use. Cyberbullying, sexting, or exposure to concerning content. Gaming disorder (WHO diagnosis): Impaired control over gaming, increasing priority of gaming over other activities, continuation despite negative consequences, lasting 12+ months.",
    order: 6
  }
];

export default function DigitalWellnessCalculatorClient() {
  const [activeTab, setActiveTab] = useState('daily');

  // Daily Usage State
  const [phoneHours, setPhoneHours] = useState(4);
  const [tabletHours, setTabletHours] = useState(1);
  const [workComputer, setWorkComputer] = useState(6);
  const [personalComputer, setPersonalComputer] = useState(1.5);
  const [tvHours, setTvHours] = useState(2.5);
  const [gamingHours, setGamingHours] = useState(0.5);
  const [sleepHours, setSleepHours] = useState(8);

  // Weekly Analysis State
  const [avgScreenTime, setAvgScreenTime] = useState(10);
  const [weekendDiff, setWeekendDiff] = useState('higher');
  const [diffAmount, setDiffAmount] = useState(2);
  const [peakTime, setPeakTime] = useState('evening');
  const [topAppCategory, setTopAppCategory] = useState('social');
  const [topCategoryTime, setTopCategoryTime] = useState(3);
  const [phonePickups, setPhonePickups] = useState(85);
  const [notifications, setNotifications] = useState(150);

  // Habits State
  const [morningCheck, setMorningCheck] = useState('4');
  const [eatingDevices, setEatingDevices] = useState('4');
  const [phoneAnxiety, setPhoneAnxiety] = useState('4');
  const [bedtimeUsage, setBedtimeUsage] = useState('4');
  const [multitasking, setMultitasking] = useState('4');
  const [actualSleep, setActualSleep] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [wellbeingGoal, setWellbeingGoal] = useState('reduce');

  const [resultsHTML, setResultsHTML] = useState('Select a tab and enter your digital usage information to see personalized wellness analysis and recommendations.');

  useEffect(() => {
    calculateDailyUsage();
  }, [phoneHours, tabletHours, workComputer, personalComputer, tvHours, gamingHours, sleepHours]);

  const calculateDailyUsage = () => {
    const totalScreenTime = phoneHours + tabletHours + workComputer + personalComputer + tvHours + gamingHours;
    const recreationalScreenTime = phoneHours + tabletHours + personalComputer + tvHours + gamingHours;
    const workScreenTime = workComputer;

    const awakeHours = 24 - sleepHours;
    const screenPercentage = (totalScreenTime / awakeHours) * 100;
    const nonScreenTime = awakeHours - totalScreenTime;

    let healthStatus = 'Good';
    let healthColor = 'text-green-600';
    const recommendations: string[] = [];

    if (totalScreenTime > 12) {
      healthStatus = 'Concerning';
      healthColor = 'text-red-600';
      recommendations.push('Consider significant reduction in screen time');
      recommendations.push('Take frequent breaks and engage in offline activities');
    } else if (totalScreenTime > 8) {
      healthStatus = 'Moderate';
      healthColor = 'text-orange-600';
      recommendations.push('Try to reduce recreational screen time');
    } else if (totalScreenTime < 4) {
      healthStatus = 'Excellent';
      healthColor = 'text-blue-600';
      recommendations.push('Great balance! Maintain current habits');
    }

    if (recreationalScreenTime > 3) {
      recommendations.push('Recreational screen time is high - consider outdoor activities');
    }
    if (phoneHours > 4) {
      recommendations.push('Phone usage is excessive - try app time limits');
    }
    if (workScreenTime > 8) {
      recommendations.push('Take regular breaks during work computer time');
    }

    const results = `
      <div class="space-y-4">
        <div class="text-center">
          <div class="text-3xl font-bold text-indigo-600">${totalScreenTime.toFixed(1)}h</div>
          <div class="text-sm text-gray-600">Total Daily Screen Time</div>
          <div class="text-lg font-semibold ${healthColor}">${healthStatus}</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-indigo-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-indigo-600">${screenPercentage.toFixed(0)}%</div>
            <div class="text-xs text-gray-600">Of Waking Hours</div>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-blue-600">${recreationalScreenTime.toFixed(1)}h</div>
            <div class="text-xs text-gray-600">Recreational</div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-green-600">${workScreenTime.toFixed(1)}h</div>
            <div class="text-xs text-gray-600">Work Related</div>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-purple-600">${nonScreenTime.toFixed(1)}h</div>
            <div class="text-xs text-gray-600">Screen-Free Time</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-700 mb-2">Device Breakdown:</h4>
          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span>📱 Phone:</span>
              <span class="font-medium">${phoneHours}h (${((phoneHours/totalScreenTime)*100).toFixed(0)}%)</span>
            </div>
            <div class="flex justify-between">
              <span>💻 Work Computer:</span>
              <span class="font-medium">${workComputer}h (${((workComputer/totalScreenTime)*100).toFixed(0)}%)</span>
            </div>
            <div class="flex justify-between">
              <span>📺 TV/Streaming:</span>
              <span class="font-medium">${tvHours}h (${((tvHours/totalScreenTime)*100).toFixed(0)}%)</span>
            </div>
            <div class="flex justify-between">
              <span>🖥️ Personal Computer:</span>
              <span class="font-medium">${personalComputer}h (${((personalComputer/totalScreenTime)*100).toFixed(0)}%)</span>
            </div>
            ${gamingHours > 0 ? `<div class="flex justify-between"><span>🎮 Gaming:</span><span class="font-medium">${gamingHours}h (${((gamingHours/totalScreenTime)*100).toFixed(0)}%)</span></div>` : ''}
            ${tabletHours > 0 ? `<div class="flex justify-between"><span>📱 Tablet:</span><span class="font-medium">${tabletHours}h (${((tabletHours/totalScreenTime)*100).toFixed(0)}%)</span></div>` : ''}
          </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="bg-yellow-50 p-4 rounded-lg">
          <h4 class="font-semibold text-yellow-700 mb-2">💡 Recommendations:</h4>
          <ul class="text-sm text-gray-700 space-y-1">
            ${recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;

    setResultsHTML(results);
  };

  const calculateWeeklyAnalysis = () => {
    if (avgScreenTime <= 0) {
      alert('Please enter average daily screen time');
      return;
    }

    const weeklyScreenTime = avgScreenTime * 7;
    const monthlyScreenTime = avgScreenTime * 30;
    const yearlyScreenTime = avgScreenTime * 365;

    const peakTimeText: any = {
      'morning': 'Morning (6AM-12PM)',
      'afternoon': 'Afternoon (12PM-6PM)',
      'evening': 'Evening (6PM-12AM)',
      'night': 'Night (12AM-6AM)'
    };

    const categoryText: any = {
      'social': 'Social Media',
      'entertainment': 'Entertainment',
      'productivity': 'Productivity',
      'games': 'Games',
      'news': 'News',
      'communication': 'Communication'
    };

    const insights: string[] = [];
    if (phonePickups > 80) {
      insights.push('Phone pickups are high - consider notification management');
    }
    if (notifications > 100) {
      insights.push('Too many notifications - disable non-essential apps');
    }
    if (topCategoryTime > 3) {
      insights.push(`${categoryText[topAppCategory]} usage is very high`);
    }
    if (weekendDiff === 'higher' && diffAmount > 3) {
      insights.push('Weekend usage is significantly higher - consider offline activities');
    }
    if (peakTime === 'night') {
      insights.push('Late night usage detected - this may affect sleep quality');
    }

    const results = `
      <div class="space-y-4">
        <div class="text-center">
          <h4 class="text-lg font-bold text-gray-800">Weekly Screen Time Analysis</h4>
          <div class="text-3xl font-bold text-purple-600">${weeklyScreenTime.toFixed(0)}h</div>
          <div class="text-sm text-gray-600">Weekly Screen Time</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-purple-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-purple-600">${monthlyScreenTime.toFixed(0)}h</div>
            <div class="text-xs text-gray-600">Monthly Total</div>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-blue-600">${(yearlyScreenTime/365/24*365).toFixed(0)} days</div>
            <div class="text-xs text-gray-600">Yearly Total</div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-green-600">${phonePickups}</div>
            <div class="text-xs text-gray-600">Daily Pickups</div>
          </div>
          <div class="bg-orange-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-orange-600">${notifications}</div>
            <div class="text-xs text-gray-600">Daily Notifications</div>
          </div>
        </div>

        <div class="bg-indigo-50 p-4 rounded-lg">
          <h4 class="font-semibold text-indigo-700 mb-2">📱 Usage Patterns:</h4>
          <div class="text-sm space-y-2">
            <div><strong>Peak Usage:</strong> ${peakTimeText[peakTime]}</div>
            <div><strong>Top Category:</strong> ${categoryText[topAppCategory]} (${topCategoryTime}h/day)</div>
            <div><strong>Weekend Pattern:</strong> ${weekendDiff === 'higher' ? 'Higher' : weekendDiff === 'lower' ? 'Lower' : 'Same'} ${diffAmount > 0 ? `by ${diffAmount}h` : ''}</div>
            <div><strong>Phone Frequency:</strong> Every ${(16*60/phonePickups).toFixed(0)} minutes</div>
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg">
          <h4 class="font-semibold text-yellow-700 mb-2">⏰ Time Perspective:</h4>
          <div class="text-sm space-y-1">
            <div>• You spend <strong>${((avgScreenTime/16)*100).toFixed(0)}%</strong> of waking hours on screens</div>
            <div>• That's <strong>${(yearlyScreenTime/24).toFixed(0)} full days</strong> per year</div>
            <div>• Over 10 years: <strong>${(yearlyScreenTime/24*10/365).toFixed(1)} years</strong> of screen time</div>
          </div>
        </div>

        ${insights.length > 0 ? `
        <div class="bg-red-50 p-4 rounded-lg">
          <h4 class="font-semibold text-red-700 mb-2">🎯 Pattern Insights:</h4>
          <ul class="text-sm text-gray-700 space-y-1">
            ${insights.map(insight => `<li>• ${insight}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;

    setResultsHTML(results);
  };

  const assessDigitalHabits = () => {
    const habitScore = parseInt(morningCheck) + parseInt(eatingDevices) + parseInt(phoneAnxiety) + parseInt(bedtimeUsage) + parseInt(multitasking);

    let habitLevel = 'Excellent';
    let habitColor = 'text-green-600';
    let habitDescription = 'You have very healthy digital habits!';

    if (habitScore >= 15) {
      habitLevel = 'Concerning';
      habitColor = 'text-red-600';
      habitDescription = 'Your digital habits may be negatively impacting your wellbeing.';
    } else if (habitScore >= 10) {
      habitLevel = 'Moderate';
      habitColor = 'text-orange-600';
      habitDescription = 'You have room for improvement in your digital habits.';
    } else if (habitScore >= 5) {
      habitLevel = 'Good';
      habitColor = 'text-blue-600';
      habitDescription = 'You have generally healthy digital habits with minor areas to improve.';
    }

    let sleepAnalysis = 'Good sleep patterns';
    if (actualSleep < 6) {
      sleepAnalysis = 'Sleep duration is below recommended levels';
    } else if (actualSleep > 9) {
      sleepAnalysis = 'Sleep duration is higher than average';
    }

    if (sleepQuality < 5) {
      sleepAnalysis += ' with poor sleep quality';
    } else if (sleepQuality >= 8) {
      sleepAnalysis += ' with excellent sleep quality';
    }

    const goalRecommendations: any = {
      'reduce': ['Use app time limits', 'Create phone-free zones', 'Replace screen time with offline activities'],
      'balance': ['Set work-life boundaries', 'Use "Do Not Disturb" mode', 'Take regular digital breaks'],
      'sleep': ['No screens 1hr before bed', 'Use blue light filters', 'Keep bedroom device-free'],
      'focus': ['Turn off non-essential notifications', 'Use focus modes', 'Practice single-tasking'],
      'social': ['Schedule device-free social time', 'Join offline activities', 'Limit social media usage'],
      'mindful': ['Practice digital mindfulness', 'Regular digital detox periods', 'Intentional device usage']
    };

    const habits = ['Never', 'Rarely', 'Sometimes', 'Usually/Most meals/Often', 'Always/Very often'];

    const results = `
      <div class="space-y-4">
        <div class="text-center">
          <h4 class="text-lg font-bold text-gray-800">Digital Habit Assessment</h4>
          <div class="text-2xl font-bold ${habitColor}">${habitLevel}</div>
          <div class="text-sm text-gray-600">${habitDescription}</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-indigo-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-indigo-600">${habitScore}/20</div>
            <div class="text-xs text-gray-600">Habit Score</div>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-blue-600">${sleepQuality}/10</div>
            <div class="text-xs text-gray-600">Sleep Quality</div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-green-600">${actualSleep}h</div>
            <div class="text-xs text-gray-600">Sleep Duration</div>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg text-center">
            <div class="text-lg font-semibold text-purple-600">${20-habitScore}/20</div>
            <div class="text-xs text-gray-600">Wellness Score</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-700 mb-2">🔍 Habit Breakdown:</h4>
          <div class="text-sm space-y-1">
            <div>Morning Phone Check: ${habits[parseInt(morningCheck)]}</div>
            <div>Device Use While Eating: ${habits[parseInt(eatingDevices)]}</div>
            <div>Phone Anxiety: ${habits[parseInt(phoneAnxiety)]}</div>
            <div>Bedtime Device Use: ${habits[parseInt(bedtimeUsage)]}</div>
            <div>Multi-screen Usage: ${habits[parseInt(multitasking)]}</div>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-700 mb-2">😴 Sleep Analysis:</h4>
          <p class="text-sm text-gray-700">${sleepAnalysis}</p>
          ${parseInt(bedtimeUsage) > 2 ? '<p class="text-sm text-red-600 mt-1">⚠️ Bedtime device usage may be affecting your sleep quality</p>' : ''}
        </div>

        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="font-semibold text-green-700 mb-2">🎯 Personalized Action Plan:</h4>
          <p class="text-sm text-gray-700 mb-2"><strong>Your goal:</strong> ${wellbeingGoal.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
          <ul class="text-sm text-gray-700 space-y-1">
            ${goalRecommendations[wellbeingGoal].map((rec: string) => `<li>• ${rec}</li>`).join('')}
            ${habitScore > 10 ? '<li>• Start with small changes and build gradually</li>' : ''}
            ${parseInt(phoneAnxiety) > 2 ? '<li>• Practice leaving your phone in another room occasionally</li>' : ''}
          </ul>
        </div>
      </div>
    `;

    setResultsHTML(results);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Digital Wellness Calculator
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Analyze your screen time and improve your digital wellbeing with personalized insights and recommendations for healthier technology usage.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            {/* Tab Navigation */}
            <div className="flex mb-4 md:mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('daily')}
                className={`flex-1 py-2 px-2 md:px-3 rounded-md font-medium transition-all text-xs md:text-sm ${
                  activeTab === 'daily' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-white'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`flex-1 py-2 px-2 md:px-3 rounded-md font-medium transition-all text-xs md:text-sm ${
                  activeTab === 'weekly' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-white'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setActiveTab('habits')}
                className={`flex-1 py-2 px-2 md:px-3 rounded-md font-medium transition-all text-xs md:text-sm ${
                  activeTab === 'habits' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-white'
                }`}
              >
                Habits
              </button>
            </div>

            {/* Daily Usage Tab */}
            {activeTab === 'daily' && (
              <div>
                <h3 className="text-base md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Daily Screen Time Tracking</h3>

                <div className="space-y-3 md:space-y-4">
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                    <h4 className="text-sm md:text-base font-semibold text-blue-700 mb-2">📱 Mobile Devices</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Usage (hours)</label>
                        <input
                          type="number"
                          value={phoneHours}
                          onChange={(e) => setPhoneHours(parseFloat(e.target.value) || 0)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tablet Usage (hours)</label>
                        <input
                          type="number"
                          value={tabletHours}
                          onChange={(e) => setTabletHours(parseFloat(e.target.value) || 0)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                    <h4 className="text-sm md:text-base font-semibold text-green-700 mb-2">💻 Computer Usage</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Computer (hours)</label>
                        <input
                          type="number"
                          value={workComputer}
                          onChange={(e) => setWorkComputer(parseFloat(e.target.value) || 0)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Computer (hours)</label>
                        <input
                          type="number"
                          value={personalComputer}
                          onChange={(e) => setPersonalComputer(parseFloat(e.target.value) || 0)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 md:p-4 rounded-lg">
                    <h4 className="text-sm md:text-base font-semibold text-purple-700 mb-2">📺 Entertainment Screens</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TV/Streaming (hours)</label>
                        <input
                          type="number"
                          value={tvHours}
                          onChange={(e) => setTvHours(parseFloat(e.target.value) || 0)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gaming (hours)</label>
                        <input
                          type="number"
                          value={gamingHours}
                          onChange={(e) => setGamingHours(parseFloat(e.target.value) || 0)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
                    <input
                      type="number"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(parseFloat(e.target.value) || 8)}
                      step="0.5"
                      min="4"
                      max="12"
                      placeholder="7.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Analysis Tab */}
            {activeTab === 'weekly' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Screen Time Analysis</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Daily Screen Time (hours)</label>
                    <input
                      type="number"
                      value={avgScreenTime}
                      onChange={(e) => setAvgScreenTime(parseFloat(e.target.value) || 0)}
                      step="0.5"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weekend vs Weekday Difference</label>
                      <select
                        value={weekendDiff}
                        onChange={(e) => setWeekendDiff(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="higher">Higher on weekends</option>
                        <option value="lower">Lower on weekends</option>
                        <option value="same">About the same</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difference Amount (hours)</label>
                      <input
                        type="number"
                        value={diffAmount}
                        onChange={(e) => setDiffAmount(parseFloat(e.target.value) || 0)}
                        step="0.5"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-700 mb-2">📊 Usage Patterns</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peak Usage Time</label>
                        <select
                          value={peakTime}
                          onChange={(e) => setPeakTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="morning">Morning (6AM-12PM)</option>
                          <option value="afternoon">Afternoon (12PM-6PM)</option>
                          <option value="evening">Evening (6PM-12AM)</option>
                          <option value="night">Night (12AM-6AM)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Most Used App Category</label>
                        <select
                          value={topAppCategory}
                          onChange={(e) => setTopAppCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="social">Social Media</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="productivity">Productivity</option>
                          <option value="games">Games</option>
                          <option value="news">News</option>
                          <option value="communication">Communication</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Spent on Top Category (hours/day)</label>
                        <input
                          type="number"
                          value={topCategoryTime}
                          onChange={(e) => setTopCategoryTime(parseFloat(e.target.value) || 0)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Pickups/Day</label>
                      <input
                        type="number"
                        value={phonePickups}
                        onChange={(e) => setPhonePickups(parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notifications/Day</label>
                      <input
                        type="number"
                        value={notifications}
                        onChange={(e) => setNotifications(parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={calculateWeeklyAnalysis}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition duration-200 font-medium mt-6"
                >
                  Analyze Weekly Patterns
                </button>
              </div>
            )}

            {/* Digital Habits Tab */}
            {activeTab === 'habits' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Digital Habit Assessment</h3>

                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-700 mb-3">📝 Habit Questions</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">How often do you check your phone first thing in the morning?</label>
                        <select
                          value={morningCheck}
                          onChange={(e) => setMorningCheck(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="4">Always (within 5 minutes)</option>
                          <option value="3">Usually (within 30 minutes)</option>
                          <option value="2">Sometimes (within 1 hour)</option>
                          <option value="1">Rarely</option>
                          <option value="0">Never</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you use devices while eating meals?</label>
                        <select
                          value={eatingDevices}
                          onChange={(e) => setEatingDevices(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="4">Always</option>
                          <option value="3">Most meals</option>
                          <option value="2">Sometimes</option>
                          <option value="1">Rarely</option>
                          <option value="0">Never</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">How often do you feel anxious when you can't access your phone?</label>
                        <select
                          value={phoneAnxiety}
                          onChange={(e) => setPhoneAnxiety(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="4">Very often</option>
                          <option value="3">Often</option>
                          <option value="2">Sometimes</option>
                          <option value="1">Rarely</option>
                          <option value="0">Never</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you use devices within 1 hour before bedtime?</label>
                        <select
                          value={bedtimeUsage}
                          onChange={(e) => setBedtimeUsage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="4">Always</option>
                          <option value="3">Usually</option>
                          <option value="2">Sometimes</option>
                          <option value="1">Rarely</option>
                          <option value="0">Never</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">How often do you multitask with multiple screens?</label>
                        <select
                          value={multitasking}
                          onChange={(e) => setMultitasking(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="4">Very often</option>
                          <option value="3">Often</option>
                          <option value="2">Sometimes</option>
                          <option value="1">Rarely</option>
                          <option value="0">Never</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours of sleep last night</label>
                      <input
                        type="number"
                        value={actualSleep}
                        onChange={(e) => setActualSleep(parseFloat(e.target.value) || 7)}
                        step="0.5"
                        min="3"
                        max="12"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sleep quality (1-10)</label>
                      <input
                        type="range"
                        value={sleepQuality}
                        onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Poor</span>
                        <span>{sleepQuality}</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overall digital wellbeing goal</label>
                    <select
                      value={wellbeingGoal}
                      onChange={(e) => setWellbeingGoal(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="reduce">Reduce overall screen time</option>
                      <option value="balance">Better work-life balance</option>
                      <option value="sleep">Improve sleep quality</option>
                      <option value="focus">Increase focus and productivity</option>
                      <option value="social">More face-to-face social interaction</option>
                      <option value="mindful">More mindful technology use</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={assessDigitalHabits}
                  className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition duration-200 font-medium mt-6"
                >
                  Assess Digital Habits
                </button>
              </div>
            )}

            {/* Results Panel - Mobile only */}
            <div className="lg:hidden mt-6">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Digital Wellness Results</h3>
                <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: resultsHTML }} />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel - Desktop only */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Digital Wellness Results</h3>
            <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: resultsHTML }} />
          </div>
        </div>
      </div>

      {/* Digital Wellness Tips */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-green-200">
        <h3 className="text-xl font-bold text-green-700 mb-4">🌱 Digital Wellness Tips</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">•</span>
            <p><strong>Digital Sunset:</strong> Stop using devices 1 hour before bedtime for better sleep.</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-600 font-bold">•</span>
            <p><strong>20-20-20 Rule:</strong> Every 20 minutes, look at something 20 feet away for 20 seconds.</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-bold">•</span>
            <p><strong>Phone-Free Zones:</strong> Keep bedrooms and dining areas device-free.</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-600 font-bold">•</span>
            <p><strong>Notification Batching:</strong> Check messages at specific times instead of constantly.</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-indigo-600 font-bold">•</span>
            <p><strong>Digital Sabbath:</strong> Take regular breaks from all digital devices.</p>
          </div>
        </div>
      </div>

      {/* Screen Time Guidelines */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-orange-200">
        <h3 className="text-xl font-bold text-orange-700 mb-4">⏰ Recommended Screen Time</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span><strong className="text-blue-600">Recreational (Adults):</strong></span>
            <span className="text-gray-600">2-3 hours/day</span>
          </div>
          <div className="flex justify-between">
            <span><strong className="text-green-600">Work Computer:</strong></span>
            <span className="text-gray-600">Take breaks every hour</span>
          </div>
          <div className="flex justify-between">
            <span><strong className="text-purple-600">Social Media:</strong></span>
            <span className="text-gray-600">30-60 minutes/day</span>
          </div>
          <div className="flex justify-between">
            <span><strong className="text-orange-600">Phone Pickups:</strong></span>
            <span className="text-gray-600">Less than 50/day</span>
          </div>
          <div className="flex justify-between">
            <span><strong className="text-red-600">Before Bed:</strong></span>
            <span className="text-gray-600">0 hours (stop 1hr before)</span>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Digital Wellness: The Science Behind Healthy Screen Time</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6 text-gray-700">
          <p className="text-lg">
            In our increasingly connected world, managing digital device usage has become essential for physical health, mental wellbeing, and quality of life. Understanding the science behind screen time effects empowers informed decisions about technology use.
          </p>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">The Neuroscience of Screen Addiction</h3>
            <p className="mb-3">
              Digital devices exploit fundamental brain reward pathways through variable ratio reinforcement schedules—the most powerful behavior maintenance mechanism known to psychology. Social media notifications, new messages, and content updates arrive unpredictably, triggering dopamine release in the nucleus accumbens (brain's reward center) each time we check our devices.
            </p>
            <p>
              This dopamine-driven checking behavior becomes habitual and automatic—research shows the average person checks their phone 96 times daily (every 10 minutes during waking hours). The anticipation of reward (Will I have new messages? Likes? Updates?) creates a compulsion to check even when no notification appeared. Over time, dopamine receptor downregulation occurs, requiring increasingly frequent checking to achieve the same satisfaction—the neurological basis of digital addiction.
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Health Impacts of Excessive Screen Time</h3>
            <p className="mb-3">
              Research documents multiple health consequences from excessive recreational screen use (&gt;4-5 hours daily):
            </p>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li><strong>Mental Health:</strong> 13-18% increased depression/anxiety risk per additional daily hour of social media use in young adults. Mechanisms include upward social comparison, FOMO, cyberbullying, and displacement of face-to-face interaction.</li>
              <li><strong>Sleep Disruption:</strong> Blue light (400-490nm wavelength) suppresses melatonin by 23% after 2 hours of evening tablet use, delaying sleep onset 60-90 minutes. Mental stimulation from content maintains alertness when the brain should transition to sleep.</li>
              <li><strong>Digital Eye Strain:</strong> Affects 50-90% of screen workers. Reduced blink rate (from 15-20 to 5-7 blinks/minute) causes dry eyes. Sustained near focus fatigues ciliary muscles. Glare and poor posture contribute to headaches and neck pain.</li>
              <li><strong>Cardiovascular Risk:</strong> Each additional 2 hours daily of recreational screen time increases cardiovascular disease risk by 15% through sedentary behavior displacing physical activity.</li>
              <li><strong>Metabolic Effects:</strong> Screen time correlates with obesity through reduced energy expenditure and increased mindless eating during viewing.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Evidence-Based Digital Wellness Strategies</h3>
            <p className="mb-3">
              Achieving digital wellness requires both reducing harmful screen time and implementing protective behaviors:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800 mb-2">Time Boundaries</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Limit recreational screen time to 2-3 hours daily</li>
                  <li>No screens 1 hour before bedtime (digital sunset)</li>
                  <li>Phone-free zones: bedroom, dining table, bathroom</li>
                  <li>Use app timers and daily limits (Screen Time, Digital Wellbeing)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Behavioral Modifications</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Turn off all non-essential notifications</li>
                  <li>Remove social media apps; use browser versions</li>
                  <li>Grayscale mode reduces dopamine-triggering colors</li>
                  <li>Charge phone outside bedroom overnight</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Eye Health Protection</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>20-20-20 rule: Every 20 minutes, look 20 feet away for 20 seconds</li>
                  <li>Position screens 20-26 inches away, top at eye level</li>
                  <li>Adjust brightness to match ambient lighting</li>
                  <li>Blink consciously; use artificial tears if needed</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Replacement Activities</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Physical activity and outdoor time</li>
                  <li>Face-to-face social interaction</li>
                  <li>Reading physical books</li>
                  <li>Hobbies requiring hands (crafts, instruments, sports)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Building a Sustainable Digital Wellness Practice</h3>
            <p className="mb-3">
              Long-term behavior change requires gradual implementation and environmental design rather than willpower alone:
            </p>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li><strong>Awareness Phase (Week 1-2):</strong> Track screen time without judgment. Notice patterns, triggers, and automatic behaviors. Most users underestimate actual usage by 50%.</li>
              <li><strong>Environmental Design (Week 3-4):</strong> Remove apps from home screen, disable notifications, establish phone-free charging stations. Make undesired behaviors harder, desired behaviors easier.</li>
              <li><strong>Replacement Building (Week 5-8):</strong> Identify screen time triggers (boredom, anxiety, transitions) and develop alternative responses. Keep replacement activities accessible (book where phone used to be).</li>
              <li><strong>Gradual Reduction (Week 9-12):</strong> Reduce screen time 10% weekly using app limits until reaching 2-3 hour recreational target. Focus on passive/mindless use first.</li>
              <li><strong>Maintenance (Ongoing):</strong> Review weekly usage, troubleshoot setbacks, update strategies as needed. Balance is goal—intentional use, not elimination.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <FirebaseFAQs pageId="digital-wellness-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
