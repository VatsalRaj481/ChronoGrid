import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Premium timing grid/checkered flag speedometer icon */}
      <div className="relative w-10 h-10 flex-shrink-0 group">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(225,6,0,0.5)]">
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="#E10600" 
            strokeWidth="2.5" 
            strokeDasharray="283" 
            strokeDashoffset="75" 
            fill="none" 
            className="origin-center -rotate-90 group-hover:rotate-0 transition-transform duration-1000 ease-out" 
          />
          
          {/* Inner Grid / Speedometer markings */}
          <line x1="50" y1="15" x2="50" y2="25" stroke="#E10600" strokeWidth="2" />
          <line x1="85" y1="50" x2="75" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="50" y1="85" x2="50" y2="75" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="15" y1="50" x2="25" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          
          {/* Checkered flag shape */}
          <path d="M40 38h8v8h-8zm8 8h8v8h-8zm8-8h8v8h-8z" fill="#FFFFFF" />
          <path d="M48 38h8v8h-8zm8 8h8v8h-8z" fill="#E10600" />
          <path d="M40 46h8v8h-8z" fill="#E10600" />
          
          {/* Speed pointer */}
          <polygon 
            points="50,50 48,50 49,22 51,22 52,50" 
            fill="#00F0FF" 
            className="origin-center -rotate-[45deg] group-hover:rotate-[60deg] transition-transform duration-500 ease-out" 
          />
          <circle cx="50" cy="50" r="4" fill="#00F0FF" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <span className="text-xl font-black tracking-wider leading-none text-white font-display">
            CHRONO<span className="text-[#E10600]">GRID</span>
          </span>
        </div>
      )}
    </div>
  );
};
