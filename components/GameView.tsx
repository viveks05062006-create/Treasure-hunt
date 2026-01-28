
import React, { useState } from 'react';
import { Team, Clue, TeamProgress } from '../types';
import { MapPin, QrCode, Search, CheckCircle, AlertTriangle, Zap, Sparkles } from 'lucide-react';
import QRScanner from './QRScanner';
import ProgressBar from './ProgressBar';

interface GameViewProps {
  team: Team;
  clues: Clue[];
  teams: Team[];
  onUpdate: (updatedTeam: Team) => void;
  onFinish: () => void;
  timeLeft: number;
}

const GameView: React.FC<GameViewProps> = ({ team, clues, teams, onUpdate, onFinish, timeLeft }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const currentClue = clues[team.currentClueIndex];
  const isLastClue = team.currentClueIndex === clues.length - 1;

  if (!currentClue) return <div className="text-center py-20">Loading Battle Data...</div>;

  const handleSubmitAnswer = () => {
    if (answer.toLowerCase().trim() === currentClue.answer.toLowerCase()) {
      const updatedTeam = { ...team, clueStep: 'SCAN' as const };
      
      // Update progress
      const existingProgress = [...(team.progress || [])];
      existingProgress[team.currentClueIndex] = {
        ...existingProgress[team.currentClueIndex],
        clueId: currentClue.id,
        questionSolvedAt: Date.now()
      };
      
      updatedTeam.progress = existingProgress;
      updatedTeam.points += 10; // Point for question

      setSuccess('CORRECT! The path is revealed.');
      setError('');
      setTimeout(() => {
        setSuccess('');
        onUpdate(updatedTeam);
      }, 1500);
    } else {
      setError('Incorrect! The flame flickers... try again.');
      setSuccess('');
    }
  };

  const handleScanSuccess = (data: string) => {
    if (data === currentClue.qrCodeId) {
      setIsScanning(false);
      
      const isFirst = !teams.some(t => 
        t.id !== team.id && 
        t.currentClueIndex > team.currentClueIndex
      );

      const updatedTeam = { ...team };
      updatedTeam.points += 10; // Points for scan
      if (isFirst) updatedTeam.points += 5; // Bonus for first

      const existingProgress = [...(team.progress || [])];
      existingProgress[team.currentClueIndex] = {
        ...existingProgress[team.currentClueIndex],
        qrScannedAt: Date.now()
      };
      updatedTeam.progress = existingProgress;

      if (isLastClue) {
        updatedTeam.isFinished = true;
        updatedTeam.finishTime = Date.now();
        onUpdate(updatedTeam);
        onFinish();
      } else {
        updatedTeam.currentClueIndex += 1;
        updatedTeam.clueStep = 'QUESTION';
        onUpdate(updatedTeam);
        setSuccess('TARGET ACQUIRED! Moving to next clue...');
        setTimeout(() => setSuccess(''), 2000);
      }
    } else {
      setError('Invalid QR code! This is not the target location.');
      setIsScanning(false);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Progress */}
      <div className="glass p-4 rounded-xl border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-battle text-orange-400">Level {team.currentClueIndex + 1} of {clues.length}</span>
          <span className="text-xs font-battle text-yellow-500">{team.points} Points</span>
        </div>
        <ProgressBar current={team.currentClueIndex + 1} total={clues.length} />
      </div>

      {/* Main Action Card */}
      <div className="glass rounded-3xl overflow-hidden border-orange-500/20 border-2 shadow-2xl shadow-orange-900/20">
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6 flex items-center justify-between border-b border-white/10">
          <h3 className="font-battle text-xl font-black uppercase tracking-tight flex items-center gap-2">
             <Zap size={20} className="text-yellow-400 fill-current" />
             {currentClue.title}
          </h3>
          <div className="text-[10px] bg-black/50 px-2 py-1 rounded font-battle uppercase border border-white/10">
            {team.clueStep === 'QUESTION' ? 'Phase 1: Intel' : 'Phase 2: Extraction'}
          </div>
        </div>

        <div className="p-6">
          {team.clueStep === 'QUESTION' ? (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white/5 p-4 rounded-xl italic text-lg text-gray-200 leading-relaxed border border-white/5">
                "{currentClue.question}"
              </div>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your answer..."
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 transition-colors uppercase font-bold tracking-widest text-center"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={timeLeft <= 0}
                />
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={timeLeft <= 0}
                  className="w-full py-4 bg-orange-600 rounded-xl font-battle font-black text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50"
                >
                  SUBMIT SOLUTION
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-4 bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                <MapPin className="text-blue-500 shrink-0" size={32} />
                <div>
                   <p className="text-xs text-blue-300 font-battle uppercase tracking-widest mb-1">Location Intel</p>
                   <p className="text-white font-medium">{currentClue.locationHint}</p>
                </div>
              </div>

              {!isScanning ? (
                <button 
                  onClick={() => setIsScanning(true)}
                  disabled={timeLeft <= 0}
                  className="w-full py-8 glass rounded-2xl flex flex-col items-center gap-4 border-2 border-dashed border-orange-500/50 hover:bg-orange-500/10 transition-colors disabled:opacity-50 group"
                >
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform">
                    <QrCode size={32} />
                  </div>
                  <div className="text-center">
                    <span className="font-battle font-black text-xl uppercase block">Activate Scanner</span>
                    <span className="text-xs text-gray-400">Scan code at the location</span>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden glass aspect-square border-2 border-orange-500">
                  <QRScanner onScan={handleScanSuccess} />
                  <button 
                    onClick={() => setIsScanning(false)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 rounded-full text-xs font-battle"
                  >
                    Cancel Scan
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30 text-sm animate-bounce">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/30 text-sm animate-pulse">
              <CheckCircle size={16} />
              {success}
            </div>
          )}
        </div>
      </div>

      {timeLeft <= 0 && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-5xl font-battle font-black text-red-500 mb-4 uppercase">Time Expired</h2>
          <p className="text-gray-400 mb-8 max-w-xs">The hunt has ended. Check the leaderboard for the final results.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 rounded-xl font-battle font-bold"
          >
            EXIT TO LOBBY
          </button>
        </div>
      )}
    </div>
  );
};

export default GameView;
