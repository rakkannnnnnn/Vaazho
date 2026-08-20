import { SignUp } from "@clerk/react"

function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </main>
  )
}

export default SignUpPage