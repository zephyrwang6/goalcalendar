'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GoalInput } from '@/types/goal'
import { getCurrentDate } from '@/lib/utils'
import { Target, Calendar, Clock, Shuffle } from 'lucide-react'

interface GoalInputFormProps {
  onSubmit: (goalInput: GoalInput) => void
  isLoading?: boolean
}

// 根据时间获取问候语
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return '上午好'
  } else if (hour >= 12 && hour < 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
}

// 内置的20个目标计划
const goalPlans = [
  {
    goal: '学会Python编程',
    description: '掌握Python基础语法、数据结构和面向对象编程，能够独立完成简单的项目开发，为转行或提升工作技能打下基础。'
  },
  {
    goal: '掌握英语口语',
    description: '提升英语口语表达能力，能够进行日常对话和工作交流，达到流利沟通的水平，提升职场竞争力。'
  },
  {
    goal: '达到理想体重',
    description: '通过科学的饮食控制和运动计划，健康减重到理想体重，改善身体状态，提升自信心和生活质量。'
  },
  {
    goal: '学会弹吉他',
    description: '掌握吉他基本弹奏技巧，能够演奏10首以上完整歌曲，培养音乐爱好，丰富业余生活。'
  },
  {
    goal: '建立阅读习惯',
    description: '养成每天阅读的习惯，一年内读完24本书，拓宽知识面，提升思维能力和个人修养。'
  },
  {
    goal: '掌握烹饪技能',
    description: '学会制作20道家常菜，掌握基本烹饪技巧，能够为家人朋友制作美味健康的餐食。'
  },
  {
    goal: '练成一手好字',
    description: '通过练习书法改善字体，达到工整美观的程度，提升个人气质和文化修养。'
  },
  {
    goal: '掌握摄影技艺',
    description: '学会摄影构图、光线运用和后期处理技巧，能够拍摄出专业水准的照片，记录美好生活。'
  },
  {
    goal: '提升身体素质',
    description: '通过规律的运动训练，提升心肺功能和体能水平，能够轻松完成5公里跑步，拥有健康体魄。'
  },
  {
    goal: '掌握日语交流',
    description: '学习日语达到N3水平，能够进行基本的日常对话，为日本旅游或工作机会做准备。'
  },
  {
    goal: '精通Excel技能',
    description: '掌握Excel高级功能，包括数据透视表、公式函数和图表制作，提升工作效率和数据分析能力。'
  },
  {
    goal: '掌握瑜伽技能',
    description: '学会基础瑜伽体式，改善身体柔韧性和平衡感，缓解工作压力，提升身心健康水平。'
  },
  {
    goal: '学会绘画技巧',
    description: '掌握素描和水彩画基础技法，能够画出满意的作品，培养艺术审美和创作能力。'
  },
  {
    goal: '提升写作能力',
    description: '提高文字表达和逻辑思维能力，能够写出高质量的文章，为个人品牌建设和职业发展助力。'
  },
  {
    goal: '掌握理财知识',
    description: '学习投资理财基础知识，建立正确的财富观念，实现资产的保值增值，为未来财务自由打基础。'
  },
  {
    goal: '提升演讲能力',
    description: '克服演讲恐惧，掌握演讲技巧和表达方法，能够在公众场合自信地发表观点，提升个人影响力。'
  },
  {
    goal: '掌握修图技能',
    description: '学会Photoshop或其他修图软件的使用，能够进行专业的图片处理和设计，提升视觉表达能力。'
  },
  {
    goal: '掌握时间管理',
    description: '建立高效的时间管理系统，提升工作和生活效率，实现工作生活平衡，减少拖延和压力。'
  },
  {
    goal: '学会网页设计',
    description: '掌握HTML、CSS等前端技术，能够设计和制作美观实用的网页，为职业转型或副业发展创造机会。'
  },
  {
    goal: '建立冥想习惯',
    description: '学会正念冥想技巧，通过每日练习提升专注力和情绪管理能力，获得内心平静和心理健康。'
  }
]

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

  // 随机选择一个目标计划
  const handleRandomPlan = () => {
    const randomIndex = Math.floor(Math.random() * goalPlans.length)
    const randomPlan = goalPlans[randomIndex]
    handleInputChange('goal', randomPlan.goal)
    handleInputChange('description', randomPlan.description)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 问候文案 */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          {getGreeting()}，你想制定什么计划？
        </h1>
        <p className="text-base text-gray-500">
          让AI帮你制定切实可行的日常任务
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 目标描述 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-800 flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  目标描述
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRandomPlan}
                  className="h-8 px-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Shuffle className="w-3 h-3" />
                  随机
                </Button>
              </div>
              <Input
                placeholder="例如：学会Python编程、掌握英语口语、减肥20斤等"
                value={formData.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                className="h-12 border-0 border-b-2 border-gray-200 rounded-none focus:border-black focus:ring-0 text-lg bg-transparent px-0 placeholder:text-gray-400"
                required
              />
            </div>

            {/* 时间周期 */}
            <div className="space-y-3">
              <label className="text-base font-medium text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                实现周期
              </label>
              <div className="flex gap-2">
                <div className="grid grid-cols-3 gap-2 flex-1">
                  {['1个月', '3个月', '6个月'].map((period) => (
                    <Button
                      key={period}
                      type="button"
                      variant="ghost"
                      onClick={() => handleInputChange('timeframe', period)}
                      className={`h-10 text-sm font-medium rounded-md transition-all ${
                        formData.timeframe === period 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
                <Input
                  placeholder="自定义时间"
                  value={formData.timeframe.includes('个月') ? '' : formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  className="h-10 border border-gray-200 rounded-md focus:border-black focus:ring-0 bg-white px-3 placeholder:text-gray-400 flex-1"
                />
              </div>
            </div>

            {/* 开始日期 */}
            <div className="space-y-3">
              <label className="text-base font-medium text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                开始日期
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="h-12 border-0 border-b-2 border-gray-200 rounded-none focus:border-black focus:ring-0 text-lg bg-transparent px-0"
                required
              />
            </div>

            {/* 每日可用时间 */}
            <div className="space-y-3">
              <label className="text-base font-medium text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                每日可用时间
              </label>
              <div className="flex gap-2">
                <div className="grid grid-cols-3 gap-2 flex-1">
                  {['1小时', '2小时', '3小时'].map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant="ghost"
                      onClick={() => handleInputChange('dailyTimeAvailable', time)}
                      className={`h-10 text-sm font-medium rounded-md transition-all ${
                        formData.dailyTimeAvailable === time 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <Input
                  placeholder="自定义时间"
                  value={formData.dailyTimeAvailable.includes('小时') ? '' : formData.dailyTimeAvailable}
                  onChange={(e) => handleInputChange('dailyTimeAvailable', e.target.value)}
                  className="h-10 border border-gray-200 rounded-md focus:border-black focus:ring-0 bg-white px-3 placeholder:text-gray-400 flex-1"
                />
              </div>
            </div>

            {/* 详细描述 */}
            <div className="space-y-3">
              <label className="text-base font-medium text-gray-800">
                详细描述（可选）
              </label>
              <textarea
                placeholder="描述您的具体需求、背景或期望达到的效果..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full h-16 px-0 py-2 border-0 border-b-2 border-gray-200 rounded-none resize-none focus:outline-none focus:border-black bg-transparent placeholder:text-gray-400 text-gray-900"
              />
            </div>

            {/* 提交按钮 */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={!formData.goal || !formData.timeframe || !formData.dailyTimeAvailable || isLoading}
                className={`w-full h-12 text-base font-medium rounded-lg transition-all disabled:bg-gray-300 disabled:text-gray-500 ${
                  isLoading 
                    ? 'bg-gray-100 animate-pulse cursor-not-allowed text-black' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <div className="w-5 h-5 border-2 border-black/30 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="animate-pulse text-black">AI正在生成计划</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : (
                  '生成AI目标计划'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 