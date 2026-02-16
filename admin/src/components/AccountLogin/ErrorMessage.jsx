import { AlertCircle } from 'lucide-react'

function ErrorMessage({ error }) {
  if (!error) return null

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800">
            {error}
          </p>
          {error.includes('inactive') && (
            <p className="text-xs text-red-600 mt-1">
              Contact your system administrator for account activation.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage