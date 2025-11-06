"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 bg-dark-bg relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ willChange: "background" }}
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          className="text-5xl font-bold text-center mb-12 text-gradient"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          About Sylorlabs
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.p
            className="text-xl text-gray-300 text-center leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We&apos;re in the early stages of building professional VST3 instruments and AI tools
            for music producers. We have UI mockups and are deep in the research phase—exploring
            JUCE for audio development, testing AI models for DAW integration, and planning
            the architecture. This is a real journey, and we&apos;re inviting you to follow along.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Innovation",
                description: "Cutting-edge technology meets creative design",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Lightbulb shape */}
                    <path d="M32 8 C24 8 18 14 18 22 C18 26 19 29 21 32 L21 42 C21 44 22 46 24 46 L40 46 C42 46 43 44 43 42 L43 32 C45 29 46 26 46 22 C46 14 40 8 32 8 Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
                    {/* Bulb base */}
                    <rect x="26" y="46" width="12" height="4" rx="1" fill="currentColor" opacity="0.3" />
                    <rect x="28" y="50" width="8" height="3" rx="1" fill="currentColor" opacity="0.5" />
                    {/* Light rays */}
                    <path d="M32 4 L32 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M14 14 L17 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M8 32 L12 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M50 14 L47 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M56 32 L52 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Filament inside */}
                    <path d="M28 20 Q32 24 36 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M28 26 Q32 30 36 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                title: "Quality",
                description: "Professional-grade tools for professionals",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Shield shape */}
                    <path d="M32 6 L10 16 L10 32 C10 42 16 50 32 58 C48 50 54 42 54 32 L54 16 Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
                    {/* Star inside shield */}
                    <path d="M32 22 L34.5 28.5 L41 29 L36.5 33.5 L38 40 L32 36.5 L26 40 L27.5 33.5 L23 29 L29.5 28.5 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    {/* Shield border accent */}
                    <path d="M32 6 L10 16 L10 32 C10 42 16 50 32 58 C48 50 54 42 54 32 L54 16 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  </svg>
                ),
              },
              {
                title: "Community",
                description: "Built by producers for producers",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Headphones with heart in center */}
                    {/* Left ear cup */}
                    <rect x="8" y="24" width="12" height="16" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
                    {/* Right ear cup */}
                    <rect x="44" y="24" width="12" height="16" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
                    {/* Headband arc */}
                    <path d="M20 24 Q32 8 44 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    {/* Inner headband padding */}
                    <path d="M22 24 Q32 12 42 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
                    {/* Heart in center */}
                    <path d="M32 38 L28 34 C26 32 26 29 28 27 C30 25 32 26 32 26 C32 26 34 25 36 27 C38 29 38 32 36 34 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    {/* Sound waves from ear cups */}
                    <path d="M6 32 L2 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <path d="M4 28 L1 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                    <path d="M4 36 L1 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                    <path d="M58 32 L62 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <path d="M60 28 L63 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                    <path d="M60 36 L63 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="glass p-6 rounded-2xl text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
                }}
              >
                <motion.div
                  className="mb-4"
                  style={{ willChange: "transform" }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-gradient">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
