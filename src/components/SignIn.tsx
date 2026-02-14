import { SignIn as ClerkSignIn } from "@clerk/clerk-react"

export function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">
            The Threshold
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your credentials
          </p>

          <ClerkSignIn 
            appearance={{
              variables: {
                colorPrimary: '#10b981',
              },
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white',
                card: 'shadow-none',
                headerTitle: 'hidden',      // 🔥 hide Clerk header
                headerSubtitle: 'hidden',   // 🔥 hide Clerk subtitle
              }
            }}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  )
}
