import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic vector mark: Modern shopping bag merged with four-point star / radiance */}
      <div className={`relative ${iconSize} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-600 to-indigo-500 shadow-md shadow-indigo-900/20 text-white`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-5/6 h-5/6" xmlns="http://www.w3.org/2000/svg">
          {/* Shopping bag handle */}
          <path
            d="M11 11V8C11 5.23858 13.2386 3 16 3C18.7614 3 21 5.23858 21 8V11"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Shopping bag silhouette */}
          <path
            d="M6 11H26L24.5 28H7.5L6 11Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Glowing Testimony Star / Sparkle in the center */}
          <path
            d="M16 13L17.5 17.5L22 19L17.5 20.5L16 25L14.5 20.5L10 19L14.5 17.5L16 13Z"
            fill="#FBBF24"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-display font-bold tracking-tight text-slate-900 leading-none ${textSize}`}>
          Testimony<span className="text-indigo-600">.</span>
        </div>
        {showTagline && (
          <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mt-0.5">
            Store & Lifestyle
          </span>
        )}
      </div>
    </div>
  );
};
