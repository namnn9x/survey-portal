import { useMemo, useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSurveyByToken, saveOrSubmitResponse } from '@/lib/api'
import SurveyForm from '@/components/SurveyForm'

export default function SurveyPage() {
  const { code } = useParams<{ code: string }>()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const queryClient = useQueryClient()

  const [answers, setAnswers] = useState<Record<string, unknown>>({})

  const {
    data,
    isLoading,
    error,
    isSuccess: isLoadSuccess,
  } = useQuery({
    queryKey: ['survey', code, token],
    queryFn: () => getSurveyByToken(code!, token),
    enabled: !!code && !!token,
  })

  const saveMutation = useMutation({
    mutationFn: (submit: boolean) =>
      saveOrSubmitResponse({
        token,
        surveyCode: code!,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value,
        })),
        submit,
      }),
    onSuccess: (_, submit) => {
      if (submit) {
        queryClient.setQueryData(['survey', code, token], (old: unknown) => {
          if (old && typeof old === 'object' && 'responseStatus' in old)
            return { ...old, responseStatus: 'Completed' as const }
          return old
        })
      }
    },
  })

  const initialAnswers = useMemo(() => {
    if (!data?.existingAnswers) return {}
    return { ...data.existingAnswers }
  }, [data?.existingAnswers])

  useEffect(() => {
    if (Object.keys(initialAnswers).length > 0 && Object.keys(answers).length === 0) {
      setAnswers(initialAnswers)
    }
  }, [initialAnswers])

  const mergedAnswers = useMemo(() => {
    if (Object.keys(answers).length > 0) return answers
    return initialAnswers
  }, [answers, initialAnswers])

  if (!code || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Link không hợp lệ. Thiếu mã khảo sát hoặc token.</p>
          <p className="mt-2 text-sm text-gray-500">
            Vui lòng sử dụng đúng link được gửi qua email.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Đang tải khảo sát...</div>
      </div>
    )
  }

  if (error || !data) {
    const message =
      (error as { response?: { data?: { error?: string } } })?.response?.data
        ?.error ?? 'Link không hợp lệ hoặc khảo sát đã kết thúc.'
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium">Không thể tải khảo sát</p>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
      </div>
    )
  }

  if (isLoadSuccess && data.responseStatus === 'Completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md rounded-xl bg-white p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Cảm ơn bạn đã hoàn thành khảo sát
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Câu trả lời của bạn đã được ghi nhận.
          </p>
        </div>
      </div>
    )
  }

  const handleSaveDraft = () => {
    saveMutation.mutate(false)
  }

  const handleSubmit = () => {
    saveMutation.mutate(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {saveMutation.isSuccess && saveMutation.data?.status === 'Completed' ? (
        <div className="flex items-center justify-center">
          <div className="text-center max-w-md rounded-xl bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Cảm ơn bạn đã hoàn thành khảo sát
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Câu trả lời của bạn đã được ghi nhận.
            </p>
          </div>
        </div>
      ) : (
        <SurveyForm
          questions={data.questions}
          surveyName={data.survey.name}
          answers={mergedAnswers}
          onAnswersChange={setAnswers}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          isSaving={saveMutation.isPending && saveMutation.variables === false}
          isSubmitting={saveMutation.isPending && saveMutation.variables === true}
        />
      )}
      {saveMutation.isError && (
        <div className="mx-auto mt-4 max-w-2xl rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {(saveMutation.error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
            'Có lỗi khi lưu. Vui lòng thử lại.'}
        </div>
      )}
    </div>
  )
}
