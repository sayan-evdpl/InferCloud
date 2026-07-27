import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { sendChatMessage } from "../api/gpuApi";

const SUGGESTIONS = [
  "Best GPU to fine-tune Llama 3 8B?",
  "Compare RTX 5090 vs H200 side-by-side",
  "Calculate TCO for 10h/day runtime",
  "What is the cheapest H100 rate today?",
];

// 15 Minutes Inactivity Limit (15m * 60s * 1000ms = 900,000ms)
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export default function ChatWidget({ searchOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleText, setBubbleText] = useState("Have a query? Don't worry, Flash is ready to help you!");
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isJumpingOut, setIsJumpingOut] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Persistent Bearer Token State
  const [token, setToken] = useState(() => {
    const savedToken = sessionStorage.getItem("flash_bearer_token");
    const lastActive = sessionStorage.getItem("flash_last_activity");
    if (savedToken && lastActive) {
      if (Date.now() - parseInt(lastActive, 10) < FIFTEEN_MINUTES_MS) {
        return savedToken;
      } else {
        sessionStorage.removeItem("flash_bearer_token");
        sessionStorage.removeItem("flash_last_activity");
      }
    }
    return null;
  });

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: token === "flashonn"
        ? "Welcome back! Flash is active. How can I help you today with GPU specs, cloud rates, or TCO economics?"
        : "Hello! Flash is currently locked. Please enter the password to unlock AI assistance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Positioning & Telemetry States
  const [botState, setBotState] = useState("docked");
  const [coordinates, setCoordinates] = useState({ x: null, y: null });
  const [telemetryTimerFired, setTelemetryTimerFired] = useState(false);

  const chatEndRef = useRef(null);
  const botRef = useRef(null);
  const lastActiveRef = useRef(Date.now());
  const recognitionRef = useRef(null);

  // Function to register user activity & refresh 15-min inactivity timer
  const recordUserActivity = useCallback(() => {
    lastActiveRef.current = Date.now();
    if (token) {
      sessionStorage.setItem("flash_last_activity", Date.now().toString());
    }
  }, [token]);

  // Web Speech API Voice Recognition Toggle
  const toggleVoiceRecognition = () => {
    recordUserActivity();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your current browser. Please type your prompt.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInput(transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error("Error starting voice recognition:", err);
        setIsListening(false);
      }
    }
  };

  // Periodic 15-Minute Inactivity Auto-Lock Monitor
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        const inactiveDuration = Date.now() - lastActiveRef.current;
        if (inactiveDuration >= FIFTEEN_MINUTES_MS) {
          setToken(null);
          sessionStorage.removeItem("flash_bearer_token");
          sessionStorage.removeItem("flash_last_activity");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "🔒 Flash has been automatically locked due to 15 minutes of inactivity. Please enter the password to unlock AI assistance.",
            },
          ]);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  // Track user keypresses and window clicks when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleUserInteraction = () => recordUserActivity();

    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    window.addEventListener("click", handleUserInteraction);

    return () => {
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
    };
  }, [isOpen, recordUserActivity]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTelemetryTimerFired(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async (textToSend) => {
    recordUserActivity();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput("");

    // Intercept activation command
    if (text.trim().toLowerCase() === "flashonn") {
      const activeToken = "flashonn";
      setToken(activeToken);
      sessionStorage.setItem("flash_bearer_token", activeToken);
      sessionStorage.setItem("flash_last_activity", Date.now().toString());
      lastActiveRef.current = Date.now();

      const newMsgList = [
        ...messages,
        { role: "user", content: text },
        { role: "assistant", content: "⚡ Flash has been successfully activated! (15-minute inactivity bearer timer started). How can I help you today with GPU specs, cloud rates, or TCO economics?" }
      ];
      setMessages(newMsgList);
      return;
    }

    // Intercept deactivation command
    if (text.trim().toLowerCase() === "flashoff") {
      setToken(null);
      sessionStorage.removeItem("flash_bearer_token");
      sessionStorage.removeItem("flash_last_activity");
      const newMsgList = [
        ...messages,
        { role: "user", content: text },
        { role: "assistant", content: "🔒 Flash has been locked. Please enter the password to unlock again." }
      ];
      setMessages(newMsgList);
      return;
    }

    // Check if token expired before sending
    const savedLastActive = sessionStorage.getItem("flash_last_activity");
    if (savedLastActive && Date.now() - parseInt(savedLastActive, 10) >= FIFTEEN_MINUTES_MS) {
      setToken(null);
      sessionStorage.removeItem("flash_bearer_token");
      sessionStorage.removeItem("flash_last_activity");
      const newMsgList = [
        ...messages,
        { role: "user", content: text },
        { role: "assistant", content: "🔒 Session expired after 15 minutes of inactivity. Please enter the password to unlock again." }
      ];
      setMessages(newMsgList);
      return;
    }

    // Block usage if not activated
    if (token !== "flashonn") {
      const newMsgList = [
        ...messages,
        { role: "user", content: text },
        { role: "assistant", content: "Flash is currently locked. Please enter the password to unlock." }
      ];
      setMessages(newMsgList);
      return;
    }

    const newMsgList = [...messages, { role: "user", content: text }];
    setMessages(newMsgList);
    setLoading(true);

    try {
      const res = await sendChatMessage(newMsgList, token);
      const replyText = res.text || res.reply || "No response received.";
      setMessages([...newMsgList, { role: "assistant", content: replyText }]);
    } catch (err) {
      setMessages([
        ...newMsgList,
        { role: "assistant", content: "Sorry, I encountered an error retrieving data from the backend server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    recordUserActivity();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: content.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", lang: match[1] || "code", value: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", value: content.substring(lastIndex) });
    }

    return parts.map((part, i) => {
      if (part.type === "text") {
        return (
          <div key={i} style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.5" }}>
            {part.value}
          </div>
        );
      } else {
        return renderCodeCardBlock(part.lang, part.value, i);
      }
    });
  };

  const renderCodeCardBlock = (lang, code, key) => {
    return (
      <div
        key={key}
        style={{
          margin: "12px 0",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid rgba(178, 107, 245, 0.25)",
          backgroundColor: "#ffffff",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Theme Violet Code Header Bar */}
        <div
          style={{
            padding: "8px 14px",
            backgroundColor: "#f3e8ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(178, 107, 245, 0.2)",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                backgroundColor: "#b26bf5",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              {lang || "CODE"}
            </span>
          </div>
          <button
            onClick={() => {
              recordUserActivity();
              navigator.clipboard.writeText(code);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "600",
              color: "#9333ea",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Copy Code
          </button>
        </div>

        {/* Code View Area */}
        <pre
          style={{
            padding: "12px 14px",
            margin: 0,
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            color: "#1f2937",
            backgroundColor: "#f9fafb",
            overflowX: "auto",
            lineHeight: 1.5,
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Mascot Button */}
      {!isOpen && (
        <motion.div
          ref={botRef}
          initial={{ x: 120, opacity: 0 }}
          animate={{
            x: 0,
            y: [0, -6, 0],
            opacity: 1,
          }}
          transition={{
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            opacity: { duration: 0.5 },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          {/* Attention Speech Bubble */}
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 10 }}
                onClick={() => {
                  recordUserActivity();
                  setIsOpen(true);
                  setShowBubble(false);
                }}
                style={{
                  pointerEvents: "auto",
                  cursor: "pointer",
                  background: "var(--color-ink-black)",
                  color: "var(--color-paper-white)",
                  borderRadius: "14px 14px 2px 14px",
                  padding: "10px 14px",
                  marginBottom: 10,
                  boxShadow: "var(--shadow-subtle-3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  maxWidth: "280px",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--font-nunito-sans)", lineHeight: 1.4 }}>
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
                    fontSize: 12,
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.6)",
                    padding: 2,
                    marginLeft: "auto",
                  }}
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascot Button */}
          <motion.div
            onClick={() => {
              recordUserActivity();
              setIsOpen(true);
              setShowBubble(false);
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            style={{
              pointerEvents: "auto",
              cursor: "pointer",
              position: "relative",
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f472b6 0%, #b26bf5 100%)",
              border: "3px solid #ffffff",
              boxShadow: "0 8px 24px rgba(244, 114, 182, 0.55), 0 0 20px rgba(178, 107, 245, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/chatbot_avatar.png"
              alt="Metallic Pinkish Robot Mascot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Expanded Light Bluish-Pinkish Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              width: "410px",
              height: "590px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.12), 0 0 30px rgba(244, 114, 182, 0.15)",
              backgroundColor: "#fcf8fd",
              backgroundImage: `
                radial-gradient(circle at 10% 10%, rgba(244, 114, 182, 0.10) 0%, transparent 40%),
                radial-gradient(circle at 90% 20%, rgba(147, 197, 253, 0.12) 0%, transparent 50%),
                linear-gradient(180deg, #fdf8fd 0%, #f6f0fa 50%, #f0f6fe 100%)
              `,
              border: "1px solid rgba(178, 107, 245, 0.25)",
              borderRadius: "26px",
              zIndex: 1000,
            }}
          >
            {/* Top Drifting Clouds Header Area */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(178, 107, 245, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background Drifting Clouds */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4 }}>
                <motion.div
                  animate={{ x: [-15, 15, -15] }}
                  transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                  style={{ position: "absolute", top: "4px", left: "20%" }}
                >
                  <svg width="60" height="25" viewBox="0 0 60 25" fill="#ffffff">
                    <path d="M 5 20 C 0 20, 0 10, 8 8 C 12 2, 22 2, 28 8 C 34 2, 44 2, 48 8 C 55 10, 55 20, 50 20 Z" />
                  </svg>
                </motion.div>
                <motion.div
                  animate={{ x: [15, -15, 15] }}
                  transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                  style={{ position: "absolute", top: "10px", right: "15%" }}
                >
                  <svg width="70" height="28" viewBox="0 0 70 28" fill="#ffffff">
                    <path d="M 6 22 C 0 22, 0 12, 10 10 C 15 3, 28 3, 34 10 C 42 3, 52 3, 58 10 C 66 12, 66 22, 60 22 Z" />
                  </svg>
                </motion.div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
                {/* Robot Avatar Badge */}
                <img
                  src="/chatbot_avatar.png"
                  alt="Metallic Pink Robot"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "2px solid #f472b6",
                    objectFit: "cover",
                    boxShadow: "0 2px 10px rgba(244, 114, 182, 0.35)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-nunito-sans)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-ink-black)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {token === "flashonn" ? "FLASH - ACTIVE ⚡" : "FLASH - LOCKED 🔒"}
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(0, 0, 0, 0.05)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--color-charcoal-stone)",
                  fontSize: 14,
                  fontWeight: 600,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                ✕
              </button>
            </div>

            {/* Message History Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
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
                      maxWidth: "88%",
                      padding: msg.role === "user" ? "10px 18px" : "14px 16px",
                      borderRadius: msg.role === "user" ? "20px" : "18px",
                      backgroundColor:
                        msg.role === "user"
                          ? "#b26bf5"
                          : "#ffffff",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #b26bf5 0%, #ec4899 100%)"
                          : "#ffffff",
                      color: msg.role === "user" ? "#ffffff" : "var(--color-ink-black)",
                      border:
                        msg.role === "user"
                          ? "none"
                          : "1px solid rgba(216, 214, 206, 0.7)",
                      boxShadow:
                        msg.role === "user"
                          ? "0 4px 14px rgba(178, 107, 245, 0.35)"
                          : "0 4px 16px rgba(0, 0, 0, 0.04)",
                      fontSize: "14px",
                      lineHeight: "1.5",
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
                      padding: "8px 14px",
                      borderRadius: "14px",
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(216, 214, 206, 0.7)",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-ash-gray)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Query Cards */}
            {messages.length === 1 && !loading && (
              <div
                style={{
                  padding: "0 16px 12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <span className="caption-text" style={{ fontWeight: 700, color: "var(--color-charcoal-stone)", fontSize: "11px", letterSpacing: "0.05em" }}>
                  SUGGESTED QUERIES
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SUGGESTIONS.map((s, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(s)}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(216, 214, 206, 0.8)",
                        borderRadius: "14px",
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        color: "var(--color-ink-black)",
                        fontFamily: "var(--font-nunito-sans)",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Floating Pill Input Bar with Microphone Button */}
            <div
              style={{
                padding: "12px 16px 16px 16px",
                backgroundColor: "rgba(240, 246, 254, 0.7)",
                borderTop: "1px solid rgba(178, 107, 245, 0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#ffffff",
                  borderRadius: "9999px",
                  padding: "6px 8px 6px 16px",
                  border: isListening ? "1.5px solid #ec4899" : "1px solid rgba(178, 107, 245, 0.3)",
                  boxShadow: isListening ? "0 0 16px rgba(236, 72, 153, 0.35)" : "0 6px 20px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Left Attachment Icon */}
                <span style={{ color: "var(--color-ash-gray)", fontSize: "16px", cursor: "pointer" }}>
                  📎
                </span>

                <input
                  type="text"
                  placeholder={
                    isListening
                      ? "Listening... speak now..."
                      : token === "flashonn"
                      ? "Type your prompt here..."
                      : "Enter password..."
                  }
                  value={input}
                  onChange={(e) => {
                    recordUserActivity();
                    setInput(e.target.value);
                  }}
                  onKeyDown={handleKeyPress}
                  disabled={loading}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    fontFamily: "var(--font-nunito-sans)",
                    color: isListening ? "#ec4899" : "var(--color-ink-black)",
                    backgroundColor: "transparent",
                    fontWeight: isListening ? "600" : "400",
                  }}
                />

                {/* Voice Input Microphone Button */}
                <motion.button
                  onClick={toggleVoiceRecognition}
                  animate={isListening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={isListening ? { repeat: Infinity, duration: 1 } : {}}
                  title={isListening ? "Click to stop listening" : "Click for voice input"}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: isListening ? "#ef4444" : "rgba(178, 107, 245, 0.12)",
                    color: isListening ? "#ffffff" : "#b26bf5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "15px",
                    transition: "all 0.15s ease",
                    boxShadow: isListening ? "0 2px 10px rgba(239, 68, 68, 0.4)" : "none",
                  }}
                >
                  🎙️
                </motion.button>

                {/* Theme Violet/Pink Send Circle Button */}
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    background: "linear-gradient(135deg, #b26bf5 0%, #ec4899 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                    opacity: loading || !input.trim() ? 0.5 : 1,
                    fontSize: "16px",
                    boxShadow: "0 3px 12px rgba(236, 72, 153, 0.4)",
                    transition: "all 0.15s ease",
                  }}
                >
                  ↑
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
