
import React from 'react';
import { Team } from '../types';
import { MapPin, CheckCircle2, QrCode, Timer, Flame } from 'lucide-react';

interface InstructionsProps {
  team: Team;
  onStart: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ team, onStart }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-battle font-black text-orange-500">MISSION BRIEFING</h2>
        <p className="text-gray-400">Welcome, <span className="text-white font-bold">{team.name}</span></p>
      </div>

      <div className="glass p-6 rounded-2xl border-white/10">
        <h3 className="text-lg font-battle font-bold mb-3 flex items-center gap-2">
          <Flame size={20} className="text-orange-500" />
          The Storyline
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          The campus core is unstable. A legendary fire artifact has been shattered across the university grounds. Your team must recover the fragments in sequential order to prevent a meltdown. Only the strongest and fastest will survive this trial.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="glass p-4 rounded-xl flex gap-4 items-start border-l-4 border-l-blue-500">
          <CheckCircle2 className="text-blue-500 shrink-0" />
          <div>
            <h4 className="font-bold text-sm uppercase font-battle">Step A: Decipher</h4>
            <p className="text-xs text-gray-400">Solve the riddle on your screen. Correct answers reveal the location hint.</p>
          </div>
        </div>

        <div className="glass p-4 rounded-xl flex gap-4 items-start border-l-4 border-l-orange-500">
          <QrCode className="text-orange-500 shrink-0" />
          <div>
            <h4 className="font-bold text-sm uppercase font-battle">Step B: Scan</h4>
            <p className="text-xs text-gray-400">Find the physical QR code at the location and scan it with your camera.</p>
          </div>
        </div>

        <div className="glass p-4 rounded-xl flex gap-4 items-start border-l-4 border-l-yellow-500">
          <Timer className="text-yellow-500 shrink-0" />
          <div>
            <h4 className="font-bold text-sm uppercase font-battle">Timing & Scoring</h4>
            <p className="text-xs text-gray-400">90 minutes total. +10 pts per step. +5 pts for the FIRST team to solve a clue!</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="mt-4 w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-battle font-black text-xl shadow-2xl shadow-orange-600/40 hover:scale-[1.02] transition-all"
      >
        START THE HUNT
      </button>

      <p className="text-center text-xs text-gray-500 italic">
        "Fair play is mandatory. Volunteers are monitoring."
      </p>
    </div>
  );
};

export default Instructions;
