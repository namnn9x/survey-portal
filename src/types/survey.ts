export interface SurveyInfo {
  id: string
  code: string
  name: string
  description: string | null
}

export interface PortalQuestion {
  id: string
  questionCode: string
  groupCode: string
  order: number
  content: string
  type: string
  isRequired: boolean
  options: string[] | unknown
  minLength: number | null
  maxLength: number | null
  minValue: number | null
  maxValue: number | null
  pattern: string | null
}

export interface GetSurveyResponse {
  data: {
    survey: SurveyInfo
    questions: PortalQuestion[]
    existingAnswers: Record<string, unknown>
    responseId: string | null
    responseStatus: 'Partial' | 'Completed' | null
  }
}

export interface SaveResponseBody {
  token: string
  surveyCode: string
  answers: { questionId: string; value: unknown }[]
  submit?: boolean
}

export interface SaveResponseResult {
  data: {
    responseId: string
    status: 'Partial' | 'Completed'
  }
}
