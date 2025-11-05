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
            At Sylorlabs, we&apos;re passionate about pushing the boundaries of audio
            software development. Our mission is to create high-quality VST3
            instruments and tools that empower musicians, producers, and audio
            engineers to bring their creative visions to life.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Innovation",
                description: "Cutting-edge technology meets creative design",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Lightning bolt with circuit paths */}
                    <path d="M36 8 L28 32 L38 32 L26 56 L42 28 L32 28 Z" fill="currentColor" />
                    {/* Circuit nodes */}
                    <circle cx="20" cy="20" r="2" fill="currentColor" />
                    <circle cx="44" cy="20" r="2" fill="currentColor" />
                    <circle cx="16" cy="44" r="2" fill="currentColor" />
                    <circle cx="48" cy="44" r="2" fill="currentColor" />
                    {/* Circuit connections */}
                    <path d="M20 20 L28 32" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M44 20 L38 32" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 44 L26 56" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M48 44 L42 28" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ),
              },
              {
                title: "Quality",
                description: "Professional-grade tools for professionals",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Diamond/gem shape */}
                    <path d="M32 8 L48 24 L32 56 L16 24 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="bevel" fill="currentColor" fillOpacity="0.1" />
                    {/* Inner facets */}
                    <path d="M32 8 L32 56" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 24 L48 24" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 24 L32 32 L48 24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
                    {/* Sparkle effects */}
                    <circle cx="24" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="40" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="52" cy="28" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="28" r="1.5" fill="currentColor" />
                  </svg>
                ),
              },
              {
                title: "Community",
                description: "Built with feedback from producers worldwide",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Connected network of people */}
                    <circle cx="32" cy="20" r="6" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="16" cy="36" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="48" cy="36" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="24" cy="50" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="40" cy="50" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
                    {/* Connection lines */}
                    <path d="M32 26 L16 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M32 26 L48 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 36 L24 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M48 36 L40 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M24 50 L40 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
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
