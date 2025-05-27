'use client'

import React, { useState } from 'react'
import { GoalInputForm } from '@/components/goal-input-form'
import { GoalCalendar } from '@/components/goal-calendar'
import { GoalInput, GoalPlan } from '@/types/goal'
import { generateGoalPlan } from '@/lib/ai-service'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<'input' | 'calendar'>('input')
  const [goalPlan, setGoalPlan] = useState<GoalPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoalSubmit = async (goalInput: GoalInput) => {
    setIsLoading(true)
    try {
      const plan = await generateGoalPlan(goalInput)
      setGoalPlan(plan)
      setCurrentStep('calendar')
    } catch (error) {
      console.error('生成目标计划失败:', error)
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
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'input' ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <GoalInputForm 
              onSubmit={handleGoalSubmit} 
              isLoading={isLoading}
            />
            
            {/* 产品介绍 */}
            <div className="mt-12 max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🎯 Goal日历 - 让目标变得可执行
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI智能分解</h3>
                  <p className="text-gray-600 text-sm">
                    先进的AI算法将您的长期目标科学分解为每日可执行的具体任务
                  </p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">📅</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">智能日历</h3>
                  <p className="text-gray-600 text-sm">
                    自动生成个性化的学习日历，合理安排时间，提高执行效率
                  </p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">进度跟踪</h3>
                  <p className="text-gray-600 text-sm">
                    实时跟踪学习进度，设置关键里程碑，确保目标按时达成
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* 返回按钮 */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBackToInput}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回目标设定
              </Button>
            </div>
            
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
    </main>
  )
}
