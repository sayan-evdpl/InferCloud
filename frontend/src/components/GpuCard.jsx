import { motion } from "framer-motion";

const getArchBadgeClass = (arch) => {
  if (arch.includes("Blackwell")) return "badge-rose";
  if (arch.includes("Hopper")) return "badge-cyan";
  return "badge-slate";
};

export default function GpuCard({ gpu, index }) {
  const badgeClass = getArchBadgeClass(gpu.arch);

  return (
    <motion.div
      className="gpu-card"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{ paddingLeft: 40 }} // Room for compare checkbox
    >
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <span className={`badge ${badgeClass}`}>{gpu.gpuClass}</span>
          {gpu.features?.ecc && <span className="badge badge-slate">ECC</span>}
          {gpu.features?.nvlink && <span className="badge badge-slate">NVLink</span>}
        </div>

        <h4 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4, fontFamily: "var(--font-display)" }}>{gpu.name}</h4>
        <p style={{ fontSize: 12, color: "var(--colors-muted)", fontFamily: "var(--font-mono)", marginBottom: 20 }}>{gpu.arch}</p>

        <div>
          <div className="spec-row">
            <span className="spec-label">Memory</span>
            <span className="spec-value">{gpu.vram}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Bandwidth</span>
            <span className="spec-value" style={{ color: "var(--colors-primary)" }}>{gpu.bandwidth}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Power (TGP)</span>
            <span className="spec-value" style={{ color: "var(--colors-accent-amber)", display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd"/>
              </svg>
              {gpu.tgp}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--colors-hairline-soft)" }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginBottom: 4 }}>
          India Pricing Est.
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-sans)", color: "var(--colors-ink)" }}>{gpu.price}</div>
      </div>
    </motion.div>
  );
}
