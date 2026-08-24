import React from 'react';
import { useStudy } from '../../context/StudyContext';
import {
  TrendingUp,
  Clock,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Flame,
  Target,
  CalendarCheck,
  Award,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { subjects, sessions, tasks } = useStudy();

  // 1. Overall Topics Calculation
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.isCompleted).length,
    0
  );
  const overallProgressPercentage =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // 2. Study Hours Calculation
  const totalCompletedHours = Number(
    subjects.reduce((acc, s) => acc + s.completedHours, 0).toFixed(1)
  );
  const totalTargetHours = subjects.reduce((acc, s) => acc + s.targetHours, 0);
  const hoursPercentage =
    totalTargetHours > 0
      ? Math.min(100, Math.round((totalCompletedHours / totalTargetHours) * 100))
      : 0;

  // 3. Tasks Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 4. Study Sessions Metrics
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === 'Completed').length;
  const sessionCompletionRate =
    totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Academic Progress & Learning Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review curriculum completion, study hour targets, and coursework velocity.
        </p>
      </div>

      {/* Top 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Syllabus */}
        <div id="metric-kpi-syllabus" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Syllabus Mastered
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900">{overallProgressPercentage}%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {completedTopics} of {totalTopics} total topics completed
            </p>
          </div>
        </div>

        {/* Study Hours Target */}
        <div id="metric-kpi-hours" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Study Hours Logged
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900">{totalCompletedHours}h</p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${hoursPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Goal: {totalTargetHours}h ({hoursPercentage}% target achieved)
            </p>
          </div>
        </div>

        {/* Study Session Completion Rate */}
        <div id="metric-kpi-sessions" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Study Sessions Rate
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-indigo-700">{sessionCompletionRate}%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${sessionCompletionRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {completedSessions} of {totalSessions} study blocks fulfilled
            </p>
          </div>
        </div>

        {/* Task Completion Rate */}
        <div id="metric-kpi-tasks" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assignments Cleared
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-emerald-700">{taskCompletionRate}%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {completedTasks} of {totalTasks} academic tasks submitted ({pendingTasks} pending)
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Subject Progress Breakdown & Study Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Per-Subject Detailed Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Per-Subject Progress Breakdown</h2>
              <p className="text-xs text-slate-500">Curriculum coverage and hours per course</p>
            </div>
            <span className="text-xs text-slate-500 font-semibold font-mono">
              {subjects.length} Subjects
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {subjects.map((sub) => {
              const subCompleted = sub.topics.filter((t) => t.isCompleted).length;
              const subTotal = sub.topics.length;
              const subPct = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;
              const subHoursPct =
                sub.targetHours > 0
                  ? Math.min(100, Math.round((sub.completedHours / sub.targetHours) * 100))
                  : 0;

              return (
                <div
                  key={sub.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: sub.color || '#2563eb' }}
                      />
                      <h4 className="text-sm font-bold text-slate-900">
                        {sub.name} <span className="text-slate-400 font-normal">({sub.code})</span>
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {subPct}% Done
                    </span>
                  </div>

                  {/* Topics Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <span>Syllabus Topics</span>
                      <span>
                        {subCompleted} / {subTotal} topics
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${subPct}%`,
                          backgroundColor: sub.color || '#2563eb',
                        }}
                      />
                    </div>
                  </div>

                  {/* Hours Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <span>Study Hours</span>
                      <span>
                        {sub.completedHours}h logged / {sub.targetHours}h goal ({subHoursPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-700 transition-all duration-300"
                        style={{ width: `${subHoursPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hours Distribution & Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs p-6 flex flex-col space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Hours Invested by Subject
            </h3>
            <p className="text-xs text-slate-500">Distribution of logged study hours</p>
          </div>

          <div className="flex-1 flex flex-col justify-between pt-2">
            {subjects.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">
                No subjects registered yet.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Horizontal Stack Bars */}
                <div className="space-y-3 pt-2">
                  {subjects.map((sub) => {
                    const maxHours = Math.max(...subjects.map((s) => s.targetHours), 1);
                    const barWidth = Math.min(100, Math.round((sub.completedHours / maxHours) * 100));

                    return (
                      <div key={sub.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800 truncate max-w-[170px]">
                            {sub.name}
                          </span>
                          <span className="font-bold text-slate-900">{sub.completedHours} hrs</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-md overflow-hidden">
                          <div
                            className="h-full rounded-md transition-all duration-300"
                            style={{
                              width: `${Math.max(4, barWidth)}%`,
                              backgroundColor: sub.color || '#2563eb',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Academic Milestone summary */}
                <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                    <Award className="w-4 h-4 text-blue-600" />
                    Semester Milestones
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    You have mastered <strong>{completedTopics}</strong> topics across{' '}
                    <strong>{subjects.length}</strong> core courses. Keep maintaining consistent daily
                    study sessions to reach your semester target!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
