
import React from 'react';
import { Timer as TimerIcon, Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLow = seconds < 300; // Less than 5 mins

  return (
    <div className={`glass px-4 py-3 rounded-2xl flex items-center justify-between border-l-4 ${isLow ? 'border-l-red-500 bg-red-500/10' : 'border-l-orange-500'} shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isLow ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}>
          <Clock size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-battle text-gray-400 tracking-widest leading-none">Time Remaining</p>
          <p className={`text-xl font-battle font-black leading-tight ${isLow ? 'text-red-500' : 'text-white'}`}>
            {formatTime(seconds)}
          </p>
        </div>
      </div>
      {isLow && <span className="text-[10px] font-battle text-red-500 animate-pulse">HURRY!</span>}
    </div>
  );
};

export default Timer;
