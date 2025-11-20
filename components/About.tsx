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
                    {/* Rocket ship */}
                    <path d="M32 4 L32 4 C26 4 20 8 16 14 C12 20 8 28 8 36 L16 44 L20 44 L24 48 L28 48 L32 52 L36 48 L40 48 L44 44 L48 44 L56 36 C56 28 52 20 48 14 C44 8 38 4 32 4 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="32" cy="28" r="6" fill="currentColor" fillOpacity="0.3" />
                    <circle cx="32" cy="28" r="3" fill="currentColor" />
                    {/* Fins */}
                    <path d="M18 36 L8 42 L16 44 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M46 36 L56 42 L48 44 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    {/* Flame */}
                    <path d="M28 52 L32 60 L36 52" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M30 52 L32 56 L34 52" fill="currentColor" fillOpacity="0.7" />
                    {/* Stars */}
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="52" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="24" r="1" fill="currentColor" />
                    <circle cx="56" cy="28" r="1" fill="currentColor" />
                  </svg>
                ),
              },
              {
                title: "Quality",
                description: "Professional-grade tools for professionals",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Diamond/Gem shape */}
                    <path d="M32 6 L48 20 L32 58 L16 20 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M16 20 L32 6 L48 20 L32 20 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                    {/* Inner facets */}
                    <line x1="32" y1="6" x2="32" y2="58" stroke="currentColor" strokeWidth="2" />
                    <line x1="16" y1="20" x2="32" y2="58" stroke="currentColor" strokeWidth="2" />
                    <line x1="48" y1="20" x2="32" y2="58" stroke="currentColor" strokeWidth="2" />
                    <line x1="24" y1="13" x2="24" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                    <line x1="40" y1="13" x2="40" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                    <line x1="20" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="2" />
                    {/* Top facets */}
                    <line x1="24" y1="13" x2="32" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                    <line x1="40" y1="13" x2="32" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                    {/* Shine effect */}
                    <circle cx="28" cy="14" r="2" fill="currentColor" opacity="0.8" />
                  </svg>
                ),
              },
              {
                title: "Community",
                description: "Made for producers by producers",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Three people holding hands in a circle */}
                    {/* Person 1 - Top */}
                    <circle cx="32" cy="14" r="5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                    <path d="M32 20 L32 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M24 24 L32 20 L40 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Person 2 - Bottom Left */}
                    <circle cx="16" cy="44" r="5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 50 L16 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M10 54 L16 50 L22 54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Person 3 - Bottom Right */}
                    <circle cx="48" cy="44" r="5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                    <path d="M48 50 L48 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M42 54 L48 50 L54 54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Connecting circle */}
                    <circle cx="32" cy="37" r="19" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.4" strokeDasharray="4 4" />

                    {/* Connection lines forming triangle */}
                    <path d="M32 30 L16 44" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                    <path d="M32 30 L48 44" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                    <path d="M16 44 L48 44" stroke="currentColor" strokeWidth="2" opacity="0.6" />

                    {/* Heart in center */}
                    <path d="M32 38 L29 35 C27.5 33.5 27.5 31 29 29.5 C30.5 28 32 29 32 29 C32 29 33.5 28 35 29.5 C36.5 31 36.5 33.5 35 35 Z" fill="currentColor" />
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
