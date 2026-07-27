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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{ paddingTop: "12vh", alignItems: "flex-start" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{ width: "100%", maxWidth: 680, padding: "0 24px" }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: "12px",
              }}
            >
              <div
                className="ai-prompt-container"
                style={{
                  padding: "12px 18px",
                  backgroundColor: "var(--color-paper-white)",
                }}
              >
                <input
                  id="overlay-search"
                  ref={inputRef}
                  type="text"
                  placeholder="Search GPUs, architectures, or cloud providers..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="ai-prompt-input"
                  style={{ fontSize: "16px" }}
                />
                <button
                  onClick={onClose}
                  style={{
                    border: "none",
                    background: "var(--color-linen-beige)",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    color: "var(--color-charcoal-stone)",
                    cursor: "pointer",
                    fontFamily: "var(--font-nunito-sans)",
                    fontWeight: 600,
                  }}
                >
                  ESC
                </button>
              </div>
            </div>

            <div
              className="card-paper-white"
              style={{
                width: "100%",
                maxHeight: "55vh",
                overflowY: "auto",
                padding: "16px",
              }}
            >
              {loading && (
                <div
                  style={{
                    padding: 20,
                    textAlign: "center",
                    color: "var(--color-ash-gray)",
                    fontSize: 13,
                  }}
                >
                  Searching database...
                </div>
              )}

              {!loading && query && results.total === 0 && (
                <div
                  style={{
                    padding: 20,
                    textAlign: "center",
                    color: "var(--color-ash-gray)",
                    fontSize: 13,
                  }}
                >
                  No hardware matches for "{query.toUpperCase()}"
                </div>
              )}

              {!loading && results.gpus.length > 0 && (
                <>
                  <span
                    className="caption-text"
                    style={{
                      padding: "6px 10px",
                      display: "block",
                      fontWeight: 600,
                    }}
                  >
                    PHYSICAL GPUS
                  </span>
                  {results.gpus.map((gpu) => (
                    <div
                      key={gpu._id}
                      onClick={() => handleItemClick(gpu)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-parchment-cream)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--color-ink-black)",
                          }}
                        >
                          {gpu.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--color-ash-gray)",
                            marginTop: 2,
                          }}
                        >
                          {gpu.arch} · {gpu.bandwidth} · {gpu.vram}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-ink-black)",
                        }}
                      >
                        {gpu.price}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {!loading && results.cloud.length > 0 && (
                <>
                  <span
                    className="caption-text"
                    style={{
                      padding: "6px 10px",
                      marginTop: 10,
                      display: "block",
                      fontWeight: 600,
                    }}
                  >
                    CLOUD RENTALS
                  </span>
                  {results.cloud.map((cp) => (
                    <div
                      key={cp._id}
                      onClick={() => handleItemClick(cp)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--color-parchment-cream)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "var(--color-ink-black)",
                          }}
                        >
                          {cp.gpu}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--color-ash-gray)",
                            marginTop: 2,
                          }}
                        >
                          {cp.offers?.length || 0} Cloud Providers Available
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-electric-violet)",
                        }}
                      >
                        FROM{" "}
                        {cp.spotUsd
                          ? `$${cp.spotUsd.toFixed(2)}/hr`
                          : "On-Demand"}
                      </span>
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
