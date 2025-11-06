"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Collaborators() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const roles = [
    {
      title: "C++ / DSP Developers",
      description: "Help build the audio engine with JUCE framework",
      skills: ["C++", "JUCE", "DSP", "Audio Programming"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Code brackets */}
          <path d="M16 12 L8 24 L16 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 12 L40 24 L32 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 8 L20 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Music Producers",
      description: "Test features and provide feedback on workflow",
      skills: ["DAW Experience", "Sound Design", "Production Knowledge"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Waveform */}
          <path d="M4 24 L8 24 L12 12 L16 36 L20 18 L24 30 L28 20 L32 28 L36 16 L40 32 L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Volume bars */}
          <rect x="10" y="8" width="2" height="8" fill="currentColor" opacity="0.3" />
          <rect x="26" y="4" width="2" height="12" fill="currentColor" opacity="0.3" />
          <rect x="36" y="6" width="2" height="10" fill="currentColor" opacity="0.3" />
        </svg>
      ),
    },
    {
      title: "UI/UX Designers",
      description: "Design intuitive interfaces for complex audio tools",
      skills: ["Figma", "UI Design", "User Experience", "Prototyping"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pen tool */}
          <path d="M12 36 L24 12 L30 24 L36 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Cursor */}
          <path d="M8 8 L8 24 L16 20 L20 28 L24 26 L20 18 L28 18 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "AI/ML Engineers",
      description: "Work on intelligent features for Wingman",
      skills: ["Python", "Machine Learning", "NLP", "AI Integration"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Neural network */}
          <circle cx="12" cy="16" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="12" cy="32" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="24" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="24" cy="36" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="36" cy="16" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="36" cy="32" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
          {/* Connections */}
          <path d="M15 16 L21 14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <path d="M15 32 L21 34" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <path d="M27 14 L33 16" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <path d="M27 34 L33 32" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="collaborators"
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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl font-bold mb-6 text-gradient"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Looking for Collaborators
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Building professional audio tools is a massive undertaking. I&apos;m looking for passionate
            people who want to contribute to something meaningful—this is <strong>unpaid/volunteer</strong>,
            but you&apos;ll get early access, credit in the project, and a solid portfolio piece.
          </motion.p>
          <motion.div
            className="inline-flex items-center gap-2 bg-accent-orange/20 border-2 border-accent-orange px-6 py-3 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-accent-orange font-bold">✨ Open to all skill levels</span>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
              }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="text-primary bg-primary/10 p-3 rounded-xl"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {role.icon}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gradient">
                    {role.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.a
            href="mailto:collaborate@sylorlabs.com?subject=I want to collaborate!"
            className="inline-block px-10 py-4 bg-gradient-primary text-white rounded-full font-semibold text-lg shadow-2xl"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch →
          </motion.a>
          <p className="text-sm text-gray-500 mt-4">
            Or reach out on Discord, Twitter, or GitHub (links in footer)
          </p>
        </motion.div>

        <motion.div
          className="mt-12 glass rounded-2xl p-6 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h4 className="text-lg font-bold mb-2 text-primary">What You Get:</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>Early access to all tools before public release</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>Full credit and attribution in the project</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>Real-world experience building professional audio software</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>Portfolio piece you can showcase to future employers/clients</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-green mt-1">✓</span>
              <span>Collaborative learning environment with other passionate builders</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
