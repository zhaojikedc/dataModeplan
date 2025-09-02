import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { inferTypeFromAnswers, PersonalityType, QUESTIONS } from './assessmentModel'

export function AssessmentPage() {
  const navigate = useNavigate()
  const questions = useMemo(() => QUESTIONS, [])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)

  const allAnswered = questions.every((q) => Number.isFinite(answers[q.id]))

  function selectAnswer(questionId: number, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  async function handleSubmit() {
    if (!allAnswered) return
    setSubmitting(true)
    const type: PersonalityType = inferTypeFromAnswers(answers)
    sessionStorage.setItem('huidong.personality', type)
    navigate('/plan')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">性格评估</h1>
      <p className="mt-2 text-slate-700">请根据孩子的日常表现进行选择，没有对错之分。</p>

      <div className="mt-8 space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="rounded-xl border border-slate-200 p-5 bg-white">
            <p className="font-medium text-slate-900">{q.title}</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {q.options.map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(q.id, idx)}
                  className={`rounded-md border px-3 py-2 text-sm ${answers[q.id] === idx ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!allAnswered || submitting}
          onClick={handleSubmit}
          className="rounded-md bg-brand-600 px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700"
        >
          {submitting ? '生成中...' : '生成个性化计划'}
        </button>
      </div>
    </div>
  )
}

