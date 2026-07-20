import { motion } from "framer-motion";

const directives = [
  {
    number: 1,
    title: "High-Volume, Memory-Bound Prod",
    description: "For orchestrating models >70B parameters, RTX silicon fails due to 32GB ceilings and lack of NVLink. Employ E2E Networks' H200 Spot instances at ₹88/hr. The 141GB HBM3e handles KV cache expansion at a fraction of hyperscaler costs.",
    color: "var(--colors-primary)",
    bg: "rgba(204, 120, 92, 0.1)",
  },
  {
    number: 2,
    title: "Secure, CapEx-Heavy R&D",
    description: "For strict data governance workloads exceeding 8 hours/day, build a Custom Local Workstation (1x RTX 5090). The 1.79 TB/s GDDR7 bandwidth enables 4-bit QLoRA while keeping IP off external networks. High ROI after 1.5 years.",
    color: "var(--colors-accent-teal)",
    bg: "rgba(93, 184, 166, 0.1)",
  },
  {
    number: 3,
    title: "Bursty, Variable Workloads",
    description: "Eliminate wasted compute cycles for API endpoints with erratic traffic. Utilize RunPod's Serverless architecture. Scale to zero when idle and pay strictly for millisecond execution time.",
    color: "var(--colors-accent-amber)",
    bg: "rgba(232, 165, 90, 0.1)",
  },
  {
    number: 4,
    title: "Nomadic Compute (Edge)",
    description: "The RTX 5090 Laptop GPU (24GB) is exceptional for lightweight RAG testing, but ensure the OEM supports the full 175W TGP. Treat these strictly as edge nodes; they cannot replace 575W desktops for multi-day sustained training.",
    color: "var(--colors-primary)",
    bg: "rgba(204, 120, 92, 0.1)",
  },
];

export default function StrategicDirectives() {
  return (
    <section id="directives" className="section-spacing" style={{ scrollMarginTop: 80, background: "var(--colors-canvas)" }}>
      <div className="section-container">
        <motion.div
          style={{ textAlign: "center", marginBottom: 48 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Strategic Directives</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Actionable recommendations for platform engineering teams based on workload profiles.
          </p>
        </motion.div>

        <div className="grid-2">
          {directives.map((d, i) => (
            <motion.div
              key={d.number}
              className="feature-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{
                border: "1px solid var(--colors-hairline)",
              }}
            >
              <div
                className="directive-number"
                style={{
                  background: d.bg,
                  color: d.color,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {d.number}
              </div>
              <h4 style={{ fontSize: 22, fontWeight: 500, fontFamily: "var(--font-display)", marginBottom: 12, color: "var(--colors-ink)" }}>{d.title}</h4>
              <p style={{ fontSize: 15, color: "var(--colors-body)", lineHeight: 1.6 }}>
                {d.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
