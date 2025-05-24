import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-pink-100">
      <div className="flex items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
          Eve AI Image Generator
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 text-pink-500 border border-pink-500 rounded-lg hover:bg-pink-50 transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopoverCard: "bg-white border border-pink-100",
                userButtonPopoverText: "text-pink-600",
                userButtonPopoverActionButton: "text-pink-500 hover:text-pink-600"
              }
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
} 