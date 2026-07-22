import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getTcoData } from "../api/gpuApi";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--colors-surface-dark)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "14px 18px",
      fontFamily: "var(--font-sans)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    }}>
      <div style={{ fontSize: 11, marginBottom: 8, color: "var(--colors-on-dark-soft)", fontFamily: "var(--font-mono)" }}>
        UTILIZATION // {label} DAILY
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 12 }}>
          <div style={{ width: 6, height: 6, background: p.color }} />
          <span style={{ color: "var(--colors-on-dark-soft)" }}>{p.name.toUpperCase()}:</span>
          <span style={{ fontWeight: 700, color: "var(--colors-on-dark)" }}>₹{(p.value / 100000).toFixed(2)}L</span>
        </div>
      ))}
    </div>
  );
};

export default function TcoAnalysis() {
  const [hours, setHours] = useState(8);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (h) => {
    try {
      const result = await getTcoData(h);
      setData(result);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(hours);
  }, [hours, fetchData]);

  const chartData = data?.chart
    ? data.chart.labels.map((label, i) => ({
        name: label,
        Workstation: data.chart.workstation[i],
        RunPod: data.chart.runpod[i],
        "E2E H200": data.chart.e2e[i],
        Lambda: data.chart.lambda[i],
      }))
    : [];

  const getProfileStyle = (profile) => {
    if (profile === "Ad-Hoc") return { bg: "rgba(204, 120, 92, 0.1)", border: "rgba(204, 120, 92, 0.2)", color: "var(--colors-primary)" };
    if (profile === "Inflection") return { bg: "rgba(232, 165, 90, 0.1)", border: "rgba(232, 165, 90, 0.2)", color: "var(--colors-accent-amber)" };
    return { bg: "rgba(93, 184, 166, 0.12)", border: "rgba(93, 184, 166, 0.2)", color: "var(--colors-accent-teal)" };
  };

  return (
    <section id="economics" className="section-spacing" style={{ scrollMarginTop: 80, background: "var(--colors-canvas)" }}>
      <div className="section-container">
        <div style={{ marginBottom: 48 }}>
          <h2 className="section-title">Amortized TCO Analysis</h2>
          <p className="section-subtitle">
            Buy vs Rent decision model configured for Indian enterprise compute markets (₹5L CapEx base, ₹7.50/kWh utility tariff, 1.3 PUE cooling factor).
          </p>
        </div>

        <div className="responsive-tco-panel">
          <div className="responsive-tco-sidebar">
            <div>
              <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 500, fontFamily: "var(--font-display)" }}>Parameters</h3>
                <span className="badge badge-slate">IN_2026</span>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--colors-muted)" }}>DAILY RUNTIME</label>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: "var(--colors-primary)",
                    background: "rgba(204, 120, 92, 0.1)",
                    padding: "4px 10px",
                    borderRadius: 4,
                    fontSize: 12,
                  }}>
                    {hours} HRS
                  </span>
                </div>
                <input
                  type="range"
                  className="tco-slider"
                  min="1"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              {data && (
                <div style={{
                  background: "var(--colors-canvas)",
                  border: "1px solid var(--colors-hairline)",
                  padding: 20,
                  borderRadius: 8,
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--colors-muted)", marginBottom: 16 }}>
                    ESTIMATED COST / YEAR
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--colors-hairline-soft)", fontSize: 13 }}>
                    <span style={{ color: "var(--colors-body)" }}>RTX 5090 Rig</span>
                    <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--colors-ink)" }}>₹{(data.current.workstation / 1000).toFixed(0)}K</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--colors-hairline-soft)", fontSize: 13 }}>
                    <span style={{ color: "var(--colors-body)" }}>RunPod 5090</span>
                    <span style={{ fontWeight: 600, color: "var(--colors-primary)", fontFamily: "var(--font-mono)" }}>₹{(data.current.runpod / 1000).toFixed(0)}K</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--colors-body)" }}>E2E H200 Spot</span>
                    <span style={{ fontWeight: 600, color: "var(--colors-accent-teal)", fontFamily: "var(--font-mono)" }}>₹{(data.current.e2e / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              )}
            </div>

            {data && (
              <div style={{ marginTop: 24 }}>
                {(() => {
                  const ps = getProfileStyle(data.profile);
                  return (
                    <div style={{
                      padding: 16,
                      background: ps.bg,
                      border: `1px solid ${ps.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      color: ps.color,
                      lineHeight: 1.5,
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>PROFILE // {data.profile.toUpperCase()}</div>
                      {data.verdict}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div id="tco-graph" className="responsive-tco-chart">
            {loading ? (
              <div style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--colors-muted)", fontFamily: "var(--font-sans)", fontSize: 13 }}>
                Calculating economic paths...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--colors-hairline-soft)" />
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
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-sans)", paddingTop: 16 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Line
                    type="monotone"
                    dataKey="Workstation"
                    name="Local Workstation"
                    stroke="var(--colors-ink)"
                    strokeWidth={3}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="RunPod"
                    name="RunPod Cloud"
                    stroke="var(--colors-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="E2E H200"
                    name="E2E Spot"
                    stroke="var(--colors-accent-teal)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Lambda"
                    name="Lambda Cloud"
                    stroke="var(--colors-accent-amber)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
