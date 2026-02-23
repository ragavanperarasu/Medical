const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const { runWorkflow } = require("./workflow.js");

const OpenAI = require("openai");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use memory storage (NO temp files)
const upload = multer({
  storage: multer.memoryStorage(),
});

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default route
app.get("/", (req, res) => {
  res.send("Medical AI Backend Running 🚀");
});


app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    // 🎙 Step 1: Transcribe audio (Tamil → Tamil text)
    const transcription = await openai.audio.transcriptions.create({
      file: new File(
        [req.file.buffer],
        req.file.originalname,
        { type: req.file.mimetype }
      ),
      model: "gpt-4o-mini-transcribe",
    });

    console.log("Transcription:", transcription.text);
    // 🌍 Step 2: Translate Tamil text → English
    const translation = await openai.chat.completions.create({
      model: "gpt-4o-mini",
messages: [
  {
    role: "system",
    content: `
You are analyzing a medical conversation between exactly two people.

Step 1: Convert everything to English.
Step 2: Identify the two speakers.
Step 3: Label them as Patient and Doctor.

VERY IMPORTANT FORMATTING RULES:

- Each speaker MUST be on a separate line.
- After every sentence, insert a newline.
- Never put two speakers on the same line.
- Do NOT return a single paragraph.
- Do NOT explain anything.

Correct Example Output:

Patient: Hello Doctor.
Doctor: Hello, how can I help you?
Patient: I have a headache.

Return output exactly like the example format.
`
  },
  {
    role: "user",
    content: transcription.text
  }
],
      temperature: 0
    });

    const englishText = translation.choices[0].message.content;
console.log("Translation:", englishText);
    res.json({
      success: true,
      original: transcription.text,
      text: englishText
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/triage", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    console.log("Processing Triage for:", message);

    // Run the agent workflow
    const result = await runWorkflow({ input_as_text: message });

    res.json({
      success: true,
      data: result.output_parsed
    });
  } catch (error) {
    console.error("Agent Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});