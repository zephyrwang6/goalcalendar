'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GoalInput } from '@/types/goal'
import { getCurrentDate } from '@/lib/utils'
import { Target, Calendar, Clock } from 'lucide-react'

interface GoalInputFormProps {
  onSubmit: (goalInput: GoalInput) => void
  isLoading?: boolean
}

export function GoalInputForm({ onSubmit, isLoading = false }: GoalInputFormProps) {
  const [formData, setFormData] = useState<GoalInput>({
    goal: '',
    timeframe: '',
    startDate: getCurrentDate(),
    priority: 'medium',
    dailyTimeAvailable: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.goal && formData.timeframe && formData.dailyTimeAvailable) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof GoalInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <Target className="w-8 h-8 text-blue-600" />
          Goal日历
        </CardTitle>
        <p className="text-gray-600 mt-2">
          AI将帮助您将目标科学分解为可执行的日常计划
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 目标描述 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              目标描述 *
            </label>
            <Input
              placeholder="例如：学会Python编程、掌握英语口语、减肥20斤等"
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* 时间周期 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              实现周期 *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['1个月', '3个月', '6个月'].map((period) => (
                <Button
                  key={period}
                  type="button"
                  variant={formData.timeframe === period ? 'default' : 'outline'}
                  onClick={() => handleInputChange('timeframe', period)}
                  className="h-12"
                >
                  {period}
                </Button>
              ))}
            </div>
            <Input
              placeholder="或输入自定义时间"
              value={formData.timeframe.includes('个月') ? '' : formData.timeframe}
              onChange={(e) => handleInputChange('timeframe', e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 开始日期 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              开始日期 *
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* 每日可用时间 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              每日可用时间 *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['1小时', '2小时', '3小时'].map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={formData.dailyTimeAvailable === time ? 'default' : 'outline'}
                  onClick={() => handleInputChange('dailyTimeAvailable', time)}
                  className="h-12"
                >
                  {time}
                </Button>
              ))}
            </div>
            <Input
              placeholder="或输入自定义时间"
              value={formData.dailyTimeAvailable.includes('小时') ? '' : formData.dailyTimeAvailable}
              onChange={(e) => handleInputChange('dailyTimeAvailable', e.target.value)}
              className="mt-2"
            />
          </div>

          {/* 详细描述 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              详细描述（可选）
            </label>
            <textarea
              placeholder="描述您的具体需求、背景或期望达到的效果..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={!formData.goal || !formData.timeframe || !formData.dailyTimeAvailable || isLoading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                AI正在生成计划...
              </div>
            ) : (
              '生成AI目标计划'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 