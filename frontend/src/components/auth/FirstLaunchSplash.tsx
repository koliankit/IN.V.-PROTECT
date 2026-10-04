import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, FastForward, Shield, Zap, Eye, CheckCircle2, Lock, AlertTriangle, ChevronRight } from "lucide-react";

interface FirstLaunchSplashProps {
  onGetStarted: () => void;
  onDirectLogin?: () => void;
  autoAdvance?: boolean;
}

const GLYPHS = "01#$&*@%!<>[]{}ABCDEFGHJKLMNPQRSTUVWXYZ∆∇∏∑Ω";

function useScrambleText(targetText: string, trigger: boolean, durationMs = 1000) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!trigger) { setText(""); return; }
    let frame = 0;
    const totalFrames = Math.max(15, Math.round(durationMs / 35));
    const chars = targetText.split("");
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      const revealedCount = Math.floor(progress * chars.length);
      const scrambled = chars
        .map((char, index) => {
          if (char === " ") return " ";
          if (char === ".") return ".";
          if (index < revealedCount) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setText(scrambled);
      if (frame >= totalFrames) { clearInterval(interval); setText(targetText); }
    }, 35);
    return () => clearInterval(interval);
  }, [targetText, trigger, durationMs]);
  return text;
}

const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
    const colors = ["#02C39A", "#4DA3FF", "#02C39A", "#02C39A", "#ffffff"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill();
      });
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(2, 195, 154, ${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
};

const DEMO_CASES = [
  { id: 1, label: "DEMO 1", title: "Guaranteed Return Scam", icon: AlertTriangle, color: "#FF4757", glow: "rgba(255,71,87,0.35)", tag: "HIGH RISK" },
  { id: 2, label: "DEMO 2", title: "OTP / Demat Credential Harvesting", icon: Lock, color: "#FF6B35", glow: "rgba(255,107,53,0.35)", tag: "CRITICAL" },
  { id: 3, label: "DEMO 3", title: "Fake Trading App / APK Sideload", icon: AlertTriangle, color: "#FF4757", glow: "rgba(255,71,87,0.35)", tag: "HIGH RISK" },
  { id: 4, label: "DEMO 4", title: "Payment-Before-Withdrawal Extortion", icon: Lock, color: "#FF4757", glow: "rgba(255,71,87,0.35)", tag: "HIGH RISK" },
  { id: 5, label: "DEMO 5", title: "Legitimate Investor Awareness Message", icon: CheckCircle2, color: "#02C39A", glow: "rgba(2,195,154,0.35)", tag: "SAFE" },
  { id: 6, label: "DEMO 6", title: "Ambiguous Financial Message", icon: Eye, color: "#F5B942", glow: "rgba(245,185,66,0.35)", tag: "REVIEW" },
];

const terminalLines = [
  { text: "INITIALIZING ZERO-TRUST INVESTOR DEFENSE CORE...", highlight: false },
  { text: "CONNECTING SEBI STATUTORY REGISTRIES (sebi.gov.in)...", highlight: false },
  { text: "VERIFYING RBI FINANCIAL AWARENESS RULES (rbi.org.in)...", highlight: false },
  { text: "SYNCHRONIZING I4C NATIONAL CYBER HELPLINE (1930)...", highlight: false },
  { text: "ALL 14,000+ REGULATORY GAZETTES LOADED — STATUS: ACTIVE", highlight: true },
];

const securityPillars = ["DETECT", "VERIFY", "PROTECT", "EXPLAIN", "RESPOND"];

export const FirstLaunchSplash: React.FC<FirstLaunchSplashProps> = ({
  onGetStarted,
  autoAdvance = true,
}) => {
  const [phase, setPhase] = useState<"boot" | "terminal" | "reveal" | "exit">("boot");
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progressVal, setProgressVal] = useState(0);
  const [hoveredDemo, setHoveredDemo] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const titleScramble = useScrambleText("IN.V. PROTECT", phase === "reveal", 1400);
  const taglineScramble = useScrambleText("Personal Digital Security Layer for Investors", phase === "reveal", 1100);

  useEffect(() => {
    const t = setTimeout(() => setPhase("terminal"), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "terminal") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    terminalLines.forEach((_, idx) => {
      const t = setTimeout(() => setVisibleLines(prev => [...prev, idx]), idx * 450 + 100);
      timers.push(t);
    });
    const progressInterval = setInterval(() => {
      setProgressVal(prev => { if (prev >= 100) { clearInterval(progressInterval); return 100; } return prev + 4.5; });
    }, 100);
    const revealTimer = setTimeout(() => setPhase("reveal"), terminalLines.length * 450 + 600);
    return () => { timers.forEach(clearTimeout); clearInterval(progressInterval); clearTimeout(revealTimer); };
  }, [phase]);

  useEffect(() => {
    if (phase === "reveal" && autoAdvance) {
      const t = setTimeout(handleComplete, 6000);
      return () => clearTimeout(t);
    }
  }, [phase, autoAdvance]);

  const handleComplete = useCallback(() => {
    setPhase("exit");
    setTimeout(() => onGetStarted(), 450);
  }, [onGetStarted]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.012);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.012);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMouseMove}
      onClick={() => {
        if (phase === "terminal") setPhase("reveal");
        else if (phase === "reveal") handleComplete();
      }}
      style={{
        position: "fixed", inset: 0, width: "100vw", height: "100vh",
        background: "radial-gradient(ellipse at 40% 30%, #0A1F1A 0%, #060A0D 50%, #080C0F 100%)",
        color: "#F5F7F8", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden", cursor: "pointer",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <ParticleField />

      {/* Ambient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -40, 0], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "8%", left: "18%", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(2,195,154,0.28) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, 50, 0], opacity: [0.10, 0.20, 0.10] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", bottom: "8%", right: "12%", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(77,163,255,0.20) 0%, transparent 70%)",
          filter: "blur(90px)", pointerEvents: "none", zIndex: 0,
        }}
      />

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)",
      }} />

      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "linear-gradient(rgba(2,195,154,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.022) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Corner brackets */}
      {[
        { top: 18, left: 18, borderTop: "2px solid", borderLeft: "2px solid" },
        { top: 18, right: 18, borderTop: "2px solid", borderRight: "2px solid" },
        { bottom: 18, left: 18, borderBottom: "2px solid", borderLeft: "2px solid" },
        { bottom: 18, right: 18, borderBottom: "2px solid", borderRight: "2px solid" },
      ].map((style, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}
          style={{ position: "absolute", width: 26, height: 26, borderColor: "rgba(2,195,154,0.45)", ...style, pointerEvents: "none", zIndex: 2 }}
        />
      ))}

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        type="button"
        onClick={(e) => { e.stopPropagation(); handleComplete(); }}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        style={{
          position: "fixed", top: 24, right: 28, display: "flex", alignItems: "center", gap: 8,
          background: "rgba(6,10,14,0.72)", border: "1px solid rgba(2,195,154,0.22)",
          color: "#9AA5AD", borderRadius: 24, padding: "9px 20px", fontSize: 11, fontWeight: 700,
          cursor: "pointer", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          zIndex: 100, letterSpacing: "0.06em",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(2,195,154,0.07)",
          transition: "all 0.2s ease",
        }}
      >
        <span>SKIP INTRO</span>
        <FastForward style={{ width: 12, height: 12, color: "#02C39A" }} />
      </motion.button>

      <AnimatePresence mode="wait">

        {/* ── TERMINAL PHASE ── */}
        {phase === "terminal" && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93, filter: "blur(14px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "90%", maxWidth: 680, zIndex: 10, position: "relative" }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(2,195,154,0.08)", border: "1px solid rgba(2,195,154,0.28)",
                borderRadius: 8, padding: "5px 14px",
              }}>
                <Shield style={{ width: 13, height: 13, color: "#02C39A" }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: "#02C39A", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>
                  IN.V.PROTECT // BOOTSTRAP_INTEGRITY_CHECK
                </span>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {["#E5484D", "#F5B942", "#02C39A"].map((c, i) => (
                  <motion.span key={i}
                    animate={{ boxShadow: [`0 0 4px ${c}`, `0 0 10px ${c}`, `0 0 4px ${c}`] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: c, display: "block" }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Terminal card */}
            <div style={{
              backgroundColor: "rgba(6,12,16,0.78)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "24px 28px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.11), 0 0 60px rgba(2,195,154,0.07)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(2,195,154,0.45), transparent)", pointerEvents: "none" }} />

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 2, minHeight: 155 }}>
                {terminalLines.map((line, idx) => {
                  const isVisible = visibleLines.includes(idx);
                  const isLast = idx === Math.max(...(visibleLines.length ? visibleLines : [0]));
                  return (
                    <AnimatePresence key={idx}>
                      {isVisible && (
                        <motion.div
                          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}
                          style={{ display: "flex", alignItems: "center", gap: 10, color: line.highlight ? "#02C39A" : "#C0CDD4" }}
                        >
                          <span style={{ color: line.highlight ? "#02C39A" : "#4DA3FF", fontSize: 10, minWidth: 12 }}>
                            {line.highlight ? "✓" : "▶"}
                          </span>
                          <span style={{ fontWeight: line.highlight ? 700 : 400 }}>{line.text}</span>
                          {isLast && !line.highlight && (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
                              style={{ display: "inline-block", width: 7, height: 13, backgroundColor: "#02C39A", boxShadow: "0 0 10px #02C39A" }}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#4A5560", marginBottom: 6 }}>
                  <span>VERIFYING REGULATORY SIGNATURES</span>
                  <motion.span animate={{ color: progressVal === 100 ? "#02C39A" : "#F5B942" }} style={{ fontWeight: 800 }}>
                    {Math.round(progressVal)}%
                  </motion.span>
                </div>
                <div style={{ width: "100%", height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    style={{ height: "100%", borderRadius: 2, width: `${progressVal}%` }}
                    animate={{
                      background: progressVal < 60 ? "linear-gradient(90deg, #02C39A, #4DA3FF)" : "linear-gradient(90deg, #02C39A, #00FFD0)",
                      boxShadow: `0 0 ${6 + progressVal * 0.12}px rgba(2,195,154,0.8)`,
                    }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── REVEAL PHASE ── */}
        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.89, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 10, width: "96%", maxWidth: 880, position: "relative" }}
          >
            {/* Parallax shield ghost */}
            <motion.div
              style={{ position: "absolute", top: -110, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 0, x: springX, y: springY }}
            >
              <motion.div animate={{ opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 4, repeat: Infinity }}>
                <Shield style={{ width: 420, height: 420, color: "#02C39A" }} />
              </motion.div>
            </motion.div>

            {/* Main card */}
            <div style={{
              backgroundColor: "rgba(8, 14, 18, 0.74)", backdropFilter: "blur(38px)", WebkitBackdropFilter: "blur(38px)",
              border: "1px solid rgba(255,255,255,0.11)", borderRadius: 28, padding: "44px 48px 40px",
              boxShadow: "0 40px 100px rgba(0,0,0,0.88), inset 0 1px 0 rgba(255,255,255,0.16), 0 0 80px rgba(2,195,154,0.09)",
              position: "relative", overflow: "hidden", textAlign: "center",
            }}>
              {/* Specular top edge */}
              <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.42), transparent)", pointerEvents: "none" }} />
              {/* Side glow lines */}
              <div style={{ position: "absolute", top: "18%", bottom: "18%", left: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(2,195,154,0.28), transparent)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "18%", bottom: "18%", right: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(2,195,154,0.28), transparent)", pointerEvents: "none" }} />

              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 24,
                  background: "rgba(2,195,154,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(2,195,154,0.32)",
                  color: "#02C39A", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", marginBottom: 28,
                  boxShadow: "0 0 28px rgba(2,195,154,0.16), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <motion.span
                  animate={{ boxShadow: ["0 0 4px #02C39A", "0 0 12px #02C39A", "0 0 4px #02C39A"] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#02C39A", display: "block" }}
                />
                <span>SYSTEM PROTECTED • SEBI &amp; RBI GROUNDED</span>
                <Zap style={{ width: 11, height: 11 }} />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
                style={{ fontSize: "clamp(46px, 6vw, 74px)", fontWeight: 900, letterSpacing: "-0.025em", margin: "0 0 14px 0", lineHeight: 1.05 }}
              >
                <span style={{
                  background: "linear-gradient(135deg, #FFFFFF 20%, #02C39A 80%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 40px rgba(2,195,154,0.40))", display: "inline-block",
                }}>
                  {titleScramble || "IN.V. PROTECT"}
                </span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                style={{ fontSize: "clamp(14px, 1.6vw, 17px)", fontWeight: 500, color: "rgba(2,195,154,0.88)", margin: "0 0 30px 0", letterSpacing: "0.01em" }}
              >
                {taglineScramble || "Personal Digital Security Layer for Investors"}
              </motion.p>

              {/* Security pillars */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }}
                style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginBottom: 32 }}
              >
                {securityPillars.map((pillar, i) => (
                  <motion.div key={pillar}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.07 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    style={{
                      backgroundColor: "rgba(2,195,154,0.06)", border: "1px solid rgba(2,195,154,0.20)",
                      padding: "6px 16px", borderRadius: 8, fontSize: 10, fontWeight: 800, color: "#8A96A0",
                      letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace", cursor: "default",
                    }}
                  >
                    <span style={{ color: "#02C39A", marginRight: 6 }}>◆</span>
                    {pillar}
                  </motion.div>
                ))}
              </motion.div>

              {/* Demo cases */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82, duration: 0.45 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, justifyContent: "flex-start" }}>
                  <Zap style={{ width: 13, height: 13, color: "#F5B942" }} />
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#F5B942", fontFamily: "'JetBrains Mono', monospace" }}>
                    1-CLICK INTERACTIVE TEST CASES:
                  </span>
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(245,185,66,0.35), transparent)" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
                  {DEMO_CASES.map((demo, i) => {
                    const isHovered = hoveredDemo === demo.id;
                    return (
                      <motion.button
                        key={demo.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.92 + i * 0.055 }}
                        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        onMouseEnter={() => setHoveredDemo(demo.id)}
                        onMouseLeave={() => setHoveredDemo(null)}
                        onClick={(e) => { e.stopPropagation(); handleComplete(); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 9,
                          padding: "11px 13px", borderRadius: 11, textAlign: "left",
                          background: isHovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)",
                          border: `1px solid ${isHovered ? demo.color : "rgba(255,255,255,0.18)"}`,
                          cursor: "pointer",
                          boxShadow: isHovered
                            ? `0 8px 28px rgba(0,0,0,0.5), 0 0 22px ${demo.glow}, inset 0 1px 0 rgba(255,255,255,0.2)`
                            : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                          transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                          position: "relative", overflow: "hidden",
                        }}
                      >
                        {isHovered && (
                          <motion.div
                            initial={{ x: "-100%" }} animate={{ x: "220%" }} transition={{ duration: 0.65, ease: "easeInOut" }}
                            style={{ position: "absolute", top: 0, bottom: 0, width: "50%", background: `linear-gradient(90deg, transparent, ${demo.color}14, transparent)`, pointerEvents: "none" }}
                          />
                        )}
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                          backgroundColor: demo.color,
                          boxShadow: `0 0 ${isHovered ? 12 : 5}px ${demo.color}`,
                          transition: "all 0.2s ease",
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 9, fontWeight: 800, color: demo.color, letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>
                            {demo.label}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                            {demo.title}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 8, fontWeight: 800, letterSpacing: "0.07em", color: demo.color,
                            fontFamily: "'JetBrains Mono', monospace",
                            background: `${demo.color}16`, border: `1px solid ${demo.color}28`,
                            borderRadius: 4, padding: "2px 6px",
                          }}>
                            {demo.tag}
                          </span>
                          <ChevronRight style={{ width: 11, height: 11, color: isHovered ? demo.color : "rgba(255,255,255,0.18)", transition: "all 0.2s ease" }} />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.34, duration: 0.4 }}
                style={{ marginTop: 32, display: "flex", justifyContent: "center" }}
              >
                <motion.button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleComplete(); }}
                  whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                  style={{
                    background: "linear-gradient(135deg, #02C39A, #01A882)",
                    color: "#04090C", fontWeight: 800, fontSize: 14,
                    padding: "15px 38px", borderRadius: 14, border: "none",
                    display: "inline-flex", alignItems: "center", gap: 10,
                    cursor: "pointer", letterSpacing: "0.03em",
                    boxShadow: "0 8px 32px rgba(2,195,154,0.52), inset 0 1px 0 rgba(255,255,255,0.44)",
                    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <Shield style={{ width: 16, height: 16 }} />
                  <span>Enter Protection Layer</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </motion.button>
              </motion.div>
            </div>

            {/* Click hint */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.35, 0] }}
              transition={{ delay: 2.8, duration: 1.5, repeat: Infinity, repeatDelay: 2.5 }}
              style={{ textAlign: "center", marginTop: 14, fontSize: 10, color: "#2E3840", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}
            >
              CLICK ANYWHERE TO CONTINUE
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
