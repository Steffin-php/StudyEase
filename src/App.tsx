import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Header } from './components/common/Header';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { PlannerView } from './components/planner/PlannerView';
import { TasksView } from './components/tasks/TasksView';
import { ProgressView } from './components/progress/ProgressView';
import { ProfileView } from './components/profile/ProfileView';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  CheckSquare,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, isLoggedIn, loginAsGuest } = useStudy();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Quick modals triggered from dashboard
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleOpenLogin = () => {
    setAuthInitialMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthInitialMode('register');
    setIsAuthModalOpen(true);
  };

  const handleTryForFree = () => {
    loginAsGuest();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      <Header onOpenAuth={handleOpenLogin} onTryForFree={handleTryForFree} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!isLoggedIn ? (
          /* Unauthenticated Clean Landing View */
          <div className="max-w-4xl mx-auto py-10 sm:py-16 space-y-12 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Student Academic Study Planner</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Plan. Learn. Track. Improve.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                A simple, realistic productivity and learning platform designed for college students.
                Organize curriculum subjects, schedule study sessions, stay ahead of assignment deadlines, and track your syllabus progress.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  id="landing-try-free-btn"
                  onClick={handleTryForFree}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Try for Free (Instant Access)
                </button>
                <button
                  id="landing-signin-btn"
                  onClick={handleOpenLogin}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  Sign In with Password
                </button>
                <button
                  id="landing-register-btn"
                  onClick={handleOpenRegister}
                  className="px-5 py-3 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Register Account &rarr;
                </button>
              </div>
            </div>

            {/* 4 Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-6">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Subject Management</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Track course syllabi, unit topics, and semester study targets with clear progress bars.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Study Planner</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Schedule daily focus blocks with priority levels, duration counters, and focus timers.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Task Deadlines</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Organize assignments, lab submissions, and exam dates with urgency alerts.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Progress Analytics</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Visualize study hours logged, topic completion rates, and weekly productivity streaks.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Active Tab View */
          <div>
            {activeTab === 'dashboard' && (
              <DashboardView
                onOpenAddSession={() => {
                  setActiveTab('planner');
                  setIsAddSessionModalOpen(true);
                }}
                onOpenAddTask={() => {
                  setActiveTab('tasks');
                  setIsAddTaskModalOpen(true);
                }}
              />
            )}
            {activeTab === 'subjects' && <SubjectsView />}
            {activeTab === 'planner' && (
              <PlannerView
                isAddModalOpenInitially={isAddSessionModalOpen}
                onCloseAddModal={() => setIsAddSessionModalOpen(false)}
              />
            )}
            {activeTab === 'tasks' && (
              <TasksView
                isAddModalOpenInitially={isAddTaskModalOpen}
                onCloseAddModal={() => setIsAddTaskModalOpen(false)}
              />
            )}
            {activeTab === 'progress' && <ProgressView />}
            {activeTab === 'profile' && <ProfileView />}
          </div>
        )}
      </main>

      {/* Clean, minimalist footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">StudyEase</span>
            <span>&bull;</span>
            <span>Plan. Learn. Track. Improve.</span>
          </div>
          <p className="text-slate-400">
            College Student Academic Study Planner System
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
      />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainAppContent />
    </StudyProvider>
  );
}
