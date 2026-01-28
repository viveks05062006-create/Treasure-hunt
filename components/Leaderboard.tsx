
import React from 'react';
import { Team } from '../types';
import { Trophy, Medal, Star, Flame, User } from 'lucide-react';

interface LeaderboardProps {
  teams: Team[];
  currentTeamId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ teams, currentTeamId }) => {
  // Sort by points desc, then by finish time (if finished) or current clue index
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.currentClueIndex !== a.currentClueIndex) return b.currentClueIndex - a.currentClueIndex;
    return 0; // Simplified tie-break
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Medal className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" size={24} />;
      case 1: return <Medal className="text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" size={24} />;
      case 2: return <Medal className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" size={24} />;
      default: return <span className="font-battle text-lg text-gray-500">{index + 1}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-battle font-black text-yellow-500 uppercase flex items-center justify-center gap-3">
          <Trophy className="animate-pulse" /> Hall of Flame
        </h2>
        <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mt-1">Real-time Standings</p>
      </div>

      <div className="flex flex-col gap-3">
        {sortedTeams.map((team, index) => {
          const isMe = team.id === currentTeamId;
          const isTop3 = index < 3;

          return (
            <div 
              key={team.id}
              className={`glass p-4 rounded-2xl flex items-center justify-between border transition-all ${
                isMe ? 'border-orange-500 bg-orange-500/10 scale-[1.02] shadow-xl shadow-orange-500/10' : 'border-white/5'
              } ${isTop3 ? 'py-5' : 'py-4'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center">
                  {getRankIcon(index)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold uppercase ${isMe ? 'text-orange-400' : 'text-white'}`}>
                      {team.name}
                    </h4>
                    {team.isFinished && (
                      <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-battle uppercase">Finished</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-battle">
                    Current Clue: {team.currentClueIndex + 1}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-battle font-black flex items-baseline gap-1">
                  {team.points} <span className="text-[10px] text-gray-500 uppercase">pts</span>
                </div>
                <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-orange-500" 
                    style={{ width: `${(team.currentClueIndex / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
