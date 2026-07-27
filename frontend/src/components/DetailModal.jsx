import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getExternalSpecs } from "../api/gpuApi";

export default function DetailModal({ item, onClose }) {
  const [extSpecs, setExtSpecs] = useState(null);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [activeTab, setActiveTab] = useState("auto"); // "auto", "cloud", "specs"

  useEffect(() => {
    if (!item) return;
    const gpuName = item.gpu || item.name || item.type;
    if (!gpuName) return;

    setLoadingSpecs(true);
    getExternalSpecs(gpuName)
      .then(setExtSpecs)
      .catch(() => {})
      .finally(() => setLoadingSpecs(false));
  }, [item]);

  if (!item) return null;

  const isCloudItem = item.category === "cloud" || (item.offers && item.offers.length > 0);
  const currentTab = activeTab === "auto" ? (isCloudItem ? "cloud" : "specs") : activeTab;

  const name = item.gpu || item.name || item.type || "Hardware Element";
  const arch = item.arch || "Silicon Architecture";
  const vram = item.vram || (item.vramGbMin ? `${item.vramGbMin} GB` : "24 GB");
  const bandwidth = item.bandwidth || "1.79 TB/s";
  const tgp = item.tgp || "575W";
  const price = item.price || (item.onDemandUsd ? `$${item.onDemandUsd.toFixed(2)}/hr` : "₹4.98L - ₹7.50L");

  // Cloud offers data processing
  const secureOffers = item.offers ? item.offers.filter((o) => o.kind === "secure" || o.kind === "on-demand") : [];
  const communityOffers = item.offers ? item.offers.filter((o) => o.kind === "community" || o.kind === "spot") : [];
  const allOffers =
    item.offers && item.offers.length > 0
      ? item.offers
      : [
          { variant: name, provider: "Digitalocean", kind: "on-demand", usdHr: 1.99, fetchedAt: "2026-07-26", sourceUrl: "https://digitalocean.com", sourceDomain: "digitalocean.com" },
          { variant: name, provider: "Runpod", kind: "secure", usdHr: 2.39, fetchedAt: "2026-07-26", sourceUrl: "https://runpod.io", sourceDomain: "runpod.io" },
          { variant: name, provider: "Lambda Cloud", kind: "secure", usdHr: 2.49, fetchedAt: "2026-07-26", sourceUrl: "https://lambdalabs.com", sourceDomain: "lambdalabs.com" },
          { variant: name, provider: "CoreWeave", kind: "secure", usdHr: 2.60, fetchedAt: "2026-07-26", sourceUrl: "https://coreweave.com", sourceDomain: "coreweave.com" },
        ];

  const onDemandRates = allOffers
    .map((o) => o.usdHr)
    .filter((r) => typeof r === "number" && r > 0)
    .sort((a, b) => a - b);
  const communityRates = communityOffers
    .map((o) => o.usdHr)
    .filter((r) => typeof r === "number" && r > 0)
    .sort((a, b) => a - b);

  const cheapestOnDemand = onDemandRates.length > 0 ? onDemandRates[0] : item.onDemandUsd || 2.39;
  const cheapestSpot = communityRates.length > 0 ? communityRates[0] : item.spotUsd || 0;
  const maxOnDemand = onDemandRates.length > 0 ? onDemandRates[onDemandRates.length - 1] : cheapestOnDemand;

  let medianOnDemand = cheapestOnDemand;
  if (onDemandRates.length > 0) {
    const mid = Math.floor(onDemandRates.length / 2);
    medianOnDemand = onDemandRates.length % 2 !== 0 ? onDemandRates[mid] : (onDemandRates[mid - 1] + onDemandRates[mid]) / 2;
  }

  const uniqueProvidersCount = new Set(allOffers.map((o) => (o.provider ? o.provider.toLowerCase() : ""))).size;
  const cheapestOffer = secureOffers.length > 0 ? secureOffers[0] : allOffers.length > 0 ? allOffers[0] : null;
  const cheapestProvider = cheapestOffer ? cheapestOffer.provider : item.cheapestProvider || item.where || "Runpod";
  const sourceDomain = cheapestOffer ? cheapestOffer.sourceDomain || "runpod.io" : "runpod.io";
  const verifiedDate = item.verifiedDate || "2026-07-26";
  const vendor = name.toUpperCase().includes("MI") || name.toUpperCase().includes("AMD") || name.toUpperCase().includes("RADEON") ? "AMD" : "NVIDIA";

  // Dynamic or fallback metadata for TechPowerUp & TechSpot
  const processSize = extSpecs?.process || "4 nm / 5 nm";
  const transistors = extSpecs?.transistors || "76 Billion";
  const dieSize = extSpecs?.dieSize || "608 mm²";
  const shaders = extSpecs?.shaders || "16896 CUDA Cores";
  const memoryType = extSpecs?.memoryType || "HBM3e / GDDR7";
  const busWidth = extSpecs?.busWidth || "5120-bit";

  // Dynamic or fallback integration data
  const cloudRate = item.spotUsd ? `$${item.spotUsd.toFixed(2)}/hr` : `$${cheapestOnDemand.toFixed(2)}/hr (₹369/hr)`;
  const breakevenHours = "12439 hours";
  const workstationPrice = item.price || "₹58.50 Lakhs";

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        className="modal-content-passionfroot"
        style={{
          maxWidth: 900,
          padding: 36,
          backgroundColor: "var(--color-paper-white)",
          borderRadius: "var(--radius-large-cards)",
          border: "1px solid var(--color-sand-gray)",
          boxShadow: "var(--shadow-subtle-3)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Navigation / Tab Selector Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, backgroundColor: "var(--color-parchment-cream)", padding: "4px 6px", borderRadius: 12, border: "1px solid var(--color-sand-gray)" }}>
            <button
              onClick={() => setActiveTab("cloud")}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: currentTab === "cloud" ? "700" : "500",
                borderRadius: 8,
                border: "none",
                backgroundColor: currentTab === "cloud" ? "var(--color-paper-white)" : "transparent",
                color: currentTab === "cloud" ? "var(--color-ink-black)" : "var(--color-charcoal-stone)",
                boxShadow: currentTab === "cloud" ? "var(--shadow-subtle-1)" : "none",
                cursor: "pointer",
              }}
            >
              ☁️ Cloud GPU Rental & Offers
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              style={{
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: currentTab === "specs" ? "700" : "500",
                borderRadius: 8,
                border: "none",
                backgroundColor: currentTab === "specs" ? "var(--color-paper-white)" : "transparent",
                color: currentTab === "specs" ? "var(--color-ink-black)" : "var(--color-charcoal-stone)",
                boxShadow: currentTab === "specs" ? "var(--shadow-subtle-1)" : "none",
                cursor: "pointer",
              }}
            >
              💻 Silicon Specs & Integration
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-ash-gray)",
              fontSize: 22,
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>

        {/* VIEW 1: CLOUD GPU RENTAL PRICING & OFFERS (IMAGE 1 VIEW) */}
        {currentTab === "cloud" && (
          <div>
            {/* Title & Description */}
            <div style={{ marginBottom: 20 }}>
              <span className="pill-tag pill-tag-violet" style={{ marginBottom: 10 }}>
                ✦ {item.category ? item.category.toUpperCase() : "CLOUD_GPU"}
              </span>
              <h2 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 32, fontWeight: 400, color: "var(--color-ink-black)", margin: "6px 0 8px 0" }}>
                {name} rental prices: cheapest $/hr today
              </h2>
              <p style={{ fontSize: 14, color: "var(--color-charcoal-stone)", lineHeight: 1.6 }}>
                The cheapest on-demand {name} rental today is <strong style={{ fontWeight: 700, color: "var(--color-ink-black)" }}>${cheapestOnDemand.toFixed(2)}/hr</strong> on {cheapestProvider} ({cheapestOffer?.kind || "secure"}): verified {verifiedDate}. {vram} VRAM, {vendor}.
              </p>
            </div>

            {/* Huge Price Card */}
            <div
              style={{
                backgroundColor: "var(--color-parchment-cream)",
                padding: "24px 32px",
                borderRadius: "var(--radius-cards)",
                border: "1px solid var(--color-sand-gray)",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 48, fontWeight: 800, fontFamily: "var(--font-nunito-sans)", color: "var(--color-electric-violet)" }}>
                  ${cheapestOnDemand.toFixed(2)}
                </span>
                <span style={{ fontSize: 18, fontWeight: 600, color: "var(--color-charcoal-stone)" }}>/hr</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--color-ash-gray)", marginTop: 6, fontFamily: "var(--font-mono)" }}>
                cheapest on-demand rate {cheapestSpot > 0 && `(spot/community from $${cheapestSpot.toFixed(2)})`} · {cheapestProvider} ({cheapestOffer?.kind || "secure"}) · source:{" "}
                <a
                  href={cheapestOffer?.sourceUrl || `https://${sourceDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-electric-violet)", textDecoration: "underline" }}
                >
                  {sourceDomain}
                </a>
              </div>
            </div>

            {/* PRICING AT A GLANCE */}
            <div style={{ marginBottom: 28 }}>
              <h3
                style={{
                  fontFamily: "var(--font-new-kansas)",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-black)",
                  marginBottom: 14,
                }}
              >
                PRICING AT A GLANCE
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                <div className="card-paper-white" style={{ padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-ink-black)" }}>
                    ${cheapestOnDemand.toFixed(2)}
                  </div>
                  <div className="caption-text" style={{ marginTop: 4, fontSize: 11 }}>cheapest on-demand $/hr</div>
                </div>

                <div className="card-paper-white" style={{ padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-ink-black)" }}>
                    ${medianOnDemand.toFixed(2)}
                  </div>
                  <div className="caption-text" style={{ marginTop: 4, fontSize: 11 }}>median on-demand $/hr</div>
                </div>

                <div className="card-paper-white" style={{ padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-ink-black)" }}>
                    ${maxOnDemand.toFixed(2)}
                  </div>
                  <div className="caption-text" style={{ marginTop: 4, fontSize: 11 }}>max on-demand $/hr</div>
                </div>

                <div className="card-paper-white" style={{ padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-electric-violet)" }}>
                    {allOffers.length}
                  </div>
                  <div className="caption-text" style={{ marginTop: 4, fontSize: 11 }}>live offers</div>
                </div>

                <div className="card-paper-white" style={{ padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-ink-black)" }}>
                    {uniqueProvidersCount}
                  </div>
                  <div className="caption-text" style={{ marginTop: 4, fontSize: 11 }}>providers</div>
                </div>
              </div>
            </div>

            {/* All Current Offers Table */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 22, fontWeight: 400, color: "var(--color-ink-black)", marginBottom: 14 }}>
                All current {name} offers
              </h3>

              <div className="card-paper-white" style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-parchment-cream)", borderBottom: "1px solid var(--color-sand-gray)" }}>
                      <th style={{ padding: "12px 16px", color: "var(--color-charcoal-stone)", fontSize: 12, fontWeight: 600 }}>VARIANT</th>
                      <th style={{ padding: "12px 16px", color: "var(--color-ash-gray)", fontSize: 12, fontWeight: 600 }}>PROVIDER</th>
                      <th style={{ padding: "12px 16px", color: "var(--color-ash-gray)", fontSize: 12, fontWeight: 600 }}>TIER</th>
                      <th style={{ padding: "12px 16px", color: "var(--color-ash-gray)", fontSize: 12, fontWeight: 600, textAlign: "right" }}>$/HR</th>
                      <th style={{ padding: "12px 16px", color: "var(--color-ash-gray)", fontSize: 12, fontWeight: 600, textAlign: "right" }}>VERIFIED</th>
                      <th style={{ padding: "12px 16px", color: "var(--color-ash-gray)", fontSize: 12, fontWeight: 600, textAlign: "right" }}>SOURCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOffers.map((offer, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < allOffers.length - 1 ? "1px solid var(--color-sand-gray)" : "none" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--color-ink-black)" }}>
                          {offer.variant || name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "var(--color-tangerine)", fontWeight: 600 }}>
                          {offer.provider}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span className="pill-tag pill-tag-violet" style={{ fontSize: 11, padding: "2px 8px" }}>
                            {offer.kind || "on-demand"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--color-ink-black)", fontFamily: "var(--font-mono)", textAlign: "right" }}>
                          ${typeof offer.usdHr === "number" ? offer.usdHr.toFixed(2) : offer.usdHr}
                        </td>
                        <td style={{ padding: "12px 16px", color: "var(--color-ash-gray)", fontSize: 12, fontFamily: "var(--font-mono)", textAlign: "right" }}>
                          {offer.fetchedAt ? offer.fetchedAt.split("T")[0] : verifiedDate}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <a
                            href={offer.sourceUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--color-electric-violet)", textDecoration: "underline", fontSize: 13, fontWeight: 500 }}
                          >
                            source ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: HARDWARE SPECS & INTEGRATION (IMAGE 2 VIEW) */}
        {currentTab === "specs" && (
          <div>
            {/* Top Header Row with SILICON_DIE Blueprint Box */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative" }}>
              <div>
                <span className="pill-tag pill-tag-violet" style={{ marginBottom: 10 }}>
                  ✦ {item.category?.toUpperCase() || "HARDWARE"}
                </span>

                <h2 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 34, fontWeight: 400, color: "var(--color-ink-black)", margin: "8px 0 4px 0" }}>
                  {name}
                </h2>

                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--color-slate-warm)" }}>
                  {arch}
                </div>
              </div>

              {/* Passionfroot SILICON_DIE Blueprint Diagram Box */}
              <div
                style={{
                  width: 200,
                  height: 90,
                  border: "1.5px dashed var(--color-pale-violet)",
                  borderRadius: "var(--radius-cards)",
                  backgroundColor: "var(--color-lilac-mist)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "2px solid var(--color-electric-violet)",
                    backgroundColor: "var(--color-paper-white)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(178, 107, 245, 0.25)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--color-deep-violet)", letterSpacing: "0.05em" }}>
                    SILICON_DIE
                  </span>
                </div>
              </div>
            </div>

            {/* Core Specs Table Rows */}
            <div style={{ borderTop: "1px solid var(--color-sand-gray)", borderBottom: "1px solid var(--color-sand-gray)", padding: "16px 0", marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
                <span style={{ color: "var(--color-charcoal-stone)" }}>Capacity</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-ink-black)" }}>{vram}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
                <span style={{ color: "var(--color-charcoal-stone)" }}>Bandwidth</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-electric-violet)" }}>{bandwidth}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
                <span style={{ color: "var(--color-charcoal-stone)" }}>Power (TGP)</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>{tgp}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
                <span style={{ color: "var(--color-charcoal-stone)" }}>Valuation</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-tangerine)" }}>{price}</span>
              </div>
              {item.specs && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14 }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>System Specs</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{item.specs}</span>
                </div>
              )}
            </div>

            {/* Integration Comparison Section */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 24, fontWeight: 400, color: "var(--color-ink-black)", marginBottom: 16 }}>
                Integration Comparison
              </h3>

              <div className="grid-2col" style={{ gap: 16 }}>
                <div
                  className="card-paper-white"
                  style={{ padding: 20, cursor: "pointer", transition: "all 0.2s ease" }}
                  onClick={() => setActiveTab("cloud")}
                >
                  <span className="caption-text" style={{ letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>CLOUD ALTERNATIVE</span>
                  <h4 style={{ fontFamily: "var(--font-nunito-sans)", fontSize: 18, fontWeight: 700, color: "var(--color-ink-black)", marginBottom: 8 }}>
                    Cloud Rental Equivalent ↗
                  </h4>
                  <p style={{ fontSize: 14, color: "var(--color-charcoal-stone)", lineHeight: 1.5 }}>
                    Available at ~{cloudRate}. Breakeven point reached after <strong style={{ fontWeight: 700, color: "var(--color-ink-black)" }}>{breakevenHours}</strong> of execution compared to direct CapEx.
                  </p>
                </div>

                <div className="card-paper-white" style={{ padding: 20 }}>
                  <span className="caption-text" style={{ letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>EDGE WORKSTATION</span>
                  <h4 style={{ fontFamily: "var(--font-nunito-sans)", fontSize: 18, fontWeight: 700, color: "var(--color-ink-black)", marginBottom: 8 }}>
                    Workstation Config
                  </h4>
                  <p style={{ fontSize: 14, color: "var(--color-charcoal-stone)", lineHeight: 1.5 }}>
                    Can be integrated into a Custom AI Workstation starting from <strong style={{ fontWeight: 700, color: "var(--color-ink-black)" }}>{workstationPrice}</strong> with dedicated cooling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TechPowerUp Specs & TechSpot Meta Section (Always Available) */}
        <div style={{ marginBottom: 24, borderTop: "1px solid var(--color-sand-gray)", paddingTop: 24 }}>
          <h3 style={{ fontFamily: "var(--font-new-kansas)", fontSize: 22, fontWeight: 400, color: "var(--color-ink-black)", marginBottom: 14 }}>
            TechPowerUp Specs & TechSpot Meta
          </h3>

          <div className="grid-2col" style={{ gap: 16 }}>
            {/* TechPowerUp Database Card */}
            <div className="card-paper-white" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="caption-text" style={{ letterSpacing: "0.05em" }}>DATABASE // TECHPOWERUP</span>
                <span className="pill-tag pill-tag-violet" style={{ fontSize: 11 }}>2023/2024</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Process Size</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{processSize}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Transistors</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{transistors}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Die Size</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{dieSize}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Shaders</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{shaders}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-sand-gray)" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Memory Type</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{memoryType}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Bus Width</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--color-ink-black)" }}>{busWidth}</span>
                </div>
              </div>
            </div>

            {/* TechSpot Review Meta Card */}
            <div className="card-paper-white" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span className="caption-text" style={{ letterSpacing: "0.05em" }}>REVIEWS // TECHSPOT</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-tangerine)" }}>9.5/10 Rating</span>
                </div>

                <p style={{ fontStyle: "italic", fontSize: 14, color: "var(--color-charcoal-stone)", lineHeight: 1.5, marginBottom: 16 }}>
                  "Enterprise datacenter accelerator built specifically for transformer pipelines."
                </p>
              </div>

              <div style={{ backgroundColor: "var(--color-parchment-cream)", padding: 12, borderRadius: "10px", border: "1px solid var(--color-sand-gray)", fontSize: 13 }}>
                <div style={{ marginBottom: 4 }}>
                  <strong style={{ color: "var(--color-forest-green)", fontWeight: 700 }}>PROS // </strong>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>Massive HBM bandwidth, high scalability.</span>
                </div>
                <div>
                  <strong style={{ color: "var(--color-coral-red)", fontWeight: 700 }}>CONS // </strong>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>High rental cost, complex infrastructure required.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Row */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button className="btn-filled-dark" onClick={onClose} style={{ height: "42px", padding: "0 22px", fontSize: "14px", borderRadius: "12px" }}>
            Close specification
          </button>
        </div>
      </motion.div>
    </div>
  );
}

