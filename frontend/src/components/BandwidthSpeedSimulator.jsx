import React, { useState } from "react";
import { motion } from "framer-motion";

const MODELS = [
  { id: "llama-70b", name: "Llama 3.3 70B", params: 70 },
  { id: "llama-405b", name: "Llama 3.1 405B", params: 405 },
  { id: "deepseek-671b", name: "DeepSeek-V3 671B (MoE)", params: 671, activeParams: 37 },
  { id: "llama-8b", name: "Llama 3.1 8B", params: 8 },
];

const QUANTIZATIONS = [
  { id: "fp16", name: "FP16 (16-bit)", bytesPerParam: 2.0 },
  { id: "fp8", name: "FP8 (8-bit)", bytesPerParam: 1.0 },
  { id: "int4", name: "INT4 (Q4_K_M)", bytesPerParam: 0.55 },
];

const GPUS = [
  { id: "h200", name: "NVIDIA H200 SXM", bandwidthTbps: 4.80, vramGb: 141, memoryType: "HBM3e", color: "#10b981" },
  { id: "h100", name: "NVIDIA H100 SXM", bandwidthTbps: 3.35, vramGb: 80, memoryType: "HBM3", color: "#0284c7" },
  { id: "rtx-5090", name: "NVIDIA RTX 5090", bandwidthTbps: 1.79, vramGb: 32, memoryType: "GDDR7", color: "#b26bf5" },
  { id: "rtx-4090", name: "NVIDIA RTX 4090", bandwidthTbps: 1.01, vramGb: 24, memoryType: "GDDR6X", color: "#f59e0b" },
  { id: "l40s", name: "NVIDIA L40S", bandwidthTbps: 0.86, vramGb: 48, memoryType: "GDDR6", color: "#ec4899" },
];

export default function BandwidthSpeedSimulator() {
  const [modelId, setModelId] = useState("llama-70b");
  const [quantId, setQuantId] = useState("fp8");
  const [batchSize, setBatchSize] = useState(1);

  const selectedModel = MODELS.find((m) => m.id === modelId) || MODELS[0];
  const selectedQuant = QUANTIZATIONS.find((q) => q.id === quantId) || QUANTIZATIONS[0];

  // Effective model size in GB
  const modelSizeGb = (selectedModel.activeParams || selectedModel.params) * selectedQuant.bytesPerParam;

  // Calculate speed metrics for each GPU
  const gpuResults = GPUS.map((gpu) => {
    const bandwidthGbs = gpu.bandwidthTbps * 1000;
    // Theoretical max single user stream speed (tokens/sec) = Bandwidth / Model Size
    const singleUserTokSec = Math.round(bandwidthGbs / modelSizeGb);
    // Time Between Tokens (ms/tok)
    const tbtMs = parseFloat((1000 / Math.max(1, singleUserTokSec)).toFixed(1));
    // Aggregate cluster throughput (tokens/sec) assuming batch efficiency multiplier ~0.6 per extra batch item
    const batchEff = 1 + (batchSize - 1) * 0.6;
    const aggregateTokSec = Math.round(singleUserTokSec * batchEff);

    return {
      ...gpu,
      singleUserTokSec,
      tbtMs,
      aggregateTokSec,
    };
  });

  const maxTokSec = Math.max(...gpuResults.map((r) => r.singleUserTokSec));

  return (
    <section id="bandwidth-simulator" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ marginBottom: "32px" }}>
          <span className="pill-tag pill-tag-violet" style={{ marginBottom: "10px" }}>
            ⚡ Hardware Physics & Throughput Benchmark
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2 className="heading-lg" style={{ color: "var(--color-ink-black)", marginTop: "4px", marginBottom: "6px" }}>
                Memory Bandwidth vs. Tokens/Sec Speed Simulator
              </h2>
              <p className="subheading" style={{ maxWidth: "660px" }}>
                LLM decoding throughput is strictly memory-bandwidth bound (TB/s). Compare real-world token generation speeds (Tokens/sec) and per-token latency (TBT ms) across architectures.
              </p>
            </div>
          </div>
        </div>

        {/* Simulator Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Model & Concurrency Controls */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid var(--color-sand-gray)",
              boxShadow: "var(--shadow-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* 1. Target Model */}
            <div>
              <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                1. SELECT AI MODEL:
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
                    <div style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginTop: "2px" }}>
                      {m.activeParams ? `${m.activeParams}B Active` : `${m.params}B Params`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Quantization */}
            <div>
              <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                2. QUANTIZATION PRECISION:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {QUANTIZATIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuantId(q.id)}
                    style={{
                      padding: "8px",
                      borderRadius: "10px",
                      border: quantId === q.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                      backgroundColor: quantId === q.id ? "#f3e8ff" : "transparent",
                      color: quantId === q.id ? "var(--color-electric-violet)" : "var(--color-ink-black)",
                      fontWeight: quantId === q.id ? 700 : 500,
                      fontSize: "11.5px",
                      cursor: "pointer",
                    }}
                  >
                    {q.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Batch Concurrency */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>
                  3. CONCURRENT BATCH SIZE:
                </label>
                <span style={{ fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-electric-violet)" }}>
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
                style={{ width: "100%", accentColor: "var(--color-electric-violet)", cursor: "pointer" }}
              />
            </div>

            {/* Metrics Info Box */}
            <div style={{ padding: "14px", borderRadius: "14px", backgroundColor: "#faf6fe", border: "1px solid rgba(178, 107, 245, 0.25)" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-electric-violet)", marginBottom: "4px" }}>
                📐 INFERENCE PHYSICS FORMULA
              </div>
              <div style={{ fontSize: "12px", color: "var(--color-charcoal-stone)", lineHeight: 1.45 }}>
                Effective Model Footprint: <strong>{modelSizeGb.toFixed(1)} GB</strong>
                <br />
                Tokens/Sec = Memory Bandwidth (GB/s) ÷ Model Footprint (GB)
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Speed Benchmarks */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid var(--color-sand-gray)",
              boxShadow: "var(--shadow-subtle-2)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="caption-text" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--color-charcoal-stone)" }}>
                THEORETICAL MAX DECODING SPEED (TOKENS/SEC)
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-ash-gray)" }}>
                Lower Latency (TBT ms) = Better
              </span>
            </div>

            {/* GPU Speed Comparison Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {gpuResults.map((gpu) => {
                const widthPct = Math.max(8, Math.min(100, Math.round((gpu.singleUserTokSec / maxTokSec) * 100)));
                return (
                  <div key={gpu.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-ink-black)" }}>{gpu.name}</span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "var(--color-linen-beige)",
                            color: "var(--color-charcoal-stone)",
                          }}
                        >
                          {gpu.bandwidthTbps} TB/s · {gpu.memoryType}
                        </span>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "15px", fontWeight: 800, fontFamily: "var(--font-mono)", color: gpu.color }}>
                          {gpu.singleUserTokSec} tok/s
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginLeft: "8px" }}>
                          ({gpu.tbtMs} ms/tok)
                        </span>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div
                      style={{
                        height: "22px",
                        width: "100%",
                        backgroundColor: "var(--color-linen-beige)",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid var(--color-sand-gray)",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          backgroundColor: gpu.color,
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Batch Concurrency Aggregate Footnote */}
            {batchSize > 1 && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: "var(--color-parchment-cream)",
                  border: "1px solid var(--color-sand-gray)",
                  fontSize: "12px",
                  color: "var(--color-charcoal-stone)",
                }}
              >
                📊 <strong>Batch Scaling Metric ({batchSize} concurrent users):</strong> At batch size {batchSize}, <strong>H200</strong> generates aggregate <strong>{gpuResults[0].aggregateTokSec} total tokens/sec</strong> across all streams, while <strong>RTX 5090</strong> delivers <strong>{gpuResults[2].aggregateTokSec} total tokens/sec</strong>.
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
