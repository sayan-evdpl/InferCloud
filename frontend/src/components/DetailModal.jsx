import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getExternalSpecs } from "../api/gpuApi";

export default function DetailModal({ item, onClose }) {
  const [extSpecs, setExtSpecs] = useState(null);
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  useEffect(() => {
    if (!item) return;
    const gpuName = item.gpu || item.name || item.type;
    if (!gpuName) return;

    setLoadingSpecs(true);
    getExternalSpecs(gpuName)
      .then(setExtSpecs)
      .catch(() => {})
      .finally(() => setLoadingSpecs(false));
  }, [item]);

  if (!item) return null;

  const name = item.name || item.gpu || item.type || "Hardware Element";
  const arch = item.arch || "Silicon Architecture";
  const vram = item.vram || (item.vramGbMin ? `${item.vramGbMin} GB` : "24 GB");
  const bandwidth = item.bandwidth || "1.79 TB/s";
  const tgp = item.tgp || "575W";
  const price = item.price || (item.onDemandUsd ? `$${item.onDemandUsd.toFixed(2)}/hr` : "₹4.98L - ₹7.50L");

  // Dynamic or fallback metadata for TechPowerUp & TechSpot
  const processSize = extSpecs?.process || "4 nm / 5 nm";
  const transistors = extSpecs?.transistors || "76 Billion";
  const dieSize = extSpecs?.dieSize || "608 mm²";
  const shaders = extSpecs?.shaders || "16896 CUDA Cores";
  const memoryType = extSpecs?.memoryType || "HBM3e / GDDR7";
  const busWidth = extSpecs?.busWidth || "5120-bit";

  // Dynamic or fallback integration data
  const cloudRate = item.spotUsd ? `$${item.spotUsd.toFixed(2)}/hr` : "$4.39/hr (₹369/hr)";
  const breakevenHours = "12439 hours";
  const workstationPrice = "₹58.50 Lakhs";

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        className="modal-content-passionfroot"
        style={{
          maxWidth: 860,
          padding: 36,
          backgroundColor: "var(--color-paper-white)",
          borderRadius: "var(--radius-large-cards)",
          border: "1px solid var(--color-sand-gray)",
          boxShadow: "var(--shadow-subtle-3)",
        }}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Top Header Row with SILICON_DIE Blueprint Box */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative" }}>
          <div>
            <span className="pill-tag pill-tag-violet" style={{ marginBottom: 10 }}>
              ✦ {item.category?.toUpperCase() || "LOCAL_MODEL"}
            </span>

            <h2 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 34, fontWeight: 400, color: "var(--color-ink-black)", margin: "8px 0 4px 0" }}>
              {name}
            </h2>

            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--color-slate-warm)" }}>
              {arch}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            {/* Passionfroot SILICON_DIE Blueprint Diagram Box */}
            <div
              style={{
                width: 200,
                height: 100,
                border: "1.5px dashed var(--color-pale-violet)",
                borderRadius: "var(--radius-cards)",
                backgroundColor: "var(--color-lilac-mist)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "2px solid var(--color-electric-violet)",
                  backgroundColor: "var(--color-paper-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(178, 107, 245, 0.25)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--color-deep-violet)", letterSpacing: "0.05em" }}>
                  SILICON_DIE
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-ash-gray)",
                fontSize: 22,
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Core Specs Table Rows */}
        <div style={{ borderTop: "1px solid var(--color-sand-gray)", borderBottom: "1px solid var(--color-sand-gray)", padding: "16px 0", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
            <span style={{ color: "var(--color-charcoal-stone)" }}>Capacity</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-ink-black)" }}>{vram}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
            <span style={{ color: "var(--color-charcoal-stone)" }}>Bandwidth</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-electric-violet)" }}>{bandwidth}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
            <span style={{ color: "var(--color-charcoal-stone)" }}>Power (TGP)</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>{tgp}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
            <span style={{ color: "var(--color-charcoal-stone)" }}>Valuation</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-tangerine)" }}>{price}</span>
          </div>
        </div>

        {/* Integration Comparison Section */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 24, fontWeight: 400, color: "var(--color-ink-black)", marginBottom: 16 }}>
            Integration Comparison
          </h3>

          <div className="grid-2col" style={{ gap: 16 }}>
            <div className="card-paper-white" style={{ padding: 20 }}>
              <span className="caption-text" style={{ letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>CLOUD ALTERNATIVE</span>
              <h4 style={{ fontFamily: "var(--font-nunito-sans)", fontSize: 18, fontWeight: 700, color: "var(--color-ink-black)", marginBottom: 8 }}>
                Cloud Rental Equivalent
              </h4>
              <p style={{ fontSize: 14, color: "var(--color-charcoal-stone)", lineHeight: 1.5 }}>
                Available at ~{cloudRate}. Breakeven point reached after <strong style={{ fontWeight: 700, color: "var(--color-ink-black)" }}>{breakevenHours}</strong> of execution compared to direct CapEx.
              </p>
            </div>

            <div className="card-paper-white" style={{ padding: 20 }}>
              <span className="caption-text" style={{ letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>EDGE WORKSTATION</span>
              <h4 style={{ fontFamily: "var(--font-nunito-sans)", fontSize: 18, fontWeight: 700, color: "var(--color-ink-black)", marginBottom: 8 }}>
                Workstation Config
              </h4>
              <p style={{ fontSize: 14, color: "var(--color-charcoal-stone)", lineHeight: 1.5 }}>
                Can be integrated into a Custom AI Workstation starting from <strong style={{ fontWeight: 700, color: "var(--color-ink-black)" }}>{workstationPrice}</strong> with dedicated cooling.
              </p>
            </div>
          </div>
        </div>

        {/* TechPowerUp Specs & TechSpot Meta Section */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 24, fontWeight: 400, color: "var(--color-ink-black)", marginBottom: 16 }}>
            TechPowerUp Specs & TechSpot Meta
          </h3>

          <div className="grid-2col" style={{ gap: 16 }}>
            {/* TechPowerUp Database Card */}
            <div className="card-paper-white" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="caption-text" style={{ letterSpacing: "0.05em" }}>DATABASE // TECHPOWERUP</span>
                <span className="pill-tag pill-tag-violet" style={{ fontSize: 11 }}>2023/2024</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Process Size</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{processSize}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Transistors</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{transistors}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Die Size</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{dieSize}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Shaders</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{shaders}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Memory Type</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{memoryType}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Bus Width</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{busWidth}</span>
                </div>
              </div>
            </div>

            {/* TechSpot Review Meta Card */}
            <div className="card-paper-white" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span className="caption-text" style={{ letterSpacing: "0.05em" }}>REVIEWS // TECHSPOT</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-tangerine)" }}>9.5/10 Rating</span>
                </div>

                <p style={{ fontStyle: "italic", fontSize: 14, color: "var(--color-charcoal-stone)", lineHeight: 1.5, marginBottom: 16 }}>
                  "Enterprise datacenter accelerator built specifically for transformer pipelines."
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-parchment-cream)", padding: 12, borderRadius: "10px", border: "1px solid var(--color-sand-gray)", fontSize: 13 }}>
                <div style={{ marginBottom: 4 }}>
                  <strong style={{ color: "var(--color-forest-green)", fontWeight: 700 }}>PROS // </strong>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Massive HBM bandwidth, high scalability.</span>
                </div>
                <div>
                  <strong style={{ color: "var(--color-coral-red)", fontWeight: 700 }}>CONS // </strong>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>High rental cost, complex infrastructure required.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Row */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <button className="btn-filled-dark" onClick={onClose} style={{ height: "42px", padding: "0 22px", fontSize: "14px", borderRadius: "12px" }}>
            Close specification
          </button>
        </div>
      </motion.div>
    </div>
  );
}
