import { useEffect, useRef } from "react";

export default function BackgroundConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let dpr = window.devicePixelRatio || 1;
    let widthPx = (canvas.width = window.innerWidth * dpr);
    let heightPx = (canvas.height = window.innerHeight * dpr);

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      widthPx = canvas.width = window.innerWidth * dpr;
      heightPx = canvas.height = window.innerHeight * dpr;
    };
    window.addEventListener("resize", handleResize);

    // Scroll progress (0 to 1)
    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    window.addEventListener("scroll", handleScroll);

    // Dala vibrant chromatic palette
    const colors = [
      "#8052ff", // Electric Iris (violet)
      "#ffb829", // Saffron Spark (amber)
      "#15846e", // Deep Verdant (teal)
      "#e056fd", // Saturated Magenta
      "#00f2fe", // Electric Cyan
      "#38ef7d", // Saturated Emerald
      "#ffffff", // Bone White
    ];

    const numParticles = 800; // High-density particle structure!
    const particles = [];

    // --- 5 Dense, Recognizable GPU Architecture Shapes ---

    // Shape 0: 3D GPU Silicon Die Package & HBM3e Memory Stacks (Hero)
    function getGpuPackageTarget(i) {
      const isCoreDie = i < numParticles * 0.55;
      const isHbmStack = !isCoreDie && i < numParticles * 0.85;

      if (isCoreDie) {
        // Central 3D Die Matrix (21x21 grid)
        const cols = 21;
        const row = Math.floor((i / (numParticles * 0.55)) * cols);
        const col = i % cols;
        const x = (col - 10) * 18;
        const y = (row - 10) * 18;
        const z = Math.sin(row * 0.35 + col * 0.35) * 25;
        return { x, y, z };
      } else if (isHbmStack) {
        // 4 Surrounding HBM3e Memory Cube Stacks
        const stackIdx = i % 4; // Top, Right, Bottom, Left
        const layer = Math.floor(i / 4) % 6;
        const col = Math.floor(i / 24) % 3;

        let cx = 0,
          cy = 0;
        if (stackIdx === 0) {
          cx = 0;
          cy = -230;
        } else if (stackIdx === 1) {
          cx = 230;
          cy = 0;
        } else if (stackIdx === 2) {
          cx = 0;
          cy = 230;
        } else {
          cx = -230;
          cy = 0;
        }

        const x = cx + (col - 1) * 22;
        const y = cy + (layer - 2.5) * 16;
        const z = 40 + layer * 12;
        return { x, y, z };
      } else {
        // Outer PCIe 5.0 / NVLink Interconnect Ring
        const angle = (i / (numParticles * 0.15)) * Math.PI * 2;
        const radius = 310;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: -15,
        };
      }
    }

    // Shape 1: 3D Tensor Core Interconnect Grid (Silicon Landscape)
    function getTensorGridTarget(i) {
      const layer = i % 2; // Dual parallel compute planes
      const idx = Math.floor(i / 2);
      const cols = 20;
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const x = (col - 9.5) * 26;
      const y = (row - 9.5) * 22;
      const z = (layer === 0 ? -60 : 60) + Math.sin(col * 0.4) * 20;
      return { x, y, z };
    }

    // Shape 2: 3D Telemetry Radar Sphere (Stitch Telemetry)
    function getTelemetrySphereTarget(i) {
      const isRing = i > numParticles * 0.8;
      if (isRing) {
        const angle = (i / (numParticles * 0.2)) * Math.PI * 2;
        const radius = 290;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * 70,
          z: Math.sin(angle) * radius,
        };
      } else {
        const phi = Math.acos(-1 + (2 * i) / (numParticles * 0.8));
        const theta = Math.sqrt(numParticles * Math.PI) * phi;
        const r = 210;
        return {
          x: r * Math.cos(theta) * Math.sin(phi),
          y: r * Math.sin(theta) * Math.sin(phi),
          z: r * Math.cos(phi),
        };
      }
    }

    // Shape 3: 3D Multi-GPU Server Rack Nodes (Deployment Modalities)
    function getServerRacksTarget(i) {
      const rack = i % 3;
      const idx = Math.floor(i / 3);
      const posX = [-250, 0, 250][rack];
      const layer = idx % 16;
      const col = Math.floor(idx / 16) % 4;
      const x = posX + (col - 1.5) * 22;
      const y = (layer - 8) * 24;
      const z = Math.sin(layer + rack) * 35;
      return { x, y, z };
    }

    // Shape 4: 3D Möbius Infinity Compute Lattice (TCO & Strategy)
    function getMobiusLatticeTarget(i) {
      const u = (i / numParticles) * Math.PI * 4;
      const v = ((i % 12) - 6) * 14;
      const R = 230;
      const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
      const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
      const z = v * Math.sin(u / 2);
      return { x, y, z };
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      const initTarget = getGpuPackageTarget(i);
      particles.push({
        x: initTarget.x,
        y: initTarget.y,
        z: initTarget.z,
        currX: initTarget.x,
        currY: initTarget.y,
        currZ: initTarget.z,
        dispX: 0,
        dispY: 0,
        size: Math.random() * 2.2 + 2.2,
        color: colors[i % colors.length],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
      });
    }

    // Ambient floating particles
    const ambientParticles = [];
    for (let i = 0; i < 120; i++) {
      ambientParticles.push({
        x: (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: (Math.random() - 0.5) * window.innerHeight * 1.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1.5,
        color: colors[i % colors.length],
        rotation: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.35 + 0.15,
      });
    }

    const bursts = [];
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let targetAngleY = 0;
    let targetAngleX = 0;
    let currentAngleY = 0;
    let currentAngleX = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * dpr;
      mouseY = (e.clientY - window.innerHeight / 2) * dpr;
      isHovering = true;
      targetAngleY = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetAngleX = -(e.clientY / window.innerHeight - 0.5) * 0.8;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetAngleY = 0;
      targetAngleX = 0;
    };

    const handleClick = (e) => {
      const cx = e.clientX * dpr;
      const cy = e.clientY * dpr;

      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 9 + 3) * dpr;
        bursts.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: (Math.random() * 3 + 2.5) * dpr,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.02,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);

    let time = 0;

    const drawCrispTriangle = (x, y, size, angle, color, alpha = 1.0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      const r = size * dpr;
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.866, r * 0.5);
      ctx.lineTo(-r * 0.866, r * 0.5);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.3 * dpr;
      ctx.globalAlpha = alpha;
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      time += 0.014;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, widthPx, heightPx);

      // Determine current 3D GPU shape based on scrollProgress
      const shapeIndex = Math.min(4, Math.floor(scrollProgress * 4.99));
      const shapeFraction = scrollProgress * 4.99 - shapeIndex;

      currentAngleY += (targetAngleY - currentAngleY) * 0.05;
      currentAngleX += (targetAngleX - currentAngleX) * 0.05;

      const autoAngleY =
        time * 0.2 + scrollProgress * Math.PI * 2.2 + currentAngleY;
      const autoAngleX = Math.sin(time * 0.15) * 0.14 + currentAngleX;

      const cosY = Math.cos(autoAngleY);
      const sinY = Math.sin(autoAngleY);
      const cosX = Math.cos(autoAngleX);
      const sinX = Math.sin(autoAngleX);

      // Center offset
      const targetCenterX =
        scrollProgress < 0.15 ? widthPx * 0.72 : widthPx * 0.5;
      const targetCenterY = heightPx * 0.5;

      const projectedPoints = [];

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];

        let s1, s2;
        if (shapeIndex === 0) {
          s1 = getGpuPackageTarget(i);
          s2 = getTensorGridTarget(i);
        } else if (shapeIndex === 1) {
          s1 = getTensorGridTarget(i);
          s2 = getTelemetrySphereTarget(i);
        } else if (shapeIndex === 2) {
          s1 = getTelemetrySphereTarget(i);
          s2 = getServerRacksTarget(i);
        } else if (shapeIndex === 3) {
          s1 = getServerRacksTarget(i);
          s2 = getMobiusLatticeTarget(i);
        } else {
          s1 = getMobiusLatticeTarget(i);
          s2 = getGpuPackageTarget(i);
        }

        const rawTargetX = s1.x + (s2.x - s1.x) * shapeFraction;
        const rawTargetY = s1.y + (s2.y - s1.y) * shapeFraction;
        const rawTargetZ = s1.z + (s2.z - s1.z) * shapeFraction;

        // Organic wave pulse
        const organicWave =
          Math.sin(time * 2.4 + rawTargetX * 0.02) *
          Math.cos(time * 1.8 + rawTargetY * 0.02) *
          12;

        const targetX = rawTargetX;
        const targetY = rawTargetY + organicWave;
        const targetZ = rawTargetZ;

        p.currX += (targetX - p.currX) * 0.07;
        p.currY += (targetY - p.currY) * 0.07;
        p.currZ += (targetZ - p.currZ) * 0.07;

        // Magnetic repulsion
        if (isHovering) {
          const projectedBaseX = (p.currX * cosY - p.currZ * sinY) * dpr;
          const projectedBaseY =
            (p.currY * cosX - (p.currZ * cosY + p.currX * sinY) * sinX) * dpr;
          const dx = projectedBaseX - mouseX;
          const dy = projectedBaseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 * dpr && dist > 0) {
            const push = (1 - dist / (140 * dpr)) * 32;
            p.dispX += ((dx / dist) * push - p.dispX) * 0.12;
            p.dispY += ((dy / dist) * push - p.dispY) * 0.12;
          } else {
            p.dispX *= 0.92;
            p.dispY *= 0.92;
          }
        } else {
          p.dispX *= 0.92;
          p.dispY *= 0.92;
        }

        let x1 = p.currX + p.dispX;
        let y1 = p.currY + p.dispY;
        let z1 = p.currZ;

        let x2 = x1 * cosY - z1 * sinY;
        let z2 = z1 * cosY + x1 * sinY;

        let y2 = y1 * cosX - z2 * sinX;
        let z3 = z2 * cosX + y1 * sinX;

        const perspective = 650 / (650 + z3);
        const projX = targetCenterX + x2 * perspective * dpr;
        const projY = targetCenterY + y2 * perspective * dpr;

        p.rotation += p.rotSpeed;
        const alpha = Math.min(
          0.98,
          Math.max(0.25, (perspective - 0.45) * 1.7),
        );

        drawCrispTriangle(
          projX,
          projY,
          p.size * perspective,
          p.rotation,
          p.color,
          alpha,
        );

        if (z3 < 140) {
          projectedPoints.push({ x: projX, y: projY, color: p.color, alpha });
        }
      }

      // Constellation interconnect lines
      ctx.lineWidth = 0.6 * dpr;
      const maxDist = 48 * dpr;
      for (let i = 0; i < projectedPoints.length; i += 3) {
        const p1 = projectedPoints[i];
        for (let j = i + 1; j < projectedPoints.length; j += 4) {
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22 * p1.alpha;
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Ambient background particles
      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -window.innerWidth / 2) p.x = window.innerWidth / 2;
        if (p.x > window.innerWidth / 2) p.x = -window.innerWidth / 2;
        if (p.y < -window.innerHeight / 2) p.y = window.innerHeight / 2;
        if (p.y > window.innerHeight / 2) p.y = -window.innerHeight / 2;

        p.rotation += 0.01;
        drawCrispTriangle(
          widthPx / 2 + p.x * dpr,
          heightPx / 2 + p.y * dpr,
          p.size,
          p.rotation,
          p.color,
          p.opacity * 0.6,
        );
      }

      // Click bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life -= b.decay;

        if (b.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        drawCrispTriangle(
          b.x,
          b.y,
          b.size * b.life,
          b.rotation,
          b.color,
          b.life,
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
