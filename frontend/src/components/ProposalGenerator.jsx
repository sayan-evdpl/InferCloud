import React, { useState } from "react";
import { motion } from "framer-motion";

const WORKLOAD_SUGGESTIONS = [
  { label: "🦙 Llama 3.3 70B (FP8) - Fine-Tuning & Serving", name: "Llama 3.3 70B Production Cluster", workload: "LLM Fine-Tuning & High Throughput Serving", capex: 12398, cloudRate: 1.05 },
  { label: "🐋 DeepSeek-V3 671B MoE - Distributed Array", name: "DeepSeek-V3 671B Enterprise Infrastructure", workload: "Multi-Node MoE Inference & Training", capex: 48500, cloudRate: 4.39 },
  { label: "🎨 FLUX.1-dev - Image & Video Pipeline", name: "GenAI Visual Media Pipeline", workload: "High Concurrency Image & Video Generation", capex: 6499, cloudRate: 0.65 },
  { label: "🎙️ Whisper Large v3 - Speech Recognition", name: "Enterprise Voice AI Processing Node", workload: "Real-Time Audio Transcription & Synthesis", capex: 4200, cloudRate: 0.44 },
  { label: "⚡ Llama 3.1 8B - Edge Inference Engine", name: "Low-Latency Edge AI Engine", workload: "Sub-50ms On-Premise API Serving", capex: 3200, cloudRate: 0.35 },
];

const ORG_SUGGESTIONS = [
  "AI Core Infrastructure Team",
  "Enterprise DevOps & Cloud Engineering",
  "Applied AI Research Laboratory",
  "FinTech Data & Machine Learning Group",
];

const PROJECT_SUGGESTIONS = [
  "Production LLM Inference Cluster",
  "Enterprise RAG Knowledge Graph Engine",
  "Multimodal AI Autonomous Agent Platform",
  "Deep Learning Model Training Workstation",
];

export default function ProposalGenerator() {
  const [projName, setProjName] = useState("Llama 3.3 70B Production Cluster");
  const [orgName, setOrgName] = useState("AI Core Infrastructure Team");
  const [capexEstimate, setCapexEstimate] = useState(12398);
  const [cloudHourly, setCloudHourly] = useState(1.05);
  const [workloadType, setWorkloadType] = useState("LLM Fine-Tuning & High Throughput Serving");

  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [aiReportText, setAiReportText] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Financial calculations
  const monthlyCloudCost = Math.round(cloudHourly * 24 * 30);
  const breakevenMonths = (capexEstimate / monthlyCloudCost).toFixed(1);
  const threeYearCloudCost = Math.round(monthlyCloudCost * 36);
  const netThreeYearSavings = (threeYearCloudCost - capexEstimate).toLocaleString();

  const handleEnhanceWithFlashAi = async () => {
    setIsGeneratingAi(true);
    try {
      const promptMsg = `Generate a comprehensive, highly strategic CFO & CTO Executive Procurement Proposal for:
Project: ${projName}
Organization: ${orgName}
Workload: ${workloadType}
CapEx Hardware Build: $${capexEstimate.toLocaleString()}
Cloud Spot Rate: $${cloudHourly.toFixed(2)}/hr ($${monthlyCloudCost}/mo)
Financial Breakeven: ${breakevenMonths} Months

Include executive summary, TCO payback timeline, risk mitigation, and recommended hardware specs in clean Markdown.`;

      const res = await fetch("http://localhost:5000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptMsg }),
      });
      const data = await res.json();
      if (data?.data?.reply) {
        setAiReportText(data.data.reply);
      }
    } catch (err) {
      console.error("Flash AI request error:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const generateProposalText = () => {
    if (aiReportText) return aiReportText;

    return `# EXECUTIVE PROCUREMENT PROPOSAL & FINANCIAL TCO REPORT
**Date:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
**Prepared For:** ${orgName}
**Project:** ${projName}
**Target Workload:** ${workloadType}

---

## 1. Executive Summary & Infrastructure Verdict
This proposal presents the hardware procurement and cloud spot arbitrage recommendation for **${projName}**. 
Based on our workload memory architecture simulation, we recommend a hybrid deployment strategy balancing CapEx hardware sovereignty with low-latency Regional Cloud Nodes.

### Key Highlights:
- **Recommended CapEx System:** 2x NVIDIA RTX 5090 (64GB VRAM) / AMD Threadripper PRO 64-Core Node
- **Total CapEx Build Estimate:** $${capexEstimate.toLocaleString()} USD
- **Regional Cloud Spot Alternative:** E2E Networks H200 ($${cloudHourly.toFixed(2)}/hr)
- **Financial Breakeven Payback Period:** **${breakevenMonths} Months**
- **Estimated 3-Year Savings:** **$${netThreeYearSavings} USD** vs full-price public cloud

---

## 2. Hardware Architecture & Workload Fit Benchmark
- **Model Footprint:** Llama 3.3 70B at FP8 Precision (~70 GB VRAM required)
- **Decoding Performance:** ~25.6 tok/s per stream (RTX 5090) / ~68.5 tok/s (H200 SXM5)
- **Memory Bandwidth Fit:** 1.79 TB/s GDDR7 memory bus eliminates KV Cache memory bottlenecks during peak inference.

---

## 3. Financial CapEx vs OpEx Breakeven Matrix

| Metric | Direct CapEx Procurement | Public Cloud Rental (Standard) | Regional Spot Arbitrage (E2E) |
| :--- | :--- | :--- | :--- |
| **Initial Cost** | **$${capexEstimate.toLocaleString()}** | $0 | $0 |
| **Hourly Equivalent** | ~$0.47/hr (amortized 3 yrs) | $4.39/hr | **$${cloudHourly.toFixed(2)}/hr** |
| **Monthly Operating Cost** | ~$167/mo (Electricity) | ~$3,160/mo | **~$${monthlyCloudCost}/mo** |
| **3-Year Total Spend** | **$${(capexEstimate + 167 * 36).toLocaleString()}** | $113,760 | **$${threeYearCloudCost.toLocaleString()}** |

---

## 4. Risk Assessment & Data Sovereignty
- **Data Privacy & Sovereignty:** Direct CapEx hardware provides 100% air-gapped data sovereignty with zero third-party telemetry exposure.
- **Hardware Warranty:** 3-Year Enterprise On-Site Support included.
- **Power & Thermal Compliance:** 2000W Liquid Loop cooling ensures operating temperatures below 68°C under continuous 24/7 load.

---
*Generated via InferCloud / GPU Scout Executive Proposal Engine.*`;
  };

  const handleCopyProposal = () => {
    const text = generateProposalText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadProposal = () => {
    const text = generateProposalText();
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Procurement_Proposal_${orgName.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <section id="proposal-generator" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ marginBottom: "32px" }}>
          <span className="pill-tag pill-tag-violet" style={{ marginBottom: "10px" }}>
            📑 Executive Proposal Engine · CFO & DevOps Approved
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2 className="heading-lg" style={{ color: "var(--color-ink-black)", marginTop: "4px", marginBottom: "6px" }}>
                One-Click Executive Procurement Proposal Generator
              </h2>
              <p className="subheading" style={{ maxWidth: "660px" }}>
                Generate a formal executive procurement proposal (formatted Markdown / PDF) with financial TCO breakeven charts, spot rate matrices, and data sovereignty risk analysis ready for CFOs and DevOps leaders.
              </p>
            </div>
          </div>
        </div>

        {/* Form & Proposal Preview Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Form Controls */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid var(--color-sand-gray)",
              boxShadow: "var(--shadow-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--color-electric-violet)", paddingBottom: "6px", borderBottom: "1px dashed var(--color-sand-gray)" }}>
              📝 PROPOSAL CONFIGURATION PARAMETERS
            </div>

            {/* Quick Model & Workload Autofill Dropdown */}
            <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: "#faf6fe", border: "1px solid rgba(178, 107, 245, 0.25)" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-electric-violet)", display: "block", marginBottom: "4px" }}>
                💡 MODEL & WORKLOAD QUICK AUTOFILL:
              </label>
              <select
                onChange={(e) => {
                  const item = WORKLOAD_SUGGESTIONS[parseInt(e.target.value)];
                  if (item) {
                    setProjName(item.name);
                    setWorkloadType(item.workload);
                    setCapexEstimate(item.capex);
                    setCloudHourly(item.cloudRate);
                  }
                }}
                style={{ width: "100%", padding: "6px 8px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", backgroundColor: "#ffffff" }}
              >
                <option value="">-- Select Model & Workload Preset --</option>
                {WORKLOAD_SUGGESTIONS.map((w, idx) => (
                  <option key={idx} value={idx}>{w.label}</option>
                ))}
              </select>
            </div>

            {/* Project Name Field & Dropdown */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>
                  PROJECT / INITIATIVE TITLE:
                </label>
                <select
                  onChange={(e) => { if (e.target.value) setProjName(e.target.value); }}
                  style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)" }}
                >
                  <option value="">Suggestions</option>
                  {PROJECT_SUGGESTIONS.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--color-sand-gray)", fontSize: "13px" }}
              />
            </div>

            {/* Organization Field & Dropdown */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>
                  ORGANIZATION / TEAM NAME:
                </label>
                <select
                  onChange={(e) => { if (e.target.value) setOrgName(e.target.value); }}
                  style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)" }}
                >
                  <option value="">Suggestions</option>
                  {ORG_SUGGESTIONS.map((o, idx) => (
                    <option key={idx} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--color-sand-gray)", fontSize: "13px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>
                TARGET WORKLOAD DESCRIPTION:
              </label>
              <input
                type="text"
                value={workloadType}
                onChange={(e) => setWorkloadType(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--color-sand-gray)", fontSize: "13px" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>CapEx Build ($):</label>
                <input
                  type="number"
                  value={capexEstimate}
                  onChange={(e) => setCapexEstimate(parseFloat(e.target.value) || 0)}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>Spot Cloud Rate ($/hr):</label>
                <input
                  type="number"
                  step="0.05"
                  value={cloudHourly}
                  onChange={(e) => setCloudHourly(parseFloat(e.target.value) || 0)}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                />
              </div>
            </div>

            {/* Quick Metrics Summary */}
            <div style={{ padding: "14px", borderRadius: "14px", backgroundColor: "#faf6fe", border: "1px solid rgba(178, 107, 245, 0.25)" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-electric-violet)", marginBottom: "4px" }}>
                📊 COMPUTED FINANCIAL METRICS
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--color-ink-black)", lineHeight: 1.5 }}>
                • Payback Breakeven: <strong>{breakevenMonths} Months</strong>
                <br />
                • 3-Year Net Savings: <strong>${netThreeYearSavings} USD</strong>
              </div>
            </div>

            {/* Flash AI Synthesis Button */}
            <button
              onClick={handleEnhanceWithFlashAi}
              disabled={isGeneratingAi}
              style={{
                height: "38px",
                borderRadius: "10px",
                border: "1px solid var(--color-electric-violet)",
                backgroundColor: isGeneratingAi ? "var(--color-sand-gray)" : "var(--color-lilac-mist)",
                color: "var(--color-electric-violet)",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isGeneratingAi ? "⚡ Flash AI Drafting Executive Report..." : "✨ Synthesize Custom Briefing with Flash AI"}
            </button>

            {/* Export Buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button
                onClick={handleDownloadProposal}
                className="btn-filled-dark"
                style={{ flex: 1, height: "42px", fontSize: "12.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                {downloaded ? "✓ Downloaded .md!" : "📄 Download Proposal"}
              </button>

              <button
                onClick={handleCopyProposal}
                className="btn-outlined-violet"
                style={{ height: "42px", padding: "0 14px", fontSize: "12.5px" }}
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>

          {/* Right Column: Live Markdown Document Preview Card */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: "1.5px solid rgba(178, 107, 245, 0.35)",
              boxShadow: "var(--shadow-subtle-2)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px stroke var(--color-sand-gray)", paddingBottom: "10px" }}>
              <span className="caption-text" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--color-charcoal-stone)" }}>
                LIVE PROPOSAL DOCUMENT PREVIEW
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", fontFamily: "var(--font-mono)" }}>
                ● READY FOR EXPORT
              </span>
            </div>

            {/* Document Render Window */}
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                lineHeight: 1.55,
                color: "var(--color-ink-black)",
                backgroundColor: "var(--color-parchment-cream)",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid var(--color-sand-gray)",
                overflowX: "auto",
                maxHeight: "360px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {generateProposalText()}
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
}
