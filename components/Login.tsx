
import React, { useState } from 'react';
import { ShieldCheck, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h2 className="text-4xl font-black font-battle mb-2">IDENTIFY YOURSELF</h2>
        <p className="text-gray-400">Enter the battlefield with your team credentials.</p>
      </div>

      <div className="glass p-8 rounded-3xl flex flex-col gap-6 fire-border">
        <div className="relative">
          <label className="text-xs font-battle uppercase text-gray-500 mb-2 block tracking-widest">Team Identity</label>
          <div className="flex items-center gap-3 glass bg-black/40 p-4 rounded-xl border-white/5 focus-within:border-orange-500 transition-colors">
            <User className="text-orange-500" size={20} />
            <input 
              type="text" 
              placeholder="E.g. Phoenix Squad" 
              className="bg-transparent border-none focus:ring-0 w-full outline-none placeholder:text-gray-600"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-battle uppercase text-gray-500 mb-2 block tracking-widest">Battle Code</label>
          <div className="flex items-center gap-3 glass bg-black/40 p-4 rounded-xl border-white/5 focus-within:border-orange-500 transition-colors">
            <Lock className="text-orange-500" size={20} />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="bg-transparent border-none focus:ring-0 w-full outline-none placeholder:text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={() => onLogin(teamName, password)}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-battle font-black text-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          ENTER BATTLE
          <ShieldCheck className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <div className="text-center text-xs text-gray-500 font-battle uppercase tracking-widest">
        One Device Per Team Only
      </div>
    </div>
  );
};

export default Login;
