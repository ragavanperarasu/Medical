"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWorkflow = void 0;
var zod_1 = require("zod");
var agents_1 = require("@openai/agents");
var openai_1 = require("openai");
var agents_2 = require("@openai/agents");
require("dotenv/config");
var myClient = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
(0, agents_2.setDefaultOpenAIClient)(myClient);
// 1. Schemas
var ClassifierSchema = zod_1.z.object({ domain: zod_1.z.string() });
var CardiologySchema = zod_1.z.object({
    domain: zod_1.z.enum(["Cardiology"]),
    follow_up_questions: zod_1.z.array(zod_1.z.string()),
    clinical_impression: zod_1.z.string(),
    risk_level: zod_1.z.enum(["Low", "Moderate", "High"]),
    recommendation: zod_1.z.string()
});
var NeurologySchema = zod_1.z.object({
    domain: zod_1.z.enum(["Neurology"]),
    follow_up_questions: zod_1.z.array(zod_1.z.string()),
    clinical_impression: zod_1.z.string(),
    risk_level: zod_1.z.enum(["Low", "Moderate", "High"]),
    recommendation: zod_1.z.string()
});
var InfectiousdiseaseSchema = zod_1.z.object({
    domain: zod_1.z.enum(["InfectiousDisease"]),
    follow_up_questions: zod_1.z.array(zod_1.z.string()),
    clinical_impression: zod_1.z.string(),
    risk_level: zod_1.z.enum(["Low", "Moderate", "High"]),
    recommendation: zod_1.z.string()
});
var GeneralSchema = zod_1.z.object({
    primary_complaint: zod_1.z.string().nullable(),
    symptoms: zod_1.z.array(zod_1.z.string()),
    duration: zod_1.z.string().nullable(),
    severity: zod_1.z.string().nullable(),
    possible_domains: zod_1.z.array(zod_1.z.string()),
    emergency_flag: zod_1.z.boolean(),
    structured_summary: zod_1.z.string()
});
// 2. Agents
var classifier = new agents_1.Agent({
    name: "Classifier",
    instructions: "You are a Medical Domain Classification Agent.\nYou receive structured intake JSON from a General Intake Agent.\nYour job is to determine which medical specialty should handle the patient.\n\n1. Analyze the \"symptoms\" and \"primary_complaint\".\n2. Select the most appropriate medical domain.\n3. If emergency_flag = true, prioritize emergency_domains.\n4. Output JSON only. Return strictly: { \"domain\": \"...\" }",
    model: "gpt-4o-mini",
    outputType: ClassifierSchema,
    modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});
var cardiology = new agents_1.Agent({
    name: "Cardiology",
    instructions: "You are a Cardiology Specialist Agent in a medical triage system.\nReview cardiovascular symptoms, identify red flags, and provide a structured clinical assessment. Do NOT provide final diagnosis or prescribe medication.",
    model: "gpt-4o-mini",
    outputType: CardiologySchema,
    modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});
var neurology = new agents_1.Agent({
    name: "Neurology",
    instructions: function (runContext) { return "You are a Neurology Specialist Agent in a medical triage system.\nYou receive structured patient details:\n".concat(runContext.context.statePatientSymptoms, "\n\nReview neurological symptoms, identify red flags (e.g., sudden severe headache, loss of consciousness, one-sided weakness), and provide a structured clinical assessment. Do NOT provide final diagnosis or prescribe medication."); },
    model: "gpt-4o-mini",
    outputType: NeurologySchema,
    modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});
var infectiousdisease = new agents_1.Agent({
    name: "InfectiousDisease",
    instructions: function (runContext) { return "You are an Infectious Disease Specialist Agent in a medical triage system.\nYou receive structured patient details:\n".concat(runContext.context.statePatientSymptoms, "\n\nReview infectious disease symptoms (e.g., fever, cough), identify red flags, and provide a structured clinical assessment. Do NOT provide final diagnosis or prescribe medication."); },
    model: "gpt-4o-mini",
    outputType: InfectiousdiseaseSchema,
    modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});
var general = new agents_1.Agent({
    name: "General",
    instructions: function (runContext) { return "You are a Medical General Intake Extraction Agent.\nYou are given a transcript and a knowledge JSON:\n".concat(runContext.context.stateKnowledge, "\n\nExtract structured medical intake data about the PATIENT only. Do not diagnose or interpret. Output JSON ONLY."); },
    model: "gpt-4o-mini",
    outputType: GeneralSchema,
    modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});
// 3. Main Workflow
var runWorkflow = function (workflow) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, agents_1.withTrace)("Medical", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var state, conversationHistory, runner, generalResultTemp, classifierResultTemp, domain, neurologyResultTemp, cardiologyResultTemp, infectiousResultTemp;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                state = {
                                    knowledge: JSON.stringify({
                                        general_intake_questions: ["What is the main complaint?", "Since when did it start?", "How severe is it?", "Any associated symptoms?"],
                                        symptom_domain_map: { "chest pain": "Cardiology", "shortness of breath": "Cardiology", "headache": "Neurology", "seizure": "Neurology", "fever": "InfectiousDisease", "cough": "InfectiousDisease" },
                                        severity_keywords: ["severe", "very painful", "unbearable", "sudden", "worst ever"]
                                    }),
                                    patient_symptoms: "",
                                    classifer_problem: "N/A"
                                };
                                conversationHistory = [
                                    { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
                                ];
                                runner = new agents_1.Runner({
                                    traceMetadata: { __trace_source__: "agent-builder" }
                                });
                                return [4 /*yield*/, runner.run(general, __spreadArray([], conversationHistory, true), {
                                        context: { stateKnowledge: state.knowledge }
                                    })];
                            case 1:
                                generalResultTemp = _a.sent();
                                if (!generalResultTemp.finalOutput)
                                    throw new Error("General Agent result is undefined");
                                conversationHistory.push.apply(conversationHistory, generalResultTemp.newItems.map(function (item) { return item.rawItem; }));
                                // Fix: Stringify the parsed output before passing it to subsequent agents
                                state.patient_symptoms = JSON.stringify(generalResultTemp.finalOutput);
                                return [4 /*yield*/, runner.run(classifier, __spreadArray([], conversationHistory, true))];
                            case 2:
                                classifierResultTemp = _a.sent();
                                if (!classifierResultTemp.finalOutput)
                                    throw new Error("Classifier Agent result is undefined");
                                conversationHistory.push.apply(conversationHistory, classifierResultTemp.newItems.map(function (item) { return item.rawItem; }));
                                domain = classifierResultTemp.finalOutput.domain;
                                if (!(domain === "Neurology" || domain === "neurology")) return [3 /*break*/, 4];
                                return [4 /*yield*/, runner.run(neurology, __spreadArray([], conversationHistory, true), {
                                        context: { statePatientSymptoms: state.patient_symptoms }
                                    })];
                            case 3:
                                neurologyResultTemp = _a.sent();
                                return [2 /*return*/, { output_parsed: neurologyResultTemp.finalOutput }];
                            case 4:
                                if (!(domain === "Cardiology" || domain === "cardiology")) return [3 /*break*/, 6];
                                return [4 /*yield*/, runner.run(cardiology, __spreadArray([], conversationHistory, true))];
                            case 5:
                                cardiologyResultTemp = _a.sent();
                                return [2 /*return*/, { output_parsed: cardiologyResultTemp.finalOutput }];
                            case 6:
                                if (!(domain === "InfectiousDisease")) return [3 /*break*/, 8];
                                return [4 /*yield*/, runner.run(infectiousdisease, __spreadArray([], conversationHistory, true), {
                                        context: { statePatientSymptoms: state.patient_symptoms }
                                    })];
                            case 7:
                                infectiousResultTemp = _a.sent();
                                return [2 /*return*/, { output_parsed: infectiousResultTemp.finalOutput }];
                            case 8: return [2 /*return*/, { output_parsed: classifierResultTemp.finalOutput }];
                        }
                    });
                }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.runWorkflow = runWorkflow;
