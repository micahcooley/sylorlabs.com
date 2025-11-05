"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Newsletter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-primary relative overflow-hidden"
    >
      {/* Animated waves */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, white 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            Stay Updated
          </motion.h2>

          <motion.p
            className="text-xl text-white/90 mb-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Be the first to know when our products launch. Get exclusive early
            access and special offers.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:w-96 px-6 py-4 rounded-full text-dark-bg font-medium focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
              whileFocus={{ scale: 1.02 }}
            />

            <motion.button
              type="submit"
              className="px-10 py-4 bg-dark-bg text-white rounded-full font-semibold whitespace-nowrap"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={
                isSubmitted
                  ? {
                      backgroundColor: ["#0f172a", "#10b981", "#0f172a"],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              {isSubmitted ? "✓ Subscribed!" : "Notify Me"}
            </motion.button>
          </motion.form>

          {isSubmitted && (
            <motion.p
              className="mt-6 text-white font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Thank you for subscribing! We&apos;ll keep you updated.
            </motion.p>
          )}

          {/* Floating email icons */}
          <div className="mt-12">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                ✉️
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
