import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日期格式化工具
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取当前日期字符串
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]
}

// 计算两个日期之间的天数
export function daysBetween(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 时间格式化
export function formatTimeSlot(timeSlot: string): string {
  return timeSlot.replace('-', ' - ')
}

// 进度百分比格式化
export function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`
} 