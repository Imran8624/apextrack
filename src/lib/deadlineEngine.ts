import { Project, DailyReport, ProjectRisk, VelocityLogEntry, Task, Certificate } from '@/types';


export interface CalculationResult {
  currentVelocity: number;
  remainingHours: number;
  calculatedFinishDate: string;
  daysDifference: number; // difference from baseline finish date in days
  riskStatus: ProjectRisk;
  velocityTrend: VelocityLogEntry[];
  riskExplanation: string;
}

/**
 * Dynamic Deadline Calculation Engine
 * Automatically recalculates project finish dates based on daily employee updates & velocity.
 */
export function calculateDynamicDeadline(
  project: Project,
  reports: DailyReport[],
  teamMemberCount: number = 4,
  dailyHoursCapacityPerMember: number = 7.5
): CalculationResult {
  // Filter reports for this project
  const projectReports = reports.filter((r) => r.projectId === project.id);

  // Calculate total hours logged across all daily reports
  const totalLoggedHours = projectReports.reduce((sum, r) => sum + r.hoursLogged, 0);

  // Calculate completed estimated hours based on tasks marked DONE or percentage completed
  const completedTaskHours = project.tasks.reduce((sum, task) => {
    if (task.status === 'DONE') {
      return sum + task.estimatedHours;
    }
    return sum + (task.estimatedHours * (task.progressPercent / 100));
  }, 0);

  // Remaining estimated work in hours
  const remainingHours = Math.max(0, project.totalEstimatedHours - completedTaskHours);

  // Calculate current team velocity: (Estimated Work Completed) / (Logged Hours Spent)
  const rawVelocity = totalLoggedHours > 0 ? completedTaskHours / totalLoggedHours : project.targetVelocity;
  // Normalize velocity between 0.35 and 2.2 for realistic calculation bounds
  const currentVelocity = Math.max(0.35, Math.min(2.2, Number(rawVelocity.toFixed(2))));

  // Effective daily team throughput in hours
  const dailyTeamThroughput = teamMemberCount * dailyHoursCapacityPerMember * currentVelocity;

  // Working days required to finish remaining work
  const workingDaysNeeded = Math.ceil(remainingHours / (dailyTeamThroughput || 1));

  // Add working days to current date (skipping weekends)
  const today = new Date();
  const calculatedDate = new Date(today);
  let daysAdded = 0;
  while (daysAdded < workingDaysNeeded) {
    calculatedDate.setDate(calculatedDate.getDate() + 1);
    // Skip Saturday (6) and Sunday (0)
    if (calculatedDate.getDay() !== 0 && calculatedDate.getDay() !== 6) {
      daysAdded++;
    }
  }

  const calculatedFinishDateStr = calculatedDate.toISOString().split('T')[0];
  const baselineDate = new Date(project.baselineFinishDate);

  // Difference in calendar days between baseline and calculated
  const timeDiffMs = calculatedDate.getTime() - baselineDate.getTime();
  const daysDifference = Math.round(timeDiffMs / (1000 * 3600 * 24));

  // Determine Project Risk Status
  let riskStatus: ProjectRisk = 'ON_TRACK';
  let riskExplanation = 'Project is progressing according to schedule velocity.';

  if (daysDifference > 5 || currentVelocity < 0.7) {
    riskStatus = 'DELAYED';
    riskExplanation = `High risk! Team velocity (${currentVelocity}x) is below target (1.0x). Completion delayed by ${daysDifference} days.`;
  } else if (daysDifference > 1 || currentVelocity < 0.95) {
    riskStatus = 'AT_RISK';
    riskExplanation = `Moderate risk: Project is estimated to finish ${daysDifference} day(s) after baseline due to minor blocker overhead.`;
  }

  // Check critical blockers in recent reports
  const criticalBlockers = projectReports.filter(r => r.blockerSeverity === 'CRITICAL' || r.blockerSeverity === 'MODERATE');
  if (criticalBlockers.length > 0 && riskStatus === 'ON_TRACK') {
    riskStatus = 'AT_RISK';
    riskExplanation = `Warning: ${criticalBlockers.length} active blocker(s) logged in daily EOD reports require immediate manager intervention.`;
  }

  // Generate 7-day velocity and burndown trend chart data
  const velocityTrend: VelocityLogEntry[] = [];
  const daysHistory = 7;
  const initialWork = project.totalEstimatedHours;
  
  for (let i = daysHistory - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const idealBurndown = Math.max(0, Math.round(initialWork - ((daysHistory - i) * (initialWork / daysHistory))));
    const actualBurndown = Math.max(0, Math.round(remainingHours + (i * 4 * (1.2 - currentVelocity))));
    const logged = Math.round(teamMemberCount * dailyHoursCapacityPerMember * (0.8 + Math.random() * 0.4));
    const vel = Number((0.75 + (daysHistory - i) * 0.05 * currentVelocity).toFixed(2));

    velocityTrend.push({
      date: dateStr.slice(5), // MM-DD
      idealBurndown,
      actualBurndown,
      loggedHours: logged,
      velocity: Math.min(2.0, vel)
    });
  }

  return {
    currentVelocity,
    remainingHours: Math.round(remainingHours),
    calculatedFinishDate: calculatedFinishDateStr,
    daysDifference,
    riskStatus,
    velocityTrend,
    riskExplanation
  };
}

export interface TaskPrerequisiteCheck {
  isEligible: boolean;
  requiredCourseTitle?: string;
  hasCertificate: boolean;
  certificateVerificationCode?: string;
}

/**
 * Checks whether an assignee holds the required certification to work on a task.
 * Used by Team Leads and Managers before dispatching specialized task types.
 */
export function checkTaskPrerequisites(
  task: Task,
  certificates: Certificate[]
): TaskPrerequisiteCheck {
  if (!task.requiredCourseId) {
    return { isEligible: true, hasCertificate: true };
  }

  const matchingCert = certificates.find(
    (c) => c.courseId === task.requiredCourseId && c.userId === task.assigneeId
  );

  if (matchingCert) {
    return {
      isEligible: true,
      hasCertificate: true,
      requiredCourseTitle: task.requiredCourseTitle,
      certificateVerificationCode: matchingCert.verificationCode,
    };
  }

  return {
    isEligible: false,
    hasCertificate: false,
    requiredCourseTitle: task.requiredCourseTitle || 'Mandatory Technical Certification',
  };
}

