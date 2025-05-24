import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Settings, User, LogOut, Palette, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";

interface NavbarProps {
  onPricingClick?: () => void;
  onGalleryClick?: () => void;
  onHelpClick?: () => void;
}

export function Navbar({ onPricingClick, onGalleryClick, onHelpClick }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  const handlePricingClick = () => {
    if (onPricingClick) {
      onPricingClick();
    }
  };

  const handleGalleryClick = () => {
    if (onGalleryClick) {
      onGalleryClick();
    }
  };

  const handleHelpClick = () => {
    if (onHelpClick) {
      onHelpClick();
    }
  };

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-6 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
            Eve AI
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <button 
                onClick={handleGalleryClick}
                className="transition-colors hover:text-foreground/80 text-foreground/60 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md"
              >
                Gallery
              </button>
              <button 
                onClick={handlePricingClick}
                className="transition-colors hover:text-foreground/80 text-foreground/60 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md"
              >
                Pricing
              </button>
              <button 
                onClick={handleHelpClick}
                className="transition-colors hover:text-foreground/80 text-foreground/60 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md"
              >
                Help
              </button>
            </div>
          </div>

          {/* Theme Toggle & Auth */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              {/* User Avatar Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-56 rounded-lg border bg-white dark:bg-gray-800 p-1 shadow-lg z-50"
                  >
                    <div className="px-3 py-2 text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.fullName || user?.firstName || 'User'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
                      </p>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-600 my-1" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-8 px-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsOpen(false);
                        // Add settings functionality here
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-8 px-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsOpen(false);
                        handlePricingClick();
                      }}
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                    <div className="h-px bg-gray-200 dark:bg-gray-600 my-1" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-8 px-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </motion.div>
                )}
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
} 