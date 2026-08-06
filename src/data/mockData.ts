import { Plan, Course, Exam, User } from '../types';

export const MOCK_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Trial Plan',
    tagline: 'Access free preview lectures and sample model tests',
    priceBDT: 0,
    billingPeriod: 'monthly',
    color: 'emerald',
    features: [
      'Access to 5 Free Video Lectures',
      '1 Weekly Sample Model Test',
      'Basic Performance Report',
      'Standard Discussion Forum'
    ]
  },
  {
    id: 'standard_batch',
    name: 'Standard Batch Plan',
    tagline: 'Full course lectures, lecture sheets & subject-wise exam series',
    priceBDT: 2500,
    billingPeriod: 'monthly',
    color: 'blue',
    popular: true,
    features: [
      'Access to All Enrolled Course Lectures',
      'Downloadable PDF Lecture Sheets',
      'Subject-wise Practice Question Banks (SBA & True/False)',
      'Weekly Batch Model Tests with Live Rank list',
      'AI Tutor Assistant for Exam Questions',
      'Telegram/Whatsapp Mentor Study Group'
    ]
  },
  {
    id: 'premium_intensive',
    name: 'Genesis Intensive FCPS Batch',
    tagline: 'Complete FCPS / Residency / FPS Exam Preparation package',
    priceBDT: 6500,
    billingPeriod: 'one_time',
    color: 'purple',
    features: [
      'Unrestricted Access to All Medical & Clinical Courses',
      'High-Yield Genesis Lecture Sheets & Printed Handouts',
      '50+ Full-Length FCPS Style Model Tests with Timer',
      'Multi-Stem True/False + SBA Exam Engine',
      'Personalized Weakness Radar & Analytics',
      '1-on-1 Faculty Mentorship & Mock Viva Sessions',
      'Certificate of Program Completion'
    ]
  },
  {
    id: 'genesis_pro',
    name: 'Genesis Pro All-Access',
    tagline: 'Ultimate 1-Year Pass for FCPS, Residency, Diploma & BCS Health',
    priceBDT: 12000,
    billingPeriod: 'yearly',
    color: 'amber',
    features: [
      'All-Access to Every Course, Exam Bank & Future Batches',
      'Unlimited AI Exam Question Set Generator',
      'Real-time Rank & Percentile Analytics',
      'Priority Doubt Clearance with Specialist Doctors',
      'Hardcover Lecture Sheet Delivery to Home'
    ]
  }
];

export const DEMO_USER: User = {
  id: 'usr_8801700123',
  name: 'Dr. Shahriar Rahman',
  email: 'shahriar.med@genesis-lms.bd',
  phone: '+880 1712-345678',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
  targetExam: 'FCPS Part-1 (Medicine & Allied)',
  batchName: 'Genesis Intensive July 2026 Batch',
  plan: 'premium_intensive',
  enrolledCourseIds: ['crs_fcps_med', 'crs_basic_physio', 'crs_clinical_surgery'],
  completedLessonIds: ['lsn_101', 'lsn_102'],
  studyStreakDays: 14,
  totalStudyHours: 42.5,
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_fcps_med',
    title: 'FCPS Part-1 Medicine & Allied Complete Masterclass',
    slug: 'fcps-part1-medicine-masterclass',
    category: 'Medical FCPS/Residency',
    description: 'Comprehensive high-yield preparation course covering Physiology, Pathology, Pharmacology, and Clinical Medicine according to BCPS curriculum and Genesis exam patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Prof. Dr. M. A. Jalil',
    instructorTitle: 'FCPS (Medicine), MD (Cardiology), Ex-Prof. BSMMU',
    instructorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    requiredPlan: 'standard_batch',
    totalEnrolled: 1420,
    rating: 4.9,
    tags: ['FCPS Part-1', 'Medicine', 'Cardiology', 'Endocrinology', 'BCPS'],
    durationTotal: '38 Hours',
    totalMcqs: 1250,
    isFeatured: true,
    modules: [
      {
        id: 'mod_cardio',
        title: 'Module 1: Cardiovascular System (Physiology & Pathology)',
        duration: '10 Hours',
        lessons: [
          {
            id: 'lsn_101',
            title: 'Cardiac Cycle, Heart Sounds & JVP Dynamics',
            duration: '45 mins',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Embed placeholder
            isFreePreview: true,
            summary: `### Core High-Yield Topics:
1. **Cardiac Cycle Phases**: Isovolumetric contraction, Rapid ejection, Isovolumetric relaxation, Rapid ventricular filling.
2. **Jugular Venous Pulse (JVP)**:
   - **'a' wave**: Atrial contraction (absent in Atrial Fibrillation, giant in Tricuspid Stenosis / Pulmonary HTN).
   - **'c' wave**: Tricuspid valve bulging during ventricular contraction.
   - **'v' wave**: Venous filling against closed tricuspid valve (large cannon wave in Tricuspid Regurgitation).
3. **Heart Sounds**: S1 (closure of AV valves), S2 (closure of semilunar valves A2/P2 splitting).
   - **Physiological Splitting**: Increases during inspiration due to increased venous return.
   - **Paradoxical Splitting**: Seen in LBBB, Severe Aortic Stenosis.`,
            lectureSheet: {
              id: 'sheet_cardio_1',
              title: 'Cardiology High-Yield Genesis PDF Handout',
              downloadUrl: '#',
              contentMarkdown: `# High-Yield Genesis Cardiology Summary
- **Main Exam Focus**: Distinguishing Systolic vs Diastolic Murmurs.
- **Aortic Stenosis**: Crescendo-decrescendo ejection systolic murmur radiating to carotids.
- **Mitral Regurgitation**: Pan-systolic murmur radiating to axilla.
- **Infective Endocarditis**: Duke Criteria (Major: Positive blood cultures & Echocardiogram evidence).`
            }
          },
          {
            id: 'lsn_102',
            title: 'Ischemic Heart Disease (IHD) & ECG Masterclass',
            duration: '55 mins',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            summary: `### ECG Interpretation Rules for Exams:
1. **ST Elevation**: STEMI (>1mm in limb leads, >2mm in chest leads V2-V3).
2. **Anterior Wall MI**: V1-V4 (LAD occlusion).
3. **Inferior Wall MI**: II, III, aVF (RCA occlusion) - *Check V4R for RV Infarction! Avoid Nitrates!*
4. **Lateral Wall MI**: I, aVL, V5-V6 (LCX or Diagonal).`,
            lectureSheet: {
              id: 'sheet_cardio_2',
              title: 'ECG High-Yield Genesis Exam Sheet',
              downloadUrl: '#',
              contentMarkdown: `# Genesis ECG Flash Notes
- Hyperkalemia: Tall tented T waves, prolonged PR, widened QRS, sine wave.
- Hypokalemia: U waves, flattened T waves, ST depression.
- Digoxin Toxicity: Reverse tick ST depression, AV block with PAT.`
            }
          }
        ]
      },
      {
        id: 'mod_endocrine',
        title: 'Module 2: Endocrinology & Metabolic Disorders',
        duration: '12 Hours',
        lessons: [
          {
            id: 'lsn_201',
            title: 'Thyroid Function Tests & Autoimmune Thyroiditis',
            duration: '50 mins',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            summary: `### High-Yield Thyroid Tables:
- **Graves Disease**: TSH <0.01, Free T4 High, Anti-TSHR positive, Diffuse radioiodine uptake.
- **Hashimoto Thyroiditis**: TSH High, Anti-TPO positive, lymphocytic infiltration on FNAC.
- **Subacute Granulomatous (De Quervain)**: Painful thyroid gland, high ESR, low radioiodine uptake.`
          }
        ]
      }
    ]
  },
  {
    id: 'crs_basic_physio',
    title: 'Basic Medical Science: Physiology & Biochemistry',
    slug: 'basic-medical-science-physiology',
    category: 'Basic Science',
    description: 'Foundation course for First Year MBBS, FCPS Part-1, and Residency aspirants focusing on Ganong & Guyton core concepts.',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Dr. Nusrat Jahan',
    instructorTitle: 'MD (Physiology), M.Phil',
    instructorAvatar: 'https://images.unsplash.com/photo-1594824813566-78a933f38936?auto=format&fit=crop&w=200&q=80',
    requiredPlan: 'free',
    totalEnrolled: 2890,
    rating: 4.8,
    tags: ['Physiology', 'Renal', 'Neurophysiology', 'Guyton'],
    durationTotal: '24 Hours',
    totalMcqs: 800,
    isFeatured: true,
    modules: [
      {
        id: 'mod_renal',
        title: 'Renal Physiology & Acid-Base Balance',
        duration: '6 Hours',
        lessons: [
          {
            id: 'lsn_301',
            title: 'Glomerular Filtration Rate (GFR) & Tubular Reabsorption',
            duration: '40 mins',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFreePreview: true,
            summary: `### GFR Determinants:
- GFR = Kf × Net Filtration Pressure [(PGC - PBC) - (πGC - πBC)].
- Efferent arteriole constriction increases GFR (at moderate levels) via Angiotensin II.`
          }
        ]
      }
    ]
  },
  {
    id: 'crs_clinical_surgery',
    title: 'FCPS Part-1 Surgery & General Anatomy Special',
    slug: 'fcps-surgery-anatomy-special',
    category: 'Clinical Skills',
    description: 'High-yield surgery lecture series covering Bailey & Love surgery concepts, Surgical Pathology, and Regional Gross Anatomy.',
    thumbnail: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    instructorName: 'Dr. Tanvir Ahmed',
    instructorTitle: 'FCPS (Surgery), MS (General Surgery)',
    instructorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    requiredPlan: 'standard_batch',
    totalEnrolled: 980,
    rating: 4.95,
    tags: ['FCPS Surgery', 'Bailey & Love', 'Anatomy'],
    durationTotal: '32 Hours',
    totalMcqs: 950,
    modules: []
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exm_fcps_cardio_model_1',
    title: 'FCPS Part-1 Medicine: Cardiology & Physiology Model Test',
    description: 'FPS/Genesis Pattern Timed Exam with Single Best Answer (SBA) and Multi-Stem True/False Medical Questions. Includes 0.25 negative marking per wrong stem/choice.',
    category: 'FCPS Part-1 Medicine',
    durationMinutes: 30,
    totalMarks: 20,
    negativeMarkPerWrong: 0.25,
    passPercentage: 60,
    planRequired: 'standard_batch',
    totalAttempts: 1240,
    averageScore: 13.5,
    questions: [
      {
        id: 'q_tf_101',
        text: 'Regarding the Jugular Venous Pulse (JVP):',
        type: 'true_false',
        topic: 'Cardiology Physiology',
        difficulty: 'Medium',
        referenceBook: 'Ganong Physiology 26th Ed / Davidson Medicine',
        options: [
          'The "a" wave is produced by right ventricular contraction.',
          'Large cannon "a" waves are seen in complete heart block.',
          'Prominent "v" wave is characteristic of Tricuspid Regurgitation.',
          'The JVP falls during normal inspiration.',
          'Kussmaul sign refers to an abnormal rise in JVP during inspiration.'
        ],
        correctAnswer: [false, true, true, true, true],
        explanation: `### Detailed Explanation:
1. **a) False**: 'a' wave is caused by Right ATRIAL contraction (not ventricular).
2. **b) True**: Cannon 'a' waves occur when atrium contracts against closed tricuspid valve (Complete Heart Block, Ventricular Tachycardia).
3. **c) True**: Giant 'v' wave is caused by blood regurgitating into right atrium during ventricular systole in Tricuspid Regurgitation.
4. **d) True**: JVP normal drops in inspiration due to decreased intrathoracic pressure.
5. **e) True**: Kussmaul sign is failure of JVP to drop or a rise in JVP on inspiration (Constrictive Pericarditis, RV Infarction).`
      },
      {
        id: 'q_sba_102',
        text: 'A 55-year-old hypertensive male presents with crushing substernal chest pain radiating to left arm for 3 hours. ECG shows 3mm ST elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?',
        type: 'sba',
        topic: 'Cardiology / Acute Coronary Syndrome',
        difficulty: 'Medium',
        referenceBook: 'Davidson\'s Principles and Practice of Medicine',
        options: [
          'Left Anterior Descending Artery (LAD)',
          'Right Coronary Artery (RCA)',
          'Left Circumflex Artery (LCX)',
          'Left Main Coronary Artery (LMCA)'
        ],
        correctAnswer: 1, // index 1: Right Coronary Artery
        explanation: `### Correct Answer: Right Coronary Artery (RCA)
- Leads II, III, aVF view the **inferior wall** of the left ventricle.
- In 85-90% of individuals (right-dominant circulation), the inferior wall is supplied by the **Posterior Descending Artery (PDA)**, which branches off the **Right Coronary Artery (RCA)**.
- LAD supplies anterior wall (V1-V4).
- LCX supplies lateral wall (I, aVL, V5-V6).`
      },
      {
        id: 'q_tf_103',
        text: 'Causes of Hyperkalemia include:',
        type: 'true_false',
        topic: 'Endocrinology / Renal Physiology',
        difficulty: 'Easy',
        referenceBook: 'Guyton Physiology & Harrison Medicine',
        options: [
          'Acute Kidney Injury (AKI)',
          'ACE Inhibitors therapy',
          'Primary Hyperaldosteronism (Conn Syndrome)',
          'Insulin administration',
          'Rhabdomyolysis / Severe Tissue Trauma'
        ],
        correctAnswer: [true, true, false, false, true],
        explanation: `### Explanation:
- **AKI (True)**: Impaired renal potassium excretion leads to hyperkalemia.
- **ACE Inhibitors (True)**: Decreases Aldosterone production -> retains K+.
- **Conn Syndrome (False)**: Excess aldosterone causes Hypokalemia + HTN.
- **Insulin (False)**: Insulin shifts K+ INTO cells, causing Hypokalemia.
- **Rhabdomyolysis (True)**: Massive intracellular release of K+ from damaged muscle cells.`
      },
      {
        id: 'q_sba_104',
        text: 'Which of the following ECG changes is the EARLIEST indicator of acute hyperkalemia?',
        type: 'sba',
        topic: 'Electrolyte & ECG',
        difficulty: 'Medium',
        referenceBook: 'Genesis High Yield ECG Handout',
        options: [
          'Widened QRS complex',
          'Prolonged PR interval',
          'Tall, narrow, symmetrical "tented" T waves',
          'Sine wave pattern'
        ],
        correctAnswer: 2,
        explanation: `### Correct Answer: Tall, narrow, symmetrical "tented" T waves
- Earliest ECG sign of Hyperkalemia (Serum K+ > 5.5 mEq/L) is tall peaked T waves best seen in precordial leads.
- As K+ rises higher (>6.5): PR prolongation, loss of P wave, wide QRS, and ultimately Sine Wave -> Ventricular Fibrillation/Asystole.`
      },
      {
        id: 'q_sba_105',
        text: 'A 28-year-old female presents with fatigue, cold intolerance, weight gain, and constipation. Laboratory investigation reveals TSH = 18.5 mIU/L (High) and Free T4 = 4.2 pmol/L (Low). Which antibody is most specific for diagnosing the underlying etiology?',
        type: 'sba',
        topic: 'Endocrinology',
        difficulty: 'Medium',
        referenceBook: 'Davidson Medicine 24th Ed',
        options: [
          'Anti-Thyroid Peroxidase (Anti-TPO) Antibody',
          'Anti-TSH Receptor (TRAb) Antibody',
          'Anti-Nuclear Antibody (ANA)',
          'Anti-Smooth Muscle Antibody (ASMA)'
        ],
        correctAnswer: 0,
        explanation: `### Correct Answer: Anti-Thyroid Peroxidase (Anti-TPO) Antibody
- The patient has primary hypothyroidism, most commonly caused by Hashimoto Thyroiditis in young females.
- Anti-TPO (and Anti-Thyroglobulin) antibodies are present in >90% of Hashimoto cases.
- Anti-TSH Receptor antibodies (TRAb) are characteristic of Graves Disease (hyperthyroidism).`
      }
    ]
  },
  {
    id: 'exm_basic_science_grand',
    title: 'Basic Science Grand Model Test 2026 (Anatomy, Physiology & Pathology)',
    description: 'Genesis FPS Standard 50-Mark Comprehensive Test covering basic medical sciences for MBBS & FCPS candidates.',
    category: 'Basic Science',
    durationMinutes: 45,
    totalMarks: 30,
    negativeMarkPerWrong: 0.25,
    passPercentage: 65,
    planRequired: 'free',
    totalAttempts: 3410,
    averageScore: 18.2,
    questions: [
      {
        id: 'q_sba_201',
        text: 'In the cardiac cycle, the first heart sound (S1) is primarily caused by:',
        type: 'sba',
        topic: 'Physiology',
        difficulty: 'Easy',
        options: [
          'Closure of Aortic and Pulmonary valves',
          'Closure of Mitral and Tricuspid valves',
          'Rapid ventricular filling in early diastole',
          'Atrial contraction in late diastole'
        ],
        correctAnswer: 1,
        explanation: `S1 is produced by closure of Atrioventricular (AV) valves - Mitral & Tricuspid - at the beginning of ventricular systole.`
      },
      {
        id: 'q_tf_202',
        text: 'Structures passing through the Foramen Magnum include:',
        type: 'true_false',
        topic: 'Gross Anatomy',
        difficulty: 'Medium',
        options: [
          'Medulla Oblongata and its membranes',
          'Vertebral Arteries',
          'Spinal root of Accessory Nerve (CN XI)',
          'Hypoglossal Nerve (CN XII)',
          'Anterior and Posterior Spinal Arteries'
        ],
        correctAnswer: [true, true, true, false, true],
        explanation: `Hypoglossal nerve (CN XII) passes through the Hypoglossal canal, NOT the foramen magnum!`
      }
    ]
  }
];
