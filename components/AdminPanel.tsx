
import React, { useState } from 'react';
import { Team, Clue } from '../types';
import { ShieldAlert, Save, RefreshCw, Unlock, Edit3, ArrowLeft } from 'lucide-react';

interface AdminPanelProps {
  teams: Team[];
  clues: Clue[];
  setTeams: (teams: Team[]) => void;
  setClues: (clues: Clue[]) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ teams, clues, setTeams, setClues, onBack }) => {
  const [editClueId, setEditClueId] = useState<string | null>(null);

  const resetGame = () => {
    if (confirm("THIS WILL DELETE ALL PROGRESS. ARE YOU SURE?")) {
      localStorage.removeItem('ignite_treasure_hunt_v1');
      window.location.reload();
    }
  };

  const unlockClue = (teamId: string) => {
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          clueStep: 'SCAN' as const,
          points: t.points + 10
        };
      }
      return t;
    });
    setTeams(updated);
    alert("Question bypassed for team.");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 glass rounded-lg"><ArrowLeft size={20}/></button>
        <h2 className="text-2xl font-battle font-black text-blue-400 uppercase">Battle Control</h2>
        <div className="w-10"></div>
      </div>

      <div className="glass p-6 rounded-2xl border-blue-500/20">
         <h3 className="font-battle text-sm uppercase text-blue-300 mb-4 flex items-center gap-2">
            <ShieldAlert size={16} /> Team Status & Overrides
         </h3>
         <div className="space-y-3">
            {teams.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Clue {t.currentClueIndex + 1} | {t.clueStep}</p>
                </div>
                <div className="flex gap-2">
                  {t.clueStep === 'QUESTION' && (
                    <button 
                      onClick={() => unlockClue(t.id)}
                      className="p-2 bg-blue-600 rounded-lg text-white"
                      title="Force Unlock Question"
                    >
                      <Unlock size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
         </div>
      </div>

      <div className="glass p-6 rounded-2xl border-orange-500/20">
         <h3 className="font-battle text-sm uppercase text-orange-300 mb-4 flex items-center gap-2">
            <Edit3 size={16} /> Manage Clues
         </h3>
         <div className="space-y-4">
            {clues.map(c => (
              <div key={c.id} className="bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-battle text-xs text-orange-500">{c.title}</p>
                  <p className="text-[10px] text-gray-500 font-mono">ID: {c.qrCodeId}</p>
                </div>
                <p className="text-xs text-gray-300 italic mb-2">"{c.question}"</p>
                <p className="text-[10px] uppercase text-green-500 font-bold">Answer: {c.answer}</p>
              </div>
            ))}
         </div>
      </div>

      <button 
        onClick={resetGame}
        className="w-full py-4 bg-red-900/40 text-red-500 border border-red-500/30 rounded-xl font-battle font-bold flex items-center justify-center gap-2"
      >
        <RefreshCw size={20} />
        FULL RESET GAME
      </button>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[10px] text-yellow-500 uppercase text-center font-bold">
        QR Codes should contain: CLUE_1_QR, CLUE_2_QR, etc.
      </div>
    </div>
  );
};

export default AdminPanel;
