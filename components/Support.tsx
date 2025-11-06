"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Support() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const supportOptions = [
    {
      name: "Ko-fi",
      description: "Buy me a coffee",
      url: "https://ko-fi.com/sylorlabs",
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Coffee cup */}
          <path d="M8 18 L8 32 C8 36 11 40 16 40 L28 40 C33 40 36 36 36 32 L36 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
          {/* Cup handle */}
          <path d="M36 22 L38 22 C40 22 42 24 42 26 C42 28 40 30 38 30 L36 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Steam */}
          <path d="M14 12 Q14 8 16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M22 10 Q22 6 24 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M30 12 Q30 8 32 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Saucer */}
          <ellipse cx="22" cy="40" rx="16" ry="3" fill="currentColor" opacity="0.2" />
        </svg>
      ),
      color: "from-red-500 to-pink-500",
    },
    {
      name: "GitHub Sponsors",
      description: "Monthly support",
      url: "https://github.com/sponsors/yourusername",
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Heart shape */}
          <path d="M24 40 L10 28 C6 24 6 18 10 14 C14 10 20 11 24 15 C28 11 34 10 38 14 C42 18 42 24 38 28 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Sparkle */}
          <circle cx="18" cy="10" r="1.5" fill="currentColor" />
          <circle cx="34" cy="8" r="1.5" fill="currentColor" />
          <circle cx="40" cy="18" r="1.5" fill="currentColor" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "PayPal",
      description: "One-time donation",
      url: "https://paypal.me/sylorlabs",
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dollar sign */}
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
          <path d="M24 12 L24 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 16 L26 16 C28 16 30 18 30 20 C30 22 28 24 26 24 L20 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 24 L28 24 C30 24 32 26 32 28 C32 30 30 32 28 32 L20 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <section
      id="support"
      ref={ref}
      className="py-24 bg-light-bg relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-primary"
            style={{
              width: 200,
              height: 200,
              left: `${20 * i}%`,
              top: `${Math.random() * 100}%`,
              willChange: "transform",
            }}
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

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
            Support the Project
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            I&apos;m a 15-year-old solo developer building these tools from scratch.
            Your support helps me afford development tools, learning resources, and eventually
            licenses like JUCE. Every contribution, no matter how small, makes a huge difference! ❤️
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {supportOptions.map((option, index) => (
            <motion.a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-8 text-center block group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="mb-6 inline-block"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className={`bg-gradient-to-br ${option.color} p-4 rounded-2xl inline-block text-white`}>
                  {option.icon}
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold mb-2 text-gradient">
                {option.name}
              </h3>
              <p className="text-gray-400 mb-4">{option.description}</p>

              <motion.div
                className="mt-4 text-primary font-semibold"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                Support →
              </motion.div>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-sm text-gray-500">
            Can&apos;t donate? No problem! Sharing the project, giving feedback, or joining the beta waitlist helps just as much. 🙏
          </p>
        </motion.div>
      </div>
    </section>
  );
}
