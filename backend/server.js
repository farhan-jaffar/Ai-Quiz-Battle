require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');
const connectDB = require('./db');
const Score = require('./models/Score');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ai = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Define Zod schema to validate Gemini's output
const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
  hint: z.string(),
  difficulty: z.string() // Track difficulty in the buffer
});

// Since we are expecting a batch, we validate an array of length 9
const BatchResponseSchema = z.array(QuestionSchema).length(9);

// Helper function to call Gemini and parse JSON
async function generateBatchQuestions(topic) {
  const prompt = `
    You are an expert quiz master creating an adaptive test. 
    Topics/Domain: "${topic}".
    
    You must generate EXACTLY 9 highly engaging, unique multiple-choice questions matching this domain.
    The difficulty must be stratified exactly like this:
    - 3 questions where "difficulty": "Easy"
    - 3 questions where "difficulty": "Medium"
    - 3 questions where "difficulty": "Hard"

    Ensure they are diverse and do not repeat identical concepts.

    You MUST respond with a valid JSON array only. No markdown formatting, no code blocks, no text before or after the JSON.
    The JSON structure MUST be exactly:
    [
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The exact string from options that is correct",
        "hint": "A small hint to help the user if they use a power-up",
        "difficulty": "Easy" 
      },
      ...
    ]
  `;

  let maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await ai.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      });
      
      let responseText = result.response.text();
      
      if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7);
      }
      if (responseText.startsWith('```')) {
        responseText = responseText.substring(3);
      }
      if (responseText.endsWith('```')) {
        responseText = responseText.substring(0, responseText.length - 3);
      }
      
      const parsed = JSON.parse(responseText.trim());
      
      // Validate schema
      const validated = BatchResponseSchema.parse(parsed);
      
      // Guarantee validity
      for (const q of validated) {
         if (!q.options.includes(q.correctAnswer)) throw new Error("Incorrect validation rule trigger");
      }

      return validated;

    } catch (error) {
      console.error(`Attempt ${i+1} failed:`, error.message);
      
      // Check if it's explicitly a Google 429 Rate Limit error. If so, abort to stop spamming the API.
      if (error.message && error.message.includes("429")) {
         throw new Error("429 Rate Limit Exceeded. Please wait 60 seconds.");
      }

      // If it's a JSON parse error (timeout or formatting), wait 3 seconds before retrying so we don't rapid-fire limits
      if (i === maxRetries - 1) {
         throw new Error("Failed to generate valid batch question array after multiple attempts");
      } else {
         await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
}

// Routes
// 1. Generate Batch
app.post('/api/generate-batch', async (req, res) => {
  const { topic } = req.body;
  
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const questions = await generateBatchQuestions(topic);
    return res.json({ buffer: questions });
  } catch (error) {
    console.error("Error generating question batch:", error);
    if (error.message.includes('429')) {
       return res.status(429).json({ error: "Rate Limit Exceeded. Wait 1 minute." });
    }
    return res.status(500).json({ error: "Failed to generate question batch" });
  }
});

// 2. Submit Score
app.post('/api/submit-score', async (req, res) => {
  const { username, score, date } = req.body;
  if (!username || typeof score !== 'number') {
      return res.status(400).json({ error: "Invalid score data" });
  }

  try {
    await Score.create({ username, score, date: date || new Date() });
    const leaderboard = await Score.find().sort({ score: -1 }).limit(50).lean();
    return res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Error saving score:', error);
    return res.status(500).json({ error: 'Failed to save score' });
  }
});

// 3. Get Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.find().sort({ score: -1 }).limit(50).lean();
    return res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`AI Quiz Backend running on http://localhost:${PORT}`);
  });
});
