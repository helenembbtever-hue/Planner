
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API client directly with process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJournalPrompt = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 1 unique, thought-provoking daily journal prompt for self-reflection. Keep it to one sentence.",
    });
    return response.text || "What's one thing you're grateful for today?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "What's one thing you're grateful for today?";
  }
};

export const suggestGoalBreakdown = async (goal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down this goal into 3-5 actionable steps: "${goal}". Provide as a clean list.`,
    });
    return response.text || "Unable to break down goal at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error getting goal suggestions.";
  }
};

export const generateAffirmation = async (visionBoardSummary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on a vision board focused on: "${visionBoardSummary}", generate a powerful daily affirmation.`,
    });
    return response.text || "I am capable of achieving all my dreams.";
  } catch (error) {
    return "I am capable of achieving all my dreams.";
  }
};
