import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getExternalSpecs } from "../api/gpuApi";

export default function DetailModal({ item, onClose }) {
  const [extSpecs, setExtSpecs] = useState(null);
  const [loadingSpecs, setLoadingSpecs] = useState(false);

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

  if (item.category === "cloud") {
    const secureOffers = item.offers ? item.offers.filter(o => o.kind === "secure") : [];
    const communityOffers = item.offers ? item.offers.filter(o => o.kind === "community") : [];
    const allOffers = item.offers || [];

    const onDemandRates = secureOffers.map(o => o.usdHr).sort((a, b) => a - b);
    const communityRates = communityOffers.map(o => o.usdHr).sort((a, b) => a - b);
    const allRates = allOffers.map(o => o.usdHr).sort((a, b) => a - b);

    const cheapestOnDemand = onDemandRates.length > 0 ? onDemandRates[0] : (allRates.length > 0 ? allRates[0] : 0);
    const cheapestSpot = communityRates.length > 0 ? communityRates[0] : 0;
    const maxOnDemand = onDemandRates.length > 0 ? onDemandRates[onDemandRates.length - 1] : (allRates.length > 0 ? allRates[allRates.length - 1] : 0);

    let medianOnDemand = 0;
    if (onDemandRates.length > 0) {
      const mid = Math.floor(onDemandRates.length / 2);
      medianOnDemand = onDemandRates.length % 2 !== 0 
        ? onDemandRates[mid] 
        : (onDemandRates[mid - 1] + onDemandRates[mid]) / 2;
    }

    const uniqueProvidersCount = new Set(allOffers.map(o => o.provider.toLowerCase())).size;
    const cheapestOffer = secureOffers.length > 0 ? secureOffers[0] : (allOffers.length > 0 ? allOffers[0] : null);
    const cheapestProvider = cheapestOffer ? cheapestOffer.provider : "";
    const sourceDomain = cheapestOffer && cheapestOffer.sourceUrl !== "#"
      ? new URL(cheapestOffer.sourceUrl).hostname.replace("www.", "")
      : "gpurentalprices.com";

    const verifiedDate = item.verifiedDate || new Date().toISOString().split("T")[0];

    return (
      <div className="detail-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ background: "rgba(20,20,19,0.4)" }}>
        <motion.div
          className="detail-modal-content"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            background: "var(--colors-canvas)",
            border: "1px solid var(--colors-hairline)",
            maxWidth: "900px",
            width: "100%"
          }}
        >
          <button className="detail-modal-close" onClick={onClose} style={{ color: "var(--colors-muted)" }}>✕</button>

          <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Breadcrumb path */}
            <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--colors-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
              <span>Home</span>
              <span>&gt;</span>
              <span>GPUs</span>
              <span>&gt;</span>
              <span style={{ color: "var(--colors-ink)" }}>{item.gpu}</span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 500, fontFamily: "var(--font-display)", color: "var(--colors-ink)", marginBottom: 12 }}>
                {item.gpu} rental prices: cheapest $/hr today
              </h2>
              <p style={{ fontSize: 14, color: "var(--colors-body)", lineHeight: 1.6 }}>
                The cheapest on-demand {item.gpu} rental today is <strong>${cheapestOnDemand.toFixed(2)}/hr</strong> on {cheapestProvider} ({cheapestOffer?.kind || "unspecified"}): verified {verifiedDate}. {item.vram} VRAM, NVIDIA.
              </p>
            </div>

            {/* Huge price card (no rent button) */}
            <div className="glass-panel" style={{
              padding: "32px 40px",
              background: "var(--colors-surface-soft)"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 700, fontFamily: "var(--font-sans)", color: "var(--colors-ink)" }}>
                    ${cheapestOnDemand.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 18, color: "var(--colors-muted)", fontFamily: "var(--font-sans)" }}>/hr</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--colors-muted)", marginTop: 8 }}>
                  cheapest on-demand rate {cheapestSpot > 0 && `(spot/community from $${cheapestSpot.toFixed(2)})`} · {cheapestProvider} ({cheapestOffer?.kind}) · source: <span style={{ textDecoration: "underline" }}>{sourceDomain}</span>
                </div>
              </div>
            </div>

            {/* PRICING AT A GLANCE */}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--colors-muted)", marginBottom: 16 }}>
                Pricing at a glance
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12
              }}>
                <div className="glass-panel" style={{ padding: "16px 20px", background: "var(--colors-canvas)", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "var(--colors-ink)" }}>${cheapestOnDemand.toFixed(2)}</div>
                  <div style={{ fontSize: 10, color: "var(--colors-muted)", marginTop: 4 }}>cheapest on-demand $/hr</div>
                </div>
                <div className="glass-panel" style={{ padding: "16px 20px", background: "var(--colors-canvas)", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "var(--colors-ink)" }}>{medianOnDemand > 0 ? `$${medianOnDemand.toFixed(2)}` : "–"}</div>
                  <div style={{ fontSize: 10, color: "var(--colors-muted)", marginTop: 4 }}>median on-demand $/hr</div>
                </div>
                <div className="glass-panel" style={{ padding: "16px 20px", background: "var(--colors-canvas)", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "var(--colors-ink)" }}>{maxOnDemand > 0 ? `$${maxOnDemand.toFixed(2)}` : "–"}</div>
                  <div style={{ fontSize: 10, color: "var(--colors-muted)", marginTop: 4 }}>max on-demand $/hr</div>
                </div>
                <div className="glass-panel" style={{ padding: "16px 20px", background: "var(--colors-canvas)", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "var(--colors-ink)" }}>{allOffers.length}</div>
                  <div style={{ fontSize: 10, color: "var(--colors-muted)", marginTop: 4 }}>live offers</div>
                </div>
                <div className="glass-panel" style={{ padding: "16px 20px", background: "var(--colors-canvas)", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "var(--colors-ink)" }}>{uniqueProvidersCount}</div>
                  <div style={{ fontSize: 10, color: "var(--colors-muted)", marginTop: 4 }}>providers</div>
                </div>
              </div>
            </div>

            {/* All current offers table */}
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 500, fontFamily: "var(--font-display)", color: "var(--colors-ink)", marginBottom: 16 }}>
                All current {item.gpu} offers
              </h3>
              <div className="glass-panel" style={{ overflow: "hidden", background: "var(--colors-canvas)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--colors-surface-soft)", borderBottom: "1px solid var(--colors-hairline)" }}>
                      <th style={{ textAlign: "left", padding: "12px 20px", color: "var(--colors-muted)", fontFamily: "var(--font-sans)" }}>VARIANT</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", color: "var(--colors-muted)", fontFamily: "var(--font-sans)" }}>PROVIDER</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", color: "var(--colors-muted)", fontFamily: "var(--font-sans)" }}>TIER</th>
                      <th style={{ textAlign: "right", padding: "12px 20px", color: "var(--colors-muted)", fontFamily: "var(--font-sans)" }}>$/HR</th>
                      <th style={{ textAlign: "right", padding: "12px 20px", color: "var(--colors-muted)", fontFamily: "var(--font-sans)" }}>VERIFIED</th>
                      <th style={{ textAlign: "right", padding: "12px 20px", color: "var(--colors-muted)", fontFamily: "var(--font-sans)" }}>SOURCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOffers.map((offer, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < allOffers.length - 1 ? "1px solid var(--colors-hairline-soft)" : "none" }}>
                        <td style={{ padding: "12px 20px", fontWeight: 600, fontFamily: "var(--font-sans)" }}>{offer.variant || item.gpu}</td>
                        <td style={{ padding: "12px 20px", color: "var(--colors-primary)", fontWeight: 500 }}>{offer.provider}</td>
                        <td style={{ padding: "12px 20px" }}>
                          <span className="badge badge-slate" style={{ fontSize: 10, textTransform: "lowercase" }}>
                            {offer.kind}
                          </span>
                        </td>
                        <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                          ${offer.usdHr.toFixed(2)}
                        </td>
                        <td style={{ padding: "12px 20px", textAlign: "right", color: "var(--colors-muted)", fontSize: 11 }}>
                          {offer.fetchedAt.split("T")[0]}
                        </td>
                        <td style={{ padding: "12px 20px", textAlign: "right" }}>
                          <a
                            href={offer.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "var(--colors-primary)",
                              textDecoration: "underline",
                              fontSize: 12,
                              fontWeight: 500
                            }}
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

            {/* TechPowerUp & TechSpot Spec Section */}
            {renderExternalSpecsSection()}

          </div>
        </motion.div>
      </div>
    );
  }

  // Render dynamic comparison logic with all three ways
  const renderIntegrationComparison = () => {
    if (item.category === "local") {
      const annualPowerAndMaint = 25000;
      const wsCost = item.priceMin || 300000;
      const cloudHourCostUsd = item.name.includes("5090") ? 0.48 : item.name.includes("H200") ? 4.39 : 1.5;
      const cloudCostInrHr = cloudHourCostUsd * 84; 
      
      const breakevenHours = Math.round(wsCost / (cloudCostInrHr - 7)); 

      return (
        <div style={{ marginTop: 32, borderTop: "1px solid var(--colors-hairline)", paddingTop: 32 }}>
          <h4 style={{ fontSize: 18, color: "var(--colors-ink)", fontFamily: "var(--font-display)", marginBottom: 16 }}>Integration Comparison</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="glass-panel" style={{ padding: 24, background: "var(--colors-canvas)" }}>
              <div style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>CLOUD ALTERNATIVE</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4, fontFamily: "var(--font-display)", color: "var(--colors-ink)" }}>Cloud Rental Equivalent</div>
              <div style={{ fontSize: 14, color: "var(--colors-body)", marginTop: 8, lineHeight: 1.6 }}>
                Available at ~${cloudHourCostUsd}/hr (₹{Math.round(cloudCostInrHr)}/hr). Breakeven point reached after <strong>{breakevenHours} hours</strong> of execution compared to direct CapEx.
              </div>
            </div>
            <div className="glass-panel" style={{ padding: 24, background: "var(--colors-canvas)" }}>
              <div style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>EDGE WORKSTATION</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4, fontFamily: "var(--font-display)", color: "var(--colors-ink)" }}>Workstation Config</div>
              <div style={{ fontSize: 14, color: "var(--colors-body)", marginTop: 8, lineHeight: 1.6 }}>
                Can be integrated into a Custom AI Workstation starting from <strong>₹{(wsCost * 1.3 / 100000).toFixed(2)} Lakhs</strong> with dedicated cooling.
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.category === "cloud") {
      const rateUsd = item.onDemandUsd || item.offers?.[0]?.usdHr || 1.0;
      const daily8hAnnualInr = Math.round(rateUsd * 84 * 8 * 365);
      const directCapEx = item.gpu.toLowerCase().includes("5090") ? 550000 : item.gpu.toLowerCase().includes("h200") ? 4500000 : 800000;

      return (
        <div style={{ marginTop: 32, borderTop: "1px solid var(--colors-hairline)", paddingTop: 32, display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Detailed Cloud Offers list */}
          {item.offers && item.offers.length > 0 && (
            <div>
              <h4 style={{ fontSize: 18, color: "var(--colors-ink)", fontFamily: "var(--font-display)", marginBottom: 14 }}>
                Available Providers for {item.gpu}
              </h4>
              <div className="glass-panel" style={{ overflow: "hidden", background: "var(--colors-surface-soft)", borderRadius: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--colors-surface-cream-strong)", borderBottom: "1px solid var(--colors-hairline)" }}>
                      <th style={{ textAlign: "left", padding: "10px 16px", color: "var(--colors-muted)" }}>Provider</th>
                      <th style={{ textAlign: "left", padding: "10px 16px", color: "var(--colors-muted)" }}>Type</th>
                      <th style={{ textAlign: "right", padding: "10px 16px", color: "var(--colors-muted)" }}>VRAM</th>
                      <th style={{ textAlign: "right", padding: "10px 16px", color: "var(--colors-muted)" }}>Rate</th>
                      <th style={{ width: 80 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.offers.map((offer, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < item.offers.length - 1 ? "1px solid var(--colors-hairline-soft)" : "none" }}>
                        <td style={{ padding: "10px 16px", fontWeight: 600 }}>{offer.provider}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span className={`badge ${offer.kind === "secure" ? "badge-emerald" : "badge-amber"}`} style={{ fontSize: 10 }}>
                            {offer.kind}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontFamily: "var(--font-mono)" }}>{offer.vramGb} GB</td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "var(--colors-primary)", fontFamily: "var(--font-mono)" }}>
                          ${offer.usdHr.toFixed(2)}/hr
                        </td>
                        <td style={{ padding: "8px 16px", textAlign: "right" }}>
                          <a
                            className="button-primary"
                            href={offer.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              height: 24,
                              padding: "0 8px",
                              fontSize: 10,
                              borderRadius: 4,
                              textDecoration: "none"
                            }}
                          >
                            Rent →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Breakeven analysis */}
          <div>
            <h4 style={{ fontSize: 18, color: "var(--colors-ink)", fontFamily: "var(--font-display)", marginBottom: 16 }}>Integration Comparison</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="glass-panel" style={{ padding: 24, background: "var(--colors-canvas)" }}>
                <div style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>LOCAL PHYSICAL HARDWARE</div>
                <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4, fontFamily: "var(--font-display)", color: "var(--colors-ink)" }}>CapEx Procurement</div>
                <div style={{ fontSize: 14, color: "var(--colors-body)", marginTop: 8, lineHeight: 1.6 }}>
                  A local equivalent desktop rig would cost approx <strong>₹{(directCapEx / 100000).toFixed(2)} Lakhs</strong>. At 8h/day, cloud equals local cost in <strong>{Math.round(directCapEx / daily8hAnnualInr * 12)} months</strong>.
                </div>
              </div>
              <div className="glass-panel" style={{ padding: 24, background: "var(--colors-canvas)" }}>
                <div style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>MOBILE DEV EDGE</div>
                <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4, fontFamily: "var(--font-display)", color: "var(--colors-ink)" }}>Nomadic Prototype</div>
                <div style={{ fontSize: 14, color: "var(--colors-body)", marginTop: 8, lineHeight: 1.6 }}>
                  For edge tests, use a mobile RTX laptop (starts ₹3.9L). Perfect for off-network bursty prototyping.
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default system case
    const sysPrice = item.priceMin || 650000;
    return (
      <div style={{ marginTop: 32, borderTop: "1px solid var(--colors-hairline)", paddingTop: 32 }}>
        <h4 style={{ fontSize: 18, color: "var(--colors-ink)", fontFamily: "var(--font-display)", marginBottom: 16 }}>Integration Comparison</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="glass-panel" style={{ padding: 24, background: "var(--colors-canvas)" }}>
            <div style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>RAW CHIP PROCUREMENT</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4, fontFamily: "var(--font-display)", color: "var(--colors-ink)" }}>DIY Desktop Board</div>
            <div style={{ fontSize: 14, color: "var(--colors-body)", marginTop: 8, lineHeight: 1.6 }}>
              Saves about 25% assembly premiums. Ideal if you have experienced system administrators and platform engineers.
            </div>
          </div>
          <div className="glass-panel" style={{ padding: 24, background: "var(--colors-canvas)" }}>
            <div style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>CLOUD RESERVED CAPACITY</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4, fontFamily: "var(--font-display)", color: "var(--colors-ink)" }}>Vast/RunPod Reserve</div>
            <div style={{ fontSize: 14, color: "var(--colors-body)", marginTop: 8, lineHeight: 1.6 }}>
              Renting equivalent cloud instances for 1 year 24/7 costs ~₹3.5L. System CapEx breakeven is reached in <strong>{(sysPrice / 350000 * 12).toFixed(1)} months</strong>.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExternalSpecsSection = () => {
    if (loadingSpecs) {
      return (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid var(--colors-hairline)", borderRadius: 8, background: "var(--colors-surface-soft)", textAlign: "center" }}>
          <div style={{ color: "var(--colors-muted)", fontSize: 12, fontFamily: "var(--font-mono)" }}>FETCHING METADATA FROM TECHPOWERUP & TECHSPOT...</div>
        </div>
      );
    }

    if (!extSpecs) return null;

    return (
      <div style={{ marginTop: 32, borderTop: "1px solid var(--colors-hairline)", paddingTop: 32 }}>
        <h4 style={{ fontSize: 18, color: "var(--colors-ink)", fontFamily: "var(--font-display)", marginBottom: 16 }}>
          TechPowerUp Specs & TechSpot Meta
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          
          {/* TechPowerUp Hardware Specs */}
          <div className="glass-panel" style={{ padding: 24, background: "var(--colors-surface-soft)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>DATABASE // TECHPOWERUP</span>
              <span className="badge badge-rose" style={{ fontSize: 9 }}>{extSpecs.releaseDate}</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div className="spec-row" style={{ padding: "6px 0" }}>
                <span className="spec-label" style={{ fontSize: 12 }}>Process Size</span>
                <span className="spec-value" style={{ fontSize: 12 }}>{extSpecs.process}</span>
              </div>
              <div className="spec-row" style={{ padding: "6px 0" }}>
                <span className="spec-label" style={{ fontSize: 12 }}>Transistors</span>
                <span className="spec-value" style={{ fontSize: 12 }}>{extSpecs.transistors}</span>
              </div>
              <div className="spec-row" style={{ padding: "6px 0" }}>
                <span className="spec-label" style={{ fontSize: 12 }}>Die Size</span>
                <span className="spec-value" style={{ fontSize: 12 }}>{extSpecs.dieSize}</span>
              </div>
              <div className="spec-row" style={{ padding: "6px 0" }}>
                <span className="spec-label" style={{ fontSize: 12 }}>Shaders</span>
                <span className="spec-value" style={{ fontSize: 12 }}>{extSpecs.shaders}</span>
              </div>
              <div className="spec-row" style={{ padding: "6px 0" }}>
                <span className="spec-label" style={{ fontSize: 12 }}>Memory Type</span>
                <span className="spec-value" style={{ fontSize: 12 }}>{extSpecs.memoryType}</span>
              </div>
              <div className="spec-row" style={{ padding: "6px 0" }}>
                <span className="spec-label" style={{ fontSize: 12 }}>Bus Width</span>
                <span className="spec-value" style={{ fontSize: 12 }}>{extSpecs.busWidth}</span>
              </div>
            </div>
          </div>

          {/* TechSpot Review Summary */}
          <div className="glass-panel" style={{ padding: 24, background: "var(--colors-surface-soft)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>REVIEWS // TECHSPOT</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--colors-primary)" }}>{extSpecs.techspotRating} Rating</span>
              </div>
              <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--colors-body)", lineHeight: 1.5, marginBottom: 16 }}>
                "{extSpecs.techspotVerdict}"
              </div>
            </div>

            <div style={{ background: "var(--colors-canvas)", border: "1px solid var(--colors-hairline)", padding: 12, borderRadius: 6, fontSize: 12 }}>
              <div style={{ color: "var(--colors-success)", marginBottom: 4 }}><strong>PROS //</strong> {extSpecs.pros}</div>
              <div style={{ color: "var(--colors-error)" }}><strong>CONS //</strong> {extSpecs.cons}</div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const getModalIconAndImage = () => {
    // Generate beautiful SVGs showing chip designs or rackmount server wireframes in warm colors
    if (item.category === "local") {
      return (
        <svg width="100%" height="160" style={{ background: "var(--colors-surface-soft)", border: "1px solid var(--colors-hairline)", borderRadius: 8, padding: 12 }}>
          <rect x="10%" y="15%" width="80%" height="70%" fill="none" stroke="var(--colors-primary)" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="30" fill="none" stroke="var(--colors-primary)" strokeWidth="3" />
          <path d="M 50 15 L 50 145 M 10 80 L 290 80" stroke="rgba(20,20,19,0.04)" strokeWidth="1" />
          <text x="50%" y="54%" fill="var(--colors-ink)" fontFamily="var(--font-mono)" fontSize="11" textAnchor="middle">SILICON_DIE</text>
        </svg>
      );
    }
    if (item.category === "cloud") {
      return (
        <svg width="100%" height="160" style={{ background: "var(--colors-surface-soft)", border: "1px solid var(--colors-hairline)", borderRadius: 8, padding: 12 }}>
          <rect x="5%" y="15%" width="90%" height="20%" fill="none" stroke="var(--colors-accent-teal)" strokeWidth="2" />
          <rect x="5%" y="45%" width="90%" height="20%" fill="none" stroke="var(--colors-accent-teal)" strokeWidth="2" />
          <rect x="5%" y="75%" width="90%" height="20%" fill="none" stroke="var(--colors-accent-teal)" strokeWidth="2" />
          <circle cx="15%" cy="25%" r="4" fill="var(--colors-accent-teal)" />
          <circle cx="15%" cy="55%" r="4" fill="var(--colors-accent-teal)" />
          <circle cx="15%" cy="85%" r="4" fill="var(--colors-accent-teal)" />
          <text x="50%" y="58%" fill="var(--colors-ink)" fontFamily="var(--font-mono)" fontSize="11" textAnchor="middle">RACKMOUNT_NODE</text>
        </svg>
      );
    }
    return (
      <svg width="100%" height="160" style={{ background: "var(--colors-surface-soft)", border: "1px solid var(--colors-hairline)", borderRadius: 8, padding: 12 }}>
        <polygon points="150,15 270,75 270,125 150,145 30,125 30,75" fill="none" stroke="var(--colors-accent-amber)" strokeWidth="2" />
        <path d="M 150 15 L 150 145 M 30 75 L 150 90 L 270 75" fill="none" stroke="var(--colors-accent-amber)" strokeWidth="1" />
        <text x="50%" y="62%" fill="var(--colors-ink)" fontFamily="var(--font-mono)" fontSize="11" textAnchor="middle">DEV_STATION</text>
      </svg>
    );
  };

  return (
    <div className="detail-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ background: "rgba(20,20,19,0.4)" }}>
      <motion.div
        className="detail-modal-content"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          background: "var(--colors-canvas)",
          border: "1px solid var(--colors-hairline)",
        }}
      >
        <button className="detail-modal-close" onClick={onClose} style={{ color: "var(--colors-muted)" }}>✕</button>
        <div style={{ padding: 32 }}>
          <div className="responsive-modal-grid">
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span className="badge badge-slate" style={{ fontFamily: "var(--font-mono)" }}>
                  {item.category.toUpperCase()}_MODEL
                </span>
                {item.region && <span className="badge badge-rose">{item.region}</span>}
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 500, fontFamily: "var(--font-display)", color: "var(--colors-ink)", marginBottom: 6 }}>{item.name || item.type || item.provider}</h2>
              <p style={{ fontSize: 13, color: "var(--colors-muted)", fontFamily: "var(--font-mono)", marginBottom: 24 }}>
                {item.arch || item.gpu || "HARDWARE CONTEXT DESIGN"}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {item.vram && (
                  <div className="spec-row">
                    <span className="spec-label">Capacity</span>
                    <span className="spec-value">{item.vram}</span>
                  </div>
                )}
                {item.bandwidth && (
                  <div className="spec-row">
                    <span className="spec-label">Bandwidth</span>
                    <span className="spec-value">{item.bandwidth}</span>
                  </div>
                )}
                {item.tgp && (
                  <div className="spec-row">
                    <span className="spec-label">Power (TGP)</span>
                    <span className="spec-value">{item.tgp}</span>
                  </div>
                )}
                {item.price && (
                  <div className="spec-row">
                    <span className="spec-label">Valuation</span>
                    <span className="spec-value" style={{ color: "var(--colors-primary)" }}>{item.price}</span>
                  </div>
                )}
                {item.rate && (
                  <div className="spec-row">
                    <span className="spec-label">Hourly Rate</span>
                    <span className="spec-value" style={{ color: "var(--colors-primary)" }}>{item.rate}</span>
                  </div>
                )}
                {item.specs && (
                  <div className="spec-row">
                    <span className="spec-label">System Specs</span>
                    <span className="spec-value">{item.specs}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {getModalIconAndImage()}
              {item.limit && (
                <div className="constraint-box" style={{ marginTop: 16, background: "rgba(244, 63, 94, 0.04)", border: "1px solid rgba(244, 63, 94, 0.12)", color: "var(--colors-error)" }}>
                  <strong>LIMITATION //</strong> {item.limit}
                </div>
              )}
              {item.profile && (
                <div style={{ marginTop: 16, background: "var(--colors-surface-soft)", border: "1px solid var(--colors-hairline)", padding: 12, borderRadius: 8, fontSize: 11, color: "var(--colors-muted)", fontFamily: "var(--font-mono)" }}>
                  <strong>PROFILE //</strong> {item.profile}
                </div>
              )}
            </div>
          </div>

          {renderIntegrationComparison()}
          {renderExternalSpecsSection()}
        </div>
      </motion.div>
    </div>
  );
}
