import { AlertCircle } from 'lucide-react'

function ErrorMessage({ error }) {
  if (!error) return null

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-800">{error}</p>
    </div>
  )
}

export default ErrorMessage