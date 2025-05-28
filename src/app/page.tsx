'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GoalInputForm } from '@/components/goal-input-form'
import { HistoryModal } from '@/components/history-modal'
import { Navbar } from '@/components/navbar'
import { GoalInput, GoalPlan } from '@/types/goal'
import { generateGoalPlan } from '@/lib/ai-service'
import { saveToHistory, getHistoryPlans } from '@/lib/storage'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [historyPlans, setHistoryPlans] = useState<GoalPlan[]>([])

  // 组件加载时获取历史计划
  useEffect(() => {
    const plans = getHistoryPlans()
    setHistoryPlans(plans)
  }, [])

  const handleGoalSubmit = async (goalInput: GoalInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const plan = await generateGoalPlan(goalInput)
      
      // 自动保存到历史记录
      saveToHistory(plan)
      
      // 更新历史计划列表
      const updatedPlans = getHistoryPlans()
      setHistoryPlans(updatedPlans)
      
      // 跳转到独立的计划页面
      router.push(`/plan/${plan.goalId}`)
    } catch (error) {
      console.error('生成目标计划失败:', error)
      const errorMessage = error instanceof Error ? error.message : '生成计划时发生未知错误'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
  }

  const handleHistoryClick = () => {
    setIsHistoryModalOpen(true)
  }

  const handleLogoClick = () => {
    // 在首页，点击Logo不需要做任何操作
  }

  return (
    <>
      <Navbar onHistoryClick={handleHistoryClick} onLogoClick={handleLogoClick} />
      <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f8f8f7' }}>
        <div className="container mx-auto px-4 py-12">
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
        </div>

        {/* 历史计划弹窗 */}
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          historyPlans={historyPlans}
        />
      </main>
    </>
  )
}
