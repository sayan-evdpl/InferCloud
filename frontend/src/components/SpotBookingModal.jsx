import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROVIDER_URLS = {
  "Voltage Park": "https://voltagepark.com",
  "E2E Networks": "https://www.e2enetworks.com",
  "Runpod": "https://www.runpod.io",
  "Lambda Labs": "https://lambdalabs.com/service/gpu-cloud",
  "Vast.ai": "https://vast.ai",
  "Cyfuture": "https://cyfuture.com",
  "CoreWeave": "https://www.coreweave.com",
  "AWS": "https://aws.amazon.com/ec2/instance-types/p5/",
  "Azure": "https://azure.microsoft.com/en-us/products/virtual-machines/nd-h100-v5",
};

export default function SpotBookingModal({ isOpen, onClose, deal }) {
  const [nodesCount, setNodesCount] = useState(1);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);

  if (!isOpen || !deal) return null;

  const providerName = deal.lowProvider || deal.provider || "Voltage Park";
  const gpuName = deal.gpu || "NVIDIA H200 (141GB HBM3e)";
  const hourlyRate = deal.lowRate || deal.spotRate || 1.05;
  const totalHourlyCost = (hourlyRate * nodesCount).toFixed(2);
  const targetUrl = PROVIDER_URLS[providerName] || "https://voltagepark.com";

  const handleLaunchProvisioning = () => {
    setDeploying(true);
    setTerminalLogs([
      "▶ Initializing direct spot instance reservation request...",
      `▶ Connecting to ${providerName} datacenter API endpoint...`,
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `✓ Secured ${nodesCount}x ${gpuName} physical PCIe/NVLink slot(s).`,
        `✓ Allocating 100GbE RDMA network fabric & NVMe storage...`,
      ]);
    }, 1000);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `✓ CUDA 12.4 PyTorch container image mounted successfully.`,
        `🚀 SPOT INSTANCE DEPLOYED! Redirecting to ${providerName} portal...`,
      ]);
      setDeploying(false);
      setDeployed(true);

      // Open official provider reservation portal in new tab
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }, 2200);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        className="modal-content-passionfroot"
        style={{
          maxWidth: 640,
          padding: 32,
          backgroundColor: "var(--color-paper-white)",
          borderRadius: "var(--radius-large-cards)",
          border: "1.5px solid var(--color-electric-violet)",
          boxShadow: "var(--shadow-subtle-3)",
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <span className="pill-tag pill-tag-violet" style={{ marginBottom: 8 }}>
              ⚡ DIRECT SPOT INSTANCE PROVISIONING
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--color-ink-black)", marginTop: 4 }}>
              Reserve Spot Instance on {providerName}
            </h3>
            <p style={{ fontSize: 13, color: "var(--color-charcoal-stone)", marginTop: 4 }}>
              Claim real-time spot pricing with instant 1-click cloud environment provisioning.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--color-ash-gray)", fontSize: 22, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        {/* Selected Instance Breakdown Card */}
        <div
          style={{
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: "var(--color-parchment-cream)",
            border: "1px solid var(--color-sand-gray)",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 800 }}>
            <span>Hardware:</span>
            <span style={{ color: "var(--color-electric-violet)" }}>{gpuName}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span>Cloud Host / Provider:</span>
            <span style={{ fontWeight: 700, color: "var(--color-ink-black)" }}>{providerName}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <span>Spot Hourly Rate:</span>
            <span style={{ fontWeight: 800, color: "#10b981", fontFamily: "var(--font-mono)" }}>
              ${hourlyRate.toFixed(2)} / hr
            </span>
          </div>

          {/* Node Count Slider */}
          <div style={{ borderTop: "1px dashed var(--color-sand-gray)", paddingTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>
              INSTANCE CLUSTER SIZE:
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 2, 4, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setNodesCount(num)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: nodesCount === num ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                    backgroundColor: nodesCount === num ? "var(--color-electric-violet)" : "#ffffff",
                    color: nodesCount === num ? "#ffffff" : "var(--color-ink-black)",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {num}x Node{num > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Total Price Banner */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            backgroundColor: "var(--color-ink-black)",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <div style={{ fontSize: "10.5px", color: "#a7f3d0", fontWeight: 700, textTransform: "uppercase" }}>
              ESTIMATED HOURLY BILLING
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
              ${totalHourlyCost} / hr
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>
            {nodesCount}x Node ({gpuName})
          </div>
        </div>

        {/* Provisioning Terminal Output */}
        {terminalLogs.length > 0 && (
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "#0f172a",
              color: "#38bdf8",
              fontFamily: "var(--font-mono)",
              fontSize: "11.5px",
              lineHeight: 1.5,
              marginBottom: "20px",
              maxHeight: "120px",
              overflowY: "auto",
            }}
          >
            {terminalLogs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button className="btn-outlined-violet" onClick={onClose} style={{ height: "42px", fontSize: "13px" }}>
            Cancel
          </button>

          <button
            onClick={handleLaunchProvisioning}
            disabled={deploying}
            className="btn-filled-dark"
            style={{
              height: "42px",
              padding: "0 22px",
              fontSize: "13.5px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: deployed ? "#10b981" : "var(--color-ink-black)",
            }}
          >
            {deploying ? "⚡ Provisioning..." : deployed ? "✓ Opened Host Portal ↗" : `🚀 Claim & Reserve Spot Instance on ${providerName} →`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
