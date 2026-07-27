import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// Initial Clean White AI Factory Stage
export default function HeroSection({ onRevealPlatform }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".ai-factory-pill",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
      )
        .fromTo(
          ".ai-factory-title",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          ".ai-factory-subhead",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          ".ai-factory-ctas",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          ".ai-factory-stage",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.4",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      style={{
        position: "relative",
        paddingTop: "145px",
        paddingBottom: "40px",
        backgroundColor: "#fcf8fc",
        backgroundImage: `
          radial-gradient(circle at 20% 25%, rgba(244, 114, 182, 0.13) 0%, transparent 45%),
          radial-gradient(circle at 80% 30%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 75%, rgba(178, 107, 245, 0.11) 0%, transparent 60%),
          linear-gradient(180deg, #fdf8fd 0%, #f6f0fa 50%, #f0f4fe 100%)
        `,
        overflow: "hidden",
      }}
    >
      {/* Volumetric Fluffy Clouds Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ x: [-25, 25, -25], y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50px",
            left: "-30px",
            filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.05))",
          }}
        >
          <svg width="240" height="110" viewBox="0 0 240 110" fill="none">
            <path
              d="M 30 85 C 10 85, 0 68, 12 50 C 18 32, 40 28, 52 38 C 65 16, 108 10, 130 32 C 145 16, 188 16, 205 38 C 225 38, 238 55, 225 78 C 218 90, 195 90, 185 85 Z"
              fill="#ffffff"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [30, -30, 30], y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "70px",
            right: "-30px",
            filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.05))",
          }}
        >
          <svg width="260" height="120" viewBox="0 0 260 120" fill="none">
            <path
              d="M 35 95 C 12 95, 0 75, 15 55 C 22 35, 45 30, 58 42 C 72 18, 118 12, 142 35 C 160 18, 205 18, 222 42 C 245 42, 258 60, 245 85 C 238 98, 212 98, 200 95 Z"
              fill="#ffffff"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [-35, 35, -35] }}
          transition={{ repeat: Infinity, duration: 24, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "260px",
            left: "2%",
            filter: "drop-shadow(0 8px 18px rgba(0, 0, 0, 0.04))",
          }}
        >
          <svg width="180" height="80" viewBox="0 0 180 80" fill="none">
            <path
              d="M 20 62 C 8 62, 0 50, 10 36 C 15 22, 30 18, 40 26 C 50 10, 82 6, 98 22 C 110 10, 140 10, 152 26 C 168 26, 178 38, 168 56 Z"
              fill="#ffffff"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [35, -35, 35] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "300px",
            right: "3%",
            filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.04))",
          }}
        >
          <svg width="200" height="90" viewBox="0 0 200 90" fill="none">
            <path
              d="M 25 70 C 10 70, 0 56, 12 40 C 18 26, 35 22, 45 30 C 55 12, 92 8, 110 26 C 122 12, 155 12, 168 30 C 185 30, 195 44, 185 64 Z"
              fill="#ffffff"
            />
          </svg>
        </motion.div>
      </div>

      <div
        className="section-container"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* Centered Headline Stack */}
        <div
          style={{
            maxWidth: "840px",
            margin: "0 auto",
            textAlign: "center",
            marginBottom: "18px",
          }}
        >
          <div style={{ marginBottom: "12px" }} className="ai-factory-pill">
            <span
              className="pill-tag"
              style={{
                backgroundColor: "var(--color-paper-white)",
                border: "1px solid var(--color-sand-gray)",
                color: "var(--color-charcoal-stone)",
                fontSize: "13px",
                padding: "6px 18px",
                borderRadius: "9999px",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              ✦ The GPU Intelligence Engine
            </span>
          </div>

          <h1
            className="ai-factory-title display-title"
            style={{
              color: "var(--color-ink-black)",
              marginBottom: "12px",
              fontFamily: "var(--font-new-kansas)",
              fontWeight: 400,
              fontSize: "54px",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Build AI faster with <br />
            <span style={{ color: "var(--color-ink-black)" }}>GPU Scout</span>
          </h1>

          <p
            className="ai-factory-subhead subheading"
            style={{
              color: "var(--color-charcoal-stone)",
              maxWidth: "600px",
              margin: "0 auto 18px auto",
              fontSize: "18px",
              lineHeight: 1.5,
            }}
          >
            Now with GPU Scout Managed Inference for breakthrough speed and
            scale.
          </p>

          {/* Action Buttons */}
          <div
            className="ai-factory-ctas"
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className="btn-filled-dark"
              onClick={onRevealPlatform}
              style={{
                height: "46px",
                padding: "0 28px",
                fontSize: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(29, 29, 28, 0.25)",
              }}
            >
              Learn more
            </button>

            <button
              className="btn-outlined-violet"
              onClick={onRevealPlatform}
              style={{
                height: "46px",
                padding: "0 24px",
                fontSize: "15px",
                borderRadius: "12px",
                border: "none",
                color: "var(--color-charcoal-stone)",
                backgroundColor: "transparent",
                fontWeight: "600",
              }}
            >
              Try for free ›
            </button>
          </div>
        </div>

        {/* High-Detail 3D Isometric AI Assembly Laboratory Stage */}
        <div
          className="ai-factory-stage"
          style={{ maxWidth: "1060px", margin: "0 auto", position: "relative" }}
        >
          <svg
            viewBox="0 0 1000 490"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <defs>
              <pattern
                id="pcbGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(216, 214, 206, 0.6)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </pattern>

              {/* Electric Violet Laser Beam Gradient */}
              <linearGradient id="laserBeam" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#b26bf5" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f4f3ea" />
              </linearGradient>

              {/* Soft Light Bluish Pinkish Mint Multi-Hue Gradient Outlining */}
              <linearGradient id="cloudOutlineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#b26bf5" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* High-Contrast Vivid Theme Rain Gradient */}
              <linearGradient id="rainStreamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
                <stop offset="50%" stopColor="#b26bf5" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* 3D Extruded Base Platform (Thick Isometric Pedestal) */}
            <path
              d="M 80 340 L 500 445 L 920 340 L 920 365 L 500 470 L 80 365 Z"
              fill="#d8d6ce"
              stroke="#1d1d1c"
              strokeWidth="2.5"
            />
            <path d="M 80 365 L 500 470 L 500 445 Z" fill="#c4c1b5" />

            {/* Base Top PCB Surface Grid */}
            <path
              d="M 80 340 L 500 445 L 920 340 L 500 235 Z"
              fill="url(#pcbGrid)"
              stroke="#1d1d1c"
              strokeWidth="2.5"
            />

            {/* Corner LED Beacons on Base (Theme Pink/Violet/Cyan) */}
            <circle
              cx="80"
              cy="340"
              r="5"
              fill="#b26bf5"
              stroke="#1d1d1c"
              strokeWidth="2"
            />
            <circle
              cx="920"
              cy="340"
              r="5"
              fill="#ec4899"
              stroke="#1d1d1c"
              strokeWidth="2"
            />
            <circle
              cx="500"
              cy="445"
              r="5"
              fill="#38bdf8"
              stroke="#1d1d1c"
              strokeWidth="2"
            />

            <path
              d="M 220 310 L 500 380 L 780 310 M 500 380 L 500 440"
              stroke="#b5b2a4"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Inter-unit Connection Cables */}
            <path
              d="M 240 300 Q 320 340 430 300"
              stroke="#1d1d1c"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="5 5"
            />
            <path
              d="M 590 300 Q 640 330 710 270"
              stroke="#1d1d1c"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="5 5"
            />

            {/* Animated Traveling Data Pulses Along Track (Vibrant Rose Pink) */}
            <motion.circle
              cx="220"
              cy="310"
              r="5"
              fill="#ec4899"
              stroke="#1d1d1c"
              strokeWidth="1.5"
              animate={{ cx: [220, 500, 780], cy: [310, 380, 310] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
            />

            {/* ================= LEFT UNIT: CODE MATRIX & DENSE VIVID RAIN CLOUD ================= */}
            <g transform="translate(140, 140)">
              {/* CLOUD WITH SOFT MULTI-HUE OUTLINE & HIGH-CONTRAST VIVID RAIN */}
              <motion.g
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 35 45 C 15 45, 5 25, 30 12 C 45 -5, 80 -5, 95 18 C 115 8, 140 28, 125 45 Z"
                  fill="url(#cloudGrad)"
                  stroke="url(#cloudOutlineGrad)"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 4px 12px rgba(178, 107, 245, 0.2))"
                />

                {/* HIGHLY VISIBLE VIVID DATA RAIN LINES */}
                <line
                  x1="45"
                  y1="45"
                  x2="45"
                  y2="105"
                  stroke="#b26bf5"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="60"
                  y1="45"
                  x2="60"
                  y2="105"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="75"
                  y1="45"
                  x2="75"
                  y2="105"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="90"
                  y1="45"
                  x2="90"
                  y2="105"
                  stroke="#b26bf5"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="105"
                  y1="45"
                  x2="105"
                  y2="105"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="118"
                  y1="45"
                  x2="118"
                  y2="105"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* ANIMATED DOWNWARD TRAVELING RAIN DROPLETS */}
                <motion.circle
                  cx="60"
                  cy="45"
                  r="3"
                  fill="#ec4899"
                  animate={{ cy: [45, 105] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                />
                <motion.circle
                  cx="90"
                  cy="45"
                  r="3"
                  fill="#b26bf5"
                  animate={{ cy: [45, 105] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                    delay: 0.3,
                  }}
                />
                <motion.circle
                  cx="118"
                  cy="45"
                  r="3"
                  fill="#38bdf8"
                  animate={{ cy: [45, 105] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.3,
                    ease: "linear",
                    delay: 0.6,
                  }}
                />
              </motion.g>

              {/* Server Base Box */}
              <path
                d="M 20 120 L 110 80 L 200 120 L 110 160 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 20 120 L 20 170 L 110 210 L 110 160 Z"
                fill="#edeae4"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 110 160 L 110 210 L 200 170 L 200 120 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />

              {/* Glowing Violet-Pink Inner Tray */}
              <path
                d="M 45 125 L 110 95 L 175 125 L 110 155 Z"
                fill="#f5e6ff"
                stroke="#b26bf5"
                strokeWidth="1.5"
              />

              {/* Front Vent Grille & LED Indicators */}
              <line
                x1="40"
                y1="155"
                x2="40"
                y2="185"
                stroke="#1d1d1c"
                strokeWidth="2"
              />
              <line
                x1="48"
                y1="159"
                x2="48"
                y2="189"
                stroke="#1d1d1c"
                strokeWidth="2"
              />
              <line
                x1="56"
                y1="163"
                x2="56"
                y2="193"
                stroke="#1d1d1c"
                strokeWidth="2"
              />

              {/* Primary 3D Floating Cube 1 (Theme Electric Violet) */}
              <motion.g
                animate={{ y: [-10, 6, -10], rotate: [-4, 4, -4] }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 80 95 L 100 85 L 120 95 L 100 105 Z"
                  fill="#b26bf5"
                  stroke="#1d1d1c"
                  strokeWidth="2"
                />
                <path
                  d="M 80 95 L 80 115 L 100 125 L 100 105 Z"
                  fill="#9333ea"
                  stroke="#1d1d1c"
                  strokeWidth="2"
                />
                <path
                  d="M 100 105 L 100 125 L 120 115 L 120 95 Z"
                  fill="#c084fc"
                  stroke="#1d1d1c"
                  strokeWidth="2"
                />
              </motion.g>

              {/* Secondary 3D Floating Cube 2 (Theme Rose Pink) */}
              <motion.g
                animate={{ y: [6, -10, 6] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 130 110 L 142 104 L 154 110 L 142 116 Z"
                  fill="#ec4899"
                  stroke="#1d1d1c"
                  strokeWidth="1.5"
                />
                <path
                  d="M 130 110 L 130 122 L 142 128 L 142 116 Z"
                  fill="#db2777"
                  stroke="#1d1d1c"
                  strokeWidth="1.5"
                />
                <path
                  d="M 142 116 L 142 128 L 154 122 L 154 110 Z"
                  fill="#f472b6"
                  stroke="#1d1d1c"
                  strokeWidth="1.5"
                />
              </motion.g>

              {/* Tiny Floating Cube 3 (Theme Cyan Blue) */}
              <motion.g
                animate={{ y: [-4, 8, -4] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 60 105 L 70 100 L 80 105 L 70 110 Z"
                  fill="#38bdf8"
                  stroke="#1d1d1c"
                  strokeWidth="1.5"
                />
                <path
                  d="M 60 105 L 60 113 L 70 118 L 70 110 Z"
                  fill="#0284c7"
                  stroke="#1d1d1c"
                  strokeWidth="1.5"
                />
                <path
                  d="M 70 110 L 70 118 L 80 113 L 80 105 Z"
                  fill="#7dd3fc"
                  stroke="#1d1d1c"
                  strokeWidth="1.5"
                />
              </motion.g>
            </g>

            {/* ================= CENTER UNIT: DUAL STACKED POD WITH ELECTRIC TURBINE FAN ================= */}
            <g transform="translate(410, 140)">
              {/* Upward Pulsing Laser Cone (Violet/Pink) */}
              <polygon
                points="90,10 110,10 130,220 70,220"
                fill="url(#laserBeam)"
              />

              {/* FLOATING CLOUD ON CENTER */}
              <motion.g
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 55 35 C 40 35, 30 18, 52 2 C 65 -12, 98 -12, 112 5 C 130 -2, 150 18, 138 35 Z"
                  fill="url(#cloudGrad)"
                  stroke="url(#cloudOutlineGrad)"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 4px 12px rgba(178, 107, 245, 0.2))"
                />
                <line
                  x1="68"
                  y1="35"
                  x2="68"
                  y2="80"
                  stroke="#b26bf5"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1="85"
                  y1="35"
                  x2="85"
                  y2="80"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1="102"
                  y1="35"
                  x2="102"
                  y2="80"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1="118"
                  y1="35"
                  x2="118"
                  y2="80"
                  stroke="#b26bf5"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />

                <motion.circle
                  cx="85"
                  cy="35"
                  r="3"
                  fill="#ec4899"
                  animate={{ cy: [35, 80] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    ease: "linear",
                  }}
                />
                <motion.circle
                  cx="102"
                  cy="35"
                  r="3"
                  fill="#38bdf8"
                  animate={{ cy: [35, 80] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "linear",
                    delay: 0.4,
                  }}
                />
              </motion.g>

              {/* Top Server Module */}
              <path
                d="M 20 100 L 100 60 L 180 100 L 100 140 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 20 100 L 20 150 L 100 190 L 100 140 Z"
                fill="#edeae4"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 100 140 L 100 190 L 180 150 L 180 100 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />

              {/* THEMED ELECTRIC VIOLET CIRCULAR HOUSING */}
              <ellipse
                cx="100"
                cy="100"
                rx="44"
                ry="23"
                fill="#b26bf5"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="38"
                ry="19"
                fill="#e9d5ff"
                stroke="#1d1d1c"
                strokeWidth="1.5"
              />

              {/* HIGHLY DETAILED 7-BLADE TURBINE FAN */}
              <g transform="translate(100, 100)">
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "linear",
                  }}
                >
                  {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map(
                    (angle, idx) => (
                      <g key={idx} transform={`rotate(${angle})`}>
                        <path
                          d="M 0 0 Q 12 -12 28 -4 Q 18 10 0 0 Z"
                          fill="#1d1d1c"
                          stroke="#1d1d1c"
                          strokeWidth="1"
                        />
                      </g>
                    ),
                  )}
                  <circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill="#ffffff"
                    stroke="#1d1d1c"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="0" r="3.5" fill="#ec4899" />
                </motion.g>
              </g>

              {/* Bottom Server Module (WHITE MIDDLE BIG CUBE) */}
              <path
                d="M 20 160 L 100 120 L 180 160 L 100 200 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 20 160 L 20 210 L 100 250 L 100 200 Z"
                fill="#edeae4"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 100 200 L 100 250 L 180 210 L 180 160 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />

              {/* ISOMETRIC "GPU" TEXT WRITTEN DIRECTLY ON TOP FACE OF WHITE MIDDLE BIG CUBE */}
              <text
                x="100"
                y="162"
                textAnchor="middle"
                fill="#1d1d1c"
                fontSize="22"
                fontWeight="900"
                fontFamily="var(--font-nunito-sans)"
                letterSpacing="0.08em"
              >
                GPU
              </text>

              {/* Front Panel LED Status Indicators (Theme Cyan & Violet) */}
              <circle
                cx="45"
                cy="180"
                r="3.5"
                fill="#38bdf8"
                stroke="#1d1d1c"
                strokeWidth="1"
              />
              <circle
                cx="58"
                cy="186"
                r="3.5"
                fill="#b26bf5"
                stroke="#1d1d1c"
                strokeWidth="1"
              />
              <circle
                cx="71"
                cy="192"
                r="3.5"
                fill="#ec4899"
                stroke="#1d1d1c"
                strokeWidth="1"
              />
            </g>

            {/* ================= RIGHT UNIT: DATACENTER & TURBINE FAN ================= */}
            <g transform="translate(690, 120)">
              {/* FLOATING CLOUD ON RIGHT */}
              <motion.g
                animate={{ y: [-6, 4, -6] }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 40 40 C 20 40, 10 20, 35 5 C 50 -12, 85 -12, 100 10 C 118 0, 142 20, 128 40 Z"
                  fill="url(#cloudGrad)"
                  stroke="url(#cloudOutlineGrad)"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 4px 12px rgba(178, 107, 245, 0.2))"
                />
                <line
                  x1="50"
                  y1="40"
                  x2="50"
                  y2="100"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1="68"
                  y1="40"
                  x2="68"
                  y2="100"
                  stroke="#b26bf5"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1="86"
                  y1="40"
                  x2="86"
                  y2="100"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1="104"
                  y1="40"
                  x2="104"
                  y2="100"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <line
                  x1="118"
                  y1="40"
                  x2="118"
                  y2="100"
                  stroke="#b26bf5"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />

                <motion.circle
                  cx="68"
                  cy="40"
                  r="3"
                  fill="#b26bf5"
                  animate={{ cy: [40, 100] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.3,
                    ease: "linear",
                  }}
                />
                <motion.circle
                  cx="104"
                  cy="40"
                  r="3"
                  fill="#ec4899"
                  animate={{ cy: [40, 100] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                    delay: 0.5,
                  }}
                />
              </motion.g>

              {/* Tower Server Box */}
              <path
                d="M 20 110 L 90 75 L 160 110 L 90 145 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 20 110 L 20 230 L 90 265 L 90 145 Z"
                fill="#edeae4"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <path
                d="M 90 145 L 90 265 L 160 230 L 160 110 Z"
                fill="#ffffff"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />

              {/* THEMED ROSE PINK ROTATING TURBINE FAN HOUSING ON RIGHT TOWER TOP */}
              <ellipse
                cx="90"
                cy="110"
                rx="38"
                ry="19"
                fill="#ec4899"
                stroke="#1d1d1c"
                strokeWidth="2.5"
              />
              <g transform="translate(90, 110)">
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                >
                  {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map(
                    (angle, idx) => (
                      <g key={idx} transform={`rotate(${angle})`}>
                        <path
                          d="M 0 0 Q 10 -10 24 -3 Q 15 8 0 0 Z"
                          fill="#1d1d1c"
                          stroke="#1d1d1c"
                          strokeWidth="1"
                        />
                      </g>
                    ),
                  )}
                  <circle
                    cx="0"
                    cy="0"
                    r="7"
                    fill="#ffffff"
                    stroke="#1d1d1c"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="0" r="3" fill="#b26bf5" />
                </motion.g>
              </g>

              {/* Vents & LEDs */}
              <line
                x1="35"
                y1="160"
                x2="75"
                y2="180"
                stroke="#1d1d1c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="35"
                y1="175"
                x2="75"
                y2="195"
                stroke="#1d1d1c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="35"
                y1="190"
                x2="75"
                y2="210"
                stroke="#1d1d1c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <circle
                cx="110"
                cy="165"
                r="3.5"
                fill="#38bdf8"
                stroke="#1d1d1c"
                strokeWidth="1"
              />
              <circle
                cx="125"
                cy="158"
                r="3.5"
                fill="#b26bf5"
                stroke="#1d1d1c"
                strokeWidth="1"
              />
              <circle
                cx="140"
                cy="151"
                r="3.5"
                fill="#ec4899"
                stroke="#1d1d1c"
                strokeWidth="1"
              />

              {/* Small Isometric Laptop / Terminal Beside Tower */}
              <g transform="translate(-40, 70)">
                <path
                  d="M 0 30 L 25 18 L 50 30 L 25 42 Z"
                  fill="#ffffff"
                  stroke="#1d1d1c"
                  strokeWidth="1.5"
                />
                <path
                  d="M 5 28 L 25 18 L 45 28 L 25 38 Z"
                  fill="#e9d5ff"
                  stroke="#b26bf5"
                  strokeWidth="1"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

// Twilight / Pink GPU Thinking Partner Section
export function ThinkingPartnerSection({ onSearchOpen, onRatesOpen }) {
  return (
    <section
      id="thinking-partner"
      className="bg-twilight-sky"
      style={{
        position: "relative",
        paddingTop: "120px",
        paddingBottom: "100px",
        overflow: "hidden",
      }}
    >
      <div
        className="section-container"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* Centered Headline Stack */}
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            textAlign: "center",
            marginBottom: "56px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <span className="pill-tag pill-tag-violet">
              ✦ ENTERPRISE GPU INTELLIGENCE
            </span>
          </div>

          <h2
            className="display-title"
            style={{
              color: "var(--color-ink-black)",
              marginBottom: "20px",
              fontFamily: "var(--font-new-kansas)",
              fontWeight: 400,
              fontSize: "48px",
              letterSpacing: "-0.023em",
            }}
          >
            Meet your GPU thinking partner.
          </h2>

          <p
            className="subheading"
            style={{
              color: "var(--color-charcoal-stone)",
              maxWidth: "640px",
              margin: "0 auto 32px auto",
              fontSize: "18px",
              lineHeight: 1.5,
            }}
          >
            Silicons represent the core unit of platform scaling. Compare memory
            bandwidth, hardware breakevens, and live cloud spot pricing across
            Hopper and Blackwell architectures.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button className="btn-filled-dark" onClick={onRatesOpen}>
              Search GPUs & Rates
            </button>
            <button className="btn-outlined-violet" onClick={onSearchOpen}>
              Quick search ⌘K
            </button>
          </div>
        </div>

        {/* 3D Isometric GPU Compute Node Showcase with Subtle Floating Motion */}
        <div style={{ maxWidth: "1120px", margin: "0 auto 40px auto" }}>
          <motion.div
            animate={{
              rotateZ: [-0.4, 0.4, -0.4],
              rotateY: [-0.8, 0.8, -0.8],
              y: [-3, 3, -3],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }}
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(178, 107, 245, 0.25)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(16px)",
              boxShadow:
                "0 16px 40px rgba(0, 0, 0, 0.06), 0 0 25px rgba(178, 107, 245, 0.12)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              padding: "24px 32px",
              gap: "24px",
            }}
          >
            {/* Left Info Column */}
            <div>
              <span
                className="pill-tag pill-tag-violet"
                style={{ marginBottom: "12px" }}
              >
                ✦ NEXT-GEN SILICON COMPUTE
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-new-kansas)",
                  fontSize: "32px",
                  fontWeight: "400",
                  color: "var(--color-ink-black)",
                  lineHeight: "1.2",
                  marginBottom: "12px",
                }}
              >
                Architectural Intelligence & Hardware Telemetry
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-nunito-sans)",
                  fontSize: "15px",
                  color: "var(--color-charcoal-stone)",
                  lineHeight: "1.5",
                  marginBottom: "20px",
                }}
              >
                Explore real-time memory bandwidth limits, CapEx vs. OpEx
                breakevens, and live cloud spot tariffs across Hopper,
                Blackwell, and Ada Lovelace architectures.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <span className="pill-tag pill-tag-violet">
                  141 GB HBM3e Memory
                </span>
                <span className="pill-tag pill-tag-violet">
                  4.80 TB/s Bandwidth
                </span>
                <span className="pill-tag pill-tag-violet">
                  Live Spot Marketplace
                </span>
              </div>
            </div>

            {/* Right 3D Isometric Render Image */}
            <div
              style={{
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <img
                src="/gpu_compute_node.png"
                alt="3D Isometric GPU Compute Node"
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Floating Product Card Stack */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "20px",
            maxWidth: "1120px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Card 1: Metric Card */}
          <div
            className="card-paper-white"
            style={{
              gridColumn: "span 4",
              transform: "rotate(-1.5deg)",
            }}
          >
            <div className="caption-text" style={{ marginBottom: "6px" }}>
              Memory Bandwidth
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  fontFamily: "var(--font-nunito-sans)",
                  color: "var(--color-ink-black)",
                }}
              >
                1.79 TB/s
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--color-forest-green)",
                }}
              >
                +54% vs RTX 4090
              </span>
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: "var(--color-ash-gray)",
              }}
            >
              512-bit GDDR7 bus interface
            </div>
          </div>

          {/* Card 2: AI Prompt Input */}
          <div
            className="card-paper-white"
            style={{
              gridColumn: "span 4",
              transform: "rotate(0.5deg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div className="caption-text" style={{ marginBottom: "8px" }}>
                AI Hardware Query
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--color-ink-black)",
                  fontWeight: "500",
                  marginBottom: "12px",
                }}
              >
                How many nodes do we need to fit our{" "}
                <span className="pill-tag pill-tag-violet">@Q1 70B Model</span>?
              </div>
            </div>

            <div
              className="ai-prompt-container"
              onClick={onSearchOpen}
              style={{ cursor: "pointer" }}
            >
              <span
                className="ai-prompt-input"
                style={{ fontSize: "13px", color: "var(--color-ash-gray)" }}
              >
                Ask AI assistant...
              </span>
              <button className="ai-send-circle">→</button>
            </div>
          </div>

          {/* Card 3: Chart Metric Card */}
          <div
            className="card-paper-white"
            style={{
              gridColumn: "span 4",
              transform: "rotate(1.8deg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span className="caption-text">H200 Spot Rate</span>
              <span
                className="pill-tag"
                style={{
                  backgroundColor: "var(--color-mint-wash)",
                  color: "var(--color-forest-green)",
                  border: "none",
                }}
              >
                Live Lowest
              </span>
            </div>

            <div
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "var(--color-ink-black)",
              }}
            >
              $1.99 / hr
            </div>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "6px",
                alignItems: "flex-end",
                height: "28px",
              }}
            >
              {[40, 65, 45, 80, 95, 70, 100].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    backgroundColor:
                      i % 2 === 0
                        ? "var(--color-tangerine)"
                        : "var(--color-electric-violet)",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
