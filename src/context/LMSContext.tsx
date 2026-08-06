import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Exam, ExamSubmission, Question } from '../types';
import { MOCK_COURSES, MOCK_EXAMS } from '../data/mockData';

interface LMSContextType {
  courses: Course[];
  exams: Exam[];
  submissions: ExamSubmission[];
  bookmarkedQuestionIds: string[];
  addCourse: (course: Course) => void;
  addExam: (exam: Exam) => void;
  addQuestionToExam: (examId: string, question: Question) => void;
  saveSubmission: (submission: ExamSubmission) => void;
  toggleBookmarkQuestion: (questionId: string) => void;
  getSubmissionForExam: (examId: string) => ExamSubmission | undefined;
  getCourseById: (courseId: string) => Course | undefined;
  getExamById: (examId: string) => Exam | undefined;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('genesis_lms_courses');
    return saved ? JSON.parse(saved) : MOCK_COURSES;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('genesis_lms_exams');
    return saved ? JSON.parse(saved) : MOCK_EXAMS;
  });

  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    const saved = localStorage.getItem('genesis_lms_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('genesis_lms_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('genesis_lms_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('genesis_lms_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('genesis_lms_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('genesis_lms_bookmarks', JSON.stringify(bookmarkedQuestionIds));
  }, [bookmarkedQuestionIds]);

  const addCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const addExam = (newExam: Exam) => {
    setExams((prev) => [newExam, ...prev]);
  };

  const addQuestionToExam = (examId: string, newQuestion: Question) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id === examId || (!examId && e.id === prev[0]?.id)) {
          return {
            ...e,
            questions: [newQuestion, ...e.questions],
          };
        }
        return e;
      })
    );
  };

  const saveSubmission = (sub: ExamSubmission) => {
    setSubmissions((prev) => [sub, ...prev.filter((s) => s.id !== sub.id)]);
  };

  const toggleBookmarkQuestion = (qId: string) => {
    setBookmarkedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const getSubmissionForExam = (examId: string) => {
    return submissions.find((s) => s.examId === examId);
  };

  const getCourseById = (id: string) => {
    return courses.find((c) => c.id === id || c.slug === id);
  };

  const getExamById = (id: string) => {
    return exams.find((e) => e.id === id);
  };

  return (
    <LMSContext.Provider
      value={{
        courses,
        exams,
        submissions,
        bookmarkedQuestionIds,
        addCourse,
        addExam,
        addQuestionToExam,
        saveSubmission,
        toggleBookmarkQuestion,
        getSubmissionForExam,
        getCourseById,
        getExamById,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
