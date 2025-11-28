
import React, { useState } from 'react';
import { AppState, MediaData } from './types';
import CameraCapture from './components/CameraCapture';
import ResultView from './components/ResultView';
import ChatInterface from './components/ChatInterface';
import { analyzeMediaCover } from './services/geminiService';
import { SparklesIcon, CameraIcon, PhotoIcon } from './components/Icons';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCapture = async (imageData: string) => {
    setState(AppState.ANALYZING);
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const result = await analyzeMediaCover(imageData);
      setMediaData(result);
      setState(AppState.DETAILS);
    } catch (error) {
      console.error(error);
      setErrorMessage("Nepodařilo se analyzovat obrázek. Zkuste to prosím znovu nebo vyfoťte lepší fotku.");
      setState(AppState.HOME);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (data: MediaData) => {
    setMediaData(data);
  };

  const reset = () => {
    setState(AppState.HOME);
    setMediaData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <span className="text-2xl">📚🎬</span>
            <h1 className="text-xl font-bold tracking-tight serif">Knihomol & Filmomol AI</h1>
          </div>
          {state !== AppState.HOME && (
             <button onClick={reset} className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
                Začít znovu
             </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-6 w-full max-w-4xl mx-auto">
        
        {state === AppState.HOME && (
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md space-y-8 animate-fade-in-up">
             
             {errorMessage && (
               <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center shadow-sm">
                 <p className="font-medium">Chyba</p>
                 <p>{errorMessage}</p>
               </div>
             )}

             <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800 serif">Anotátor Knih a Filmů</h2>
                <p className="text-gray-500">Vyfoťte obálku nebo nahrajte obrázek. AI rozpozná typ, detaily a vytvoří anotaci.</p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setState(AppState.CAMERA)} 
                  className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 hover:border-indigo-200 hover:shadow-xl transition-all group flex flex-col items-center justify-center text-center gap-4 h-48 md:h-64"
                >
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                        <CameraIcon className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Vyfotit</h3>
                        <p className="text-sm text-gray-500">Použít kameru</p>
                    </div>
                </button>

                <label className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 hover:border-indigo-200 hover:shadow-xl transition-all group flex flex-col items-center justify-center text-center gap-4 h-48 md:h-64 cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                        <PhotoIcon className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Nahrát</h3>
                        <p className="text-sm text-gray-500">Z galerie</p>
                    </div>
                </label>
             </div>
          </div>
        )}

        {state === AppState.CAMERA && (
          <div className="w-full max-w-md h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
            <CameraCapture onCapture={handleCapture} />
          </div>
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                <SparklesIcon className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzuji obrázek...</h3>
              <p className="text-gray-500">Gemini AI zjišťuje, zda jde o knihu nebo film.</p>
            </div>
          </div>
        )}

        {state === AppState.DETAILS && mediaData && (
          <ResultView 
            data={mediaData} 
            onSave={handleSave} 
            onChat={() => setState(AppState.DETAILS + 1)} 
            onRetake={reset}
          />
        )}
        
        {state > AppState.DETAILS && mediaData && (
            <ChatInterface mediaData={mediaData} onBack={() => setState(AppState.DETAILS)} />
        )}

      </main>

      <footer className="text-center p-4 text-xs text-gray-400">
        Powered by Google Gemini 2.5 Flash
      </footer>
    </div>
  );
};

export default App;
