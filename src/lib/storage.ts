import { GoalPlan } from '@/types/goal'

const STORAGE_KEY = 'goal_calendar_history'

// 保存计划到历史记录
export function saveToHistory(plan: GoalPlan): void {
  try {
    const existingPlans = getHistoryPlans()
    
    // 检查是否已存在相同计划，如果存在则更新
    const existingIndex = existingPlans.findIndex(p => p.goalId === plan.goalId)
    
    if (existingIndex >= 0) {
      existingPlans[existingIndex] = { ...plan, updatedAt: new Date().toISOString() }
    } else {
      existingPlans.unshift(plan) // 新计划添加到开头
    }
    
    // 限制历史记录数量（最多保存20个）
    const limitedPlans = existingPlans.slice(0, 20)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedPlans))
  } catch (error) {
    console.error('保存历史计划失败:', error)
  }
}

// 获取历史计划列表
export function getHistoryPlans(): GoalPlan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const plans = JSON.parse(stored) as GoalPlan[]
    
    // 按创建时间倒序排列
    return plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('获取历史计划失败:', error)
    return []
  }
}

// 删除指定计划
export function deletePlanFromHistory(goalId: string): void {
  try {
    const existingPlans = getHistoryPlans()
    const filteredPlans = existingPlans.filter(p => p.goalId !== goalId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlans))
  } catch (error) {
    console.error('删除历史计划失败:', error)
  }
}

// 清空所有历史计划
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('清空历史计划失败:', error)
  }
} 