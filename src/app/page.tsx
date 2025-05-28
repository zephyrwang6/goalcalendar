'use client'

import React, { useState, useEffect } from 'react'
import { GoalInputForm } from '@/components/goal-input-form'
import { GoalCalendar } from '@/components/goal-calendar'
import { HistoryModal } from '@/components/history-modal'
import { Navbar } from '@/components/navbar'
import { GoalInput, GoalPlan } from '@/types/goal'
import { generateGoalPlan } from '@/lib/ai-service'
import { saveToHistory, getHistoryPlans } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<'input' | 'calendar'>('input')
  const [goalPlan, setGoalPlan] = useState<GoalPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [historyPlans, setHistoryPlans] = useState<GoalPlan[]>([])

  const handleGoalSubmit = async (goalInput: GoalInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const plan = await generateGoalPlan(goalInput)
      setGoalPlan(plan)
      setCurrentStep('calendar')
    } catch (error) {
      console.error('生成目标计划失败:', error)
      const errorMessage = error instanceof Error ? error.message : '生成计划时发生未知错误'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskComplete = (taskId: string, date: string) => {
    if (!goalPlan) return
    
    // 这里可以实现任务完成的逻辑
    console.log('任务完成:', taskId, date)
    // 实际项目中会更新数据库状态
  }

  const handleBackToInput = () => {
    setCurrentStep('input')
    setGoalPlan(null)
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
  }

  const handleHistoryClick = () => {
    setIsHistoryModalOpen(true)
  }

  const handleSelectHistoryPlan = (plan: GoalPlan) => {
    setGoalPlan(plan)
    setCurrentStep('calendar')
    setIsHistoryModalOpen(false)
  }

  return (
    <>
      <Navbar onHistoryClick={handleHistoryClick} />
      <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f8f8f7' }}>
        <div className="container mx-auto px-4 py-12">
          {currentStep === 'input' ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(80vh-64px)]">
              <GoalInputForm 
                onSubmit={handleGoalSubmit} 
                isLoading={isLoading}
              />
              {error && (
                <div className="mt-6 max-w-2xl w-full bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <span className="text-red-600 text-sm font-medium">!</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-red-800 font-medium mb-1">生成计划失败</h3>
                      <p className="text-red-700 text-sm mb-3">{error}</p>
                      <Button 
                        onClick={handleRetry}
                        size="sm"
                        variant="outline"
                        className="text-red-700 border-red-200 hover:bg-red-50"
                      >
                        重新尝试
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* 日历组件 */}
              {goalPlan && (
                <GoalCalendar 
                  goalPlan={goalPlan} 
                  onTaskComplete={handleTaskComplete}
                />
              )}
            </div>
          )}
        </div>

        {/* 历史计划弹窗 */}
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          historyPlans={historyPlans}
          onSelectPlan={handleSelectHistoryPlan}
        />
      </main>
    </>
  )
}
