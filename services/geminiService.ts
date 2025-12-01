
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MediaData } from "../types";

export const DEFAULT_ANALYSIS_PROMPT = "Analyzuj tento obrázek (obal knihy nebo plakát filmu). Rozpoznej, zda jde o knihu nebo film. Extrahuj název, autora (u knihy) nebo režiséra (u filmu) a rok vydání. Napiš krátkou anotaci (přesně 5 vět) v českém jazyce.";

export const DEFAULT_CHAT_SYSTEM_INSTRUCTION = "Odpovídej stručně, věcně a vždy v českém jazyce. Umožni uživateli zeptat se i na něco v souvislosti s dílem např. detaily ohledně autora/režiséra, postav, herců, dalších děl autora. Věci úplně mimo kontext díla zdvořile odmítni.";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the schema for structured output
// Note: We keep descriptions generic here so they don't override the user's custom prompt instructions (e.g. length of annotation).
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
    annotation: { type: Type.STRING, description: "A summary/annotation of the work in Czech language. Follow the prompt instructions regarding length and style." }
  },
  required: ["type", "title", "author", "publicationYear", "annotation"],
};

export const analyzeMediaCover = async (base64Image: string, customPrompt?: string): Promise<MediaData> => {
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
            text: customPrompt || DEFAULT_ANALYSIS_PROMPT,
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
      sourceUrl = `https://www.databazeknih.cz/vyhledavani/knihy?q=${encodeURIComponent(parsedData.title + " " + parsedData.author)}`;
    }

    return { ...parsedData, sourceUrl } as MediaData;

  } catch (error) {
    console.error("Error analyzing media:", error);
    throw error;
  }
};

export const createChatSession = (mediaContext: MediaData, customInstruction?: string) => {
  const ai = getClient();
  const creatorLabel = mediaContext.type === 'Film' ? 'Režisér' : 'Autor';
  const baseInstruction = customInstruction || DEFAULT_CHAT_SYSTEM_INSTRUCTION;
  
  const systemInstruction = `Jsi inteligentní asistent pro kulturu. Uživatel se ptá na dílo (${mediaContext.type}): "${mediaContext.title}".
  
  Kontext:
  ${creatorLabel}: ${mediaContext.author}
  Rok vydání: ${mediaContext.publicationYear}
  Zdroj: ${mediaContext.sourceUrl}
  Anotace: ${mediaContext.annotation}

  ${baseInstruction}`;

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
    },
  });
};
