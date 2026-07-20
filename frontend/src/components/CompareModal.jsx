import React from "react";
import { motion } from "framer-motion";

export default function CompareModal({ items, onClose }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="detail-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ background: "rgba(20,20,19,0.4)" }}>
      <motion.div
        className="detail-modal-content"
        style={{
          maxWidth: 900,
          background: "var(--colors-canvas)",
          border: "1px solid var(--colors-hairline)",
        }}
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button className="detail-modal-close" onClick={onClose} style={{ color: "var(--colors-muted)" }}>✕</button>
        
        <div style={{ padding: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 500, fontFamily: "var(--font-display)", color: "var(--colors-ink)", marginBottom: 24 }}>
            Silicon Comparison Grid ({items.length}/3)
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 20 }}>
            {items.map((item) => (
              <div key={item._id} className="glass-panel" style={{ padding: 24, background: "var(--colors-surface-card)", border: "1px solid var(--colors-hairline)", borderRadius: 12 }}>
                <span className="badge badge-rose" style={{ marginBottom: 12 }}>{item.category.toUpperCase()}</span>
                <h3 style={{ fontSize: 20, fontWeight: 500, fontFamily: "var(--font-display)", color: "var(--colors-ink)", marginBottom: 4 }}>{item.name || item.type || item.provider}</h3>
                <p style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-mono)", marginBottom: 20 }}>
                  {item.arch || item.gpu || "SYSTEM NODE"}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ borderBottom: "1px solid var(--colors-hairline-soft)", paddingBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>SPECIFICATIONS</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--colors-ink)", marginTop: 2 }}>{item.vram || item.specs || "-"}</div>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--colors-hairline-soft)", paddingBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>BANDWIDTH</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--colors-primary)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{item.bandwidth || "-"}</div>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--colors-hairline-soft)", paddingBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>POWER / TGP</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--colors-accent-amber)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{item.tgp || "-"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>PRICING</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--colors-ink)", marginTop: 2 }}>{item.price || item.rate || "-"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
