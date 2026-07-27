import React, { useState } from "react";
import { motion } from "framer-motion";

const SPOT_RATES_DIRECTORY = [
  {
    id: 1,
    gpu: "NVIDIA H200 141GB",
    arch: "Hopper",
    spotRate: 1.99,
    provider: "Voltage Park",
    region: "US-East",
    availability: "High",
  },
  {
    id: 2,
    gpu: "NVIDIA H100 80GB",
    arch: "Hopper",
    spotRate: 1.69,
    provider: "E2E Networks",
    region: "IN-West",
    availability: "High",
  },
  {
    id: 3,
    gpu: "NVIDIA RTX 5090 32GB",
    arch: "Blackwell",
    spotRate: 0.89,
    provider: "RunPod",
    region: "EU-Central",
    availability: "Medium",
  },
  {
    id: 4,
    gpu: "NVIDIA L40S 48GB",
    arch: "Ada Lovelace",
    spotRate: 0.75,
    provider: "Lambda Cloud",
    region: "US-West",
    availability: "High",
  },
  {
    id: 5,
    gpu: "NVIDIA A100 80GB",
    arch: "Ampere",
    spotRate: 1.15,
    provider: "CoreWeave",
    region: "US-East",
    availability: "Low",
  },
  {
    id: 6,
    gpu: "NVIDIA RTX 4090 24GB",
    arch: "Ada Lovelace",
    spotRate: 0.44,
    provider: "Vast.ai",
    region: "Global",
    availability: "High",
  },
];

export default function GpuRatesModal({ isOpen, onClose }) {
  const [selectedArch, setSelectedArch] = useState("all");
  const [selectedGpu, setSelectedGpu] = useState(SPOT_RATES_DIRECTORY[0]);
  const [dailyHours, setDailyHours] = useState(12);

  if (!isOpen) return null;

  const filteredRates = SPOT_RATES_DIRECTORY.filter(
    (item) =>
      selectedArch === "all" ||
      item.arch.toLowerCase().includes(selectedArch.toLowerCase()),
  );

  const estimatedMonthlyCost = (selectedGpu.spotRate * dailyHours * 30).toFixed(
    2,
  );

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="modal-content-passionfroot"
        style={{
          maxWidth: 880,
          padding: 36,
          backgroundColor: "var(--color-paper-white)",
          borderRadius: "var(--radius-large-cards)",
        }}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <span
              className="pill-tag pill-tag-violet"
              style={{ marginBottom: 10 }}
            >
              ✦ MARKETPLACE RATES DIRECTORY
            </span>
            <h2
              style={{
                fontFamily: "var(--font-new-kansas)",
                fontSize: 32,
                fontWeight: 400,
                color: "var(--color-ink-black)",
                margin: "6px 0 6px 0",
              }}
            >
              Global GPU & Cloud Spot Rates
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--color-charcoal-stone)",
                maxWidth: 540,
              }}
            >
              Live pricing data across Hopper, Blackwell, and Ada Lovelace
              architectures from verified cloud neo-hosts.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-ash-gray)",
              fontSize: 24,
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Architecture Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {["all", "Hopper", "Blackwell", "Ada Lovelace", "Ampere"].map(
            (arch) => (
              <button
                key={arch}
                onClick={() => setSelectedArch(arch)}
                className={
                  selectedArch === arch
                    ? "btn-filled-dark"
                    : "btn-outlined-violet"
                }
                style={{ height: 34, fontSize: 12, padding: "0 14px" }}
              >
                {arch === "all" ? "ALL ARCHITECTURES" : arch.toUpperCase()}
              </button>
            ),
          )}
        </div>

        {/* Live Rates Directory Table */}
        <div
          className="card-paper-white"
          style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}
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
                    padding: "12px 16px",
                    color: "var(--color-charcoal-stone)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  GPU SILICON
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    color: "var(--color-ash-gray)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ARCHITECTURE
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    color: "var(--color-ash-gray)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  SPOT HOURLY
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    color: "var(--color-ash-gray)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  PRIMARY HOST
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    color: "var(--color-ash-gray)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  REGION
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedGpu(item)}
                  style={{
                    borderBottom: "1px solid var(--color-sand-gray)",
                    cursor: "pointer",
                    backgroundColor:
                      selectedGpu.id === item.id
                        ? "var(--color-lilac-mist)"
                        : "transparent",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      color: "var(--color-ink-black)",
                    }}
                  >
                    {item.gpu}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--color-charcoal-stone)",
                      fontSize: 13,
                    }}
                  >
                    {item.arch}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      color: "var(--color-electric-violet)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    ${item.spotRate.toFixed(2)} / hr
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--color-ink-black)",
                    }}
                  >
                    {item.provider}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--color-ash-gray)",
                      fontSize: 12,
                    }}
                  >
                    {item.region}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Cost Estimator Box */}
        <div
          style={{
            backgroundColor: "var(--color-parchment-cream)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--color-sand-gray)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <span className="caption-text">
                LIVE ESTIMATOR // {selectedGpu.gpu}
              </span>
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-ink-black)",
                  marginTop: 2,
                }}
              >
                Monthly Spot Budget Estimate
              </h4>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--color-electric-violet)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ${estimatedMonthlyCost} / mo
              </div>
              <div className="caption-text">@{dailyHours} hrs/day</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="caption-text" style={{ whiteSpace: "nowrap" }}>
              DAILY RUNTIME: {dailyHours} HRS
            </span>
            <input
              type="range"
              min="1"
              max="24"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              style={{
                flex: 1,
                accentColor: "var(--color-electric-violet)",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            className="btn-outlined-violet"
            onClick={onClose}
            style={{ height: 42 }}
          >
            Close Directory
          </button>
          <button
            className="btn-filled-dark"
            onClick={onClose}
            style={{ height: 42, padding: "0 24px" }}
          >
            Reserve Spot Node on {selectedGpu.provider} →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
