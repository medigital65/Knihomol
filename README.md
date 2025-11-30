# Knihomol & Filmomol AI

Chytrá webová aplikace pro anotaci knih a filmů využívající umělou inteligenci Google Gemini.

## 📖 O aplikaci

Tato aplikace umožňuje uživatelům vyfotit obálku knihy nebo plakát filmu a automaticky získat strukturované informace. Je ideálním pomocníkem pro čtenáře a filmové fanoušky, kteří si chtějí vést evidenci svých zážitků. Aplikace spolupracuje s externím formulářem (AppSheet) a usnadňuje přenos dat.

## ✨ Hlavní funkce

*   **Rozpoznání obrazu**: 
    *   📸 Vyfoťte obálku přímo v aplikaci.
    *   📂 Nahrajte existující fotku z galerie zařízení.
*   **Automatická detekce typu**: AI pozná, zda se jedná o **Knihu** nebo **Film**.
*   **Chytrá extrakce dat**:
    *   Název díla
    *   Autor (u knih) / Režisér (u filmů)
    *   Rok vydání/premiéry
    *   **Anotace**: Stručný souhrn děje přesně na 5 vět v českém jazyce.
    *   **Zdroj**: Automatické generování vyhledávacích odkazů na **Databazeknih.cz** (pro knihy) nebo **CSFD.cz** (pro filmy).
*   **Interaktivní úpravy**: Možnost ručně editovat všechna pole, zkracovat/rozbalovat dlouhé anotace.
*   **Workflow Uložení**:
    *   Tlačítko **Uložit** provede dvě akce najednou:
        1.  **Zkopíruje data do schránky** (optimalizováno pro tabulky, bez záhlaví).
        2.  **Otevře externí AppSheet formulář** v novém okně s předvyplněnými údaji.
*   **AI Chat**: Integrovaný chat s kontextem díla. Pamatuje si historii i při přepínání mezi obrazovkami.

## 🛠️ Použité technologie

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
*   **Ikony**: SVG ikony

## 🚀 Jak aplikaci používat

1.  **Spuštění**: Aplikace vyžaduje nastavený `API_KEY` pro Google Gemini.
2.  **Vstup**: 
    *   Klikněte na "Vyfotit" pro použití kamery.
    *   Klikněte na "Nahrát" pro výběr obrázku z disku.
3.  **Analýza**: Vyčkejte několik vteřin, než AI zpracuje obraz.
4.  **Kontrola a Úprava**:
    *   Zkontrolujte správnost údajů.
    *   Kliknutím na ikonku tužky u anotace můžete text upravit.
    *   Odkaz na zdroj se vygeneruje automaticky, můžete jej otevřít a ověřit.
5.  **Uložení**:
    *   Klikněte na tlačítko **"Uložit"**.
    *   Data se zkopírují do schránky.
    *   Otevře se formulář AppSheet. Zde můžete data vložit (pokud se nepředvyplnila automaticky přes URL parametry) a záznam dokončit.
6.  **Chat**: Pro další dotazy (např. na herce, jiné knihy autora) klikněte na "Chat o knize/filmu". Tlačítkem "Zpět" se vrátíte k detailům, aniž byste přišli o historii konverzace.

## 📁 Struktura souborů

*   `App.tsx`: Hlavní logika aplikace, řízení stavů a navigace. Zajišťuje, že komponenty zůstávají načtené při přepínání záložek.
*   `services/geminiService.ts`: Logika pro volání Gemini API. Obsahuje systémové instrukce a programatické generování URL pro zdroje (aby se předešlo halucinacím AI).
*   `components/ResultView.tsx`: Zobrazení výsledků. Obsahuje logiku pro generování dynamických odkazů do AppSheetu a práci se schránkou.
*   `components/ChatInterface.tsx`: Chatovací rozhraní.
*   `components/CameraCapture.tsx`: Obsluha kamery a nahrávání souborů.
*   `types.ts`: Definice datových typů.

## 📝 Poznámky

*   Aplikace automaticky odstraňuje Markdown formátování z odpovědí AI pro zajištění stability.
*   Při kopírování do schránky jsou odstraněny tabulátory a nové řádky, aby se data vložila správně do jednoho řádku tabulky.
