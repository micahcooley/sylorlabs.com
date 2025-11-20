"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const products = [
  {
    name: "Zenith DAW",
    tagline: "The Ultimate Digital Audio Workstation",
    description:
      "A revolutionary DAW combining the best aspects of every workstation with integrated Wingman AI assistant and OpenWave synthesizer. Featuring an intuitive, beautiful UI designed for maximum workflow efficiency.",
    features: [
      "Integrated Wingman AI assistant for intelligent music production",
      "Built-in OpenWave wavetable synthesizer",
      "Best features from industry-leading DAWs combined",
      "Stunning, intuitive UI designed for producers",
      "Advanced DSP engine with real-time processing",
      "Smart MIDI generation and composition tools",
      "Seamless workflow with zero menu diving",
      "Cross-platform: Windows, macOS, Linux",
    ],
    badge: "FLAGSHIP",
    badgeColor: "accent-green",
    status: "Status: Early Development - The Future of Production",
    icon: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        {/* Outer circular ring - representing "Zenith" */}
        <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.6" />
        <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />

        {/* Central star/diamond - peak/zenith symbol */}
        <path d="M40 15 L45 35 L55 40 L45 45 L40 65 L35 45 L25 40 L35 35 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Inner core */}
        <circle cx="40" cy="40" r="8" fill="currentColor" fillOpacity="0.4" />
        <circle cx="40" cy="40" r="5" fill="currentColor" />

        {/* Waveform integrated into design - representing OpenWave */}
        <path d="M15 40 Q20 35 25 40 Q30 45 35 40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M45 40 Q50 35 55 40 Q60 45 65 40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />

        {/* AI nodes - representing Wingman AI */}
        <circle cx="40" cy="20" r="3" fill="currentColor" opacity="0.7" />
        <circle cx="60" cy="40" r="3" fill="currentColor" opacity="0.7" />
        <circle cx="40" cy="60" r="3" fill="currentColor" opacity="0.7" />
        <circle cx="20" cy="40" r="3" fill="currentColor" opacity="0.7" />

        {/* Connection lines from AI nodes to center */}
        <line x1="40" y1="20" x2="40" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 2" />
        <line x1="60" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 2" />
        <line x1="40" y1="60" x2="40" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 2" />
        <line x1="20" y1="40" x2="32" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 2" />

        {/* Orbital rings - representing "all DAWs combined" */}
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="4 4" />
        <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="4 4" />

        {/* Corner accent dots */}
        <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="70" cy="10" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="10" cy="70" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="70" cy="70" r="2" fill="currentColor" opacity="0.5" />
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
                <span className="text-primary mt-1 flex-shrink-0">•</span>
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

        <div className="flex justify-center max-w-4xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
