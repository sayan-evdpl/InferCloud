import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const [counter, setCounter] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Check if loaded in this session
    const hasLoaded = sessionStorage.getItem("gpuscout_preloaded");
    if (hasLoaded) {
      setRemoved(true);
      return;
    }

    const duration = 1600; // 1.6 seconds smooth intro
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setCounter(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setFadeOut(true), 150);
        setTimeout(() => {
          setRemoved(true);
          sessionStorage.setItem("gpuscout_preloaded", "true");
        }, 750);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  if (removed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 64px",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      {/* Top Lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <polygon points="50,10 90,85 10,85" fill="#8052ff" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-ppneuemontreal)",
            fontSize: "18px",
            fontWeight: "400",
            color: "var(--color-bone-white)",
            letterSpacing: "-0.5px",
          }}
        >
          GPU Scout{" "}
          <span
            style={{ color: "var(--color-silver-mist)", fontWeight: "200" }}
          >
            / InferCloud
          </span>
        </span>
      </div>

      {/* Center 4 Rotating Square Dots & Counter */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: "repeat(2, 14px)",
            gap: "8px",
            marginBottom: "32px",
            animation: "gpuscoutPreloaderSpin 3s linear infinite",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#8052ff",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#ffb829",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#15846e",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#e056fd",
              borderRadius: 2,
            }}
          />
        </div>

        <style>{`
          @keyframes gpuscoutPreloaderSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        <div
          style={{
            fontFamily: "var(--font-ppneuemontreal)",
            fontSize: "clamp(64px, 10vw, 112px)",
            fontWeight: "400",
            color: "var(--color-bone-white)",
            letterSpacing: "-4px",
            lineHeight: 1,
          }}
        >
          {counter}
        </div>
      </div>

      {/* Bottom Statement */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-ppneuemontreal)",
            fontSize: "16px",
            fontWeight: "200",
            color: "var(--color-silver-mist)",
            margin: 0,
            maxWidth: "420px",
            lineHeight: 1.4,
          }}
        >
          Initializing GPU Scout Telemetry Engine... Calibrating Blackwell &
          Hopper spot rates.
        </p>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--color-saffron-spark)",
            letterSpacing: "1px",
          }}
        >
          SYSTEM STATUS // ONLINE
        </span>
      </div>
    </div>
  );
}
