import { Routes, Route } from 'react-router-dom'
import SurveyPage from '@/pages/SurveyPage'

function App() {
  return (
    <Routes>
      <Route path="/survey/:code" element={<SurveyPage />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Link khảo sát không hợp lệ. Vui lòng sử dụng link được gửi qua email.</p>
          </div>
        }
      />
    </Routes>
  )
}

export default App
