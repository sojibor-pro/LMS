import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PlanType } from '../types';
import { DEMO_USER } from '../data/mockData';

interface AuthContextType {
  user: User;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  upgradePlan: (plan: PlanType) => void;
  enrollInCourse: (courseId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('genesis_lms_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  useEffect(() => {
    localStorage.setItem('genesis_lms_user', JSON.stringify(user));
  }, [user]);

  const switchRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const upgradePlan = (plan: PlanType) => {
    setUser((prev) => ({ ...prev, plan }));
  };

  const enrollInCourse = (courseId: string) => {
    setUser((prev) => {
      if (prev.enrolledCourseIds.includes(courseId)) return prev;
      return {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      };
    });
  };

  const markLessonComplete = (lessonId: string) => {
    setUser((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const updated = exists
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      return {
        ...prev,
        completedLessonIds: updated,
      };
    });
  };

  const updateProfile = (updatedData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: true,
        switchRole,
        upgradePlan,
        enrollInCourse,
        markLessonComplete,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
