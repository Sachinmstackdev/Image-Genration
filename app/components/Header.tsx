'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-leonardo-card/30 backdrop-blur-sm border-b border-leonardo-pink/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-leonardo-pink font-bold text-xl">Eve AI</div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 rounded-lg bg-leonardo-card/50 text-leonardo-pink border border-leonardo-pink/20 hover:shadow-neon-pink transition-all duration-300">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-leonardo-pink to-leonardo-purple text-white hover:shadow-neon-pink transition-all duration-300">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    rootBox: "hover:shadow-neon-pink transition-all duration-300",
                    avatarBox: "w-8 h-8 rounded-full overflow-hidden"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
} 