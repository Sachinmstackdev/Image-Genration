import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="relative mx-auto w-fit mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#8B5CF6] mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Eve AI Image Generator
          </h1>
        </div>

        {/* Sign In Form */}
        <SignIn 
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#8B5CF6",
              colorBackground: "#141414",
              colorInputBackground: "#1A1A1A",
              colorInputText: "#FFFFFF",
              colorTextOnPrimaryBackground: "#FFFFFF",
              colorDanger: "#EF4444",
              colorSuccess: "#10B981",
            },
            elements: {
              card: "bg-[#141414] shadow-xl border border-gray-800/50 rounded-xl overflow-hidden max-h-[calc(100vh-12rem)]",
              headerTitle: "text-xl font-semibold",
              headerSubtitle: "text-gray-400",
              socialButtonsIconButton: "hover:-translate-y-0.5 transition-transform",
              socialButtonsBlockButton: "w-full mb-2 bg-[#1A1A1A] border border-gray-800 hover:border-[#8B5CF6] text-gray-300 transition-all duration-200 flex items-center justify-center gap-3 py-2.5 rounded-lg font-medium hover:bg-[#1F1F1F]",
              socialButtonsProviderIcon: "w-5 h-5 opacity-85",
              formButtonPrimary: "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white w-full py-3 rounded-lg transition-all duration-200",
              formFieldInput: "bg-[#1A1A1A] border-gray-800 text-white placeholder:text-gray-500",
              formFieldLabel: "text-gray-400",
              dividerLine: "bg-gray-800",
              dividerText: "text-gray-500 bg-[#141414]",
              formFieldSuccessText: "text-emerald-500",
              formFieldErrorText: "text-red-500",
              footer: "bg-[#141414] border-t border-gray-800",
              footerActionLink: "text-[#8B5CF6] hover:text-[#7C3AED]",
              main: "gap-2",
              card__main: "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent",
            }
          }}
          signUpUrl="/sign-up"
        />

        {/* Development Mode Badge - Only shown in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 text-center">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-orange-500/10 text-orange-500">
              Development Mode
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 