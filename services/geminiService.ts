import { GoogleGenAI, Type } from "@google/genai";
import { Board, Grade, Subject, NoteResponse, QuizQuestion } from '../types';

// Helper to get AI instance safely
// This ensures process.env.API_KEY is accessed only when called, preventing top-level runtime errors
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';

export const generateStudyNotesStream = async function* (
  topic: string,
  board: Board,
  grade: Grade,
  subject: Subject
) {
  try {
    const ai = getAi();
    const prompt = `
      Create comprehensive study notes for "${topic}".
      Context: ${board} Curriculum, ${grade}, ${subject}.
      Format: Markdown. Include:
      1. Introduction
      2. Key Concepts (bullet points)
      3. Important Formulas/Definitions (bold)
      4. Real-world Examples
      5. Summary
      6. 3 Exam-style Questions
      Tone: Academic, clear, concise.
    `;

    const response = await ai.models.generateContentStream({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        systemInstruction: `You are an expert ${board} tutor for ${grade}.`,
        temperature: 0.3,
      }
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) yield text;
    }
  } catch (error) {
    console.error("Error generating notes stream:", error);
    throw error;
  }
};

export const generateStudyNotes = async (
  topic: string,
  board: Board,
  grade: Grade,
  subject: Subject
): Promise<string> => {
    let text = '';
    for await (const chunk of generateStudyNotesStream(topic, board, grade, subject)) {
        text += chunk;
    }
    return text;
};

export const generateQuiz = async (
  topic: string,
  board: Board,
  grade: Grade,
  subject: Subject
): Promise<QuizQuestion[]> => {
  try {
    const ai = getAi();
    // Optimized prompt for speed, requested 10 questions
    const prompt = `
      Create a 10-question MCQ quiz on "${topic}" for ${grade} ${subject} (${board} syllabus).
      For each question, provide a detailed explanation in the 'explanation' field.
      The explanation MUST:
      1. Explain clearly why the correct answer is right.
      2. Provide a detailed breakdown of why each incorrect option is wrong, identifying common student misconceptions where applicable.
      The goal is to help the student learn from their mistakes.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const solveDoubt = async (
  question: string,
  board: Board,
  grade: Grade,
  subject: Subject
): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `
      Answer briefly: "${question}"
      Context: ${grade}, ${subject}, ${board}.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    return response.text || "I couldn't solve that right now.";
  } catch (error) {
    console.error("Error solving doubt:", error);
    throw error;
  }
};

export const explainAiConcept = async (concept: string): Promise<string> => {
    try {
        const ai = getAi();
        const prompt = `
          Explain the concept of "${concept}" in Artificial Intelligence to a high school student. 
          Structure:
          1. Simple Definition
          2. Real-life Analogy
          3. Key Use Case
          Keep it engaging, inspiring, and under 200 words.
        `;
        const response = await ai.models.generateContent({
            model: MODEL_FAST,
            contents: prompt,
        });
        return response.text || "Could not explain this concept right now.";
    } catch (error) {
        console.error("Error explaining AI concept:", error);
        return "Unable to fetch explanation at the moment. Please check your connection.";
    }
}