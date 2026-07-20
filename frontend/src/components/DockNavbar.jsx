import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const navItems = [
  { id: "hero", icon: "SYS", label: "System", emoji: false },
  { id: "landscape", icon: "SIL", label: "Silicon", emoji: false },
  { id: "modalities", icon: "MOD", label: "Deploy", emoji: false },
  { id: "economics", icon: "TCO", label: "Economics", emoji: false },
  { id: "directives", icon: "STR", label: "Strategy", emoji: false },
  { id: "search", icon: "SCH", label: "Search", emoji: false },
];

function DockIcon({ item, mouseX, onNavigate }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 200;
    return val - rect.x - rect.width / 2;
  });

  const scale = useSpring(
    useTransform(distance, [-100, 0, 100], [1, 1.25, 1]),
    { mass: 0.1, stiffness: 220, damping: 18 }
  );

  const y = useSpring(
    useTransform(distance, [-100, 0, 100], [0, -6, 0]),
    { mass: 0.1, stiffness: 220, damping: 18 }
  );

  return (
    <motion.div
      ref={ref}
      className="dock-item"
      style={{ scale, y }}
      onClick={() => onNavigate(item.id)}
      whileTap={{ scale: 0.95 }}
    >
      <div className="dock-icon">
        {item.icon}
      </div>
      <span className="dock-label">{item.label}</span>
      <div className="dock-active-dot" />
    </motion.div>
  );
}

export default function DockNavbar({ onSearchOpen }) {
  const mouseX = useMotionValue(Infinity);

  const handleNavigate = (id) => {
    if (id === "search") {
      onSearchOpen();
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dock-wrapper">
      <motion.nav
        className="dock-container"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 20 }}
        style={{
          background: "var(--colors-canvas)",
          border: "1px solid var(--colors-hairline)",
        }}
      >
        {navItems.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            onNavigate={handleNavigate}
          />
        ))}
      </motion.nav>
    </div>
  );
}
