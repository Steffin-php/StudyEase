import React, { useState, useEffect } from 'react';
import { useStudy } from '../../context/StudyContext';
import { StudySession, Priority, SessionStatus } from '../../types';
import { Modal } from '../common/Modal';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';

interface PlannerViewProps {
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const {
    subjects,
    sessions,
    addSession,
    editSession,
    deleteSession,
    toggleSessionStatus,
  } = useStudy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(isAddModalOpenInitially);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);

  // Focus Timer modal state
  const [timerSession, setTimerSession] = useState<StudySession | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [initialTimerMinutes, setInitialTimerMinutes] = useState(25);

  // Filters
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Form states
  const [formSubjectId, setFormSubjectId] = useState<string>(subjects[0]?.id || '');
  const [formTopic, setFormTopic] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('10:00');
  const [formDuration, setFormDuration] = useState(45);
  const [formPriority, setFormPriority] = useState<Priority>('Medium');
  const [formStatus, setFormStatus] = useState<SessionStatus>('Pending');
  const [formNotes, setFormNotes] = useState('');

  // Handle external modal trigger
  useEffect(() => {
    if (isAddModalOpenInitially) {
      setIsAddModalOpen(true);
    }
  }, [isAddModalOpenInitially]);

  // Focus Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Auto complete if desired
      if (timerSession) {
        if (timerSession.status === 'Pending') {
          toggleSessionStatus(timerSession.id);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, timerSession, toggleSessionStatus]);

  const openAddModal = () => {
    setFormSubjectId(subjects[0]?.id || '');
    setFormTopic('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStartTime('10:00');
    setFormDuration(45);
    setFormPriority('Medium');
    setFormStatus('Pending');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (sess: StudySession) => {
    setEditingSession(sess);
    setFormSubjectId(sess.subjectId);
    setFormTopic(sess.topic);
    setFormDate(sess.date);
    setFormStartTime(sess.startTime);
    setFormDuration(sess.durationMinutes);
    setFormPriority(sess.priority);
    setFormStatus(sess.status);
    setFormNotes(sess.notes || '');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSub = subjects.find((s) => s.id === formSubjectId);
    if (!selectedSub || !formTopic.trim()) return;

    addSession({
      subjectId: selectedSub.id,
      subjectName: selectedSub.name,
      topic: formTopic.trim(),
      date: formDate,
      startTime: formStartTime,
      durationMinutes: Number(formDuration) || 30,
      priority: formPriority,
      status: formStatus,
      notes: formNotes.trim(),
    });

    setIsAddModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    const selectedSub = subjects.find((s) => s.id === formSubjectId);

    editSession(editingSession.id, {
      subjectId: formSubjectId,
      subjectName: selectedSub ? selectedSub.name : editingSession.subjectName,
      topic: formTopic.trim(),
      date: formDate,
      startTime: formStartTime,
      durationMinutes: Number(formDuration) || 30,
      priority: formPriority,
      status: formStatus,
      notes: formNotes.trim(),
    });

    setEditingSession(null);
  };

  const startFocusTimer = (sess: StudySession, minutes: number = 25) => {
    setTimerSession(sess);
    setInitialTimerMinutes(minutes);
    setTimerSecondsLeft(minutes * 60);
    setIsTimerRunning(true);
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (filterSubjectId !== 'all' && s.subjectId !== filterSubjectId) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (filterPriority !== 'all' && s.priority !== filterPriority) return false;
    return true;
  });

  // Group by date category (Today, Tomorrow, Upcoming, Past)
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const todayList = filteredSessions.filter((s) => s.date === todayStr);
  const tomorrowList = filteredSessions.filter((s) => s.date === tomorrowStr);
  const upcomingList = filteredSessions
    .filter((s) => s.date > tomorrowStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastList = filteredSessions
    .filter((s) => s.date < todayStr)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatTimerDisplay = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Selected subject's topics for fast topic dropdown selection in forms
  const currentSubjectObj = subjects.find((s) => s.id === formSubjectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Schedule focused study blocks, review dates, and track your daily learning consistency.
          </p>
        </div>

        <button
          id="add-session-btn"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Study Session
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filters:
        </div>

        {/* Subject filter */}
        <select
          id="filter-planner-subject"
          value={filterSubjectId}
          onChange={(e) => setFilterSubjectId(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Subjects ({subjects.length})</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          id="filter-planner-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending Only</option>
          <option value="Completed">Completed Only</option>
        </select>

        {/* Priority filter */}
        <select
          id="filter-planner-priority"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {(filterSubjectId !== 'all' || filterStatus !== 'all' || filterPriority !== 'all') && (
          <button
            onClick={() => {
              setFilterSubjectId('all');
              setFilterStatus('all');
              setFilterPriority('all');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grouped Date Sections */}
      <div className="space-y-6">
        {/* Today's Block */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Today's Schedule ({todayList.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">{todayStr}</span>
          </div>

          {todayList.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
              No study sessions planned for today.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {todayList.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onToggleStatus={() => toggleSessionStatus(session.id)}
                  onEdit={() => openEditModal(session)}
                  onDelete={() => deleteSession(session.id)}
                  onStartFocusTimer={() => startFocusTimer(session, session.durationMinutes || 25)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tomorrow's Block */}
        {tomorrowList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Tomorrow ({tomorrowList.length})
              </h3>
              <span className="text-xs text-slate-500 font-mono">{tomorrowStr}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tomorrowList.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onToggleStatus={() => toggleSessionStatus(session.id)}
                  onEdit={() => openEditModal(session)}
                  onDelete={() => deleteSession(session.id)}
                  onStartFocusTimer={() => startFocusTimer(session, session.durationMinutes || 25)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Future Days */}
        {upcomingList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Upcoming Future Sessions ({upcomingList.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcomingList.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onToggleStatus={() => toggleSessionStatus(session.id)}
                  onEdit={() => openEditModal(session)}
                  onDelete={() => deleteSession(session.id)}
                  onStartFocusTimer={() => startFocusTimer(session, session.durationMinutes || 25)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Sessions */}
        {pastList.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                Past Sessions ({pastList.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-80">
              {pastList.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onToggleStatus={() => toggleSessionStatus(session.id)}
                  onEdit={() => openEditModal(session)}
                  onDelete={() => deleteSession(session.id)}
                  onStartFocusTimer={() => startFocusTimer(session, session.durationMinutes || 25)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          if (onCloseAddModal) onCloseAddModal();
        }}
        title="Schedule Study Session"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formSubjectId}
              onChange={(e) => setFormSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Study Topic / Chapter <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Binary Search Tree Insertion and Rotations"
              value={formTopic}
              onChange={(e) => setFormTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            {currentSubjectObj && currentSubjectObj.topics.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500">Suggested syllabus topics:</span>
                {currentSubjectObj.topics.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormTopic(t.name)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    + {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (mins)
              </label>
              <select
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value={25}>25 mins (Pomodoro)</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1 hr)</option>
                <option value={90}>90 mins (1.5 hrs)</option>
                <option value={120}>120 mins (2 hrs)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as SessionStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Objective / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Solve 5 numerical problems from section 4.2..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                if (onCloseAddModal) onCloseAddModal();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-add-session-btn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Schedule Session
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        isOpen={!!editingSession}
        onClose={() => setEditingSession(null)}
        title="Edit Study Session"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <select
              value={formSubjectId}
              onChange={(e) => setFormSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Topic <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formTopic}
              onChange={(e) => setFormTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min={10}
                max={300}
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as SessionStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingSession(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-edit-session-btn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Focus Timer / Pomodoro Modal */}
      {timerSession && (
        <Modal
          isOpen={!!timerSession}
          onClose={() => {
            setIsTimerRunning(false);
            setTimerSession(null);
          }}
          title="Focus Study Timer"
          maxWidth="md"
        >
          <div className="text-center space-y-5 py-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {timerSession.subjectName}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{timerSession.topic}</h3>
            </div>

            {/* Big Clean Timer Display */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-inner font-mono">
              <span className="text-5xl font-extrabold tracking-wider">
                {formatTimerDisplay(timerSecondsLeft)}
              </span>
              <p className="text-xs text-slate-400 mt-2">
                {isTimerRunning ? '🔥 Deep focus session in progress' : '⏸️ Timer paused'}
              </p>
            </div>

            {/* Quick Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Resume Focus
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSecondsLeft(initialTimerMinutes * 60);
                }}
                className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (timerSession.status === 'Pending') {
                    toggleSessionStatus(timerSession.id);
                  }
                  setIsTimerRunning(false);
                  setTimerSession(null);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Finish & Mark Completed
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSession(null);
                }}
                className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Extracted clean SessionCard component
const SessionCard: React.FC<{
  session: StudySession;
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStartFocusTimer: () => void;
}> = ({ session, onToggleStatus, onEdit, onDelete, onStartFocusTimer }) => {
  const isCompleted = session.status === 'Completed';

  return (
    <div
      id={`session-card-${session.id}`}
      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
        isCompleted
          ? 'bg-slate-50/80 border-slate-200'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
            {session.subjectName}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              session.priority === 'High'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : session.priority === 'Medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {session.priority} Priority
          </span>
        </div>

        <div className="flex items-start gap-2.5 mt-2.5">
          <button
            type="button"
            onClick={onToggleStatus}
            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-blue-600 bg-white'
            }`}
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
          >
            {isCompleted && <CheckCircle2 className="w-4 h-4" />}
          </button>

          <div className="min-w-0 flex-1">
            <h4
              className={`text-sm font-semibold ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
            >
              {session.topic}
            </h4>
            {session.notes && (
              <p className="text-xs text-slate-500 mt-1 italic line-clamp-2">
                "{session.notes}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {session.durationMinutes}m
          </span>
          {session.startTime && <span>{session.startTime}</span>}
        </div>

        <div className="flex items-center gap-1.5">
          {!isCompleted && (
            <button
              type="button"
              onClick={onStartFocusTimer}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-semibold border border-blue-200 transition-colors"
              title="Start Focus Timer"
            >
              <Play className="w-3 h-3 fill-current" />
              Focus
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            title="Edit session"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Delete this study session?')) onDelete();
            }}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete session"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
