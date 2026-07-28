import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MODELS = [
  { id: "llama-405b", name: "Llama 3.1 405B", params: 405, layers: 126, heads: 128, headDim: 128, type: "Dense Flagship", gqaFactor: 0.125 },
  { id: "deepseek-671b", name: "DeepSeek-V3 671B (MoE)", params: 671, activeParams: 37, layers: 61, heads: 128, headDim: 128, type: "MoE Architect", gqaFactor: 0.25 },
  { id: "llama-70b", name: "Llama 3.3 70B", params: 70, layers: 80, heads: 64, headDim: 128, type: "Enterprise Dense", gqaFactor: 0.125 },
  { id: "qwen-72b", name: "Qwen 2.5 72B", params: 72, layers: 80, heads: 64, headDim: 128, type: "Enterprise Dense", gqaFactor: 0.125 },
  { id: "flux-dev", name: "FLUX.1-dev (Diffusion)", params: 12, layers: 38, heads: 32, headDim: 128, type: "Generative Diffusion", gqaFactor: 1.0 },
  { id: "llama-8b", name: "Llama 3.1 8B", params: 8, layers: 32, heads: 32, headDim: 128, type: "Edge Compact", gqaFactor: 0.25 },
];

const QUANTIZATIONS = [
  { id: "fp16", name: "FP16 (16-bit)", bytesPerParam: 2.0, kvBytes: 2 },
  { id: "fp8", name: "FP8 (8-bit)", bytesPerParam: 1.0, kvBytes: 1 },
  { id: "int4", name: "INT4 (Q4_K_M)", bytesPerParam: 0.55, kvBytes: 1 },
  { id: "int2", name: "INT2 (Q2_K)", bytesPerParam: 0.35, kvBytes: 1 },
];

const GPU_MODELS = [
  { id: "rtx-5090", name: "NVIDIA RTX 5090", singleVramGb: 32, category: "Blackwell Flagship" },
  { id: "h200", name: "NVIDIA H200 SXM", singleVramGb: 141, category: "Hopper Ultra" },
  { id: "h100", name: "NVIDIA H100 SXM", singleVramGb: 80, category: "Enterprise Datacenter" },
  { id: "l40s", name: "NVIDIA L40S", singleVramGb: 48, category: "Universal AI" },
  { id: "rtx-4090", name: "NVIDIA RTX 4090", singleVramGb: 24, category: "Consumer Workstation" },
];

const ATTENTION_TYPES = [
  { id: "gqa", name: "GQA (Grouped Query)", factor: 0.25, desc: "Modern LLM Standard" },
  { id: "mha", name: "MHA (Multi-Head)", factor: 1.0, desc: "Legacy Full Attention" },
  { id: "mqa", name: "MQA (Multi-Query)", factor: 0.125, desc: "Ultra Memory Optimized" },
];

export default function VramSimulator() {
  const [configMode, setConfigMode] = useState("presets"); // "presets" | "custom"

  // Preset state
  const [modelId, setModelId] = useState("llama-70b");
  const [quantId, setQuantId] = useState("fp8");
  const [contextK, setContextK] = useState(32);
  const [gpuId, setGpuId] = useState("rtx-5090");
  const [gpuCount, setGpuCount] = useState(2);
  const [batchSize, setBatchSize] = useState(1);
  const [attnType, setAttnType] = useState("gqa");

  // Custom model state
  const [customParamsB, setCustomParamsB] = useState(120);
  const [customVramGb, setCustomVramGb] = useState(48);

  const [copied, setCopied] = useState(false);

  // Derivations
  const selectedModel = MODELS.find((m) => m.id === modelId) || MODELS[0];
  const selectedQuant = QUANTIZATIONS.find((q) => q.id === quantId) || QUANTIZATIONS[0];
  const selectedGpu = GPU_MODELS.find((g) => g.id === gpuId) || GPU_MODELS[0];
  const selectedAttn = ATTENTION_TYPES.find((a) => a.id === attnType) || ATTENTION_TYPES[0];

  const totalParams = configMode === "custom" ? customParamsB : selectedModel.params;
  const layers = configMode === "custom" ? 80 : selectedModel.layers;
  const heads = configMode === "custom" ? 64 : selectedModel.heads;
  const headDim = configMode === "custom" ? 128 : selectedModel.headDim;

  const totalNodeVram = configMode === "custom" ? customVramGb * gpuCount : selectedGpu.singleVramGb * gpuCount;

  // 1. Weights VRAM
  const weightsVram = parseFloat((totalParams * selectedQuant.bytesPerParam).toFixed(1));

  // 2. KV Cache VRAM
  const contextTokens = contextK * 1024;
  const attnFactor = selectedAttn.factor;
  const rawKvBytes = 2 * layers * heads * headDim * contextTokens * batchSize * selectedQuant.kvBytes * attnFactor;
  const kvCacheVram = parseFloat((rawKvBytes / 1e9).toFixed(1));

  // 3. Activation & Overhead
  const activationOverhead = parseFloat((weightsVram * 0.15 + batchSize * 0.8 + 1.2).toFixed(1));

  const totalRequiredVram = parseFloat((weightsVram + kvCacheVram + activationOverhead).toFixed(1));
  const isOom = totalRequiredVram > totalNodeVram;
  const vramDeficit = parseFloat((totalRequiredVram - totalNodeVram).toFixed(1));
  const vramHeadroom = parseFloat((totalNodeVram - totalRequiredVram).toFixed(1));

  const weightsPct = Math.min(100, Math.round((weightsVram / totalNodeVram) * 100));
  const kvPct = Math.min(100 - weightsPct, Math.round((kvCacheVram / totalNodeVram) * 100));
  const actPct = Math.min(100 - weightsPct - kvPct, Math.round((activationOverhead / totalNodeVram) * 100));

  const handleCopyConfig = () => {
    const summaryStr = `✦ InferCloud VRAM Simulation ✦
Model: ${configMode === "custom" ? `Custom ${customParamsB}B` : selectedModel.name}
Quantization: ${selectedQuant.name}
Context Length: ${contextK}k tokens (${contextK * 1024} tokens)
Batch Size: ${batchSize} concurrent user(s)
Attention Architecture: ${selectedAttn.name}
Hardware Node: ${gpuCount}x ${configMode === "custom" ? "Custom GPU" : selectedGpu.name} (${totalNodeVram}GB Total VRAM)
----------------------------------------
Weights VRAM: ${weightsVram} GB
KV Cache VRAM: ${kvCacheVram} GB
Activation Overhead: ${activationOverhead} GB
Total Required VRAM: ${totalRequiredVram} GB
Verdict: ${isOom ? `OOM ERROR (-${vramDeficit} GB Deficit)` : `FIT (+${vramHeadroom} GB Headroom)`}`;

    navigator.clipboard.writeText(summaryStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="vram-simulator" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Header Bar */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span className="pill-tag pill-tag-violet" style={{ marginBottom: "10px" }}>
                ✦ Scalable Enterprise Memory Laboratory
              </span>
              <h2 className="heading-lg" style={{ color: "var(--color-ink-black)", marginTop: "4px", marginBottom: "6px" }}>
                VRAM & Out-Of-Memory (OOM) Simulator
              </h2>
              <p className="subheading" style={{ maxWidth: "640px" }}>
                Multi-GPU cluster sizing, dynamic KV Cache scaling, batch concurrency, and precision quantization analysis.
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div style={{ display: "flex", gap: "6px", backgroundColor: "var(--color-paper-white)", padding: "4px", borderRadius: "12px", border: "1px solid var(--color-sand-gray)", boxShadow: "var(--shadow-subtle)" }}>
              <button
                onClick={() => setConfigMode("presets")}
                style={{
                  height: "34px",
                  padding: "0 14px",
                  fontSize: "12.5px",
                  fontWeight: configMode === "presets" ? 700 : 500,
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: configMode === "presets" ? "var(--color-electric-violet)" : "transparent",
                  color: configMode === "presets" ? "#ffffff" : "var(--color-ink-black)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Model Presets
              </button>
              <button
                onClick={() => setConfigMode("custom")}
                style={{
                  height: "34px",
                  padding: "0 14px",
                  fontSize: "12.5px",
                  fontWeight: configMode === "custom" ? 700 : 500,
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: configMode === "custom" ? "var(--color-electric-violet)" : "transparent",
                  color: configMode === "custom" ? "#ffffff" : "var(--color-ink-black)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                ⚙️ Custom Model & Node
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Scalable Controls Card */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid var(--color-sand-gray)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            {configMode === "presets" ? (
              /* Preset Model Selector */
              <div style={{ marginBottom: "20px" }}>
                <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                  1. SELECT TARGET AI MODEL:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModelId(m.id)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: modelId === m.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                        backgroundColor: modelId === m.id ? "var(--color-lilac-mist)" : "transparent",
                        color: "var(--color-ink-black)",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "12.5px", fontWeight: 700 }}>{m.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginTop: "2px" }}>{m.type}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Custom Model Parameter Input */
              <div style={{ marginBottom: "20px", padding: "14px", borderRadius: "14px", backgroundColor: "#faf6fe", border: "1px solid rgba(178, 107, 245, 0.25)" }}>
                <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-electric-violet)", display: "block", marginBottom: "6px" }}>
                  ⚙️ CUSTOM MODEL PARAMETERS (BILLIONS):
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    value={customParamsB}
                    onChange={(e) => setCustomParamsB(Math.max(1, parseFloat(e.target.value) || 1))}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-sand-gray)",
                      fontSize: "14px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-ink-black)" }}>Billion Params</span>
                </div>
              </div>
            )}

            {/* Quantization Selector */}
            <div style={{ marginBottom: "20px" }}>
              <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                2. QUANTIZATION PRECISION:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {QUANTIZATIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuantId(q.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: quantId === q.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                      backgroundColor: quantId === q.id ? "#f3e8ff" : "transparent",
                      color: quantId === q.id ? "var(--color-electric-violet)" : "var(--color-ink-black)",
                      fontWeight: quantId === q.id ? 700 : 500,
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {q.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Context & Batch Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "20px" }}>
              {/* Context Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>
                    3. CONTEXT WINDOW:
                  </label>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-electric-violet)" }}>
                    {contextK}k Tokens ({contextK * 1024} tokens)
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="128"
                  step="4"
                  value={contextK}
                  onChange={(e) => setContextK(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--color-electric-violet)", cursor: "pointer" }}
                />
              </div>

              {/* Batch Concurrency Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>
                    4. CONCURRENT BATCH SIZE:
                  </label>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#0284c7" }}>
                    {batchSize} User Stream{batchSize > 1 ? "s" : ""}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  step="1"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "#0284c7", cursor: "pointer" }}
                />
              </div>
            </div>

            {/* Attention Architecture */}
            <div style={{ marginBottom: "20px" }}>
              <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                5. ATTENTION MECHANISM (KV CACHE SCALING):
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {ATTENTION_TYPES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAttnType(a.id)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "8px",
                      border: attnType === a.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                      backgroundColor: attnType === a.id ? "var(--color-lilac-mist)" : "transparent",
                      color: "var(--color-ink-black)",
                      fontSize: "11px",
                      fontWeight: attnType === a.id ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {a.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Selection & Scaling */}
            <div>
              <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                6. HARDWARE NODE & MULTI-GPU SCALING:
              </label>

              {configMode === "presets" ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={gpuId}
                    onChange={(e) => setGpuId(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-sand-gray)",
                      backgroundColor: "var(--color-parchment-cream)",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      outline: "none",
                    }}
                  >
                    {GPU_MODELS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.singleVramGb}GB)
                      </option>
                    ))}
                  </select>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>Count:</span>
                    <select
                      value={gpuCount}
                      onChange={(e) => setGpuCount(parseInt(e.target.value))}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "10px",
                        border: "1px solid var(--color-sand-gray)",
                        backgroundColor: "#ffffff",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {[1, 2, 4, 8, 16].map((cnt) => (
                        <option key={cnt} value={cnt}>
                          {cnt}x ({cnt * selectedGpu.singleVramGb}GB)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="number"
                      min="8"
                      max="512"
                      value={customVramGb}
                      onChange={(e) => setCustomVramGb(Math.max(8, parseInt(e.target.value) || 8))}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "10px",
                        border: "1px solid var(--color-sand-gray)",
                        fontSize: "13px",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                      }}
                    />
                    <span style={{ fontSize: "12px", fontWeight: 600 }}>GB / GPU</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>GPUs:</span>
                    <select
                      value={gpuCount}
                      onChange={(e) => setGpuCount(parseInt(e.target.value))}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "10px",
                        border: "1px solid var(--color-sand-gray)",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {[1, 2, 4, 8, 16].map((cnt) => (
                        <option key={cnt} value={cnt}>
                          {cnt}x ({cnt * customVramGb}GB)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Visual Allocation & Verdict */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: isOom ? "2px solid #ef4444" : "1.5px solid rgba(178, 107, 245, 0.35)",
              boxShadow: isOom ? "0 8px 24px rgba(239, 68, 68, 0.12)" : "var(--shadow-subtle-2)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Header Status Banner */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                backgroundColor: isOom ? "#fef2f2" : vramHeadroom < 8 ? "#fffbeb" : "#f0fdf4",
                border: isOom ? "1px solid #fca5a5" : vramHeadroom < 8 ? "1px solid #fcd34d" : "1px solid #86efac",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: isOom ? "#dc2626" : vramHeadroom < 8 ? "#b45309" : "#15803d" }}>
                  {isOom ? "🔴 OUT OF MEMORY (OOM)" : vramHeadroom < 8 ? "🟡 TIGHT MEMORY FIT" : "🟢 PERFECT HARDWARE FIT"}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-ink-black)", marginTop: "2px" }}>
                  {isOom
                    ? `Deficit of -${vramDeficit} GB VRAM`
                    : `Headroom of +${vramHeadroom} GB available`}
                </div>
              </div>

              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  backgroundColor: isOom ? "#ef4444" : "#10b981",
                  color: "#ffffff",
                }}
              >
                {totalRequiredVram} / {totalNodeVram} GB
              </span>
            </div>

            {/* Animated Memory Progress Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
                <span>MEMORY ALLOCATION STACK</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-electric-violet)" }}>
                  {Math.round((totalRequiredVram / totalNodeVram) * 100)}% Capacity Used
                </span>
              </div>

              <div
                style={{
                  height: "30px",
                  width: "100%",
                  backgroundColor: "var(--color-linen-beige)",
                  borderRadius: "15px",
                  overflow: "hidden",
                  display: "flex",
                  border: "1px solid var(--color-sand-gray)",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: `${weightsPct}%`,
                    backgroundColor: "#b26bf5",
                    height: "100%",
                    transition: "width 0.3s ease",
                  }}
                  title={`Weights: ${weightsVram} GB`}
                />
                <div
                  style={{
                    width: `${kvPct}%`,
                    backgroundColor: "#38bdf8",
                    height: "100%",
                    transition: "width 0.3s ease",
                  }}
                  title={`KV Cache: ${kvCacheVram} GB`}
                />
                <div
                  style={{
                    width: `${actPct}%`,
                    backgroundColor: "#f472b6",
                    height: "100%",
                    transition: "width 0.3s ease",
                  }}
                  title={`Activation Overhead: ${activationOverhead} GB`}
                />
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: "#fdf4ff", border: "1px solid #f5d0fe" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#9333ea", display: "block" }}>🟣 WEIGHTS</span>
                <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>{weightsVram} GB</span>
              </div>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#0284c7", display: "block" }}>🌐 KV CACHE</span>
                <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>{kvCacheVram} GB</span>
              </div>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: "#fdf2f8", border: "1px solid #fbcfe8" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#db2777", display: "block" }}>🌸 OVERHEAD</span>
                <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>{activationOverhead} GB</span>
              </div>
            </div>

            {/* Recommendation Footer */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--color-parchment-cream)",
                border: "1px solid var(--color-sand-gray)",
                fontSize: "12px",
                lineHeight: 1.45,
                color: "var(--color-charcoal-stone)",
              }}
            >
              💡 <strong>Scaling Analysis:</strong>{" "}
              {isOom ? (
                <>
                  Running <strong>{configMode === "custom" ? `${customParamsB}B` : selectedModel.name}</strong> at <strong>{selectedQuant.name}</strong> with <strong>{batchSize} batch size</strong> causes OOM. Increase GPU node count to <strong>{Math.ceil(totalRequiredVram / (configMode === "custom" ? customVramGb : selectedGpu.singleVramGb))}x GPUs</strong>.
                </>
              ) : (
                <>
                  Configuration fits comfortably within node limits with <strong>+{vramHeadroom} GB</strong> headroom for activation spikes.
                </>
              )}
            </div>

            {/* Share / Export Config Button */}
            <button
              onClick={handleCopyConfig}
              className="btn-outlined-violet"
              style={{
                width: "100%",
                height: "38px",
                fontSize: "12.5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {copied ? "✓ Simulation Config Copied!" : "📋 Share / Copy Simulation Specs"}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
