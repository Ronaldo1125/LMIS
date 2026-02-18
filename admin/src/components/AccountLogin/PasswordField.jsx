import { Eye, EyeOff } from 'lucide-react'

function PasswordField({ value, showPassword, onShowPasswordToggle, onChange }) {
  return (
    <div>
      <label 
        htmlFor="password" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 no-password-reveal"
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={onShowPasswordToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <style>{`
        .no-password-reveal::-ms-reveal,
        .no-password-reveal::-ms-clear {
          display: none;
        }
        .no-password-reveal::-webkit-credentials-auto-fill-button,
        .no-password-reveal::-webkit-textfield-decoration-container {
          display: none !important;
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

export default PasswordField