import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GUIDED_GOALS = [
  {
    id: "llm_70b",
    label: "🦙 FINE-TUNE 70B LLMs",
    desc: "Optimized for Llama 3 70B fine-tuning & QLoRA",
    gpuIndex: 1, // 2x RTX 5090
    cpuIndex: 0, // Threadripper 64-Core
    powerIndex: 0, // 2000W Liquid
    storageIndex: 1, // 8TB RAID
  },
  {
    id: "image_gen",
    label: "🎨 AI IMAGE / VIDEO GEN",
    desc: "High throughput for FLUX.1 & Stable Diffusion",
    gpuIndex: 0, // 1x RTX 5090
    cpuIndex: 3, // Ryzen 9 7950X3D
    powerIndex: 2, // 1600W Air
    storageIndex: 0, // 4TB NVMe
  },
  {
    id: "enterprise",
    label: "⚡ ENTERPRISE AI SERVER",
    desc: "Maximum reliability datacenter server node",
    gpuIndex: 4, // 4x L40S
    cpuIndex: 2, // Dual Xeon
    powerIndex: 1, // 3200W Dual PSU
    storageIndex: 2, // 16TB NVMe RAID + 100GbE
  },
  {
    id: "budget",
    label: "💰 BUDGET AI WORKSTATION",
    desc: "Entry-level deep learning under $5,000",
    gpuIndex: 0, // 1x RTX 5090
    cpuIndex: 3, // Ryzen 9
    powerIndex: 2, // 1600W Air
    storageIndex: 0, // 4TB NVMe
  },
];

const GPU_OPTIONS = [
  { id: "1x-5090", name: "1x NVIDIA RTX 5090", vramGb: 32, price: 2499, watts: 600, desc: "32GB GDDR7 · 1.79 TB/s Bandwidth" },
  { id: "2x-5090", name: "2x NVIDIA RTX 5090", vramGb: 64, price: 4998, watts: 1200, desc: "64GB GDDR7 · Dual GPU Workstation" },
  { id: "4x-5090", name: "4x NVIDIA RTX 5090", vramGb: 128, price: 9996, watts: 2400, desc: "128GB GDDR7 · Multi-GPU AI Cluster" },
  { id: "2x-l40s", name: "2x NVIDIA L40S", vramGb: 96, price: 14500, watts: 700, desc: "96GB GDDR6 · Enterprise Ada Workstation" },
  { id: "4x-l40s", name: "4x NVIDIA L40S", vramGb: 192, price: 29000, watts: 1400, desc: "192GB GDDR6 · Enterprise AI Server" },
];

const CPU_RAM_OPTIONS = [
  { id: "tr-64-256", name: "Threadripper PRO 7985WX + 256GB ECC", price: 6200, watts: 350, desc: "64-Core / 128-Thread · 8-Ch DDR5 ECC" },
  { id: "tr-96-512", name: "Threadripper PRO 7995WX + 512GB ECC", price: 11800, watts: 350, desc: "96-Core / 192-Thread · 8-Ch DDR5 ECC" },
  { id: "xeon-dual-256", name: "Dual Intel Xeon 8480+ + 256GB ECC", price: 9400, watts: 700, desc: "112 Total Cores · Dual Socket Server" },
  { id: "ryzen-128", name: "AMD Ryzen 9 7950X3D + 128GB DDR5", price: 1800, watts: 170, desc: "16-Core · High Clock Desktop" },
];

const POWER_COOLING_OPTIONS = [
  { id: "2000w-liquid", name: "Superflower 2000W Titanium + Custom Liquid Loop", price: 1200, wattsCapacity: 2000, desc: "92% Efficiency · Direct Die Liquid Cooling" },
  { id: "3200w-dual", name: "Dual 1600W Titanium PSUs + Industrial Liquid Loop", price: 1650, wattsCapacity: 3200, desc: "Redundant Power · Enterprise Grade" },
  { id: "1600w-air", name: "Corsair AX1600i Titanium + Heavy Duty Air Cooler", price: 650, wattsCapacity: 1600, desc: "94% Efficiency · Low Maintenance" },
];

const STORAGE_NETWORKING_OPTIONS = [
  { id: "nvme-4tb", name: "4TB PCIe 5.0 NVMe SSD (14,000 MB/s)", price: 450, watts: 15, desc: "Ultra Fast Scratch Space" },
  { id: "nvme-8tb-10g", name: "8TB Dual NVMe RAID 0 + 10GbE Network Card", price: 980, watts: 30, desc: "High Throughput Dataset Array" },
  { id: "nvme-16tb-100g", name: "16TB Enterprise U.2 RAID + 100GbE ConnectX-6", price: 2400, watts: 60, desc: "Datacenter Storage & RDMA Fabric" },
];

const GPU_SUGGESTIONS = [
  { name: "NVIDIA H200 SXM5 (141GB HBM3e)", price: 18500, vram: 141, watts: 700 },
  { name: "8x NVIDIA H100 SXM5 (640GB Cluster)", price: 210000, vram: 640, watts: 5600 },
  { name: "AMD Instinct MI300X (192GB HBM3)", price: 15000, vram: 192, watts: 750 },
  { name: "NVIDIA RTX 6000 Ada (48GB ECC)", price: 6800, vram: 48, watts: 300 },
  { name: "Intel Gaudi 3 AI Accelerator (128GB)", price: 13500, vram: 128, watts: 600 },
  { name: "NVIDIA RTX 5090 (32GB GDDR7)", price: 2499, vram: 32, watts: 600 },
];

const CPU_SUGGESTIONS = [
  { name: "Threadripper PRO 7995WX 96-Core + 512GB ECC", price: 11800, watts: 350 },
  { name: "Threadripper PRO 7985WX 64-Core + 256GB ECC", price: 6200, watts: 350 },
  { name: "Dual Intel Xeon Platinum 8480+ + 512GB ECC", price: 14500, watts: 700 },
  { name: "AMD EPYC 9654 96-Core Server + 256GB ECC", price: 11200, watts: 360 },
  { name: "AMD Ryzen 9 7950X3D + 128GB DDR5", price: 1800, watts: 170 },
];

const POWER_SUGGESTIONS = [
  { name: "Dual 2000W Redundant Titanium PSUs + Custom Liquid Loop", price: 2200, capacity: 4000 },
  { name: "Superflower 2000W Titanium PSU + Direct Die Liquid Loop", price: 1200, capacity: 2000 },
  { name: "Dual 1600W Titanium Redundant PSUs + AIO Liquid Loop", price: 1650, capacity: 3200 },
  { name: "Corsair AX1600i Titanium + Heavy Duty Air Cooling", price: 650, capacity: 1600 },
];

const STORAGE_SUGGESTIONS = [
  { name: "32TB Enterprise U.2 NVMe RAID + 200GbE ConnectX-7 Card", price: 4800 },
  { name: "16TB U.2 Enterprise RAID + 100GbE ConnectX-6 Card", price: 2400 },
  { name: "8TB Dual PCIe 5.0 NVMe RAID + 10GbE Network Card", price: 980 },
  { name: "4TB PCIe 5.0 NVMe Scratch Drive", price: 450 },
];

export default function RigBuilder() {
  const [configMode, setConfigMode] = useState("presets"); // "presets" | "custom"

  // Preset Selection State
  const [selectedGpu, setSelectedGpu] = useState(GPU_OPTIONS[0]);
  const [selectedCpu, setSelectedCpu] = useState(CPU_RAM_OPTIONS[0]);
  const [selectedPower, setSelectedPower] = useState(POWER_COOLING_OPTIONS[0]);
  const [selectedStorage, setSelectedStorage] = useState(STORAGE_NETWORKING_OPTIONS[0]);
  const [activeGoal, setActiveGoal] = useState(null);

  // Manual Custom Entry State
  const [customGpuName, setCustomGpuName] = useState("NVIDIA H200 SXM (141GB)");
  const [customGpuPrice, setCustomGpuPrice] = useState(18500);
  const [customGpuVram, setCustomGpuVram] = useState(141);
  const [customGpuWatts, setCustomGpuWatts] = useState(700);

  const [customCpuName, setCustomCpuName] = useState("AMD Threadripper PRO 7995WX + 512GB ECC");
  const [customCpuPrice, setCustomCpuPrice] = useState(11800);
  const [customCpuWatts, setCustomCpuWatts] = useState(350);

  const [customPowerName, setCustomPowerName] = useState("Dual 1600W Titanium Redundant PSUs");
  const [customPowerPrice, setCustomPowerPrice] = useState(1650);
  const [customPowerCapacity, setCustomPowerCapacity] = useState(3200);

  const [customStorageName, setCustomStorageName] = useState("16TB U.2 Enterprise RAID + 100GbE Card");
  const [customStoragePrice, setCustomStoragePrice] = useState(2400);

  // Utility Parameters
  const [elecRate, setElecRate] = useState(0.15); // $/kWh
  const [dailyHours, setDailyHours] = useState(24);

  // Trigger Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");

  // Apply Guided Goal Preset
  const handleApplyGoal = (goal) => {
    setActiveGoal(goal.id);
    setSelectedGpu(GPU_OPTIONS[goal.gpuIndex]);
    setSelectedCpu(CPU_RAM_OPTIONS[goal.cpuIndex]);
    setSelectedPower(POWER_COOLING_OPTIONS[goal.powerIndex]);
    setSelectedStorage(STORAGE_NETWORKING_OPTIONS[goal.storageIndex]);
  };

  // Derive active values based on mode
  const currentGpuName = configMode === "custom" ? customGpuName : selectedGpu.name;
  const currentGpuVram = configMode === "custom" ? customGpuVram : selectedGpu.vramGb;
  const gpuPrice = configMode === "custom" ? customGpuPrice : selectedGpu.price;
  const gpuWatts = configMode === "custom" ? customGpuWatts : selectedGpu.watts;

  const cpuPrice = configMode === "custom" ? customCpuPrice : selectedCpu.price;
  const cpuWatts = configMode === "custom" ? customCpuWatts : selectedCpu.watts;

  const powerPrice = configMode === "custom" ? customPowerPrice : selectedPower.price;
  const psuCapacity = configMode === "custom" ? customPowerCapacity : selectedPower.wattsCapacity;

  const storagePrice = configMode === "custom" ? customStoragePrice : selectedStorage.price;
  const storageWatts = configMode === "custom" ? 40 : (selectedStorage.watts || 30);

  // Total CapEx Cost
  const totalCapex = gpuPrice + cpuPrice + powerPrice + storagePrice;

  // Total Watts
  const totalWatts = gpuWatts + cpuWatts + storageWatts + 50;

  // Monthly Electricity Cost ($/mo)
  const monthlyKwh = (totalWatts / 1000) * dailyHours * 30;
  const monthlyPowerCost = (monthlyKwh * elecRate).toFixed(1);

  // PSU Safety Check
  const isPsuDeficit = totalWatts > psuCapacity;

  const handleRequestQuote = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setQuoteSubmitted(true);
    setTimeout(() => {
      setShowQuoteModal(false);
      setQuoteSubmitted(false);
      setEmailInput("");
      setCompanyInput("");
    }, 2500);
  };

  return (
    <section id="rig-builder" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className="pill-tag pill-tag-violet" style={{ marginBottom: "10px" }}>
                🖥️ Workstation Architecture Laboratory
              </span>
              <h2 className="heading-lg" style={{ color: "var(--color-ink-black)", marginTop: "4px", marginBottom: "6px" }}>
                "Build My AI Rig" Hardware Configurator
              </h2>
              <p className="subheading" style={{ maxWidth: "660px" }}>
                Designed for both non-technical buyers (via AI goal presets) and technical engineers (via custom manual hardware specification inputs).
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div style={{ display: "flex", gap: "6px", backgroundColor: "var(--color-paper-white)", padding: "4px", borderRadius: "12px", border: "1px solid var(--color-sand-gray)", boxShadow: "var(--shadow-subtle)" }}>
              <button
                onClick={() => setConfigMode("presets")}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  fontSize: "13px",
                  fontWeight: configMode === "presets" ? 700 : 500,
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: configMode === "presets" ? "var(--color-electric-violet)" : "transparent",
                  color: configMode === "presets" ? "#ffffff" : "var(--color-ink-black)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Guided Presets
              </button>
              <button
                onClick={() => setConfigMode("custom")}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  fontSize: "13px",
                  fontWeight: configMode === "custom" ? 700 : 500,
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: configMode === "custom" ? "var(--color-electric-violet)" : "transparent",
                  color: configMode === "custom" ? "#ffffff" : "var(--color-ink-black)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                ✏️ Manual Custom Spec
              </button>
            </div>
          </div>
        </div>

        {/* Non-Technical Guided Goal Presets Bar */}
        {configMode === "presets" && (
          <div
            style={{
              marginBottom: "28px",
              backgroundColor: "var(--color-paper-white)",
              padding: "16px",
              borderRadius: "18px",
              border: "1px solid var(--color-sand-gray)",
              boxShadow: "var(--shadow-subtle)",
            }}
          >
            <span className="caption-text" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--color-charcoal-stone)", display: "block", marginBottom: "10px" }}>
              💡 NON-TECHNICAL QUICK START: SELECT YOUR AI GOAL
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              {GUIDED_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleApplyGoal(goal)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: activeGoal === goal.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                    backgroundColor: activeGoal === goal.id ? "var(--color-lilac-mist)" : "var(--color-parchment-cream)",
                    color: "var(--color-ink-black)",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontSize: "12.5px", fontWeight: 700 }}>{goal.label}</div>
                  <div style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginTop: "3px" }}>{goal.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Builder Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Configurator Steps */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid var(--color-sand-gray)",
              boxShadow: "var(--shadow-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            {configMode === "presets" ? (
              /* Preset Cards Mode */
              <>
                {/* Step 1: GPU */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)" }}>
                      STEP 1: GPU ACCELERATOR SETUP
                    </label>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-electric-violet)", fontFamily: "var(--font-mono)" }}>
                      {selectedGpu.vramGb}GB VRAM
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {GPU_OPTIONS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGpu(g)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "12px",
                          border: selectedGpu.id === g.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                          backgroundColor: selectedGpu.id === g.id ? "var(--color-lilac-mist)" : "transparent",
                          color: "var(--color-ink-black)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700 }}>{g.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginTop: "2px" }}>{g.desc}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                            ${g.price.toLocaleString()}
                          </div>
                          <div style={{ fontSize: "10.5px", color: "var(--color-ash-gray)" }}>{g.watts}W TGP</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: CPU & Memory */}
                <div>
                  <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                    STEP 2: CPU & SYSTEM ECC MEMORY
                  </label>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {CPU_RAM_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCpu(c)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: selectedCpu.id === c.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                          backgroundColor: selectedCpu.id === c.id ? "var(--color-lilac-mist)" : "transparent",
                          color: "var(--color-ink-black)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "12.5px", fontWeight: 700 }}>{c.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginTop: "2px" }}>{c.desc}</div>
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                          +${c.price.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Power & Cooling */}
                <div>
                  <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                    STEP 3: POWER SUPPLY & DEDICATED THERMALS
                  </label>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {POWER_COOLING_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPower(p)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: selectedPower.id === p.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                          backgroundColor: selectedPower.id === p.id ? "var(--color-lilac-mist)" : "transparent",
                          color: "var(--color-ink-black)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "12.5px", fontWeight: 700 }}>{p.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginTop: "2px" }}>{p.desc}</div>
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                          +${p.price.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Storage & Networking */}
                <div>
                  <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "8px" }}>
                    STEP 4: HIGH-SPEED NVMe STORAGE & NETWORKING
                  </label>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {STORAGE_NETWORKING_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStorage(s)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: selectedStorage.id === s.id ? "1.5px solid var(--color-electric-violet)" : "1px solid var(--color-sand-gray)",
                          backgroundColor: selectedStorage.id === s.id ? "var(--color-lilac-mist)" : "transparent",
                          color: "var(--color-ink-black)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "12.5px", fontWeight: 700 }}>{s.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginTop: "2px" }}>{s.desc}</div>
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                          +${s.price.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Manual Custom Specification Entry Form */
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--color-electric-violet)", paddingBottom: "8px", borderBottom: "1px dashed var(--color-sand-gray)" }}>
                  ✏️ MANUAL HARDWARE SPECIFICATION ENTRY
                </div>

                {/* Custom GPU Entry */}
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "#faf6fe", border: "1px solid rgba(178, 107, 245, 0.25)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-electric-violet)" }}>
                      1. CUSTOM GPU NAME & SPECIFICATIONS:
                    </label>
                    <select
                      onChange={(e) => {
                        const sug = GPU_SUGGESTIONS[parseInt(e.target.value)];
                        if (sug) {
                          setCustomGpuName(sug.name);
                          setCustomGpuPrice(sug.price);
                          setCustomGpuVram(sug.vram);
                          setCustomGpuWatts(sug.watts);
                        }
                      }}
                      style={{ padding: "3px 6px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "11px", backgroundColor: "#ffffff" }}
                    >
                      <option value="">-- Quick Autofill Suggestion --</option>
                      {GPU_SUGGESTIONS.map((s, idx) => (
                        <option key={idx} value={idx}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={customGpuName}
                    onChange={(e) => setCustomGpuName(e.target.value)}
                    placeholder="e.g. 8x NVIDIA H200 SXM5 (1128GB)"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px", marginBottom: "8px" }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>Price ($):</label>
                      <input
                        type="number"
                        value={customGpuPrice}
                        onChange={(e) => setCustomGpuPrice(parseFloat(e.target.value) || 0)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>VRAM (GB):</label>
                      <input
                        type="number"
                        value={customGpuVram}
                        onChange={(e) => setCustomGpuVram(parseInt(e.target.value) || 0)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>TDP (Watts):</label>
                      <input
                        type="number"
                        value={customGpuWatts}
                        onChange={(e) => setCustomGpuWatts(parseInt(e.target.value) || 0)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom CPU/RAM Entry */}
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "#0284c7" }}>
                      2. CUSTOM CPU & SYSTEM RAM:
                    </label>
                    <select
                      onChange={(e) => {
                        const sug = CPU_SUGGESTIONS[parseInt(e.target.value)];
                        if (sug) {
                          setCustomCpuName(sug.name);
                          setCustomCpuPrice(sug.price);
                          setCustomCpuWatts(sug.watts);
                        }
                      }}
                      style={{ padding: "3px 6px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "11px", backgroundColor: "#ffffff" }}
                    >
                      <option value="">-- Quick Autofill Suggestion --</option>
                      {CPU_SUGGESTIONS.map((s, idx) => (
                        <option key={idx} value={idx}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={customCpuName}
                    onChange={(e) => setCustomCpuName(e.target.value)}
                    placeholder="e.g. AMD Threadripper PRO 96-Core + 1TB ECC"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px", marginBottom: "8px" }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>Price ($):</label>
                      <input
                        type="number"
                        value={customCpuPrice}
                        onChange={(e) => setCustomCpuPrice(parseFloat(e.target.value) || 0)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>TDP (Watts):</label>
                      <input
                        type="number"
                        value={customCpuWatts}
                        onChange={(e) => setCustomCpuWatts(parseInt(e.target.value) || 0)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Power Supply Entry */}
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "#fdf4ff", border: "1px solid #f5d0fe" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "#9333ea" }}>
                      3. CUSTOM POWER SUPPLY & COOLING:
                    </label>
                    <select
                      onChange={(e) => {
                        const sug = POWER_SUGGESTIONS[parseInt(e.target.value)];
                        if (sug) {
                          setCustomPowerName(sug.name);
                          setCustomPowerPrice(sug.price);
                          setCustomPowerCapacity(sug.capacity);
                        }
                      }}
                      style={{ padding: "3px 6px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "11px", backgroundColor: "#ffffff" }}
                    >
                      <option value="">-- Quick Autofill Suggestion --</option>
                      {POWER_SUGGESTIONS.map((s, idx) => (
                        <option key={idx} value={idx}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={customPowerName}
                    onChange={(e) => setCustomPowerName(e.target.value)}
                    placeholder="e.g. Dual 2000W Redundant Power + Liquid Cooling"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px", marginBottom: "8px" }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>Price ($):</label>
                      <input
                        type="number"
                        value={customPowerPrice}
                        onChange={(e) => setCustomPowerPrice(parseFloat(e.target.value) || 0)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>PSU Capacity (Watts):</label>
                      <input
                        type="number"
                        value={customPowerCapacity}
                        onChange={(e) => setCustomPowerCapacity(parseInt(e.target.value) || 0)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Storage Entry */}
                <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "#fdf2f8", border: "1px solid #fbcfe8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: "#db2777" }}>
                      4. CUSTOM STORAGE & NETWORK FABRIC:
                    </label>
                    <select
                      onChange={(e) => {
                        const sug = STORAGE_SUGGESTIONS[parseInt(e.target.value)];
                        if (sug) {
                          setCustomStorageName(sug.name);
                          setCustomStoragePrice(sug.price);
                        }
                      }}
                      style={{ padding: "3px 6px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "11px", backgroundColor: "#ffffff" }}
                    >
                      <option value="">-- Quick Autofill Suggestion --</option>
                      {STORAGE_SUGGESTIONS.map((s, idx) => (
                        <option key={idx} value={idx}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={customStorageName}
                    onChange={(e) => setCustomStorageName(e.target.value)}
                    placeholder="e.g. 32TB NVMe SSD RAID + 200GbE ConnectX Card"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-sand-gray)", fontSize: "13px", marginBottom: "8px" }}
                  />
                  <div>
                    <label style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block" }}>Price ($):</label>
                    <input
                      type="number"
                      value={customStoragePrice}
                      onChange={(e) => setCustomStoragePrice(parseFloat(e.target.value) || 0)}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Summary Dashboard & Quote Trigger */}
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              padding: "24px",
              borderRadius: "20px",
              border: isPsuDeficit ? "2px solid #ef4444" : "1.5px solid rgba(178, 107, 245, 0.35)",
              boxShadow: "var(--shadow-subtle-2)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Total CapEx Cost Banner */}
            <div
              style={{
                padding: "18px",
                borderRadius: "16px",
                backgroundColor: "var(--color-ink-black)",
                color: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#a7f3d0", textTransform: "uppercase" }}>
                  TOTAL CAPEX BUILD ESTIMATE
                </span>
                <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                  ${totalCapex.toLocaleString()} <span style={{ fontSize: "12px", color: "#9ca3af" }}>USD</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="pill-tag pill-tag-violet" style={{ fontSize: "11px" }}>
                  {currentGpuVram}GB Total VRAM
                </span>
              </div>
            </div>

            {/* Power & Utility Cost Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ padding: "14px", borderRadius: "14px", backgroundColor: "#faf6fe", border: "1px solid rgba(178, 107, 245, 0.25)" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-electric-violet)", display: "block" }}>
                  ⚡ PEAK POWER DRAW
                </span>
                <span style={{ fontSize: "20px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-ink-black)" }}>
                  {totalWatts} Watts
                </span>
                <span style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block", marginTop: "2px" }}>
                  PSU Limit: {psuCapacity}W
                </span>
              </div>

              <div style={{ padding: "14px", borderRadius: "14px", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0284c7", display: "block" }}>
                  💡 EST. MONTHLY POWER
                </span>
                <span style={{ fontSize: "20px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-ink-black)" }}>
                  ${monthlyPowerCost} <span style={{ fontSize: "11px" }}>/mo</span>
                </span>
                <span style={{ fontSize: "10.5px", color: "var(--color-ash-gray)", display: "block", marginTop: "2px" }}>
                  At ${elecRate}/kWh ({dailyHours}h/day)
                </span>
              </div>
            </div>

            {/* Configurable Electricity Rate Controls */}
            <div style={{ padding: "12px 14px", borderRadius: "12px", backgroundColor: "var(--color-parchment-cream)", border: "1px solid var(--color-sand-gray)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", fontWeight: 700, color: "var(--color-charcoal-stone)", marginBottom: "8px" }}>
                <span>UTILITY TARIFF CONFIGURATION:</span>
                <span>${elecRate}/kWh · {dailyHours} hrs/day</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <label style={{ fontSize: "11px", color: "var(--color-ash-gray)" }}>Tariff ($):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.05"
                  max="0.60"
                  value={elecRate}
                  onChange={(e) => setElecRate(parseFloat(e.target.value) || 0.15)}
                  style={{ width: "70px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                />

                <label style={{ fontSize: "11px", color: "var(--color-ash-gray)", marginLeft: "8px" }}>Usage:</label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseInt(e.target.value))}
                  style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--color-sand-gray)", fontSize: "12px" }}
                >
                  <option value={24}>24/7 Full Load</option>
                  <option value={12}>12 Hours/Day</option>
                  <option value={8}>8 Hours/Day</option>
                </select>
              </div>
            </div>

            {/* Hardware Build Summary */}
            <div style={{ fontSize: "12px", color: "var(--color-charcoal-stone)", lineHeight: 1.5, borderTop: "1px stroke var(--color-sand-gray)", paddingTop: "10px" }}>
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>Active Build Specification:</div>
              • GPU: {currentGpuName}<br />
              • CPU/RAM: {configMode === "custom" ? customCpuName : selectedCpu.name}<br />
              • Power: {configMode === "custom" ? customPowerName : selectedPower.name}<br />
              • Storage: {configMode === "custom" ? customStorageName : selectedStorage.name}
            </div>

            {/* Trigger Custom Quote Modal Button */}
            <button
              onClick={() => setShowQuoteModal(true)}
              className="btn-filled-dark"
              style={{
                width: "100%",
                height: "44px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              📩 Request Custom Rig Quote →
            </button>
          </div>
        </div>

      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
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
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--color-paper-white)",
              borderRadius: "20px",
              maxWidth: "520px",
              width: "100%",
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              border: "1px solid var(--color-sand-gray)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {quoteSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>🎉</div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-ink-black)" }}>Quote Request Submitted!</h3>
                <p style={{ fontSize: "14px", color: "var(--color-charcoal-stone)", marginTop: "8px" }}>
                  Our hardware engineering team will email your custom proposal within 2 business hours.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--color-ink-black)" }}>
                    Request Custom Hardware Quote
                  </h3>
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "var(--color-parchment-cream)", fontSize: "12px", marginBottom: "16px" }}>
                  <strong>Config:</strong> {currentGpuName} (${totalCapex.toLocaleString()})
                </div>

                <form onSubmit={handleRequestQuote} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>
                      WORK EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="engineer@company.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid var(--color-sand-gray)",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal-stone)", display: "block", marginBottom: "4px" }}>
                      COMPANY / ORGANIZATION
                    </label>
                    <input
                      type="text"
                      placeholder="AI Research Lab / Enterprise Inc."
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid var(--color-sand-gray)",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-filled-dark"
                    style={{ height: "42px", marginTop: "8px", fontSize: "14px" }}
                  >
                    Submit Formal Quote Request →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
