
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const optimizeBio = async (rawBio: string, services: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Poboljšaj ovaj opis profila za osobu koja pruža usluge čišćenja. Učini ga profesionalnim, povjerljivim i privlačnim klijentima. Opis mora biti na hrvatskom jeziku.
      
      Originalni opis: ${rawBio}
      Usluge koje pruža: ${services.join(', ')}`,
      config: {
        systemInstruction: "Ti si stručnjak za marketing i pisanje oglasa na hrvatskom jeziku. Tvoj zadatak je pretvoriti kratki opis u profesionalnu biografiju za marketplace usluga čišćenja.",
        temperature: 0.7,
      }
    });
    return response.text || rawBio;
  } catch (error) {
    console.error("Gemini Error:", error);
    return rawBio;
  }
};

export const suggestServices = async (experience: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Na temelju ovog iskustva, predloži koje bi usluge čišćenja osoba mogla pružati (npr. dubinsko, standardno, prozori, nakon radova). Odgovori u formatu JSON liste stringova.
      
      Iskustvo: ${experience}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return [];
  }
};
