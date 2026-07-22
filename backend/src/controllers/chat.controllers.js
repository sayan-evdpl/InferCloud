import { GoogleGenerativeAI } from "@google/generative-ai";
import { localGpus, cloudProviders, integratedSystems } from "../db/seed.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Import scrapeTechPowerUp dynamically or implement a helper if needed.
// To avoid circular dependency, we will write a helper that imports or scrapes directly.
import { scrapeTechPowerUp } from "./gpu.controllers.js";

// Helper functions for tools
const localSearchGpus = (query) => {
  if (!query) return [];
  const regex = new RegExp(query.trim(), "i");
  const matchedLocal = localGpus.filter(g => regex.test(g.name) || regex.test(g.arch) || regex.test(g.gpuClass));
  const matchedCloud = cloudProviders.filter(c => regex.test(c.gpu) || regex.test(c.provider));
  const matchedSystems = integratedSystems.filter(s => regex.test(s.type) || regex.test(s.gpu));
  return {
    local: matchedLocal,
    cloud: matchedCloud,
    systems: matchedSystems,
  };
};

const getTcoData = (hours) => {
  const wsBase = 181000;
  const wsHourlyRate = 7.3125 * 365;
  const rpRate = 40.56 * 365;
  const e2eRate = 88 * 365;
  const lmbRate = 337.15 * 365;

  const currentWs = Math.round(wsBase + hours * wsHourlyRate);
  const currentRp = Math.round(hours * rpRate);
  const currentE2e = Math.round(hours * e2eRate);
  const currentLmb = Math.round(hours * lmbRate);

  let profile = hours < 4 ? "Ad-Hoc" : hours < 10 ? "Inflection" : "Production";
  let verdict = hours < 4 
    ? "Renting is drastically cheaper. Buying physical hardware is a waste of capital."
    : hours < 10 
    ? `At ${hours} hours, CapEx amortizes nicely. Consider physical hardware if data sovereignty is required.`
    : "Buying physical hardware yields extreme economic dominance over renting consumer GPUs.";

  return {
    hours,
    workstationAnnualInr: currentWs,
    runpodAnnualInr: currentRp,
    e2eAnnualInr: currentE2e,
    lambdaAnnualInr: currentLmb,
    profile,
    verdict,
  };
};

const getBandwidthData = () => {
  return localGpus.map((g) => ({
    name: g.name,
    arch: g.arch,
    bandwidthTbps: g.bandwidthTbps,
    vramGb: g.vramGb,
    gpuClass: g.gpuClass,
  }));
};

// Map tool calls to their respective javascript helper functions
const executeTool = async (name, args) => {
  switch (name) {
    case "searchGpus":
      return localSearchGpus(args.query);
    case "getTcoAnalysis":
      return getTcoData(Number(args.hours));
    case "getBandwidthSpecs":
      return getBandwidthData();
    case "getDetailedSpecs":
      return await scrapeTechPowerUp(args.name);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};

export const chatHandler = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer flashonn") {
    throw new ApiError(401, "Unauthorized: Invalid or missing bearer token.");
  }

  const { messages } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    throw new ApiError(500, "GEMINI_API_KEY is not configured in the backend environment.");
  }

  if (!messages || !Array.isArray(messages)) {
    throw new ApiError(400, "Conversation messages array is required.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Define tools for Gemini
  const tools = [
    {
      functionDeclarations: [
        {
          name: "searchGpus",
          description: "Search local, cloud, or workstation databases for matching GPUs/providers.",
          parameters: {
            type: "OBJECT",
            properties: {
              query: { type: "STRING", description: "Search query e.g. H100, RTX 5090, RunPod" }
            },
            required: ["query"]
          }
        },
        {
          name: "getTcoAnalysis",
          description: "Calculate and retrieve annual TCO data comparing local workstations vs cloud renting for a specified daily runtime.",
          parameters: {
            type: "OBJECT",
            properties: {
              hours: { type: "NUMBER", description: "Daily runtime hours (1 to 24)" }
            },
            required: ["hours"]
          }
        },
        {
          name: "getBandwidthSpecs",
          description: "Retrieve memory bandwidth specs and memory capacities of local physical GPUs.",
          parameters: {
            type: "OBJECT",
            properties: {}
          }
        },
        {
          name: "getDetailedSpecs",
          description: "Scrape and retrieve detailed hardware specs (transistors, process node, die size, memory type) from TechPowerUp for a specific GPU name.",
          parameters: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING", description: "Specific GPU name e.g. RTX 4090, H100, L40S" }
            },
            required: ["name"]
          }
        }
      ]
    }
  ];

  const systemInstruction = `You are "Flash", an elite AI infrastructure architect integrated into the GPU Scout platform. Your job is to help users find the absolute best GPU options based on the specific tasks they want to perform (e.g., fine-tuning models, high-throughput inference, low-latency API serving, edge deployment, offline training).

Be the cognitive backbone of this platform:
1. GUIDED INQUIRY: If a user's prompt is vague (e.g., "what GPU should I get?"), do not just list options. Guide them proactively. Ask about:
   - What model parameter size are they planning to load (e.g. 8B, 70B, 405B)?
   - Are they fine-tuning, serving batch inference, or running real-time low-latency APIs?
   - Do they have strict data sovereignty or security compliance requirements (favoring local physical GPUs)?
   - What is their typical daily compute runtime (to calculate TCO)?
2. TASK-FIT ANALYSIS: Always align recommendations to memory and bandwidth requirements:
   - Llama 3 8B FP16: needs ~16GB VRAM. RTX 4090 / 5090 is ideal locally, or Vast/RunPod on budget.
   - Llama 3 70B FP16: needs ~140GB VRAM. Recommend E2E H200 Spot or Lambda SXM instances.
   - For latency-critical pipelines: recommend H200 with HBM3e for maximum memory bandwidth.
   - For budget R&D: suggest consumer platforms (RTX 5090) with high local ROI.
3. DETAILED COMPARISONS: When comparing GPUs, use clean, beautiful Markdown tables listing: GPU, VRAM Capacity, Bandwidth (TB/s), Power (TGP), Est. Price/Rate, and Suitability Verdict.
4. GROUND TRUTH: Always use your tools (searchGpus, getBandwidthSpecs, getTcoAnalysis, getDetailedSpecs) to fetch database numbers or scrape specs. Do not hallucinate specs or rates.
5. GENERAL ARCHITECTURE KNOWLEDGE: If asked, answer general machine learning engineering questions (e.g., vLLM configuration, TensorRT-LLM, quantization methods like AWQ/GPTQ, or NVLink benefits).

Keep your tone professional, concise, and technically authoritative.`;

  const FALLBACK_MODELS = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash"];

  const getWorkingModel = (modelName) => {
    return genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
      tools
    });
  };

  let model = getWorkingModel(FALLBACK_MODELS[0]);

  // Map messages to Gemini's format. Roles must strictly alternate: user -> model -> user -> model.
  const chatHistory = [];
  for (const msg of messages) {
    if (!msg || typeof msg.content !== "string" || !msg.content.trim()) continue;
    const role = msg.role === "assistant" ? "model" : "user";
    
    // Skip leading model messages until we find the first user message
    if (chatHistory.length === 0 && role !== "user") continue;
    
    // Merge consecutive messages with the same role
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === role) {
      chatHistory[chatHistory.length - 1].parts[0].text += "\n" + msg.content;
    } else {
      chatHistory.push({
        role,
        parts: [{ text: msg.content }]
      });
    }
  }

  if (chatHistory.length === 0) {
    throw new ApiError(400, "No valid user message found in conversation.");
  }

  const safeGenerate = async (history) => {
    let lastErr = null;
    for (const mName of FALLBACK_MODELS) {
      try {
        const m = getWorkingModel(mName);
        return await m.generateContent({ contents: history });
      } catch (err) {
        lastErr = err;
        const isQuotaOrTransient = err.status === 429 || err.status === 503 || 
          err.message?.includes("429") || err.message?.includes("503") || 
          err.message?.includes("Quota exceeded") || err.message?.includes("unavailable");
        if (isQuotaOrTransient) {
          console.warn(`Model ${mName} hit transient error (${err.message?.split('\n')[0]}), trying fallback model...`);
          continue;
        }
        throw err;
      }
    }
    throw lastErr;
  };

  try {
    let response = await safeGenerate(chatHistory);
    let responseText = "";

    // Process potential tool calls in a loop (up to a depth of 5 calls)
    let depth = 0;
    while (depth < 5) {
      const functionCalls = response.response.functionCalls();
      if (!functionCalls || functionCalls.length === 0) {
        responseText = response.response.text();
        break;
      }

      // Handle function calls
      const toolResults = [];
      for (const call of functionCalls) {
        let resultData;
        try {
          resultData = await executeTool(call.name, call.args);
        } catch (err) {
          resultData = { error: err.message };
        }
        const fnResponse = {
          name: call.name,
          response: { result: resultData }
        };
        if (call.id) {
          fnResponse.id = call.id;
        }
        toolResults.push({
          functionResponse: fnResponse
        });
      }

      // Append model's complete candidate content turn and the user's tool results turn to history
      if (response.response.candidates && response.response.candidates[0]) {
        chatHistory.push(response.response.candidates[0].content);
      } else {
        chatHistory.push({
          role: "model",
          parts: functionCalls.map(call => ({
            functionCall: {
              name: call.name,
              args: call.args
            }
          }))
        });
      }

      chatHistory.push({
        role: "user",
        parts: toolResults
      });

      response = await safeGenerate(chatHistory);
      depth++;
    }

    return res.status(200).json(new ApiResponse(200, "Chat response retrieved successfully.", { text: responseText }));
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new ApiError(500, error.message || "An error occurred while communicating with Gemini.");
  }
});
