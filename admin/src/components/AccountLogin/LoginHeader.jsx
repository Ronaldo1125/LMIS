function LoginHeader() {
  return (
    <>
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img 
          src="/LOGO.svg" 
          alt="Library Logo" 
          className="h-20 w-auto"
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600">
          Sign in to your account
        </p>
      </div>
    </>
  )
}

export default LoginHeader