
import React, { useState } from 'react';
import { MediaData } from '../types';
import { PencilIcon, LinkIcon } from './Icons';

interface ResultViewProps {
  data: MediaData;
  onSave: (data: MediaData) => void;
  onChat: () => void;
  onRetake: () => void;
  allowedPins: string[];
}

const ResultView: React.FC<ResultViewProps> = ({ data, onSave, onChat, onRetake, allowedPins }) => {
  // Ensure pin has a default value if not present in legacy data
  const [editedData, setEditedData] = useState<MediaData>({
    ...data,
    pin: data.pin || "0000"
  });
  const [copied, setCopied] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPinWarning, setShowPinWarning] = useState(false);
  
  const [isEditingAnnotation, setIsEditingAnnotation] = useState(false);
  const [isAnnotationExpanded, setIsAnnotationExpanded] = useState(false);

  const handleChange = (field: keyof MediaData, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Remove any non-digit characters immediately
    val = val.replace(/\D/g, '');
    
    // Enforce strict max length of 4 digits
    if (val.length > 4) {
        val = val.slice(0, 4);
    }

    handleChange('pin', val);
    setPinError(null);
  };

  const handlePinBlur = () => {
    const pin = editedData.pin;
    
    // Check format (exactly 4 digits)
    if (!pin || pin.length !== 4) {
        // If empty or incomplete, reset to 0000 silently (or we could warn here too)
        handleChange('pin', "0000");
        return;
    }

    // Check if PIN is in allowed list
    // STRICT CHECK: The PIN must be in the list OR be exactly "0000".
    // We removed the check (allowedPins.length > 0), so if the list fails to load (is empty),
    // ONLY "0000" will be accepted.
    if (!allowedPins.includes(pin) && pin !== "0000") {
        // Step 1: Set PIN to 0000
        handleChange('pin', "0000");
        // Step 2: Show confirmation dialog
        setShowPinWarning(true);
    }
  };

  const copyToClipboard = () => {
    // Sanitize data for TSV format to prevent breaking Sheet rows
    // We replace tabs and newlines with spaces so it stays in one cell
    const clean = (text: string) => text ? text.replace(/\t/g, ' ').replace(/\n/g, ' ').trim() : '';
    const pinVal = (editedData.pin && editedData.pin.length === 4) ? editedData.pin : "0000";

    // Format for Google Sheets (Tab separated)
    // Only copy the data row, not the header
    const row = `${clean(editedData.type)}\t${clean(editedData.title)}\t${clean(editedData.author)}\t${clean(editedData.publicationYear)}\t${clean(editedData.annotation)}\t${clean(editedData.sourceUrl)}\t${pinVal}`;
    const textToCopy = row;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      onSave(editedData); // Trigger save callback conceptually
    });
  };

  const getAppSheetUrl = () => {
    const baseUrl = "https://www.appsheet.com/start/33b34290-cc77-4a7b-9c7e-9cb483dc3f3d";
    
    // Check if pin is exactly 4 digits, otherwise default to "0000"
    const pinVal = (editedData.pin && editedData.pin.length === 4) ? editedData.pin : "0000";

    // Map fields to Czech keys expected by the AppSheet form defaults
    const defaults = {
      "Typ": editedData.type,
      "Název": editedData.title,
      "Autor": editedData.author,
      "Rok": editedData.publicationYear,
      "Anotace": editedData.annotation,
      "Zdroj": editedData.sourceUrl || "",
      "PIN": pinVal
    };

    const jsonDefaults = JSON.stringify(defaults);
    const encodedDefaults = encodeURIComponent(jsonDefaults);

    return `${baseUrl}#view=Knihomol_AI_Form&defaults=${encodedDefaults}`;
  };

  const handleChatClick = () => {
    onSave(editedData); // Save current edits to App state before switching
    onChat();
  };

  // Truncation logic
  const MAX_LENGTH = 200;
  const shouldTruncate = editedData.annotation.length > MAX_LENGTH;
  const displayedAnnotation = !isAnnotationExpanded && shouldTruncate
    ? `${editedData.annotation.slice(0, MAX_LENGTH)}...`
    : editedData.annotation;

  const isFilm = editedData.type === 'Film';

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl mx-auto border border-gray-100 relative">
      {/* PIN Confirmation Overlay */}
      {showPinWarning && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-fade-in-up">
                <h3 className="text-lg font-bold text-red-600 mb-2">Neplatný PIN</h3>
                <p className="text-gray-700 text-sm mb-4">
                    Zadaný PIN není v seznamu povolených. Hodnota byla automaticky změněna na výchozí <strong>0000</strong>.
                </p>
                <p className="text-gray-600 text-sm mb-6">
                    Přejete si záznam uložit s tímto výchozím PINem?
                </p>
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={() => {
                            handleChange('pin', ''); // Clear to let them try again
                            setShowPinWarning(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                    >
                        Upravit
                    </button>
                    <button 
                        onClick={() => setShowPinWarning(false)} // Accept 0000
                        className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                    >
                        Ano, použít 0000
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800 serif">Detaily záznamu</h2>
            <button onClick={onRetake} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Zrušit
            </button>
        </div>

        <div className="grid gap-4">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
             <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="mediaType" 
                        checked={editedData.type === 'Kniha'} 
                        onChange={() => handleChange('type', 'Kniha')}
                        className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Kniha</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="radio" 
                        name="mediaType" 
                        checked={editedData.type === 'Film'} 
                        onChange={() => handleChange('type', 'Film')}
                        className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Film</span>
                </label>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Název</label>
            <input 
              type="text" 
              value={editedData.title} 
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isFilm ? 'Režisér' : 'Autor'}
              </label>
              <input 
                type="text" 
                value={editedData.author} 
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rok vydání</label>
              <input 
                type="text" 
                value={editedData.publicationYear} 
                onChange={(e) => handleChange('publicationYear', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Zdroj (URL)</label>
             <div className="flex gap-2">
                 <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        value={editedData.sourceUrl || ''} 
                        onChange={(e) => handleChange('sourceUrl', e.target.value)}
                        placeholder={isFilm ? "https://www.csfd.cz/..." : "https://www.databazeknih.cz/..."}
                        className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                 </div>
                 {editedData.sourceUrl && (
                    <a 
                        href={editedData.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-300 flex items-center transition-colors"
                        title="Otevřít odkaz"
                    >
                        <span className="text-xs font-semibold">Otevřít</span>
                    </a>
                 )}
             </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Anotace</label>
                {!isEditingAnnotation && (
                    <button
                        onClick={() => setIsEditingAnnotation(true)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Upravit anotaci"
                    >
                        <PencilIcon className="w-3.5 h-3.5" />
                        Upravit
                    </button>
                )}
            </div>
            
            {isEditingAnnotation ? (
                 <div className="relative">
                     <textarea 
                      value={editedData.annotation} 
                      onChange={(e) => handleChange('annotation', e.target.value)}
                      rows={8}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm leading-relaxed shadow-sm"
                      autoFocus
                    />
                     <button 
                        onClick={() => setIsEditingAnnotation(false)}
                        className="absolute bottom-3 right-3 bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-indigo-700 transition shadow-sm"
                    >
                        Hotovo
                    </button>
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:border-gray-300">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {displayedAnnotation}
                    </p>
                    {shouldTruncate && (
                         <button 
                            onClick={() => setIsAnnotationExpanded(!isAnnotationExpanded)}
                            className="mt-2 text-indigo-600 hover:text-indigo-800 text-xs font-medium focus:outline-none hover:underline"
                        >
                            {isAnnotationExpanded ? 'Zobrazit méně' : 'Číst dál...'}
                        </button>
                    )}
                </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex gap-3 items-end">
                <div className="flex-none relative">
                     <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">PIN</label>
                     <input 
                        type="text"
                        inputMode="numeric"
                        value={editedData.pin || ''} 
                        onChange={handlePinChange}
                        onBlur={handlePinBlur}
                        placeholder="0000"
                        className={`w-24 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-center tracking-widest text-sm ${pinError ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300'}`}
                    />
                    {pinError && (
                        <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                            {pinError}
                        </div>
                    )}
                </div>
                <a 
                    href={getAppSheetUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all shadow-sm border border-blue-100"
                >
                    <LinkIcon className="w-5 h-5" />
                    Uložit
                </a>
            </div>
            
            <button 
                onClick={handleChatClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
                <span className="text-xl">✨</span>
                Chat o {isFilm ? 'filmu' : 'knize'}
            </button>
        </div>
        
        {copied && <p className="text-xs text-center text-green-600 mt-0">Data zkopírována do schránky (včetně PINu).</p>}
      </div>
    </div>
  );
};

export default ResultView;
