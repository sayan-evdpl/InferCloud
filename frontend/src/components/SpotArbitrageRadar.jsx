import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpotBookingModal from "./SpotBookingModal";

const INITIAL_ARBITRAGE_DEALS = [
  {
    id: "h200-e2e-runpod",
    gpu: "NVIDIA H200 (141GB HBM3e)",
    highProvider: "Runpod / US-East",
    highRate: 4.39,
    lowProvider: "E2E Networks / India Region",
    lowRate: 1.05,
    savingsPct: 76,
    annualSavings: 29256,
    badge: "💡 TOP ARBITRAGE DEAL",
    category: "h200",
    region: "Asia-South (India)",
  },
  {
    id: "h100-vast-lambda",
    gpu: "NVIDIA H100 SXM5 (80GB)",
    highProvider: "Lambda Labs / US-West",
    highRate: 2.49,
    lowProvider: "Vast.ai / Community Spot",
    lowRate: 1.15,
    savingsPct: 54,
    annualSavings: 11738,
    badge: "⚡ 54% CHEAPER SPOT",
    category: "h100",
    region: "Global Distributed",
  },
  {
    id: "rtx5090-e2e-runpod",
    gpu: "NVIDIA RTX 5090 (32GB GDDR7)",
    highProvider: "Runpod / EU-Central",
    highRate: 1.89,
    lowProvider: "Voltage Park / US-West Datacenter",
    lowRate: 0.65,
    savingsPct: 65,
    annualSavings: 10862,
    badge: "🔥 BLACKWELL SPOT DEAL",
    category: "5090",
    region: "Voltage Park West",
  },
  {
    id: "l40s-aws-vast",
    gpu: "NVIDIA L40S (48GB Ada)",
    highProvider: "AWS g6e.2xlarge",
    highRate: 1.98,
    lowProvider: "Vast.ai Secure Cloud",
    lowRate: 0.72,
    savingsPct: 63,
    annualSavings: 11037,
    badge: "🌐 SECURE CLOUD ARBITRAGE",
    category: "l40s",
    region: "US-Central",
  },
  {
    id: "a100-coreweave-e2e",
    gpu: "NVIDIA A100 (80GB SXM4)",
    highProvider: "CoreWeave / US-East",
    highRate: 2.20,
    lowProvider: "Cyfuture / India Datacenter",
    lowRate: 0.95,
    savingsPct: 57,
    annualSavings: 10950,
    badge: "🚀 HIGH VRAM ARBITRAGE",
    category: "h100",
    region: "India West",
  },
];

export default function SpotArbitrageRadar({ onRatesOpen }) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [dealsList, setDealsList] = useState(INITIAL_ARBITRAGE_DEALS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState("Just now");

  // Booking Modal State
  const [selectedDealForBooking, setSelectedDealForBooking] = useState(null);

  // Custom Pair Modal State
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customGpu, setCustomGpu] = useState("NVIDIA H200 (141GB)");
  const [customHighProv, setCustomHighProv] = useState("AWS / US-East");
  const [customHighRate, setCustomHighRate] = useState(4.80);
  const [customLowProv, setCustomLowProv] = useState("Voltage Park / Spot");
  const [customLowRate, setCustomLowRate] = useState(1.10);

  // Live Refresh Handler
  const handleLiveRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate real-time price changes & updates
      setDealsList((prevDeals) =>
        prevDeals.map((d) => {
          const delta = (Math.random() * 0.1 - 0.05).toFixed(2);
          const newLow = Math.max(0.40, parseFloat((d.lowRate + parseFloat(delta)).toFixed(2)));
          const savingsPct = Math.round(((d.highRate - newLow) / d.highRate) * 100);
          return {
            ...d,
            lowRate: newLow,
            savingsPct: savingsPct,
            annualSavings: Math.round((d.highRate - newLow) * 24 * 365),
          };
        })
      );
      setIsRefreshing(false);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1200);
  };

  const handleAddCustomDeal = (e) => {
    e.preventDefault();
    const savingsPct = Math.round(((customHighRate - customLowRate) / customHighRate) * 100);
    const annualSavings = Math.round((customHighRate - customLowRate) * 24 * 365);
    const newDeal = {
      id: `custom-${Date.now()}`,
      gpu: customGpu,
      highProvider: customHighProv,
      highRate: customHighRate,
      lowProvider: customLowProv,
      lowRate: customLowRate,
      savingsPct: savingsPct,
      annualSavings: annualSavings,
      badge: "⭐ CUSTOM TRACKED PAIR",
      category: "all",
      region: "Custom User Region",
    };
    setDealsList([newDeal, ...dealsList]);
    setShowAddCustom(false);
  };

  const filteredDeals = dealsList.filter((d) => {
    if (filterCategory === "all") return true;
    return d.category === filterCategory;
  });

  return (
    <section id="arbitrage-radar" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className="pill-tag pill-tag-violet" style={{ marginBottom: "10px" }}>
                📉 Real-Time Cloud Spot Arbitrage & Savings Radar
              </span>
              <h2 className="heading-lg" style={{ color: "var(--color-ink-black)", marginTop: "4px", marginBottom: "6px" }}>
                Live Cloud GPU Price Arbitrage Radar
              </h2>
              <p className="subheading" style={{ maxWidth: "660px" }}>
                Continuously scans global cloud providers (Voltage Park, E2E Networks, Runpod, Vast.ai, Lambda Labs) to surface live price spreads up to 76% off standard cloud rates.
              </p>
            </div>

            {/* Live Refresh & Add Pair Controls */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={handleLiveRefresh}
                className="btn-outlined-violet"
                style={{
                  height: "36px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "var(--color-paper-white)",
                }}
              >
                <span style={{ display: "inline-block", transform: isRefreshing ? "rotate(360deg)" : "none", transition: "transform 0.8s ease" }}>
                  🔄
                </span>
                {isRefreshing ? "Scanning Cloud Rates..." : `Sync Live Rates (${lastSyncedTime})`}
              </button>

              <button
                onClick={() => setShowAddCustom(true)}
                className="btn-filled-dark"
                style={{
                  height: "36px",
                  padding: "0 14px",
                  fontSize: "12px",
                }}
              >
                + Track Custom Pair
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "24px", overflowX: "auto" }}>
          {[
            { id: "all", label: `ALL DEALS (${dealsList.length})` },
            { id: "h200", label: "H200 ULTRA" },
            { id: "h100", label: "H100 SXM" },
            { id: "5090", label: "RTX 5090" },
            { id: "l40s", label: "L40S" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id)}
              style={{
                height: "34px",
                padding: "0 14px",
                fontSize: "12px",
                fontWeight: filterCategory === f.id ? 700 : 500,
                border: "none",
                borderRadius: "8px",
                backgroundColor: filterCategory === f.id ? "var(--color-electric-violet)" : "var(--color-paper-white)",
                color: filterCategory === f.id ? "#ffffff" : "var(--color-ink-black)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Deals Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              style={{
                backgroundColor: "var(--color-paper-white)",
                borderRadius: "20px",
                padding: "24px",
                border: "1.5px solid rgba(178, 107, 245, 0.3)",
                boxShadow: "var(--shadow-subtle-2)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top Deal Badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 800,
                    fontFamily: "var(--font-mono)",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                  }}
                >
                  {deal.badge}
                </span>

                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-ash-gray)" }}>
                  📍 {deal.region}
                </span>
              </div>

              {/* GPU Name */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--color-ink-black)" }}>
                  {deal.gpu}
                </h3>
              </div>

              {/* Arbitrage Price Comparison Block */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  backgroundColor: "var(--color-parchment-cream)",
                  border: "1px solid var(--color-sand-gray)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {/* Standard / High Provider */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Standard Rate ({deal.highProvider}):</span>
                  <span style={{ textDecoration: "line-through", color: "#ef4444", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    ${deal.highRate.toFixed(2)}/hr
                  </span>
                </div>

                {/* Arbitrage Low Spot Provider */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", fontWeight: 800, color: "#10b981" }}>
                  <span>Regional Spot ({deal.lowProvider}):</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "16px" }}>
                    ${deal.lowRate.toFixed(2)}/hr
                  </span>
                </div>

                {/* Savings Callout */}
                <div style={{ borderTop: "1px dashed var(--color-sand-gray)", paddingTop: "8px", fontSize: "12px", fontWeight: 700, color: "var(--color-electric-violet)" }}>
                  💡 Save {deal.savingsPct}% (~${deal.annualSavings.toLocaleString()}/yr per node)
                </div>
              </div>

              {/* Claim Spot Rate Button - Triggers SpotBookingModal */}
              <button
                onClick={() => setSelectedDealForBooking(deal)}
                className="btn-filled-dark"
                style={{
                  width: "100%",
                  height: "40px",
                  fontSize: "12.5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "auto",
                }}
              >
                🚀 Claim Regional Spot Rate →
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Booking / Provisioning Modal */}
      <SpotBookingModal
        isOpen={!!selectedDealForBooking}
        onClose={() => setSelectedDealForBooking(null)}
        deal={selectedDealForBooking}
      />

      {/* Add Custom Pair Modal */}
      {showAddCustom && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowAddCustom(false)}
        >
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              borderRadius: "20px",
              maxWidth: "480px",
              width: "100%",
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              border: "1px solid var(--color-sand-gray)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--color-ink-black)" }}>
                Add Custom Arbitrage Pair
              </h3>
              <button onClick={() => setShowAddCustom(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddCustomDeal} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>GPU MODEL NAME</label>
                <input type="text" value={customGpu} onChange={(e) => setCustomGpu(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>HIGH HOST (Name)</label>
                  <input type="text" value={customHighProv} onChange={(e) => setCustomHighProv(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>HIGH RATE ($/hr)</label>
                  <input type="number" step="0.05" value={customHighRate} onChange={(e) => setCustomHighRate(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px", fontFamily: "var(--font-mono)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>LOW SPOT HOST</label>
                  <input type="text" value={customLowProv} onChange={(e) => setCustomLowProv(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>LOW RATE ($/hr)</label>
                  <input type="number" step="0.05" value={customLowRate} onChange={(e) => setCustomLowRate(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px", fontFamily: "var(--font-mono)" }} />
                </div>
              </div>

              <button type="submit" className="btn-filled-dark" style={{ height: "42px", marginTop: "10px", fontSize: "13.5px" }}>
                ➕ Start Tracking Arbitrage Pair
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
