import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'full';
  showText?: boolean;
}

export function Logo({ className, variant = 'full', showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center group", className)}>
      <img
        src="/logo-wallnut-2026.png"
        alt="Wallnut Logo"
        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
      />
    </div>
  );
}
