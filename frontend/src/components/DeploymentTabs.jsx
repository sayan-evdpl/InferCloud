import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalGpus, getCloudProviders, getSystems } from "../api/gpuApi";
import GpuCard from "./GpuCard";
import CloudTable from "./CloudTable";
import SystemCard from "./SystemCard";
import { CardSkeleton } from "./SkeletonLoader";

const tabs = [
  { id: "local", label: "Local Physical GPUs" },
  { id: "cloud", label: "Cloud GPU Rentals" },
  { id: "systems", label: "Workstations & Mobile" },
];

export default function DeploymentTabs({
  onSelectCard,
  compareList,
  onToggleCompare,
}) {
  const [activeTab, setActiveTab] = useState("local");
  const [loading, setLoading] = useState(true);

  // Data states
  const [localData, setLocalData] = useState({
    items: [],
    pagination: { page: 1, totalPages: 1 },
  });
  const [cloudData, setCloudData] = useState({
    items: [],
    pagination: { page: 1, totalPages: 1 },
  });
  const [systemData, setSystemData] = useState({
    items: [],
    pagination: { page: 1, totalPages: 1 },
  });

  const [localPage, setLocalPage] = useState(1);
  const [cloudPage, setCloudPage] = useState(1);
  const [systemPage, setSystemPage] = useState(1);

  const [localSearch, setLocalSearch] = useState("");
  const [localQuery, setLocalQuery] = useState("");
  const [localSort, setLocalSort] = useState("default");

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
        .then((data) => {
          if (Array.isArray(data)) {
            setSystemData({
              items: data,
              pagination: { page: 1, totalPages: 1 },
            });
          } else {
            setSystemData(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [activeTab, localPage, cloudPage, systemPage, localQuery]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const match = priceStr.match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  };

  const sortedLocalItems = [...(localData.items || [])].sort((a, b) => {
    if (localSort === "price_asc")
      return parsePrice(a.price) - parsePrice(b.price);
    if (localSort === "price_desc")
      return parsePrice(b.price) - parsePrice(a.price);
    return 0;
  });

  const renderPagination = (pInfo, setPage) => {
    if (!pInfo || pInfo.totalPages <= 1) return null;
    return (
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <button
          className="btn-outlined-violet"
          disabled={pInfo.page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          style={{ opacity: pInfo.page <= 1 ? 0.4 : 1 }}
        >
          ← Previous
        </button>
        <span
          style={{
            fontSize: "13px",
            color: "var(--color-ash-gray)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {pInfo.page} / {pInfo.totalPages}
        </span>
        <button
          className="btn-outlined-violet"
          disabled={pInfo.page >= pInfo.totalPages}
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, pInfo.totalPages))
          }
          style={{ opacity: pInfo.page >= pInfo.totalPages ? 0.4 : 1 }}
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <section id="modalities" className="section-spacing bg-parchment">
      <div className="section-container">
        {/* Section Header */}
        <div style={{ marginBottom: "40px" }}>
          <span
            className="pill-tag pill-tag-violet"
            style={{ marginBottom: "12px" }}
          >
            Direct CapEx Procurement · Max Sovereignty
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2
                className="heading-lg"
                style={{
                  color: "var(--color-ink-black)",
                  marginTop: "6px",
                  marginBottom: "8px",
                }}
              >
                Deployment Modalities
              </h2>
              <p className="subheading" style={{ maxWidth: "580px" }}>
                Evaluate compute based on data sovereignty, CapEx vs. OpEx, and
                physical mobility.
              </p>
            </div>

            {/* Tab Selector */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                backgroundColor: "var(--color-linen-beige)",
                padding: "4px",
                borderRadius: "12px",
                border: "1px solid var(--color-sand-gray)",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    height: "36px",
                    padding: "0 16px",
                    fontSize: "13px",
                    fontWeight: activeTab === tab.id ? "600" : "500",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor:
                      activeTab === tab.id
                        ? "var(--color-paper-white)"
                        : "transparent",
                    color:
                      activeTab === tab.id
                        ? "var(--color-ink-black)"
                        : "var(--color-charcoal-stone)",
                    boxShadow:
                      activeTab === tab.id ? "var(--shadow-subtle-2)" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content View */}
        <div style={{ minHeight: 380 }}>
          <AnimatePresence mode="wait">
            {activeTab === "local" && (
              <motion.div
                key="local"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* Search & Sort */}
                <div
                  style={{
                    marginBottom: "28px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    className="ai-prompt-container"
                    style={{ flex: 1, maxWidth: "420px" }}
                  >
                    <input
                      id="procurement-search"
                      type="search"
                      className="ai-prompt-input"
                      placeholder="Search any physical GPU (e.g. RTX 3080, GTX 1080)..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setLocalPage(1);
                          setLocalQuery(localSearch);
                        }
                      }}
                    />
                    <button
                      className="ai-send-circle"
                      onClick={() => {
                        setLocalPage(1);
                        setLocalQuery(localSearch);
                      }}
                    >
                      →
                    </button>
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="caption-text">SORT BY:</span>
                    <select
                      value={localSort}
                      onChange={(e) => setLocalSort(e.target.value)}
                      style={{
                        fontFamily: "var(--font-nunito-sans)",
                        fontSize: "13px",
                        padding: "6px 12px",
                        borderRadius: "12px",
                        border: "1px solid var(--color-sand-gray)",
                        backgroundColor: "var(--color-paper-white)",
                        color: "var(--color-ink-black)",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="default">Default Order</option>
                      <option value="price_asc">Price: Low → High</option>
                      <option value="price_desc">Price: High → Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3col">
                  {loading ? (
                    <>
                      <CardSkeleton />
                      <CardSkeleton />
                      <CardSkeleton />
                    </>
                  ) : (
                    sortedLocalItems.map((gpu, i) => (
                      <div key={gpu._id} style={{ position: "relative" }}>
                        <input
                          type="checkbox"
                          className="checkbox-compare"
                          title="Add to comparison list"
                          checked={compareList.some(
                            (item) => item._id === gpu._id,
                          )}
                          onChange={() => onToggleCompare(gpu)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            accentColor: "var(--color-electric-violet)",
                          }}
                        />
                        <div
                          onClick={() => onSelectCard(gpu)}
                          style={{ cursor: "pointer" }}
                        >
                          <GpuCard gpu={gpu} index={i} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {!loading &&
                  renderPagination(localData.pagination, setLocalPage)}
              </motion.div>
            )}

            {activeTab === "cloud" && (
              <motion.div
                key="cloud"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {loading ? (
                  <div
                    style={{
                      padding: "32px",
                      color: "var(--color-ash-gray)",
                      textAlign: "center",
                    }}
                  >
                    Loading cloud provider rates...
                  </div>
                ) : (
                  <CloudTable
                    cloudData={cloudData}
                    onSelectCard={onSelectCard}
                  />
                )}
              </motion.div>
            )}

            {activeTab === "systems" && (
              <motion.div
                key="systems"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid-3col">
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
                          checked={compareList.some(
                            (item) => item._id === sys._id,
                          )}
                          onChange={() => onToggleCompare(sys)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            accentColor: "var(--color-electric-violet)",
                          }}
                        />
                        <div
                          onClick={() => onSelectCard(sys)}
                          style={{ cursor: "pointer" }}
                        >
                          <SystemCard system={sys} index={i} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {!loading &&
                  renderPagination(systemData.pagination, setSystemPage)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
