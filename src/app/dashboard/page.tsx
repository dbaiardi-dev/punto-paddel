'use client';

import Link from 'next/link';
import { useState } from 'react';

// Datos mock de estadísticas
const mockStats = {
  totalMatches: 12,
  wins: 8,
  losses: 4,
  winRate: 67,
  totalGames: 89,
  gamesWon: 52,
  lastMatches: [
    { id: 1, date: '28 Mar', opponent: 'vs Juan & Pedro', result: 'W', score: '6-4, 6-2' },
    { id: 2, date: '25 Mar', opponent: 'vs Carlos & Luis', result: 'L', score: '4-6, 3-6' },
    { id: 3, date: '22 Mar', opponent: 'vs Martin & Diego', result: 'W', score: '7-5, 6-3' },
  ]
};

export default function DashboardPage() {
  const [showPremiumBanner, setShowPremiumBanner] = useState(true);

  return (
    <main className="flex-1 flex flex-col p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">¡Hola, Jugador! 👋</h1>
          <p className="text-slate-400 text-sm">Listo para un partido?</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-xl">
          🎾
        </div>
      </div>

      {/* Banner Premium */}
      {showPremiumBanner && (
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-xl p-4 mb-6 relative">
          <button 
            onClick={() => setShowPremiumBanner(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div className="flex-1">
              <p className="font-semibold text-amber-400">¡Sé un héroe fundador!</p>
              <p className="text-sm text-slate-300">Premium de por vida por solo $3 USD</p>
            </div>
            <button className="bg-amber-500 text-black font-bold px-4 py-2 rounded-lg text-sm">
              💎 Ver
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Partidos</p>
          <p className="text-3xl font-bold">{mockStats.totalMatches}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Victorias</p>
          <p className="text-3xl font-bold text-green-400">{mockStats.wins}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Derrotas</p>
          <p className="text-3xl font-bold text-red-400">{mockStats.losses}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">% Victoria</p>
          <p className="text-3xl font-bold text-blue-400">{mockStats.winRate}%</p>
        </div>
      </div>

      {/* Win Rate Visual */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
        <p className="text-slate-400 text-sm mb-3">Tu rendimiento</p>
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
            style={{ width: `${mockStats.winRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-green-400">{mockStats.wins} ganados</span>
          <span className="text-red-400">{mockStats.losses} perdidos</span>
        </div>
      </div>

      {/* Últimos partidos */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3">Últimos partidos</h2>
        <div className="space-y-3">
          {mockStats.lastMatches.map((match) => (
            <div key={match.id} className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                match.result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {match.result}
              </div>
              <div className="flex-1">
                <p className="font-medium">{match.opponent}</p>
                <p className="text-slate-400 text-sm">{match.date}</p>
              </div>
              <p className="text-slate-300 font-mono">{match.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Botón flotante - Nuevo partido */}
      <Link
        href="/match"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-green-500/30 flex items-center gap-2 hover:from-green-400 hover:to-emerald-500 transition-all"
      >
        <span className="text-xl">🎾</span>
        Nuevo Partido
      </Link>
    </main>
  );
}
