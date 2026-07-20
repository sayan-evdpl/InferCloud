import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../hooks/useSearch";

export default function SearchOverlay({ isOpen, onClose, onSelectCard }) {
  const { query, setQuery, results, loading } = useSearch(250);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) setQuery("");
  }, [isOpen, setQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleItemClick = (item) => {
    onSelectCard(item);
    onClose();
  };

  const getCategoryBadge = (cat) => {
    if (cat === "local") return <span className="badge badge-amber">LOCAL GPU</span>;
    if (cat === "cloud") return <span className="badge badge-cyan">CLOUD INSTANCE</span>;
    return <span className="badge badge-rose">INTEGRATED</span>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%", maxWidth: 720, padding: "0 24px" }}
          >
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                placeholder="INPUT QUERY [e.g. 5090, Hopper, Lambda]..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div
                style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)" }}
                onClick={onClose}
              >
                <span className="kbd" style={{ cursor: "pointer" }}>ESC</span>
              </div>
            </div>

            <div className="search-results">
              {loading && (
                <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  RUNNING QUERY...
                </div>
              )}

              {!loading && query && results.total === 0 && (
                <div style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  NO ALIGNING METRICS FOUND FOR: "{query.toUpperCase()}"
                </div>
              )}

              {!loading && results.gpus.length > 0 && (
                <>
                  <div className="search-category-label">LOCAL PHYSICAL SILICON</div>
                  {results.gpus.map((gpu) => (
                    <div key={gpu._id} className="search-result-item" onClick={() => handleItemClick(gpu)}>
                      <div className="search-result-icon" style={{ borderColor: "rgba(245, 158, 11, 0.3)", color: "var(--accent-amber)" }}>⚡</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{gpu.name.toUpperCase()}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                          ARCH: {gpu.arch} · BW: {gpu.bandwidth} · PRICE: {gpu.price}
                        </div>
                      </div>
                      {getCategoryBadge("local")}
                    </div>
                  ))}
                </>
              )}

              {!loading && results.cloud.length > 0 && (
                <>
                  <div className="search-category-label">RENTAL INSTANCES</div>
                  {results.cloud.map((cp) => (
                    <div key={cp._id} className="search-result-item" onClick={() => handleItemClick(cp)}>
                      <div className="search-result-icon" style={{ borderColor: "rgba(34, 211, 238, 0.3)", color: "#22d3ee" }}>☁️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{cp.gpu}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                          ON-DEMAND FROM: {cp.onDemandUsd ? `$${cp.onDemandUsd.toFixed(2)}/hr` : "N/A"} · SPOT FROM: {cp.spotUsd ? `$${cp.spotUsd.toFixed(2)}/hr` : "N/A"} · PROVIDERS: {cp.offers.length}
                        </div>
                      </div>
                      {getCategoryBadge("cloud")}
                    </div>
                  ))}
                </>
              )}

              {!loading && results.systems.length > 0 && (
                <>
                  <div className="search-category-label">INTEGRATED HARDWARE SYSTEMS</div>
                  {results.systems.map((sys) => (
                    <div key={sys._id} className="search-result-item" onClick={() => handleItemClick(sys)}>
                      <div className="search-result-icon" style={{ borderColor: "rgba(244, 63, 94, 0.3)", color: "var(--accent-rose)" }}>{sys.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{sys.type.toUpperCase()}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                          SPEC: {sys.specs} · EST: {sys.price}
                        </div>
                      </div>
                      {getCategoryBadge("system")}
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
