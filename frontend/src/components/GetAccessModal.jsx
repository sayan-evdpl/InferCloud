import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GetAccessModal({ isOpen, onClose }) {
  const [selectedTier, setSelectedTier] = useState("pro");
  const [workload, setWorkload] = useState("inference");
  const [email, setEmail] = useState("");
  const [gpusNeeded, setGpusNeeded] = useState("8");
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");
    setGeneratedKey(`gpuscout_sk_live_${randomHex}`);
  };

  const handleCopy = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          maxWidth: 760,
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
              ✦ ACCESS PORTAL & API KEYS
            </span>
            <h2
              style={{
                fontFamily: "var(--font-new-kansas)",
                fontSize: 32,
                fontWeight: 400,
                color: "var(--color-ink-black)",
                margin: "6px 0 6px 0",
              }}
            >
              Get Access to GPU Scout
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--color-charcoal-stone)",
                maxWidth: 520,
                lineHeight: 1.45,
              }}
            >
              Provision live telemetry feeds, real-time spot pricing APIs, and
              TCO breakeven models for your engineering team.
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

        {/* Generated Key Success State */}
        <AnimatePresence>
          {generatedKey ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "var(--color-parchment-cream)",
                border: "1px solid var(--color-sand-gray)",
                borderRadius: "var(--radius-cards)",
                padding: 24,
                marginBottom: 24,
              }}
            >
              <div
                className="pill-tag"
                style={{
                  backgroundColor: "var(--color-mint-wash)",
                  color: "var(--color-forest-green)",
                  border: "none",
                  marginBottom: 12,
                }}
              >
                ✓ API KEY GENERATED SUCCESSFULLY
              </div>
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-ink-black)",
                  marginBottom: 8,
                }}
              >
                Your Live API Token
              </h4>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-charcoal-stone)",
                  marginBottom: 14,
                }}
              >
                Keep this key secret. Use it in your Authorization header:{" "}
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  Bearer gpuscout_sk_live_...
                </code>
              </p>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="text"
                  readOnly
                  value={generatedKey}
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    padding: "10px 14px",
                    backgroundColor: "var(--color-paper-white)",
                    border: "1px solid var(--color-sand-gray)",
                    borderRadius: "10px",
                    color: "var(--color-ink-black)",
                  }}
                />
                <button
                  className="btn-filled-dark"
                  onClick={handleCopy}
                  style={{ height: "40px", fontSize: "13px" }}
                >
                  {copied ? "Copied! ✓" : "Copy key"}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Tier Selector Grid */}
        <div style={{ marginBottom: 24 }}>
          <label
            className="caption-text"
            style={{ fontWeight: 600, display: "block", marginBottom: 10 }}
          >
            SELECT ACCESS TIER
          </label>
          <div className="grid-3col" style={{ gap: 14 }}>
            {[
              {
                id: "free",
                title: "Developer",
                price: "Free",
                desc: "500 daily API calls & live telemetry",
              },
              {
                id: "pro",
                title: "Pro Analyst",
                price: "$49/mo",
                desc: "Unlimited spot APIs & TCO exports",
                popular: true,
              },
              {
                id: "enterprise",
                title: "Enterprise",
                price: "Custom",
                desc: "Dedicated clusters & SLA guarantees",
              },
            ].map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className="card-paper-white"
                style={{
                  padding: 16,
                  cursor: "pointer",
                  border:
                    selectedTier === tier.id
                      ? "2px solid var(--color-electric-violet)"
                      : "1px solid var(--color-sand-gray)",
                  backgroundColor:
                    selectedTier === tier.id
                      ? "var(--color-lilac-mist)"
                      : "var(--color-paper-white)",
                  position: "relative",
                }}
              >
                {tier.popular && (
                  <span
                    className="pill-tag pill-tag-violet"
                    style={{
                      fontSize: 10,
                      position: "absolute",
                      top: 10,
                      right: 10,
                      padding: "2px 8px",
                    }}
                  >
                    RECOMMENDED
                  </span>
                )}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--color-ink-black)",
                  }}
                >
                  {tier.title}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--color-electric-violet)",
                    margin: "4px 0",
                  }}
                >
                  {tier.price}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--color-charcoal-stone)" }}
                >
                  {tier.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label
              className="caption-text"
              style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
            >
              WORKLOAD INTENT
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { id: "inference", label: "LLM Inference" },
                { id: "qlora", label: "4-bit QLoRA Fine-Tuning" },
                { id: "multinode", label: "Distributed Multi-Node" },
                { id: "edge", label: "Edge RAG Prototyping" },
              ].map((w) => (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => setWorkload(w.id)}
                  className={
                    workload === w.id
                      ? "btn-filled-dark"
                      : "btn-outlined-violet"
                  }
                  style={{ height: 34, fontSize: 12, padding: "0 14px" }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div>
              <label
                className="caption-text"
                style={{ fontWeight: 600, display: "block", marginBottom: 6 }}
              >
                WORK EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ai-prompt-input"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--color-sand-gray)",
                  borderRadius: 12,
                  fontSize: 14,
                  backgroundColor: "var(--color-parchment-cream)",
                }}
              />
            </div>

            <div>
              <label
                className="caption-text"
                style={{ fontWeight: 600, display: "block", marginBottom: 6 }}
              >
                ESTIMATED GPUS NEEDED
              </label>
              <select
                value={gpusNeeded}
                onChange={(e) => setGpusNeeded(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--color-sand-gray)",
                  borderRadius: 12,
                  fontSize: 14,
                  backgroundColor: "var(--color-parchment-cream)",
                  color: "var(--color-ink-black)",
                  outline: "none",
                }}
              >
                <option value="1">1 - 4 GPUs</option>
                <option value="8">8 - 32 GPUs (Node Cluster)</option>
                <option value="64">64+ GPUs (Datacenter Scale)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              className="btn-outlined-violet"
              onClick={onClose}
              style={{ height: 42 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-filled-dark"
              style={{ height: 42, padding: "0 24px" }}
            >
              Request Instant API Key →
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
