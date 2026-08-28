import { SignUp } from "@clerk/react";

function SignUpPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <SignUp
          appearance={{
            variables: {
              colorBackground: "var(--card)",
              colorForeground: "var(--foreground)",
              colorMuted: "var(--muted)",
              colorMutedForeground: "var(--muted-foreground)",
              colorInput: "var(--input)",
              colorInputForeground: "var(--foreground)",
              colorNeutral: "var(--foreground)",
              colorPrimary: "var(--primary)",
              colorPrimaryForeground: "var(--primary-foreground)",
              colorRing: "var(--ring)",
            },
          }}
        />
      </div>
    </div>
  );
}

export default SignUpPage;