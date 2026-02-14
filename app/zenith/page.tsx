"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import React from "react";

const roadmapStages = [
  {
    stage: "UI Development",
    status: "in-progress",
    description: "Building the beautiful interface with Skia graphics",
  },
  {
    stage: "Backend Integration",
    status: "upcoming",
    description: "Connecting audio engine to the interface",
  },
  {
    stage: "Testing",
    status: "upcoming",
    description: "Internal testing and optimization",
  },
  {
    stage: "Beta Release",
    status: "upcoming",
    description: "Early access for the community",
  },
  {
    stage: "Full Release",
    status: "upcoming",
    description: "Official public release",
  },
];

const ZenithRoadmapItem = React.memo(({ stage, index, isVisible }: { stage: typeof roadmapStages[0]; index: number; isVisible: boolean }) => {
  return (
    <motion.div
      className="relative flex items-center gap-8 pb-20"
      initial={{ opacity: 0, x: -100 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
    >
      {/* Timeline node */}
      <motion.div
        className={`relative z-20 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ${
          stage.status === "in-progress"
            ? "bg-light-bg border-4 border-primary text-primary shadow-lg shadow-primary/30"
            : stage.status === "completed"
            ? "bg-light-bg border-4 border-accent-green text-accent-green shadow-lg shadow-accent-green/30"
            : "bg-light-bg border-4 border-gray-700 text-gray-600"
        }`}
        whileHover={{ scale: 1.05 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={isVisible ? {
          scale: 1,
          rotate: 0
        } : {}}
        transition={{
          duration: 0.8,
          delay: index * 0.2,
          ease: "easeOut"
        }}
      >
        {stage.status === "in-progress" ? (
          <motion.div
            whileHover={{ rotate: 720 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" />
                <circle cx="16" cy="16" r="4" fill="currentColor" />
              </svg>
            </motion.div>
          </motion.div>
        ) : (
          <motion.svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
            <g style={{ transformOrigin: "16px 16px" }}>
              <motion.line
                x1="16"
                y1="16"
                x2="16"
                y2="8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </g>
            <g style={{ transformOrigin: "16px 16px" }}>
              <motion.line
                x1="16"
                y1="16"
                x2="20"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </g>
          </motion.svg>
        )}

        {/* Subtle pulsing for active stage */}
        {stage.status === "in-progress" && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1.1, 1.2, 1.1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Content card */}
      <motion.div
        className="flex-1 glass rounded-2xl p-8 border border-gray-800/50"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.2 + 0.1, ease: "easeOut" }}
        whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.h3
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
          >
            {stage.stage}
          </motion.h3>

          {stage.status === "in-progress" && (
            <motion.span
              className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
            >
              In Progress
            </motion.span>
          )}
        </div>

        <motion.p
          className="text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
        >
          {stage.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
});

ZenithRoadmapItem.displayName = "ZenithRoadmapItem";

export default function ZenithPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const roadmapRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const roadmapInView = useInView(roadmapRef, { once: true, amount: 0.1 });

  const [backgroundElements, setBackgroundElements] = useState<Array<{ top: number }>>([]);

  useEffect(() => {
    const newBackgroundElements = [...Array(3)].map(() => ({
      top: Math.random() * 100,
    }));
    setBackgroundElements(newBackgroundElements);
  }, []);

  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="py-24 bg-gradient-to-b from-light-bg to-dark-bg relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          {backgroundElements.map((element, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-primary"
              style={{
                width: 300,
                height: 300,
                left: `${30 * i}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block px-6 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-yellow-400 font-semibold flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z" fill="currentColor"/>
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                In Development - Beta Coming Soon
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-gradient"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              Zenith DAW
            </motion.h1>
            
            <motion.p
              className="text-2xl md:text-3xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              Professional music production software that doesn&apos;t break the bank
            </motion.p>
            
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            >
              Make music without compromise. Zenith delivers professional features that run smoothly on any laptop, 
              works with your favorite plugins, and includes real-time collaboration like Google Docs for music production. 
              Wingman AI is here when you need inspiration. Get updates forever - no spam, ever.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-gradient-to-b from-dark-bg to-light-bg">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h2
              className="text-5xl font-bold mb-6 text-gradient"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              Professional Features
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              Everything you need to create professional music, without the professional price tag
            </motion.p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="glass rounded-3xl p-8 md:p-12"
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <ul className="space-y-6">
                {[
                  "$100 vs $200-900 for competing DAWs",
                  "Wingman AI your creative partner",
                  "Real-time collaboration with friends",
                  "Runs beautifully on any hardware",
                  "Windows, macOS, and Linux support",
                  "No forced subscriptions ever",
                  "Professional workflow simplified",
                  "Built by producers for producers",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={featuresInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0 mt-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg className="w-5 h-5 text-accent-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    <span className="text-lg text-gray-300 leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section ref={roadmapRef} className="py-16 bg-gradient-to-b from-light-bg to-dark-bg">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h2
              className="text-5xl font-bold mb-6 text-gradient"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              Development Roadmap
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              Transparent progress. Follow the journey.
            </motion.p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Single continuous timeline line */}
              <motion.div
                className="absolute left-[40px] top-[40px] w-0.5 bg-gradient-to-b from-primary/40 to-accent-green/40 z-10"
                initial={{ scaleY: 0 }}
                animate={roadmapInView ? { scaleY: 1 } : {}}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ 
                  height: `${(roadmapStages.length - 1) * 160 + 240}px`,
                  transformOrigin: "top"
                }}
              />
              
              {roadmapStages.map((stage, index) => (
                <ZenithRoadmapItem
                  key={stage.stage}
                  stage={stage}
                  index={index}
                  isVisible={roadmapInView}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
