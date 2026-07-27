import { motion } from "framer-motion";

export default function SystemCard({ system, index }) {
  return (
    <motion.div
      className="card-paper-white"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        padding: "20px",
        position: "relative",
      }}
    >
      <div
        className="pill-tag pill-tag-violet"
        style={{ marginBottom: "10px" }}
      >
        {system.icon || "WORKSTATION"}
      </div>

      <h4
        style={{
          fontSize: "20px",
          fontWeight: "700",
          fontFamily: "var(--font-nunito-sans)",
          color: "var(--color-ink-black)",
          lineHeight: "1.25",
          marginBottom: "4px",
        }}
      >
        {system.type}
      </h4>
      <div
        style={{
          fontSize: "14px",
          color: "var(--color-ash-gray)",
          fontWeight: "500",
          marginBottom: "12px",
        }}
      >
        {system.gpu}
      </div>

      <div style={{ margin: "12px 0" }}>
        <div
          style={{
            padding: "6px 0",
            borderBottom: "1px solid var(--color-sand-gray)",
          }}
        >
          <div className="caption-text" style={{ marginBottom: "2px" }}>
            Specifications
          </div>
          <div style={{ fontSize: "14px", color: "var(--color-ink-black)" }}>
            {system.specs}
          </div>
        </div>

        <div style={{ padding: "6px 0" }}>
          <div className="caption-text" style={{ marginBottom: "2px" }}>
            Investment
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "var(--color-ink-black)",
            }}
          >
            {system.price}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "12px",
          padding: "10px 12px",
          backgroundColor: "var(--color-parchment-cream)",
          borderRadius: "8px",
          color: "var(--color-charcoal-stone)",
          fontSize: "12px",
        }}
      >
        <strong
          style={{
            fontWeight: 600,
            color: "var(--color-ink-black)",
            marginRight: "4px",
          }}
        >
          Note:
        </strong>
        {system.limit}
      </div>
    </motion.div>
  );
}
