# Knihomol & Filmomol AI

Chytrá webová aplikace pro anotaci knih a filmů využívající umělou inteligenci Google Gemini.

## 📖 O aplikaci

Tato aplikace umožňuje uživatelům vyfotit obálku knihy nebo plakát filmu a automaticky získat strukturované informace. Je ideálním pomocníkem pro čtenáře a filmové fanoušky, kteří si chtějí vést evidenci svých zážitků v tabulkách (např. Google Sheets).

## ✨ Hlavní funkce

*   **Rozpoznání obrazu**: Vyfoťte obálku kamerou mobilu nebo nahrajte existující fotku.
*   **Automatická detekce typu**: AI pozná, zda se jedná o **Knihu** nebo **Film**.
*   **Extrakce a generování dat**:
    *   Název díla
    *   Autor (u knih) / Režisér (u filmů)
    *   Rok vydání/premiéry
    *   **Anotace**: Stručný souhrn děje přesně na 5 vět v českém jazyce.
*   **Interaktivní úpravy**: Možnost ručně editovat všechna pole včetně anotace.
*   **AI Chat**: Integrovaný chat s kontextem díla pro doplňující otázky (např. "Jak se jmenovala hlavní postava?", "Kdo hrál ve filmu?").
*   **Export do Tabulek**: Tlačítko pro zkopírování dat do schránky ve formátu optimalizovaném pro Google Sheets (odděleno tabulátory).

## 🛠️ Použité technologie

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
*   **Ikony**: SVG ikony

## 🚀 Jak aplikaci používat

1.  **Spuštění**: Aplikace vyžaduje nastavený `API_KEY` pro Google Gemini.
2.  **Skenování**: 
    *   Klikněte na "Spustit kameru".
    *   Povolte přístup k fotoaparátu.
    *   Vyfoťte obálku knihy nebo plakát.
3.  **Analýza**: Vyčkejte několik vteřin, než AI zpracuje obraz.
4.  **Kontrola a Úprava**:
    *   Zobrazí se formulář s detaily.
    *   Zkontrolujte správnost údajů.
    *   Pokud je anotace dlouhá, je zkrácena (tlačítko "Číst dál...").
    *   Kliknutím na "Upravit" u anotace můžete text přepsat.
5.  **Export**:
    *   Klikněte na **"Kopírovat do Google Sheets"**.
    *   Otevřete svou tabulku.
    *   Vložte data (Ctrl+V / Cmd+V). Data se vloží do sloupců: *Typ, Název, Autor/Režisér, Rok, Anotace*.
6.  **Chat**: Pro další dotazy klikněte na "Chat o knize/filmu".

## 📁 Struktura souborů

*   `App.tsx`: Hlavní logika aplikace a řízení stavů (Home -> Camera -> Analyzing -> Details -> Chat).
*   `services/geminiService.ts`: Logika pro volání Gemini API. Obsahuje definici JSON schématu pro strukturovaný výstup a systémové instrukce pro chat.
*   `components/ResultView.tsx`: Zobrazení výsledků, editace a kopírování do schránky.
*   `components/ChatInterface.tsx`: Chatovací okno s historií zpráv.
*   `components/CameraCapture.tsx`: Obsluha kamery a HTML5 Canvas pro zachycení snímku.
*   `types.ts`: TypeScript definice (MediaData, AppState).

## 📝 Poznámky

*   Aplikace automaticky odstraňuje Markdown formátování z odpovědí AI pro zajištění správného parsování JSONu.
*   Při kopírování do schránky jsou odstraněny tabulátory a nové řádky z textů, aby nedošlo k rozhození buněk v Excelu/Google Sheets.
