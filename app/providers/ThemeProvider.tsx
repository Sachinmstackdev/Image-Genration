'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import React from 'react';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by showing loading screen until mounted
  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      storageKey="eve-ai-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
} 