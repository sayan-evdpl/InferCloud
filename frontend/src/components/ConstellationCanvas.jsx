import { useEffect, useRef } from "react";

export default function ConstellationCanvas({ width = "100%", height = "600px" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let widthPx = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let heightPx = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      widthPx = canvas.width = canvas.parentElement.clientWidth;
      heightPx = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Track scroll progress for scroll-driven morphing
    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    window.addEventListener("scroll", handleScroll);

    // Dala chromatic palette
    const colors = [
      "#8052ff", // Electric Iris (violet)
      "#ffb829", // Saffron Spark (amber)
      "#15846e", // Deep Verdant (teal)
      "#e056fd", // Saturated Magenta
      "#38ef7d", // Saturated Emerald
      "#3b82f6", // Electric Blue
      "#ffffff", // Bone White
    ];

    // Generate points for organic brain shape in 3D
    const brainParticles = [];
    const numBrainParticles = 1400;
    const brainRadius = Math.min(widthPx, heightPx) * 0.35;

    for (let i = 0; i < numBrainParticles; i++) {
      const hemisphere = Math.random() > 0.5 ? 1 : -1;
      
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      let rx = Math.sin(phi) * Math.cos(theta);
      let ry = Math.cos(phi) * 0.78;
      let rz = Math.sin(phi) * Math.sin(theta);

      rx = rx * 0.85 + hemisphere * 0.38;
      const wrinkle = Math.sin(rx * 14) * Math.cos(ry * 14) * Math.sin(rz * 14) * 0.14;

      const scale = (0.75 + wrinkle) * brainRadius;
      const x = rx * scale;
      const y = ry * scale - 15;
      const z = rz * scale;

      brainParticles.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        x,
        y,
        z,
        size: Math.random() * 2.5 + 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        pulseSpeed: Math.random() * 0.025 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        dispX: 0,
        dispY: 0,
      });
    }

    // Ambient floating background particles
    const ambientParticles = [];
    const numAmbient = 360;
    for (let i = 0; i < numAmbient; i++) {
      ambientParticles.push({
        x: (Math.random() - 0.5) * widthPx * 1.6,
        y: (Math.random() - 0.5) * heightPx * 1.6,
        z: (Math.random() - 0.5) * 500,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.5 + 0.2,
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
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left - widthPx / 2;
      mouseY = e.clientY - rect.top - heightPx / 2;
      isHovering = true;
      targetAngleY = (mouseX / widthPx) * 0.9;
      targetAngleX = (-mouseY / heightPx) * 0.9;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetAngleY = 0;
      targetAngleX = 0;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        bursts.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.02,
        });
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    let time = 0;

    const drawOutlinedTriangle = (ctx, x, y, size, angle, color, alpha = 1.0, glow = false) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      const r = size;
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.866, r * 0.5);
      ctx.lineTo(-r * 0.866, r * 0.5);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = glow ? 1.8 : 1.2;
      ctx.globalAlpha = alpha;
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      time += 0.012;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, widthPx, heightPx);

      // Radial aura glow
      const auraGrad = ctx.createRadialGradient(
        widthPx / 2,
        heightPx / 2 - 15,
        10,
        widthPx / 2,
        heightPx / 2 - 15,
        brainRadius * (1.3 + scrollProgress * 0.4)
      );
      auraGrad.addColorStop(0, "rgba(128, 82, 255, 0.14)");
      auraGrad.addColorStop(0.6, "rgba(255, 184, 41, 0.04)");
      auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, widthPx, heightPx);

      currentAngleY += (targetAngleY - currentAngleY) * 0.06;
      currentAngleX += (targetAngleX - currentAngleX) * 0.06;

      // Scroll progress drives rotation & morph expansion
      const autoAngleY = time * 0.22 + scrollProgress * Math.PI * 2 + currentAngleY;
      const autoAngleX = Math.sin(time * 0.16) * 0.12 + scrollProgress * 0.5 + currentAngleX;

      const cosY = Math.cos(autoAngleY);
      const sinY = Math.sin(autoAngleY);
      const cosX = Math.cos(autoAngleX);
      const sinX = Math.sin(autoAngleX);

      const centerX = widthPx / 2;
      const centerY = heightPx / 2;

      const projectedBrain = [];
      const morphScale = 1.0 + Math.sin(scrollProgress * Math.PI) * 0.25;

      for (let i = 0; i < brainParticles.length; i++) {
        const p = brainParticles[i];

        if (isHovering) {
          const projectedBaseX = (p.baseX * morphScale) * cosY - (p.baseZ * morphScale) * sinY;
          const projectedBaseY = (p.baseY * morphScale) * cosX - ((p.baseZ * morphScale) * cosY + (p.baseX * morphScale) * sinY) * sinX;
          const dx = projectedBaseX - mouseX;
          const dy = projectedBaseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const push = (1 - dist / 120) * 25;
            p.dispX += ( (dx / dist) * push - p.dispX ) * 0.1;
            p.dispY += ( (dy / dist) * push - p.dispY ) * 0.1;
          } else {
            p.dispX *= 0.92;
            p.dispY *= 0.92;
          }
        } else {
          p.dispX *= 0.92;
          p.dispY *= 0.92;
        }

        let x1 = (p.baseX * morphScale + p.dispX) * cosY - (p.baseZ * morphScale) * sinY;
        let z1 = (p.baseZ * morphScale) * cosY + (p.baseX * morphScale + p.dispX) * sinY;

        let y1 = (p.baseY * morphScale + p.dispY) * cosX - z1 * sinX;
        let z2 = z1 * cosX + (p.baseY * morphScale + p.dispY) * sinX;

        const perspective = 600 / (600 + z2);
        const projX = centerX + x1 * perspective;
        const projY = centerY + y1 * perspective;

        p.rotation += p.rotSpeed;
        const alpha = Math.min(1.0, Math.max(0.2, (perspective - 0.5) * 1.9));
        const pulse = 1 + Math.sin(time * 3 + p.pulseOffset) * 0.22;

        drawOutlinedTriangle(
          ctx,
          projX,
          projY,
          p.size * perspective * pulse,
          p.rotation,
          p.color,
          alpha,
          perspective > 1.15
        );

        if (z2 < 140) {
          projectedBrain.push({ x: projX, y: projY, color: p.color, alpha });
        }
      }

      // Constellation links
      ctx.lineWidth = 0.6;
      const maxConnectDist = 48 + scrollProgress * 10;
      for (let i = 0; i < projectedBrain.length; i += 3) {
        const p1 = projectedBrain[i];
        for (let j = i + 1; j < projectedBrain.length; j += 4) {
          const p2 = projectedBrain[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * 0.22 * p1.alpha;
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Ambient Floating Background Particles
      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -widthPx / 2) p.x = widthPx / 2;
        if (p.x > widthPx / 2) p.x = -widthPx / 2;
        if (p.y < -heightPx / 2) p.y = heightPx / 2;
        if (p.y > heightPx / 2) p.y = -heightPx / 2;

        p.rotation += p.rotSpeed;

        drawOutlinedTriangle(
          ctx,
          centerX + p.x,
          centerY + p.y,
          p.size,
          p.rotation,
          p.color,
          p.opacity * 0.6
        );
      }

      // Click Bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life -= b.decay;

        if (b.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        drawOutlinedTriangle(
          ctx,
          b.x,
          b.y,
          b.size * b.life,
          b.rotation,
          b.color,
          b.life,
          true
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden", background: "#000000" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", cursor: "crosshair" }} />
    </div>
  );
}
