import { NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userRole, projectId, overrideFinishDate, overrideReason } = body;

    // RBAC Security Check
    if (userRole !== 'TEAM_LEAD' && userRole !== 'MANAGER') {
      return NextResponse.json({
        success: false,
        message: 'Forbidden: Only Team Leads and Managers can override project deadlines.'
      }, { status: 403 });
    }

    const project = INITIAL_PROJECTS.find((p) => p.id === projectId);
    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found.' }, { status: 404 });
    }

    project.overrideFinishDate = overrideFinishDate;
    project.overrideReason = overrideReason || 'Manual TL/Manager deadline override approved.';

    return NextResponse.json({
      success: true,
      message: `Project deadline overridden to ${overrideFinishDate} by ${userRole}.`,
      data: project
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to process deadline override.' }, { status: 500 });
  }
}
