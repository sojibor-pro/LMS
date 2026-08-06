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

export const DEMO_STUDENT: User = {
  id: 'usr_student_880',
  name: 'Sajid Islam (Medical Student)',
  email: 'sajid.student@genesis-lms.bd',
  phone: '+880 1712-345678',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  targetExam: 'FCPS Part-1 (Medicine & Allied)',
  batchName: 'Genesis Intensive July 2026 Batch',
  plan: 'premium_intensive',
  enrolledCourseIds: ['crs_fcps_med', 'crs_basic_physio', 'crs_clinical_surgery'],
  completedLessonIds: ['lsn_101', 'lsn_102'],
  studyStreakDays: 14,
  totalStudyHours: 42.5,
};

export const DEMO_DOCTOR: User = {
  id: 'usr_doc_991',
  name: 'Dr. Shahriar Rahman, MBBS',
  email: 'shahriar.md@dmc.edu.bd',
  phone: '+880 1819-876543',
  role: 'doctor',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
  targetExam: 'FCPS Part-1 / MD Cardiology Residency',
  batchName: 'Doctor Special Clinical Cohort',
  plan: 'genesis_pro',
  enrolledCourseIds: ['crs_fcps_med', 'crs_clinical_surgery'],
  completedLessonIds: ['lsn_101', 'lsn_102', 'lsn_201'],
  studyStreakDays: 28,
  totalStudyHours: 96.0,
  bmdcRegNumber: 'A-88492 (BMDC)',
  hospitalAffiliation: 'Dhaka Medical College & Hospital (DMCH)',
  cmeCredits: 45,
  clinicalLogEntries: [
    {
      id: 'log_1',
      patientCaseTitle: 'Acute Anterior Wall STEMI with Ventricular Ectopics',
      specialty: 'Cardiology',
      date: '2026-08-01',
      diagnosisNotes: 'Thrombolysed with Streptokinase within 2h. Post-lysis ECG showed >50% ST resolution.',
      status: 'Verified',
    },
    {
      id: 'log_2',
      patientCaseTitle: 'Diabetic Ketoacidosis (DKA) Management Protocol',
      specialty: 'Endocrinology',
      date: '2026-08-03',
      diagnosisNotes: 'Regular Insulin fluid resuscitation + K+ correction. Anion gap closed in 14 hours.',
      status: 'Completed',
    },
    {
      id: 'log_3',
      patientCaseTitle: 'Refractory Ascites in Decompensated Cirrhosis',
      specialty: 'Gastroenterology',
      date: '2026-08-05',
      diagnosisNotes: 'Diagnostic paracentesis performed. SAAG > 1.1 g/dL. Albumin replacement initiated.',
      status: 'Under Review',
    },
  ],
};

export const DEMO_INSTRUCTOR: User = {
  id: 'usr_inst_501',
  name: 'Prof. Dr. M. A. Jalil',
  email: 'prof.jalil@genesis-lms.bd',
  phone: '+880 1911-001122',
  role: 'instructor',
  avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
  targetExam: 'Faculty Specialist & Course Author',
  batchName: 'Genesis Senior Faculty Board',
  plan: 'genesis_pro',
  enrolledCourseIds: [],
  completedLessonIds: [],
  studyStreakDays: 45,
  totalStudyHours: 120,
  bio: 'Ex-Professor BSMMU with over 18 years of experience in FCPS Part-1 & MD/MS entrance mentoring.',
  specialization: 'Cardiology & Clinical Medicine',
  createdCourseIds: ['crs_fcps_med'],
  totalStudentsTaught: 1420,
  totalRevenueBDT: 3550000, // 3,550,000 BDT
  instructorRating: 4.9,
};

export const DEMO_ADMIN: User = {
  id: 'usr_admin_001',
  name: 'Genesis Platform Administrator',
  email: 'admin@genesis-lms.bd',
  phone: '+880 1700-000000',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
  targetExam: 'Full Platform Access Controller',
  batchName: 'System Core Management',
  plan: 'genesis_pro',
  enrolledCourseIds: [],
  completedLessonIds: [],
  studyStreakDays: 100,
  totalStudyHours: 500,
};

export const DEMO_USER: User = DEMO_STUDENT;

export const MOCK_USERS: User[] = [
  DEMO_STUDENT,
  DEMO_DOCTOR,
  DEMO_INSTRUCTOR,
  DEMO_ADMIN,
  {
    id: 'usr_std_102',
    name: 'Dr. Nusrat Parveen',
    email: 'nusrat.p@gmail.com',
    phone: '+880 1755-112233',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a933f38936?auto=format&fit=crop&w=200&q=80',
    targetExam: 'FCPS Surgery',
    batchName: 'Surgery Intensive 2026',
    plan: 'standard_batch',
    enrolledCourseIds: ['crs_clinical_surgery'],
    completedLessonIds: [],
    studyStreakDays: 5,
    totalStudyHours: 18,
  },
  {
    id: 'usr_doc_103',
    name: 'Dr. Tanvir Ahmed, MS',
    email: 'tanvir.surgery@bsmmu.edu.bd',
    phone: '+880 1811-998877',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    targetExam: 'MS Surgery Trainee',
    batchName: 'Surgical Residency Group',
    plan: 'genesis_pro',
    enrolledCourseIds: ['crs_clinical_surgery'],
    completedLessonIds: [],
    studyStreakDays: 12,
    totalStudyHours: 54,
    bmdcRegNumber: 'A-77312 (BMDC)',
    hospitalAffiliation: 'BSMMU Super Specialized Hospital',
    cmeCredits: 60,
  },
];

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
        faculty: 'Faculty of Medicine & Allied',
        subject: 'Internal Medicine',
        moduleName: 'Cardiovascular System',
        chapter: 'Cardiac Physiology & Hemodynamics',
        topic: 'JVP Waves & Cardiac Cycle',
        difficulty: 'Medium',
        referenceBook: 'Ganong Physiology 26th Ed / Davidson Medicine p. 488',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        tags: ['FCPS-Part1', 'JVP', 'Cardiology', 'HighYield', 'Physiology'],
        previousExam: 'FCPS Part-1 July 2024 (Medicine)',
        author: 'Dr. Shahriar Rahman, FCPS',
        status: 'Published',
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
        faculty: 'Faculty of Medicine & Allied',
        subject: 'Internal Medicine',
        moduleName: 'Cardiovascular System',
        chapter: 'Ischemic Heart Disease & Myocardial Infarction',
        topic: 'Acute Coronary Syndrome & ECG Leads',
        difficulty: 'Medium',
        referenceBook: 'Davidson\'s Principles and Practice of Medicine 24th Ed p. 520',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
        tags: ['FCPS-Part1', 'ECG', 'STEMI', 'RCA', 'Cardiology'],
        previousExam: 'FCPS Part-1 Jan 2023 / BSMMU Residency 2022',
        author: 'Prof. Dr. A. K. M. Fazlul Haque',
        status: 'Published',
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
        faculty: 'Faculty of Basic Medical Sciences',
        subject: 'Physiology',
        moduleName: 'Renal & Urinary System',
        chapter: 'Fluid, Electrolyte & Acid-Base Balance',
        topic: 'Acid-Base Balance & Electrolyte Disorders',
        difficulty: 'Easy',
        referenceBook: 'Guyton Physiology & Harrison Medicine p. 1920',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
        tags: ['Nephrology', 'Hyperkalemia', 'Electrolytes', 'BasicScience'],
        previousExam: 'BSMMU Residency March 2024',
        author: 'Dr. Nusrat Jahan, M.D.',
        status: 'Published',
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
        faculty: 'Faculty of Medicine & Allied',
        subject: 'Internal Medicine',
        moduleName: 'Renal & Urinary System',
        chapter: 'Acute Kidney Injury & Electrolyte Derangements',
        topic: 'Acid-Base Balance & Electrolyte Disorders',
        difficulty: 'Medium',
        referenceBook: 'Genesis High Yield ECG Handout / Marriott ECG p. 112',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&auto=format&fit=crop&q=80',
        tags: ['ECG', 'Hyperkalemia', 'Renal', 'FCPS-Part1'],
        previousExam: 'FCPS Part-1 July 2023',
        author: 'Dr. Shahriar Rahman, FCPS',
        status: 'Published',
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
        faculty: 'Faculty of Medicine & Allied',
        subject: 'Internal Medicine',
        moduleName: 'Endocrinology & Metabolism',
        chapter: 'Thyroid Disorders',
        topic: 'Hypothyroidism & Autoimmune Thyroiditis',
        difficulty: 'Medium',
        referenceBook: 'Davidson Medicine 24th Ed p. 642',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        tags: ['Endocrinology', 'Thyroid', 'Hashimoto', 'FCPS-Medicine'],
        previousExam: 'FCPS Part-1 Jan 2024 (Medicine)',
        author: 'Genesis Academic Committee',
        status: 'Published',
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
        faculty: 'Faculty of Basic Medical Sciences',
        subject: 'Physiology',
        moduleName: 'Cardiovascular Physiology',
        chapter: 'Heart Sounds & Cardiac Cycle',
        topic: 'Physiology',
        difficulty: 'Easy',
        referenceBook: 'Ganong Physiology p. 521',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
        tags: ['Physiology', 'S1', 'HeartSounds'],
        previousExam: 'FCPS Part-1 July 2022',
        author: 'Dr. Shahriar Rahman, FCPS',
        status: 'Published',
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
        faculty: 'Faculty of Basic Medical Sciences',
        subject: 'Anatomy',
        moduleName: 'Neuroanatomy & Skull Base',
        chapter: 'Cranial Foramina & Nerves',
        topic: 'Gross Anatomy',
        difficulty: 'Medium',
        referenceBook: 'BD Chaurasia Human Anatomy Vol 3 p. 188',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
        tags: ['Anatomy', 'ForamenMagnum', 'Neuroanatomy'],
        previousExam: 'BSMMU Residency Nov 2023',
        author: 'Dr. Tanvir Ahmed, M.S.',
        status: 'Published',
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
