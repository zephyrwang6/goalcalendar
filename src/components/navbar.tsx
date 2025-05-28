import React from 'react'
import { Target, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  onHistoryClick?: () => void
  onLogoClick?: () => void
}

export function Navbar({ onHistoryClick, onLogoClick }: NavbarProps) {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* 左侧 Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onLogoClick}
        >
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-black">
            Goal日历
          </span>
        </div>
        
        {/* 右侧历史计划按钮 */}
        <Button
          variant="outline"
          onClick={onHistoryClick}
          className="flex items-center gap-2 text-gray-700 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        >
          <History className="w-4 h-4" />
          历史计划
        </Button>
      </div>
    </nav>
  )
} 