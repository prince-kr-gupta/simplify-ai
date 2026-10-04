import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL_ID = process.env.MODEL_ID || "Qwen/Qwen2.5-7B-Instruct";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    app: "Simplify AI",
    model: MODEL_ID
  });
});

app.post("/api/explain", async (req, res) => {
  try {
    const { topic, mode = "Beginner", language = "Hinglish", task = "Explain" } = req.body;

    if (!topic || topic.trim().length < 2) {
      return res.status(400).json({ error: "Please enter a topic or notes." });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        error: "HF_TOKEN is missing. Add it to backend/.env."
      });
    }

    const client = new InferenceClient(process.env.HF_TOKEN);

    const systemPrompt = `
You are Simplify AI, a friendly study companion built for a college student.
Your job is to make difficult topics easy, accurate, practical, and exam-useful.

User preferences:
- Difficulty level: ${mode}
- Language: ${language}
- Task: ${task}

Rules:
- If language is Hinglish, use natural Hindi written in Roman script mixed with simple English.
- Avoid unnecessary jargon.
- Use short headings and bullets.
- Give at least one simple example.
- Never pretend to know information that is not provided.
- For "Quiz", give 5 questions and put answers in a separate answer-key section.
- For "Viva", give 7 short viva questions with crisp answers.
- For "Short Notes", make compact revision notes.
- For "Explain", end with 3 quick-check questions.
- If mode is "Exam Tomorrow", prioritize must-know concepts, common mistakes, and rapid revision.
`;

    const completion = await client.chatCompletion({
      model: MODEL_ID,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: topic.trim() }
      ],
      max_tokens: 900,
      temperature: 0.55
    });

    const answer = completion?.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("The model returned an empty response.");
    }

    res.json({
      answer,
      model: MODEL_ID
    });
} catch (error) {
  console.error(error);

  console.log(
    "HF ERROR:",
    JSON.stringify(error?.httpResponse?.body, null, 2)
  );

  res.status(500).json({
    error:
      error?.message ||
      "AI request failed."
  });
}
});

app.listen(PORT, () => {
  console.log(`Simplify backend running on http://localhost:${PORT}`);
});
