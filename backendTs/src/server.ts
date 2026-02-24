import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import { OpenAI, toFile } from "openai";
import { runWorkflow } from "./workflow.js"; // MUST use .js extension here
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const distPath = path.join(__dirname, "../../dist");

// Serve static files
app.use(express.static(distPath));

// Default route
app.get("/", (req, res) => {
   res.sendFile(path.join(distPath, "index.html"));
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    // 🎙 Step 1: Transcribe audio (Tamil → Tamil text)
    // const transcription = await openai.audio.transcriptions.create({
    //   file: new File(
    //     [req.file.buffer],
    //     req.file.originalname,
    //     { type: req.file.mimetype }
    //   ),
    //   model: "gpt-4o-mini-transcribe",
    // });
    const transcription = await openai.audio.transcriptions.create({
  file: await toFile(
    req.file.buffer,
    req.file.originalname,
    { type: req.file.mimetype }
  ),
  model: "gpt-4o-mini-transcribe",
});

    // console.log("Transcription:", transcription.text);
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
// console.log("Translation:", englishText);
    res.json({
      success: true,
      original: transcription.text,
      text: englishText
    });

  } catch (error:any) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/triage", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const result = await runWorkflow({ input_as_text: message });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));