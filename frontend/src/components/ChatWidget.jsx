import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { sendChatMessage } from "../api/gpuApi";

const SUGGESTIONS = [
  "Best GPU to fine-tune Llama 3 8B?",
  "Compare RTX 5090 vs H200 side-by-side",
  "Calculate TCO for 10h/day runtime",
  "What is the cheapest H100 rate today?",
];

export default function ChatWidget({ searchOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleText, setBubbleText] = useState("Have a query? Don't worry, Flash is ready to help you!");
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isJumpingOut, setIsJumpingOut] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am **Flash**, your AI infrastructure architect. Ask me anything about GPU specifications, TCO economics, live cloud rates, or what hardware fits your workload best!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("flash_token") || "flashonn");

  // Positioning states: "docked" | "telemetry" | "procurement" | "graph" | "overlay"
  const [botState, setBotState] = useState("docked");
  const [coordinates, setCoordinates] = useState({ x: null, y: null });
  const [telemetryTimerFired, setTelemetryTimerFired] = useState(false);

  const chatEndRef = useRef(null);
  const botRef = useRef(null);
  const lastRectRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Trigger telemetry activation after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setTelemetryTimerFired(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Initial load message hide timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Helper to determine if element is in the viewport vertically
  const isElementInViewport = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  // State machine logic to control bot placement
  useEffect(() => {
    const updateBotState = () => {
      if (searchOpen) {
        setBotState("overlay");
        return;
      }
      if (isOpen) {
        setBotState("docked");
        return;
      }
      if (!telemetryTimerFired) {
        setBotState("docked");
        return;
      }

      const graphEl = document.getElementById("tco-graph");
      const procSearchEl = document.getElementById("procurement-search");
      const bandwidthEl = document.getElementById("bandwidth-chart");
      const telemetryEl = document.getElementById("telemetry-card");

      if (graphEl && isElementInViewport(graphEl)) {
        setBotState("graph");
      } else if (procSearchEl && isElementInViewport(procSearchEl)) {
        setBotState("procurement");
      } else if (bandwidthEl && isElementInViewport(bandwidthEl)) {
        setBotState("bandwidth");
      } else if (telemetryEl) {
        setBotState("telemetry");
      } else {
        setBotState("docked");
      }
    };

    updateBotState();

    window.addEventListener("scroll", updateBotState);
    window.addEventListener("resize", updateBotState);

    // Periodic check to capture tab updates and DOM mount changes
    const interval = setInterval(updateBotState, 500);

    return () => {
      window.removeEventListener("scroll", updateBotState);
      window.removeEventListener("resize", updateBotState);
      clearInterval(interval);
    };
  }, [isOpen, searchOpen, telemetryTimerFired]);

  // Compute positioning coordinates based on target elements and offsets
  useEffect(() => {
    const handleUpdateCoords = () => {
      let targetId = null;
      if (botState === "telemetry") targetId = "telemetry-card";
      else if (botState === "bandwidth") targetId = "bandwidth-chart";
      else if (botState === "procurement") targetId = "procurement-search";
      else if (botState === "graph") targetId = "tco-graph";
      else if (botState === "overlay") targetId = "overlay-search";

      if (!targetId) {
        setCoordinates({ x: null, y: null });
        return;
      }

      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const isFixed = botState === "overlay";
        const scrollX = isFixed ? 0 : window.scrollX;
        const scrollY = isFixed ? 0 : window.scrollY;

        let xOffset = rect.width - 90;
        let yOffset = -85;

        if (botState === "procurement") {
          xOffset = rect.width - 100;
        } else if (botState === "graph") {
          xOffset = rect.width - 120;
        } else if (botState === "bandwidth") {
          xOffset = rect.width - 120;
        } else if (botState === "overlay") {
          xOffset = rect.width - 100;
        }

        setCoordinates({
          x: rect.left + scrollX + xOffset,
          y: rect.top + scrollY + yOffset
        });
      }
    };

    handleUpdateCoords();

    window.addEventListener("resize", handleUpdateCoords);
    window.addEventListener("scroll", handleUpdateCoords);

    return () => {
      window.removeEventListener("resize", handleUpdateCoords);
      window.removeEventListener("scroll", handleUpdateCoords);
    };
  }, [botState]);

  // Update bubble text and show / auto-hide bubble when state shifts
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (botState === "docked") {
      setBubbleText("How can I help you?");
      setShowBubble(false);
      return;
    }

    let text = "How can I help you?";
    if (botState === "telemetry") {
      text = "We have 6 active GPU deployments currently running on the telemetry feed.";
    } else if (botState === "bandwidth") {
      text = "Memory bandwidth bounds token speed. Higher bandwidth enables faster execution.";
    } else if (botState === "procurement") {
      text = "Search for local physical GPU units like RTX 5090 or Hopper.";
    } else if (botState === "graph") {
      text = "Let me help you analyze this graph";
    } else if (botState === "overlay") {
      text = "May I help you to search?";
    }

    setBubbleText(text);
    setShowBubble(true);

    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [botState]);

  // Track the bot position in viewport coordinates on scroll for smooth FLIP transition base
  useEffect(() => {
    const trackPos = () => {
      if (botRef.current) {
        lastRectRef.current = botRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener("scroll", trackPos);
    return () => window.removeEventListener("scroll", trackPos);
  }, []);

  // FLIP and GSAP Jump Animation Timeline
  useEffect(() => {
    if (!botRef.current) return;

    const currentRect = botRef.current.getBoundingClientRect();

    if (lastRectRef.current && botState !== "docked") {
      const deltaX = lastRectRef.current.left - currentRect.left;
      const deltaY = lastRectRef.current.top - currentRect.top;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        gsap.killTweensOf(botRef.current);

        const tl = gsap.timeline();

        // Squash on takeoff
        gsap.fromTo(botRef.current,
          { scaleY: 0.8, scaleX: 1.2 },
          { scaleY: 1, scaleX: 1, duration: 0.3, ease: "power1.out" }
        );

        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 2000);

        // Linear horizontal movement
        tl.fromTo(botRef.current,
          { x: deltaX },
          { x: 0, duration: 1.0, ease: "power2.out" },
          0
        );

        // Parabolic vertical movement with landing bounce
        const peakY = Math.min(0, deltaY) - 140;
        tl.fromTo(botRef.current,
          { y: deltaY },
          { y: peakY, duration: 0.5, ease: "power1.out" },
          0
        );
        tl.to(botRef.current,
          { y: 0, duration: 0.5, ease: "bounce.out" },
          0.5
        );
      }
    }

    lastRectRef.current = currentRect;
  }, [botState, coordinates]);

  // Peeking trigger logic for docked attention alerts
  useEffect(() => {
    if (isOpen || botState !== "docked" || !telemetryTimerFired) return;

    let jumpTimer;
    let resetTimer;

    const triggerAttentionSeq = () => {
      setIsWaving(true);
      setIsJumpingOut(false);
      setShowBubble(false);

      jumpTimer = setTimeout(() => {
        setIsJumpingOut(true);
        setTimeout(() => {
          setShowBubble(true);
        }, 400);
      }, 2000);

      resetTimer = setTimeout(() => {
        setIsWaving(false);
        setIsJumpingOut(false);
        setShowBubble(false);
      }, 7500);
    };

    const initialTimer = setTimeout(triggerAttentionSeq, 1500);
    const interval = setInterval(triggerAttentionSeq, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(jumpTimer);
      clearTimeout(resetTimer);
      clearInterval(interval);
    };
  }, [isOpen, botState]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput("");

    // Intercept activation command
    if (text.trim().toLowerCase() === "flashonn") {
      setToken("flashonn");
      localStorage.setItem("flash_token", "flashonn");
      const newMsgList = [
        ...messages,
        { role: "user", content: text },
        { role: "assistant", content: "Flash has been successfully activated. How can I help you today?" }
      ];
      setMessages(newMsgList);
      return;
    }

    // Intercept deactivation command
    if (text.trim().toLowerCase() === "flashoff") {
      setToken(null);
      localStorage.removeItem("flash_token");
      const newMsgList = [
        ...messages,
        { role: "user", content: text },
        { role: "assistant", content: "Flash has been deactivated." }
      ];
      setMessages(newMsgList);
      return;
    }

    // Block usage if not activated
    if (token !== "flashonn") {
      const newMsgList = [
        ...messages,
        { role: "user", content: text },
        { role: "assistant", content: "Flash is currently offline." }
      ];
      setMessages(newMsgList);
      return;
    }

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Send message history along with Bearer token
      const response = await sendChatMessage(newMessages, "flashonn");
      setMessages([...newMessages, { role: "assistant", content: response.text }]);
    } catch (err) {
      console.error("ChatWidget send error:", err);
      const serverMessage = err.response?.data?.message || err.message;
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Sorry, I encountered an error communicating with the backend: **${serverMessage}**. Please make sure the backend server is running on port 3000.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Custom simple markdown parser
  const renderMessageContent = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    let inTable = false;
    let tableRows = [];
    let renderedElements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for markdown table row e.g. | GPU | VRAM |
      if (line.startsWith("|")) {
        inTable = true;
        const cells = line
          .split("|")
          .map((c) => c.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        // Skip separator lines like |---|---|
        if (cells.every((c) => c.match(/^-+$/))) {
          continue;
        }
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        // Table ended, render it
        renderedElements.push(renderTable(tableRows, i));
        tableRows = [];
        inTable = false;
      }

      // Process lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const content = line.substring(2);
        renderedElements.push(
          <li
            key={`li-${i}`}
            style={{ marginLeft: 16, marginBottom: 4, fontSize: 13, color: "var(--colors-body-strong)" }}
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }}
          />
        );
        continue;
      }

      if (line.startsWith("### ")) {
        renderedElements.push(
          <h5
            key={`h3-${i}`}
            style={{ fontSize: 14, fontWeight: 700, marginTop: 12, marginBottom: 6, color: "var(--colors-ink)" }}
          >
            {line.replace("### ", "")}
          </h5>
        );
        continue;
      }
      if (line.startsWith("## ")) {
        renderedElements.push(
          <h4
            key={`h2-${i}`}
            style={{ fontSize: 15, fontWeight: 700, marginTop: 16, marginBottom: 8, color: "var(--colors-ink)" }}
          >
            {line.replace("## ", "")}
          </h4>
        );
        continue;
      }

      if (line) {
        renderedElements.push(
          <p
            key={`p-${i}`}
            style={{ marginBottom: 8, fontSize: 13, lineHeight: 1.5, color: "var(--colors-body-strong)" }}
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
          />
        );
      }
    }

    if (inTable && tableRows.length > 0) {
      renderedElements.push(renderTable(tableRows, "final"));
    }

    return <div>{renderedElements}</div>;
  };

  const renderTable = (rows, key) => {
    if (rows.length === 0) return null;
    const headers = rows[0];
    const bodyRows = rows.slice(1);

    return (
      <div
        key={`table-${key}`}
        className="glass-panel"
        style={{
          overflowX: "auto",
          margin: "12px 0",
          background: "var(--colors-canvas)",
          border: "1px solid var(--colors-hairline)",
          borderRadius: 8,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--colors-surface-soft)", borderBottom: "1px solid var(--colors-hairline)" }}>
              {headers.map((h, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "var(--colors-muted)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                style={{
                  borderBottom: rIdx < bodyRows.length - 1 ? "1px solid var(--colors-hairline-soft)" : "none",
                }}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{ padding: "8px 10px", color: "var(--colors-ink)" }}
                    dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const formatInlineMarkdown = (text) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(
      /`(.*?)`/g,
      "<code style='font-family: var(--font-mono); font-size: 11px; background: var(--colors-surface-soft); padding: 2px 4px; border-radius: 4px;'>$1</code>"
    );
    return formatted;
  };

  return (
    <>
      {/* Floating Circle Button */}
      {!isOpen && (
        <motion.div
          ref={botRef}
          initial={{ x: 120, opacity: 0 }}
          animate={
            botState === "docked"
              ? {
                  x: isJumpingOut || isHovered ? -62 : 0,
                  y: isJumpingOut || isHovered ? [0, -35, -5, -8, 0] : 0,
                  opacity: 1,
                }
              : {
                  x: 0,
                  y: 0,
                  opacity: coordinates.x === null || coordinates.y === null ? 0 : 1,
                }
          }
          transition={{
            x: { type: "spring", stiffness: 100, damping: 14 },
            y: { type: "keyframes", duration: 0.6, ease: "easeOut" },
            opacity: { delay: botState === "docked" ? 0.8 : 0, duration: 0.5 },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={(() => {
            if (botState === "docked") {
              return {
                position: "fixed",
                bottom: 24,
                right: -34, // Tucked more off-screen to hide the lower body
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                pointerEvents: "none",
                zIndex: 1000,
              };
            }
            const isFixed = botState === "overlay";
            return {
              position: isFixed ? "fixed" : "absolute",
              left: coordinates.x !== null ? coordinates.x : undefined,
              top: coordinates.y !== null ? coordinates.y : undefined,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              pointerEvents: "none",
              zIndex: isFixed ? 250 : 1000,
            };
          })()}
        >
          {/* Attention Speech Bubble */}
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 10 }}
                onClick={() => {
                  setIsOpen(true);
                  setShowBubble(false);
                }}
                style={{
                  pointerEvents: "auto",
                  cursor: "pointer",
                  background: "var(--colors-surface-soft)",
                  border: "1px solid var(--colors-hairline)",
                  borderRadius: "12px 12px 2px 12px",
                  padding: "10px 14px",
                  marginBottom: botState === "docked" ? 8 : 0,
                  marginRight: botState === "docked" ? 10 : 0,
                  boxShadow: "0 6px 20px rgba(20,20,19,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  position: botState === "docked" ? "relative" : "absolute",
                  bottom: botState === "docked" ? undefined : 20,
                  right: botState === "docked" ? undefined : 86,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--colors-ink)", maxWidth: 240, whiteSpace: "normal", lineHeight: 1.4 }}>
                  {bubbleText}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBubble(false);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: 10,
                    cursor: "pointer",
                    color: "var(--colors-muted)",
                    padding: 2,
                    marginLeft: 4,
                  }}
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gentle Idle float (applied only when resting/peeking, not jumping) */}
          <motion.div
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
              setIsJumpingOut(false);
              setIsWaving(false);
            }}
            className="chat-bubble-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: botState === "docked" && !(isJumpingOut || isHovered) ? [0, -4, 0] : 0,
              rotate: botState === "docked" && !(isJumpingOut || isHovered) ? -22 : 0,
            }}
            transition={{
              y: {
                repeat: botState === "docked" && !(isJumpingOut || isHovered) ? Infinity : 0,
                duration: 4,
                ease: "easeInOut",
              },
              rotate: { type: "spring", stiffness: 100, damping: 12 }
            }}
            style={{
              pointerEvents: "auto",
              cursor: "pointer",
              position: "relative",
              width: 76,
              height: 96,
              transformOrigin: "bottom right",
            }}
          >
            {/* Custom Robot SVG */}
            <svg width="76" height="96" viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Antenna */}
              <rect x="47" y="6" width="6" height="15" rx="3" fill="var(--colors-ink)" />
              <circle cx="50" cy="5" r="5" fill="var(--colors-primary)" />

              {/* Side Bolt headphones */}
              <rect x="12" y="44" width="10" height="18" rx="4" fill="var(--colors-primary)" stroke="var(--colors-ink)" strokeWidth="3" />
              <rect x="78" y="44" width="10" height="18" rx="4" fill="var(--colors-primary)" stroke="var(--colors-ink)" strokeWidth="3" />

              {/* Head */}
              <rect x="20" y="20" width="60" height="46" rx="15" fill="var(--colors-surface-soft)" stroke="var(--colors-ink)" strokeWidth="4" />
              
              {/* Eyes */}
              <circle cx="38" cy="43" r="7" fill="var(--colors-ink)" />
              <circle cx="36" cy="40" r="2" fill="white" />
              <circle cx="62" cy="43" r="7" fill="var(--colors-ink)" />
              <circle cx="60" cy="40" r="2" fill="white" />
              
              {/* Smile */}
              <path d="M 44 51 Q 50 56 56 51" stroke="var(--colors-ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Neck (Slightly longer!) */}
              <rect x="44" y="66" width="12" height="12" fill="var(--colors-primary)" stroke="var(--colors-ink)" strokeWidth="3" />

              {/* Left Arm (placed outside lower body group so it's always visible during peeking/waving) */}
              <motion.g
                style={{ transformOrigin: "28px 86px" }}
                animate={isWaving || isHovered ? { rotate: [0, 20, -15, 20, -15, 20, 0] } : { rotate: 0 }}
                transition={{
                  repeat: isWaving || isHovered ? Infinity : 0,
                  duration: 1.0,
                  ease: "easeInOut",
                }}
              >
                {/* Left Arm pointing outward for clear waving (Adjusted shoulder to 86) */}
                <path d="M 28 86 C 15 82 8 68 12 56" stroke="var(--colors-ink)" strokeWidth="4.2" strokeLinecap="round" fill="none" />
                {/* Waving Hand circle */}
                <circle cx="12" cy="56" r="4.5" fill="var(--colors-primary)" stroke="var(--colors-ink)" strokeWidth="2.5" />
              </motion.g>

              {/* Lower Body Group (Completely Hidden during peeking/sneaking, visible when jumped out) */}
              <g style={{ opacity: isJumpingOut || isHovered || botState !== "docked" ? 1 : 0, transition: "opacity 0.2s ease" }}>
                {/* Body (Shifted down by 6 units) */}
                <rect x="28" y="78" width="44" height="34" rx="10" fill="var(--colors-surface-soft)" stroke="var(--colors-ink)" strokeWidth="4" />

                {/* Lightning Bolt (Flash symbol) on Chest (Shifted down by 6 units) */}
                <path d="M 50 84 L 45 94 L 49 94 L 47 102 L 55 92 L 51 92 Z" fill="var(--colors-accent-amber)" stroke="var(--colors-ink)" strokeWidth="1.5" strokeLinejoin="round" />

                {/* Right Arm resting down (Shifted shoulder to 86 and path by 6 units) */}
                <path d="M 72 86 C 82 90 82 96 78 100" stroke="var(--colors-ink)" strokeWidth="4.2" strokeLinecap="round" fill="none" />

                {/* Feet (Shifted down by 6 units) */}
                <ellipse cx="38" cy="116" rx="9" ry="5" fill="var(--colors-primary)" stroke="var(--colors-ink)" strokeWidth="3" />
                <ellipse cx="62" cy="116" rx="9" ry="5" fill="var(--colors-primary)" stroke="var(--colors-ink)" strokeWidth="3" />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel"
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              width: "380px",
              height: "560px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(20,20,19,0.12)",
              background: "var(--colors-canvas)",
              borderColor: "var(--colors-hairline)",
              zIndex: 1000,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--colors-hairline)",
                background: "var(--colors-surface-soft)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Tiny Robot Head Icon */}
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="15" y="25" width="70" height="55" rx="16" fill="var(--colors-surface-soft)" stroke="var(--colors-ink)" strokeWidth="6" />
                  <circle cx="36" cy="52" r="8" fill="var(--colors-ink)" />
                  <circle cx="64" cy="52" r="8" fill="var(--colors-ink)" />
                  <path d="M 42 64 Q 50 70 58 64" stroke="var(--colors-ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <rect x="46" y="8" width="8" height="18" rx="4" fill="var(--colors-ink)" />
                  <circle cx="50" cy="8" r="6" fill="var(--colors-primary)" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--colors-ink)",
                    letterSpacing: "0.05em",
                  }}
                >
                  FLASH // ONLINE
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--colors-muted)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                ✕
              </button>
            </div>

            {/* Message History */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background:
                        msg.role === "user"
                          ? "var(--colors-surface-cream-strong)"
                          : "var(--colors-surface-soft)",
                      border: "1px solid var(--colors-hairline)",
                      borderBottomRightRadius: msg.role === "user" ? "2px" : "12px",
                      borderBottomLeftRadius: msg.role === "user" ? "12px" : "2px",
                    }}
                  >
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "var(--colors-surface-soft)",
                      border: "1px solid var(--colors-hairline)",
                      borderBottomLeftRadius: "2px",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      color: "var(--colors-muted)",
                    }}
                  >
                    THINKING...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestion Chips */}
            {messages.length === 1 && !loading && (
              <div
                style={{
                  padding: "0 20px 12px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--colors-muted)", fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>
                  Suggested Queries
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      style={{
                        background: "var(--colors-canvas)",
                        border: "1px solid var(--colors-hairline)",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        textAlign: "left",
                        fontSize: 12,
                        cursor: "pointer",
                        color: "var(--colors-body)",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "var(--colors-primary)";
                        e.currentTarget.style.background = "var(--colors-surface-soft)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "var(--colors-hairline)";
                        e.currentTarget.style.background = "var(--colors-canvas)";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--colors-hairline)",
                background: "var(--colors-surface-soft)",
                display: "flex",
                gap: 8,
              }}
            >
              <input
                type="text"
                placeholder="Ask Flash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid var(--colors-hairline)",
                  borderRadius: "6px",
                  background: "var(--colors-canvas)",
                  color: "var(--colors-ink)",
                  outline: "none",
                  fontSize: 13,
                  fontFamily: "var(--font-sans)",
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                style={{
                  padding: "8px 16px",
                  background: "var(--colors-primary)",
                  color: "var(--colors-on-primary)",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
