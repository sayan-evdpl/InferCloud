import { useState } from "react";
import { motion } from "framer-motion";

export default function CloudTable({ cloudData, onSelectCard }) {
  const [tier, setTier] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [unit, setUnit] = useState("hr"); // "hr", "day", "mo", "pergb"

  const items = cloudData?.items || [];
  const stats = cloudData?.stats || {
    cheapestH100Rate: 1.99,
    cheapestH100Provider: "Voltage Park",
    providersCount: 22,
    gpuModelsCount: 29,
    livePricePointsCount: 221
  };
  const providersList = cloudData?.providersList || [];

  // Helper to format rate according to unit
  const formatRate = (usdVal, vramGb) => {
    if (usdVal === null || usdVal === undefined) return "–";
    let calculated = usdVal;
    if (unit === "day") {
      calculated = usdVal * 24;
      return `$${calculated.toFixed(2)}`;
    }
    if (unit === "mo") {
      calculated = usdVal * 730;
      return `$${calculated.toFixed(0)}`;
    }
    if (unit === "pergb") {
      calculated = usdVal / (vramGb || 1);
      return `$${calculated.toFixed(4)}`;
    }
    return `$${calculated.toFixed(2)}`;
  };

  // Filter items based on selected tier, provider, and search query
  const filteredItems = items.filter((item) => {
    // Tier filter
    if (tier !== "all" && item.tier !== tier) return false;

    // Provider filter
    if (selectedProvider) {
      const hasProvider = item.offers.some(
        (o) => o.provider.toLowerCase() === selectedProvider.toLowerCase()
      );
      if (!hasProvider) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesGpu = item.gpu.toLowerCase().includes(q);
      const matchesProvider = item.offers.some((o) => o.provider.toLowerCase().includes(q));
      if (!matchesGpu && !matchesProvider) return false;
    }

    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Statistics Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20
      }}>
        <div className="glass-panel" style={{ padding: "20px 24px", background: "var(--colors-surface-card)" }}>
          <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "var(--font-sans)", color: "var(--colors-primary)" }}>
            ${stats.cheapestH100Rate.toFixed(2)}/hr
          </div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginTop: 6, fontWeight: 600 }}>
            Cheapest H100 · {stats.cheapestH100Provider}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px 24px", background: "var(--colors-surface-card)" }}>
          <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "var(--font-sans)", color: "var(--colors-ink)" }}>
            {stats.providersCount}
          </div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginTop: 6, fontWeight: 600 }}>
            Providers Checked Daily
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px 24px", background: "var(--colors-surface-card)" }}>
          <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "var(--font-sans)", color: "var(--colors-ink)" }}>
            {stats.gpuModelsCount}
          </div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginTop: 6, fontWeight: 600 }}>
            GPU Models Tracked
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px 24px", background: "var(--colors-surface-card)" }}>
          <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "var(--font-sans)", color: "var(--colors-ink)" }}>
            {stats.livePricePointsCount}
          </div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginTop: 6, fontWeight: 600 }}>
            Live Price Points Today
          </div>
        </div>
      </div>

      {/* Real-time Filters Panel */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--colors-surface-soft)",
        padding: 16,
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--colors-hairline)"
      }}>
        {/* Tier Buttons */}
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "datacenter", "workstation", "consumer"].map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "capitalize",
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid",
                borderColor: tier === t ? "var(--colors-primary)" : "var(--colors-hairline)",
                background: tier === t ? "var(--colors-primary)" : "var(--colors-canvas)",
                color: tier === t ? "var(--colors-on-primary)" : "var(--colors-muted)",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Provider dropdown */}
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            padding: "6px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--colors-hairline)",
            background: "var(--colors-canvas)",
            color: "var(--colors-ink)",
            outline: "none",
            cursor: "pointer"
          }}
        >
          <option value="">All providers</option>
          {providersList.map((p) => (
            <option key={p} value={p.toLowerCase()}>{p}</option>
          ))}
        </select>

        {/* Search Field */}
        <input
          type="search"
          placeholder="Search GPU (h100, 4090...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            padding: "6px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--colors-hairline)",
            background: "var(--colors-canvas)",
            color: "var(--colors-ink)",
            outline: "none",
            width: "100%",
            maxWidth: "200px"
          }}
        />

        {/* Unit Toggles */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "hr", label: "$/hr" },
            { id: "day", label: "$/day" },
            { id: "mo", label: "$/mo" },
            { id: "pergb", label: "$/GB VRAM" }
          ].map((u) => (
            <button
              key={u.id}
              onClick={() => setUnit(u.id)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid",
                borderColor: unit === u.id ? "var(--colors-primary)" : "var(--colors-hairline)",
                background: unit === u.id ? "var(--colors-primary)" : "var(--colors-canvas)",
                color: unit === u.id ? "var(--colors-on-primary)" : "var(--colors-muted)",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="glass-panel" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="cloud-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ fontFamily: "var(--font-sans)" }}>GPU</th>
                <th style={{ fontFamily: "var(--font-sans)" }} className="num">VRAM</th>
                <th style={{ fontFamily: "var(--font-sans)" }} className="num">On-demand {unit === "hr" ? "$/hr" : unit === "day" ? "$/day" : unit === "mo" ? "$/mo" : "$/GB VRAM"}</th>
                <th style={{ fontFamily: "var(--font-sans)" }} className="num">Spot/community from</th>
                <th style={{ fontFamily: "var(--font-sans)" }}>Where</th>
                <th style={{ fontFamily: "var(--font-sans)" }}>Tier</th>
                <th style={{ fontFamily: "var(--font-sans)" }}>Verified</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--colors-muted)", padding: 40, fontFamily: "var(--font-sans)" }}>
                    No GPUs matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((cp, i) => (
                  <motion.tr
                    key={cp._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.2 }}
                    onClick={() => onSelectCard(cp)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <span style={{ fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 16, color: "var(--colors-ink)" }}>
                        {cp.gpu}
                      </span>
                    </td>
                    <td className="num">
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                        {cp.vram}
                      </span>
                    </td>
                    <td className="num">
                      <span style={{ fontWeight: 700, color: "var(--colors-ink)", fontSize: 14 }}>
                        {formatRate(cp.onDemandUsd, cp.vramGbMin)}
                      </span>
                    </td>
                    <td className="num">
                      <span style={{ color: "var(--colors-muted)", fontSize: 14 }}>
                        {formatRate(cp.spotUsd, cp.vramGbMin)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 500 }}>{cp.where}</span>
                        {cp.offers.length > 1 && (
                          <span style={{
                            marginLeft: 8,
                            fontSize: 10,
                            color: "var(--colors-primary)",
                            background: "rgba(204, 120, 92, 0.1)",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontWeight: 600
                          }}>
                            +{cp.offers.length - 1} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-slate`} style={{ textTransform: "capitalize" }}>
                        {cp.tier}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-rose" style={{ fontSize: 10 }}>
                        {cp.verifiedDate}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
