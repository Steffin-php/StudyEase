import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Subject,
  StudySession,
  Task,
  ActiveTab,
  Priority,
  TaskType,
} from '../types';
import {
  DEFAULT_USER,
  DEFAULT_SUBJECTS,
  DEFAULT_SESSIONS,
  DEFAULT_TASKS,
} from '../data/defaultData';

interface StudyContextType {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  loginAsGuest: () => void;
  register: (data: { fullName: string; email: string; course: string; college: string; semester?: string }) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'completedHours'>) => void;
  editSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addTopicToSubject: (subjectId: string, topicName: string) => void;
  toggleTopicCompletion: (subjectId: string, topicId: string) => void;
  deleteTopic: (subjectId: string, topicId: string) => void;

  // Study Sessions
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id'>) => void;
  editSession: (id: string, data: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  toggleSessionStatus: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  editTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // Reset & Export
  resetToDefaultData: () => void;
}

const STORAGE_KEYS = {
  USER: 'studyease_user',
  SUBJECTS: 'studyease_subjects',
  SESSIONS: 'studyease_sessions',
  TASKS: 'studyease_tasks',
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  });

  // Sessions state
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
    } catch {
      return DEFAULT_SESSIONS;
    }
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // Auth Handlers
  const login = (email: string, pass: string) => {
    if (!email || !pass) {
      return { success: false, message: 'Please provide both email and password.' };
    }
    const isGuest = email.toLowerCase().includes('guest') || email === 'guest.student@studyease.edu';
    const loggedUser: User = {
      id: isGuest ? 'user-guest' : `user-${Date.now()}`,
      fullName: isGuest ? 'Guest Student' : (email.split('@')[0].replace('.', ' ') || 'Student'),
      email,
      course: 'B.Tech Computer Science & Engineering',
      college: 'Metropolitan Institute of Technology',
      semester: '4th Semester',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUser(loggedUser);
    return { success: true };
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'user-guest',
      fullName: 'Guest Student',
      email: 'guest.student@studyease.edu',
      course: 'B.Tech Computer Science & Engineering',
      college: 'Metropolitan Institute of Technology',
      semester: '4th Semester',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUser(guestUser);
  };

  const register = (data: { fullName: string; email: string; course: string; college: string; semester?: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      course: data.course,
      college: data.college,
      semester: data.semester || '1st Year / Semester',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  // Subject Handlers
  const addSubject = (subData: Omit<Subject, 'id' | 'createdAt' | 'completedHours'>) => {
    const newSubject: Subject = {
      ...subData,
      id: `sub-${Date.now()}`,
      completedHours: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSubjects((prev) => [newSubject, ...prev]);
  };

  const editSubject = (id: string, data: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    if (data.name) {
      setSessions((prev) =>
        prev.map((sess) => (sess.subjectId === id ? { ...sess, subjectName: data.name! } : sess))
      );
      setTasks((prev) =>
        prev.map((t) => (t.subjectId === id ? { ...t, subjectName: data.name! } : t))
      );
    }
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const addTopicToSubject = (subjectId: string, topicName: string) => {
    if (!topicName.trim()) return;
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          const newTopic = {
            id: `top-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: topicName.trim(),
            isCompleted: false,
          };
          return { ...s, topics: [...s.topics, newTopic] };
        }
        return s;
      })
    );
  };

  const toggleTopicCompletion = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            topics: s.topics.map((t) =>
              t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
            ),
          };
        }
        return s;
      })
    );
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            topics: s.topics.filter((t) => t.id !== topicId),
          };
        }
        return s;
      })
    );
  };

  // Study Session Handlers
  const addSession = (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
    };
    setSessions((prev) => [newSession, ...prev]);

    // If marked completed, add to subject completedHours
    if (newSession.status === 'Completed') {
      const hours = newSession.durationMinutes / 60;
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === newSession.subjectId
            ? { ...s, completedHours: Number((s.completedHours + hours).toFixed(1)) }
            : s
        )
      );
    }
  };

  const editSession = (id: string, data: Partial<StudySession>) => {
    setSessions((prev) =>
      prev.map((sess) => (sess.id === id ? { ...sess, ...data } : sess))
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((sess) => sess.id !== id));
  };

  const toggleSessionStatus = (id: string) => {
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id === id) {
          const nextStatus = sess.status === 'Completed' ? 'Pending' : 'Completed';
          const hourDiff = (sess.durationMinutes / 60) * (nextStatus === 'Completed' ? 1 : -1);

          // Update corresponding subject completedHours
          setSubjects((subs) =>
            subs.map((s) =>
              s.id === sess.subjectId
                ? {
                    ...s,
                    completedHours: Math.max(
                      0,
                      Number((s.completedHours + hourDiff).toFixed(1))
                    ),
                  }
                : s
            )
          );

          return { ...sess, status: nextStatus };
        }
        return sess;
      })
    );
  };

  // Tasks Handlers
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const editTask = (id: string, data: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
          : t
      )
    );
  };

  const resetToDefaultData = () => {
    setUser(DEFAULT_USER);
    setSubjects(DEFAULT_SUBJECTS);
    setSessions(DEFAULT_SESSIONS);
    setTasks(DEFAULT_TASKS);
    localStorage.clear();
  };

  return (
    <StudyContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        loginAsGuest,
        register,
        logout,
        updateProfile,
        activeTab,
        setActiveTab,
        subjects,
        addSubject,
        editSubject,
        deleteSubject,
        addTopicToSubject,
        toggleTopicCompletion,
        deleteTopic,
        sessions,
        addSession,
        editSession,
        deleteSession,
        toggleSessionStatus,
        tasks,
        addTask,
        editTask,
        deleteTask,
        toggleTaskStatus,
        resetToDefaultData,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
