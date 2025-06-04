'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ImageIcon, 
  GalleryHorizontalIcon, 
  FolderIcon, 
  LightbulbIcon, 
  Settings2Icon 
} from "lucide-react";

const navItems = [
  {
    title: "Create",
    icon: ImageIcon,
    href: "/dashboard",
  },
  {
    title: "Gallery",
    icon: GalleryHorizontalIcon,
    href: "/gallery",
  },
  {
    title: "My Creations",
    icon: FolderIcon,
    href: "/creations",
  },
  {
    title: "Prompts",
    icon: LightbulbIcon,
    href: "/prompts",
  },
  {
    title: "Settings",
    icon: Settings2Icon,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-64 bg-[#1A1C22] border-r border-gray-800 p-4 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-white">Eve AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-600/10 text-violet-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Premium Status */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="bg-gradient-to-r from-violet-600/20 to-violet-600/10 rounded-lg p-4">
          <h4 className="text-sm font-medium text-violet-400 mb-1">Premium Plan</h4>
          <p className="text-xs text-gray-400">65 generations remaining</p>
        </div>
      </div>
    </motion.div>
  );
} 