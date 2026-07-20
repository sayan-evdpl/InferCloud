import { motion } from "framer-motion";

export default function SystemCard({ system, index }) {
  return (
    <motion.div
      className="system-card"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{
        border: "1px solid var(--colors-hairline)",
        background: "var(--colors-canvas)",
        paddingLeft: 40, // Room for compare checkbox
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div className="system-icon" style={{ borderColor: "var(--colors-hairline)", color: "var(--colors-primary)" }}>{system.icon}</div>
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 500, fontFamily: "var(--font-display)", color: "var(--colors-ink)" }}>{system.type}</h4>
          <div style={{ fontSize: 13, color: "var(--colors-primary)", fontWeight: 500, marginTop: 3 }}>{system.gpu}</div>
        </div>
      </div>

      <div style={{ flex: 1, marginBottom: 16 }}>
        <div style={{ borderLeft: "2px solid var(--colors-primary)", paddingLeft: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginBottom: 4 }}>Specs</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{system.specs}</div>
        </div>
        <div style={{ borderLeft: "2px solid var(--colors-primary)", paddingLeft: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginBottom: 4 }}>Price Range</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--colors-ink)" }}>{system.price}</div>
        </div>
      </div>

      <div className="constraint-box" style={{ background: "rgba(244, 63, 94, 0.04)", border: "1px solid rgba(244, 63, 94, 0.12)", color: "var(--colors-error)" }}>
        <strong style={{ display: "block", marginBottom: 4 }}>Constraint:</strong>
        {system.limit}
      </div>
    </motion.div>
  );
}
