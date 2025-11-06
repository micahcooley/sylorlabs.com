"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const products = [
  {
    name: "OpenWave",
    tagline: "Modern Wavetable Synthesizer",
    description:
      "A wavetable synth being built for producers who want clean power without menu diving.",
    features: [
      "UI mockups complete",
      "DSP engine architecture in planning",
      "JUCE framework research underway",
      "Aiming for intuitive workflow",
      "Cross-platform target: Windows, macOS, Linux",
    ],
    badge: "FREE",
    badgeColor: "accent-green",
    status: "Status: UI Concepts & DSP Research",
    icon: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        {/* Synth body */}
        <rect x="10" y="25" width="60" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />

        {/* Waveform display */}
        <rect x="15" y="30" width="50" height="15" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M18 37.5 L22 37.5 L26 32 L30 43 L34 37.5 L38 37.5 L42 32 L46 43 L50 37.5 L54 37.5 L58 32 L62 37.5" stroke="currentColor" strokeWidth="1.5" fill="none" />

        {/* Knobs (4 rotary controls) */}
        <circle cx="23" cy="55" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="23" y1="55" x2="23" y2="51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        <circle cx="37" cy="55" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="37" y1="55" x2="40" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        <circle cx="51" cy="55" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="51" y1="55" x2="48" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        <circle cx="65" cy="55" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="65" y1="55" x2="68" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* Piano keys at bottom */}
        <rect x="10" y="68" width="4" height="10" fill="currentColor" />
        <rect x="16" y="68" width="4" height="10" fill="currentColor" />
        <rect x="24" y="68" width="4" height="10" fill="currentColor" />
        <rect x="30" y="68" width="4" height="10" fill="currentColor" />
        <rect x="36" y="68" width="4" height="10" fill="currentColor" />
        <rect x="44" y="68" width="4" height="10" fill="currentColor" />
        <rect x="50" y="68" width="4" height="10" fill="currentColor" />
        <rect x="58" y="68" width="4" height="10" fill="currentColor" />
        <rect x="64" y="68" width="4" height="10" fill="currentColor" />

        {/* Black keys */}
        <rect x="13" y="68" width="2.5" height="6" fill="currentColor" opacity="0.3" />
        <rect x="19" y="68" width="2.5" height="6" fill="currentColor" opacity="0.3" />
        <rect x="33" y="68" width="2.5" height="6" fill="currentColor" opacity="0.3" />
        <rect x="47" y="68" width="2.5" height="6" fill="currentColor" opacity="0.3" />
        <rect x="53" y="68" width="2.5" height="6" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    name: "Wingman",
    tagline: "AI Assistant for Music Production",
    description:
      "AI assistant for composition and sound design inside your DAW. Early concept phase.",
    features: [
      "Chat UI prototype in progress",
      "MIDI generation research",
      "DAW integration exploration",
      "Target: Multi-DAW support",
      "AI model selection in research",
    ],
    badge: "Price TBD",
    badgeColor: "accent-orange",
    status: "Status: Early Concept Phase",
    icon: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        {/* Left wing */}
        <path d="M15 40 Q10 35 8 30 Q6 25 8 20 L20 30 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
        <path d="M18 45 Q12 42 9 38 Q6 34 7 30 L20 38 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />

        {/* Right wing */}
        <path d="M65 40 Q70 35 72 30 Q74 25 72 20 L60 30 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
        <path d="M62 45 Q68 42 71 38 Q74 34 73 30 L60 38 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />

        {/* Central AI brain/head */}
        <circle cx="40" cy="40" r="18" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />

        {/* Neural network nodes inside head */}
        <circle cx="35" cy="35" r="2" fill="currentColor" />
        <circle cx="45" cy="35" r="2" fill="currentColor" />
        <circle cx="40" cy="40" r="2" fill="currentColor" />
        <circle cx="33" cy="45" r="2" fill="currentColor" />
        <circle cx="47" cy="45" r="2" fill="currentColor" />

        {/* Neural connections */}
        <line x1="35" y1="35" x2="40" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="45" y1="35" x2="40" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="40" y1="40" x2="33" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="40" y1="40" x2="47" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="35" y1="35" x2="33" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1="45" y1="35" x2="47" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />

        {/* Antenna on top */}
        <line x1="40" y1="22" x2="40" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="10" r="3" fill="currentColor" />

        {/* Signal waves from antenna */}
        <path d="M35 15 Q32 12 30 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M45 15 Q48 12 50 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M33 18 Q28 14 25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M47 18 Q52 14 55 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      </svg>
    ),
  },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="glass rounded-3xl p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: isHovered
            ? ["0% 50%", "100% 50%", "0% 50%"]
            : "0% 50%",
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="absolute inset-[2px] bg-light-bg rounded-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className="text-primary mb-6"
          animate={{
            rotateY: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.6 }}
        >
          {product.icon}
        </motion.div>

        {/* Name & Tagline */}
        <motion.h3
          className="text-3xl font-bold mb-2 text-gradient"
          animate={{ scale: isHovered ? 1.05 : 1 }}
        >
          {product.name}
        </motion.h3>
        <p className="text-sm text-gray-400 italic mb-4">{product.tagline}</p>

        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          {product.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-primary">
            Key Features:
          </h4>
          <ul className="space-y-2">
            {product.features.map((feature, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              >
                <motion.span
                  className="text-primary mt-1 text-xs"
                  animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  ▶
                </motion.span>
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Badge & Status */}
        <div className="flex flex-col gap-3">
          <motion.div
            className={`inline-block px-6 py-2 rounded-full font-bold text-center border-2 ${
              product.badgeColor === "accent-green"
                ? "border-accent-green text-accent-green bg-accent-green/20"
                : "border-accent-orange text-accent-orange bg-accent-orange/20"
            }`}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: isHovered
                ? [
                    "0 0 0 0 rgba(99, 102, 241, 0)",
                    "0 0 0 10px rgba(99, 102, 241, 0)",
                  ]
                : "0 0 0 0 rgba(99, 102, 241, 0)",
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {product.badge}
          </motion.div>
          <p className="text-gray-500 text-sm italic text-center">
            {product.status}
          </p>
        </div>
      </div>

      {/* Floating particles effect */}
      {isHovered &&
        [...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -50],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
    </motion.div>
  );
}

export default function Products() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="products"
      ref={ref}
      className="py-24 bg-gradient-to-b from-light-bg to-dark-bg relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-primary opacity-5"
            style={{
              width: 400,
              height: 400,
              left: `${20 * i}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
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
            className="text-5xl font-bold mb-4 text-gradient"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            In Development
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Building innovative tools for music production. Join the journey.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
