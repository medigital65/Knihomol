import React, { useState } from 'react';
import { AppState, MediaData } from './types';
import CameraCapture from './components/CameraCapture';
import ResultView from './components/ResultView';
import ChatInterface from './components/ChatInterface';
import { analyzeMediaCover } from './services/geminiService';
import { SparklesIcon } from './components/Icons';

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
                <p className="text-gray-500">Vyfoťte obálku knihy nebo plakát filmu. AI rozpozná typ, detaily a vytvoří anotaci.</p>
             </div>
             
             <div className="w-full aspect-[3/4] max-h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative group cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => setState(AppState.CAMERA)}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-600 bg-indigo-50/50 group-hover:bg-indigo-50/80 transition">
                   <div className="p-4 bg-white rounded-full shadow-lg mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                     </svg>
                   </div>
                   <span className="font-semibold text-lg">Spustit kameru</span>
                </div>
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