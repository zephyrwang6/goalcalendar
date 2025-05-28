'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GoalPlan } from '@/types/goal'
import { 
  syncToLocalCalendar, 
  detectDevice, 
  getSyncInstructions,
  checkCalendarSupport 
} from '@/lib/calendar-sync'
import { Calendar, Download, Smartphone, Monitor, Info, CheckCircle, XCircle } from 'lucide-react'

interface CalendarSyncButtonProps {
  goalPlan: GoalPlan
  className?: string
}

export function CalendarSyncButton({ goalPlan, className }: CalendarSyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success: boolean, message: string } | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)

  const device = detectDevice()
  const isSupported = checkCalendarSupport()

  const handleSync = async () => {
    if (!isSupported) {
      setSyncResult({
        success: false,
        message: '您的浏览器不支持日历同步功能'
      })
      return
    }

    setIsLoading(true)
    setSyncResult(null)

    try {
      const result = await syncToLocalCalendar(goalPlan)
      setSyncResult(result)
      
      if (result.success) {
        setShowInstructions(true)
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: '同步失败，请稍后重试'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDeviceIcon = () => {
    switch (device) {
      case 'ios':
        return <Smartphone className="w-4 h-4" />
      case 'android':
        return <Smartphone className="w-4 h-4" />
      case 'desktop':
        return <Monitor className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getDeviceLabel = () => {
    switch (device) {
      case 'ios':
        return 'iPhone/iPad日历'
      case 'android':
        return 'Android日历'
      case 'desktop':
        return '本地日历'
      default:
        return '日历应用'
    }
  }

  return (
    <div className="space-y-4">
      {/* 同步按钮 */}
      <Button
        onClick={handleSync}
        disabled={isLoading || !isSupported}
        className={`flex items-center gap-2 ${className}`}
        variant="outline"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            同步中...
          </>
        ) : (
          <>
            {getDeviceIcon()}
            <Download className="w-4 h-4" />
            同步到{getDeviceLabel()}
          </>
        )}
      </Button>

      {/* 同步结果提示 */}
      {syncResult && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${
          syncResult.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex-shrink-0 mt-0.5">
            {syncResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {syncResult.success ? '同步成功' : '同步失败'}
            </p>
            <p className="text-sm mt-1">
              {syncResult.message}
            </p>
          </div>
        </div>
      )}

      {/* 操作指导 */}
      {showInstructions && syncResult?.success && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                导入指南
              </h4>
              <div className="text-sm text-blue-800">
                {getSyncInstructions(device).split('\n').map((line, index) => (
                  <div key={index} className="mb-1">
                    {line}
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(false)}
                className="mt-3 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                我知道了
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 不支持提示 */}
      {!isSupported && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 mb-1">
                浏览器不支持
              </h4>
              <p className="text-sm text-yellow-800">
                您的浏览器不支持日历同步功能，请使用现代浏览器或手动复制计划内容到日历应用中。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 