
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOptionCopy = async (optionLabel: string, type: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, professional help text and placeholder for a Shopify product option called "${optionLabel}" of type "${type}". Return it as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            helpText: { type: Type.STRING },
            placeholder: { type: Type.STRING }
          },
          required: ["helpText", "placeholder"],
          propertyOrdering: ["helpText", "placeholder"]
        }
      }
    });
    
    // Correctly extract text output using response.text
    return JSON.parse(response.text || '{"helpText": "", "placeholder": ""}');
  } catch (error) {
    console.error("AI Generation failed:", error);
    return { helpText: "", placeholder: "" };
  }
};
