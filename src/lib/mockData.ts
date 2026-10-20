import { User, Project, DailyReport, Channel, Message, WarRoomState, WorkingFile, ShiftHandover, Course, CourseEnrollment, Certificate, ClientAccount, ClientRequirement, ClientTicket } from '@/types';


export function getDMChannelId(userId1: string, userId2: string): string {
  const sorted = [userId1, userId2].sort();
  return `dm-${sorted[0]}-${sorted[1]}`;
}

export const INITIAL_WORKING_FILES: Record<string, WorkingFile[]> = {
  'u-1': [
    {
      id: 'wf-101',
      fileName: 'WebRTCGrid.tsx',
      filePath: 'src/components/WebRTCGrid.tsx',
      folder: 'src/components',
      linesAdded: 145,
      linesDeleted: 12,
      lastUpdated: 'Today, 05:40 PM',
      language: 'typescript',
      taskTitle: 'WebRTC Video Grid & Screen Sharing',
      codeSnippet: `export const WebRTCGrid = ({ stream, isScreenSharing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-2xl bg-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-xs text-indigo-300">
        Peer Stream ID: #RTC-7714
      </div>
    </div>
  );
};`
    }
  ],

  'u-4': [
    {
      id: 'wf-401',
      fileName: 'schema.prisma',
      filePath: 'prisma/schema.prisma',
      folder: 'prisma',
      linesAdded: 92,
      linesDeleted: 8,
      lastUpdated: 'Today, 06:10 PM',
      language: 'prisma',
      taskTitle: 'PostgreSQL Prisma ORM Schemas & Migrations',
      codeSnippet: `model WarRoomAlert {
  id            String   @id @default(uuid())
  triggeredById String
  reason        String
  channelId     String?
  createdAt     DateTime @default(now())
  active        Boolean  @default(true)
}`
    }
  ],

  'u-5': [
    {
      id: 'wf-501',
      fileName: 'ragPipeline.py',
      filePath: 'ai/ragPipeline.py',
      folder: 'ai',
      linesAdded: 180,
      linesDeleted: 14,
      lastUpdated: 'Today, 04:30 PM',
      language: 'python',
      taskTitle: 'LLM RAG Vector Search & Embeddings Engine',
      codeSnippet: `from langchain.embeddings import OpenAIEmbeddings
from qdrant_client import QdrantClient

def query_vector_database(prompt: str, top_k: int = 5):
    client = QdrantClient(host="vector-db.internal", port=6333)
    results = client.search(collection_name="sprint_docs", query_vector=embed(prompt), limit=top_k)
    return results`
    }
  ],

  'u-2': [
    {
      id: 'wf-201',
      fileName: 'deadlineEngine.ts',
      filePath: 'src/lib/deadlineEngine.ts',
      folder: 'src/lib',
      linesAdded: 120,
      linesDeleted: 6,
      lastUpdated: 'Today, 06:30 PM',
      language: 'typescript',
      taskTitle: 'Dynamic Deadline Calculation Engine',
      codeSnippet: `export function calculateDynamicDeadline(project, reports) {
  const completedTaskHours = project.tasks.reduce((sum, task) => {
    return task.status === 'DONE' ? sum + task.estimatedHours : sum;
  }, 0);
  return { currentVelocity, remainingHours };
}`
    }
  ],

  'u-3': [
    {
      id: 'wf-301',
      fileName: 'sprint_goals_v2.json',
      filePath: 'config/sprint_goals_v2.json',
      folder: 'config',
      linesAdded: 38,
      linesDeleted: 0,
      lastUpdated: 'Today, 02:15 PM',
      language: 'json',
      taskTitle: 'Executive Sprint Velocity Targets',
      codeSnippet: `{
  "sprint": "Sprint 14",
  "targetVelocity": 1.0,
  "minVelocityThreshold": 0.85
}`
    }
  ]
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alex Rivers',
    email: 'alex.rivers@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'EMPLOYEE',
    department: 'Full-Stack & Frontend Platform',
    jobTitle: 'Senior Frontend & WebRTC Engineer',
    isPinnedDM: false,
    workingFiles: INITIAL_WORKING_FILES['u-1'],
  },
  {
    id: 'u-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'TEAM_LEAD',
    department: 'Full-Stack & Frontend Platform',
    jobTitle: 'Staff Full-Stack & LLM Platform Lead',
    isPinnedDM: true,
    workingFiles: INITIAL_WORKING_FILES['u-2'],
  },
  {
    id: 'u-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    role: 'MANAGER',
    department: 'Engineering Leadership & Ops',
    jobTitle: 'VP of Engineering Operations',
    isPinnedDM: true,
    workingFiles: INITIAL_WORKING_FILES['u-3'],
  },
  {
    id: 'u-4',
    name: 'David Chen',
    email: 'david.chen@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'EMPLOYEE',
    department: 'Cloud Infrastructure & SRE',
    jobTitle: 'Principal Site Reliability Engineer (SRE)',
    isPinnedDM: false,
    workingFiles: INITIAL_WORKING_FILES['u-4'],
  },
  {
    id: 'u-5',
    name: 'Dr. Maya Lin',
    email: 'maya.lin@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    role: 'EMPLOYEE',
    department: 'Artificial Intelligence & ML',
    jobTitle: 'Principal AI/ML Research Scientist & RAG Architect',
    isPinnedDM: true,
    workingFiles: INITIAL_WORKING_FILES['u-5'],
  },
  {
    id: 'u-6',
    name: 'James Sterling',
    email: 'james.sterling@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'EMPLOYEE',
    department: 'Cybersecurity & Compliance',
    jobTitle: 'Staff Information Security & Compliance Specialist',
    isPinnedDM: false,
  },
  {
    id: 'u-7',
    name: 'Sophie Bennett',
    email: 'sophie.bennett@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'EMPLOYEE',
    department: 'Product Experience & Design',
    jobTitle: 'Lead UX/UI Product Systems Architect',
    isPinnedDM: false,
  },
  {
    id: 'u-hr',
    name: 'Claire Underwood',
    email: 'claire.hr@company.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
    role: 'HR',
    department: 'People Operations & HR',
    jobTitle: 'Head of People Operations & Technical Learning',
    isPinnedDM: true,
  }
];


export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-1',
    name: 'Apex Platform Enterprise v2.0',
    code: 'APEX-V2',
    description: 'Next-gen team tracking, AI velocity engine, and real-time WebRTC collaboration suite.',
    baselineFinishDate: '2026-08-25',
    calculatedFinishDate: '2026-08-28',
    targetVelocity: 1.0,
    currentVelocity: 0.82,
    riskStatus: 'AT_RISK',
    totalEstimatedHours: 240,
    completedHours: 110,
    remainingHours: 130,
    leadName: 'Marcus Vance',
    clientId: 'client-1',
    clientName: 'CyberDyne Global Logistics',
    clientTier: 'ENTERPRISE',
    clientHealthScore: 94,
    slaUptimeTarget: 99.95,
    tasks: [
      {
        id: 't-101',
        projectId: 'p-1',
        title: 'Implement WebSockets Signaling Server',
        description: 'Socket.io handlers for channel messaging and emergency call invites',
        estimatedHours: 32,
        loggedHours: 32,
        status: 'DONE',
        priority: 'URGENT',
        assigneeId: 'u-4',
        assigneeName: 'David Chen',
        startDate: '2026-08-01',
        dueDate: '2026-08-05',
        progressPercent: 100
      },
      {
        id: 't-102',
        projectId: 'p-1',
        title: 'Dynamic Deadline Calculation Engine',
        description: 'Mathematical engine calculating project finish date based on daily reports',
        estimatedHours: 24,
        loggedHours: 24,
        status: 'DONE',
        priority: 'HIGH',
        assigneeId: 'u-2',
        assigneeName: 'Marcus Vance',
        startDate: '2026-08-04',
        dueDate: '2026-08-08',
        progressPercent: 100
      },
      {
        id: 't-103',
        projectId: 'p-1',
        title: 'WebRTC Video Grid & Screen Sharing',
        description: 'Peer connection manager, local media streams, screen share canvas',
        estimatedHours: 40,
        loggedHours: 28,
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        assigneeId: 'u-1',
        assigneeName: 'Alex Rivers',
        startDate: '2026-08-06',
        dueDate: '2026-08-14',
        progressPercent: 70,
        requiredCourseId: 'CRSE-WEBRTC',
        requiredCourseTitle: 'WebRTC Real-Time Mesh Signaling & ICE Protocols',
      },
      {
        id: 't-104',
        projectId: 'p-1',
        title: 'LLM RAG Vector Search & Embeddings Engine',
        description: 'Qdrant vector database pipeline for automated daily report summarization',
        estimatedHours: 45,
        loggedHours: 20,
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        assigneeId: 'u-5',
        assigneeName: 'Dr. Maya Lin',
        startDate: '2026-08-05',
        dueDate: '2026-08-15',
        progressPercent: 45
      }
    ]
  },
  {
    id: 'p-2',
    name: 'AI Agent & Vector Search Pipeline',
    code: 'AI-VECTOR',
    description: 'Autonomous project risk forecasting using RAG vector database & LLM embeddings.',
    baselineFinishDate: '2026-09-10',
    calculatedFinishDate: '2026-09-08',
    targetVelocity: 1.0,
    currentVelocity: 1.15,
    riskStatus: 'ON_TRACK',
    totalEstimatedHours: 180,
    completedHours: 95,
    remainingHours: 85,
    leadName: 'Dr. Maya Lin',
    clientId: 'client-2',
    clientName: 'Nexus FinTech Corp',
    clientTier: 'STRATEGIC',
    clientHealthScore: 78,
    slaUptimeTarget: 99.99,
    tasks: [
      {
        id: 't-201',
        projectId: 'p-2',
        title: 'RAG Pipeline Evaluation & Benchmark',
        description: 'Fine-tuning embedding retrieval latency under 50ms',
        estimatedHours: 40,
        loggedHours: 40,
        status: 'DONE',
        priority: 'HIGH',
        assigneeId: 'u-5',
        assigneeName: 'Dr. Maya Lin',
        startDate: '2026-08-02',
        dueDate: '2026-08-10',
        progressPercent: 100
      }
    ]
  }
];

export const INITIAL_DAILY_REPORTS: DailyReport[] = [
  {
    id: 'rep-1',
    userId: 'u-1',
    userName: 'Alex Rivers',
    userRole: 'EMPLOYEE',
    userDepartment: 'Full-Stack & Frontend Platform',
    userJobTitle: 'Senior Frontend & WebRTC Engineer',
    projectId: 'p-1',
    projectName: 'Apex Platform Enterprise v2.0',
    taskId: 't-103',
    taskTitle: 'WebRTC Video Grid & Screen Sharing',
    hoursLogged: 7.5,
    tasksCompleted: 'Completed WebRTC stream hooks, added local video toggle and audio mute states.',
    blockerDetails: 'ICE candidate gathering timing out on restricted corporate network NAT.',
    blockerSeverity: 'MODERATE',
    fileAttachment: 'webrtc_debug_logs.txt',
    submittedFiles: INITIAL_WORKING_FILES['u-1'],
    isApproved: true,
    submittedAt: '2026-08-08 17:45'
  },
  {
    id: 'rep-5',
    userId: 'u-5',
    userName: 'Dr. Maya Lin',
    userRole: 'EMPLOYEE',
    userDepartment: 'Artificial Intelligence & ML',
    userJobTitle: 'Principal AI/ML Research Scientist',
    projectId: 'p-1',
    projectName: 'Apex Platform Enterprise v2.0',
    taskId: 't-104',
    taskTitle: 'LLM RAG Vector Search & Embeddings Engine',
    hoursLogged: 8.0,
    tasksCompleted: 'Integrated Qdrant vector index with LangChain embeddings pipeline for daily report indexing.',
    blockerDetails: undefined,
    blockerSeverity: 'NONE',
    fileAttachment: 'ragPipeline.py',
    submittedFiles: INITIAL_WORKING_FILES['u-5'],
    isApproved: true,
    submittedAt: '2026-08-08 18:00'
  }
];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'c-1',
    name: 'general-announcements',
    description: 'Company-wide updates, release notes, and operational announcements',
    isEmergency: false,
    membersCount: 24,
    pinnedMessageCount: 2
  },
  {
    id: 'c-2',
    name: 'apex-dev-team',
    description: 'Technical discussions, code reviews, and daily developer syncs',
    isEmergency: false,
    membersCount: 14,
    pinnedMessageCount: 1
  },
  {
    id: 'c-3',
    name: 'war-room-alerts',
    description: 'Emergency channel for high-priority production escalations',
    isEmergency: true,
    membersCount: 12,
    pinnedMessageCount: 1
  },

  // Pairwise 1-on-1 Direct Channels
  {
    id: 'dm-u-1-u-2', // Alex & Marcus
    name: 'Alex Rivers & Marcus Vance',
    description: 'Private 1-on-1 direct channel between Alex Rivers and Marcus Vance',
    isEmergency: false,
    isDirectMessage: true,
    membersCount: 2,
    pinnedMessageCount: 1
  },
  {
    id: 'dm-u-1-u-5', // Alex & Maya Lin (AI Scientist)
    name: 'Alex Rivers & Dr. Maya Lin',
    description: 'Private 1-on-1 direct channel between Alex Rivers and Dr. Maya Lin',
    isEmergency: false,
    isDirectMessage: true,
    membersCount: 2,
    pinnedMessageCount: 1
  },
  {
    id: 'dm-u-2-u-3', // Marcus & Elena
    name: 'Marcus Vance & Elena Rostova',
    description: 'Private 1-on-1 direct channel between Marcus Vance and Elena Rostova',
    isEmergency: false,
    isDirectMessage: true,
    membersCount: 2,
    pinnedMessageCount: 1
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c-1': [
    {
      id: 'm-1',
      channelId: 'c-1',
      senderId: 'u-3',
      senderName: 'Elena Rostova',
      senderRole: 'MANAGER',
      senderDepartment: 'Engineering Leadership & Ops',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      content: '📌 Sprint 14 Deadline Update: Target launch is set for Aug 28. Review task estimates by EOD.',
      sentAt: '09:30 AM',
      isPinned: true
    }
  ],
  'dm-u-1-u-5': [ // Alex & Dr. Maya Lin
    {
      id: 'm-dm-15-1',
      channelId: 'dm-u-1-u-5',
      senderId: 'u-5',
      senderName: 'Dr. Maya Lin',
      senderRole: 'EMPLOYEE',
      senderDepartment: 'Artificial Intelligence & ML',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      content: '📌 AI RAG Pipeline: Alex, vector search embeddings are ready for frontend UI integration.',
      sentAt: '10:15 AM',
      isPinned: true
    }
  ]
};

export const INITIAL_WAR_ROOM_STATE: WarRoomState = {
  isActive: false,
  triggeredBy: 'Marcus Vance (Team Lead)',
  reason: 'Production Database Latency Spike & WebRTC ICE Candidate gathering failure.',
  startedAt: new Date().toLocaleTimeString(),
  participants: [
    { id: 'u-2', name: 'Marcus Vance', role: 'TEAM_LEAD', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', hasVideo: true, isMuted: false, isScreenSharing: true },
    { id: 'u-1', name: 'Alex Rivers', role: 'EMPLOYEE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', hasVideo: true, isMuted: false, isScreenSharing: false },
    { id: 'u-5', name: 'Dr. Maya Lin', role: 'EMPLOYEE', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', hasVideo: true, isMuted: false, isScreenSharing: false },
    { id: 'u-3', name: 'Elena Rostova', role: 'MANAGER', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', hasVideo: true, isMuted: true, isScreenSharing: false }
  ]
};

export interface WorkflowStepComparison {
  stepNumber: number;
  traditionalStep: string;
  traditionalConsequence: string;
  apexSolutionTitle: string;
  apexSolutionDescription: string;
  status: 'critical' | 'warning' | 'resolved';
}

export const WORKFLOW_PROBLEM_STEPS: WorkflowStepComparison[] = [
  {
    stepNumber: 1,
    traditionalStep: 'Client gives requirement',
    traditionalConsequence: 'Requirements buried in disparate Slack DMs, client emails, or verbal calls with only one person.',
    apexSolutionTitle: 'Centralized Requirement Anchoring',
    apexSolutionDescription: 'Client requirements & acceptance criteria are locked directly to the Project & Task ID, accessible to every engineer 24/7.',
    status: 'resolved',
  },
  {
    stepNumber: 2,
    traditionalStep: 'Employee receives task',
    traditionalConsequence: 'Assignee gets limited context; no historical record of why past architectural choices were made.',
    apexSolutionTitle: 'Context-Rich Task Assignment',
    apexSolutionDescription: 'Task comes pre-bundled with estimated hours, linked code repositories, file paths, and upstream dependencies.',
    status: 'resolved',
  },
  {
    stepNumber: 3,
    traditionalStep: 'Work starts',
    traditionalConsequence: 'Engineers start building without visibility into what other shift members or peers are touching.',
    apexSolutionTitle: 'Real-Time Working File Visibility',
    apexSolutionDescription: 'ApexTracker shows real-time working files, line additions/deletions, and active branches across the team.',
    status: 'resolved',
  },
  {
    stepNumber: 4,
    traditionalStep: 'Questions / changes / issues',
    traditionalConsequence: 'Edge cases arise, client requests last-minute adjustments, or bugs surface mid-sprint.',
    apexSolutionTitle: 'Public Decision & Question Threads',
    apexSolutionDescription: 'Questions and client changes are pinned to channel/task context threads instead of isolated 1-on-1 chats.',
    status: 'resolved',
  },
  {
    stepNumber: 5,
    traditionalStep: 'Information stays with individual',
    traditionalConsequence: 'CRITICAL FAILURE POINT: Tribal knowledge remains locked in one person\'s head or local scratchpads.',
    apexSolutionTitle: 'Living EOD Reports & Blocker Severity',
    apexSolutionDescription: 'Daily EOD reports capture blockers (Minor to Critical), completed items, and decisions before the engineer signs off.',
    status: 'critical',
  },
  {
    stepNumber: 6,
    traditionalStep: 'Employee changes shift / project',
    traditionalConsequence: 'Shift ends (or dev is reassigned). Next engineer arrives with zero briefing and broken momentum.',
    apexSolutionTitle: 'Structured Shift Handover Protocol',
    apexSolutionDescription: 'Automated Pass-Down Cards bridge shifts with 3 mandatory bullets: What\'s Done, What\'s Next, and Critical Gotchas.',
    status: 'critical',
  },
  {
    stepNumber: 7,
    traditionalStep: 'Another employee has to understand everything',
    traditionalConsequence: 'New dev spends 3-5 hours reading outdated code, asking repetitive questions, or guessing business logic.',
    apexSolutionTitle: 'Zero-Ramp-up Instant Handover Brief',
    apexSolutionDescription: 'Incoming engineer reviews the handover summary in 90 seconds, claims the task, and resumes code immediately.',
    status: 'warning',
  },
  {
    stepNumber: 8,
    traditionalStep: 'Time lost + mistakes + delays',
    traditionalConsequence: 'Missed deadlines, sprint slippage, regression bugs, and frustrated clients.',
    apexSolutionTitle: 'Dynamic Velocity & Deadline Recalibration',
    apexSolutionDescription: 'The Dynamic Deadline Engine flags risk proactively, while zero context loss maintains 100% team velocity.',
    status: 'resolved',
  },
];

export const INITIAL_HANDOVERS: ShiftHandover[] = [
  {
    id: 'sh-1',
    projectId: 'p-1',
    projectName: 'Apex Real-Time Collaboration Engine',
    taskId: 't-1',
    taskTitle: 'WebRTC Multi-Peer Mesh Signaling Architecture',
    clientRequirementSummary: 'Client requested sub-200ms latency for 8-person emergency war rooms with screen sharing enabled.',
    outgoingEmployeeId: 'u-1',
    outgoingEmployeeName: 'Alex Rivers',
    outgoingEmployeeRole: 'EMPLOYEE',
    incomingEmployeeId: 'u-5',
    incomingEmployeeName: 'Dr. Maya Lin',
    shiftFrom: 'Morning Shift (09:00 - 17:00)',
    shiftTo: 'Evening Shift (17:00 - 01:00)',
    status: 'PENDING_PICKUP',
    progressSummary: 'Completed STUN/TURN ICE candidate gathering and peer renegotiation in WebRTCGrid.tsx (145 lines added). Local mesh works reliably.',
    criticalQuestionsOrChanges: [
      'Client changed requirement: Firefox browser support must be guaranteed without extra plugins.',
      'Encountered CORS socket handshaking issue when joining channel under high socket packet frequency.'
    ],
    nextStepsForIncoming: 'Integrate the ICE retry fallback handler on line 64 of server.js and test multi-tab video stream with 4 peers.',
    gotchasAndWatchouts: 'Do NOT modify the socket.emit("warroom:alert") payload structure without updating the broadcast channel listeners.',
    createdTime: 'Today, 05:00 PM',
  },
  {
    id: 'sh-2',
    projectId: 'p-1',
    projectName: 'Apex Real-Time Collaboration Engine',
    taskId: 't-2',
    taskTitle: 'PostgreSQL Database Schema & Prisma ORM Migration',
    clientRequirementSummary: 'Multi-tenant database schema with role-based row security for Employee, Team Lead, and Manager audit vaults.',
    outgoingEmployeeId: 'u-4',
    outgoingEmployeeName: 'Devon Patel',
    outgoingEmployeeRole: 'EMPLOYEE',
    incomingEmployeeId: 'u-2',
    incomingEmployeeName: 'Marcus Vance',
    shiftFrom: 'Afternoon Shift (13:00 - 21:00)',
    shiftTo: 'Night Ops (21:00 - 05:00)',
    status: 'ACCEPTED',
    progressSummary: 'Wrote WarRoomAlert, PinnedMessage, and ProjectRisk models in schema.prisma. Verified cascade deletion on channels.',
    criticalQuestionsOrChanges: [
      'Lead approved storing dynamic deadline override reasons in overrideReason text column.'
    ],
    nextStepsForIncoming: 'Run Prisma migration index creation on projectId and userId foreign keys for high-throughput reads.',
    gotchasAndWatchouts: 'PostgreSQL database container requires SSL mode disable for local dev sandbox.',
    createdTime: 'Today, 04:30 PM',
    acceptedTime: 'Today, 04:45 PM',
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'CRSE-WEBRTC',
    title: 'WebRTC Multi-Peer Mesh Signaling & ICE Protocols',
    code: 'RTC-201',
    description: 'Master peer-to-peer data channels, STUN/TURN traversal, SDP renegotiation, and fault-tolerant mesh conferencing.',
    category: 'Infrastructure & Streaming',
    passScorePercentage: 80,
    deadlineDays: 7,
    durationHours: 6,
    prerequisiteForTaskType: 'WebRTC Video Grid & Screen Sharing',
    skillsAcquired: ['WebRTC Mesh', 'STUN/TURN NAT Traversal', 'SDP Handshaking', 'MediaStream API'],
    createdAt: '2026-08-01',
    questions: [
      {
        id: 'q-rtc-1',
        question: 'Which protocol is used by WebRTC to discover public IP addresses behind Symmetric NATs?',
        options: ['STUN (Session Traversal Utilities for NAT)', 'TURN (Traversal Using Relays around NAT)', 'DNS Over HTTPS', 'NTP Time Sync'],
        correctOptionIndex: 1,
        explanation: 'TURN relays media packets when symmetric NAT prevents direct peer-to-peer connections.',
      },
      {
        id: 'q-rtc-2',
        question: 'What triggers an renegotiation in an active WebRTC RTCPeerConnection?',
        options: ['Adding or removing a MediaStreamTrack', 'Changing client CSS theme', 'Socket disconnect from chat', 'Refreshing local storage'],
        correctOptionIndex: 0,
        explanation: 'Adding or removing audio/video tracks modifies SDP session descriptions, firing onnegotiationneeded.',
      },
      {
        id: 'q-rtc-3',
        question: 'In an 8-person mesh topology, how many bidirectional peer connections are created in total?',
        options: ['8 connections', '16 connections', '28 connections [n*(n-1)/2]', '64 connections'],
        correctOptionIndex: 2,
        explanation: 'Full mesh creates n*(n-1)/2 connections: 8*7/2 = 28 peer connections.',
      },
      {
        id: 'q-rtc-4',
        question: 'What is the recommended fallback if WebRTC ICE gathering fails completely?',
        options: ['Fall back to HTTP long polling or SFU relay stream', 'Crash the web application', 'Reload the entire OS', 'Send email attachments'],
        correctOptionIndex: 0,
        explanation: 'Falling back to an SFU/MCU relay ensures audio/video connectivity under restricted corporate firewalls.',
      },
    ],
  },
  {
    id: 'CRSE-NEXT16',
    title: 'Next.js 16 App Router & React 19 Concurrent Architecture',
    code: 'NXT-301',
    description: 'Deep-dive into Server Actions, Streaming SSR, React 19 useActionState, cacheLife tags, and high-velocity rendering.',
    category: 'Full-Stack Architecture',
    passScorePercentage: 80,
    deadlineDays: 10,
    durationHours: 8,
    prerequisiteForTaskType: 'Frontend Platform & WebRTC',
    skillsAcquired: ['Next.js 16 Server Components', 'React 19 Actions', 'Partial Prerendering', 'Turbopack'],
    createdAt: '2026-08-01',
    questions: [
      {
        id: 'q-nxt-1',
        question: 'In Next.js 16 App Router, what directive marks a file for client-side interactivity and hooks?',
        options: ['"use client"', '"use server"', '"use strict"', '"client-only"'],
        correctOptionIndex: 0,
        explanation: '"use client" establishes the boundary between Server Components and Client Components.',
      },
      {
        id: 'q-nxt-2',
        question: 'Which React 19 hook simplifies form handling with optimistic feedback and server responses?',
        options: ['useActionState', 'useMemo', 'useImperativeHandle', 'useLayoutEffect'],
        correctOptionIndex: 0,
        explanation: 'useActionState manages async actions, pending transitions, and updated state automatically.',
      },
      {
        id: 'q-nxt-3',
        question: 'What is the primary performance benefit of Streaming SSR with Suspense?',
        options: ['Renders fast parts of the UI immediately while async data streams in', 'Compresses images automatically', 'Disables CSS completely', 'Converts HTML to assembly'],
        correctOptionIndex: 0,
        explanation: 'Streaming allows critical layout elements to paint immediately before slower backend fetches resolve.',
      },
      {
        id: 'q-nxt-4',
        question: 'How does Next.js 16 handle route segment revalidation on-demand?',
        options: ['revalidatePath() or revalidateTag() in Server Actions', 'Restarting node server.js', 'Clearing browser cookies', 'Deleting node_modules'],
        correctOptionIndex: 0,
        explanation: 'revalidatePath and revalidateTag bust stale cache segments targeted by tags.',
      },
    ],
  },
  {
    id: 'CRSE-SEC',
    title: 'SOC2 Type II & PostgreSQL Role-Based Security Compliance',
    code: 'SEC-401',
    description: 'Enterprise data classification, row-level security (RLS), audit vault encryption, and least-privilege RBAC standards.',
    category: 'Cybersecurity & Compliance',
    passScorePercentage: 85,
    deadlineDays: 14,
    durationHours: 5,
    prerequisiteForTaskType: 'PostgreSQL Database Schema & Prisma ORM Migration',
    skillsAcquired: ['PostgreSQL RLS', 'SOC2 Trust Criteria', 'Audit Trail Logging', 'OWASP Top 10'],
    createdAt: '2026-08-01',
    questions: [
      {
        id: 'q-sec-1',
        question: 'Which principle dictates that users receive only the minimum permissions required for their job function?',
        options: ['Principle of Least Privilege (PoLP)', 'Open Door Access', 'Root By Default', 'Unrestricted Admin Mode'],
        correctOptionIndex: 0,
        explanation: 'PoLP minimizes potential attack surface by strictly confining privileges.',
      },
      {
        id: 'q-sec-2',
        question: 'In PostgreSQL, how do you prevent users from seeing rows belonging to another organization tenant?',
        options: ['Enable Row Level Security (RLS) policies', 'Store data in text files', 'Add public permissions', 'Drop the foreign keys'],
        correctOptionIndex: 0,
        explanation: 'PostgreSQL RLS enforces tenant separation at the database engine layer.',
      },
      {
        id: 'q-sec-3',
        question: 'What must be captured in an immutable audit ledger for compliance verification?',
        options: ['Timestamp, Actor ID, Target Resource, Action Type, and Status', 'Only employee avatars', 'Random hash strings', 'Only error codes'],
        correctOptionIndex: 0,
        explanation: 'Auditors require full traceability of who performed what action and when.',
      },
      {
        id: 'q-sec-4',
        question: 'How should sensitive credentials and database keys be managed in production?',
        options: ['Encrypted secrets manager / environment variables', 'Hardcoded in public Git commits', 'Sent via Slack direct message', 'Written on sticky notes'],
        correctOptionIndex: 0,
        explanation: 'Secrets managers provide secure injection and rotation of database credentials.',
      },
    ],
  },
  {
    id: 'CRSE-AGILE',
    title: 'Sprint Velocity Engineering & Dynamic Blocker Mitigation',
    code: 'OPS-101',
    description: 'Learn the mathematical foundations of velocity calculation, burndown forecasting, and high-impact EOD blocker escalation.',
    category: 'Leadership & Project Ops',
    passScorePercentage: 75,
    deadlineDays: 5,
    durationHours: 4,
    prerequisiteForTaskType: 'Sprint Leadership',
    skillsAcquired: ['Burndown Analysis', 'Velocity Calculations', 'Blocker Triage', 'Capacity Planning'],
    createdAt: '2026-08-01',
    questions: [
      {
        id: 'q-agl-1',
        question: 'How is Team Velocity calculated in ApexTracker?',
        options: ['(Estimated Work Completed) / (Logged Hours Spent)', 'Total team member count * 10', 'Number of Slack messages sent', 'Random number generation'],
        correctOptionIndex: 0,
        explanation: 'Velocity measures the ratio of estimated delivery value achieved versus time actually spent.',
      },
      {
        id: 'q-agl-2',
        question: 'When an employee logs a CRITICAL blocker in their daily EOD report, what should happen immediately?',
        options: ['Automated escalation to Team Lead and prompt War Room triage', 'Ignore until end of sprint', 'Delete the report', 'Increase task estimates 10x'],
        correctOptionIndex: 0,
        explanation: 'Critical blockers halt delivery and trigger immediate lead intervention to protect the baseline date.',
      },
      {
        id: 'q-agl-3',
        question: 'What is the primary indicator of project deadline slippage?',
        options: ['Calculated finish date drifting past baseline finish date', 'Team members taking coffee breaks', 'Adding comments to code', 'Having high test coverage'],
        correctOptionIndex: 0,
        explanation: 'When velocity drops, the projected date drifts forward past the committed baseline date.',
      },
      {
        id: 'q-agl-4',
        question: 'Why are structured shift pass-downs critical for sprint momentum?',
        options: ['They eliminate the 3-5 hour ramp-up penalty for the incoming engineer', 'They make the codebase look longer', 'They replace all documentation', 'They reduce git commits'],
        correctOptionIndex: 0,
        explanation: 'Pass-downs transfer living context, questions, and next steps in under 90 seconds.',
      },
    ],
  },
];

export const INITIAL_ENROLLMENTS: CourseEnrollment[] = [
  {
    id: 'enr-1',
    userId: 'u-4',
    userName: 'David Chen',
    userRole: 'EMPLOYEE',
    userDepartment: 'Cloud Infrastructure & SRE',
    courseId: 'CRSE-SEC',
    courseTitle: 'SOC2 Type II & PostgreSQL Role-Based Security Compliance',
    courseCode: 'SEC-401',
    assignedById: 'u-hr',
    assignedByName: 'Claire Underwood (HR)',
    status: 'PASSED',
    score: 95,
    attemptsCount: 1,
    completedAt: '2026-08-10',
    dueDate: '2026-08-15',
    enrolledAt: '2026-08-01',
    certificateId: 'cert-1',
    verificationCode: 'CERT-APEX-88412',
  },
  {
    id: 'enr-2',
    userId: 'u-5',
    userName: 'Dr. Maya Lin',
    userRole: 'EMPLOYEE',
    userDepartment: 'Artificial Intelligence & ML',
    courseId: 'CRSE-NEXT16',
    courseTitle: 'Next.js 16 App Router & React 19 Concurrent Architecture',
    courseCode: 'NXT-301',
    assignedById: 'u-2',
    assignedByName: 'Marcus Vance (TL)',
    status: 'PASSED',
    score: 90,
    attemptsCount: 1,
    completedAt: '2026-08-12',
    dueDate: '2026-08-18',
    enrolledAt: '2026-08-02',
    certificateId: 'cert-2',
    verificationCode: 'CERT-APEX-77190',
  },
  {
    id: 'enr-3',
    userId: 'u-1',
    userName: 'Alex Rivers',
    userRole: 'EMPLOYEE',
    userDepartment: 'Full-Stack & Frontend Platform',
    courseId: 'CRSE-WEBRTC',
    courseTitle: 'WebRTC Multi-Peer Mesh Signaling & ICE Protocols',
    courseCode: 'RTC-201',
    assignedById: 'u-2',
    assignedByName: 'Marcus Vance (TL)',
    status: 'IN_PROGRESS',
    attemptsCount: 1,
    dueDate: '2026-08-25',
    enrolledAt: '2026-08-10',
  },
  {
    id: 'enr-4',
    userId: 'u-1',
    userName: 'Alex Rivers',
    userRole: 'EMPLOYEE',
    userDepartment: 'Full-Stack & Frontend Platform',
    courseId: 'CRSE-NEXT16',
    courseTitle: 'Next.js 16 App Router & React 19 Concurrent Architecture',
    courseCode: 'NXT-301',
    assignedById: 'u-hr',
    assignedByName: 'Claire Underwood (HR)',
    status: 'NOT_STARTED',
    attemptsCount: 0,
    dueDate: '2026-08-30',
    enrolledAt: '2026-08-15',
  },
  {
    id: 'enr-5',
    userId: 'u-6',
    userName: 'James Sterling',
    userRole: 'EMPLOYEE',
    userDepartment: 'Cybersecurity & Compliance',
    courseId: 'CRSE-NEXT16',
    courseTitle: 'Next.js 16 App Router & React 19 Concurrent Architecture',
    courseCode: 'NXT-301',
    assignedById: 'u-hr',
    assignedByName: 'Claire Underwood (HR)',
    status: 'FAILED',
    score: 60,
    attemptsCount: 2,
    dueDate: '2026-08-14', // Overdue
    enrolledAt: '2026-08-01',
  },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    enrollmentId: 'enr-1',
    userId: 'u-4',
    userName: 'David Chen',
    courseId: 'CRSE-SEC',
    courseTitle: 'SOC2 Type II & PostgreSQL Role-Based Security Compliance',
    courseCode: 'SEC-401',
    verificationCode: 'CERT-APEX-88412',
    certificateUrl: '/certificates/cert-apex-88412.pdf',
    score: 95,
    issuedAt: '2026-08-10',
    expiresAt: '2028-08-10',
    signatoryName: 'Elena Rostova',
    signatoryRole: 'VP of Engineering Operations',
  },
  {
    id: 'cert-2',
    enrollmentId: 'enr-2',
    userId: 'u-5',
    userName: 'Dr. Maya Lin',
    courseId: 'CRSE-NEXT16',
    courseTitle: 'Next.js 16 App Router & React 19 Concurrent Architecture',
    courseCode: 'NXT-301',
    verificationCode: 'CERT-APEX-77190',
    certificateUrl: '/certificates/cert-apex-77190.pdf',
    score: 90,
    issuedAt: '2026-08-12',
    expiresAt: '2028-08-12',
    signatoryName: 'Marcus Vance',
    signatoryRole: 'Staff Full-Stack Lead',
  },
];

export const INITIAL_CLIENT_REQUIREMENTS: ClientRequirement[] = [
  {
    id: 'req-1',
    clientId: 'client-1',
    clientName: 'CyberDyne Global Logistics',
    projectId: 'p-1',
    projectName: 'Apex Platform Enterprise v2.0',
    title: 'Sub-200ms Latency for 8-Person Emergency War Rooms',
    description: 'Executive stakeholders require guaranteed real-time WebRTC mesh signaling with audio fallback and zero packet drop under high concurrent load.',
    priority: 'URGENT',
    status: 'IN_SPRINT',
    targetTaskId: 't-103',
    estimatedImpactHours: 40,
    requestedByContactName: 'Sarah Jenkins (VP Tech Ops)',
    requestedDate: '2026-08-01',
    targetReleaseSprint: 'Sprint 14',
    acceptanceCriteria: [
      'Peer-to-peer WebRTC connection negotiation finishes within 180ms',
      'Screen sharing supports 1080p 30fps without audio stuttering',
      'Immediate audio fallback when packet loss exceeds 8%'
    ]
  },
  {
    id: 'req-2',
    clientId: 'client-1',
    clientName: 'CyberDyne Global Logistics',
    projectId: 'p-1',
    projectName: 'Apex Platform Enterprise v2.0',
    title: 'Multi-Tenant PostgreSQL Row-Level Security for Shift Vaults',
    description: 'Ensure EOD reports and shift handover cards are strictly isolated between contractor groups and core staff with cryptographic audit trails.',
    priority: 'HIGH',
    status: 'APPROVED',
    targetTaskId: 't-101',
    estimatedImpactHours: 24,
    requestedByContactName: 'David Vance (Principal Architect)',
    requestedDate: '2026-08-04',
    targetReleaseSprint: 'Sprint 15',
    acceptanceCriteria: [
      'PostgreSQL RLS policies enforced on all handover and daily report queries',
      'Tamper-evident verification hash attached to every handover acceptance',
      'Audit log accessible to Manager & Compliance roles'
    ]
  },
  {
    id: 'req-3',
    clientId: 'client-2',
    clientName: 'Nexus FinTech Corp',
    projectId: 'p-2',
    projectName: 'AI Agent & Vector Search Pipeline',
    title: 'Sub-50ms Hybrid RAG Embedding Retrieval for Risk Alerts',
    description: 'Payment operations require autonomous risk scoring across millisecond financial event streams with Qdrant vector similarity scoring.',
    priority: 'URGENT',
    status: 'IN_SPRINT',
    targetTaskId: 't-201',
    estimatedImpactHours: 35,
    requestedByContactName: 'Alex Thorne (Chief Technology Officer)',
    requestedDate: '2026-08-02',
    targetReleaseSprint: 'Sprint 14',
    acceptanceCriteria: [
      'Cosine similarity lookup finishes in under 45ms at 50k QPS',
      'Fallback to keyword lexical search if vector service is degraded',
      'Zero hallucination tolerance on currency exchange risk parameters'
    ]
  },
  {
    id: 'req-4',
    clientId: 'client-3',
    clientName: 'BioPulse Health Technologies',
    projectId: 'p-1',
    projectName: 'Apex Platform Enterprise v2.0',
    title: 'HIPAA-Compliant Telehealth Session Auto-Purge',
    description: 'Any temporary media buffers created during emergency triage calls must be cryptographically shredded within 60 seconds of call termination.',
    priority: 'HIGH',
    status: 'NEW',
    estimatedImpactHours: 20,
    requestedByContactName: 'Dr. Aris Thorne (Chief Medical Officer)',
    requestedDate: '2026-08-14',
    targetReleaseSprint: 'Sprint 16',
    acceptanceCriteria: [
      'In-memory media buffer overwrites before garbage collection',
      'HIPAA compliance certificate generated on session end',
      'Strict zero-disk write policy for audio/video payloads'
    ]
  }
];

export const INITIAL_CLIENT_TICKETS: ClientTicket[] = [
  {
    id: 'tkt-1',
    clientId: 'client-2',
    clientName: 'Nexus FinTech Corp',
    projectId: 'p-2',
    title: 'Staging cluster intermittent WebSocket handshake disconnects',
    severity: 'MODERATE',
    status: 'INVESTIGATING',
    slaDeadline: '2026-08-20 18:00',
    slaRemainingMinutes: 145,
    assignedLead: 'David Chen',
    createdAt: '2026-08-20 10:15'
  },
  {
    id: 'tkt-2',
    clientId: 'client-1',
    clientName: 'CyberDyne Global Logistics',
    projectId: 'p-1',
    title: 'Screen sharing cursor desync in Chrome 128 during multi-peer session',
    severity: 'MINOR',
    status: 'OPEN',
    slaDeadline: '2026-08-22 12:00',
    slaRemainingMinutes: 1280,
    assignedLead: 'Alex Rivers',
    createdAt: '2026-08-19 16:40'
  }
];

export const INITIAL_CLIENTS: ClientAccount[] = [
  {
    id: 'client-1',
    name: 'CyberDyne Global Logistics',
    code: 'CD-LOG',
    industry: 'Autonomous Supply Chain & Fleet Telemetry',
    tier: 'ENTERPRISE',
    contractValueAnnual: 720000,
    slaUptimeTarget: 99.95,
    healthScore: 94,
    healthStatus: 'EXCELLENT',
    accountExecutive: 'Sophia Morales',
    dedicatedLead: 'Marcus Vance',
    activeProjectId: 'p-1',
    requirementsCount: 2,
    openTicketsCount: 1,
    nextSyncDate: 'Tomorrow, 10:00 AM EST',
    lastTouchpointSummary: 'Reviewed Sprint 14 WebRTC performance benchmarks. Client confirmed 140ms latency meets target.',
    contacts: [
      {
        id: 'c-101',
        name: 'Sarah Jenkins',
        role: 'VP of Technology Operations',
        email: 'sjenkins@cyberdyne-logistics.com',
        phone: '+1 (415) 890-2101',
        isPrimary: true
      },
      {
        id: 'c-102',
        name: 'David Vance',
        role: 'Principal Cloud Architect',
        email: 'dvance@cyberdyne-logistics.com',
        phone: '+1 (415) 890-2104',
        isPrimary: false
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Nexus FinTech Corp',
    code: 'NX-FIN',
    industry: 'High-Frequency Payments & AI Risk Clearing',
    tier: 'STRATEGIC',
    contractValueAnnual: 1250000,
    slaUptimeTarget: 99.99,
    healthScore: 78,
    healthStatus: 'NEEDS_ATTENTION',
    accountExecutive: 'Gregory Stone',
    dedicatedLead: 'Dr. Maya Lin',
    activeProjectId: 'p-2',
    requirementsCount: 1,
    openTicketsCount: 1,
    nextSyncDate: 'Thursday, 02:30 PM EST',
    lastTouchpointSummary: 'Concern raised regarding vector search embedding latency on high-frequency spikes. Ticket tkt-1 active.',
    contacts: [
      {
        id: 'c-201',
        name: 'Alex Thorne',
        role: 'Chief Technology Officer',
        email: 'athorne@nexusfintech.io',
        phone: '+1 (212) 555-8930',
        isPrimary: true
      },
      {
        id: 'c-202',
        name: 'Priya Patel',
        role: 'Head of Regulatory Compliance',
        email: 'ppatel@nexusfintech.io',
        phone: '+1 (212) 555-8938',
        isPrimary: false
      }
    ]
  },
  {
    id: 'client-3',
    name: 'BioPulse Health Technologies',
    code: 'BP-HLTH',
    industry: 'Digital Therapeutics & Telemedicine Mesh',
    tier: 'ENTERPRISE',
    contractValueAnnual: 540000,
    slaUptimeTarget: 99.95,
    healthScore: 98,
    healthStatus: 'EXCELLENT',
    accountExecutive: 'Sophia Morales',
    dedicatedLead: 'Elena Rostova',
    activeProjectId: 'p-1',
    requirementsCount: 1,
    openTicketsCount: 0,
    nextSyncDate: 'Next Tuesday, 11:00 AM EST',
    lastTouchpointSummary: 'HIPAA architecture review passed audit with zero findings. Client excited for v2.0 rollout.',
    contacts: [
      {
        id: 'c-301',
        name: 'Dr. Aris Thorne',
        role: 'Chief Medical Officer',
        email: 'athorne@biopulse.med',
        phone: '+1 (617) 495-2010',
        isPrimary: true
      }
    ]
  },
  {
    id: 'client-4',
    name: 'AeroDynamic Space Systems',
    code: 'AERO-SYS',
    industry: 'Satellite Ground Station Telemetry',
    tier: 'GROWTH',
    contractValueAnnual: 280000,
    slaUptimeTarget: 99.90,
    healthScore: 88,
    healthStatus: 'GOOD',
    accountExecutive: 'Gregory Stone',
    dedicatedLead: 'Marcus Vance',
    activeProjectId: 'p-1',
    requirementsCount: 0,
    openTicketsCount: 0,
    nextSyncDate: 'Aug 28, 04:00 PM EST',
    lastTouchpointSummary: 'Quarterly business review completed. Potential expansion into dedicated edge nodes for Q4.',
    contacts: [
      {
        id: 'c-401',
        name: 'Col. Raymond Shaw',
        role: 'Director of Flight Software',
        email: 'rshaw@aerodynamics.aero',
        phone: '+1 (303) 770-1920',
        isPrimary: true
      }
    ]
  }
];



