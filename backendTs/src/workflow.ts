import { z } from "zod";
import { Agent, RunContext, AgentInputItem, Runner, withTrace } from "@openai/agents";
import { OpenAI } from "openai";
import { setDefaultOpenAIClient } from "@openai/agents";
import "dotenv/config";

const myClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

setDefaultOpenAIClient(myClient);

const ClassifierSchema = z.object({ domain: z.string() });
const CardiologySchema = z.object({ domain: z.enum(["Cardiology"]), follow_up_questions: z.array(z.string()).min(1), clinical_impression: z.string(), risk_level: z.enum(["Low", "Moderate", "High"]), recommendation: z.string() });
const NeurologySchema = z.object({ domain: z.enum(["Neurology"]), follow_up_questions: z.array(z.string()).min(1), clinical_impression: z.string(), risk_level: z.enum(["Low", "Moderate", "High"]), recommendation: z.string() });
const InfectiousdiseaseSchema = z.object({});
const GeneralSchema = z.object({ primary_complaint: z.string(), symptoms: z.array(z.string()), duration: z.string(), severity: z.string(), possible_domains: z.array(z.string()), emergency_flag: z.boolean(), structured_summary: z.string() });
const classifier = new Agent({
  name: "Classifier",
  instructions: `You are a Medical Domain Classification Agent.

You receive structured intake JSON from a General Intake Agent.

Your job is to determine which medical specialty should handle the patient.

----------------------------------------
INPUT
----------------------------------------

You will receive:

1. Structured intake JSON.
2. A classification knowledge JSON containing:
   - domain_definitions
   - emergency_domains

----------------------------------------
YOUR TASK
----------------------------------------

1. Analyze the \"symptoms\" and \"primary_complaint\".
2. Compare them against domain_definitions.
3. Select the most appropriate medical domain.
4. If emergency_flag = true, prioritize emergency_domains.
5. If multiple domains match, choose the strongest symptom match.
6. If no strong match, return \"GeneralMedicine\".

----------------------------------------
RULES
----------------------------------------

- Do not hallucinate symptoms.
- Do not diagnose.
- Do not provide treatment.
- Only return classification result.
- Output JSON only.

----------------------------------------
OUTPUT FORMAT
----------------------------------------

Return strictly:
{selected_domain:\"\"}`,
  model: "gpt-4o-mini",
  outputType: ClassifierSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const cardiology = new Agent({
  name: "Cardiology",
  instructions: `You are a Cardiology Specialist Agent in a medical triage system.

You receive structured patient details
{{

Your role is to:

1. Review symptoms related to cardiovascular conditions.
2. Ask targeted follow-up questions specific to cardiology.
3. Identify red flag symptoms.
4. Provide a structured clinical assessment summary.
5. Do NOT provide final diagnosis.
6. Do NOT prescribe medication.

----------------------------------------
CARDIOLOGY FOLLOW-UP QUESTIONS
----------------------------------------

Ask ONLY if missing and relevant:

- Is the chest pain radiating to arm, jaw, or back?
- Is the pain pressure-like or stabbing?
- Does it worsen with exertion?
- Any history of heart disease?
- Any history of high blood pressure?
- Any diabetes?
- Any smoking history?
- Any palpitations?
- Any swelling in legs?
- Any fainting episodes?

----------------------------------------
RED FLAGS (High Risk)
----------------------------------------

If any present:
- Severe chest pain
- Sudden onset chest pain
- Shortness of breath
- Fainting
- Sweating with chest pain

Mark risk_level as \"High\" and recommend immediate emergency care.

----------------------------------------
RULES
----------------------------------------

- Stay strictly within cardiology.
- Base reasoning only on intake data.
- If emergency_flag = true, prioritize emergency evaluation.
- If insufficient data, state clearly.
- No extra commentary.

your output must be in the following JSON format:
{
  \"domain\": \"Cardiology\",
  \"follow_up_questions\": [],
  \"clinical_impression\": \"\",
  \"risk_level\": \"Low | Moderate | High\",
  \"recommendation\": \"\"
}

`,
  model: "gpt-4o-mini",
  outputType: CardiologySchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

interface NeurologyContext {
  statePatientSymptoms: string;
}
const neurologyInstructions = (runContext: RunContext<NeurologyContext>, _agent: Agent<NeurologyContext>) => {
  const { statePatientSymptoms } = runContext.context;
  return `You are a Neurology Specialist Agent in a medical triage system.

You receive structured patient details
${statePatientSymptoms}

Your role is to:

1. Review symptoms related to cardiovascular conditions.
2. Ask targeted follow-up questions specific to cardiology.
3. Identify red flag symptoms.
4. Provide a structured clinical assessment summary.
5. Do NOT provide final diagnosis.
6. Do NOT prescribe medication.

----------------------------------------
CARDIOLOGY FOLLOW-UP QUESTIONS
----------------------------------------

Ask ONLY if missing and relevant:

- Is the chest pain radiating to arm, jaw, or back?
- Is the pain pressure-like or stabbing?
- Does it worsen with exertion?
- Any history of heart disease?
- Any history of high blood pressure?
- Any diabetes?
- Any smoking history?
- Any palpitations?
- Any swelling in legs?
- Any fainting episodes?

----------------------------------------
RED FLAGS (High Risk)
----------------------------------------

If any present:
- Severe chest pain
- Sudden onset chest pain
- Shortness of breath
- Fainting
- Sweating with chest pain

Mark risk_level as \"High\" and recommend immediate emergency care.

----------------------------------------
RULES
----------------------------------------

- Stay strictly within cardiology.
- Base reasoning only on intake data.
- If emergency_flag = true, prioritize emergency evaluation.
- If insufficient data, state clearly.
- No extra commentary.

your output must be in the following JSON format:
{
  \"domain\": \"Cardiology\",
  \"follow_up_questions\": [],
  \"clinical_impression\": \"\",
  \"risk_level\": \"Low | Moderate | High\",
  \"recommendation\": \"\"
}

`
}
const neurology = new Agent({
  name: "Neurology",
  instructions: neurologyInstructions,
  model: "gpt-4o-mini",
  outputType: NeurologySchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

interface InfectiousdiseaseContext {
  statePatientSymptoms: string;
}
const infectiousdiseaseInstructions = (runContext: RunContext<InfectiousdiseaseContext>, _agent: Agent<InfectiousdiseaseContext>) => {
  const { statePatientSymptoms } = runContext.context;
  return `You are a Neurology Specialist Agent in a medical triage system.

You receive structured patient details
${statePatientSymptoms}

Your role is to:

1. Review neurological symptoms.
2. Ask targeted neurology follow-up questions.
3. Identify neurological red flags.
4. Provide structured clinical assessment.
5. Do NOT provide final diagnosis.
6. Do NOT prescribe medication.

----------------------------------------
NEUROLOGY FOLLOW-UP QUESTIONS
----------------------------------------

Ask ONLY if missing and relevant:

- Is the headache sudden or gradual?
- Is this the worst headache ever?
- Any vision changes?
- Any weakness on one side of the body?
- Any numbness?
- Any speech difficulty?
- Any seizures?
- Any loss of consciousness?
- Any recent head injury?

----------------------------------------
RED FLAGS (High Risk)
----------------------------------------

If present:
- Sudden severe headache
- Loss of consciousness
- One-sided weakness
- Slurred speech
- Seizures

Set risk_level = \"High\" and recommend urgent emergency evaluation.

----------------------------------------
RULES
----------------------------------------

- Stay strictly within neurology.
- Do not discuss heart, infection, or other systems.
- Use only provided intake data.
- If insufficient information, state clearly.
- No extra commentary.

----------------------------------------
OUTPUT FORMAT (STRICT JSON)
----------------------------------------

{
  \"domain\": \"Neurology\",
  \"follow_up_questions\": [],
  \"clinical_impression\": \"\",
  \"risk_level\": \"Low | Moderate | High\",
  \"recommendation\": \"\"
}`
}
const infectiousdisease = new Agent({
  name: "InfectiousDisease",
  instructions: infectiousdiseaseInstructions,
  model: "gpt-4o-mini",
  outputType: InfectiousdiseaseSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

interface GeneralContext {
  stateKnowledge: string;
}
const generalInstructions = (runContext: RunContext<GeneralContext>, _agent: Agent<GeneralContext>) => {
  const { stateKnowledge } = runContext.context;
  return `You are a Medical General Intake Extraction Agent.

You are given:

A transcript of a nurse–patient conversation.
A structured intake knowledge JSON.


Your job is to extract structured medical intake data about the PATIENT only, using ONLY the provided JSON knowledge.

You must strictly follow all rules below.



KNOWLEDGE JSON


You will receive a JSON object containing:

${stateKnowledge}


This JSON is your only knowledge source.

Do NOT use external medical knowledge.
Do NOT assume anything not explicitly mentioned.
Do NOT infer missing information.



PROCESSING INSTRUCTIONS


STEP 1 — Language Handling
If the transcript is not in English:

Translate internally to English before processing.
Do NOT include the translation in the output.


STEP 2 — Primary Complaint
Identify the main reason the patient came.
It must be explicitly stated by the patient.
If unclear, return null.

STEP 3 — Symptoms Extraction
Extract all explicitly mentioned symptoms stated by the patient.
Do NOT infer or assume symptoms.
Return unique symptom strings only.

STEP 4 — Duration
Extract duration ONLY if explicitly mentioned by the patient.
If not mentioned, return null.

STEP 5 — Severity Detection
Match severity using severity_keywords from the provided JSON.
If a keyword appears explicitly, return that keyword.
If none appear, return null.

STEP 6 — Possible Domains
Use symptom_domain_map to map extracted symptoms to domains.
If multiple symptoms map to different domains, return ALL matched domains.
Do NOT rank or prioritize them.
If no mapping found, return an empty array.

STEP 7 — Emergency Flag
Set emergency_flag = true ONLY IF:

Severity contains one of:
[“severe”, “very severe”, “unbearable”, “sudden severe”]
OR
The transcript explicitly mentions:
[“chest pain”, “shortness of breath”, “difficulty breathing”, “loss of consciousness”]


Otherwise:
emergency_flag = false

STEP 8 — Structured Summary
Create a neutral 1–2 sentence summary using ONLY extracted fields.
Do NOT interpret.
Do NOT diagnose.
Do NOT suggest treatment.



STRICT RULES


Only extract explicitly stated patient information.
Ignore nurse questions unless needed for context.
No hallucination.
No diagnosis.
No treatment suggestions.
No medical interpretation.
If something is not explicitly mentioned, return null.
Output JSON ONLY.
No explanation text.
No markdown.
No extra commentary.









`
}
const general = new Agent({
  name: "General",
  instructions: generalInstructions,
  model: "gpt-4o-mini",
  outputType: GeneralSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

type WorkflowInput = { input_as_text: string };


// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("Medical", async () => {
    const state = {
      knowledge: "{   \"general_intake_questions\": [     \"What is the main complaint?\",     \"Since when did it start?\",     \"How severe is it?\",     \"Any associated symptoms?\",     \"Any previous medical history?\",     \"Any medication taken?\",     \"Any allergies?\"   ],   \"symptom_domain_map\": {     \"chest pain\": \"Cardiology\",     \"shortness of breath\": \"Cardiology\",     \"headache\": \"Neurology\",     \"seizure\": \"Neurology\",     \"fever\": \"InfectiousDisease\",     \"cough\": \"InfectiousDisease\"   },   \"severity_keywords\": [     \"severe\",     \"very painful\",     \"unbearable\",     \"sudden\",     \"worst ever\"   ] }",
      patient_symptoms: "NA",
      classifer_problem: "N/A"
    };
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6997391c33408190bc7d6b3db0a5332e03599c2f601f3ba6"
      }
    });
    const generalResultTemp = await runner.run(
      general,
      [
        ...conversationHistory
      ],
      {
        context: {
          stateKnowledge: state.knowledge
        }
      }
    );
    conversationHistory.push(...generalResultTemp.newItems.map((item) => item.rawItem));

    if (!generalResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const generalResult = {
      output_text: JSON.stringify(generalResultTemp.finalOutput),
      output_parsed: generalResultTemp.finalOutput
    };
    state.patient_symptoms = generalResult.output_parsed;
    const classifierResultTemp = await runner.run(
      classifier,
      [
        ...conversationHistory
      ]
    );
    conversationHistory.push(...classifierResultTemp.newItems.map((item) => item.rawItem));

    if (!classifierResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const classifierResult = {
      output_text: JSON.stringify(classifierResultTemp.finalOutput),
      output_parsed: classifierResultTemp.finalOutput
    };
    if (classifierResult.output_parsed.domain == "neurology" || classifierResult.output_parsed.domain == "Neurology") {
      const neurologyResultTemp = await runner.run(
        neurology,
        [
          ...conversationHistory
        ],
        {
          context: {
            statePatientSymptoms: state.patient_symptoms
          }
        }
      );
      conversationHistory.push(...neurologyResultTemp.newItems.map((item) => item.rawItem));

      if (!neurologyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const neurologyResult = {
        output_text: JSON.stringify(neurologyResultTemp.finalOutput),
        output_parsed: neurologyResultTemp.finalOutput
      };
      return neurologyResult;
    } else if (classifierResult.output_parsed.domain == "Cardiology") {
      const cardiologyResultTemp = await runner.run(
        cardiology,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...cardiologyResultTemp.newItems.map((item) => item.rawItem));

      if (!cardiologyResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const cardiologyResult = {
        output_text: JSON.stringify(cardiologyResultTemp.finalOutput),
        output_parsed: cardiologyResultTemp.finalOutput
      };
      return cardiologyResult;
    } else if (classifierResult.output_parsed.domain == "InfectionDisease") {
      const infectiousdiseaseResultTemp = await runner.run(
        infectiousdisease,
        [
          ...conversationHistory
        ],
        {
          context: {
            statePatientSymptoms: state.patient_symptoms
          }
        }
      );
      conversationHistory.push(...infectiousdiseaseResultTemp.newItems.map((item) => item.rawItem));

      if (!infectiousdiseaseResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const infectiousdiseaseResult = {
        output_text: JSON.stringify(infectiousdiseaseResultTemp.finalOutput),
        output_parsed: infectiousdiseaseResultTemp.finalOutput
      };
      return infectiousdiseaseResult;
    } else {
      return classifierResult;
    }
  });
}
