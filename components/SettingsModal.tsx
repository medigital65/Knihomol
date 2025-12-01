
import React, { useState } from 'react';
import { XMarkIcon, ArrowPathIcon } from './Icons';
import { AppSettings } from '../types';
import { DEFAULT_ANALYSIS_PROMPT, DEFAULT_CHAT_SYSTEM_INSTRUCTION } from '../services/geminiService';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleChange = (field: keyof AppSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setSavedMessage('Nastavení uloženo!');
    setTimeout(() => {
        setSavedMessage(null);
        onClose();
    }, 1000);
  };

  const handleReset = () => {
    // Immediate reset without confirm dialog for better responsiveness
    // User must still click "Uložit" to persist the reset, so it's safe.
    setFormData({
        analysisPrompt: DEFAULT_ANALYSIS_PROMPT,
        chatSystemInstruction: DEFAULT_CHAT_SYSTEM_INSTRUCTION
    });
    setSavedMessage('Hodnoty obnoveny do výchozího nastavení.');
    setTimeout(() => setSavedMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 serif">Nastavení AI</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-sm text-gray-600">Zde můžete upravit instrukce pro umělou inteligenci. Změny se projeví při příští analýze nebo novém chatu.</p>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
                Prompt pro analýzu (Vize)
            </label>
            <p className="text-xs text-gray-500 mb-2">
                Instrukce pro Gemini Vision model. Definuje, co má AI na obrázku hledat a jaký formát má výstup mít.
            </p>
            <textarea
                value={formData.analysisPrompt}
                onChange={(e) => handleChange('analysisPrompt', e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
                Persona pro Chat (Systémová instrukce)
            </label>
            <p className="text-xs text-gray-500 mb-2">
                Instrukce pro chatovacího bota. Definuje tón komunikace, jazyk a omezení.
            </p>
            <textarea
                value={formData.chatSystemInstruction}
                onChange={(e) => handleChange('chatSystemInstruction', e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <button 
                type="button"
                onClick={handleReset}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-50 transition"
            >
                <ArrowPathIcon className="w-4 h-4" />
                Obnovit výchozí
            </button>

            <div className="flex items-center gap-4">
                {savedMessage && <span className="text-green-600 text-sm font-medium animate-fade-in">{savedMessage}</span>}
                <button 
                    type="button"
                    onClick={handleSave}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                    Uložit nastavení
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
