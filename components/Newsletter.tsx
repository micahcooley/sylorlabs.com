"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const WAVE_INDICES = [0, 1, 2] as const;
const EMAIL_ICON_INDICES = [0, 1, 2, 3, 4, 5] as const;

export default function Newsletter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Subscription error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-primary relative overflow-hidden"
    >
      {/* Animated waves - GPU accelerated */}
      <div className="absolute inset-0 pointer-events-none">
        {WAVE_INDICES.map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, white 0%, transparent 70%)",
              willChange: "transform, opacity",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
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
            Get Notified for Beta
          </motion.h2>

          <motion.p
            className="text-xl text-white/90 mb-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Be first to test our tools. Get beta access before anyone else
            and help shape the future of music production.
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
              disabled={isLoading || isSubmitted}
              className="px-10 py-4 bg-dark-bg text-white rounded-full font-semibold whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{
                scale: isLoading || isSubmitted ? 1 : 1.05,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
              whileTap={{ scale: isLoading || isSubmitted ? 1 : 0.95 }}
              animate={
                isSubmitted
                  ? {
                      backgroundColor: ["#0f172a", "#10b981", "#0f172a"],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              {isLoading ? "Sending..." : isSubmitted ? "Subscribed!" : "Notify Me"}
            </motion.button>
          </motion.form>

          {error && (
            <motion.div
              className="mt-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border-2 border-red-500/50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-200 font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 5 L10 10 M10 15 L10 15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                {error}
              </p>
            </motion.div>
          )}

          {isSubmitted && (
            <motion.div
              className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-5xl mb-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-12 h-12 mx-auto text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <path d="M15 24 L21 30 L33 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <p className="text-2xl font-bold text-white mb-2">
                You&apos;re on the beta waitlist!
              </p>
              <p className="text-white/90">
                You&apos;ll get early access to test our tools and help shape the future.
              </p>
            </motion.div>
          )}

          {/* Floating email icons - GPU accelerated */}
          <div className="mt-12 pointer-events-none">
            {EMAIL_ICON_INDICES.map((i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  willChange: "transform, opacity",
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
                  ease: "linear",
                }}
              >
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M4 10 L16 18 L28 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
