import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import {
  User as UserIcon,
  GraduationCap,
  Mail,
  Building,
  Calendar,
  Save,
  LogOut,
  RotateCcw,
  CheckCircle2,
  BookmarkCheck,
  BookOpen,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateProfile,
    logout,
    resetToDefaultData,
    subjects,
    sessions,
    tasks,
  } = useStudy();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [course, setCourse] = useState(user?.course || '');
  const [college, setCollege] = useState(user?.college || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      course: course.trim(),
      college: college.trim(),
      semester: semester.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (
      confirm(
        'Reset all subjects, study plans, and tasks to the default college demo dataset?'
      )
    ) {
      resetToDefaultData();
      alert('Sample dataset restored successfully!');
    }
  };

  const totalStudyMinutes = sessions
    .filter((s) => s.status === 'Completed')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.isCompleted).length,
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserIcon className="w-6 h-6 text-blue-600" />
          Student Profile & Academic Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, enrolled degree course, and institution information.
        </p>
      </div>

      {/* Main Student Card & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Avatar Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center border-4 border-white shadow-xs">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>

          <h2 className="text-base font-bold text-slate-900 mt-3">{user?.fullName || 'Guest Student'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

          <div className="w-full mt-4 pt-4 border-t border-slate-100 space-y-2 text-left text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{user?.course || 'Computer Science'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Building className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{user?.college || 'College of Engineering'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Joined: {user?.joinDate || 'Jan 2026'}</span>
            </div>
          </div>

          <button
            id="profile-logout-btn"
            onClick={logout}
            className="mt-6 w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Right 2 cols: Edit Profile Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic & Personal Information</h3>
              <p className="text-xs text-slate-500">Update your student profile attributes</p>
            </div>
            {isSaved && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree / Program
                </label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Semester / Year
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Institution Name
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="submit"
                id="save-profile-btn"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Profile Details
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Academic Lifetime Activity Summary */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Account Activity Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">Subjects Tracked</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{subjects.length}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">Topics Mastered</span>
            <p className="text-2xl font-bold text-indigo-700 mt-1">
              {completedTopics} / {totalTopics}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">Study Hours Logged</span>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {(totalStudyMinutes / 60).toFixed(1)}h
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">Tasks Completed</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {tasks.filter((t) => t.status === 'Completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Demo & Data Management Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Reset to Sample College Data
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Restore sample CS courses, study sessions, and upcoming assignments for demonstration.
          </p>
        </div>

        <button
          id="reset-demo-data-btn"
          onClick={handleReset}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
