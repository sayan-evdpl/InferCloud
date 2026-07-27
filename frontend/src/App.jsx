import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import NavigationHeader from "./components/DockNavbar";
import HeroSection, { ThinkingPartnerSection } from "./components/HeroSection";
import LandingFooter from "./components/LandingFooter";
import SearchOverlay from "./components/SearchOverlay";
import GpuRatesModal from "./components/GpuRatesModal";
import GetAccessModal from "./components/GetAccessModal";
import StoryBenefitsModal from "./components/StoryBenefitsModal";
import BandwidthChart from "./components/BandwidthChart";
import DeploymentTabs from "./components/DeploymentTabs";
import TcoAnalysis from "./components/TcoAnalysis";
import StrategicDirectives from "./components/StrategicDirectives";
import BentoTelemetryGrid from "./components/BentoTelemetryGrid";
import DetailModal from "./components/DetailModal";
import CompareModal from "./components/CompareModal";
import ChatWidget from "./components/ChatWidget";
import GpuSplashScreen from "./components/GpuSplashScreen";
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
    <section ref={containerRef} id="landscape" className="section-spacing bg-parchment">
      <div className="section-container">
        
        {/* Section Header */}
        <div style={{ marginBottom: "48px" }} className="animate-slide-up">
          <span className="pill-tag pill-tag-violet" style={{ marginBottom: "12px" }}>
            ✦ SILICON ARCHITECTURE
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px", alignItems: "flex-start", marginTop: "8px" }}>
            <h2 className="heading-lg" style={{ color: "var(--color-ink-black)" }}>
              The Silicon Landscape
            </h2>
            <div>
              <p className="subheading" style={{ fontSize: "18px", lineHeight: 1.5 }}>
                LLM throughput is memory bandwidth-bound. The transition to Blackwell and Hopper architectures represents a tectonic shift.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-2col animate-slide-up" style={{ alignItems: "flex-start", gap: "24px", marginBottom: "48px" }}>
          <div>
            <BandwidthChart />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card-paper-white">
              <div className="caption-text" style={{ marginBottom: "6px" }}>PARADOX ANALYSIS // BLACKWELL</div>
              <h4 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-nunito-sans)", color: "var(--color-ink-black)", marginBottom: "8px" }}>
                The Blackwell Paradox
              </h4>
              <p style={{ fontSize: "15px", color: "var(--color-charcoal-stone)", lineHeight: 1.5 }}>
                The RTX 5090 is a consumer marvel with 1.79 TB/s bandwidth. However, it completely lacks NVLink and ECC memory — perfect for localized QLoRA fine-tuning but creates severe latency penalties for massive distributed training.
              </p>
            </div>

            <div className="card-paper-white">
              <div className="caption-text" style={{ marginBottom: "6px" }}>ENTERPRISE SCALING // HOPPER</div>
              <h4 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-nunito-sans)", color: "var(--color-ink-black)", marginBottom: "8px" }}>
                Hopper Maturity
              </h4>
              <p style={{ fontSize: "15px", color: "var(--color-charcoal-stone)", lineHeight: 1.5 }}>
                The H200 addresses H100 bottlenecks with 141 GB of HBM3e. By fitting entire 400B parameter models on fewer nodes, it drastically reduces tensor parallel communication overhead.
              </p>
            </div>
          </div>
        </div>

        {/* Rainbow Accent Telemetry Grid */}
        <BentoTelemetryGrid />

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(180deg, #fdf8fd 0%, #f4eff8 100%)",
      color: "var(--color-charcoal-stone)",
      padding: "64px 0 80px",
      textAlign: "center",
      borderTop: "1px solid rgba(178, 107, 245, 0.2)",
    }}>
      <div className="section-container">
        <img
          src="/logo_choice_3.png"
          alt="GPU Scout Logo"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            objectFit: "cover",
            boxShadow: "0 4px 16px rgba(178, 107, 245, 0.35)",
            marginBottom: "16px",
          }}
        />

        <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-ink-black)", fontFamily: "var(--font-nunito-sans)" }}>
          GPU Scout
        </p>
        <p style={{ fontSize: 14, color: "var(--color-ash-gray)", marginTop: 4 }}>
          Powered by GPU Scout
        </p>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16 }}>
          <a href="#hero" className="btn-outlined-violet" style={{ textDecoration: "none", height: "36px", fontSize: "13px" }}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [showFullPlatform, setShowFullPlatform] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [ratesOpen, setRatesOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  
  // Selected detail overlay and compare list states
  const [selectedItem, setSelectedItem] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);
  const handleRatesOpen = useCallback(() => setRatesOpen(true), []);
  const handleAccessOpen = useCallback(() => setAccessOpen(true), []);
  const handleStoryOpen = useCallback(() => setStoryOpen(true), []);

  const handleRevealPlatform = useCallback(() => {
    setShowFullPlatform(true);
    setTimeout(() => {
      const el = document.getElementById("thinking-partner");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
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
    <div style={{ backgroundColor: "var(--color-parchment-cream)", color: "var(--color-ink-black)", minHeight: "100vh", position: "relative" }}>
      {showSplash && <GpuSplashScreen onComplete={handleSplashComplete} />}

      <NavigationHeader
        onSearchOpen={handleSearchOpen}
        onAccessOpen={handleAccessOpen}
      />

      {/* Initial AI Factory Landing View */}
      <HeroSection onRevealPlatform={handleRevealPlatform} />

      {!showFullPlatform && (
        <LandingFooter onExplorePlatform={handleRevealPlatform} />
      )}

      {/* Revealed Full Twilight GPU Thinking Partner Platform */}
      {showFullPlatform && (
        <>
          <main>
            <ThinkingPartnerSection
              onSearchOpen={handleSearchOpen}
              onRatesOpen={handleRatesOpen}
            />

            <SiliconLandscape />
            
            <DeploymentTabs
              onSelectCard={setSelectedItem}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
            />
            
            <TcoAnalysis />
            <StrategicDirectives />
          </main>

          <Footer />
        </>
      )}

      <SearchOverlay
        isOpen={searchOpen}
        onClose={handleSearchClose}
        onSelectCard={setSelectedItem}
      />

      <GpuRatesModal
        isOpen={ratesOpen}
        onClose={() => setRatesOpen(false)}
      />

      <GetAccessModal
        isOpen={accessOpen}
        onClose={() => setAccessOpen(false)}
      />

      <StoryBenefitsModal
        isOpen={storyOpen}
        onClose={() => setStoryOpen(false)}
        onExplorePlatform={handleRevealPlatform}
      />

      {/* Floating comparison trigger bar */}
      {compareList.length > 0 && (
        <div className="compare-tray">
          <span style={{ fontSize: 14, fontFamily: "var(--font-nunito-sans)" }}>
            Compare: {compareList.length} selected
          </span>
          <button
            className="btn-filled-white"
            onClick={() => setCompareOpen(true)}
            style={{ padding: "0 14px", height: "32px", fontSize: 13 }}
          >
            Compare grid
          </button>
          <button
            className="btn-outlined-violet"
            onClick={() => setCompareList([])}
            style={{ padding: "0 12px", height: "32px", fontSize: 13, backgroundColor: "transparent", color: "var(--color-paper-white)", borderColor: "rgba(255,255,255,0.4)" }}
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

      <ChatWidget searchOpen={searchOpen} />
    </div>
  );
}
