import React from 'react';
import { useStudy } from '../../context/StudyContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  CheckSquare,
  Flame,
  BookmarkCheck,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddSession: () => void;
  onOpenAddTask: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddSession,
  onOpenAddTask,
}) => {
  const {
    user,
    subjects,
    sessions,
    tasks,
    toggleSessionStatus,
    toggleTaskStatus,
    setActiveTab,
  } = useStudy();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  // Overall syllabus / study progress calculation
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.isCompleted).length,
    0
  );
  const overallProgressPercentage =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Total study hours
  const totalCompletedHours = subjects.reduce((acc, s) => acc + s.completedHours, 0);
  const totalTargetHours = subjects.reduce((acc, s) => acc + s.targetHours, 0);

  // Upcoming tasks (sorted by due date, pending first)
  const upcomingTasks = [...tasks]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getDeadlineStatus = (dueDate: string, status: string) => {
    if (status === 'Completed') {
      return { label: 'Completed', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
    const today = new Date(todayStr).getTime();
    const due = new Date(dueDate).getTime();
    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Overdue', color: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' };
    }
    if (diffDays === 0) {
      return { label: 'Due Today', color: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold' };
    }
    if (diffDays === 1) {
      return { label: 'Due Tomorrow', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    }
    if (diffDays <= 3) {
      return { label: `In ${diffDays} days`, color: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
    }
    return { label: `Due ${dueDate}`, color: 'bg-slate-50 text-slate-600 border-slate-200' };
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Student Workspace
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs text-slate-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Welcome, {user?.fullName || 'Guest Student'}!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {user?.course ? `${user.course} (${user.semester || 'Semester 4'})` : 'Plan, track and master your academic coursework'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="dash-add-session-btn"
            onClick={onOpenAddSession}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Study Session
          </button>
          <button
            id="dash-add-task-btn"
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          <button
            id="dash-view-planner-btn"
            onClick={() => setActiveTab('planner')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            Study Planner
          </button>
        </div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Subjects Count */}
        <div
          id="stat-card-subjects"
          onClick={() => setActiveTab('subjects')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Subjects</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{subjects.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{totalTopics} topics tracked</p>
        </div>

        {/* Topics Mastered */}
        <div
          id="stat-card-topics-mastered"
          onClick={() => setActiveTab('subjects')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Mastered</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookmarkCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{completedTopics}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">of {totalTopics} syllabus topics</p>
        </div>

        {/* Study Hours */}
        <div
          id="stat-card-study-hours"
          onClick={() => setActiveTab('planner')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Study Logged</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{totalCompletedHours}h</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Target: {totalTargetHours}h</p>
        </div>

        {/* Today's Tasks */}
        <div
          id="stat-card-today-tasks"
          onClick={() => setActiveTab('tasks')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today's Tasks</span>
            <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{todayTasks.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Due today</p>
        </div>

        {/* Completed Tasks */}
        <div
          id="stat-card-completed-tasks"
          onClick={() => setActiveTab('tasks')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completed</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{completedTasks}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{pendingTasks} pending</p>
        </div>

        {/* Overall Syllabus Progress */}
        <div
          id="stat-card-overall-progress"
          onClick={() => setActiveTab('progress')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Syllabus</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-2">{overallProgressPercentage}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${overallProgressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Today's Study Plan & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Study Plan (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Today's Study Plan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} planned for today
              </p>
            </div>
            <button
              id="dash-view-all-sessions-btn"
              onClick={() => setActiveTab('planner')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              View Full Planner <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-4 flex-1">
            {todaySessions.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No study sessions scheduled for today</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Schedule a focused study block to make progress on your curriculum.
                </p>
                <button
                  onClick={onOpenAddSession}
                  className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => {
                  const isCompleted = session.status === 'Completed';
                  return (
                    <div
                      key={session.id}
                      id={`dash-session-${session.id}`}
                      className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                        isCompleted
                          ? 'bg-slate-50 border-slate-200 opacity-75'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          id={`toggle-dash-session-${session.id}`}
                          onClick={() => toggleSessionStatus(session.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-blue-600 bg-white'
                          }`}
                          aria-label={isCompleted ? 'Mark pending' : 'Mark completed'}
                        >
                          {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-900">
                              {session.subjectName}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                session.priority === 'High'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : session.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {session.priority} Priority
                            </span>
                          </div>
                          <p
                            className={`text-xs mt-1 font-medium ${
                              isCompleted ? 'line-through text-slate-400' : 'text-slate-700'
                            }`}
                          >
                            {session.topic}
                          </p>
                          {session.notes && (
                            <p className="text-[11px] text-slate-500 mt-1 italic">
                              "{session.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {session.durationMinutes}m
                        </span>
                        {session.startTime && (
                          <p className="text-[11px] text-slate-400 mt-1">{session.startTime}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Upcoming Deadlines
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Tasks & assignment deadlines</p>
            </div>
            <button
              id="dash-view-all-tasks-btn"
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              All Tasks <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-4 flex-1">
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No deadlines on your radar</p>
                <p className="text-xs text-slate-500 mt-1">All assignments and tasks are cleared!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const isDone = task.status === 'Completed';
                  const deadline = getDeadlineStatus(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      id={`dash-task-${task.id}`}
                      className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                        isDone ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          id={`dash-toggle-task-${task.id}`}
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-0.5 w-4 h-4 rounded-sm flex items-center justify-center border transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-blue-600 bg-white'
                          }`}
                          aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {isDone && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <div>
                          <p
                            className={`text-xs font-medium ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                            <span>{task.subjectName}</span>
                            <span>&bull;</span>
                            <span className="text-slate-400">{task.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-medium inline-block ${deadline.color}`}
                        >
                          {deadline.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Subject Overview Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Enrolled Subjects Progress</h3>
            <p className="text-xs text-slate-500">Topics mastered vs remaining curriculum</p>
          </div>
          <button
            id="dash-manage-subjects-btn"
            onClick={() => setActiveTab('subjects')}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            Manage Subjects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((sub) => {
            const completed = sub.topics.filter((t) => t.isCompleted).length;
            const total = sub.topics.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={sub.id}
                onClick={() => setActiveTab('subjects')}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: sub.color || '#2563eb' }}
                    />
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
                      {sub.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{pct}%</span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: sub.color || '#2563eb',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>{completed}/{total} topics completed</span>
                  <span>{sub.completedHours}/{sub.targetHours} hrs logged</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
