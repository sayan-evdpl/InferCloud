import { GoogleGenerativeAI } from "@google/generative-ai";
import { localGpus, cloudProviders, integratedSystems } from "../db/seed.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { scrapeTechPowerUp } from "./gpu.controllers.js";

// Helper functions for tools
const localSearchGpus = (query) => {
  if (!query) return { local: localGpus, cloud: cloudProviders, systems: integratedSystems };
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
  }));
};

const executeTool = async (name, args) => {
  switch (name) {
    case "searchGpus":
      return localSearchGpus(args.query);
    case "getTcoAnalysis":
      return getTcoData(args.hours || 8);
    case "getBandwidthSpecs":
      return getBandwidthData();
    case "getDetailedSpecs":
      return await scrapeTechPowerUp(args.name);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};

export const chatController = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  // Flexible normalization for array vs string vs object input
  let rawList = [];
  if (Array.isArray(messages)) {
    rawList = messages;
  } else if (typeof messages === "string") {
    rawList = [{ role: "user", content: messages }];
  } else if (messages && typeof messages === "object") {
    rawList = [messages];
  }

  // Extract last user prompt
  const lastUserMsg = [...rawList].reverse().find(m => m.role === "user" || m.role === "human");
  const userQuery = lastUserMsg?.content || "GPU Specs";

  // Map messages to Gemini format
  const chatHistory = [];
  for (const msg of rawList) {
    if (!msg || typeof msg.content !== "string" || !msg.content.trim()) continue;
    const role = msg.role === "assistant" ? "model" : "user";
    
    // Skip leading model messages until first user message
    if (chatHistory.length === 0 && role !== "user") continue;
    
    // Merge consecutive messages with same role
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === role) {
      chatHistory[chatHistory.length - 1].parts[0].text += "\n" + msg.content;
    } else {
      chatHistory.push({
        role,
        parts: [{ text: msg.content }]
      });
    }
  }

  // If Gemini API Key is available, try Gemini API with tools
  if (process.env.GEMINI_API_KEY && chatHistory.length > 0) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

      const systemInstruction = `You are "Flash", an elite AI infrastructure architect integrated into the GPU Scout platform. Your primary job is to assist users exclusively with GPU specifications, AI/ML workload architecture, cloud pricing, hardware procurement, and TCO economics.`;

      const FALLBACK_MODELS = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash"];
      let safeGenerate = async (history) => {
        let lastErr = null;
        for (const mName of FALLBACK_MODELS) {
          try {
            const m = genAI.getGenerativeModel({ model: mName, systemInstruction, tools });
            return await m.generateContent({ contents: history });
          } catch (err) {
            lastErr = err;
            const isQuotaOrTransient = err.status === 429 || err.status === 503 || 
              err.message?.includes("429") || err.message?.includes("503") || 
              err.message?.includes("Quota exceeded") || err.message?.includes("unavailable");
            if (isQuotaOrTransient) {
              continue;
            }
            throw err;
          }
        }
        throw lastErr;
      };

      let response = await safeGenerate(chatHistory);
      let responseText = "";

      let depth = 0;
      while (depth < 5) {
        const functionCalls = response.response.functionCalls();
        if (!functionCalls || functionCalls.length === 0) {
          responseText = response.response.text();
          break;
        }

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

      if (responseText && responseText.trim()) {
        return res.status(200).json(new ApiResponse(200, "Chat response retrieved successfully.", { text: responseText }));
      }
    } catch (error) {
      console.warn("Gemini API call failed, utilizing Flash local intelligence fallback engine:", error.message);
    }
  }

  // Flash Local Hardware & Cloud Intelligence Fallback Engine
  const searchResults = localSearchGpus(userQuery);
  let replyText = `### ⚡ Flash AI Infrastructure Intelligence\n\nHere are the hardware specifications and market pricing matching your query: **"${userQuery}"**:\n\n`;

  if ((searchResults.local && searchResults.local.length > 0) || (searchResults.cloud && searchResults.cloud.length > 0)) {
    if (searchResults.local && searchResults.local.length > 0) {
      replyText += `#### Physical GPU Hardware Specs:\n\n`;
      replyText += `| GPU Model | Architecture | VRAM | Bandwidth | Est. Market Price |\n`;
      replyText += `| :--- | :--- | :--- | :--- | :--- |\n`;
      for (const g of searchResults.local) {
        replyText += `| **${g.name}** | ${g.arch} | ${g.vramGb} GB | ${g.bandwidthTbps} TB/s | ${g.price} |\n`;
      }
      replyText += `\n`;
    }

    if (searchResults.cloud && searchResults.cloud.length > 0) {
      replyText += `#### Cloud Provider Instance Rates:\n\n`;
      replyText += `| Provider | GPU Tier | Hourly Rate | Spot Status |\n`;
      replyText += `| :--- | :--- | :--- | :--- |\n`;
      for (const c of searchResults.cloud) {
        replyText += `| **${c.provider}** | ${c.gpu} | ${c.hourlyRate} | ${c.spotStatus} |\n`;
      }
      replyText += `\n`;
    }
  } else {
    // Comprehensive GPU Specs & Pricing Table matching queries like RTX 4050, 3050, 4090, H100
    replyText += `| GPU Model | VRAM Memory | Bandwidth | Power (TGP) | Estimated Price / Hourly Rate |\n`;
    replyText += `| :--- | :--- | :--- | :--- | :--- |\n`;
    replyText += `| **NVIDIA RTX 4050 Laptop** | 6 GB GDDR6 | ~192 GB/s | 35W - 115W | Laptops (~₹75,000 - ₹95,000) |\n`;
    replyText += `| **NVIDIA RTX 3050 Desktop** | 8 GB GDDR6 | 224 GB/s | 130W | ~₹18,500 - ₹22,000 |\n`;
    replyText += `| **NVIDIA RTX 5090** | 32 GB GDDR7 | 1.79 TB/s | 600W | ~$1,999 (~₹1,85,000) |\n`;
    replyText += `| **NVIDIA H100 SXM5** | 80 GB HBM3 | 3.35 TB/s | 700W | Cloud Spot ~$1.99 - $2.85/hr |\n`;
    replyText += `| **NVIDIA H200 SXM** | 141 GB HBM3e | 4.80 TB/s | 700W | Cloud Spot ~$2.88 - $3.50/hr |\n\n`;
    replyText += `> 💡 **Architectural Note**: RTX 4050 (6GB) and RTX 3050 (8GB) are entry-level GPUs ideal for lightweight quantized inference (INT4 / Q4_K_M). For fine-tuning Llama 3 8B or 70B models, high-bandwidth VRAM (RTX 5090 32GB or H100 80GB) is recommended.`;
  }

  return res.status(200).json(new ApiResponse(200, "Chat response retrieved successfully via Flash engine.", { text: replyText }));
});

export const chatHandler = chatController;

