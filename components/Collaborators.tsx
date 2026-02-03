"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";

export default function Collaborators() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const roles = useMemo(() => [
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
  ], []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", role: "", message: "" });
      setTimeout(() => {
        setShowModal(false);
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span className="text-accent-orange font-bold flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1 L9.5 5 L14 5 L10.5 8 L12 12 L8 9 L4 12 L5.5 8 L2 5 L6.5 5 Z" fill="currentColor"/>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
              Open to all skill levels
            </span>
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
          <motion.button
            onClick={() => setShowModal(true)}
            className="inline-block px-10 py-4 bg-gradient-primary text-white rounded-full font-semibold text-lg shadow-2xl cursor-pointer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us →
          </motion.button>
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
              <svg className="w-4 h-4 text-accent-green mt-1 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5 L6 12 L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
              <span>Early access to all tools before public release</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent-green mt-1 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5 L6 12 L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
              <span>Full credit and attribution in the project</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent-green mt-1 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5 L6 12 L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
              <span>Real-world experience building professional audio software</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent-green mt-1 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5 L6 12 L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
              <span>Portfolio piece you can showcase to future employers/clients</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent-green mt-1 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5 L6 12 L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none"/>
              </svg>
              <span>Collaborative learning environment with other passionate builders</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-light-bg rounded-3xl p-8 max-w-md w-full relative border-2 border-primary/30"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>

              <h3 className="text-3xl font-bold mb-2 text-gradient">Get in Touch</h3>
              <p className="text-gray-400 mb-6">Tell us about yourself and how you want to contribute!</p>

              {submitStatus === "success" ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="text-6xl mb-4">
                    <svg className="w-16 h-16 mx-auto text-accent-green" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" fill="none"/>
                      <path d="M20 32 L28 40 L44 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-accent-green">Message Sent!</p>
                  <p className="text-gray-400 mt-2">We&apos;ll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border-2 border-primary/30 text-white focus:border-primary focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border-2 border-primary/30 text-white focus:border-primary focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Role Interest</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border-2 border-primary/30 text-white focus:border-primary focus:outline-none"
                    >
                      <option value="">Select a role...</option>
                      <option value="C++ / DSP Developer">C++ / DSP Developer</option>
                      <option value="Music Producer">Music Producer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="AI/ML Engineer">AI/ML Engineer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Message</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-bg border-2 border-primary/30 text-white focus:border-primary focus:outline-none h-32 resize-none"
                      placeholder="Tell us about your experience and why you want to collaborate..."
                    />
                  </div>

                  {submitStatus === "error" && (
                    <div className="text-red-400 text-sm">
                      Failed to send message. Please try again.
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg disabled:opacity-50"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
