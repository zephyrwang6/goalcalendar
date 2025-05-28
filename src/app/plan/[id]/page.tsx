'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GoalCalendar } from '@/components/goal-calendar'
import { Navbar } from '@/components/navbar'
import { HistoryModal } from '@/components/history-modal'
import { GoalPlan } from '@/types/goal'
import { getHistoryPlans } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PlanPage() {
  const params = useParams()
  const router = useRouter()
  const [goalPlan, setGoalPlan] = useState<GoalPlan | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [historyPlans, setHistoryPlans] = useState<GoalPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const planId = params.id as string
    const plans = getHistoryPlans()
    setHistoryPlans(plans)
    
    // 根据ID查找对应的计划
    const foundPlan = plans.find(plan => plan.goalId === planId)
    
    if (foundPlan) {
      setGoalPlan(foundPlan)
    } else {
      setError('未找到指定的计划')
    }
    
    setIsLoading(false)
  }, [params.id])

  const handleTaskComplete = (taskId: string, date: string) => {
    if (!goalPlan) return
    
    // 这里可以实现任务完成的逻辑
    console.log('任务完成:', taskId, date)
    // 实际项目中会更新数据库状态
  }

  const handleHistoryClick = () => {
    setIsHistoryModalOpen(true)
  }

  const handleLogoClick = () => {
    router.push('/')
  }

  const handleSelectHistoryPlan = (plan: GoalPlan) => {
    router.push(`/plan/${plan.goalId}`)
    setIsHistoryModalOpen(false)
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <>
        <Navbar onHistoryClick={handleHistoryClick} onLogoClick={handleLogoClick} />
        <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f8f8f7' }}>
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">加载计划中...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar onHistoryClick={handleHistoryClick} onLogoClick={handleLogoClick} />
        <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f8f8f7' }}>
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-xl font-bold">!</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">计划未找到</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={handleBackToHome} className="bg-black text-white hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar onHistoryClick={handleHistoryClick} onLogoClick={handleLogoClick} />
      <main className="min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#f8f8f7' }}>
        <div className="container mx-auto px-4 py-12">
          {goalPlan && (
            <GoalCalendar 
              goalPlan={goalPlan} 
              onTaskComplete={handleTaskComplete}
            />
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