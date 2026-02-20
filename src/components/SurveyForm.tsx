import { useMemo } from 'react'
import type { PortalQuestion } from '@/types/survey'

function getGroupsWithQuestions(
  questions: PortalQuestion[]
): { groupCode: string; items: PortalQuestion[] }[] {
  const byGroup = new Map<string, PortalQuestion[]>()
  for (const q of questions) {
    const list = byGroup.get(q.groupCode) ?? []
    list.push(q)
    byGroup.set(q.groupCode, list)
  }
  return Array.from(byGroup.entries())
    .map(([groupCode, items]) => ({
      groupCode,
      items: items.sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => (a.items[0]?.order ?? 0) - (b.items[0]?.order ?? 0))
}

interface QuestionBlockProps {
  q: PortalQuestion
  value: unknown
  onChange: (value: unknown) => void
}

function QuestionBlock({ q, value, onChange }: QuestionBlockProps) {
  const options = Array.isArray(q.options)
    ? q.options
    : q.options != null
      ? [String(q.options)]
      : []

  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {q.content}
        {q.isRequired && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {q.type === 'text' && (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Nhập câu trả lời"
        />
      )}
      {q.type === 'textarea' && (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Nhập câu trả lời"
        />
      )}
      {q.type === 'number' && (
        <input
          type="number"
          value={(value as number | '') ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? '' : Number(v))
          }}
          min={q.minValue ?? undefined}
          max={q.maxValue ?? undefined}
          className="w-full max-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      )}
      {q.type === 'email' && (
        <input
          type="email"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-[320px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="email@example.com"
        />
      )}
      {q.type === 'date' && (
        <input
          type="date"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      )}
      {q.type === 'single_choice' && (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="radio"
                name={q.id}
                checked={(value as string) === opt}
                onChange={() => onChange(opt)}
                className="text-indigo-600"
              />
              {String(opt)}
            </label>
          ))}
        </div>
      )}
      {q.type === 'multiple_choice' && (
        <div className="space-y-2">
          {options.map((opt, i) => {
            const selected = Array.isArray(value) ? value.includes(opt) : false
            return (
              <label
                key={i}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const arr = Array.isArray(value) ? [...value] : []
                    const idx = arr.indexOf(opt)
                    if (idx >= 0) arr.splice(idx, 1)
                    else arr.push(opt)
                    onChange(arr)
                  }}
                  className="rounded text-indigo-600"
                />
                {String(opt)}
              </label>
            )
          })}
        </div>
      )}
      {q.type === 'rating' && (
        <div className="flex flex-wrap items-center gap-2">
          {Array.from(
            {
              length:
                (q.maxValue ?? 5) - (q.minValue ?? 1) + 1,
            },
            (_, i) => (q.minValue ?? 1) + i
          ).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                value === n
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface SurveyFormProps {
  questions: PortalQuestion[]
  surveyName: string
  answers: Record<string, unknown>
  onAnswersChange: (answers: Record<string, unknown>) => void
  onSaveDraft: () => void
  onSubmit: () => void
  isSaving: boolean
  isSubmitting: boolean
}

export default function SurveyForm({
  questions,
  surveyName,
  answers,
  onAnswersChange,
  onSaveDraft,
  onSubmit,
  isSaving,
  isSubmitting,
}: SurveyFormProps) {
  const groups = useMemo(() => getGroupsWithQuestions(questions), [questions])

  const handleChange = (questionId: string, value: unknown) => {
    onAnswersChange({ ...answers, [questionId]: value })
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">{surveyName}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vui lòng trả lời đầy đủ các câu hỏi bắt buộc (có dấu *).
        </p>
      </div>
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="space-y-8">
          {groups.map(({ groupCode, items }) => (
            <section key={groupCode}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                {groupCode}
              </h2>
              {items.map((q) => (
                <QuestionBlock
                  key={q.id}
                  q={q}
                  value={answers[q.id]}
                  onChange={(value) => handleChange(q.id, value)}
                />
              ))}
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving || isSubmitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu nháp'}
          </button>
          <button
            type="submit"
            disabled={isSaving || isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi hoàn thành'}
          </button>
        </div>
      </form>
    </div>
  )
}
