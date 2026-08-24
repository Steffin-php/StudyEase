import { Subject, StudySession, Task, User } from '../types';

export const DEFAULT_USER: User = {
  id: 'user-guest',
  fullName: 'Guest Student',
  email: 'guest.student@studyease.edu',
  course: 'B.Tech Computer Science & Engineering',
  college: 'Metropolitan Institute of Technology',
  semester: '4th Semester',
  joinDate: '2026-01-15',
};

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'sub-dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    description: 'Core concepts of arrays, linked lists, trees, graphs, dynamic programming and sorting algorithms.',
    color: '#2563eb', // Blue
    targetHours: 45,
    completedHours: 32,
    topics: [
      { id: 'top-1', name: 'Asymptotic Notation & Time Complexity', isCompleted: true },
      { id: 'top-2', name: 'Singly and Doubly Linked Lists', isCompleted: true },
      { id: 'top-3', name: 'Stack and Queue Applications', isCompleted: true },
      { id: 'top-4', name: 'Binary Search Trees & AVL Trees', isCompleted: true },
      { id: 'top-5', name: 'Graph Traversal (BFS & DFS)', isCompleted: false },
      { id: 'top-6', name: 'Dynamic Programming & Memoization', isCompleted: false },
    ],
    createdAt: '2026-01-20',
  },
  {
    id: 'sub-dbms',
    name: 'Database Management Systems',
    code: 'CS302',
    description: 'Relational model, SQL queries, normalization, ACID transaction management and indexing.',
    color: '#0d9488', // Teal
    targetHours: 35,
    completedHours: 24,
    topics: [
      { id: 'top-7', name: 'ER Diagrams and Relational Mapping', isCompleted: true },
      { id: 'top-8', name: 'Complex SQL Queries & Joins', isCompleted: true },
      { id: 'top-9', name: 'Functional Dependencies & Normalization (1NF to BCNF)', isCompleted: true },
      { id: 'top-10', name: 'ACID Properties & Concurrency Control', isCompleted: false },
      { id: 'top-11', name: 'B+ Trees & Query Optimization', isCompleted: false },
    ],
    createdAt: '2026-01-22',
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'CS204',
    description: 'Process management, CPU scheduling, thread synchronization, memory paging, and deadlock handling.',
    color: '#d97706', // Amber
    targetHours: 40,
    completedHours: 26,
    topics: [
      { id: 'top-12', name: 'Process States and PCB', isCompleted: true },
      { id: 'top-13', name: 'CPU Scheduling Algorithms (FCFS, SJF, RR)', isCompleted: true },
      { id: 'top-14', name: 'Semaphores & Classical IPC Problems', isCompleted: true },
      { id: 'top-15', name: 'Deadlock Detection & Bankers Algorithm', isCompleted: false },
      { id: 'top-16', name: 'Virtual Memory & Page Replacement', isCompleted: false },
    ],
    createdAt: '2026-01-25',
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CS305',
    description: 'Layered architectures, TCP/IP stack, IP routing, subnetting, error detection, and network security.',
    color: '#7c3aed', // Purple
    targetHours: 30,
    completedHours: 18,
    topics: [
      { id: 'top-17', name: 'OSI 7-Layer vs TCP/IP Architecture', isCompleted: true },
      { id: 'top-18', name: 'Data Link Framing & CRC Error Check', isCompleted: true },
      { id: 'top-19', name: 'IPv4 Classless Subnetting (CIDR)', isCompleted: false },
      { id: 'top-20', name: 'TCP 3-Way Handshake & Flow Control', isCompleted: false },
      { id: 'top-21', name: 'Application Protocols: DNS, HTTP/HTTPS', isCompleted: false },
    ],
    createdAt: '2026-02-01',
  },
  {
    id: 'sub-web',
    name: 'Web Technologies',
    code: 'CS208',
    description: 'Client-server architecture, modern JavaScript, responsive interfaces, REST APIs, and state management.',
    color: '#059669', // Emerald
    targetHours: 25,
    completedHours: 20,
    topics: [
      { id: 'top-22', name: 'Semantic HTML5 & Modern CSS Layouts', isCompleted: true },
      { id: 'top-23', name: 'JavaScript ES6+ and Asynchronous Fetch', isCompleted: true },
      { id: 'top-24', name: 'React Component Lifecycle & Hooks', isCompleted: true },
      { id: 'top-25', name: 'RESTful API Design & Authentication', isCompleted: false },
    ],
    createdAt: '2026-02-05',
  },
];

// Helper to get formatted dates relative to today
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Graph Traversal (BFS & DFS)',
    date: getRelativeDate(0), // Today
    startTime: '10:00',
    durationMinutes: 60,
    priority: 'High',
    status: 'Pending',
    notes: 'Solve 3 LeetCode problems on cycle detection using DFS.',
  },
  {
    id: 'sess-2',
    subjectId: 'sub-os',
    subjectName: 'Operating Systems',
    topic: 'Deadlock Detection & Bankers Algorithm',
    date: getRelativeDate(0), // Today
    startTime: '14:30',
    durationMinutes: 45,
    priority: 'Medium',
    status: 'Completed',
    notes: 'Practice safety state numerical problems from university previous year papers.',
  },
  {
    id: 'sess-3',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    topic: 'ACID Properties & Concurrency Control',
    date: getRelativeDate(1), // Tomorrow
    startTime: '11:00',
    durationMinutes: 60,
    priority: 'High',
    status: 'Pending',
    notes: 'Read textbook chapter 14 on strict 2-phase locking protocol.',
  },
  {
    id: 'sess-4',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    topic: 'IPv4 Classless Subnetting (CIDR)',
    date: getRelativeDate(2), // In 2 days
    startTime: '16:00',
    durationMinutes: 90,
    priority: 'Medium',
    status: 'Pending',
    notes: 'Solve FLSM and VLSM network address calculation worksheets.',
  },
  {
    id: 'sess-5',
    subjectId: 'sub-web',
    subjectName: 'Web Technologies',
    topic: 'RESTful API Design & Authentication',
    date: getRelativeDate(3),
    startTime: '15:00',
    durationMinutes: 60,
    priority: 'Low',
    status: 'Pending',
    notes: 'Build a sample express endpoint with JWT token validation.',
  },
  {
    id: 'sess-6',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Binary Search Trees & AVL Trees',
    date: getRelativeDate(-1), // Yesterday
    startTime: '09:00',
    durationMinutes: 75,
    priority: 'High',
    status: 'Completed',
    notes: 'Implemented left and right rotation helper functions.',
  },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Operating Systems Lab 4: Semaphore Implementation',
    subjectId: 'sub-os',
    subjectName: 'Operating Systems',
    dueDate: getRelativeDate(0), // Today
    priority: 'High',
    status: 'Pending',
    type: 'Lab Report',
    description: 'Submit C implementation of Producer-Consumer problem using POSIX semaphores.',
  },
  {
    id: 'task-2',
    title: 'DBMS Assignment 2: BCNF Normalization Proofs',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    dueDate: getRelativeDate(1), // Tomorrow
    priority: 'High',
    status: 'Pending',
    type: 'Assignment',
    description: 'Decompose relation R(A,B,C,D,E) into 3NF and BCNF with dependency preservation check.',
  },
  {
    id: 'task-3',
    title: 'DSA Midterm Practice Problem Set (Module 2)',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    dueDate: getRelativeDate(3),
    priority: 'Medium',
    status: 'Pending',
    type: 'Exam Prep',
    description: 'Complete 15 questions on balanced trees and heaps.',
  },
  {
    id: 'task-4',
    title: 'Computer Networks Packet Tracer Lab Submission',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    dueDate: getRelativeDate(5),
    priority: 'Medium',
    status: 'Pending',
    type: 'Lab Report',
    description: 'Configure router RIP protocol and verify ping between subnet A and subnet B.',
  },
  {
    id: 'task-5',
    title: 'Web Dev Project Milestone: Component Wireframes',
    subjectId: 'sub-web',
    subjectName: 'Web Technologies',
    dueDate: getRelativeDate(-2), // Overdue/Completed
    priority: 'Low',
    status: 'Completed',
    type: 'Project',
    description: 'Submit UI flow mockups and responsive navbar design in Figma.',
  },
  {
    id: 'task-6',
    title: 'Read Chapter 4: OSI Transport Layer Protocols',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    dueDate: getRelativeDate(4),
    priority: 'Low',
    status: 'Pending',
    type: 'Reading',
    description: 'Review sliding window flow control algorithms (Go-Back-N vs Selective Repeat).',
  },
];
