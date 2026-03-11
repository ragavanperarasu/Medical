import { z } from "zod";
import { Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";
import { OpenAI } from "openai";
import { setDefaultOpenAIClient } from "@openai/agents";
import "dotenv/config";

const myClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

setDefaultOpenAIClient(myClient);

const SplitterSchema = z.object({ items: z.array(z.object({ sender: z.enum(["Patient", "Nurse"]), message: z.string(), emotion: z.enum(["neutral", "pain", "concerned", "anxious", "relieved", "sad", "confused", "frustrated"]) })) });
const splitter = new Agent({
  name: "Splitter",
  instructions: `You are a medical conversation formatter.

The input may be a continuous paragraph or poorly structured conversation.

Your task is to convert it into a structured JSON conversation and detect the speaker's emotion.

Instructions:

1. Convert the conversation into clear English if needed.
2. Identify the two speakers.
3. Label them only as:
   - \"Patient\"
   - \"Nurse\"
4. Split the conversation into individual sentences.
5. Each sentence must become one message object.
6. Detect the emotional tone of the speaker for each message.

Allowed emotion values:
- neutral
- pain
- concerned
- anxious
- relieved
- sad
- confused
- frustrated

Output Rules:

- Return a JSON array.
- Each item must contain:
  - \"sender\"
  - \"message\"
  - \"emotion\"
- \"sender\" must be either \"Patient\" or \"Nurse\".
- Each message must contain only one sentence.
- Do not combine multiple sentences in one message.
- Do not repeat sentences.
- Do not include explanations.
- Do not include extra text outside JSON.

Example Output:

[
  {
    \"sender\": \"Nurse\",
    \"message\": \"Good morning! How are you feeling after your medication?\",
    \"emotion\": \"neutral\"
  },
  {
    \"sender\": \"Patient\",
    \"message\": \"I feel a bit better.\",
    \"emotion\": \"relieved\"
  },
  {
    \"sender\": \"Patient\",
    \"message\": \"But I still have a slight headache.\",
    \"emotion\": \"pain\"
  },
  {
    \"sender\": \"Nurse\",
    \"message\": \"Have you been drinking enough water today?\",
    \"emotion\": \"neutral\"
  }
]`,
  model: "gpt-4o",
  outputType: SplitterSchema,
  modelSettings: {
    temperature: 0,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

type WorkflowInput = { input_as_text: string };


// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("spilitter", async () => {
    const state = {

    };
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_69b0574a07988190bb9eacf6506a7dc40e70d8efe2d2fe84"
      }
    });
    const splitterResultTemp = await runner.run(
      splitter,
      [
        ...conversationHistory
      ]
    );
    conversationHistory.push(...splitterResultTemp.newItems.map((item) => item.rawItem));

    if (!splitterResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const splitterResult = {
      output_text: JSON.stringify(splitterResultTemp.finalOutput),
      output_parsed: splitterResultTemp.finalOutput
    };
    return splitterResult;
  });
}
