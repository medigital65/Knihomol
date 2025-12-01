
import React, { useState } from 'react';
import { XMarkIcon, ArrowPathIcon, PhotoIcon } from './Icons';
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

  const handleDownloadLogo = () => {
    const canvas = document.createElement('canvas');
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // SVG with explicit colors (Tailwind classes won't work in blob)
    const svgString = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <path d="M50 15C30 15 10 25 10 25V85C10 85 30 75 50 75V15Z" fill="#4F46E5" />
        <path d="M50 15C35 15 15 22 15 22V82C15 82 35 75 50 75V15Z" fill="#6366F1" />
        <rect x="20" y="30" width="20" height="3" rx="1.5" fill="#C7D2FE" fill-opacity="0.6" />
        <rect x="20" y="38" width="24" height="3" rx="1.5" fill="#C7D2FE" fill-opacity="0.6" />
        <rect x="20" y="46" width="22" height="3" rx="1.5" fill="#C7D2FE" fill-opacity="0.6" />
        <rect x="20" y="54" width="18" height="3" rx="1.5" fill="#C7D2FE" fill-opacity="0.6" />
        <path d="M50 15C70 15 90 25 90 25V85C90 85 70 75 50 75V15Z" fill="#9333EA" />
        <path d="M50 15C65 15 85 22 85 22V82C85 82 65 75 50 75V15Z" fill="#A855F7" />
        <rect x="78" y="28" width="5" height="4" rx="1" fill="#E9D5FF" fill-opacity="0.8" />
        <rect x="78" y="38" width="5" height="4" rx="1" fill="#E9D5FF" fill-opacity="0.8" />
        <rect x="78" y="48" width="5" height="4" rx="1" fill="#E9D5FF" fill-opacity="0.8" />
        <rect x="78" y="58" width="5" height="4" rx="1" fill="#E9D5FF" fill-opacity="0.8" />
        <rect x="78" y="68" width="5" height="4" rx="1" fill="#E9D5FF" fill-opacity="0.8" />
        <path d="M50 15V75" stroke="white" stroke-width="1" stroke-opacity="0.3" />
      </svg>
    `;

    const img = new Image();
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = 'logo-story-stream.jpg';
        link.href = jpgUrl;
        link.click();
        URL.revokeObjectURL(url);
      }
    };
    img.src = url;
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
                Instrukce pro Gemini Vision model. Definuje styl anotace. (Extrakce dat probíhá automaticky).
            </p>
            <textarea
                value={formData.analysisPrompt}
                onChange={(e) => handleChange('analysisPrompt', e.target.value)}
                rows={4}
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
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
             <label className="block text-sm font-bold text-gray-700 mb-2">
                Logo aplikace
            </label>
            <button 
                type="button"
                onClick={handleDownloadLogo}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors border border-indigo-100"
            >
                <PhotoIcon className="w-4 h-4" />
                Stáhnout logo (JPG)
            </button>
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
