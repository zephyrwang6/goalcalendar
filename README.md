# Goal日历 - AI驱动的目标管理系统

一个基于Next.js和DeepSeek AI的智能目标管理应用，帮助用户将大目标科学分解为可执行的日常计划。

## 🚀 特性

- **AI智能规划**: 使用DeepSeek API自动将目标分解为具体的执行计划
- **可视化日历**: 直观显示目标进度和日常任务安排
- **科学分解**: 将长期目标拆分为阶段性任务和里程碑
- **现代界面**: 基于Tailwind CSS的美观响应式设计
- **TypeScript**: 完全的类型安全支持

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI库**: Tailwind CSS + Lucide React Icons
- **类型安全**: TypeScript
- **AI服务**: DeepSeek API
- **状态管理**: React Hooks

## 📦 安装和运行

### 克隆项目
```bash
git clone https://github.com/zephyrwang6/goalcalendar.git
cd goalcalendar
```

### 安装依赖
```bash
npm install
```

### 配置环境变量
在项目根目录创建 `.env.local` 文件：
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 功能介绍

### 1. 目标设定
- 输入目标描述
- 选择实现周期（1个月/3个月/6个月或自定义）
- 设置开始日期
- 选择每日可用时间
- 添加详细描述

### 2. AI智能规划
系统会自动：
- 将目标分解为多个阶段
- 为每个阶段制定具体任务
- 安排日程表和时间分配
- 设置重要里程碑

### 3. 日历视图
- 可视化显示每日任务
- 跟踪完成进度
- 查看里程碑达成情况

## 🔧 API配置

本项目使用DeepSeek API进行AI规划。请确保：

1. 注册DeepSeek账号并获取API密钥
2. 在 `src/lib/ai-service.ts` 中配置正确的API密钥
3. 确保网络可以访问 `https://api.deepseek.com`

## 📁 项目结构

```
goalcalendar/
├── src/
│   ├── app/                 # Next.js App Router页面
│   ├── components/          # React组件
│   │   ├── ui/             # 基础UI组件
│   │   └── goal-input-form.tsx
│   ├── lib/                # 工具库
│   │   ├── ai-service.ts   # AI服务集成
│   │   └── utils.ts        # 工具函数
│   └── types/              # TypeScript类型定义
│       └── goal.ts
├── public/                 # 静态资源
└── README.md
```

## 🎨 样式说明

项目使用Tailwind CSS进行样式设计，包含：
- 响应式布局
- 渐变背景和文字效果
- 现代化的卡片设计
- 交互式按钮和表单元素

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

## 🔗 相关链接

- [DeepSeek API文档](https://platform.deepseek.com/api-docs/)
- [Next.js文档](https://nextjs.org/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
