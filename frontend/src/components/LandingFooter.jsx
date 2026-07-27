import React from "react";

export default function LandingFooter({ onExplorePlatform }) {
  return (
    <footer
      style={{
        backgroundColor: "#f0f4fe",
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(178, 107, 245, 0.09) 0%, transparent 70%),
          linear-gradient(180deg, #f0f4fe 0%, #ede6f5 100%)
        `,
        color: "var(--color-charcoal-stone)",
        padding: "56px 0 72px",
        textAlign: "center",
        borderTop: "1px solid rgba(178, 107, 245, 0.2)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="section-container">
        {/* Brand Badge (Choice 3 Logo) */}
        <img
          src="/logo_choice_3.png"
          alt="GPU Scout Logo"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            objectFit: "cover",
            boxShadow: "0 4px 16px rgba(178, 107, 245, 0.35)",
            marginBottom: "16px",
          }}
        />

        <h4
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--color-ink-black)",
            fontFamily: "var(--font-nunito-sans)",
            margin: "0 0 6px 0",
          }}
        >
          GPU Scout
        </h4>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-charcoal-stone)",
            maxWidth: 480,
            margin: "0 auto 24px auto",
            lineHeight: 1.5,
          }}
        >
          Managed AI infrastructure telemetry, memory bandwidth analysis, and
          real-time cloud spot rate intelligence.
        </p>

        {/* Prominent Explore Platform Button */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
          <button
            className="btn-filled-dark"
            onClick={onExplorePlatform}
            style={{
              height: "44px",
              padding: "0 28px",
              fontSize: "14px",
              borderRadius: "12px",
              boxShadow: "0 4px 14px rgba(29, 29, 28, 0.2)",
            }}
          >
            Explore Full Platform & Telemetry ↓
          </button>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 13,
            color: "var(--color-ash-gray)",
          }}
        >
          Powered by GPU Scout
        </div>
      </div>
    </footer>
  );
}
