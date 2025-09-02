import { useEffect, useMemo, useState } from 'react'
import { adjustPlanByProgress, generatePlan, PersonalityType, PLAN_COPY, WeeklyProgress } from './planModel'

export function PlanPage() {
  const [type, setType] = useState<PersonalityType | null>(null)
  const [basePlan, setBasePlan] = useState<ReturnType<typeof generatePlan> | null>(null)
  const [plan, setPlan] = useState<ReturnType<typeof generatePlan> | null>(null)
  const [progress, setProgress] = useState<WeeklyProgress | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const t = (sessionStorage.getItem('huidong.personality') as PersonalityType | null) ?? 'explorer'
    setType(t)
  }, [])

  useEffect(() => {
    if (!type) return
    const p = generatePlan(type)
    setBasePlan(p)
    const stored = sessionStorage.getItem('huidong.progress')
    const parsed: WeeklyProgress | null = stored ? JSON.parse(stored) : null
    setProgress(parsed)
    setPlan(adjustPlanByProgress(type, p, parsed))
  }, [type])

  const copy = useMemo(() => (type ? PLAN_COPY[type] : null), [type])

  if (!type || !plan || !copy) return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">正在加载个性化计划...</div>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">个性化计划</h1>
      <p className="mt-2 text-slate-700">根据评估结果，当前更匹配：<strong className="text-brand-700">{copy.label}</strong></p>

      <div className="mt-6 rounded-xl border border-slate-200 p-5 bg-white">
        <h2 className="font-semibold text-slate-900">建议概述</h2>
        <p className="mt-2 text-slate-700 leading-7">{copy.summary}</p>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 p-5 bg-white">
          <h3 className="font-semibold text-slate-900">学习（每日/每周）</h3>
          <ul className="mt-3 space-y-2 text-slate-700">
            {plan.learning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 p-5 bg-white">
          <h3 className="font-semibold text-slate-900">运动（每日/每周）</h3>
          <ul className="mt-3 space-y-2 text-slate-700">
            {plan.sports.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 p-5 bg-white">
        <h3 className="font-semibold text-slate-900">目标管理与动态调整</h3>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
          {plan.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <div className="mt-4 text-sm text-slate-600">提示：家长可在每周末记录完成情况与反馈，系统将据此优化计划。</div>
        <ProgressForm
          progress={progress}
          onSubmit={(p) => {
            const withFeedback = { ...p, parentFeedback: feedback }
            sessionStorage.setItem('huidong.progress', JSON.stringify(withFeedback))
            setProgress(withFeedback)
            if (basePlan) setPlan(adjustPlanByProgress(type, basePlan, withFeedback))
          }}
          feedback={feedback}
          onFeedbackChange={setFeedback}
        />
      </div>
    </div>
  )
}

function ProgressForm({
  progress,
  onSubmit,
  feedback,
  onFeedbackChange,
}: {
  progress: WeeklyProgress | null
  onSubmit: (p: WeeklyProgress) => void
  feedback: string
  onFeedbackChange: (v: string) => void
}) {
  const [completedLearning, setCompletedLearning] = useState<number>(progress?.completedLearning ?? 0)
  const [targetLearning, setTargetLearning] = useState<number>(progress?.targetLearning ?? 5)
  const [completedSports, setCompletedSports] = useState<number>(progress?.completedSports ?? 0)
  const [targetSports, setTargetSports] = useState<number>(progress?.targetSports ?? 3)

  return (
    <form
      className="mt-6 grid gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          weekStartIsoDate: new Date().toISOString().slice(0, 10),
          completedLearning,
          targetLearning,
          completedSports,
          targetSports,
          parentFeedback: feedback,
        })
      }}
    >
      <NumberField label="已完成学习项" value={completedLearning} onChange={setCompletedLearning} />
      <NumberField label="目标学习项" value={targetLearning} onChange={setTargetLearning} />
      <NumberField label="已完成运动项" value={completedSports} onChange={setCompletedSports} />
      <NumberField label="目标运动项" value={targetSports} onChange={setTargetSports} />
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700">家长反馈</label>
        <textarea
          className="mt-1 w-full rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          rows={3}
          placeholder="例如：孩子表示任务压力较大，或对某项活动兴趣浓厚等"
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button className="rounded-md bg-brand-600 px-5 py-2 text-white hover:bg-brand-700" type="submit">
          保存并优化计划
        </button>
      </div>
    </form>
  )
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="number"
        min={0}
        className="mt-1 w-full rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value || '0', 10))}
      />
    </div>
  )
}

