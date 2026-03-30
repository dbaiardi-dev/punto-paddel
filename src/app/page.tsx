'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Logo y título */}
      <div className="mb-8">
        <div className="text-6xl mb-4">🎾</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          PuntoPaddel
        </h1>
        <p className="text-slate-400 mt-2">Marcá puntos con un gesto</p>
      </div>

      {/* Mensaje motivador premium */}
      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl p-6 mb-8 max-w-sm">
        <div className="text-3xl mb-3">🏆</div>
        <h2 className="text-xl font-bold text-amber-400 mb-2">
          ¡Sé Premium de por vida!
        </h2>
        <p className="text-slate-300 text-sm mb-4">
          Por solo <span className="text-2xl font-bold text-green-400">$3 USD</span> tenés acceso premium 
          <span className="font-bold"> para siempre</span>.
        </p>
        <p className="text-slate-400 text-xs mb-4">
          La app va a seguir mejorando y vos vas a tener todas las funciones nuevas sin pagar más.
          <span className="text-amber-400 font-semibold"> ¡Nuestros héroes fundadores!</span>
        </p>
        <button 
          onClick={() => setShowPremiumModal(true)}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/25"
        >
          💎 Quiero ser Premium
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 mb-8 max-w-sm w-full">
        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
          <div className="text-2xl">👋</div>
          <div className="text-left">
            <h3 className="font-semibold">Sin tocar el celular</h3>
            <p className="text-slate-400 text-sm">Levantá la mano 3 segundos para marcar punto</p>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
          <div className="text-2xl">📱</div>
          <div className="text-left">
            <h3 className="font-semibold">Conectá dos celulares</h3>
            <p className="text-slate-400 text-sm">Cada jugador marca sus puntos</p>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
          <div className="text-2xl">📊</div>
          <div className="text-left">
            <h3 className="font-semibold">Estadísticas</h3>
            <p className="text-slate-400 text-sm">Llevá el historial de tus partidos</p>
          </div>
        </div>
      </div>

      {/* Botón de login/entrar */}
      <Link 
        href="/dashboard"
        className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 text-center"
      >
        Comenzar 🚀
      </Link>

      <p className="text-slate-500 text-xs mt-4">
        Sin registro por ahora — entrá y probá
      </p>

      {/* Modal Premium */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-4xl mb-4 text-center">💎</div>
            <h2 className="text-xl font-bold text-center mb-4">Hazte Premium</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-green-400">
                <span>✓</span>
                <span className="text-slate-300">Acceso de por vida</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✓</span>
                <span className="text-slate-300">Todas las funciones futuras</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✓</span>
                <span className="text-slate-300">Estadísticas avanzadas</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✓</span>
                <span className="text-slate-300">Sin publicidad nunca</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✓</span>
                <span className="text-slate-300">Soporte prioritario</span>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 mb-6 text-center">
              <p className="text-slate-400 text-sm">Precio especial fundadores</p>
              <p className="text-3xl font-bold text-green-400">$3 USD</p>
              <p className="text-slate-500 text-xs">Pago único, para siempre</p>
            </div>

            <input
              type="email"
              placeholder="Tu email para Premium"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 mb-4 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />

            <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all mb-3">
              Pagar con MercadoPago
            </button>

            <button 
              onClick={() => setShowPremiumModal(false)}
              className="w-full text-slate-400 py-2"
            >
              Ahora no
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
