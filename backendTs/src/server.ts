import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import { runWorkflow } from "./workflow.js"; // MUST use .js extension here

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

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