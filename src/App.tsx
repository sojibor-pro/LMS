import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LMSProvider } from './context/LMSContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PlanSelectorModal } from './components/PlanSelectorModal';
import { ExamEngine } from './components/ExamEngine';
import { HomeView } from './views/HomeView';
import { CourseDetailView } from './views/CourseDetailView';
import { StudyView } from './views/StudyView';
import { ExamsView } from './views/ExamsView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';
import { Course, Lesson, Exam } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState<boolean>(false);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* If an active exam session is running, render the full-screen Exam Engine */}
      {activeExam ? (
        <ExamEngine exam={activeExam} onClose={() => setActiveExam(null)} />
      ) : (
        <>
          <Header
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              setCurrentTab(tab);
              setSelectedCourse(null);
              setSelectedLesson(null);
            }}
            onOpenPlanModal={() => setPlanModalOpen(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* If a video lesson is active */}
            {selectedLesson && selectedCourse ? (
              <StudyView
                course={selectedCourse}
                lesson={selectedLesson}
                onBack={() => setSelectedLesson(null)}
              />
            ) : selectedCourse ? (
              /* If a course detail overview is active */
              <CourseDetailView
                course={selectedCourse}
                onBack={() => setSelectedCourse(null)}
                onStartLesson={handleStartLesson}
                onOpenPlanModal={() => setPlanModalOpen(true)}
              />
            ) : (
              /* Tab Views */
              <>
                {currentTab === 'home' && (
                  <HomeView
                    onSelectCourse={handleSelectCourse}
                    onOpenExams={() => setCurrentTab('exams')}
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                  />
                )}

                {currentTab === 'exams' && (
                  <ExamsView
                    onStartExam={handleStartExam}
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                  />
                )}

                {currentTab === 'dashboard' && <DashboardView />}

                {currentTab === 'admin' && <AdminView />}
              </>
            )}
          </main>

          <Footer />

          {/* Subscription Plan Upgrade Modal */}
          <PlanSelectorModal
            isOpen={planModalOpen}
            onClose={() => setPlanModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LMSProvider>
        <MainApp />
      </LMSProvider>
    </AuthProvider>
  );
}
