import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import { OpenAI, toFile } from "openai";
import { runWorkflow } from "./workflow.js"; // MUST use .js extension here
import { runWorkflowOrtho } from "./orthoAgent.js"; // MUST use .js extension here
import { summaryForLLM } from "./summaryForLLM.js"; // MUST use .js extension here
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "./public");

app.use(express.static(publicPath));

const upload = multer({
  storage: multer.memoryStorage(),
});

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
   res.send("backend working successfully")
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
      model: "gpt-4o-transcribe",
    });

    console.log("Transcription:", transcription.text);
    // 🌍 Step 2: Translate Tamil text → English
    const translation = await openai.chat.completions.create({
      model: "gpt-4o",
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

  } catch (error:any) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/triage", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    //console.log("Received message for triage:", message);
    const result = await runWorkflow({ input_as_text: message });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/ortho", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    console.log("Received message for ortho:", message);
    const result = await runWorkflowOrtho({ input_as_text: message });
    const his = `
    ${message}
    ORTHO AGENT OUTPUT:
    ${result.output_text}
    `
    const result1 = await summaryForLLM({ input_as_text: his });

    // console.log("Ortho Agent Result:", result);
    // console.log("Summary for LLM Result:", result1);

    res.json(result.output_parsed);

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));