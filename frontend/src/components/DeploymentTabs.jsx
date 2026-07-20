import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalGpus, getCloudProviders, getSystems } from "../api/gpuApi";
import GpuCard from "./GpuCard";
import CloudTable from "./CloudTable";
import SystemCard from "./SystemCard";
import { CardSkeleton, TableRowSkeleton } from "./SkeletonLoader";

const tabs = [
  { id: "local", label: "Local Physical GPUs", badge: "badge-emerald", badgeText: "Max Sovereignty" },
  { id: "cloud", label: "Cloud GPU Rentals", badge: "badge-cyan", badgeText: "High Elasticity" },
  { id: "systems", label: "Workstations & Mobile", badge: "badge-amber", badgeText: "Edge & Prototype" },
];

export default function DeploymentTabs({ onSelectCard, compareList, onToggleCompare }) {
  const [activeTab, setActiveTab] = useState("local");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [localData, setLocalData] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [cloudData, setCloudData] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [systemData, setSystemData] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });

  const [localPage, setLocalPage] = useState(1);
  const [cloudPage, setCloudPage] = useState(1);
  const [systemPage, setSystemPage] = useState(1);

  const [localSearch, setLocalSearch] = useState("");
  const [localQuery, setLocalQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    if (activeTab === "local") {
      getLocalGpus({ page: localPage, limit: 3, q: localQuery })
        .then(setLocalData)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (activeTab === "cloud") {
      getCloudProviders({ page: cloudPage, limit: 5 })
        .then(setCloudData)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      getSystems({ page: systemPage, limit: 3 })
        .then(systemData => {
          // If items key is not present, wrap it gracefully
          if (Array.isArray(systemData)) {
            setSystemData({ items: systemData, pagination: { page: 1, totalPages: 1 } });
          } else {
            setSystemData(systemData);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [activeTab, localPage, cloudPage, systemPage, localQuery]);

  // Reset page pagination on tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderPagination = (pInfo, setPage) => {
    if (!pInfo || pInfo.totalPages <= 1) return null;
    return (
      <div className="pagination-container">
        <button
          className="pagination-btn"
          disabled={pInfo.page <= 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        >
          PREV
        </button>
        <span className="pagination-info">PAGE {pInfo.page} OF {pInfo.totalPages}</span>
        <button
          className="pagination-btn"
          disabled={pInfo.page >= pInfo.totalPages}
          onClick={() => setPage(prev => Math.min(prev + 1, pInfo.totalPages))}
        >
          NEXT
        </button>
      </div>
    );
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <section id="modalities" className="section-spacing" style={{ scrollMarginTop: 80 }}>
      <div className="section-container">
        <motion.div
          style={{ textAlign: "center", marginBottom: 48 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Deployment Modalities</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Evaluate compute based on data sovereignty, CapEx vs. OpEx, and physical mobility.
          </p>
        </motion.div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>
            {activeTab === "local" && "Direct CapEx Procurement"}
            {activeTab === "cloud" && "Hosted GPU Rental (OpEx)"}
            {activeTab === "systems" && "Workstations & Mobile Compute"}
          </h3>
          {activeTabData && <span className={`badge ${activeTabData.badge}`}>{activeTabData.badgeText}</span>}
        </motion.div>

        <div style={{ minHeight: 380 }}>
          <AnimatePresence mode="wait">
            {activeTab === "local" && (
              <motion.div
                key="local"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Search Bar for Local GPUs */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="search"
                    placeholder="Search any physical GPU (e.g. RTX 3080, GTX 1080)..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setLocalPage(1);
                        setLocalQuery(localSearch);
                      }
                    }}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      padding: "8px 16px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--colors-hairline)",
                      background: "var(--colors-surface-soft)",
                      color: "var(--colors-ink)",
                      outline: "none",
                      width: "100%",
                      maxWidth: "320px"
                    }}
                  />
                  <button
                    className="button-primary"
                    onClick={() => {
                      setLocalPage(1);
                      setLocalQuery(localSearch);
                    }}
                    style={{ height: 36, padding: "0 16px", fontSize: 13 }}
                  >
                    Search
                  </button>
                  {localQuery && (
                    <button
                      className="button-secondary"
                      onClick={() => {
                        setLocalPage(1);
                        setLocalSearch("");
                        setLocalQuery("");
                      }}
                      style={{ height: 36, padding: "0 16px", fontSize: 13, background: "transparent", border: "none", textDecoration: "underline", cursor: "pointer", color: "var(--colors-muted)" }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid-3">
                  {loading ? (
                    <>
                      <CardSkeleton />
                      <CardSkeleton />
                      <CardSkeleton />
                    </>
                  ) : (
                    localData.items.map((gpu, i) => (
                      <div key={gpu._id} style={{ position: "relative" }}>
                        <input
                          type="checkbox"
                          className="checkbox-compare"
                          title="Add to comparison list"
                          checked={compareList.some(item => item._id === gpu._id)}
                          onChange={() => onToggleCompare(gpu)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div onClick={() => onSelectCard(gpu)} style={{ cursor: "pointer" }}>
                          <GpuCard gpu={gpu} index={i} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {!loading && renderPagination(localData.pagination, setLocalPage)}
              </motion.div>
            )}

            {activeTab === "cloud" && (
              <motion.div
                key="cloud"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {loading ? (
                  <div className="glass-panel" style={{ overflow: "hidden" }}>
                    <table className="cloud-table" style={{ minWidth: 800 }}>
                      <thead>
                        <tr>
                          <th>Provider / Tier</th>
                          <th>Target GPU</th>
                          <th>Est. Rate</th>
                          <th>Billing</th>
                          <th>Ideal Workload Profile</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                        <TableRowSkeleton />
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <CloudTable cloudData={cloudData} onSelectCard={onSelectCard} />
                )}
                {activeTab !== "cloud" && !loading && renderPagination(activeTab === "local" ? localData.pagination : systemData.pagination, activeTab === "local" ? setLocalPage : setSystemPage)}
              </motion.div>
            )}

            {activeTab === "systems" && (
              <motion.div
                key="systems"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{
                  background: "rgba(251, 191, 36, 0.05)",
                  border: "1px solid rgba(251, 191, 36, 0.15)",
                  borderLeft: "3px solid var(--accent-amber)",
                  borderRadius: "0 12px 12px 0",
                  padding: 20,
                  marginBottom: 24,
                }}>
                  <div style={{ fontWeight: 700, color: "var(--accent-amber)", marginBottom: 6, fontSize: 14 }}>⚠️ The Laptop GPU Fallacy</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    The "RTX 5090 Mobile" uses the smaller GB203 die (same as the desktop 5080), not the massive GB202. Performance is dictated by Total Graphics Power (TGP).
                  </div>
                </div>

                <div className="grid-3">
                  {loading ? (
                    <>
                      <CardSkeleton />
                      <CardSkeleton />
                      <CardSkeleton />
                    </>
                  ) : (
                    systemData.items.map((sys, i) => (
                      <div key={sys._id} style={{ position: "relative" }}>
                        <input
                          type="checkbox"
                          className="checkbox-compare"
                          title="Add to comparison list"
                          checked={compareList.some(item => item._id === sys._id)}
                          onChange={() => onToggleCompare(sys)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div onClick={() => onSelectCard(sys)} style={{ cursor: "pointer" }}>
                          <SystemCard system={sys} index={i} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {!loading && renderPagination(systemData.pagination, setSystemPage)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
