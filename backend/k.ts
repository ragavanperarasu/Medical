import { z } from "zod";
import { Agent, RunContext, AgentInputItem, Runner, withTrace } from "@openai/agents";
import { OpenAI } from "openai";
import { setDefaultOpenAIClient } from "@openai/agents";
import "dotenv/config";

const myClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

setDefaultOpenAIClient(myClient);

// 1. Schemas
const ClassifierSchema = z.object({ domain: z.string() });

const CardiologySchema = z.object({ 
  domain: z.enum(["Cardiology"]), 
  follow_up_questions: z.array(z.string()), 
  clinical_impression: z.string(), 
  risk_level: z.enum(["Low", "Moderate", "High"]), 
  recommendation: z.string() 
});

const NeurologySchema = z.object({ 
  domain: z.enum(["Neurology"]), 
  follow_up_questions: z.array(z.string()), 
  clinical_impression: z.string(), 
  risk_level: z.enum(["Low", "Moderate", "High"]), 
  recommendation: z.string() 
});

const InfectiousdiseaseSchema = z.object({
  domain: z.enum(["InfectiousDisease"]), 
  follow_up_questions: z.array(z.string()), 
  clinical_impression: z.string(), 
  risk_level: z.enum(["Low", "Moderate", "High"]), 
  recommendation: z.string()
});

const GeneralSchema = z.object({ 
  primary_complaint: z.string().nullable(), 
  symptoms: z.array(z.string()), 
  duration: z.string().nullable(), 
  severity: z.string().nullable(), 
  possible_domains: z.array(z.string()), 
  emergency_flag: z.boolean(), 
  structured_summary: z.string() 
});

// 2. Agents
const classifier = new Agent({
  name: "Classifier",
  instructions: `You are a Medical Domain Classification Agent.
You receive structured intake JSON from a General Intake Agent.
Your job is to determine which medical specialty should handle the patient.

1. Analyze the "symptoms" and "primary_complaint".
2. Select the most appropriate medical domain.
3. If emergency_flag = true, prioritize emergency_domains.
4. Output JSON only. Return strictly: { "domain": "..." }`,
  model: "gpt-4o-mini",
  outputType: ClassifierSchema,
  modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});

const cardiology = new Agent({
  name: "Cardiology",
  instructions: `You are a Cardiology Specialist Agent in a medical triage system.
Review cardiovascular symptoms, identify red flags, and provide a structured clinical assessment. Do NOT provide final diagnosis or prescribe medication.`,
  model: "gpt-4o-mini",
  outputType: CardiologySchema,
  modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});

interface SpecialistContext { statePatientSymptoms: string; }

const neurology = new Agent({
  name: "Neurology",
  instructions: (runContext: RunContext<SpecialistContext>) => `You are a Neurology Specialist Agent in a medical triage system.
You receive structured patient details:
${runContext.context.statePatientSymptoms}

Review neurological symptoms, identify red flags (e.g., sudden severe headache, loss of consciousness, one-sided weakness), and provide a structured clinical assessment. Do NOT provide final diagnosis or prescribe medication.`,
  model: "gpt-4o-mini",
  outputType: NeurologySchema,
  modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});

const infectiousdisease = new Agent({
  name: "InfectiousDisease",
  instructions: (runContext: RunContext<SpecialistContext>) => `You are an Infectious Disease Specialist Agent in a medical triage system.
You receive structured patient details:
${runContext.context.statePatientSymptoms}

Review infectious disease symptoms (e.g., fever, cough), identify red flags, and provide a structured clinical assessment. Do NOT provide final diagnosis or prescribe medication.`,
  model: "gpt-4o-mini",
  outputType: InfectiousdiseaseSchema,
  modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});

interface GeneralContext { stateKnowledge: string; }

const general = new Agent({
  name: "General",
  instructions: (runContext: RunContext<GeneralContext>) => `You are a Medical General Intake Extraction Agent.
You are given a transcript and a knowledge JSON:
${runContext.context.stateKnowledge}

Extract structured medical intake data about the PATIENT only. Do not diagnose or interpret. Output JSON ONLY.`,
  model: "gpt-4o-mini",
  outputType: GeneralSchema,
  modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});

type WorkflowInput = { input_as_text: string };

// 3. Main Workflow
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("Medical", async () => {
    const state = {
      knowledge: JSON.stringify({
        general_intake_questions: ["What is the main complaint?", "Since when did it start?", "How severe is it?", "Any associated symptoms?"],
        symptom_domain_map: { "chest pain": "Cardiology", "shortness of breath": "Cardiology", "headache": "Neurology", "seizure": "Neurology", "fever": "InfectiousDisease", "cough": "InfectiousDisease" },
        severity_keywords: ["severe", "very painful", "unbearable", "sudden", "worst ever"]
      }),
      patient_symptoms: "",
      classifer_problem: "N/A"
    };

    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];

    const runner = new Runner({
      traceMetadata: { __trace_source__: "agent-builder" }
    });

    // Run General Agent
    const generalResultTemp = await runner.run(general, [...conversationHistory], {
      context: { stateKnowledge: state.knowledge }
    });
    
    if (!generalResultTemp.finalOutput) throw new Error("General Agent result is undefined");
    conversationHistory.push(...generalResultTemp.newItems.map((item) => item.rawItem));
    
    // Fix: Stringify the parsed output before passing it to subsequent agents
    state.patient_symptoms = JSON.stringify(generalResultTemp.finalOutput);

    // Run Classifier
    const classifierResultTemp = await runner.run(classifier, [...conversationHistory]);
    if (!classifierResultTemp.finalOutput) throw new Error("Classifier Agent result is undefined");
    conversationHistory.push(...classifierResultTemp.newItems.map((item) => item.rawItem));

    const domain = classifierResultTemp.finalOutput.domain;

    // Route to Specialist
    if (domain === "Neurology" || domain === "neurology") {
      const neurologyResultTemp = await runner.run(neurology, [...conversationHistory], {
        context: { statePatientSymptoms: state.patient_symptoms }
      });
      return { output_parsed: neurologyResultTemp.finalOutput };

    } else if (domain === "Cardiology" || domain === "cardiology") {
      const cardiologyResultTemp = await runner.run(cardiology, [...conversationHistory]);
      return { output_parsed: cardiologyResultTemp.finalOutput };

    } else if (domain === "InfectiousDisease") { // Fix: Corrected spelling
      const infectiousResultTemp = await runner.run(infectiousdisease, [...conversationHistory], {
        context: { statePatientSymptoms: state.patient_symptoms }
      });
      return { output_parsed: infectiousResultTemp.finalOutput };

    } else {
      return { output_parsed: classifierResultTemp.finalOutput };
    }
  });
};