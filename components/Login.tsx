
import React, { useState } from 'react';
import { Lock, User, ArrowRight, Building2, AlertTriangle, ShieldCheck, Sun, Moon } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  logoUrl: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, logoUrl, isDarkMode, onToggleDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkCapsLock = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { authService } = await import('../services/auth');
      await authService.signIn(username, password);
      onLogin();
    } catch (err) {
      setError('Credenciales incorrectas. Verifique e intente nuevamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] px-4 transition-colors duration-500 relative overflow-hidden">
      
      {/* Botón Modo Dark en la Esquina */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={onToggleDarkMode}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-lg hover:shadow-blue-500/10 active:scale-95"
        >
          {isDarkMode ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Elementos Decorativos de Fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-md w-full relative">
        <div className="relative bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-100 dark:border-slate-800/50">
          
          <div className="pt-12 pb-8 px-10 text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] mx-auto flex items-center justify-center shadow-inner mb-6 border border-slate-100 dark:border-slate-700 overflow-hidden group">
               {!imageError ? (
                 <img 
                   src={logoUrl} 
                   alt="Logo JF Solar" 
                   className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                   onError={() => setImageError(true)}
                 />
               ) : (
                 <Building2 className="text-blue-500 w-12 h-12" />
               )}
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">JF Solar</h2>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">SISTEMA DE INVENTARIO</p>
          </div>

          <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-7">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-[10px] text-center font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 transition-colors duration-300 ml-1 ${isFocused === 'user' ? 'text-blue-600' : 'text-slate-400'}`}>Usuario Corporativo</label>
                <div className="relative">
                  <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused === 'user' ? 'text-blue-600' : 'text-slate-300 dark:text-slate-600'}`} size={18} strokeWidth={2.5} />
                  <input
                    type="text"
                    required
                    value={username}
                    onFocus={() => setIsFocused('user')}
                    onBlur={() => setIsFocused(null)}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    placeholder="Ingrese su usuario"
                  />
                </div>
              </div>

              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 transition-colors duration-300 ml-1 ${isFocused === 'pass' ? 'text-blue-600' : 'text-slate-400'}`}>Clave de Acceso</label>
                <div className="relative">
                  <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused === 'pass' ? 'text-blue-600' : 'text-slate-300 dark:text-slate-600'}`} size={18} strokeWidth={2.5} />
                  <input
                    type="password"
                    required
                    value={password}
                    onFocus={() => setIsFocused('pass')}
                    onBlur={() => setIsFocused(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={checkCapsLock}
                    onKeyDown={checkCapsLock}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
                {isCapsLockOn && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-amber-600 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
                    <AlertTriangle size={12} strokeWidth={3} />
                    Bloq Mayús Activo
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 active:scale-[0.98] group mt-4"
            >
              {isLoading ? 'INGRESANDO...' : 'INGRESAR AL PANEL'}
              <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="pt-4 flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Seguridad JF Solar v2.5</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
