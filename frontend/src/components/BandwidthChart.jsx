import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getBandwidthData } from "../api/gpuApi";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "var(--colors-surface-dark)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "14px 18px",
      fontFamily: "var(--font-sans)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--colors-on-dark)", marginBottom: 4 }}>{d.fullName}</div>
      <div style={{ fontSize: 11, color: "var(--colors-on-dark-soft)", marginBottom: 8 }}>ARCH: {d.arch} · {d.gpuClass}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--colors-primary)" }}>{d.bandwidth} TB/s</div>
      <div style={{ fontSize: 11, color: "var(--colors-on-dark-soft)", marginTop: 4 }}>Memory: {d.vramGb} GB VRAM</div>
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
      <div className="chart-container" style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontSize: 13 }}>Loading bandwidth specifications...</div>
      </div>
    );
  }

  return (
    <div className="chart-container" style={{ background: "var(--colors-canvas)", border: "1px solid var(--colors-hairline)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Memory Bandwidth Capacity</h3>
          <p style={{ fontSize: 13, color: "var(--colors-muted)" }}>
            Token generation speeds scale with memory interfaces. Higher bandwidth enables faster pipelines.
          </p>
        </div>
        <span className="badge badge-rose">TB/S</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--colors-hairline-soft)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--colors-muted)", fontSize: 10, fontFamily: "var(--font-sans)" }}
            axisLine={{ stroke: "var(--colors-hairline)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--colors-muted)", fontSize: 10, fontFamily: "var(--font-sans)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--colors-surface-soft)" }} />
          <Bar dataKey="bandwidth" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, i) => {
              const isBlackwell = entry.arch.includes("Blackwell");
              const isHopper = entry.arch.includes("Hopper");
              const fill = isBlackwell ? "var(--colors-primary)" : isHopper ? "var(--colors-ink)" : "var(--colors-muted)";
              return <Cell key={i} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
