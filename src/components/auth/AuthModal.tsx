import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useStudy } from '../../context/StudyContext';
import { GraduationCap, LogIn, UserPlus, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, loginAsGuest, register } = useStudy();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science & Engineering');
  const [college, setCollege] = useState('Metropolitan Institute of Technology');
  const [semester, setSemester] = useState('4th Semester');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        return;
      }
      const res = login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Login failed.');
      }
    } else {
      if (!fullName.trim() || !email.trim() || !password.trim() || !course.trim() || !college.trim()) {
        setError('All fields are required for registration.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
      register({
        fullName,
        email,
        course,
        college,
        semester,
      });
      onClose();
    }
  };

  const handleFillDemo = () => {
    setEmail('guest.student@studyease.edu');
    setPassword('student123');
    setError(null);
  };

  const handleTryForFree = () => {
    setError(null);
    loginAsGuest();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Student Sign In' : 'Create Student Account'}
      maxWidth="md"
    >
      <div className="space-y-5">
        <div className="text-center pb-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-900">
            {mode === 'login' ? 'Welcome to StudyEase' : 'Join StudyEase Planner'}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'login'
              ? 'Enter your student credentials or try for free with instant guest access'
              : 'Register to manage subjects, track syllabus, and organize study sessions'}
          </p>
        </div>

        {/* Try for Free Instant Access Banner */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Instant Guest Mode</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Free
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Want to test StudyEase right away without entering credentials?
          </p>
          <button
            type="button"
            id="try-for-free-instant-btn"
            onClick={handleTryForFree}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Try for Free (Instant Access)
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
            or sign in with credentials
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course / Degree <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech CSE / B.Sc IT"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester / Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4th Semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Engineering College"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Dashboard
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register Student Account
              </>
            )}
          </button>
        </form>

        {mode === 'login' && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              id="demo-fill-btn"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fill Demo Credentials
            </button>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                id="switch-to-register-btn"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                id="switch-to-login-btn"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
