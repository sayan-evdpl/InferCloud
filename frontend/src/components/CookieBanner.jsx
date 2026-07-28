import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gpuscout_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("gpuscout_cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("gpuscout_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "16px",
        padding: "14px 20px",
        maxWidth: "340px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        animation: "gpuscoutSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @keyframes gpuscoutSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-saffron-spark)", letterSpacing: "0.35px", textTransform: "uppercase" }}>
          GPU SCOUT TELEMETRY PREFERENCES
        </span>
        <button
          onClick={() => setVisible(false)}
          style={{ background: "transparent", border: "none", color: "var(--color-silver-mist)", cursor: "pointer", fontSize: "14px" }}
        >
          ✕
        </button>
      </div>

      <p style={{ fontFamily: "var(--font-ppneuemontreal)", fontSize: "13px", fontWeight: "200", color: "var(--color-bone-white)", lineHeight: 1.4, margin: 0 }}>
        Essential cookies enable hardware spot telemetry and node latency optimization.
      </p>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "2px" }}>
        <button
          className="button-violet-pill"
          onClick={handleAccept}
          style={{ padding: "6px 14px", fontSize: "11px" }}
        >
          ACCEPT
        </button>
        <button
          className="ghost-link"
          onClick={handleDecline}
          style={{ fontSize: "11px", padding: "4px 8px", color: "var(--color-bone-white)" }}
        >
          DECLINE
        </button>
      </div>
    </div>
  );
}
