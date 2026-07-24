import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getBandwidthData } from "../api/gpuApi";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="card-paper-white"
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "var(--shadow-subtle-3)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-ink-black)", marginBottom: 2 }}>{d.fullName}</div>
      <div className="caption-text" style={{ marginBottom: 6 }}>ARCH: {d.arch} · {d.gpuClass}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-electric-violet)" }}>{d.bandwidth} TB/s</div>
      <div style={{ fontSize: 12, color: "var(--color-charcoal-stone)", marginTop: 2 }}>Memory: {d.vramGb} GB VRAM</div>
    </div>
  );
};

export default function BandwidthChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBandwidthData()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card-paper-white" style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--color-ash-gray)", fontFamily: "var(--font-nunito-sans)", fontSize: 14 }}>
          Loading bandwidth throughput specifications...
        </div>
      </div>
    );
  }

  return (
    <div className="card-paper-white" style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <span className="pill-tag pill-tag-violet" style={{ marginBottom: 6 }}>
          ✦ HARDWARE CAPACITY
        </span>
        <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-nunito-sans)", marginTop: 6, marginBottom: 4, color: "var(--color-ink-black)" }}>
          Memory Bandwidth Capacity
        </h3>
        <p style={{ fontSize: 14, color: "var(--color-charcoal-stone)", maxWidth: 540 }}>
          Token generation speeds scale with memory interfaces. Higher bandwidth enables faster pipelines.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sand-gray)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--color-charcoal-stone)", fontSize: 12, fontFamily: "var(--font-nunito-sans)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--color-charcoal-stone)", fontSize: 12, fontFamily: "var(--font-nunito-sans)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-parchment-cream)" }} />
          <Bar dataKey="bandwidth" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => {
              const isBlackwell = entry.arch.includes("Blackwell");
              const isHopper = entry.arch.includes("Hopper");
              const fill = isBlackwell ? "var(--color-electric-violet)" : isHopper ? "var(--color-tangerine)" : "var(--color-aqua-teal)";
              return <Cell key={i} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
