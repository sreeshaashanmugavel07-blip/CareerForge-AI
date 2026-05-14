"use client";

import { motion } from "framer-motion";

/** Soft animated aurora wash behind hero sections. */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/2 top-[-20%] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-violet-500/35 via-fuchsia-500/25 to-transparent blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/3 bottom-[-10%] h-[560px] w-[560px] rounded-full bg-gradient-to-tr from-sky-400/30 via-cyan-300/20 to-transparent blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-400/20 to-transparent blur-3xl"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.16),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
    </div>
  );
}
