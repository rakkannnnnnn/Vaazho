import { SignIn } from "@clerk/react"

function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </main>
  )
}

export default SignInPage