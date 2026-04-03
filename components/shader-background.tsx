"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * Full-screen animated shader gradient background.
 * Renders flowing teal/blue/magenta orbs on a near-black canvas.
 * Reacts subtly to mouse position via speed modulation.
 */
export function ShaderBackground() {
  const [speed, setSpeed] = useState(0.4)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse X position to shader speed (0.2 - 0.8)
      const normalised = e.clientX / window.innerWidth
      setSpeed(0.2 + normalised * 0.6)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mounted])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Primary shader layer */}
      <div className="absolute inset-0 opacity-40">
        <MeshGradient
          colors={[
            "#050509", // Deep black
            "#0a1628", // Dark navy
            "#1EA3C7", // Teal
            "#3C66EA", // Blue
            "#B844BC", // Magenta
          ]}
          speed={speed}
          className="w-full h-full"
        />
      </div>

      {/* Floating orb overlays for depth */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(30,163,199,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "10%",
          left: "20%",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(184,68,188,0.12) 0%, transparent 70%)",
          filter: "blur(100px)",
          bottom: "5%",
          right: "10%",
        }}
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 20, -25, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(60,102,234,0.1) 0%, transparent 70%)",
          filter: "blur(90px)",
          top: "50%",
          left: "60%",
        }}
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.05, 0.92, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grain overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </motion.div>
  )
}
