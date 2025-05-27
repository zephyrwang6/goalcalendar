"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  modifiers?: { [key: string]: Date[] }
  modifiersStyles?: { [key: string]: React.CSSProperties }
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  modifiers,
  modifiersStyles,
  ...props
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  
  const today = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  
  // 获取当月第一天是星期几
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  // 获取当月有多少天
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ]
  
  const dayNames = ["日", "一", "二", "三", "四", "五", "六"]
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }
  
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    onSelect?.(clickedDate)
  }
  
  const renderCalendarDays = () => {
    const days = []
    
    // 添加空白格子（上个月的尾部）
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />)
    }
    
    // 添加当月的天数
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isSelected = selected && 
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      
      // 检查是否有特殊修饰符
      let hasModifier = false
      let modifierStyle = {}
      if (modifiers?.hasGoals) {
        hasModifier = modifiers.hasGoals.some(goalDate => 
          goalDate.getDate() === date.getDate() &&
          goalDate.getMonth() === date.getMonth() &&
          goalDate.getFullYear() === date.getFullYear()
        )
        if (hasModifier && modifiersStyles?.hasGoals) {
          modifierStyle = modifiersStyles.hasGoals
        }
      }
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            "h-9 w-9 p-0 font-normal text-sm rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:bg-accent focus:text-accent-foreground focus:outline-none",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            isToday && !isSelected && "bg-accent text-accent-foreground font-medium",
            hasModifier && "font-bold"
          )}
          style={hasModifier ? modifierStyle : {}}
        >
          {day}
        </button>
      )
    }
    
    return days
  }
  
  return (
    <div className={cn("p-3", className)} {...props}>
      {/* 月份导航 */}
      <div className="flex justify-center pt-1 relative items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm font-medium">
          {currentYear}年 {monthNames[currentMonth]}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* 星期标题 */}
      <div className="flex mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-9 w-9 text-center text-sm font-normal text-muted-foreground flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar } 