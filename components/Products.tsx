"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const products = [
  {
    name: "OpenWave",
    tagline: "The Future of Synthesis",
    description:
      "A powerful and intuitive synthesizer VST3 plugin designed for modern music production. Create stunning sounds with our advanced wavetable engine.",
    features: [
      "Advanced wavetable synthesis engine",
      "200+ factory presets",
      "Intuitive drag-and-drop modulation",
      "Built-in effects chain",
      "MPE support for expressive playing",
      "Cross-platform: Windows, macOS, Linux",
    ],
    badge: "FREE",
    badgeColor: "accent-green",
    status: "Expected Q2 2026",
    icon: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        <path
          d="M8 32C8 32 16 16 32 16C48 16 56 32 56 32C56 32 48 48 32 48C16 48 8 32 8 32Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 32C16 32 20 24 32 24C44 24 48 32 48 32C48 32 44 40 32 40C20 40 16 32 16 32Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Wingman",
    tagline: "Your AI Production Assistant",
    description:
      "Revolutionary AI-powered application that intelligently controls your DAW. Streamline your workflow with smart automation.",
    features: [
      "AI-powered mixing suggestions",
      "Smart arrangement assistance",
      "Context-aware automation",
      "Multi-DAW support (Ableton, FL Studio, Logic, etc.)",
      "Learning system adapts to your workflow",
    ],
    badge: "Price TBD",
    badgeColor: "accent-orange",
    status: "Expected Q2 2026",
    icon: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3" />
        <path
          d="M32 20V32L40 40"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="12" r="2" fill="currentColor" />
        <circle cx="32" cy="52" r="2" fill="currentColor" />
        <circle cx="12" cy="32" r="2" fill="currentColor" />
        <circle cx="52" cy="32" r="2" fill="currentColor" />
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
                  className="text-primary mt-1 text-base"
                  animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  •
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

      {/* Floating particles effect - GPU accelerated */}
      {isHovered &&
        [...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              willChange: "transform, opacity",
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
              ease: "linear",
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
      {/* Animated background elements - GPU accelerated */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-primary opacity-5"
            style={{
              width: 400,
              height: 400,
              left: `${20 * i}%`,
              top: `${Math.random() * 100}%`,
              willChange: "transform",
            }}
            animate={{
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
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
            className="text-5xl font-bold mb-4 text-gradient"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Coming Soon
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Revolutionary tools to transform your music production workflow
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
