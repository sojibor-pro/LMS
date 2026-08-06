import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization for Gemini AI client on server side
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: AI Question Set Generator
app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const { topic, questionType, count, difficulty, medicalFocus } = req.body;
    const ai = getAIClient();

    const prompt = `You are a medical & academic exam expert for Genesis / FPS LMS platforms.
Generate ${count || 5} high-quality exam questions for the topic: "${topic || 'General Medicine'}".
Question Type: ${questionType || 'sba'} (Options: "sba" for Single Best Answer 4 options, "true_false" for 5-stem True/False medical style, or "mcq" for 4 options).
Difficulty: ${difficulty || 'medium'}.
Medical Focus: ${medicalFocus ? 'Yes - Medical FCPS/Residency standard' : 'Standard academic'}.

Return a JSON array where each question object has:
- id: string
- text: string (the question stem)
- type: "${questionType || 'sba'}"
- options: array of strings (for sba/mcq: 4 choices; for true_false: 5 sub-statements)
- correctAnswer: number (0-indexed for sba/mcq) OR array of booleans (length 5 for true_false stems where true/false for each option)
- explanation: detailed clinical/academic explanation referencing textbooks or key concepts
- topic: string
- difficulty: string ("Easy", "Medium", "Hard")`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              type: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: {
                type: Type.STRING,
                description: 'JSON string of correct index or boolean array for true_false stems',
              },
              explanation: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
            required: ['id', 'text', 'options', 'explanation', 'topic'],
          },
        },
      },
    });

    const jsonText = response.text || '[]';
    const parsed = JSON.parse(jsonText);

    // Process correctness format if needed
    const questions = parsed.map((q: any, idx: number) => {
      let parsedAnswer = q.correctAnswer;
      try {
        if (typeof q.correctAnswer === 'string') {
          parsedAnswer = JSON.parse(q.correctAnswer);
        }
      } catch {
        parsedAnswer = q.type === 'true_false' ? [true, false, true, false, true] : 0;
      }
      return {
        id: q.id || `gen_q_${Date.now()}_${idx}`,
        text: q.text,
        type: q.type || questionType || 'sba',
        options: q.options || [],
        correctAnswer: parsedAnswer ?? (q.type === 'true_false' ? [true, false, true, false, true] : 0),
        explanation: q.explanation || 'Detailed explanation provided.',
        topic: q.topic || topic,
        difficulty: q.difficulty || difficulty || 'Medium',
      };
    });

    res.json({ success: true, questions });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate questions using AI.',
    });
  }
});

// API: AI Study Tutor & Question Explanation Assistant
app.post('/api/ai/tutor-explain', async (req, res) => {
  try {
    const { question, options, userAnswer, correctAnswer, userQuery, topic } = req.body;
    const ai = getAIClient();

    const prompt = `You are an expert AI Professor & Study Mentor in an LMS (like Genesis FPS / Medical & Higher Studies Prep).
Topic: ${topic || 'General Concept'}
Question: "${question || 'General Inquiry'}"
${options ? `Options: ${JSON.stringify(options)}` : ''}
${userAnswer !== undefined ? `Student's Selection: ${JSON.stringify(userAnswer)}` : ''}
${correctAnswer !== undefined ? `Correct Answer Key: ${JSON.stringify(correctAnswer)}` : ''}

Student's Request/Query: "${userQuery || 'Explain this concept thoroughly, why the correct answer is right and why other options are incorrect, with key high-yield points for exam preparation.'}"

Provide a structured, encouraging, high-yield explanation in clear markdown. Include:
1. High-Yield Summary / Core Principle
2. Step-by-Step Breakdown
3. Common Exam Traps & Pitfalls to Avoid
4. Quick Memory Mnemonic or Key Takeaway`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ success: true, explanation: response.text });
  } catch (error: any) {
    console.error('Error in tutor explanation:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate explanation.',
    });
  }
});

// API: AI Course Outline & Material Generator
app.post('/api/ai/generate-course', async (req, res) => {
  try {
    const { title, targetAudience, category } = req.body;
    const ai = getAIClient();

    const prompt = `Generate a comprehensive curriculum structure for a professional course titled "${title}".
Category: ${category || 'Medical/Professional Exam Prep'}
Target Audience: ${targetAudience || 'Students & Doctors preparing for competitive exams'}

Return JSON format with:
- description: detailed course overview
- modules: array of 3-4 modules, each with:
  - id: string
  - title: string
  - duration: string (e.g. "2 hrs 30 mins")
  - lessons: array of 2-3 lessons with:
    - id: string
    - title: string
    - duration: string
    - videoUrl: sample youtube or video placeholder
    - summary: comprehensive lecture bullet points (markdown string)
    - sheetPdfUrl: placeholder PDF link`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, courseData: parsed });
  } catch (error: any) {
    console.error('Error generating course:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate course content.',
    });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LMS Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
