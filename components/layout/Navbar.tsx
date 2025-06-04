"use client";

import { UserButton } from "@clerk/nextjs";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-0 right-0 left-64 h-16 bg-[#1A1C22] border-b border-gray-800 px-6 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">
          <span className="font-medium text-violet-500">65</span> generations left
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* User Profile */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9"
            }
          }}
        />
      </div>
    </div>
  );
} 