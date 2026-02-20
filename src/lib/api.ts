import axios from 'axios'
import type { GetSurveyResponse, SaveResponseBody, SaveResponseResult } from '@/types/survey'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export async function getSurveyByToken(
  code: string,
  token: string
): Promise<GetSurveyResponse['data']> {
  const { data } = await api.get<GetSurveyResponse>('/v1/public/survey', {
    params: { code, token },
  })
  return data.data
}

export async function saveOrSubmitResponse(
  body: SaveResponseBody
): Promise<SaveResponseResult['data']> {
  const { data } = await api.post<SaveResponseResult>(
    '/v1/public/responses',
    body
  )
  return data.data
}
