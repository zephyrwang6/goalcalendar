import { GoalPlan } from '@/types/goal'

export interface CalendarEvent {
  title: string
  start: Date
  end: Date
  description?: string
  location?: string
  allDay?: boolean
}

// 检测浏览器是否支持日历API
export function checkCalendarSupport(): boolean {
  // 检查是否支持Web Share API或者文件下载
  return 'navigator' in window && (
    'share' in navigator || 
    'webkitShare' in navigator ||
    'download' in document.createElement('a')
  )
}

// 将时间字符串转换为Date对象
function parseTimeSlot(date: string, timeSlot: string): { start: Date, end: Date } {
  const [startTime, endTime] = timeSlot.split('-').map(time => time.trim())
  
  const startDate = new Date(date)
  const endDate = new Date(date)
  
  // 解析开始时间
  const [startHour, startMinute] = startTime.split(':').map(Number)
  startDate.setHours(startHour, startMinute, 0, 0)
  
  // 解析结束时间
  const [endHour, endMinute] = endTime.split(':').map(Number)
  endDate.setHours(endHour, endMinute, 0, 0)
  
  return { start: startDate, end: endDate }
}

// 将GoalPlan转换为日历事件
export function convertPlanToCalendarEvents(plan: GoalPlan): CalendarEvent[] {
  const events: CalendarEvent[] = []
  
  plan.phases.forEach(phase => {
    phase.tasks.forEach(task => {
      task.dailySchedule.forEach(schedule => {
        const { start, end } = parseTimeSlot(schedule.date, schedule.timeSlot)
        
        events.push({
          title: `${schedule.content}`,
          start,
          end,
          description: `目标: ${plan.goalTitle}\n阶段: ${phase.phaseName}\n任务类型: ${getTaskTypeLabel(schedule.type)}\n预计时长: ${schedule.duration}分钟`,
          allDay: false
        })
      })
    })
  })
  
  return events
}

// 获取任务类型的中文标签
function getTaskTypeLabel(type: string): string {
  const labels = {
    study: '学习',
    practice: '练习',
    review: '复习',
    project: '项目',
    milestone: '里程碑'
  }
  return labels[type as keyof typeof labels] || type
}

// 生成ICS格式的日历文件
export function generateICSFile(events: CalendarEvent[], planTitle: string): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z'
  }
  
  const escapeText = (text: string): string => {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Goal Calendar//Goal Calendar App//CN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(planTitle)}`,
    'X-WR-TIMEZONE:Asia/Shanghai',
    'X-WR-CALDESC:由Goal日历生成的学习计划'
  ]
  
  events.forEach((event, index) => {
    const uid = `goal-${Date.now()}-${index}@goalcalendar.com`
    const now = new Date()
    
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(event.end)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description || '')}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    )
  })
  
  icsContent.push('END:VCALENDAR')
  
  return icsContent.join('\r\n')
}

// 下载ICS文件
export function downloadICSFile(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } else {
    throw new Error('浏览器不支持文件下载功能')
  }
}

// 同步到本地日历
export async function syncToLocalCalendar(plan: GoalPlan): Promise<{ success: boolean, message: string }> {
  try {
    // 检查浏览器支持
    if (!checkCalendarSupport()) {
      return {
        success: false,
        message: '您的浏览器不支持日历同步功能，请使用现代浏览器或手动导入日历文件'
      }
    }
    
    // 转换为日历事件
    const events = convertPlanToCalendarEvents(plan)
    
    if (events.length === 0) {
      return {
        success: false,
        message: '计划中没有可同步的任务'
      }
    }
    
    // 生成ICS文件
    const icsContent = generateICSFile(events, plan.goalTitle)
    const filename = `${plan.goalTitle}_学习计划.ics`
    
    // 尝试下载文件
    downloadICSFile(icsContent, filename)
    
    return {
      success: true,
      message: `已生成日历文件 "${filename}"，请导入到您的日历应用中`
    }
    
  } catch (error) {
    console.error('同步到本地日历失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '同步失败，请稍后重试'
    }
  }
}

// 检测用户设备类型
export function detectDevice(): 'ios' | 'android' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  } else if (/android/.test(userAgent)) {
    return 'android'
  } else {
    return 'desktop'
  }
}

// 获取同步指导信息
export function getSyncInstructions(device: 'ios' | 'android' | 'desktop'): string {
  switch (device) {
    case 'ios':
      return '1. 下载完成后，点击文件\n2. 选择"导入到日历"\n3. 选择要导入的日历\n4. 点击"导入"完成同步'
    case 'android':
      return '1. 下载完成后，打开文件管理器\n2. 找到下载的.ics文件\n3. 点击文件，选择日历应用打开\n4. 确认导入到日历'
    case 'desktop':
      return '1. 下载完成后，找到.ics文件\n2. 双击文件或拖拽到日历应用\n3. 确认导入设置\n4. 完成同步到本地日历'
    default:
      return '请将下载的.ics文件导入到您的日历应用中'
  }
} 