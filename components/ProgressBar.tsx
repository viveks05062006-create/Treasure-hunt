
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
      <div 
        className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 transition-all duration-1000 ease-out relative"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute top-0 right-0 h-full w-2 bg-white blur-sm opacity-50"></div>
      </div>
      {/* Tick Marks */}
      <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
        {Array.from({ length: total + 1 }).map((_, i) => (
          <div key={i} className="h-full w-[1px] bg-white/10"></div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
