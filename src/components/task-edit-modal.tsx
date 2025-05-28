import React, { useState, useEffect } from 'react'
import { DailySchedule } from '@/types/goal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Clock, Calendar, Type } from 'lucide-react'

interface TaskEditModalProps {
  isOpen: boolean
  onClose: () => void
  task: DailySchedule | null
  onSave: (updatedTask: DailySchedule) => void
}

export function TaskEditModal({ isOpen, onClose, task, onSave }: TaskEditModalProps) {
  const [editedTask, setEditedTask] = useState<DailySchedule | null>(null)

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task })
    }
  }, [task])

  if (!isOpen || !editedTask) return null

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask)
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const taskTypes = [
    { value: 'study', label: '学习' },
    { value: 'practice', label: '练习' },
    { value: 'review', label: '复习' },
    { value: 'project', label: '项目' },
    { value: 'milestone', label: '里程碑' }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* 弹窗标题 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">修改任务</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 表单内容 */}
        <div className="p-6 space-y-4">
          {/* 任务内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 inline mr-1" />
              任务内容
            </label>
            <Input
              value={editedTask.content}
              onChange={(e) => setEditedTask({ ...editedTask, content: e.target.value })}
              placeholder="请输入任务内容"
              className="w-full"
            />
          </div>

          {/* 时间段 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              时间段
            </label>
            <Input
              value={editedTask.timeSlot}
              onChange={(e) => setEditedTask({ ...editedTask, timeSlot: e.target.value })}
              placeholder="例如：09:00-11:00"
              className="w-full"
            />
          </div>

          {/* 任务类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务类型
            </label>
            <select
              value={editedTask.type}
              onChange={(e) => setEditedTask({ 
                ...editedTask, 
                type: e.target.value as 'study' | 'practice' | 'review' | 'project' | 'milestone'
              })}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {taskTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 持续时长 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              持续时长（分钟）
            </label>
            <Input
              type="number"
              value={editedTask.duration}
              onChange={(e) => setEditedTask({ 
                ...editedTask, 
                duration: parseInt(e.target.value) || 0 
              })}
              placeholder="60"
              min="1"
              max="480"
              className="w-full"
            />
          </div>

          {/* 日期（只读显示） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              日期
            </label>
            <Input
              value={editedTask.date}
              readOnly
              className="w-full bg-gray-50"
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            保存修改
          </Button>
        </div>
      </div>
    </div>
  )
} 