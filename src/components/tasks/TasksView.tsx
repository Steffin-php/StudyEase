import React, { useState, useEffect } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Task, Priority, TaskStatus, TaskType } from '../../types';
import { Modal } from '../common/Modal';
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Filter,
  ArrowUpDown,
  FileText,
} from 'lucide-react';

interface TasksViewProps {
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const {
    subjects,
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTaskStatus,
  } = useStudy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(isAddModalOpenInitially);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filters & Sorting
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSubjectId, setFormSubjectId] = useState<string>(subjects[0]?.id || '');
  const [formDueDate, setFormDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPriority, setFormPriority] = useState<Priority>('Medium');
  const [formStatus, setFormStatus] = useState<TaskStatus>('Pending');
  const [formType, setFormType] = useState<TaskType>('Assignment');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    if (isAddModalOpenInitially) {
      setIsAddModalOpen(true);
    }
  }, [isAddModalOpenInitially]);

  const openAddModal = () => {
    setFormTitle('');
    setFormSubjectId(subjects[0]?.id || '');
    setFormDueDate(new Date().toISOString().split('T')[0]);
    setFormPriority('Medium');
    setFormStatus('Pending');
    setFormType('Assignment');
    setFormDescription('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormSubjectId(task.subjectId);
    setFormDueDate(task.dueDate);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormType(task.type);
    setFormDescription(task.description || '');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSub = subjects.find((s) => s.id === formSubjectId);
    if (!selectedSub || !formTitle.trim()) return;

    addTask({
      title: formTitle.trim(),
      subjectId: selectedSub.id,
      subjectName: selectedSub.name,
      dueDate: formDueDate,
      priority: formPriority,
      status: formStatus,
      type: formType,
      description: formDescription.trim(),
    });

    setIsAddModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    const selectedSub = subjects.find((s) => s.id === formSubjectId);

    editTask(editingTask.id, {
      title: formTitle.trim(),
      subjectId: formSubjectId,
      subjectName: selectedSub ? selectedSub.name : editingTask.subjectName,
      dueDate: formDueDate,
      priority: formPriority,
      status: formStatus,
      type: formType,
      description: formDescription.trim(),
    });

    setEditingTask(null);
  };

  // Helper for deadline urgency indicator
  const todayStr = new Date().toISOString().split('T')[0];
  const getDeadlineBadge = (dueDate: string, status: TaskStatus) => {
    if (status === 'Completed') {
      return { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    const today = new Date(todayStr).getTime();
    const due = new Date(dueDate).getTime();
    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)}d`,
        color: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
      };
    }
    if (diffDays === 0) {
      return { label: 'Due Today', color: 'bg-amber-50 text-amber-800 border-amber-200 font-bold' };
    }
    if (diffDays === 1) {
      return { label: 'Due Tomorrow', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    }
    if (diffDays <= 3) {
      return { label: `Due in ${diffDays} days`, color: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
    }
    return { label: `Due ${dueDate}`, color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  // Filtering & Sorting
  const filteredTasks = tasks.filter((t) => {
    if (filterSubjectId !== 'all' && t.subjectId !== filterSubjectId) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track homework assignments, lab reports, semester project milestones, and exam dates.
          </p>
        </div>

        <button
          id="add-task-btn"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Academic Task
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          <select
            id="filter-task-subject"
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects ({subjects.length})</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            id="filter-task-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses ({tasks.length})</option>
            <option value="Pending">Pending ({pendingCount})</option>
            <option value="Completed">Completed ({completedCount})</option>
          </select>

          <select
            id="filter-task-priority"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            id="filter-task-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Task Types</option>
            <option value="Assignment">Assignment</option>
            <option value="Lab Report">Lab Report</option>
            <option value="Project">Project</option>
            <option value="Exam Prep">Exam Prep</option>
            <option value="Reading">Reading</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 font-medium"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Task Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-slate-300">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Tasks Match Filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You're all caught up or no tasks match your current filter criteria.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Add New Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const isDone = task.status === 'Completed';
            const deadline = getDeadlineBadge(task.dueDate, task.status);

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-blue-600 bg-white'
                    }`}
                    title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {task.subjectName}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {task.type}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          task.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : task.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-semibold mt-1.5 ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right metadata and buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium inline-block ${deadline.color}`}
                  >
                    {deadline.label}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete this task?')) deleteTask(task.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          if (onCloseAddModal) onCloseAddModal();
        }}
        title="Add Academic Task"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title / Assignment Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems Lab 4: Semaphore Implementation"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                Task Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as TaskType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Assignment">Assignment</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Project">Project Milestone</option>
                <option value="Exam Prep">Exam Preparation</option>
                <option value="Reading">Reading / Research</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
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
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Guidelines / Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Instructions, submission link notes, team partner details, or grading rubrics..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
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
              id="confirm-add-task-btn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject
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
                Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as TaskType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Assignment">Assignment</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Project">Project Milestone</option>
                <option value="Exam Prep">Exam Preparation</option>
                <option value="Reading">Reading / Research</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
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
                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-edit-task-btn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
