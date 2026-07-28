import React from "react";
import { motion } from "framer-motion";

export default function CompareModal({ items, onClose }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        className="modal-content-passionfroot"
        style={{ maxWidth: 960 }}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <span className="pill-tag pill-tag-violet" style={{ marginBottom: 6 }}>COMPARE MATRIX // {items.length} SELECTED</span>
            <h2 className="heading-sm" style={{ color: "var(--color-ink-black)", margin: 0, marginTop: 4 }}>
              Hardware Comparison Matrix
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-ash-gray)",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 16 }}>
          {items.map((item) => (
            <div
              key={item._id}
              className="card-paper-white"
              style={{ padding: "16px" }}
            >
              <span className="caption-text" style={{ marginBottom: 4, display: "block" }}>
                {item.category?.toUpperCase() || "HARDWARE"}
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-nunito-sans)", color: "var(--color-ink-black)", marginBottom: 2 }}>
                {item.name || item.type || item.provider}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--color-ash-gray)", marginBottom: 16 }}>
                {item.arch || item.gpu || "SYSTEM NODE"}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div className="caption-text">SPECIFICATIONS / VRAM</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink-black)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {item.vram || item.specs || "-"}
                  </div>
                </div>
                <div>
                  <div className="caption-text">BANDWIDTH</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-electric-violet)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {item.bandwidth || "-"}
                  </div>
                </div>
                <div>
                  <div className="caption-text">POWER (TGP)</div>
                  <div style={{ fontSize: 14, color: "var(--color-charcoal-stone)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {item.tgp || "-"}
                  </div>
                </div>
                <div>
                  <div className="caption-text">RATE / PRICE</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-ink-black)", marginTop: 2 }}>
                    {item.price || item.rate || "-"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <button className="btn-filled-dark" onClick={onClose} style={{ height: "38px", fontSize: "14px" }}>
            Close comparison
          </button>
        </div>
      </motion.div>
    </div>
  );
}
