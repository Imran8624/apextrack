export type UserRole = 'EMPLOYEE' | 'TEAM_LEAD' | 'MANAGER' | 'HR';

export type TrendingDepartment =
  | 'Artificial Intelligence & ML'
  | 'Full-Stack & Frontend Platform'
  | 'Cloud Infrastructure & SRE'
  | 'Cybersecurity & Compliance'
  | 'Product Experience & Design'
  | 'Data Engineering & Analytics'
  | 'Engineering Leadership & Ops'
  | 'People Operations & HR';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'BLOCKED' | 'DONE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type BlockerSeverity = 'NONE' | 'MINOR' | 'MODERATE' | 'CRITICAL';

export type ProjectRisk = 'ON_TRACK' | 'AT_RISK' | 'DELAYED';

export interface WorkingFile {
  id: string;
  fileName: string;
  filePath: string;
  folder: string;
  linesAdded: number;
  linesDeleted: number;
  lastUpdated: string;
  language: string;
  codeSnippet: string;
  taskTitle?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  department: TrendingDepartment | string;
  jobTitle?: string;
  isPinnedDM?: boolean;
  workingFiles?: WorkingFile[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  estimatedHours: number;
  loggedHours: number;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  assigneeName?: string;
  startDate: string;
  dueDate: string;
  progressPercent: number;
  requiredCourseId?: string;
  requiredCourseTitle?: string;
}


export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  baselineFinishDate: string;
  calculatedFinishDate: string;
  overrideFinishDate?: string;
  overrideReason?: string;
  targetVelocity: number;
  currentVelocity: number;
  riskStatus: ProjectRisk;
  totalEstimatedHours: number;
  completedHours: number;
  remainingHours: number;
  leadName: string;
  tasks: Task[];
  clientId?: string;
  clientName?: string;
  clientTier?: ClientTier;
  clientHealthScore?: number;
  slaUptimeTarget?: number;
}

export type ClientTier = 'ENTERPRISE' | 'STRATEGIC' | 'GROWTH' | 'STANDARD';
export type ClientHealth = 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL_RISK';
export type ClientRequirementStatus = 'NEW' | 'IN_SCOPING' | 'APPROVED' | 'IN_SPRINT' | 'DELIVERED' | 'REJECTED';
export type ClientTicketStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED_TO_WARROOM';

export interface ClientContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  isPrimary: boolean;
}

export interface ClientRequirement {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  priority: Priority;
  status: ClientRequirementStatus;
  targetTaskId?: string;
  estimatedImpactHours: number;
  requestedByContactName: string;
  requestedDate: string;
  targetReleaseSprint: string;
  acceptanceCriteria: string[];
}

export interface ClientTicket {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  title: string;
  severity: BlockerSeverity;
  status: ClientTicketStatus;
  slaDeadline: string;
  slaRemainingMinutes: number;
  assignedLead: string;
  createdAt: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  code: string;
  industry: string;
  tier: ClientTier;
  contractValueAnnual: number;
  slaUptimeTarget: number;
  healthScore: number;
  healthStatus: ClientHealth;
  accountExecutive: string;
  dedicatedLead: string;
  activeProjectId: string;
  contacts: ClientContact[];
  requirementsCount: number;
  openTicketsCount: number;
  nextSyncDate: string;
  lastTouchpointSummary: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userDepartment?: string;
  userJobTitle?: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  taskTitle?: string;
  hoursLogged: number;
  tasksCompleted: string;
  blockerDetails?: string;
  blockerSeverity: BlockerSeverity;
  fileAttachment?: string;
  fileSize?: string;
  submittedFiles?: WorkingFile[];
  isApproved: boolean;
  submittedAt: string;
}

export interface VelocityLogEntry {
  date: string;
  idealBurndown: number;
  actualBurndown: number;
  loggedHours: number;
  velocity: number;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderDepartment?: string;
  senderAvatar: string;
  content: string;
  sentAt: string;
  isPinned: boolean;
  fileAttachment?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  isEmergency: boolean;
  isDirectMessage?: boolean;
  dmUserId?: string;
  dmUserName?: string;
  membersCount: number;
  pinnedMessageCount: number;
}

export interface WarRoomState {
  isActive: boolean;
  isDirectCall?: boolean;
  callTargetName?: string;
  callTargetRole?: UserRole;
  triggeredBy: string;
  reason: string;
  startedAt: string;
  participants: {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
    hasVideo: boolean;
    isMuted: boolean;
    isScreenSharing: boolean;
  }[];
}

export interface ShiftHandover {
  id: string;
  projectId: string;
  projectName: string;
  taskId: string;
  taskTitle: string;
  clientRequirementSummary: string;
  outgoingEmployeeId: string;
  outgoingEmployeeName: string;
  outgoingEmployeeRole: UserRole;
  incomingEmployeeId?: string;
  incomingEmployeeName?: string;
  shiftFrom: string;
  shiftTo: string;
  status: 'PENDING_PICKUP' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
  progressSummary: string;
  criticalQuestionsOrChanges: string[];
  nextStepsForIncoming: string;
  gotchasAndWatchouts: string;
  createdTime: string;
  acceptedTime?: string;
}

export type EnrollmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'EXPIRED';

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  passScorePercentage: number;
  deadlineDays?: number;
  durationHours: number;
  prerequisiteForTaskType?: string;
  skillsAcquired: string[];
  questions: AssessmentQuestion[];
  createdAt: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userDepartment?: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  assignedById?: string;
  assignedByName?: string;
  status: EnrollmentStatus;
  score?: number;
  attemptsCount: number;
  completedAt?: string;
  dueDate?: string;
  enrolledAt: string;
  certificateId?: string;
  verificationCode?: string;
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  verificationCode: string;
  certificateUrl: string;
  score: number;
  issuedAt: string;
  expiresAt?: string;
  signatoryName: string;
  signatoryRole: string;
}


