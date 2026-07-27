import { useState } from "react";

export default function CloudTable({ cloudData, onSelectCard }) {
  const [tier, setTier] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unit, setUnit] = useState("hr");
  const [sortBy, setSortBy] = useState("default");

  const items = cloudData?.items || [];
  const stats = cloudData?.stats || {
    cheapestH100Rate: 1.99,
    cheapestH100Provider: "Voltage Park",
    providersCount: 22,
    gpuModelsCount: 29,
    livePricePointsCount: 221,
  };

  const formatRate = (usdVal, vramGb) => {
    if (usdVal === null || usdVal === undefined) return "–";
    let calculated = usdVal;
    if (unit === "day") calculated = usdVal * 24;
    if (unit === "mo") calculated = usdVal * 730;
    if (unit === "pergb") calculated = usdVal / (vramGb || 1);

    if (unit === "mo") return `$${calculated.toFixed(0)}`;
    if (unit === "pergb") return `$${calculated.toFixed(4)}`;
    return `$${calculated.toFixed(2)}`;
  };

  const filteredItems = items.filter((item) => {
    if (tier !== "all" && item.tier !== tier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesGpu = item.gpu.toLowerCase().includes(q);
      const matchesProvider = item.offers.some((o) =>
        o.provider.toLowerCase().includes(q),
      );
      if (!matchesGpu && !matchesProvider) return false;
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "price_asc")
      return (a.onDemandUsd || 999) - (b.onDemandUsd || 999);
    if (sortBy === "price_desc")
      return (b.onDemandUsd || 0) - (a.onDemandUsd || 0);
    if (sortBy === "spot_asc") return (a.spotUsd || 999) - (b.spotUsd || 999);
    if (sortBy === "vram_desc") return (b.vramGbMin || 0) - (a.vramGbMin || 0);
    return 0;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Metric Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <div className="card-paper-white" style={{ padding: "16px 20px" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "var(--font-nunito-sans)",
              color: "var(--color-ink-black)",
            }}
          >
            ${stats.cheapestH100Rate.toFixed(2)}/hr
          </div>
          <div className="caption-text" style={{ marginTop: 2 }}>
            Cheapest H100 · {stats.cheapestH100Provider}
          </div>
        </div>

        <div className="card-paper-white" style={{ padding: "16px 20px" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "var(--font-nunito-sans)",
              color: "var(--color-ink-black)",
            }}
          >
            {stats.providersCount}
          </div>
          <div className="caption-text" style={{ marginTop: 2 }}>
            Tracked Providers
          </div>
        </div>

        <div className="card-paper-white" style={{ padding: "16px 20px" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "var(--font-nunito-sans)",
              color: "var(--color-ink-black)",
            }}
          >
            {stats.gpuModelsCount}
          </div>
          <div className="caption-text" style={{ marginTop: 2 }}>
            GPU Architectures
          </div>
        </div>

        <div className="card-paper-white" style={{ padding: "16px 20px" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "var(--font-nunito-sans)",
              color: "var(--color-electric-violet)",
            }}
          >
            {stats.livePricePointsCount}
          </div>
          <div className="caption-text" style={{ marginTop: 2 }}>
            Live Spot Offers Today
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div
        className="card-paper-white"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", "datacenter", "workstation", "consumer"].map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={tier === t ? "btn-filled-dark" : "btn-outlined-violet"}
              style={{
                fontSize: 12,
                height: 32,
                padding: "0 12px",
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="search"
            placeholder="Search GPU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ai-prompt-input"
            style={{
              padding: "6px 12px",
              border: "1px solid var(--color-sand-gray)",
              borderRadius: "12px",
              width: "160px",
              fontSize: "13px",
              backgroundColor: "var(--color-parchment-cream)",
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              fontFamily: "var(--font-nunito-sans)",
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "12px",
              border: "1px solid var(--color-sand-gray)",
              backgroundColor: "var(--color-parchment-cream)",
              color: "var(--color-ink-black)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="default">Default Order</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="spot_asc">Spot Rate: Low → High</option>
            <option value="vram_desc">VRAM: High → Low</option>
          </select>
        </div>
      </div>

      {/* Cloud Table Surface */}
      <div
        className="card-paper-white"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--color-parchment-cream)",
                borderBottom: "1px solid var(--color-sand-gray)",
              }}
            >
              <th
                style={{
                  padding: "14px 16px",
                  color: "var(--color-charcoal-stone)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                GPU ARCHITECTURE
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  color: "var(--color-ash-gray)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                VRAM
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  color: "var(--color-ash-gray)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                ON-DEMAND ({unit.toUpperCase()})
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  color: "var(--color-ash-gray)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                SPOT FROM
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  color: "var(--color-ash-gray)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                PRIMARY PROVIDER
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  color: "var(--color-ash-gray)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                VERIFIED
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    color: "var(--color-ash-gray)",
                    padding: 32,
                  }}
                >
                  No cloud providers align with current query.
                </td>
              </tr>
            ) : (
              sortedItems.map((cp) => (
                <tr
                  key={cp._id}
                  onClick={() => onSelectCard(cp)}
                  style={{
                    borderBottom: "1px solid var(--color-sand-gray)",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-parchment-cream)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 600,
                      color: "var(--color-ink-black)",
                      fontSize: 15,
                    }}
                  >
                    {cp.gpu}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-charcoal-stone)",
                    }}
                  >
                    {cp.vram}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 600,
                      color: "var(--color-ink-black)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {formatRate(cp.onDemandUsd, cp.vramGbMin)}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 600,
                      color: "var(--color-forest-green)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {formatRate(cp.spotUsd, cp.vramGbMin)}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "var(--color-ink-black)",
                    }}
                  >
                    {cp.where}
                    {cp.offers.length > 1 && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 11,
                          color: "var(--color-ash-gray)",
                        }}
                      >
                        (+{cp.offers.length - 1} more)
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "var(--color-ash-gray)",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {cp.verifiedDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
