import { GoalInput, GoalPlan } from '@/types/goal'
import { generateId } from './utils'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const DEEPSEEK_API_KEY = 'sk-c2c2c6ee4c8748348aec7ef1594549aa'

export async function generateGoalPlan(goalInput: GoalInput): Promise<GoalPlan> {
  try {
    const prompt = `
你是一个专业的目标规划助手。请根据用户的目标信息，生成一个详细的目标执行计划。

用户目标信息：
- 目标名称：${goalInput.goal}
- 时间框架：${goalInput.timeframe}
- 开始日期：${goalInput.startDate}
- 每日可用时间：${goalInput.dailyTimeAvailable}
- 目标描述：${goalInput.description || '无'}

请生成一个JSON格式的目标计划，包含：
1. 目标分解为具体的阶段
2. 每个阶段的具体任务和时间安排
3. 重要里程碑

JSON格式要求（严格按照此格式）：
{
  "goalTitle": "目标标题",
  "totalDuration": "总时长",
  "phases": [
    {
      "phaseId": "phase_1",
      "phaseName": "阶段名称",
      "duration": "阶段时长",
      "tasks": [
        {
          "taskId": "task_1",
          "title": "任务标题",
          "description": "任务描述",
          "estimatedHours": 10,
          "dailySchedule": [
            {
              "date": "YYYY-MM-DD",
              "timeSlot": "HH:MM-HH:MM",
              "content": "具体内容",
              "type": "study",
              "duration": 120,
              "completed": false
            }
          ]
        }
      ]
    }
  ],
  "milestones": [
    {
      "date": "YYYY-MM-DD",
      "title": "里程碑标题",
      "description": "里程碑描述",
      "completed": false
    }
  ]
}

请确保返回的是有效的JSON格式，不要包含任何其他文本。
`

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的目标规划助手，擅长将大目标分解为可执行的小任务，并制定详细的学习计划。请始终返回JSON格式的响应。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('DeepSeek API返回空内容')
    }

    // 尝试解析JSON响应
    let aiPlan: any
    try {
      // 清理可能的markdown代码块标记
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim()
      aiPlan = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('JSON解析失败:', parseError)
      console.error('原始内容:', content)
      throw new Error('AI返回的内容格式不正确')
    }

    // 将AI返回的数据转换为完整的GoalPlan
    const goalPlan: GoalPlan = {
      goalId: generateId(),
      goalTitle: aiPlan.goalTitle || goalInput.goal,
      totalDuration: aiPlan.totalDuration || goalInput.timeframe,
      startDate: goalInput.startDate,
      endDate: calculateEndDate(goalInput.startDate, goalInput.timeframe),
      phases: aiPlan.phases || [],
      milestones: aiPlan.milestones || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      overallProgress: 0
    }

    return goalPlan

  } catch (error) {
    console.error('生成目标计划失败:', error)
    
    // 返回一个默认的目标计划作为备选
    const fallbackPlan: GoalPlan = {
      goalId: generateId(),
      goalTitle: goalInput.goal,
      totalDuration: goalInput.timeframe,
      startDate: goalInput.startDate,
      endDate: calculateEndDate(goalInput.startDate, goalInput.timeframe),
      phases: [
        {
          phaseId: generateId(),
          phaseName: '基础学习阶段',
          duration: '1周',
          tasks: [
            {
              taskId: generateId(),
              title: '开始学习',
              description: '制定详细的学习计划并开始执行',
              estimatedHours: parseFloat(goalInput.dailyTimeAvailable) || 2,
              dailySchedule: [
                {
                  date: goalInput.startDate,
                  timeSlot: '19:00-21:00',
                  content: '制定学习计划',
                  type: 'study',
                  duration: 120,
                  completed: false
                }
              ]
            }
          ]
        }
      ],
      milestones: [
        {
          date: goalInput.startDate,
          title: '开始执行目标',
          description: '正式开始目标执行计划',
          completed: false
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      overallProgress: 0
    }

    return fallbackPlan
  }
}

// 计算结束日期
function calculateEndDate(startDate: string, timeframe: string): string {
  const start = new Date(startDate)
  const months = extractMonthsFromTimeframe(timeframe)
  const endDate = new Date(start.getFullYear(), start.getMonth() + months, start.getDate())
  return endDate.toISOString().split('T')[0]
}

// 从时间周期字符串提取月数
function extractMonthsFromTimeframe(timeframe: string): number {
  const match = timeframe.match(/(\d+)/)
  return match ? parseInt(match[1]) : 3 // 默认3个月
} 