import { NextResponse } from 'next/server';
import { INITIAL_PROJECTS, INITIAL_DAILY_REPORTS } from '@/lib/mockData';
import { calculateDynamicDeadline } from '@/lib/deadlineEngine';

export async function GET() {
  const projects = INITIAL_PROJECTS.map((project) => {
    const calc = calculateDynamicDeadline(project, INITIAL_DAILY_REPORTS);
    return {
      ...project,
      currentVelocity: calc.currentVelocity,
      calculatedFinishDate: calc.calculatedFinishDate,
      riskStatus: calc.riskStatus,
      daysDifference: calc.daysDifference,
      riskExplanation: calc.riskExplanation
    };
  });

  return NextResponse.json({ success: true, data: projects });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, projectId, taskId, status, progressPercent } = body;

    if (action === 'updateTaskStatus') {
      const project = INITIAL_PROJECTS.find(p => p.id === projectId);
      if (project) {
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = status;
          if (progressPercent !== undefined) {
            task.progressPercent = progressPercent;
          }
          if (status === 'DONE') {
            task.progressPercent = 100;
          }
        }

        // Recalculate dynamic deadline
        const calculation = calculateDynamicDeadline(project, INITIAL_DAILY_REPORTS);
        project.calculatedFinishDate = calculation.calculatedFinishDate;
        project.currentVelocity = calculation.currentVelocity;
        project.riskStatus = calculation.riskStatus;

        return NextResponse.json({
          success: true,
          message: 'Task updated & project deadline dynamically recalculated.',
          project,
          calculation
        });
      }
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error updating project.' }, { status: 500 });
  }
}
