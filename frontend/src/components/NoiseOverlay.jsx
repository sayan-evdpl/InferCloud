import { useEffect, useRef } from "react";

export default function NoiseOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    const w = (canvas.width = 200);
    const h = (canvas.height = 200);

    const generateNoise = () => {
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise; // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = 12; // Low opacity noise alpha
      }

      ctx.putImageData(imgData, 0, 0);
    };

    let frame = 0;
    const loop = () => {
      frame++;
      if (frame % 3 === 0) {
        // Animate noise frame every 3 ticks
        generateNoise();
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        opacity: 0.045, // Subtle grain depth
        mixBlendMode: "screen",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
