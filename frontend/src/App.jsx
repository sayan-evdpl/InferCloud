import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import DockNavbar from "./components/DockNavbar";
import HeroSection from "./components/HeroSection";
import SearchOverlay from "./components/SearchOverlay";
import BandwidthChart from "./components/BandwidthChart";
import DeploymentTabs from "./components/DeploymentTabs";
import TcoAnalysis from "./components/TcoAnalysis";
import StrategicDirectives from "./components/StrategicDirectives";
import DetailModal from "./components/DetailModal";
import CompareModal from "./components/CompareModal";
import "./index.css";

function SiliconLandscape() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current.querySelectorAll(".animate-slide-up"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section ref={containerRef} id="landscape" className="section-spacing" style={{ scrollMarginTop: 80, background: "var(--colors-canvas)" }}>
      <div className="section-container">
        <div style={{ marginBottom: 48 }} className="animate-slide-up">
          <h2 className="section-title">
            The <span className="gradient-text">Silicon</span> Landscape
          </h2>
          <p className="section-subtitle">
            LLM throughput is memory bandwidth-bound. The transition to Blackwell and Hopper architectures represents a tectonic shift.
          </p>
        </div>

        <div className="responsive-landscape-grid animate-slide-up">
          <BandwidthChart />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              className="glass-panel"
              style={{ flex: 1, padding: 24, borderLeft: "3px solid var(--colors-primary)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--colors-primary)" }} />
                <h4 style={{ fontSize: 18, fontWeight: 500 }}>The Blackwell Paradox</h4>
              </div>
              <p style={{ fontSize: 13, color: "var(--colors-body)", lineHeight: 1.7 }}>
                The RTX 5090 is a consumer marvel with 1.79 TB/s bandwidth. However, it completely lacks NVLink and ECC memory — perfect for localized QLoRA fine-tuning but creates severe latency penalties for massive distributed training.
              </p>
            </div>

            <div
              className="glass-panel"
              style={{ flex: 1, padding: 24, borderLeft: "3px solid var(--colors-accent-teal)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--colors-accent-teal)" }} />
                <h4 style={{ fontSize: 18, fontWeight: 500 }}>Hopper Maturity</h4>
              </div>
              <p style={{ fontSize: 13, color: "var(--colors-body)", lineHeight: 1.7 }}>
                The H200 addresses H100 bottlenecks with 141 GB of HBM3e. By fitting entire 400B parameter models on fewer nodes, it drastically reduces tensor parallel communication overhead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "var(--colors-surface-dark)",
      color: "var(--colors-on-dark-soft)",
      borderTop: "1px solid var(--colors-hairline)",
      padding: "80px 0 120px",
      textAlign: "center",
      position: "relative",
    }}>
      <div className="section-container">
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "var(--colors-surface-dark-elevated)",
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontWeight: 800,
          fontSize: 14,
          color: "var(--colors-primary)",
        }}>
          *
        </div>
        <p style={{ fontSize: 14, color: "var(--colors-on-dark)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
          Silicon Scale
        </p>
        <p style={{ fontSize: 12, color: "var(--colors-on-dark-soft)", marginTop: 8 }}>
          Powered by GSAP & Recharts · Claude Warm Editorial Design System
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Selected detail overlay and compare list states
  const [selectedItem, setSelectedItem] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);

  // Clear session storage cache on reload / mount
  useEffect(() => {
    sessionStorage.clear();
    console.log("Session cache cleared upon reload.");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      gsap.to(".starfield", {
        y: scrollY * 0.1,
        ease: "none",
        duration: 0.1,
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleCompare = (item) => {
    setCompareList((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.filter((i) => i._id !== item._id);
      }
      if (prev.length >= 3) {
        alert("Maximum comparison limit is 3 elements.");
        return prev;
      }
      return [...prev, item];
    });
  };

  return (
    <>
      <div className="starfield" />
      
      <HeroSection onSearchOpen={handleSearchOpen} />
      <SiliconLandscape />
      
      <DeploymentTabs
        onSelectCard={setSelectedItem}
        compareList={compareList}
        onToggleCompare={handleToggleCompare}
      />
      
      <TcoAnalysis />
      <StrategicDirectives />
      <Footer />
      
      <DockNavbar onSearchOpen={handleSearchOpen} />
      
      <SearchOverlay
        isOpen={searchOpen}
        onClose={handleSearchClose}
        onSelectCard={setSelectedItem}
      />

      {/* Floating comparison trigger bar */}
      {compareList.length > 0 && (
        <div className="compare-tray" style={{ border: "1px solid var(--colors-hairline)", background: "var(--colors-canvas)", color: "var(--colors-ink)" }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--colors-muted)", fontWeight: 500 }}>
            COMPARE // {compareList.length} SELECTED
          </span>
          <button
            className="button-primary"
            onClick={() => setCompareOpen(true)}
            style={{ height: 32, padding: "0 14px", fontSize: 12, background: "var(--colors-primary)" }}
          >
            Compare Grid
          </button>
          <button
            className="button-secondary"
            onClick={() => setCompareList([])}
            style={{ height: 32, padding: "0 14px", fontSize: 12 }}
          >
            Clear
          </button>
        </div>
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {compareOpen && (
        <CompareModal
          items={compareList}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </>
  );
}
