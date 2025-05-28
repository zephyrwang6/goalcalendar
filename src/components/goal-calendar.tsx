'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GoalPlan, DailySchedule } from '@/types/goal'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Circle, Clock, Target, Edit } from 'lucide-react'
import { cn, formatTimeSlot } from '@/lib/utils'
import { TaskEditModal } from './task-edit-modal'
import { CalendarSyncButton } from './calendar-sync-button'

interface GoalCalendarProps {
  goalPlan: GoalPlan
  onTaskComplete?: (taskId: string, date: string) => void
  onTaskUpdate?: (updatedTask: DailySchedule, originalTask: DailySchedule) => void
}

export function GoalCalendar({ goalPlan, onTaskComplete, onTaskUpdate }: GoalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingTask, setEditingTask] = useState<DailySchedule | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // 获取当前月份的所有日期
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  // 获取月份开始的星期几（用于布局）
  const monthStartDay = getDay(startOfMonth(currentDate))

  // 创建日期到任务的映射
  const dateTaskMap = useMemo(() => {
    const map: Record<string, DailySchedule[]> = {}
    
    goalPlan.phases.forEach(phase => {
      phase.tasks.forEach(task => {
        task.dailySchedule.forEach(schedule => {
          const dateKey = schedule.date
          if (!map[dateKey]) {
            map[dateKey] = []
          }
          map[dateKey].push(schedule)
        })
      })
    })
    
    return map
  }, [goalPlan])

  // 获取指定日期的任务
  const getTasksForDate = (date: Date): DailySchedule[] => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return dateTaskMap[dateKey] || []
  }

  // 获取任务类型对应的样式
  const getTaskTypeStyle = (type: string) => {
    const styles = {
      study: 'bg-blue-100 text-blue-800 border-blue-200',
      practice: 'bg-green-100 text-green-800 border-green-200',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      project: 'bg-purple-100 text-purple-800 border-purple-200',
      milestone: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // 获取任务类型的中文名称
  const getTaskTypeLabel = (type: string) => {
    const labels = {
      study: '学习',
      practice: '练习',
      review: '复习',
      project: '项目',
      milestone: '里程碑'
    }
    return labels[type as keyof typeof labels] || type
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  // 编辑任务
  const handleEditTask = (task: DailySchedule) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  // 保存编辑的任务
  const handleSaveEditedTask = (updatedTask: DailySchedule) => {
    if (editingTask && onTaskUpdate) {
      onTaskUpdate(updatedTask, editingTask)
    }
    setIsEditModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* 目标信息头部 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-3">
                <Target className="w-6 h-6 text-blue-600" />
                {goalPlan.goalTitle}
              </CardTitle>
              <div className="text-sm text-gray-600 space-y-1">
                <p>总时长: {goalPlan.totalDuration}</p>
                <p>开始日期: {goalPlan.startDate}</p>
                {goalPlan.endDate && <p>预计结束: {goalPlan.endDate}</p>}
              </div>
            </div>
            <div className="md:ml-4">
              <CalendarSyncButton goalPlan={goalPlan} className="w-full md:w-auto" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 日历主体 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                <div key={index} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-1">
              {/* 月份开始前的空白 */}
              {Array.from({ length: monthStartDay }, (_, index) => (
                <div key={`empty-${index}`} className="h-16" />
              ))}

              {/* 月份日期 */}
              {monthDays.map((date) => {
                const tasks = getTasksForDate(date)
                const isSelected = selectedDate && isSameDay(date, selectedDate)
                const isCurrentDay = isToday(date)

                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "h-16 p-1 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50",
                      isSelected && "bg-blue-50 border-blue-300",
                      isCurrentDay && "bg-blue-100 border-blue-400"
                    )}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="flex flex-col h-full">
                      <div className={cn(
                        "text-sm font-medium",
                        isCurrentDay ? "text-blue-800" : "text-gray-900"
                      )}>
                        {format(date, 'd')}
                      </div>
                      <div className="flex-1 space-y-0.5 overflow-hidden">
                        {tasks.slice(0, 2).map((task, index) => (
                          <div
                            key={index}
                            className={cn(
                              "text-xs px-1 py-0.5 rounded border leading-tight",
                              getTaskTypeStyle(task.type)
                            )}
                            title={task.content}
                          >
                            <div 
                              className="break-words whitespace-normal"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {task.content}
                            </div>
                          </div>
                        ))}
                        {tasks.length > 2 && (
                          <div className="text-xs text-gray-500 px-1">
                            +{tasks.length - 2}个任务
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 任务详情侧边栏 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, 'M月d日 任务详情') : '选择日期查看任务'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedDateTasks.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateTasks.map((task, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded border",
                              getTaskTypeStyle(task.type)
                            )}>
                              {getTaskTypeLabel(task.type)}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatTimeSlot(task.timeSlot)}
                            </div>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {task.content}
                          </h4>
                          <p className="text-sm text-gray-600">
                            预计时长: {task.duration}分钟
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {!task.completed && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task)}
                              className="p-1 h-8 w-8 text-gray-500 hover:text-blue-600"
                              title="修改任务"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onTaskComplete?.(task.content, task.date)}
                            className={`p-1 h-8 w-8 ${task.completed 
                              ? 'text-green-600 hover:text-gray-500' 
                              : 'text-gray-400 hover:text-green-600'
                            }`}
                            title={task.completed ? "标记为未完成" : "标记为完成"}
                          >
                            {task.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>该日期没有安排任务</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>点击日历上的日期查看详细任务</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 任务编辑弹窗 */}
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        onSave={handleSaveEditedTask}
      />
    </div>
  )
} 