import React from 'react'
import { GoalPlan } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { X, Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  historyPlans: GoalPlan[]
  onSelectPlan: (plan: GoalPlan) => void
}

export function HistoryModal({ isOpen, onClose, historyPlans, onSelectPlan }: HistoryModalProps) {
  if (!isOpen) return null

  const handleSelectPlan = (plan: GoalPlan) => {
    onSelectPlan(plan)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* 弹窗标题 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">历史计划</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 计划列表 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {historyPlans.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">暂无历史计划</p>
              <p className="text-gray-400 text-sm">创建您的第一个计划吧！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyPlans.map((plan) => (
                <div
                  key={plan.goalId}
                  onClick={() => handleSelectPlan(plan)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-black mb-2">
                        {plan.goalTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>创建时间：{formatDate(plan.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>周期：{plan.totalDuration}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-gray-400">
                          进度：{plan.overallProgress}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gray-900 h-1.5 rounded-full transition-all"
                            style={{ width: `${plan.overallProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 group-hover:text-gray-600"
                      >
                        查看
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 