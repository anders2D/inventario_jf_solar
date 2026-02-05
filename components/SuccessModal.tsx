
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full transform scale-100 transition-all p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-emerald-600 dark:text-emerald-400 w-12 h-12" strokeWidth={3} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Éxito!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/30 active:scale-95"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
