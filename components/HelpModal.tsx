
import React from 'react';
import { XMarkIcon } from './Icons';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
          <h2 className="text-xl font-bold text-gray-800 serif">O aplikaci</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4 text-gray-700 text-sm leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-indigo-700 mb-2">📖 Co to umí?</h3>
            <p>
              Tato aplikace umožňuje vyfotit obálku knihy nebo plakát filmu a automaticky získat strukturované informace (název, autora/režiséra, rok vydání, anotaci). 
              Je ideálním pomocníkem pro čtenáře a filmové fanoušky, kteří si chtějí vést evidenci svých zážitků.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-indigo-700 mb-2">✨ Hlavní funkce</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rozpoznání obrazu:</strong> Vyfoťte obálku nebo nahrajte fotku z galerie.</li>
              <li><strong>Detekce typu:</strong> AI automaticky pozná, zda jde o Knihu nebo Film.</li>
              <li><strong>Extrakce dat:</strong> Získá název, autora, rok a vytvoří stručnou anotaci v češtině.</li>
              <li><strong>Odkazy na zdroje:</strong> Automaticky vytvoří vyhledávací odkaz na Databazeknih.cz nebo ČSFD.cz.</li>
              <li><strong>AI Chat:</strong> Můžete se doptat na herce, další díla nebo jiné zajímavosti.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-indigo-700 mb-2">🚀 Jak aplikaci používat</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Vyfotit / Nahrát:</strong> Na úvodní obrazovce zvolte vstup.
              </li>
              <li>
                <strong>Analýza:</strong> Počkejte pár vteřin, než umělá inteligence zpracuje obrázek.
              </li>
              <li>
                <strong>Kontrola:</strong> Zkontrolujte údaje. Můžete je ručně přepsat nebo upravit anotaci ikonkou tužky.
              </li>
              <li>
                <strong>Uložit:</strong> Tlačítko <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold border border-blue-100">Uložit</span> udělá dvě věci:
                <ul className="list-disc pl-5 mt-1 text-xs text-gray-600">
                    <li>Zkopíruje data do schránky (pro vložení do tabulky).</li>
                    <li>Otevře externí formulář (AppSheet), kde data můžete potvrdit.</li>
                </ul>
              </li>
              <li>
                <strong>Chat:</strong> Pro další dotazy klikněte na "Chat o knize/filmu".
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-bold text-indigo-700 mb-2">💡 Důležité info</h3>
            <ul className="list-disc pl-5 space-y-1">
               <li>
                <strong>PIN:</strong> Pole PIN musí obsahovat přesně <strong>4 číslice</strong>. Pokud zadáte nesprávný formát, hodnota se automaticky vrátí na <code>0000</code>. Pro vysvětlení účelu a získání správného PINu kontaktujte autora aplikace.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
