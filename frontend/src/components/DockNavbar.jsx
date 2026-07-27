import { useState, useEffect } from "react";

export default function NavigationHeader({ onSearchOpen, onAccessOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: "18px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92%, 1100px)",
        zIndex: 1000,
        backgroundColor: scrolled
          ? "rgba(248, 247, 242, 0.95)"
          : "rgba(25, 9, 34, 0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: scrolled
          ? "1px solid var(--color-sand-gray)"
          : "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "9999px",
        padding: "10px 24px",
        boxShadow: scrolled
          ? "var(--shadow-subtle-3)"
          : "0 12px 36px rgba(0, 0, 0, 0.25)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Wordmark & Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("hero");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          {/* GPU Scout Logo Icon Badge (Choice 3: Isometric G Lattice) */}
          <img
            src="/logo_choice_3.png"
            alt="GPU Scout Logo"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              objectFit: "cover",
              boxShadow: "0 2px 10px rgba(178, 107, 245, 0.4)",
            }}
          />

          <span
            style={{
              fontFamily: "var(--font-nunito-sans)",
              fontSize: "16px",
              fontWeight: "700",
              color: scrolled
                ? "var(--color-ink-black)"
                : "var(--color-paper-white)",
              letterSpacing: "-0.015em",
            }}
          >
            GPU Scout
          </span>
        </a>

        {/* Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {[
            { id: "hero", label: "Overview" },
            { id: "landscape", label: "Architecture" },
            { id: "modalities", label: "Cloud & Local" },
            { id: "economics", label: "TCO Model" },
            { id: "directives", label: "Directives" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(item.id);
              }}
              style={{
                fontFamily: "var(--font-nunito-sans)",
                fontSize: "14px",
                fontWeight: "500",
                color: scrolled
                  ? "var(--color-charcoal-stone)"
                  : "rgba(248, 247, 242, 0.88)",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onSearchOpen}
            style={{
              background: "transparent",
              border: "none",
              color: scrolled
                ? "var(--color-charcoal-stone)"
                : "rgba(248, 247, 242, 0.9)",
              fontFamily: "var(--font-nunito-sans)",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              padding: "6px 10px",
            }}
          >
            Search ⌘K
          </button>

          <button
            className={scrolled ? "btn-filled-dark" : "btn-filled-white"}
            onClick={onAccessOpen}
            style={{
              height: "36px",
              padding: "0 16px",
              fontSize: "13px",
              borderRadius: "9999px",
            }}
          >
            Get access →
          </button>
        </div>
      </div>
    </header>
  );
}
