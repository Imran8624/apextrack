import { NextResponse } from 'next/server';
import { INITIAL_DAILY_REPORTS } from '@/lib/mockData';
import { DailyReport } from '@/types';

// In-memory store for API demonstration (persisted in DB with Prisma in production)
const reportsStore: DailyReport[] = [...INITIAL_DAILY_REPORTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    const filtered = reportsStore.filter((r) => r.projectId === projectId);
    return NextResponse.json({ success: true, data: filtered });
  }

  return NextResponse.json({ success: true, data: reportsStore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, userRole, projectId, projectName, taskId, taskTitle, hoursLogged, tasksCompleted, blockerDetails, blockerSeverity, fileAttachment } = body;

    if (!userId || !projectId || !hoursLogged || !tasksCompleted) {
      return NextResponse.json({ success: false, message: 'Missing required EOD report fields.' }, { status: 400 });
    }

    const newReport: DailyReport = {
      id: `rep-${Date.now()}`,
      userId,
      userName: userName || 'Employee',
      userRole: userRole || 'EMPLOYEE',
      projectId,
      projectName: projectName || 'Apex Platform Enterprise v2.0',
      taskId,
      taskTitle,
      hoursLogged: Number(hoursLogged),
      tasksCompleted,
      blockerDetails,
      blockerSeverity: blockerSeverity || 'NONE',
      fileAttachment,
      isApproved: false,
      submittedAt: new Date().toLocaleString()
    };

    reportsStore.unshift(newReport);

    return NextResponse.json({
      success: true,
      message: 'Daily EOD report submitted successfully.',
      data: newReport
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to process EOD report submission.' }, { status: 500 });
  }
}
