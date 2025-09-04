
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const exceptionAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: "A category for the issue. Must be one of: 'Damage', 'Delay', 'Customs Issue', 'Lost Shipment', 'Address Problem', 'Other'.",
    },
    suggestedActions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "An array of short, actionable steps for an operations team to resolve the issue.",
    },
  },
  required: ["category", "suggestedActions"],
};


export const analyzeException = async (description: string): Promise<AIAnalysis | null> => {
  try {
    const prompt = `You are a logistics and supply chain expert. Analyze the following shipment issue description and provide a structured JSON response according to the defined schema.
    
    Description: "${description}"`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: exceptionAnalysisSchema,
        },
    });

    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);

    if (parsedJson && parsedJson.category && Array.isArray(parsedJson.suggestedActions)) {
        return parsedJson as AIAnalysis;
    }
    
    console.error("Parsed JSON does not match AIAnalysis schema:", parsedJson);
    return null;

  } catch (error) {
    console.error("Error analyzing exception with Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please try again.");
  }
};
