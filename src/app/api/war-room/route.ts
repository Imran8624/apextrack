import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userRole, userName, reason } = body;

    // RBAC check: only Team Leads & Managers can initiate War Room
    if (userRole !== 'TEAM_LEAD' && userRole !== 'MANAGER') {
      return NextResponse.json({
        success: false,
        message: 'Permission denied. War Room trigger is restricted to Team Leads & Managers.'
      }, { status: 403 });
    }

    const alertPayload = {
      id: `war-${Date.now()}`,
      triggeredBy: `${userName} (${userRole})`,
      reason: reason || 'Urgent production blocker requiring immediate team alignment.',
      startedAt: new Date().toLocaleTimeString(),
      active: true
    };

    return NextResponse.json({
      success: true,
      message: '🚨 Emergency War Room alert broadcasted across team.',
      alert: alertPayload
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to broadcast War Room emergency.' }, { status: 500 });
  }
}
