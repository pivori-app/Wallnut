import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'full';
  showText?: boolean;
}

export function Logo({ className, variant = 'full', showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className="relative">
        <svg 
          viewBox="0 0 100 100" 
          className={cn(
            "w-10 h-10 transition-transform duration-500 group-hover:rotate-12",
            variant === 'light' ? "text-white" : "text-primary"
          )}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Shield/Nut Base */}
          <path 
            d="M50 5C25.147 5 5 25.147 5 50C5 74.853 25.147 95 50 95C74.853 95 95 74.853 95 50C95 25.147 74.853 5 50 5Z" 
            fill="currentColor" 
            fillOpacity="0.05"
          />
          
          {/* Abstract Walnut Shape */}
          <path 
            d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM50 78C34.54 78 22 65.46 22 50C22 34.54 34.54 22 50 22C65.46 22 78 34.54 78 50C78 65.46 65.46 78 50 78Z" 
            fill="currentColor"
          />
          
          {/* Premium Gold Accent (Inner leaf/curve) */}
          <path 
            d="M50 30C40 30 32 38 32 48C32 63 50 75 50 75C50 75 68 63 68 48C68 38 60 30 50 30Z" 
            fill="#C79A2E"
            className="drop-shadow-[0_2px_4px_rgba(199,154,46,0.3)]"
          />
          
          {/* House Silhouette */}
          <path 
            d="M42 52L50 45L58 52V62H42V52Z" 
            fill="white"
          />
          <path 
            d="M48 58H52V62H48V58Z" 
            fill="#0A2B4E" 
            fillOpacity="0.5"
          />
        </svg>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn(
            "text-2xl font-display font-bold tracking-tighter uppercase",
            variant === 'light' ? "text-white" : "text-primary dark:text-white"
          )}>
            Wallnut
          </span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1 opacity-80">
            Real Estate
          </span>
        </div>
      )}
    </div>
  );
}
