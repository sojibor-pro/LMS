export type UserRole = 'student' | 'admin';

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
}

export interface LectureSheet {
  id: string;
  title: string;
  downloadUrl?: string;
  contentMarkdown: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g. "45 mins"
  videoUrl: string;
  summary: string;
  lectureSheet?: LectureSheet;
  isFreePreview?: boolean;
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
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  requiredPlan: PlanType;
  totalEnrolled: number;
  rating: number;
  modules: Module[];
  tags: string[];
  durationTotal: string;
  totalMcqs: number;
  isFeatured?: boolean;
}

export type QuestionType = 'sba' | 'true_false' | 'mcq';

export interface Question {
  id: string;
  text: string; // Main question stem
  type: QuestionType;
  options: string[]; // For SBA/MCQ: 4 options. For true_false: 5 stems/statements
  correctAnswer: number | boolean[]; // For SBA/MCQ: index (0-3). For true_false: array of 5 booleans [true, false, true, false, true]
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  referenceBook?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId?: string;
  category: string;
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
}

export interface SubjectAnalytics {
  subject: string;
  totalQuestionsAttempted: number;
  correctCount: number;
  accuracyPercentage: number;
}
