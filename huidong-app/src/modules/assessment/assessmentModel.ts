export type PersonalityType = 'explorer' | 'thinker' | 'social' | 'disciplined'

export type Question = {
  id: number
  title: string
  options: [string, string, string, string]
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: '遇到新事物时，孩子更常见的反应是：',
    options: ['立刻尝试', '先观察思考', '邀请伙伴一起', '查看规则再做'],
  },
  {
    id: 2,
    title: '课余时间更偏好：',
    options: ['户外探索', '安静阅读/拼图', '与同伴活动', '完成清单任务'],
  },
  {
    id: 3,
    title: '遇到挑战时更依赖：',
    options: ['直觉与实践', '分析与计划', '求助与协作', '自律与坚持'],
  },
  {
    id: 4,
    title: '最能激励TA的是：',
    options: ['新奇与冒险', '问题被解决', '伙伴的认可', '数据化进步'],
  },
  {
    id: 5,
    title: '在运动上更喜欢：',
    options: ['攀岩/球类', '瑜伽/慢跑', '足球/接力', '跳绳/游泳计时'],
  },
]

// 简单权重规则：每题四项分别映射到四型
const INDEX_TO_TYPE: PersonalityType[] = ['explorer', 'thinker', 'social', 'disciplined']

export function inferTypeFromAnswers(answers: Record<number, number>): PersonalityType {
  const score: Record<PersonalityType, number> = {
    explorer: 0,
    thinker: 0,
    social: 0,
    disciplined: 0,
  }
  for (const q of QUESTIONS) {
    const idx = answers[q.id]
    if (Number.isFinite(idx)) {
      const t = INDEX_TO_TYPE[idx as number]
      score[t] += 1
    }
  }
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]) as [PersonalityType, number][]
  return sorted[0][0]
}

