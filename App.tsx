
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Flame, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Timer as TimerIcon,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AppView, Team, Clue } from './types';
import { INITIAL_CLUES, INITIAL_TEAMS, GAME_CONFIG } from './constants';

import Login from './components/Login';
import Instructions from './components/Instructions';
import GameView from './components/GameView';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import Timer from './components/Timer';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clues, setClues] = useState<Clue[]>(INITIAL_CLUES);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.gameDurationMinutes * 60);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Persistence Key
  const STORAGE_KEY = 'ignite_treasure_hunt_v1';

  // Initialize Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTeams(parsed.teams);
      setClues(parsed.clues);
      setIsGameStarted(parsed.isGameStarted);
      if (parsed.isGameStarted) {
         // Calculate remaining time based on start timestamp
         const elapsed = Math.floor((Date.now() - parsed.gameStartTime) / 1000);
         const remaining = (GAME_CONFIG.gameDurationMinutes * 60) - elapsed;
         setTimeLeft(Math.max(0, remaining));
      }
    } else {
      const initialTeams: Team[] = INITIAL_TEAMS.map(t => ({
        ...t,
        currentClueIndex: 0,
        points: 0,
        clueStep: 'QUESTION',
        isFinished: false,
        progress: []
      }));
      setTeams(initialTeams);
    }
  }, []);

  // Save State
  useEffect(() => {
    if (teams.length > 0) {
      const state = {
        teams,
        clues,
        isGameStarted,
        gameStartTime: isGameStarted ? (Date.now() - (GAME_CONFIG.gameDurationMinutes * 60 - timeLeft) * 1000) : null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [teams, clues, isGameStarted, timeLeft]);

  // Game Timer Effect
  useEffect(() => {
    if (!isGameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, timeLeft]);

  const handleLogin = (name: string, pass: string) => {
    const team = teams.find(t => t.name.toLowerCase() === name.toLowerCase() && t.password === pass);
    if (team) {
      setCurrentTeam(team);
      if (team.isFinished) {
        setView(AppView.FINISHED);
      } else {
        setView(AppView.INSTRUCTIONS);
      }
    } else {
      alert("Invalid credentials!");
    }
  };

  const startCompetition = () => {
    setIsGameStarted(true);
    setView(AppView.GAME);
  };

  const updateTeamState = (updatedTeam: Team) => {
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    setCurrentTeam(updatedTeam);
  };

  const logout = () => {
    setCurrentTeam(null);
    setView(AppView.LOGIN);
  };

  const isAdmin = currentTeam?.name === 'Admin' || false;

  return (
    <div className="min-h-screen text-white p-4 pb-24 relative max-w-lg mx-auto overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
            <Flame className="text-white fill-current" size={24} />
          </div>
          <h1 className="font-battle text-2xl tracking-tighter uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500">
            Ignite
          </h1>
        </div>
        
        {view !== AppView.LOGIN && (
          <div className="flex gap-2">
            <button 
              onClick={() => setView(v => v === AppView.LEADERBOARD ? (currentTeam?.isFinished ? AppView.FINISHED : AppView.GAME) : AppView.LEADERBOARD)}
              className="p-2 glass rounded-full hover:bg-white/10 transition-all border-orange-500/30 border"
            >
              <Trophy size={20} className="text-yellow-400" />
            </button>
            <button 
              onClick={logout}
              className="p-2 glass rounded-full hover:bg-white/10 transition-all border-red-500/30 border"
            >
              <LogOut size={20} className="text-red-400" />
            </button>
            <button 
              onClick={() => setView(AppView.ADMIN)}
              className="p-2 glass rounded-full hover:bg-white/10 transition-all border-blue-500/30 border"
            >
              <Settings size={20} className="text-blue-400" />
            </button>
          </div>
        )}
      </header>

      {/* Persistent Timer for all active views */}
      {isGameStarted && view !== AppView.LOGIN && (
        <div className="mb-6">
          <Timer seconds={timeLeft} />
        </div>
      )}

      {/* Content Area */}
      <main className="relative z-10 transition-all duration-500">
        {view === AppView.LOGIN && <Login onLogin={handleLogin} />}
        {view === AppView.INSTRUCTIONS && <Instructions team={currentTeam!} onStart={startCompetition} />}
        {view === AppView.GAME && (
          <GameView 
            team={currentTeam!} 
            clues={clues} 
            teams={teams}
            onUpdate={updateTeamState} 
            onFinish={() => setView(AppView.FINISHED)}
            timeLeft={timeLeft}
          />
        )}
        {view === AppView.LEADERBOARD && <Leaderboard teams={teams} currentTeamId={currentTeam?.id} />}
        {view === AppView.FINISHED && (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-bounce">
              <Trophy size={48} className="text-black" />
            </div>
            <h2 className="text-4xl font-battle font-black text-yellow-400">VICTORY!</h2>
            <div className="glass p-6 rounded-2xl w-full border-yellow-500/30 border">
              <p className="text-gray-300 mb-2">Battle Concluded</p>
              <div className="text-5xl font-battle font-black text-white mb-4">{currentTeam?.points} <span className="text-sm text-yellow-500">PTS</span></div>
              <p className="text-sm text-gray-400 italic">"The fire in you burns brighter than the challenge."</p>
            </div>
            <button 
              onClick={() => setView(AppView.LEADERBOARD)}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl font-battle font-bold shadow-lg shadow-yellow-500/40 hover:scale-105 transition-transform"
            >
              View Leaderboard
            </button>
          </div>
        )}
        {view === AppView.ADMIN && (
          <AdminPanel 
            teams={teams} 
            clues={clues} 
            setTeams={setTeams} 
            setClues={setClues} 
            onBack={() => setView(AppView.GAME)} 
          />
        )}
      </main>

      {/* Footer Navigation (Mobile Style) */}
      {view !== AppView.LOGIN && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass rounded-2xl flex justify-around p-3 z-50 border-white/10 border-t">
          <button 
            onClick={() => setView(currentTeam?.isFinished ? AppView.FINISHED : AppView.GAME)} 
            className={`flex flex-col items-center gap-1 transition-colors ${view === AppView.GAME ? 'text-orange-500' : 'text-gray-400'}`}
          >
            <Zap size={20} />
            <span className="text-[10px] uppercase font-bold">Battle</span>
          </button>
          <button 
            onClick={() => setView(AppView.LEADERBOARD)} 
            className={`flex flex-col items-center gap-1 transition-colors ${view === AppView.LEADERBOARD ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            <Trophy size={20} />
            <span className="text-[10px] uppercase font-bold">Ranks</span>
          </button>
          <button 
            onClick={() => setView(AppView.INSTRUCTIONS)} 
            className={`flex flex-col items-center gap-1 transition-colors ${view === AppView.INSTRUCTIONS ? 'text-blue-500' : 'text-gray-400'}`}
          >
            <HelpCircle size={20} />
            <span className="text-[10px] uppercase font-bold">Help</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
