import { Agent, AgentInputItem, Runner, withTrace, webSearchTool } from "@openai/agents";
import { OpenAI } from "openai";
import { setDefaultOpenAIClient } from "@openai/agents";
import { z } from "zod";
import "dotenv/config";

const myClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

setDefaultOpenAIClient(myClient);

// Tool definitions
const webSearchPreview = webSearchTool({
  filters: {
    allowed_domains: [
      "www.hopkinsmedicine.org"
    ]
  },
  searchContextSize: "medium",
  userLocation: {
    country: "IN",
    type: "approximate"
  }
})
const OrthoAgentSchema = z.object({ suspected_cause: z.array(z.object({ cause: z.string(), probability: z.number() })), questions_to_ask: z.array(z.object({ question: z.string(), reason: z.string() })), conversation_complete: z.string() });
const orthoAgent = new Agent({
  name: "Ortho Agent",
  instructions: `You are an experienced orthopaedic doctor. Your task is to guide, evaluate, and optimize the collection of patient health data. The goal is to diagnose the patient accurately with a minimal set of high-value questions.

Instructions for the AI:

Evaluate Questions Asked:

Review all questions already asked by the questioner to the patient.
Identify whether the trajectory of questioning is correct toward a diagnosis.
For each question, assess if it contributes meaningfully to diagnosing the patient.

Identify Missing Critical Questions:

Based on the patient’s responses and clinical context, determine which essential questions were missed.
Only ask questions that are required for diagnosis. Ignore irrelevant or low-yield questions.

Enhance Existing Questions:

If the questioner is on the right path, suggest enhancements to improve clarity, specificity, or diagnostic value.

Suspected Causes & Stop Criteria:

Maintain a list of 3–5 suspected causes for the chief complaint, each with an associated probability (0–100%).
Stop generating further questions only if the top 2 suspected causes are strongly supported by the patient’s answers.
Ask new questions only if the top 2 suspected causes are uncertain or not fitting the patient’s responses.

Rank and Present Questions:

Present a ranked list of 3–5 high-priority questions needed to complete a proper health data collection.
Rank by clinical importance and likelihood to affect diagnosis.
Only include questions that are truly necessary for making a diagnosis.

Focus Areas to Cover:

Mechanism of injury (if trauma-related)
Pain characteristics (severity, type, timing, aggravating/relieving factors)
Functional impact and activity limitations
Past orthopaedic history, comorbidities, or risk factors

Output Format (JSON only):
{
  \"suspected_cause\": [
    {
      \"cause\": \"<suspected cause of the chief complaint>\",
      \"probability\": \"<estimated probability 0-100>\"
    }
  ],
  \"questions_to_ask\": [
    {
      \"question\": \"<concise question for questioner to ask>\",
      \"reason\": \"<why this question is clinically important>\"
    }
  ],
  \"conversation_complete\": <true/false>
}


suspected_cause: Array of maximum 3–5 causes with probabilities.
questions_to_ask: Only include questions essential for diagnosis.
conversation_complete: true if the top 2 suspected causes are sufficiently supported; otherwise false.



Objective:
After processing, provide a concise, high-value health data collection ready for diagnosis, ensuring:

Critical information is not missed.
Questioning is minimized.
Stop asking questions once the top 2 suspected causes are supported by patient data.


`,
  model: "gpt-5.4",
  tools: [
    webSearchPreview
  ],
  outputType: OrthoAgentSchema,
  modelSettings: {
    reasoning: {
      effort: "medium"
    },
    store: true
  }
});

type WorkflowInput = { input_as_text: string };


// Main code entrypoint
export const runWorkflowOrtho = async (workflow: WorkflowInput) => {
  return await withTrace("Ortho agent", async () => {
    const state = {

    };
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_69a86e1adbe88190abc8e9ce80e95b6a0626dab354f95c04"
      }
    });
    const orthoAgentResultTemp = await runner.run(
      orthoAgent,
      [
        ...conversationHistory
      ]
    );
    conversationHistory.push(...orthoAgentResultTemp.newItems.map((item) => item.rawItem));

    if (!orthoAgentResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const orthoAgentResult = {
      output_text: JSON.stringify(orthoAgentResultTemp.finalOutput),
      output_parsed: orthoAgentResultTemp.finalOutput
    };
    return orthoAgentResult;
  });
}

