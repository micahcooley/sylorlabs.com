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
          className="text-5xl font-bold text-center mb-16 text-gradient"
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
            className="text-xl text-gray-300 text-center leading-relaxed mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Sylorlabs engineers professional audio tools that empower creators at every level. We combine cutting-edge 
            technology with intuitive design to deliver studio-quality plugins, DAW software, and audio processing 
            tools that rival industry standards. Our commitment is to make professional audio production accessible 
            without compromising on quality or innovation.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-12 mt-20 max-w-4xl mx-auto">
            {[
              {
                title: "Our Mission",
                description: "Delivering professional audio tools that inspire creativity",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Mission/Target icon */}
                    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3" fill="none" />
                    <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="32" cy="32" r="3" fill="currentColor" />
                    {/* Arrow hitting center */}
                    <path d="M8 8 L28 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M22 22 L28 28 L24 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                title: "Audio Excellence",
                description: "Studio-quality tools engineered by audio professionals",
                icon: (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    {/* Three stick figures holding hands in a circle */}
                    {/* Person 1 - Top */}
                    <circle cx="32" cy="12" r="4" fill="currentColor" />
                    <line x1="32" y1="16" x2="32" y2="26" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="20" x2="26" y2="24" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="20" x2="38" y2="24" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="26" x2="28" y2="32" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="26" x2="36" y2="32" stroke="currentColor" strokeWidth="2" />
                    
                    {/* Person 2 - Bottom Left */}
                    <circle cx="16" cy="44" r="4" fill="currentColor" />
                    <line x1="16" y1="48" x2="16" y2="56" stroke="currentColor" strokeWidth="2" />
                    <line x1="16" y1="52" x2="12" y2="56" stroke="currentColor" strokeWidth="2" />
                    <line x1="16" y1="52" x2="20" y2="56" stroke="currentColor" strokeWidth="2" />
                    <line x1="16" y1="48" x2="28" y2="32" stroke="currentColor" strokeWidth="2" />
                    
                    {/* Person 3 - Bottom Right */}
                    <circle cx="48" cy="44" r="4" fill="currentColor" />
                    <line x1="48" y1="48" x2="48" y2="56" stroke="currentColor" strokeWidth="2" />
                    <line x1="48" y1="52" x2="44" y2="56" stroke="currentColor" strokeWidth="2" />
                    <line x1="48" y1="52" x2="52" y2="56" stroke="currentColor" strokeWidth="2" />
                    <line x1="48" y1="48" x2="36" y2="32" stroke="currentColor" strokeWidth="2" />
                    
                    {/* Holding hands connection */}
                    <line x1="28" y1="32" x2="36" y2="32" stroke="currentColor" strokeWidth="3" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="glass p-8 rounded-2xl text-center"
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
