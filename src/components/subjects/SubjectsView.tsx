import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { Subject, Topic } from '../../types';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  HelpCircle,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#0d9488', // Teal
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#059669', // Emerald
  '#dc2626', // Red
  '#4f46e5', // Indigo
  '#db2777', // Pink
];

export const SubjectsView: React.FC = () => {
  const {
    subjects,
    addSubject,
    editSubject,
    deleteSubject,
    addTopicToSubject,
    toggleTopicCompletion,
    deleteTopic,
    setActiveTab,
  } = useStudy();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [detailSubject, setDetailSubject] = useState<Subject | null>(null);

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTargetHours, setFormTargetHours] = useState(30);
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [initialTopicsInput, setInitialTopicsInput] = useState('');

  // Form state for adding single topic inside detail modal
  const [newTopicName, setNewTopicName] = useState('');

  const openAddModal = () => {
    setFormName('');
    setFormCode('');
    setFormDesc('');
    setFormTargetHours(30);
    setFormColor(PRESET_COLORS[0]);
    setInitialTopicsInput('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setFormName(sub.name);
    setFormCode(sub.code);
    setFormDesc(sub.description);
    setFormTargetHours(sub.targetHours);
    setFormColor(sub.color || PRESET_COLORS[0]);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    // Parse initial topics by newline or comma
    const topics: Topic[] = initialTopicsInput
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((name, idx) => ({
        id: `top-${Date.now()}-${idx}`,
        name,
        isCompleted: false,
      }));

    addSubject({
      name: formName.trim(),
      code: formCode.trim() || 'SUB',
      description: formDesc.trim(),
      targetHours: Number(formTargetHours) || 20,
      color: formColor,
      topics,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !formName.trim()) return;

    editSubject(editingSubject.id, {
      name: formName.trim(),
      code: formCode.trim(),
      description: formDesc.trim(),
      targetHours: Number(formTargetHours) || 20,
      color: formColor,
    });

    setEditingSubject(null);
  };

  const handleAddTopicInDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailSubject || !newTopicName.trim()) return;
    addTopicToSubject(detailSubject.id, newTopicName.trim());
    setNewTopicName('');
  };

  // Keep detailSubject synced with state
  const activeDetailSub = detailSubject ? subjects.find((s) => s.id === detailSubject.id) : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Subject Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize your enrolled courses, syllabus units, and target study hours.
          </p>
        </div>

        <button
          id="add-subject-btn"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Subject
        </button>
      </div>

      {/* Subject Cards Grid */}
      {subjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-slate-300">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Subjects Added Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Add your college subjects to begin tracking syllabus topics, scheduling study sessions, and taking subject quizzes.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Add First Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => {
            const completedTopics = sub.topics.filter((t) => t.isCompleted).length;
            const totalTopics = sub.topics.length;
            const progressPct =
              totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            const hoursPct =
              sub.targetHours > 0
                ? Math.min(100, Math.round((sub.completedHours / sub.targetHours) * 100))
                : 0;

            return (
              <div
                key={sub.id}
                id={`subject-card-${sub.id}`}
                className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* Colored Top Border Indicator */}
                <div className="h-1.5 w-full" style={{ backgroundColor: sub.color || '#2563eb' }} />

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Code & Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {sub.code}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          id={`edit-sub-${sub.id}`}
                          onClick={() => openEditModal(sub)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit subject"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-sub-${sub.id}`}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${sub.name}?`)) {
                              deleteSubject(sub.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{sub.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {sub.description || 'No description provided.'}
                    </p>

                    {/* Syllabus Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-600">Syllabus Completion</span>
                        <span className="font-bold text-slate-900">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progressPct}%`,
                            backgroundColor: sub.color || '#2563eb',
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                        <span>{completedTopics} of {totalTopics} topics mastered</span>
                        <span>{sub.completedHours}h / {sub.targetHours}h study</span>
                      </div>
                    </div>

                    {/* Topic preview pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {sub.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic.id}
                          className={`text-[10px] px-2 py-0.5 rounded-md truncate max-w-[140px] flex items-center gap-1 ${
                            topic.isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {topic.isCompleted ? (
                            <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                          ) : (
                            <Circle className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                          )}
                          <span className="truncate">{topic.name}</span>
                        </span>
                      ))}
                      {sub.topics.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          +{sub.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      id={`view-topics-${sub.id}`}
                      onClick={() => setDetailSubject(sub)}
                      className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      View Topics ({sub.topics.length})
                    </button>
                    <button
                      id={`quiz-for-sub-${sub.id}`}
                      onClick={() => setActiveTab('quiz')}
                      title="Practice Quiz"
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Subject Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Subject"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Operating Systems"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                placeholder="e.g. CS204"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Brief course overview and curriculum topics..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Study Hours (Semester)
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={formTargetHours}
                onChange={(e) => setFormTargetHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2 pt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      formColor === c ? 'scale-115 border-slate-900 ring-2 ring-blue-200' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Syllabus Topics (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="Topic 1: Introduction&#10;Topic 2: Fundamental Concepts&#10;Topic 3: Practical Applications"
              value={initialTopicsInput}
              onChange={(e) => setInitialTopicsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              You can also add or complete topics later in the topic manager.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-add-subject-btn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Add Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        title={`Edit Subject: ${editingSubject?.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Study Hours
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={formTargetHours}
                onChange={(e) => setFormTargetHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2 pt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      formColor === c ? 'scale-115 border-slate-900 ring-2 ring-blue-200' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingSubject(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-edit-subject-btn"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Subject Detail & Topic Manager Modal */}
      {activeDetailSub && (
        <Modal
          isOpen={!!activeDetailSub}
          onClose={() => setDetailSubject(null)}
          title={`${activeDetailSub.code}: ${activeDetailSub.name}`}
          maxWidth="xl"
        >
          <div className="space-y-5">
            {/* Subject Overview banner */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-600">{activeDetailSub.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {activeDetailSub.completedHours}h logged of {activeDetailSub.targetHours}h goal
                  </span>
                  <span>&bull;</span>
                  <span>
                    {activeDetailSub.topics.filter((t) => t.isCompleted).length}/
                    {activeDetailSub.topics.length} topics mastered
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setDetailSubject(null);
                  setActiveTab('planner');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs shrink-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule Session
              </button>
            </div>

            {/* Add new topic inline form */}
            <form onSubmit={handleAddTopicInDetail} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Add a syllabus topic or chapter (e.g. Unit 3: Dynamic Programming)..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                id="add-topic-btn"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Topic
              </button>
            </form>

            {/* Topics List with Completion Checkboxes */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Syllabus Topics ({activeDetailSub.topics.length})
              </h4>

              {activeDetailSub.topics.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3 text-center">
                  No topics defined yet. Use the input above to list syllabus chapters.
                </p>
              ) : (
                activeDetailSub.topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                      topic.isCompleted
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        id={`toggle-topic-${topic.id}`}
                        onClick={() => toggleTopicCompletion(activeDetailSub.id, topic.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                          topic.isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-blue-600 bg-white'
                        }`}
                        title={topic.isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                      >
                        {topic.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-medium truncate ${
                            topic.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'
                          }`}
                        >
                          <span className="text-slate-400 mr-1.5 font-mono text-[11px]">
                            {index + 1}.
                          </span>
                          {topic.name}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTopic(activeDetailSub.id, topic.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Remove topic"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setDetailSubject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
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
