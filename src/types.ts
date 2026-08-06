export type UserRole = 'student' | 'doctor' | 'instructor' | 'admin';

export type PlanType = 'free' | 'standard_batch' | 'premium_intensive' | 'genesis_pro';

export interface Plan {
  id: PlanType;
  name: string;
  tagline: string;
  priceBDT: number;
  billingPeriod: 'monthly' | 'one_time' | 'yearly';
  features: string[];
  popular?: boolean;
  color: string;
}

export interface ClinicalLogEntry {
  id: string;
  patientCaseTitle: string;
  specialty: string;
  date: string;
  diagnosisNotes: string;
  status: 'Completed' | 'Under Review' | 'Verified';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  targetExam: string; // e.g. "FCPS Part-1 Medicine", "Residency Exam", "BCS Health"
  batchName: string;
  plan: PlanType;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  studyStreakDays: number;
  totalStudyHours: number;
  
  // Doctor specific fields
  bmdcRegNumber?: string;
  hospitalAffiliation?: string;
  cmeCredits?: number;
  clinicalLogEntries?: ClinicalLogEntry[];

  // Authentication & Security Verification
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  jwtToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  
  // Instructor specific fields
  bio?: string;
  specialization?: string;
  createdCourseIds?: string[];
  totalStudentsTaught?: number;
  totalRevenueBDT?: number;
  instructorRating?: number;
}

export interface LectureSheet {
  id: string;
  title: string;
  downloadUrl?: string;
  contentMarkdown: string;
}

export type LessonType = 
  | 'video' 
  | 'pdf' 
  | 'ppt' 
  | 'audio' 
  | 'live_class' 
  | 'recorded_class' 
  | 'assignment' 
  | 'quiz';

export interface PPTSlide {
  slideNumber: number;
  title: string;
  content: string[];
  notes?: string;
  imageUrl?: string;
}

export interface LiveClassDetails {
  scheduledAt: string;
  instructorName: string;
  platform: 'Zoom' | 'Genesis WebRTC Stream' | 'YouTube Live';
  meetingId: string;
  isLiveNow?: boolean;
  streamUrl?: string;
  attendeesCount?: number;
}

export interface AssignmentDetails {
  caseTitle: string;
  instructions: string;
  dueDate: string;
  maxMarks: number;
  submitted?: boolean;
  submissionText?: string;
  submissionFileName?: string;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  status?: 'Pending' | 'Under Review' | 'Graded';
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g. "45 mins"
  type?: LessonType;
  videoUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  summary: string;
  lectureSheet?: LectureSheet;
  isFreePreview?: boolean;
  pptSlides?: PPTSlide[];
  liveClassDetails?: LiveClassDetails;
  assignmentDetails?: AssignmentDetails;
  quizQuestions?: Question[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentId: string;
  issueDate: string;
  verificationCode: string;
  instructorName: string;
  bmdcRegNumber?: string;
  grade?: string;
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: 'Medical FCPS/Residency' | 'Basic Science' | 'BCS Health' | 'General Medical' | 'Clinical Skills';
  description: string;
  thumbnail: string;
  instructorId?: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  requiredPlan: PlanType;
  priceBDT?: number;
  totalEnrolled: number;
  rating: number;
  modules: Module[];
  tags: string[];
  durationTotal: string;
  totalMcqs: number;
  isFeatured?: boolean;
  isApproved?: boolean;
}

export type QuestionType = 'sba' | 'true_false' | 'mcq';

export interface Question {
  id: string;
  text: string; // Question stem
  type: QuestionType;
  options: string[]; // Options (For SBA/MCQ: 4-5 options. For true_false: 5 stems/statements)
  correctAnswer: number | boolean[]; // Correct Answer (For SBA/MCQ: index. For true_false: array of 5 booleans)
  explanation: string; // Explanation
  referenceBook?: string; // Reference (e.g., Davidson Medicine 24th Ed p. 412)
  difficulty: 'Easy' | 'Medium' | 'Hard'; // Difficulty
  image?: string; // Image (Diagram/ECG/Clinical photo URL)
  tags?: string[]; // Tags (e.g., ['FCPS-Part1', 'ECG', 'Medicine', 'HighYield'])
  previousExam?: string; // Previous Exam (e.g., "FCPS Part-1 July 2024", "BSMMU Residency Jan 2023")
  author?: string; // Author (e.g., "Dr. Shahriar Rahman, FCPS", "Genesis Academic Board")
  status?: 'Published' | 'Draft' | 'In Review' | 'Archived'; // Status

  // 6-Level FCPS Question Bank Taxonomy:
  // Faculty -> Subject -> Module -> Chapter -> Topic -> Question
  faculty?: string;     // e.g. "Faculty of Medicine & Allied", "Faculty of Surgery & Allied"
  subject?: string;     // e.g. "Internal Medicine", "Physiology", "Pathology"
  moduleName?: string;  // e.g. "Cardiovascular System", "Renal Physiology"
  chapter?: string;     // e.g. "Ischemic Heart Disease & Heart Failure", "Acid-Base Balance"
  topic: string;        // e.g. "JVP Waves & Cardiac Cycle"
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId?: string;
  category: string;
  mode?: 'practice' | 'exam'; // Practice Mode (instant explanation) vs Exam Mode (timed + test rules)
  durationMinutes: number;
  totalMarks: number;
  negativeMarkPerWrong: number; // e.g. 0.25 or 0.5
  passPercentage: number;
  questions: Question[];
  planRequired: PlanType;
  isScheduled?: boolean;
  scheduledTime?: string;
  totalAttempts?: number;
  averageScore?: number;
  subject?: string;
  topic?: string;
  isCustom?: boolean;
  isPreviousYear?: boolean;
}

export interface StudentAnswer {
  questionId: string;
  selectedOption?: number; // for SBA
  selectedTrueFalse?: boolean[]; // for true_false (5 elements)
  isCorrect?: boolean;
  marksObtained: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  totalTimeSpentSeconds: number;
  answers: Record<string, StudentAnswer>; // questionId -> answer
  rankInBatch?: number;
  totalCandidates?: number;
  percentile?: number; // e.g. 96.4th percentile
  mode?: 'practice' | 'exam';
}

export interface SubjectAnalytics {
  subject: string;
  totalQuestionsAttempted: number;
  correctCount: number;
  accuracyPercentage: number;
}
