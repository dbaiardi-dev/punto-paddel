'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  createMatch, 
  processMatchPoint, 
  getScoreText, 
  getBreakPointsText,
  isInDeuce,
  type MatchState, 
  type Team 
} from '@/utils/scoreLogic';

export default function MatchPage() {
  const [matchState, setMatchState] = useState<MatchState>(createMatch('blue'));
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownTeam, setCountdownTeam] = useState<Team | null>(null);
  const [gestureActive, setGestureActive] = useState<Team | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gestureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentSet = matchState.sets[matchState.currentSetIndex];
  const currentGame = currentSet.currentGame;
  const scoreText = getScoreText(currentGame);
  const breakPointText = getBreakPointsText(currentGame);
  const inDeuce = isInDeuce(currentGame);

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraEnabled(true);
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      alert('No se pudo acceder a la cámara. Podés marcar puntos manualmente tocando la pantalla.');
    }
  };

  // Detener cámara
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraEnabled(false);
    }
  };

  // Procesar punto
  const scorePoint = useCallback((team: Team) => {
    if (matchEnded) return;
    
    const newState = processMatchPoint(matchState, team);
    setMatchState(newState);
    
    if (newState.matchWonBy) {
      setMatchEnded(true);
    }
    
    // Reset gesture state
    setCountdown(null);
    setCountdownTeam(null);
    setGestureActive(null);
  }, [matchState, matchEnded]);

  // Iniciar countdown de gesto
  const startGestureCountdown = (team: Team) => {
    if (countdown !== null || matchEnded) return;
    
    setCountdownTeam(team);
    setGestureActive(team);
    setCountdown(3);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          scorePoint(team);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cancelar countdown
  const cancelCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setCountdown(null);
    setCountdownTeam(null);
    setGestureActive(null);
  };

  // Detección de gesto simple (mano arriba) - Placeholder
  // En producción usaríamos TensorFlow.js o MediaPipe
  useEffect(() => {
    if (!cameraEnabled) return;
    
    const detectGesture = () => {
      // Placeholder: En una implementación real, aquí iría
      // la detección de pose/mano con TensorFlow.js o MediaPipe
      // Por ahora, la detección se hace manualmente con touch
    };

    const interval = setInterval(detectGesture, 100);
    return () => clearInterval(interval);
  }, [cameraEnabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Reiniciar partido
  const restartMatch = () => {
    setMatchState(createMatch('blue'));
    setMatchEnded(false);
    setCountdown(null);
    setCountdownTeam(null);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur px-4 py-3 flex items-center justify-between z-10">
        <Link href="/dashboard" className="text-slate-400 hover:text-white">
          ← Salir
        </Link>
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Set {matchState.currentSetIndex + 1}
          </p>
          <p className="font-mono font-bold">
            {currentSet.blueGames} - {currentSet.redGames}
          </p>
        </div>
        <button 
          onClick={cameraEnabled ? stopCamera : startCamera}
          className={`px-3 py-1 rounded-lg text-sm ${
            cameraEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'
          }`}
        >
          {cameraEnabled ? '📷 ON' : '📷 OFF'}
        </button>
      </div>

      {/* Sets anteriores */}
      {matchState.sets.length > 1 && (
        <div className="bg-slate-800/50 px-4 py-2 flex justify-center gap-4">
          {matchState.sets.slice(0, -1).map((set, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xs text-slate-500">Set {idx + 1}</p>
              <p className="font-mono text-sm">
                <span className={set.setWonBy === 'blue' ? 'text-blue-400 font-bold' : ''}>{set.blueGames}</span>
                {' - '}
                <span className={set.setWonBy === 'red' ? 'text-red-400 font-bold' : ''}>{set.redGames}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Cancha de pádel - Vista dividida */}
      <div className="flex-1 flex flex-col relative">
        {/* Video oculto para cámara */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Lado Azul */}
        <button
          onClick={() => startGestureCountdown('blue')}
          onTouchStart={() => startGestureCountdown('blue')}
          onTouchEnd={cancelCountdown}
          onMouseUp={cancelCountdown}
          disabled={matchEnded}
          className={`flex-1 court-pattern flex flex-col items-center justify-center relative transition-all ${
            gestureActive === 'blue' ? 'brightness-125' : ''
          } ${matchEnded ? 'opacity-50' : ''}`}
        >
          {/* Líneas de cancha */}
          <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
          <div className="absolute inset-x-4 top-1/2 h-0.5 bg-white/30" />
          
          {/* Score */}
          <div className="relative z-10 text-center">
            <p className="text-slate-300/80 text-sm mb-1">Equipo Azul</p>
            <p className={`text-7xl font-bold ${
              countdownTeam === 'blue' ? 'text-blue-300 animate-pulse' : 'text-white'
            }`}>
              {scoreText.blue}
            </p>
            {currentGame.servingTeam === 'blue' && (
              <span className="text-yellow-400 text-2xl">🎾</span>
            )}
          </div>

          {/* Countdown overlay */}
          {countdownTeam === 'blue' && countdown !== null && (
            <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-blue-400 flex items-center justify-center animate-countdown">
                <span className="text-6xl font-bold text-white">{countdown}</span>
              </div>
            </div>
          )}
        </button>

        {/* Línea central / Info del game */}
        <div className="bg-slate-900 py-2 px-4 flex items-center justify-center gap-4">
          {inDeuce && breakPointText && (
            <span className="text-amber-400 text-sm font-semibold animate-pulse">
              {breakPointText}
            </span>
          )}
          {!inDeuce && (
            <span className="text-slate-500 text-sm">
              Toca tu lado para marcar punto
            </span>
          )}
        </div>

        {/* Lado Rojo */}
        <button
          onClick={() => startGestureCountdown('red')}
          onTouchStart={() => startGestureCountdown('red')}
          onTouchEnd={cancelCountdown}
          onMouseUp={cancelCountdown}
          disabled={matchEnded}
          className={`flex-1 bg-gradient-to-b from-red-900/50 to-red-950/50 flex flex-col items-center justify-center relative transition-all ${
            gestureActive === 'red' ? 'brightness-125' : ''
          } ${matchEnded ? 'opacity-50' : ''}`}
        >
          {/* Líneas de cancha */}
          <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
          <div className="absolute inset-x-4 top-1/2 h-0.5 bg-white/30" />
          
          {/* Score */}
          <div className="relative z-10 text-center">
            <p className="text-slate-300/80 text-sm mb-1">Equipo Rojo</p>
            <p className={`text-7xl font-bold ${
              countdownTeam === 'red' ? 'text-red-300 animate-pulse' : 'text-white'
            }`}>
              {scoreText.red}
            </p>
            {currentGame.servingTeam === 'red' && (
              <span className="text-yellow-400 text-2xl">🎾</span>
            )}
          </div>

          {/* Countdown overlay */}
          {countdownTeam === 'red' && countdown !== null && (
            <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-red-400 flex items-center justify-center animate-countdown">
                <span className="text-6xl font-bold text-white">{countdown}</span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Modal de fin de partido */}
      {matchEnded && matchState.matchWonBy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">
              ¡{matchState.matchWonBy === 'blue' ? 'Equipo Azul' : 'Equipo Rojo'} Gana!
            </h2>
            <p className="text-slate-400 mb-6">
              {matchState.stats.blueSetsWon} - {matchState.stats.redSetsWon} en sets
            </p>
            
            <div className="space-y-3">
              <button
                onClick={restartMatch}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl"
              >
                Jugar de nuevo
              </button>
              <Link
                href="/dashboard"
                className="block w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-xl"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
