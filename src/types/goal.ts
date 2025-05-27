// Goal日历核心数据类型定义

export interface GoalInput {
  goal: string;
  timeframe: string;
  startDate: string;
  priority: 'low' | 'medium' | 'high';
  dailyTimeAvailable: string;
  description?: string;
}

export interface DailySchedule {
  date: string;
  timeSlot: string;
  content: string;
  type: 'study' | 'practice' | 'review' | 'project' | 'milestone';
  duration: number; // 分钟
  completed?: boolean;
}

export interface Task {
  taskId: string;
  title: string;
  description: string;
  estimatedHours: number;
  dailySchedule: DailySchedule[];
  completed?: boolean;
  progress?: number; // 0-100
}

export interface Phase {
  phaseId: string;
  phaseName: string;
  duration: string;
  tasks: Task[];
  completed?: boolean;
  progress?: number;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
  completed?: boolean;
}

export interface GoalPlan {
  goalId: string;
  goalTitle: string;
  totalDuration: string;
  startDate: string;
  endDate?: string;
  phases: Phase[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  overallProgress?: number;
}

export interface CalendarDay {
  date: string;
  tasks: DailySchedule[];
  isToday?: boolean;
  isSelected?: boolean;
  hasEvents?: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
  weekNumber: number;
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
} 