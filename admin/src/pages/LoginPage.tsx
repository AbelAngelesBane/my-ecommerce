import { SignIn } from '@clerk/clerk-react'

function LoginPage() {
  return (
    <div className='flex items-center justify-center bg-red-50 h-screen'>
      <div>
        <SignIn/>
      </div>
      
    </div>
    
  )
}

export default LoginPage
