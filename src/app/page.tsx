'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { AdminRegistrationHero } from '@/components/AdminRegistrationHero';
import { DynamicDeadlineWidget } from '@/components/DynamicDeadlineWidget';
import { EODReportForm } from '@/components/EODReportForm';
import { ProjectAnalytics } from '@/components/ProjectAnalytics';
import { ChatSuite } from '@/components/ChatSuite';
import { WarRoomModal } from '@/components/WarRoomModal';
import { FirstScreenOnboardingGateway } from '@/components/FirstScreenOnboardingGateway';
import { WorkflowContinuityHub } from '@/components/WorkflowContinuityHub';
import { LearningCertificationHub } from '@/components/LearningCertificationHub';
import { ClientCRMHub } from '@/components/ClientCRMHub';
import { ToastContainer, ToastMessage } from '@/components/ToastContainer';

import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_DAILY_REPORTS,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
  INITIAL_WAR_ROOM_STATE,
  INITIAL_HANDOVERS,
  INITIAL_COURSES,
  INITIAL_ENROLLMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_CLIENTS,
  INITIAL_CLIENT_REQUIREMENTS,
  INITIAL_CLIENT_TICKETS,
  getDMChannelId,
} from '@/lib/mockData';
import {
  UserRole,
  Project,
  DailyReport,
  Channel,
  Message,
  TaskStatus,
  WarRoomState,
  User,
  ShiftHandover,
  Course,
  CourseEnrollment,
  Certificate,
  ClientAccount,
  ClientRequirement,
  ClientTicket,
  ClientRequirementStatus,
} from '@/types';
import { calculateDynamicDeadline } from '@/lib/deadlineEngine';
import { io, Socket } from 'socket.io-client';

export default function DashboardHome() {
  const [currentRole, setCurrentRole] = useState<UserRole>('TEAM_LEAD');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Friendly Onboarding Gateway - Only shows once per session, or when clicking Help
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // In-App Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('apextracker_gateway_seen');
      if (!seen) {
        setShowAuthModal(true);
      }
    }
  }, []);

  const handleCloseAuthModal = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('apextracker_gateway_seen', 'true');
    }
    setShowAuthModal(false);
  };

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [reports, setReports] = useState<DailyReport[]>(INITIAL_DAILY_REPORTS);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);

  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [activeChannelId, setActiveChannelId] = useState<string>('c-1');
  const [warRoomState, setWarRoomState] = useState<WarRoomState>(INITIAL_WAR_ROOM_STATE);
  const [handovers, setHandovers] = useState<ShiftHandover[]>(INITIAL_HANDOVERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>(INITIAL_ENROLLMENTS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [clients, setClients] = useState<ClientAccount[]>(INITIAL_CLIENTS);
  const [clientRequirements, setClientRequirements] = useState<ClientRequirement[]>(INITIAL_CLIENT_REQUIREMENTS);
  const [clientTickets, setClientTickets] = useState<ClientTicket[]>(INITIAL_CLIENT_TICKETS);

  const socketRef = useRef<Socket | null>(null);

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Map Active RBAC Role to Sender Profile
  const getCurrentSenderProfile = () => {
    switch (currentRole) {
      case 'HR':
        return users.find((u) => u.role === 'HR') || { id: 'u-hr', name: 'Claire Underwood', role: 'HR' as UserRole, avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150', email: 'claire.hr@company.internal', department: 'People Operations & HR', jobTitle: 'Head of People Operations & Technical Learning' };
      case 'MANAGER':
        return users.find((u) => u.role === 'MANAGER') || { id: 'u-3', name: 'Elena Rostova', role: 'MANAGER' as UserRole, avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', email: 'elena@company.internal', department: 'Engineering Leadership & Ops', jobTitle: 'VP of Engineering Operations' };
      case 'TEAM_LEAD':
        return users.find((u) => u.role === 'TEAM_LEAD') || { id: 'u-2', name: 'Marcus Vance', role: 'TEAM_LEAD' as UserRole, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', email: 'marcus@company.internal', department: 'Full-Stack & Frontend Platform', jobTitle: 'Staff Full-Stack Lead' };
      default:
        return users.find((u) => u.role === 'EMPLOYEE') || { id: 'u-1', name: 'Alex Rivers', role: 'EMPLOYEE' as UserRole, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', email: 'alex@company.internal', department: 'Full-Stack & Frontend Platform', jobTitle: 'Senior WebRTC Engineer' };
    }
  };


  const currentUser = getCurrentSenderProfile();

  // Open Auth Modal with Mode
  const handleOpenAuthModal = (mode: 'signin' | 'signup' | 'admin' = 'admin') => {
    setShowAuthModal(true);
  };

  // Handle User & Admin Registration
  const handleRegisterUser = (newUser: { name: string; email: string; role: UserRole; department: string; jobTitle?: string; adminToken?: string }) => {
    const userId = `u-${Date.now()}`;
    const userObj: User = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: newUser.role === 'MANAGER'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        : newUser.role === 'TEAM_LEAD'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      role: newUser.role,
      department: newUser.department,
      jobTitle: newUser.jobTitle || `${newUser.role} Specialist`,
      isPinnedDM: true,
    };

    setUsers((prev) => [...prev, userObj]);
    setCurrentRole(newUser.role);

    if (newUser.role === 'TEAM_LEAD' || newUser.role === 'MANAGER') {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, leadName: newUser.name } : p))
      );
    }

    const newChannels: Channel[] = users.map((existingUser) => {
      const dmId = getDMChannelId(userId, existingUser.id);
      return {
        id: dmId,
        name: `${newUser.name} & ${existingUser.name}`,
        description: `Private 1-on-1 direct channel between ${newUser.name} and ${existingUser.name}`,
        isEmergency: false,
        isDirectMessage: true,
        membersCount: 2,
        pinnedMessageCount: 0,
      };
    });

    setChannels((prev) => [...prev, ...newChannels]);
    addToast('success', 'Profile Created', `Welcome aboard, ${newUser.name}! Logged in as ${newUser.role}.`);
    handleCloseAuthModal();
  };

  // Handle User Sign In
  const handleLoginUser = (email: string, role: UserRole) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentRole(existing.role);
      addToast('success', 'Welcome Back', `Logged in as ${existing.name} (${existing.role}).`);
    } else {
      setCurrentRole(role);
      addToast('success', 'Welcome', `Signed in as ${email} (${role}).`);
    }
    handleCloseAuthModal();
  };

  // Cross-Tab & Socket.io Real-Time Synchronization Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('apextracker_realtime_sync');
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'NEW_MESSAGE') {
          setMessages((prev) => {
            const existing = prev[payload.channelId] || [];
            if (existing.some((m) => m.id === payload.message.id)) return prev;
            return { ...prev, [payload.channelId]: [...existing, payload.message] };
          });
        } else if (type === 'PIN_MESSAGE') {
          setMessages((prev) => {
            const channelMsgs = prev[payload.channelId] || [];
            return {
              ...prev,
              [payload.channelId]: channelMsgs.map((m) =>
                m.id === payload.messageId ? { ...m, isPinned: payload.isPinned } : m
              ),
            };
          });
        } else if (type === 'WAR_ROOM_ALERT') {
          setWarRoomState((prev) => ({
            ...prev,
            isActive: true,
            isDirectCall: payload.isDirectCall || false,
            callTargetName: payload.callTargetName,
            triggeredBy: payload.triggeredBy,
            reason: payload.reason,
            startedAt: new Date().toLocaleTimeString(),
          }));
        } else if (type === 'NEW_EOD_REPORT') {
          setReports((prev) => [payload.report, ...prev]);
        }
      };
    }

    try {
      const socket = io(typeof window !== 'undefined' ? window.location.origin : '', {
        transports: ['websocket', 'polling'],
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on('message:received', (message: Message) => {
        setMessages((prev) => {
          const existing = prev[message.channelId] || [];
          if (existing.some((m) => m.id === message.id)) return prev;
          return { ...prev, [message.channelId]: [...existing, message] };
        });
      });

      socket.on('message:pinned', (data: { channelId: string; messageId: string; isPinned: boolean }) => {
        setMessages((prev) => {
          const channelMsgs = prev[data.channelId] || [];
          return {
            ...prev,
            [data.channelId]: channelMsgs.map((m) =>
              m.id === data.messageId ? { ...m, isPinned: data.isPinned } : m
            ),
          };
        });
      });

      socket.on('warroom:alert', (data: { triggeredBy: string; reason: string; isDirectCall?: boolean; callTargetName?: string }) => {
        setWarRoomState((prev) => ({
          ...prev,
          isActive: true,
          isDirectCall: data.isDirectCall || false,
          callTargetName: data.callTargetName,
          triggeredBy: data.triggeredBy,
          reason: data.reason,
          startedAt: new Date().toLocaleTimeString(),
        }));
      });
    } catch (e) {
      console.warn('Socket connection fallback to BroadcastChannel.');
    }

    return () => {
      broadcastChannelRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, []);

  // Dynamic Deadline Calculation Result for the active selected project
  const deadlineCalc = calculateDynamicDeadline(activeProject, reports);

  // Toggle Pinned Person for Direct Messaging (1-on-1)
  const handleTogglePinUserDM = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isPinnedDM: !u.isPinnedDM } : u))
    );
  };

  // Handle EOD Report Submission
  const handleReportSubmit = (newReportData: Partial<DailyReport>) => {
    const sender = getCurrentSenderProfile();
    const newReport: DailyReport = {
      id: `rep-${Date.now()}`,
      userId: sender.id,
      userName: sender.name,
      userRole: sender.role,
      userDepartment: sender.department,
      userJobTitle: sender.jobTitle,
      projectId: newReportData.projectId || activeProject.id,
      projectName: newReportData.projectName || activeProject.name,
      taskId: newReportData.taskId,
      taskTitle: newReportData.taskTitle,
      hoursLogged: newReportData.hoursLogged || 7.5,
      tasksCompleted: newReportData.tasksCompleted || '',
      blockerDetails: newReportData.blockerDetails,
      blockerSeverity: newReportData.blockerSeverity || 'NONE',
      fileAttachment: newReportData.fileAttachment,
      isApproved: currentRole !== 'EMPLOYEE',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);

    broadcastChannelRef.current?.postMessage({ type: 'NEW_EOD_REPORT', payload: { report: newReport } });
    socketRef.current?.emit('report:submit', newReport);

    const updatedCalc = calculateDynamicDeadline(activeProject, updatedReports);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              currentVelocity: updatedCalc.currentVelocity,
              calculatedFinishDate: updatedCalc.calculatedFinishDate,
              riskStatus: updatedCalc.riskStatus,
              remainingHours: updatedCalc.remainingHours,
            }
          : p
      )
    );
  };

  // Handle Report Approval (TL / Manager)
  const handleApproveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, isApproved: true } : r))
    );
  };

  // Handle Manual Deadline Override (TL / Manager)
  const handleOverrideDeadline = (projectId: string, newDate: string, reason: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, overrideFinishDate: newDate, overrideReason: reason }
          : p
      )
    );
  };

  // Handle Task Status Change in Kanban / Analytics
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === activeProject.id) {
          const updatedTasks = p.tasks.map((t) => {
            if (t.id === taskId) {
              const progressPercent = newStatus === 'DONE' ? 100 : t.progressPercent;
              return { ...t, status: newStatus, progressPercent };
            }
            return t;
          });
          return { ...p, tasks: updatedTasks };
        }
        return p;
      })
    );
  };

  // Handle Real-Time Chat Message Sending
  const handleSendMessage = (channelId: string, content: string, fileAttachment?: string) => {
    const sender = getCurrentSenderProfile();
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      senderDepartment: sender.department,
      senderAvatar: sender.avatarUrl,
      content,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPinned: false,
      fileAttachment,
    };

    setMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMessage],
    }));

    broadcastChannelRef.current?.postMessage({
      type: 'NEW_MESSAGE',
      payload: { channelId, message: newMessage },
    });
    socketRef.current?.emit('send:message', newMessage);
  };

  // Handle Pinning Message
  const handleTogglePinMessage = (channelId: string, messageId: string) => {
    let nextPinnedState = false;
    setMessages((prev) => {
      const channelMsgs = prev[channelId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id === messageId) {
          nextPinnedState = !m.isPinned;
          return { ...m, isPinned: nextPinnedState };
        }
        return m;
      });
      return { ...prev, [channelId]: updated };
    });

    broadcastChannelRef.current?.postMessage({
      type: 'PIN_MESSAGE',
      payload: { channelId, messageId, isPinned: nextPinnedState },
    });
    socketRef.current?.emit('pin:message', { channelId, messageId, isPinned: nextPinnedState });

    setChannels((prev) =>
      prev.map((c) => {
        if (c.id === channelId) {
          const count = (messages[channelId] || []).filter((m) =>
            m.id === messageId ? nextPinnedState : m.isPinned
          ).length;
          return { ...c, pinnedMessageCount: count };
        }
        return c;
      })
    );
  };

  // Trigger Emergency War Room (Group Call)
  const handleTriggerWarRoom = () => {
    const sender = getCurrentSenderProfile();
    const reason = 'Production Latency Spike & WebRTC Network blockage resolution.';

    setWarRoomState((prev) => ({
      ...prev,
      isActive: true,
      isDirectCall: false,
      triggeredBy: `${sender.name} (${sender.role})`,
      reason,
      startedAt: new Date().toLocaleTimeString(),
      participants: INITIAL_WAR_ROOM_STATE.participants,
    }));

    broadcastChannelRef.current?.postMessage({
      type: 'WAR_ROOM_ALERT',
      payload: { triggeredBy: `${sender.name} (${sender.role})`, reason, isDirectCall: false },
    });
    socketRef.current?.emit('trigger:warroom', { triggeredBy: `${sender.name} (${sender.role})`, reason });
  };

  // Trigger Direct 1-on-1 Call with Pinned Contact
  const handleStartDirectCall = (targetUser: User) => {
    const sender = getCurrentSenderProfile();
    const reason = `Private 1-on-1 Audio/Video Call session with ${targetUser.name}`;

    setWarRoomState({
      isActive: true,
      isDirectCall: true,
      callTargetName: targetUser.name,
      callTargetRole: targetUser.role,
      triggeredBy: `${sender.name} (${sender.role})`,
      reason,
      startedAt: new Date().toLocaleTimeString(),
      participants: [
        { id: sender.id, name: sender.name, role: sender.role, avatar: sender.avatarUrl, hasVideo: true, isMuted: false, isScreenSharing: false },
        { id: targetUser.id, name: targetUser.name, role: targetUser.role, avatar: targetUser.avatarUrl, hasVideo: true, isMuted: false, isScreenSharing: false }
      ]
    });

    broadcastChannelRef.current?.postMessage({
      type: 'WAR_ROOM_ALERT',
      payload: { triggeredBy: `${sender.name} (${sender.role})`, reason, isDirectCall: true, callTargetName: targetUser.name },
    });
    socketRef.current?.emit('trigger:warroom', { triggeredBy: `${sender.name} (${sender.role})`, reason, isDirectCall: true, callTargetName: targetUser.name });
  };

  // Shift Handover Claim & Acceptance Handler
  const handleAcceptHandover = (handoverId: string) => {
    const sender = getCurrentSenderProfile();
    setHandovers((prev) =>
      prev.map((h) =>
        h.id === handoverId
          ? {
              ...h,
              status: 'ACCEPTED',
              incomingEmployeeId: sender.id,
              incomingEmployeeName: sender.name,
              acceptedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : h
      )
    );
    addToast('success', 'Handover Acknowledged', `${sender.name} accepted the shift briefing and took active ownership.`);
  };

  // Create New Shift Handover Brief
  const handleCreateHandover = (newHandover: Omit<ShiftHandover, 'id' | 'createdTime' | 'status'>) => {
    const handoverObj: ShiftHandover = {
      ...newHandover,
      id: `sh-${Date.now()}`,
      status: 'PENDING_PICKUP',
      createdTime: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setHandovers((prev) => [handoverObj, ...prev]);
    addToast('success', 'Shift Continuity Logged', 'Handover brief saved to ledger. Next shift alerted.');
  };

  // Learning Engine: Pass Assessment & Issue Verifiable Certificate
  const handlePassCourse = (courseId: string, score: number) => {
    const sender = getCurrentSenderProfile();
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const verificationCode = `CERT-APEX-${Math.floor(10000 + Math.random() * 90000)}`;
    const certId = `cert-${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const newCert: Certificate = {
      id: certId,
      enrollmentId: `enr-${Date.now()}`,
      userId: sender.id,
      userName: sender.name,
      courseId: course.id,
      courseTitle: course.title,
      courseCode: course.code,
      verificationCode,
      certificateUrl: `/certificates/${verificationCode.toLowerCase()}.pdf`,
      score,
      issuedAt: todayStr,
      signatoryName: currentRole === 'MANAGER' ? 'Elena Rostova' : 'Marcus Vance',
      signatoryRole: currentRole === 'MANAGER' ? 'VP of Engineering Operations' : 'Staff Technical Lead',
    };

    setCertificates((prev) => [newCert, ...prev]);

    setEnrollments((prev) => {
      const existing = prev.find((e) => e.userId === sender.id && e.courseId === courseId);
      if (existing) {
        return prev.map((e) =>
          e.id === existing.id
            ? {
                ...e,
                status: 'PASSED',
                score,
                completedAt: todayStr,
                certificateId: certId,
                verificationCode,
                attemptsCount: e.attemptsCount + 1,
              }
            : e
        );
      }
      return [
        {
          id: `enr-${Date.now()}`,
          userId: sender.id,
          userName: sender.name,
          userRole: sender.role,
          userDepartment: sender.department,
          courseId: course.id,
          courseTitle: course.title,
          courseCode: course.code,
          status: 'PASSED',
          score,
          attemptsCount: 1,
          completedAt: todayStr,
          enrolledAt: todayStr,
          certificateId: certId,
          verificationCode,
        },
        ...prev,
      ];
    });

    const alertPayload = {
      userId: sender.id,
      userName: sender.name,
      courseTitle: course.title,
      score,
      verificationCode,
    };

    broadcastChannelRef.current?.postMessage({
      type: 'COURSE_PASSED_ALERT',
      payload: alertPayload,
    });
    socketRef.current?.emit('course:passed', alertPayload);
    addToast('success', 'Certification Earned!', `Scored ${score}% on "${course.title}". Certificate code: ${verificationCode}`);
  };

  // Learning Engine: Fail Assessment & Log Retake
  const handleFailCourse = (courseId: string, score: number) => {
    const sender = getCurrentSenderProfile();
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    setEnrollments((prev) => {
      const existing = prev.find((e) => e.userId === sender.id && e.courseId === courseId);
      if (existing) {
        return prev.map((e) =>
          e.id === existing.id
            ? {
                ...e,
                status: 'FAILED',
                score,
                attemptsCount: e.attemptsCount + 1,
              }
            : e
        );
      }
      return [
        {
          id: `enr-${Date.now()}`,
          userId: sender.id,
          userName: sender.name,
          userRole: sender.role,
          userDepartment: sender.department,
          courseId: course.id,
          courseTitle: course.title,
          courseCode: course.code,
          status: 'FAILED',
          score,
          attemptsCount: 1,
          enrolledAt: new Date().toISOString().split('T')[0],
        },
        ...prev,
      ];
    });

    const alertPayload = {
      userId: sender.id,
      userName: sender.name,
      courseTitle: course.title,
      score,
    };

    broadcastChannelRef.current?.postMessage({
      type: 'COURSE_FAILED_ALERT',
      payload: alertPayload,
    });
    socketRef.current?.emit('course:failed', alertPayload);
    addToast('warning', 'Retake Required', `Scored ${score}% on "${course.title}". Passing score is ${course.passScorePercentage}%. Feedback generated.`);
  };

  // Learning Engine: Assign Course to Team Member (TL, HR, Manager)
  const handleAssignCourse = (targetUserId: string, courseId: string, dueDateDays: number) => {
    const sender = getCurrentSenderProfile();
    const targetUser = users.find((u) => u.id === targetUserId);
    const course = courses.find((c) => c.id === courseId);
    if (!targetUser || !course) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDateDays);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    const newEnrollment: CourseEnrollment = {
      id: `enr-${Date.now()}`,
      userId: targetUser.id,
      userName: targetUser.name,
      userRole: targetUser.role,
      userDepartment: targetUser.department,
      courseId: course.id,
      courseTitle: course.title,
      courseCode: course.code,
      assignedById: sender.id,
      assignedByName: `${sender.name} (${sender.role})`,
      status: 'NOT_STARTED',
      attemptsCount: 0,
      dueDate: dueDateStr,
      enrolledAt: todayStr,
    };

    setEnrollments((prev) => [newEnrollment, ...prev]);

    socketRef.current?.emit('course:assigned', {
      targetUserName: targetUser.name,
      courseTitle: course.title,
      assignedBy: sender.name,
    });
    addToast('success', 'Course Assigned', `Assigned "${course.title}" to ${targetUser.name} (Due in ${dueDateDays} days).`);
  };

  // Learning Engine: Send Remedial Reminder Notice
  const handleSendReminder = (enrollmentId: string) => {
    const enr = enrollments.find((e) => e.id === enrollmentId);
    if (!enr) return;
    addToast('info', 'Remedial Reminder Dispatched', `Urgent reminder notification dispatched to ${enr.userName} for "${enr.courseTitle}".`);
  };

  // CRM: Anchor New Client Requirement
  const handleCreateClientRequirement = (reqData: Omit<ClientRequirement, 'id' | 'requestedDate'>) => {
    const newReq: ClientRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      requestedDate: new Date().toISOString().split('T')[0],
    };
    setClientRequirements((prev) => [newReq, ...prev]);
    setClients((prev) =>
      prev.map((c) => (c.id === reqData.clientId ? { ...c, requirementsCount: c.requirementsCount + 1 } : c))
    );
    addToast('success', 'Client Scope Anchored', `Requirement "${newReq.title}" anchored to ${newReq.targetReleaseSprint}.`);
  };

  // CRM: Update Requirement Status
  const handleUpdateRequirementStatus = (id: string, status: ClientRequirementStatus) => {
    setClientRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    addToast('info', 'Requirement Updated', `Status set to ${status}.`);
  };

  // CRM: Escalate Client SLA Incident Ticket to Emergency War Room
  const handleEscalateTicketToWarRoom = (ticket: ClientTicket) => {
    const sender = getCurrentSenderProfile();
    const reason = `[CLIENT SLA ESCALATION] ${ticket.clientName} (${ticket.title}) - Severity: ${ticket.severity}`;

    setWarRoomState((prev) => ({
      ...prev,
      isActive: true,
      isDirectCall: false,
      triggeredBy: `${sender.name} (${sender.role})`,
      reason,
      startedAt: new Date().toLocaleTimeString(),
      participants: INITIAL_WAR_ROOM_STATE.participants,
    }));

    setClientTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: 'ESCALATED_TO_WARROOM' } : t))
    );

    broadcastChannelRef.current?.postMessage({
      type: 'WAR_ROOM_ALERT',
      payload: { triggeredBy: `${sender.name} (${sender.role})`, reason, isDirectCall: false },
    });
    socketRef.current?.emit('trigger:warroom', { triggeredBy: `${sender.name} (${sender.role})`, reason });
    addToast('warning', 'Emergency Escalation Triggered', `War Room launched for client ticket: ${ticket.title}`);
  };

  // CRM: Resolve Client Ticket
  const handleResolveTicket = (ticketId: string) => {
    setClientTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
    );
    addToast('success', 'Ticket Resolved', `Client SLA ticket marked resolved.`);
  };

  // Quick Persona Role Switcher with instant feedback
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const roleLabels: Record<UserRole, string> = {
      EMPLOYEE: 'Software Engineer (Alex Rivers)',
      TEAM_LEAD: 'Team Lead (Marcus Vance)',
      MANAGER: 'Engineering Ops (Elena Rostova)',
      HR: 'Head of People & HR (Claire Underwood)',
    };
    addToast('info', 'Active Persona Switched', `Now viewing ApexTracker as ${roleLabels[newRole] || newRole}.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar Header */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onTriggerWarRoom={handleTriggerWarRoom}
        isWarRoomActive={warRoomState.isActive}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* OPTION 1: Overview & Dynamic Deadline Engine - Opens ONLY this */}
        {activeTab === 'dashboard' && (
          <DynamicDeadlineWidget
            project={{
              ...activeProject,
              currentVelocity: deadlineCalc.currentVelocity,
              calculatedFinishDate: deadlineCalc.calculatedFinishDate,
              riskStatus: deadlineCalc.riskStatus,
              remainingHours: deadlineCalc.remainingHours,
            }}
            currentRole={currentRole}
            onOverrideDeadline={handleOverrideDeadline}
            onNavigateToCRM={() => setActiveTab('crm')}
          />
        )}

        {activeTab === 'reporting' && (
          <EODReportForm
            projects={projects}
            reports={reports.filter(r => r.projectId === activeProjectId)}
            currentRole={currentRole}
            onSubmitReport={handleReportSubmit}
            onApproveReport={handleApproveReport}
          />
        )}

        {activeTab === 'analytics' && (
          <ProjectAnalytics
            project={activeProject}
            velocityTrend={deadlineCalc.velocityTrend}
            users={users}
            onTaskStatusChange={handleTaskStatusChange}
          />
        )}

        {activeTab === 'chat' && (
          <ChatSuite
            channels={channels}
            messages={messages}
            users={users}
            currentRole={currentRole}
            activeChannelId={activeChannelId}
            activeProject={activeProject}
            onSelectChannel={setActiveChannelId}
            onSendMessage={handleSendMessage}
            onTogglePinMessage={handleTogglePinMessage}
            onTogglePinUserDM={handleTogglePinUserDM}
            onStartCall={handleTriggerWarRoom}
            onStartDirectCall={handleStartDirectCall}
          />
        )}

        {activeTab === 'continuity' && (
          <WorkflowContinuityHub
            currentRole={currentRole}
            currentUser={currentUser}
            projects={projects}
            activeProjectId={activeProjectId}
            handovers={handovers}
            onAcceptHandover={handleAcceptHandover}
            onCreateHandover={handleCreateHandover}
          />
        )}

        {activeTab === 'learning' && (
          <LearningCertificationHub
            currentRole={currentRole}
            currentUser={currentUser}
            users={users}
            courses={courses}
            enrollments={enrollments}
            certificates={certificates}
            tasks={activeProject.tasks}
            onTakeAssessment={() => {}}
            onPassCourse={handlePassCourse}
            onFailCourse={handleFailCourse}
            onAssignCourse={handleAssignCourse}
            onSendReminder={handleSendReminder}
          />
        )}

        {/* Client CRM Hub: Stakeholder Requirements, Contracts, & SLA Tickets */}
        {activeTab === 'crm' && (
          <ClientCRMHub
            currentRole={currentRole}
            clients={clients}
            requirements={clientRequirements}
            tickets={clientTickets}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onCreateRequirement={handleCreateClientRequirement}
            onUpdateRequirementStatus={handleUpdateRequirementStatus}
            onEscalateTicketToWarRoom={handleEscalateTicketToWarRoom}
            onResolveTicket={handleResolveTicket}
          />
        )}
      </main>

      {/* FIRST SCREEN ONBOARDING GATEWAY (Launches immediately on 1st website open) */}
      {showAuthModal && (
        <FirstScreenOnboardingGateway
          currentRole={currentRole}
          currentUserName={currentUser.name}
          onLogin={handleLoginUser}
          onRegister={handleRegisterUser}
          onClose={handleCloseAuthModal}
        />
      )}

      {/* Emergency Escalation War Room / Direct 1-on-1 WebRTC Video Canvas */}
      {warRoomState.isActive && (
        <WarRoomModal
          warRoomState={warRoomState}
          currentRole={currentRole}
          onClose={() => setWarRoomState((prev) => ({ ...prev, isActive: false }))}
        />
      )}

      {/* Modern Non-Blocking In-App Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
