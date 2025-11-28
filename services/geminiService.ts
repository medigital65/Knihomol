
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MediaData } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the schema for structured output
// Removed sourceUrl from schema to prevent hallucinated IDs. We will generate search URLs programmatically.
const mediaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    type: { 
      type: Type.STRING, 
      enum: ["Kniha", "Film"],
      description: "Classify if the image is a Book (Kniha) or a Movie (Film)." 
    },
    title: { type: Type.STRING, description: "The full title of the work." },
    author: { type: Type.STRING, description: "The name of the author (if book) or director (if movie)." },
    publicationYear: { type: Type.STRING, description: "The year of first publication or release." },
    annotation: { type: Type.STRING, description: "A summary/annotation of the work in exactly 5 sentences. Must be in Czech language." }
  },
  required: ["type", "title", "author", "publicationYear", "annotation"],
};

export const analyzeMediaCover = async (base64Image: string): Promise<MediaData> => {
  const ai = getClient();
  
  // Clean base64 string if it contains metadata header
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Analyzuj tento obrázek (obal knihy nebo plakát filmu). Rozpoznej, zda jde o knihu nebo film. Extrahuj název, autora (u knihy) nebo režiséra (u filmu) a rok vydání. Napiš krátkou anotaci (přesně 5 vět) v českém jazyce.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: mediaSchema,
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    // Clean potential markdown code blocks (```json ... ```) which can break JSON.parse
    const cleanText = text.replace(/```json\n?|```/g, '').trim();

    const parsedData = JSON.parse(cleanText);

    // Programmatically generate search URLs instead of relying on AI hallucination
    let sourceUrl = "";
    if (parsedData.type === 'Film') {
      // Search CSFD by title
      sourceUrl = `https://www.csfd.cz/hledat/?q=${encodeURIComponent(parsedData.title)}`;
    } else {
      // Search Databazeknih by Title + Author for better accuracy
      // Updated URL format as requested
      sourceUrl = `https://www.databazeknih.cz/vyhledavani/knihy?q=${encodeURIComponent(parsedData.title + " " + parsedData.author)}`;
    }

    return { ...parsedData, sourceUrl } as MediaData;

  } catch (error) {
    console.error("Error analyzing media:", error);
    throw error;
  }
};

export const createChatSession = (mediaContext: MediaData) => {
  const ai = getClient();
  const creatorLabel = mediaContext.type === 'Film' ? 'Režisér' : 'Autor';
  
  const systemInstruction = `Jsi inteligentní asistent pro kulturu. Uživatel se ptá na dílo (${mediaContext.type}): "${mediaContext.title}".
  
  Kontext:
  ${creatorLabel}: ${mediaContext.author}
  Rok vydání: ${mediaContext.publicationYear}
  Zdroj: ${mediaContext.sourceUrl}
  Anotace: ${mediaContext.annotation}

  Odpovídej stručně, věcně a vždy v českém jazyce. Umožni uživateli zeptat se i na něco v souvislosti s dílem např. detaily ohledně autora/režiséra, postav, herců, dalších děl autora. Věci úplně mimo kontext díla zdvořile odmítni.`;

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
    },
  });
};
