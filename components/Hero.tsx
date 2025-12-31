"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  
  // Generate random values only on client side to prevent hydration mismatch
  const [backgroundElements, setBackgroundElements] = useState<Array<{
    size: number;
    moveX: number;
    moveY: number;
    left: number;
    top: number;
  }>>([]);
  
  const [particles, setParticles] = useState<Array<{
    left: number;
    top: number;
  }>>([]);

  useEffect(() => {
    // Generate consistent random values only on client
    const newBackgroundElements = [...Array(20)].map(() => ({
      size: Math.random() * 300 + 50,
      moveX: Math.random() * 100 - 50,
      moveY: Math.random() * 100 - 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
    
    const newParticles = [...Array(50)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
    
    setBackgroundElements(newBackgroundElements);
    setParticles(newParticles);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-bg via-light-bg to-dark-bg"
    >
      {/* Animated background elements - GPU accelerated */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary opacity-10"
            style={{
              width: element.size,
              height: element.size,
              left: `${element.left}%`,
              top: `${element.top}%`,
              willChange: "transform",
            }}
            animate={{
              x: [0, element.moveX],
              y: [0, element.moveY],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating particles - GPU accelerated */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              willChange: "transform, opacity",
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-6 relative z-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span
              className="inline-block text-gradient"
              style={{
                willChange: "background-position",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              Professional Audio
            </motion.span>
            <br />
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Tools for Creators
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Sylorlabs delivers professional-grade audio tools for modern creators. 
            From studio-quality plugins to intuitive production software, we empower 
            musicians, producers, and audio engineers with the tools they need to create exceptional sound.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
