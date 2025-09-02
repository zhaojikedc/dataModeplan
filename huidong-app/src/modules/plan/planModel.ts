export type PersonalityType = 'explorer' | 'thinker' | 'social' | 'disciplined'

export const PLAN_COPY: Record<PersonalityType, { label: string; summary: string }> = {
  explorer: {
    label: '探索型',
    summary:
      '通过 discovery 式学习（如科学实验、户外观察）与刺激性运动（攀岩、球类）在冒险中释放精力，满足好奇心。',
  },
  thinker: {
    label: '思考型',
    summary:
      '侧重深度阅读、策略性游戏与需要耐心与技巧的独处型运动（射箭、瑜伽、慢跑），在沉淀中锤炼心性。',
  },
  social: {
    label: '社交型',
    summary:
      '推荐小组学习、演讲练习与团队协作型运动（足球、接力赛），在互动中获取能量，发挥影响力。',
  },
  disciplined: {
    label: '自律型',
    summary:
      '提供目标管理工具、挑战性任务与可记录数据的规律性运动（跳绳打卡、游泳计时），在成就感中不断突破。',
  },
}

export function generatePlan(type: PersonalityType) {
  const base = {
    explorer: {
      learning: [
        '每日：10-15 分钟科学实验 APP（安全可操作）',
        '每周：1 次户外观察任务（记录发现）',
        '每日：探索主题阅读 10 分钟',
      ],
      sports: ['每周：1-2 次攀岩/球类', '每日：20 分钟自由体能游戏'],
      goals: ['每周记录 3 条新发现', '完成 2 次探索挑战并分享感受'],
    },
    thinker: {
      learning: [
        '每日：深度阅读 20 分钟（可选策略类游戏 10 分钟）',
        '每周：完成一个小问题的分析与书写总结',
      ],
      sports: ['每周：2-3 次瑜伽/慢跑（20-30 分钟）', '每日：5 分钟呼吸与专注练习'],
      goals: ['每周完成 1 篇读书/思考笔记', '连续 5 天完成专注练习'],
    },
    social: {
      learning: [
        '每周：小组学习项目 1 次（分工与展示）',
        '每日：5 分钟即兴演讲练习（家长或伙伴配合）',
      ],
      sports: ['每周：2 次团队运动（足球/接力）', '每日：10 分钟协调性训练'],
      goals: ['每周一次合作反思（我如何帮助了团队？）', '完成一次家庭演讲展示'],
    },
    disciplined: {
      learning: [
        '设定每周学习清单（可视化进度）',
        '每日：完成 2 个小目标并打卡',
      ],
      sports: ['每日：跳绳打卡（计数/时间）', '每周：游泳计时一次并记录数据'],
      goals: ['保持 7 天打卡不断档', '周末复盘：完成率与改进点'],
    },
  }

  return base[type]
}

export type WeeklyProgress = {
  weekStartIsoDate: string
  completedLearning: number
  targetLearning: number
  completedSports: number
  targetSports: number
  parentFeedback?: string
}

export function adjustPlanByProgress<T extends ReturnType<typeof generatePlan>>(_type: PersonalityType, basePlan: T, progress: WeeklyProgress | null) {
  if (!progress) return basePlan
  const learningCompletion = progress.completedLearning / Math.max(1, progress.targetLearning)
  const sportsCompletion = progress.completedSports / Math.max(1, progress.targetSports)
  const adjusted: { learning: string[]; sports: string[]; goals: string[] } = {
    learning: [...basePlan.learning],
    sports: [...basePlan.sports],
    goals: [...basePlan.goals],
  }

  // 简单动态优化：不足则降低门槛/拆小步；充足则加挑战
  if (learningCompletion < 0.6) {
    adjusted.learning = [...adjusted.learning, '将学习目标拆分为更小步骤，每次 5-8 分钟']
  } else if (learningCompletion > 1.1) {
    adjusted.learning = [...adjusted.learning, '增加一个拓展挑战：本周新增一次延伸任务']
  }

  if (sportsCompletion < 0.6) {
    adjusted.sports = [...adjusted.sports, '将运动改为更短更频的 10 分钟节奏']
  } else if (sportsCompletion > 1.1) {
    adjusted.sports = [...adjusted.sports, '提高强度或时长 10-15%（量力而行）']
  }

  if (progress.parentFeedback && progress.parentFeedback.includes('压力')) {
    adjusted.goals = [...adjusted.goals, '关注兴趣驱动，允许替换 1 项不感兴趣任务']
  }
  return adjusted
}

