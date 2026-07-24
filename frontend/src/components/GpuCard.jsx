import { motion } from "framer-motion";

export default function GpuCard({ gpu, index }) {
  return (
    <motion.div
      className="card-paper-white"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      style={{
        padding: "20px",
        position: "relative",
      }}
    >
      <div>
        <div className="pill-tag pill-tag-violet" style={{ marginBottom: "10px" }}>
          {gpu.gpuClass} · {gpu.arch}
        </div>

        <h4
          style={{
            fontSize: "20px",
            fontWeight: "700",
            fontFamily: "var(--font-nunito-sans)",
            color: "var(--color-ink-black)",
            lineHeight: "1.25",
            marginBottom: "12px",
          }}
        >
          {gpu.name}
        </h4>

        <div style={{ margin: "12px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "14px", borderBottom: "1px solid var(--color-sand-gray)" }}>
            <span style={{ color: "var(--color-ash-gray)" }}>VRAM</span>
            <span style={{ color: "var(--color-ink-black)", fontWeight: "600", fontFamily: "var(--font-mono)" }}>{gpu.vram}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "14px", borderBottom: "1px solid var(--color-sand-gray)" }}>
            <span style={{ color: "var(--color-ash-gray)" }}>Bandwidth</span>
            <span style={{ color: "var(--color-deep-violet)", fontWeight: "600", fontFamily: "var(--font-mono)" }}>{gpu.bandwidth}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "14px" }}>
            <span style={{ color: "var(--color-ash-gray)" }}>Power (TGP)</span>
            <span style={{ color: "var(--color-charcoal-stone)", fontFamily: "var(--font-mono)" }}>{gpu.tgp}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--color-sand-gray)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="caption-text">MSRP / Market</span>
        <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--color-ink-black)" }}>
          {gpu.price}
        </span>
      </div>
    </motion.div>
  );
}
