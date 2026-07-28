import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getTcoData } from "../api/gpuApi";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="card-paper-white"
      style={{
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "var(--shadow-subtle-3)",
      }}
    >
      <div className="caption-text" style={{ marginBottom: 6 }}>
        UTILIZATION // {label} DAILY
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 13 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "var(--color-charcoal-stone)" }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: "var(--color-ink-black)", marginLeft: "auto" }}>
            ₹{(p.value / 100000).toFixed(2)}L
          </span>
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

  return (
    <section id="economics" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ marginBottom: "40px" }}>
          <span className="pill-tag pill-tag-violet" style={{ marginBottom: "12px" }}>
            Parameters · IN_2026
          </span>
          <h2 className="heading-lg" style={{ color: "var(--color-ink-black)", marginTop: "6px", marginBottom: "8px" }}>
            Amortized TCO Analysis
          </h2>
          <p className="subheading" style={{ maxWidth: "600px" }}>
            Buy vs Rent decision model configured for Indian enterprise compute markets (₹5L CapEx base, ₹7.50/kWh utility tariff, 1.3 PUE cooling factor).
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid-2col" style={{ alignItems: "flex-start", gap: "24px" }}>
          
          {/* Controls & Summary Card */}
          <div className="card-paper-white" style={{ padding: "28px" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label className="caption-text" style={{ color: "var(--color-ink-black)", fontWeight: "600" }}>
                  DAILY RUNTIME
                </label>
                <span style={{ fontFamily: "var(--font-nunito-sans)", fontWeight: "700", color: "var(--color-electric-violet)", fontSize: "17px" }}>
                  {hours} HRS
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "var(--color-electric-violet)",
                  cursor: "pointer",
                }}
              />
            </div>

            {data && (
              <div>
                <div className="caption-text" style={{ marginBottom: "12px" }}>
                  ESTIMATED COST / YEAR
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-sand-gray)", fontSize: "14px" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>RTX 5090 Rig</span>
                  <span style={{ fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--color-ink-black)" }}>
                    ₹{(data.current.workstation / 1000).toFixed(0)}K
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-sand-gray)", fontSize: "14px" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>RunPod 5090</span>
                  <span style={{ fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--color-electric-violet)" }}>
                    ₹{(data.current.runpod / 1000).toFixed(0)}K
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-sand-gray)", fontSize: "14px" }}>
                  <span style={{ color: "var(--color-charcoal-stone)" }}>E2E H200 Spot</span>
                  <span style={{ fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--color-tangerine)" }}>
                    ₹{(data.current.e2e / 1000).toFixed(0)}K
                  </span>
                </div>

                <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "var(--color-parchment-cream)", borderRadius: "12px", border: "1px solid var(--color-sand-gray)" }}>
                  <div className="caption-text" style={{ marginBottom: "4px" }}>
                    PROFILE // INFLECTION
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--color-ink-black)", lineHeight: 1.45 }}>
                    At 8 hours, CapEx amortizes nicely. Consider physical hardware if data sovereignty is required.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Line Chart Surface */}
          <div className="card-paper-white" style={{ padding: "28px 20px" }}>
            {loading ? (
              <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-ash-gray)", fontSize: 14 }}>
                Calculating economic trajectory...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sand-gray)" />
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
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-nunito-sans)", paddingTop: 12 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Line
                    type="monotone"
                    dataKey="Workstation"
                    name="Local Workstation"
                    stroke="var(--color-ink-black)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="RunPod"
                    name="RunPod Cloud"
                    stroke="var(--color-electric-violet)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="E2E H200"
                    name="E2E Spot"
                    stroke="var(--color-tangerine)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Lambda"
                    name="Lambda Cloud"
                    stroke="var(--color-aqua-teal)"
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
