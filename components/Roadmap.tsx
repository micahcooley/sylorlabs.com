"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const roadmapStages = [
  {
    stage: "Concept + UX Design",
    status: "completed",
    icon: "✓",
    description: "UI mockups and user flow planning",
  },
  {
    stage: "Core DSP Engine",
    status: "in-progress",
    icon: "🔄",
    description: "JUCE framework research and architecture",
  },
  {
    stage: "UI Implementation",
    status: "upcoming",
    icon: "⏳",
    description: "Building the interface and controls",
  },
  {
    stage: "Beta Testing",
    status: "upcoming",
    icon: "⏳",
    description: "Early access for community feedback",
  },
  {
    stage: "Public Launch",
    status: "upcoming",
    icon: "⏳",
    description: "Full release to the world",
  },
];

function RoadmapStage({ stage, index }: { stage: typeof roadmapStages[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="flex items-start gap-6">
        {/* Status Icon */}
        <motion.div
          className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
            stage.status === "completed"
              ? "bg-accent-green/20 border-2 border-accent-green text-accent-green"
              : stage.status === "in-progress"
              ? "bg-accent-orange/20 border-2 border-accent-orange text-accent-orange"
              : "bg-gray-700/20 border-2 border-gray-600 text-gray-500"
          }`}
          whileHover={{ scale: 1.1 }}
          animate={
            stage.status === "in-progress"
              ? {
                  rotate: [0, 360],
                }
              : {}
          }
          transition={
            stage.status === "in-progress"
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }
              : {}
          }
        >
          {stage.icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 pb-12">
          <h3 className={`text-2xl font-bold mb-2 ${
            stage.status === "completed"
              ? "text-accent-green"
              : stage.status === "in-progress"
              ? "text-accent-orange"
              : "text-gray-400"
          }`}>
            {stage.stage}
          </h3>
          <p className="text-gray-400 text-sm">{stage.description}</p>
        </div>
      </div>

      {/* Connecting Line */}
      {index < roadmapStages.length - 1 && (
        <motion.div
          className={`absolute left-8 top-16 w-0.5 h-12 ${
            stage.status === "completed"
              ? "bg-accent-green"
              : "bg-gray-700"
          }`}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
          style={{ transformOrigin: "top" }}
        />
      )}
    </motion.div>
  );
}

export default function Roadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="roadmap"
      ref={ref}
      className="py-24 bg-gradient-to-b from-dark-bg to-light-bg relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-primary"
            style={{
              width: 300,
              height: 300,
              left: `${30 * i}%`,
              top: `${Math.random() * 100}%`,
              willChange: "transform",
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + i * 2,
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
            Development Roadmap
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transparent progress on OpenWave. Follow the journey.
          </motion.p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {roadmapStages.map((stage, index) => (
            <RoadmapStage key={stage.stage} stage={stage} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
