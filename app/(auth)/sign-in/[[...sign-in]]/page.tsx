import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent mb-8">
          Eve AI Image Generator
        </h1>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-pink-500 hover:bg-pink-600",
              card: "bg-white shadow-xl border border-gray-100",
              headerTitle: "text-pink-600",
              headerSubtitle: "text-pink-400",
              socialButtonsBlockButton: "border border-pink-200 text-pink-600 hover:bg-pink-50",
              formFieldLabel: "text-pink-600",
              formFieldInput: "border-pink-200 focus:border-pink-500 focus:ring-pink-500",
              footerActionLink: "text-pink-500 hover:text-pink-600",
              dividerLine: "bg-pink-100",
              dividerText: "text-pink-400"
            },
            variables: {
              colorPrimary: "#ec4899",
              colorTextOnPrimaryBackground: "#ffffff",
            }
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  );
} 