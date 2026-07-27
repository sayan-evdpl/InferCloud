import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StoryBenefitsModal({
  isOpen,
  onClose,
  onExplorePlatform,
}) {
  const [activeChapter, setActiveChapter] = useState(0);

  if (!isOpen) return null;

  const chapters = [
    {
      id: "act1",
      tag: "ACT I // THE SILICON BOTTLENECK",
      title: "Why Memory Bandwidth Defines Modern AI",
      quote:
        "In transformer pipelines, token generation is memory bandwidth-bound, not compute-bound.",
      content:
        "As LLM parameter counts scale past 70 billion parameters, standard FLOPS benchmarks fail to predict real-world inference throughput. Modern LLM inference reads weights from VRAM once per token. Therefore, memory bus width (e.g. 512-bit vs 5120-bit HBM3e) directly sets your token generation speed ceiling. GPU Scout was built to give AI platform engineers instant clarity on memory throughput breakevens across Hopper and Blackwell architectures.",
      highlights: [
        { label: "Memory Bandwidth Scaling", value: "Up to 4.80 TB/s on H200" },
        {
          label: "Hardware Efficiency",
          value: "Eliminate inter-node communication latency",
        },
      ],
    },
    {
      id: "act2",
      tag: "ACT II // TELEMETRY & COST TRANSPARENCY",
      title: "CapEx Procurement vs. Cloud Spot Tariffs",
      quote:
        "Navigating GPU availability shouldn't require manual spreadsheet calculations across 10 cloud providers.",
      content:
        "Building scalable AI infrastructure presents a crucial trade-off: direct CapEx hardware procurement vs. dynamic cloud spot rentals. CapEx provides data sovereignty and long-term amortized savings, but requires heavy upfront capital. Cloud spot providers offer burstable flexibility but suffer from rate volatility. GPU Scout aggregates live pricing across verified providers, calculating exact breakeven runtime hours so you can make informed CapEx vs. OpEx decisions.",
      highlights: [
        {
          label: "Spot Rate Aggregation",
          value: "Voltage Park, RunPod, Lambda, E2E",
        },
        {
          label: "Amortized TCO Engine",
          value: "Calculates breakeven hours automatically",
        },
      ],
    },
    {
      id: "act3",
      tag: "ACT III // PLATFORM ENGINEERING BENEFITS",
      title: "Purpose-Built for AI Infrastructure Teams",
      quote:
        "Accelerating compute decision-making from weeks of research to seconds of telemetry.",
      content:
        "Whether you are deploying high-volume production LLMs, managing secure R&D clusters, handling bursty training workloads, or prototyping local edge RAG systems, GPU Scout delivers verified telemetry feeds, TechPowerUp database metadata, TechSpot review meta, and interactive hardware comparison matrices in a unified workspace.",
      highlights: [
        {
          label: "Side-by-Side Comparison",
          value: "Compare up to 3 GPUs simultaneously",
        },
        {
          label: "Flash AI Assistant",
          value: "Interactive hardware query thinking partner",
        },
      ],
    },
  ];

  const current = chapters[activeChapter];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="modal-content-passionfroot"
        style={{
          maxWidth: 840,
          padding: 36,
          backgroundColor: "var(--color-paper-white)",
          borderRadius: "var(--radius-large-cards)",
        }}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <span
              className="pill-tag pill-tag-violet"
              style={{ marginBottom: 10 }}
            >
              ✦ GPU SCOUT STORY & PURPOSE
            </span>
            <h2
              style={{
                fontFamily: "var(--font-new-kansas)",
                fontSize: 34,
                fontWeight: 400,
                color: "var(--color-ink-black)",
                margin: "6px 0 4px 0",
              }}
            >
              The Story of GPU Scout
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--color-charcoal-stone)",
                maxWidth: 560,
              }}
            >
              An editorial guide to understanding platform scaling, memory
              bottlenecks, and GPU economics.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-ash-gray)",
              fontSize: 24,
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Chapter Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            borderBottom: "1px solid var(--color-sand-gray)",
            paddingBottom: 12,
          }}
        >
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapter(idx)}
              className={
                activeChapter === idx
                  ? "btn-filled-dark"
                  : "btn-outlined-violet"
              }
              style={{ height: 36, fontSize: 13, padding: "0 16px" }}
            >
              {`Act ${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Story Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ marginBottom: 28 }}
          >
            <span
              className="caption-text"
              style={{
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 6,
              }}
            >
              {current.tag}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-new-kansas)",
                fontSize: 24,
                fontWeight: 400,
                color: "var(--color-ink-black)",
                marginBottom: 12,
              }}
            >
              {current.title}
            </h3>

            <div
              style={{
                backgroundColor: "var(--color-parchment-cream)",
                borderLeft: "4px solid var(--color-electric-violet)",
                padding: "14px 18px",
                borderRadius: "0 10px 10px 0",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: 14,
                  color: "var(--color-ink-black)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                "{current.quote}"
              </p>
            </div>

            <p
              style={{
                fontSize: 15,
                color: "var(--color-charcoal-stone)",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              {current.content}
            </p>

            <div className="grid-2col" style={{ gap: 14 }}>
              {current.highlights.map((h, i) => (
                <div
                  key={i}
                  className="card-paper-white"
                  style={{
                    padding: 14,
                    backgroundColor: "var(--color-parchment-cream)",
                  }}
                >
                  <div className="caption-text" style={{ fontSize: 11 }}>
                    {h.label}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--color-ink-black)",
                      marginTop: 2,
                    }}
                  >
                    {h.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--color-sand-gray)",
            paddingTop: 20,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--color-ash-gray)" }}>
            Chapter {activeChapter + 1} of {chapters.length}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn-outlined-violet"
              onClick={onClose}
              style={{ height: 40, fontSize: 13 }}
            >
              Close Story
            </button>
            <button
              className="btn-filled-dark"
              onClick={() => {
                onClose();
                if (onExplorePlatform) onExplorePlatform();
              }}
              style={{ height: 40, padding: "0 22px", fontSize: 13 }}
            >
              Explore Full Platform Below ↓
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
