import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PlanType } from '../types';
import {
  DEMO_STUDENT,
  DEMO_DOCTOR,
  DEMO_INSTRUCTOR,
  DEMO_ADMIN,
  MOCK_USERS
} from '../data/mockData';

interface AuthContextType {
  user: User;
  allUsers: User[];
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string) => boolean;
  loginWithGoogle: () => void;
  registerUser: (newUser: Partial<User> & { name: string; email: string; role: UserRole }) => void;
  upgradePlan: (plan: PlanType) => void;
  enrollInCourse: (courseId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  verifyOTP: (code: string) => boolean;
  verifyEmail: () => void;
  refreshJwtToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('genesis_lms_all_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('genesis_lms_user');
    return saved ? JSON.parse(saved) : DEMO_STUDENT;
  });

  useEffect(() => {
    localStorage.setItem('genesis_lms_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('genesis_lms_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const switchRole = (role: UserRole) => {
    let targetDemo: User = DEMO_STUDENT;
    if (role === 'doctor') targetDemo = DEMO_DOCTOR;
    if (role === 'instructor') targetDemo = DEMO_INSTRUCTOR;
    if (role === 'admin') targetDemo = DEMO_ADMIN;

    setUser(targetDemo);
  };

  const loginUser = (email: string): boolean => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      const loggedUser: User = {
        ...found,
        jwtToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI${found.id}_jwt`,
        refreshToken: `ref_${Date.now()}_token`,
        tokenExpiresAt: expiresAt,
      };
      setUser(loggedUser);
      setAllUsers((list) => list.map((u) => (u.id === found.id ? loggedUser : u)));
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      ...DEMO_DOCTOR,
      id: `usr_google_${Date.now()}`,
      name: 'Dr. Shahriar Rahman (Google)',
      email: 'sajibar.me@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      jwtToken: `eyJhbGciOiJIUzI1NiJ9.google_oauth_${Date.now()}`,
      refreshToken: `google_refresh_${Date.now()}`,
      tokenExpiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    };
    setUser(googleUser);
    setAllUsers((prev) => [googleUser, ...prev]);
  };

  const verifyOTP = (code: string): boolean => {
    if (code.trim().length === 6) {
      setUser((prev) => {
        const updated = { ...prev, isPhoneVerified: true, isEmailVerified: true };
        setAllUsers((list) => list.map((u) => (u.id === prev.id ? updated : u)));
        return updated;
      });
      return true;
    }
    return false;
  };

  const verifyEmail = () => {
    setUser((prev) => {
      const updated = { ...prev, isEmailVerified: true };
      setAllUsers((list) => list.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  const refreshJwtToken = () => {
    const newExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    setUser((prev) => {
      const updated = {
        ...prev,
        jwtToken: `eyJhbGciOiJIUzI1NiJ9.refreshed_${Date.now()}`,
        refreshToken: `ref_${Date.now()}_new_token`,
        tokenExpiresAt: newExpiresAt,
      };
      setAllUsers((list) => list.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  const registerUser = (data: Partial<User> & { name: string; email: string; role: UserRole }) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+880 1700-112233',
      role: data.role,
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      targetExam: data.targetExam || (data.role === 'doctor' ? 'FCPS Part-1 Medical Practitioner' : 'Medical Degree'),
      batchName: data.batchName || (data.role === 'instructor' ? 'Genesis Registered Instructor' : 'Genesis Registered Batch 2026'),
      plan: 'free',
      enrolledCourseIds: [],
      completedLessonIds: [],
      studyStreakDays: 1,
      totalStudyHours: 0,
      bmdcRegNumber: data.bmdcRegNumber || (data.role === 'doctor' ? 'A-90123 (BMDC)' : undefined),
      hospitalAffiliation: data.hospitalAffiliation || (data.role === 'doctor' ? 'Medical College Hospital' : undefined),
      bio: data.bio || (data.role === 'instructor' ? 'Medical Faculty Specialist' : undefined),
      specialization: data.specialization || (data.role === 'instructor' ? 'Basic & Clinical Medical Sciences' : undefined),
      createdCourseIds: [],
      totalStudentsTaught: 0,
      totalRevenueBDT: 0,
      instructorRating: 5.0,
      cmeCredits: data.role === 'doctor' ? 10 : 0,
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setUser(newUser);
  };

  const upgradePlan = (plan: PlanType) => {
    setUser((prev) => {
      const updated = { ...prev, plan };
      setAllUsers((list) => list.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  const enrollInCourse = (courseId: string) => {
    setUser((prev) => {
      if (prev.enrolledCourseIds.includes(courseId)) return prev;
      const updated = {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      };
      setAllUsers((list) => list.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  const markLessonComplete = (lessonId: string) => {
    setUser((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const updatedList = exists
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      const updatedUser = { ...prev, completedLessonIds: updatedList };
      setAllUsers((list) => list.map((u) => (u.id === prev.id ? updatedUser : u)));
      return updatedUser;
    });
  };

  const updateProfile = (updatedData: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      setAllUsers((list) => list.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        isLoggedIn: true,
        switchRole,
        loginUser,
        loginWithGoogle,
        registerUser,
        upgradePlan,
        enrollInCourse,
        markLessonComplete,
        updateProfile,
        verifyOTP,
        verifyEmail,
        refreshJwtToken,
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
