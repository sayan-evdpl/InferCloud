import { motion } from "framer-motion";

const directives = [
  {
    number: "1",
    title: "High-Volume, Memory-Bound Prod",
    description: "For orchestrating models >70B parameters, RTX silicon fails due to 32GB ceilings and lack of NVLink. Employ E2E Networks' H200 Spot instances at ₹88/hr. The 141GB HBM3e handles KV cache expansion at a fraction of hyperscaler costs.",
    cardClass: "card-paper-white",
  },
  {
    number: "2",
    title: "Secure, CapEx-Heavy R&D",
    description: "For strict data governance workloads exceeding 8 hours/day, build a Custom Local Workstation (1x RTX 5090). The 1.79 TB/s GDDR7 bandwidth enables 4-bit QLoRA while keeping IP off external networks. High ROI after 1.5 years.",
    cardClass: "card-paper-white",
  },
  {
    number: "3",
    title: "Bursty, Variable Workloads",
    description: "Eliminate wasted compute cycles for API endpoints with erratic traffic. Utilize RunPod's Serverless architecture. Scale to zero when idle and pay strictly for millisecond execution time.",
    cardClass: "card-paper-white",
  },
  {
    number: "4",
    title: "Nomadic Compute (Edge)",
    description: "The RTX 5090 Laptop GPU (24GB) is exceptional for lightweight RAG testing, but ensure the OEM supports the full 175W TGP. Treat these strictly as edge nodes; they cannot replace 575W desktops for multi-day sustained training.",
    cardClass: "card-paper-white",
  },
];

export default function StrategicDirectives() {
  return (
    <section id="directives" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ marginBottom: "40px" }}>
          <span className="pill-tag pill-tag-violet" style={{ marginBottom: "12px" }}>
            ✦ PLATFORM ENGINEERING GUIDANCE
          </span>
          <h2 className="heading-lg" style={{ color: "var(--color-ink-black)", marginTop: "6px", marginBottom: "8px" }}>
            Strategic Directives
          </h2>
          <p className="subheading" style={{ maxWidth: "600px" }}>
            Actionable recommendations for platform engineering teams based on workload profiles.
          </p>
        </div>

        <div className="grid-2col" style={{ gap: "20px" }}>
          {directives.map((d, i) => (
            <motion.div
              key={d.number}
              className={d.cardClass}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              style={{ padding: "24px" }}
            >
              <div className="pill-tag pill-tag-violet" style={{ marginBottom: "10px" }}>
                DIRECTIVE {d.number}
              </div>
              <h4 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-nunito-sans)", color: "var(--color-ink-black)", marginBottom: "10px" }}>
                {d.title}
              </h4>
              <p style={{ fontSize: "15px", color: "var(--color-charcoal-stone)", lineHeight: 1.5 }}>
                {d.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
