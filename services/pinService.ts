
export const PIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7M4bPxLokcmCneYwkskLfcAOhk5j2oXuObucilC5S_A8_4btaD48IYfmCUgJ_TV1lO4ZecMahbGay/pub?gid=1455483239&single=true&output=csv';

export const fetchAllowedPins = async (): Promise<string[]> => {
  try {
    const response = await fetch(PIN_SHEET_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    
    // Parse CSV:
    // 1. Split by newline
    // 2. Trim whitespace and remove quotes (CSV often quotes values)
    // 3. Filter to keep only strings that are exactly 4 digits
    const pins = text.split('\n')
      .map(line => line.trim().replace(/^"|"$/g, ''))
      .filter(pin => /^\d{4}$/.test(pin));

    // Remove duplicates using Set
    return Array.from(new Set(pins));
  } catch (error) {
    console.error("Failed to fetch allowed PINs:", error);
    // Return empty array on failure, which implies no PINs will be valid except default behavior
    return [];
  }
};
