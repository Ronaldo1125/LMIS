import UsernameField from './UsernameField'
import PasswordField from './PasswordField'
import RememberMeSection from './RememberMeSection'
import SubmitButton from './SubmitButton'

function LoginForm({ 
  formData, 
  showPassword, 
  isLoading, 
  onShowPasswordToggle, 
  onChange, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <UsernameField 
        value={formData.username}
        onChange={onChange}
      />

      <PasswordField
        value={formData.password}
        showPassword={showPassword}
        onShowPasswordToggle={onShowPasswordToggle}
        onChange={onChange}
      />

      <RememberMeSection />

      <SubmitButton isLoading={isLoading} />
    </form>
  )
}

export default LoginForm