import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection({ onSearchOpen }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".badge-entrance", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(".title-entrance", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .fromTo(".desc-entrance", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(".cta-entrance", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(".panel-entrance", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.8");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="hero" style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden", background: "var(--colors-canvas)", borderBottom: "1px solid var(--colors-hairline)" }}>
      <div className="section-container" style={{ width: "100%" }}>
        <div className="responsive-hero-grid">
          
          <div>
            <div className="badge-entrance" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              {/* Anthropic style radial-spike symbol */}
              <svg width="14" height="14" viewBox="0 0 100 100" fill="var(--colors-primary)">
                <path d="M 50 0 L 50 100 M 0 50 L 100 50 M 15 15 L 85 85 M 15 85 L 85 15" stroke="var(--colors-primary)" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <span className="badge badge-rose" style={{ fontSize: 11, fontWeight: 600 }}>
                TELEMETRY FEED // VERIFIED
              </span>
            </div>

            <h1
              className="title-entrance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(42px, 5.5vw, 68px)",
                fontWeight: "400",
                lineHeight: 1.05,
                color: "var(--colors-ink)",
                letterSpacing: "-1.5px",
                marginBottom: 28,
              }}
            >
              Meet your GPU <br />
              <span className="gradient-text">thinking partner</span>.
            </h1>

            <p
              className="desc-entrance"
              style={{
                fontSize: 18,
                color: "var(--colors-body)",
                lineHeight: 1.6,
                marginBottom: 40,
                maxWidth: 540,
              }}
            >
              Silicons represent the core unit of platform scaling. Compare memory bandwidth, hardware breakevens, and live cloud spot pricing across Hopper and Blackwell architectures.
            </p>

            <div className="cta-entrance" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <button
                className="button-primary"
                onClick={onSearchOpen}
                style={{ height: 44, padding: "0 24px", fontSize: 14 }}
              >
                Search GPUs & Rates
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--colors-muted)" }}>
                <span className="kbd">⌘</span>
                <span className="kbd">K</span>
                <span style={{ fontSize: 13, fontFamily: "var(--font-sans)", fontWeight: 500 }}>Quick search</span>
              </div>
            </div>
          </div>

          <div
            id="telemetry-card"
            className="product-mockup-card-dark panel-entrance"
            style={{
              padding: 32,
              background: "var(--colors-surface-dark)",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--colors-on-dark-soft)", marginBottom: 4 }}>HARDWARE TELEMETRY</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--colors-on-dark)" }}>Current Deployments</div>
            </div>

            {[
              { label: "Local Physical Units", value: "06 GPUs", code: "LOCAL_SILICON" },
              { label: "Cloud Neo-Hosts", value: "06 Providers", code: "CLOUD_RE_LATEST" },
              { label: "Workstations & Systems", value: "04 Designs", code: "SYSTEMS_CONFIG" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--colors-on-dark)" }}>{stat.label}</div>
                  <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--colors-on-dark-soft)", marginTop: 2 }}>{stat.code}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, color: "var(--colors-primary)", marginLeft: "auto" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
