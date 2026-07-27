import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GpuSplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1); // 1: Box 1, 2: Box 2 drops on Box 1, 3: Box 3 drops on Box 2, 4: Box 4 drops on Box 3
  const [isExiting, setIsExiting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredBox, setHoveredBox] = useState(null);
  const containerRef = useRef(null);

  // Mouse tilt parallax effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMousePos({ x, y });
  };

  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    const duration = 4800; // 4.8 second story-driven assembly

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 24) setStep(1);
      else if (pct < 48) setStep(2);
      else if (pct < 72) setStep(3);
      else setStep(4);

      if (pct < 100) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          handleFinish();
        }, 900);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  // Pure 3D Z-Axis Elevation for Tall 3D Cuboids
  // Cuboid 1 at translateZ(0px)
  // Cuboid 2 at translateZ(115px)
  // Cuboid 3 at translateZ(230px)
  // Cuboid 4 at translateZ(345px)
  const getBoxTargetZ = (boxNum) => {
    if (boxNum === 1) return 0;
    if (boxNum === 2) return step >= 2 ? 115 : 720;
    if (boxNum === 3) return step >= 3 ? 230 : 720;
    if (boxNum === 4) return step >= 4 ? 345 : 720;
    return 0;
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "linear-gradient(180deg, #eef4ff 0%, #f6f0fc 45%, #fdf8fe 100%)",
            color: "#1e162d",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0 18px",
            overflow: "hidden",
            userSelect: "none",
            fontFamily: "var(--font-nunito-sans), sans-serif",
          }}
        >
          {/* Cloudy Sky Gradient Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                radial-gradient(ellipse at 50% 30%, rgba(192, 132, 252, 0.25) 0%, rgba(147, 197, 253, 0.20) 40%, transparent 75%),
                radial-gradient(circle at 18% 22%, rgba(244, 114, 182, 0.25) 0%, transparent 45%),
                radial-gradient(circle at 82% 35%, rgba(56, 189, 248, 0.28) 0%, transparent 50%),
                radial-gradient(circle at 45% 80%, rgba(168, 85, 247, 0.20) 0%, transparent 55%),
                linear-gradient(rgba(147, 197, 253, 0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 197, 253, 0.12) 1px, transparent 1px)
              `,
              backgroundSize:
                "100% 100%, 100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px",
              pointerEvents: "none",
            }}
          />

          {/* VISIBLE ATMOSPHERIC SIDE CLOUDS */}
          <motion.div
            animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "-50px",
              top: "12%",
              width: "360px",
              height: "220px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.88) 0%, rgba(244, 114, 182, 0.25) 45%, transparent 70%)",
              filter: "blur(26px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          <motion.div
            animate={{ x: [20, -20, 20], y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            style={{
              position: "absolute",
              right: "-60px",
              top: "22%",
              width: "380px",
              height: "240px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.88) 0%, rgba(147, 197, 253, 0.30) 45%, transparent 70%)",
              filter: "blur(28px)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Dust Particles */}
          <div className="gpu-particle-field" style={{ opacity: 0.3 }} />

          {/* Top Brand Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              zIndex: 10,
              marginTop: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/logo_choice_3.png"
                alt="GPU Scout Logo"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  objectFit: "cover",
                  boxShadow: "0 4px 18px rgba(168, 85, 247, 0.35)",
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  color: "#1e162d",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-nunito-sans)",
                }}
              >
                GPU SCOUT SILICON ENGINE
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#8b5cf6",
                textTransform: "uppercase",
              }}
            >
              FOUR LAYER CUBOID HARDWARE ARCHITECTURE
            </div>
          </motion.div>

          {/* MAIN 3D CUBOID STACK ASSEMBLY STAGE (PERFECT CLEARANCE ABOVE LAYER 4 WITH ZERO TEXT OVERLAP) */}
          <div
            style={{
              perspective: 1800,
              width: "100%",
              flex: 1,
              maxHeight: "390px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transform: "translateY(55px) scale(0.80)",
              filter: "drop-shadow(0 32px 48px rgba(30, 15, 55, 0.32))",
            }}
          >
            <div
              style={{
                width: 350,
                height: 240,
                position: "relative",
                transformStyle: "preserve-3d",
                // 52deg pitch, -26deg yaw (Exposes 3D Top, Front, & Side Cuboid Faces)
                transform: `rotateX(${52 + mousePos.y * -6}deg) rotateZ(${-26 + mousePos.x * 8}deg)`,
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* VERTICAL SIDE POWER CORDS */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scaleZ: 0 }}
                  animate={{ opacity: 1, scaleZ: 1 }}
                  style={{
                    position: "absolute",
                    left: -14,
                    top: 0,
                    width: 10,
                    height: 240,
                    borderRadius: 5,
                    background:
                      "linear-gradient(180deg, #38bdf8 0%, #a855f7 50%, #ec4899 100%)",
                    boxShadow: "0 0 18px rgba(56, 189, 248, 0.85)",
                    transformStyle: "preserve-3d",
                    transform: "translateZ(180px)",
                    zIndex: 10,
                  }}
                />
              )}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scaleZ: 0 }}
                  animate={{ opacity: 1, scaleZ: 1 }}
                  style={{
                    position: "absolute",
                    right: -14,
                    top: 0,
                    width: 10,
                    height: 240,
                    borderRadius: 5,
                    background:
                      "linear-gradient(180deg, #f472b6 0%, #c084fc 50%, #38bdf8 100%)",
                    boxShadow: "0 0 18px rgba(244, 114, 182, 0.85)",
                    transformStyle: "preserve-3d",
                    transform: "translateZ(180px)",
                    zIndex: 10,
                  }}
                />
              )}

              {/* CUBOID 1: BASE FOUNDATION MODEL CHASSIS (55px DEEP 3D CUBOID) */}
              <motion.div
                onMouseEnter={() => setHoveredBox(1)}
                onMouseLeave={() => setHoveredBox(null)}
                animate={{
                  z: getBoxTargetZ(1),
                  scale: hoveredBox === 1 ? 1.03 : 1,
                  boxShadow:
                    hoveredBox === 1
                      ? "0 0 70px rgba(178, 107, 245, 0.9)"
                      : "0 0 45px rgba(178, 107, 245, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  background:
                    "linear-gradient(145deg, #1f1f2c 0%, #0e0e18 100%)",
                  border: "2.5px solid rgba(178, 107, 245, 0.85)",
                  padding: 18,
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                {/* 1. FRONT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -55,
                    left: -2.5,
                    right: -2.5,
                    height: 55,
                    borderRadius: "0 0 22px 22px",
                    background:
                      "linear-gradient(180deg, #161624 0%, #06060a 100%)",
                    border: "2.5px solid rgba(178, 107, 245, 0.75)",
                    borderTop: "none",
                    transform: "rotateX(-90deg)",
                    transformOrigin: "top center",
                    boxShadow: "inset 0 0 18px rgba(178, 107, 245, 0.55)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 900,
                      color: "#d8b4fe",
                      letterSpacing: "0.12em",
                    }}
                  >
                    LAYER 1 — FOUNDATION SUBSTRATE CHASSIS
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#22c55e",
                        boxShadow: "0 0 8px #22c55e",
                      }}
                    />
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#38bdf8",
                        boxShadow: "0 0 8px #38bdf8",
                      }}
                    />
                  </div>
                </div>

                {/* 2. RIGHT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    top: -2.5,
                    bottom: -2.5,
                    right: -55,
                    width: 55,
                    borderRadius: "0 22px 22px 0",
                    background:
                      "linear-gradient(90deg, #141420 0%, #050508 100%)",
                    border: "2.5px solid rgba(178, 107, 245, 0.65)",
                    borderLeft: "none",
                    transform: "rotateY(90deg)",
                    transformOrigin: "left center",
                    boxShadow: "inset 0 0 16px rgba(178, 107, 245, 0.45)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "rgba(178, 107, 245, 0.85)",
                    }}
                  />
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "rgba(6, 182, 212, 0.85)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: "var(--font-mono)",
                      color: "#d8b4fe",
                      letterSpacing: "0.14em",
                    }}
                  >
                    NEURAL FOUNDATION BASE
                  </div>
                  {hoveredBox === 1 && (
                    <span
                      style={{
                        fontSize: 10,
                        background: "rgba(178, 107, 245, 0.3)",
                        border: "1px solid #d8b4fe",
                        padding: "2px 8px",
                        borderRadius: 8,
                        color: "#f3e8ff",
                      }}
                    >
                      MODELS ONLINE
                    </span>
                  )}
                </div>

                {/* 3 Prominent 3D Pedestals for OpenAI, DeepSeek, Claude */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 20,
                    gap: 10,
                  }}
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.06 }}
                    style={{
                      flex: 1,
                      height: 72,
                      borderRadius: 16,
                      background:
                        "linear-gradient(145deg, rgba(6, 182, 212, 0.32), rgba(6, 182, 212, 0.08))",
                      border: "1.5px solid rgba(6, 182, 212, 0.8)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 24px rgba(6, 182, 212, 0.5)",
                      transform: "translateZ(24px)",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>🐋</span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        color: "#67e8f9",
                        marginTop: 4,
                        letterSpacing: "0.05em",
                      }}
                    >
                      DEEPSEEK R1
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -6, scale: 1.06 }}
                    style={{
                      flex: 1,
                      height: 72,
                      borderRadius: 16,
                      background:
                        "linear-gradient(145deg, rgba(244, 114, 182, 0.32), rgba(244, 114, 182, 0.08))",
                      border: "1.5px solid rgba(244, 114, 182, 0.8)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 24px rgba(244, 114, 182, 0.5)",
                      transform: "translateZ(24px)",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>❇️</span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        color: "#f472b6",
                        marginTop: 4,
                        letterSpacing: "0.05em",
                      }}
                    >
                      CLAUDE 3.5
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -6, scale: 1.06 }}
                    style={{
                      flex: 1,
                      height: 72,
                      borderRadius: 16,
                      background:
                        "linear-gradient(145deg, rgba(178, 107, 245, 0.32), rgba(178, 107, 245, 0.08))",
                      border: "1.5px solid rgba(178, 107, 245, 0.8)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 24px rgba(178, 107, 245, 0.5)",
                      transform: "translateZ(24px)",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>✴️</span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        color: "#c084fc",
                        marginTop: 4,
                        letterSpacing: "0.05em",
                      }}
                    >
                      OPENAI GPT
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* CUBOID 2: COMPUTE ENGINE CHASSIS (55px DEEP 3D CUBOID DROPS STRAIGHT DOWN IN 3D Z-AXIS ONTO CUBOID 1) */}
              <motion.div
                onMouseEnter={() => setHoveredBox(2)}
                onMouseLeave={() => setHoveredBox(null)}
                animate={{
                  z: getBoxTargetZ(2),
                  scale: hoveredBox === 2 ? 1.03 : 1,
                  boxShadow:
                    step >= 2
                      ? "0 0 70px rgba(6, 182, 212, 0.9)"
                      : "0 0 45px rgba(6, 182, 212, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  background:
                    "linear-gradient(135deg, rgba(16, 28, 52, 0.95) 0%, rgba(8, 14, 28, 0.98) 100%)",
                  border: "2.5px solid rgba(6, 182, 212, 0.85)",
                  padding: 18,
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                {/* 1. FRONT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -55,
                    left: -2.5,
                    right: -2.5,
                    height: 55,
                    borderRadius: "0 0 22px 22px",
                    background:
                      "linear-gradient(180deg, #0e1e34 0%, #030812 100%)",
                    border: "2.5px solid rgba(6, 182, 212, 0.75)",
                    borderTop: "none",
                    transform: "rotateX(-90deg)",
                    transformOrigin: "top center",
                    boxShadow: "inset 0 0 18px rgba(6, 182, 212, 0.55)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 900,
                      color: "#67e8f9",
                      letterSpacing: "0.12em",
                    }}
                  >
                    LAYER 2 — HBM3E COMPUTE ENGINE CHASSIS
                  </span>
                  <div
                    style={{
                      width: 10,
                      height: 5,
                      borderRadius: 3,
                      background: "#06b6d4",
                      boxShadow: "0 0 10px #06b6d4",
                    }}
                  />
                </div>

                {/* 2. RIGHT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    top: -2.5,
                    bottom: -2.5,
                    right: -55,
                    width: 55,
                    borderRadius: "0 22px 22px 0",
                    background:
                      "linear-gradient(90deg, #0a1628 0%, #030812 100%)",
                    border: "2.5px solid rgba(6, 182, 212, 0.65)",
                    borderLeft: "none",
                    transform: "rotateY(90deg)",
                    transformOrigin: "left center",
                    boxShadow: "inset 0 0 16px rgba(6, 182, 212, 0.45)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "#06b6d4",
                    }}
                  />
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "#38bdf8",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: "var(--font-mono)",
                      color: "#06b6d4",
                      letterSpacing: "0.14em",
                    }}
                  >
                    COMPUTE & MEMORY STACK
                  </div>
                  {hoveredBox === 2 && (
                    <span
                      style={{
                        fontSize: 10,
                        background: "rgba(6, 182, 212, 0.3)",
                        border: "1px solid #06b6d4",
                        padding: "2px 8px",
                        borderRadius: 8,
                        color: "#a5f3fc",
                      }}
                    >
                      4.80 TB/s BUS
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      width: 145,
                    }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: 7,
                          borderRadius: 3.5,
                          background:
                            i % 2 === 0
                              ? "linear-gradient(90deg, #38bdf8, #818cf8)"
                              : "linear-gradient(90deg, #ec4899, #c084fc)",
                          boxShadow: "0 0 12px rgba(56, 189, 248, 0.6)",
                        }}
                      />
                    ))}
                  </div>

                  {/* 3D Holographic Sphere */}
                  <div
                    style={{
                      width: 66,
                      height: 66,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(56, 189, 248, 0.95) 0%, rgba(178, 107, 245, 0.4) 60%, transparent 100%)",
                      border: "2.5px solid #38bdf8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        hoveredBox === 2
                          ? "0 0 40px rgba(56, 189, 248, 0.95)"
                          : "0 0 25px rgba(56, 189, 248, 0.8)",
                      transform: "translateZ(24px)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 30,
                        animation: "spin 6s linear infinite",
                      }}
                    >
                      🌐
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* CUBOID 3: MULTIMODAL PIPELINE CHASSIS (55px DEEP 3D CUBOID DROPS STRAIGHT DOWN IN 3D Z-AXIS ONTO CUBOID 2) */}
              <motion.div
                onMouseEnter={() => setHoveredBox(3)}
                onMouseLeave={() => setHoveredBox(null)}
                animate={{
                  z: getBoxTargetZ(3),
                  scale: hoveredBox === 3 ? 1.03 : 1,
                  boxShadow:
                    step >= 3
                      ? "0 0 70px rgba(236, 72, 153, 0.9)"
                      : "0 0 45px rgba(236, 72, 153, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  background:
                    "linear-gradient(135deg, rgba(38, 18, 62, 0.95) 0%, rgba(18, 8, 32, 0.98) 100%)",
                  border: "2.5px solid rgba(236, 72, 153, 0.85)",
                  padding: 18,
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                  zIndex: 3,
                }}
              >
                {/* 1. FRONT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -55,
                    left: -2.5,
                    right: -2.5,
                    height: 55,
                    borderRadius: "0 0 22px 22px",
                    background:
                      "linear-gradient(180deg, #260f38 0%, #060307 100%)",
                    border: "2.5px solid rgba(236, 72, 153, 0.75)",
                    borderTop: "none",
                    transform: "rotateX(-90deg)",
                    transformOrigin: "top center",
                    boxShadow: "inset 0 0 18px rgba(236, 72, 153, 0.55)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 900,
                      color: "#f472b6",
                      letterSpacing: "0.12em",
                    }}
                  >
                    LAYER 3 — MULTIMODAL PIPELINES CHASSIS
                  </span>
                  <div
                    style={{
                      width: 10,
                      height: 5,
                      borderRadius: 3,
                      background: "#ec4899",
                      boxShadow: "0 0 10px #ec4899",
                    }}
                  />
                </div>

                {/* 2. RIGHT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    top: -2.5,
                    bottom: -2.5,
                    right: -55,
                    width: 55,
                    borderRadius: "0 22px 22px 0",
                    background:
                      "linear-gradient(90deg, #1d0a2c 0%, #060307 100%)",
                    border: "2.5px solid rgba(236, 72, 153, 0.65)",
                    borderLeft: "none",
                    transform: "rotateY(90deg)",
                    transformOrigin: "left center",
                    boxShadow: "inset 0 0 16px rgba(236, 72, 153, 0.45)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "#ec4899",
                    }}
                  />
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "#f472b6",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: "var(--font-mono)",
                      color: "#ec4899",
                      letterSpacing: "0.14em",
                    }}
                  >
                    MULTIMODAL AI PIPELINES
                  </div>
                  {hoveredBox === 3 && (
                    <span
                      style={{
                        fontSize: 10,
                        background: "rgba(236, 72, 153, 0.3)",
                        border: "1px solid #ec4899",
                        padding: "2px 8px",
                        borderRadius: 8,
                        color: "#fbcfe8",
                      }}
                    >
                      PIPELINES ACTIVE
                    </span>
                  )}
                </div>

                {/* 3 Prominent 3D Vertical Glass Cards */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginTop: 16,
                  }}
                >
                  <div style={{ display: "flex", gap: 10 }}>
                    <motion.div
                      whileHover={{ y: -6, scale: 1.08 }}
                      style={{
                        width: 48,
                        height: 64,
                        borderRadius: 14,
                        background: "rgba(59, 130, 246, 0.42)",
                        border: "1.5px solid #60a5fa",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(96, 165, 250, 0.8)",
                        transform: "translateZ(26px)",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>🎙️</span>
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 900,
                          color: "#93c5fd",
                          marginTop: 3,
                          letterSpacing: "0.05em",
                        }}
                      >
                        AUDIO
                      </span>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -6, scale: 1.08 }}
                      style={{
                        width: 48,
                        height: 64,
                        borderRadius: 14,
                        background: "rgba(219, 39, 119, 0.42)",
                        border: "1.5px solid #f472b6",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(244, 114, 182, 0.8)",
                        transform: "translateZ(26px)",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>🎬</span>
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 900,
                          color: "#fbcfe8",
                          marginTop: 3,
                          letterSpacing: "0.05em",
                        }}
                      >
                        VIDEO
                      </span>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -6, scale: 1.08 }}
                      style={{
                        width: 48,
                        height: 64,
                        borderRadius: 14,
                        background: "rgba(16, 185, 129, 0.42)",
                        border: "1.5px solid #34d399",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(52, 211, 153, 0.8)",
                        transform: "translateZ(26px)",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>🖼️</span>
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 900,
                          color: "#a7f3d0",
                          marginTop: 3,
                          letterSpacing: "0.05em",
                        }}
                      >
                        VISION
                      </span>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #b26bf5, #ec4899)",
                      border: "2px solid #f472b6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 28px rgba(236, 72, 153, 0.9)",
                      transform: "translateZ(26px)",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>⚡</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* CUBOID 4: TOP FLAGSHIP RTX 5090 SHROUD CHASSIS (55px DEEP 3D CUBOID DROPS STRAIGHT DOWN IN 3D Z-AXIS ONTO CUBOID 3) */}
              <motion.div
                onMouseEnter={() => setHoveredBox(4)}
                onMouseLeave={() => setHoveredBox(null)}
                animate={{
                  z: getBoxTargetZ(4),
                  scale: hoveredBox === 4 ? 1.03 : 1,
                  boxShadow:
                    step === 4
                      ? "0 0 85px rgba(178, 107, 245, 0.95)"
                      : "0 0 50px rgba(178, 107, 245, 0.65)",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  background:
                    "linear-gradient(135deg, #3e3e4c 0%, #1c1c26 100%)",
                  border: "2.5px solid rgba(255, 255, 255, 0.75)",
                  padding: 18,
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                  zIndex: 4,
                }}
              >
                {/* 1. FRONT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -55,
                    left: -2.5,
                    right: -2.5,
                    height: 55,
                    borderRadius: "0 0 22px 22px",
                    background:
                      "linear-gradient(180deg, #282836 0%, #0a0a0e 100%)",
                    border: "2.5px solid rgba(255, 255, 255, 0.6)",
                    borderTop: "none",
                    transform: "rotateX(-90deg)",
                    transformOrigin: "top center",
                    boxShadow: "inset 0 0 18px rgba(255, 255, 255, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 900,
                      color: "#ffffff",
                      letterSpacing: "0.12em",
                    }}
                  >
                    LAYER 4 — FLAGSHIP RTX 5090 FE CHASSIS
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#22c55e",
                        boxShadow: "0 0 8px #22c55e",
                      }}
                    />
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#38bdf8",
                        boxShadow: "0 0 8px #38bdf8",
                      }}
                    />
                  </div>
                </div>

                {/* 2. RIGHT 3D CUBOID WALL (Height 55px) */}
                <div
                  style={{
                    position: "absolute",
                    top: -2.5,
                    bottom: -2.5,
                    right: -55,
                    width: 55,
                    borderRadius: "0 22px 22px 0",
                    background:
                      "linear-gradient(90deg, #20202c 0%, #09090e 100%)",
                    border: "2.5px solid rgba(255, 255, 255, 0.55)",
                    borderLeft: "none",
                    transform: "rotateY(90deg)",
                    transformOrigin: "left center",
                    boxShadow: "inset 0 0 16px rgba(255, 255, 255, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "rgba(255, 255, 255, 0.85)",
                    }}
                  />
                  <div
                    style={{
                      width: 28,
                      height: 4,
                      borderRadius: 2,
                      background: "rgba(168, 85, 247, 0.85)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        fontFamily: "var(--font-mono)",
                        color: "#ffffff",
                        letterSpacing: "0.08em",
                      }}
                    >
                      RTX 5090
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.75)",
                        letterSpacing: "0.12em",
                      }}
                    >
                      BLACKWELL ARCHITECTURE — 32GB GDDR7
                    </div>
                  </div>

                  <div
                    style={{
                      width: 100,
                      height: 34,
                      borderRadius: 10,
                      background: "rgba(59, 130, 246, 0.28)",
                      border: "1.5px solid rgba(96, 165, 250, 0.6)",
                      boxShadow: "inset 0 0 14px rgba(59, 130, 246, 0.5)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      width: 82,
                      height: 82,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, #18181b 30%, #27272a 70%, #09090b 100%)",
                      border: "3px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      boxShadow: "0 0 28px rgba(0,0,0,0.95)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: step === 4 ? 0.7 : 2.5,
                        ease: "linear",
                      }}
                      style={{
                        width: 72,
                        height: 72,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="66"
                        height="66"
                        viewBox="0 0 100 100"
                        fill="none"
                      >
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                          <rect
                            key={i}
                            x="46"
                            y="10"
                            width="8"
                            height="35"
                            rx="4"
                            fill="rgba(255,255,255,0.35)"
                            transform={`rotate(${deg} 50 50)`}
                          />
                        ))}
                        <circle cx="50" cy="50" r="16" fill="#b26bf5" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* HUD TELEMETRY & STORYTELLING COPY SAFELY LOWERED WITH WIDE CLEARANCE */}
          <div
            style={{
              width: "90%",
              maxWidth: 580,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              zIndex: 10,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1e162d",
                lineHeight: 1.45,
                textShadow: "0 2px 12px rgba(255, 255, 255, 0.9)",
                maxWidth: 540,
                minHeight: 40,
              }}
            >
              {step === 1 &&
                "Neural foundation weights from DeepSeek, Claude, and OpenAI establish the intelligent core base."}
              {step === 2 &&
                "High bandwidth memory arrays unlock 4.8 TB per second throughput, eliminating latency bottlenecks."}
              {step === 3 &&
                "Multimodal processing engines ignite real-time audio synthesis, 4K video generation, and vision perception."}
              {step === 4 &&
                "The flagship Blackwell architecture seals the four-layer stack into an uncompromised enterprise AI factory."}
            </motion.div>

            <div
              style={{
                width: "100%",
                height: 7,
                borderRadius: 4,
                background: "rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.12)",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #0284c7 0%, #8b5cf6 50%, #ec4899 100%)",
                  boxShadow: "0 0 16px rgba(139, 92, 246, 0.65)",
                  transition: "width 0.1s linear",
                }}
              />
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "var(--font-mono)",
                color: "#7e22ce",
                letterSpacing: "0.06em",
              }}
            >
              CALIBRATING HARDWARE STACK — {progress}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
