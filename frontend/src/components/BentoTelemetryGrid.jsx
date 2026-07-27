export default function BentoTelemetryGrid() {
  return (
    <div style={{ margin: "64px 0" }}>
      {/* Section Header */}
      <div style={{ marginBottom: "36px" }}>
        <span
          className="pill-tag pill-tag-violet"
          style={{ marginBottom: "12px" }}
        >
          ✦ HARDWARE TELEMETRY
        </span>
        <h3
          className="heading-lg"
          style={{
            color: "var(--color-ink-black)",
            marginTop: "8px",
            marginBottom: "8px",
          }}
        >
          Current Deployments
        </h3>
      </div>

      {/* Rainbow Accent Card Rotation Grid */}
      <div className="grid-3col">
        {/* Card 1: Electric Violet Accent Card */}
        <div
          className="card-accent-violet"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "200px",
          }}
        >
          <div>
            <span
              className="pill-tag"
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                color: "var(--color-ink-black)",
                border: "none",
                marginBottom: "12px",
              }}
            >
              LOCAL_SILICON
            </span>
            <h4
              style={{
                fontFamily: "var(--font-nunito-sans)",
                fontSize: "22px",
                fontWeight: "700",
                color: "var(--color-ink-black)",
                marginBottom: "6px",
              }}
            >
              Local Physical Units
            </h4>
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              fontFamily: "var(--font-nunito-sans)",
              color: "var(--color-ink-black)",
              letterSpacing: "-0.5px",
            }}
          >
            06 GPUs
          </div>
        </div>

        {/* Card 2: Aqua Teal Accent Card */}
        <div
          className="card-accent-teal"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "200px",
          }}
        >
          <div>
            <span
              className="pill-tag"
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                color: "var(--color-ink-black)",
                border: "none",
                marginBottom: "12px",
              }}
            >
              CLOUD_RE_LATEST
            </span>
            <h4
              style={{
                fontFamily: "var(--font-nunito-sans)",
                fontSize: "22px",
                fontWeight: "700",
                color: "var(--color-ink-black)",
                marginBottom: "6px",
              }}
            >
              Cloud Neo-Hosts
            </h4>
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              fontFamily: "var(--font-nunito-sans)",
              color: "var(--color-ink-black)",
              letterSpacing: "-0.5px",
            }}
          >
            06 Providers
          </div>
        </div>

        {/* Card 3: Tangerine Accent Card */}
        <div
          className="card-accent-tangerine"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "200px",
          }}
        >
          <div>
            <span
              className="pill-tag"
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                color: "var(--color-ink-black)",
                border: "none",
                marginBottom: "12px",
              }}
            >
              SYSTEMS_CONFIG
            </span>
            <h4
              style={{
                fontFamily: "var(--font-nunito-sans)",
                fontSize: "22px",
                fontWeight: "700",
                color: "var(--color-ink-black)",
                marginBottom: "6px",
              }}
            >
              Workstations & Systems
            </h4>
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              fontFamily: "var(--font-nunito-sans)",
              color: "var(--color-ink-black)",
              letterSpacing: "-0.5px",
            }}
          >
            04 Designs
          </div>
        </div>
      </div>
    </div>
  );
}
