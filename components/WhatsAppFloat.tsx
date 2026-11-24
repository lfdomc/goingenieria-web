"use client";
import { motion } from "motion/react";
import { waLink } from "@/lib/site";
import { WhatsAppGlyph } from "./Icon";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={waLink()}
      target="_blank"
      rel="noopener"
      className="wa-float"
      aria-label="Escribir por WhatsApp a Go Ingeniería"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <WhatsAppGlyph size={30} />
    </motion.a>
  );
}
