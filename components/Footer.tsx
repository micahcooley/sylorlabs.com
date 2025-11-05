"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-gray-800 py-8">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex justify-center gap-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { name: "Twitter", icon: "𝕏" },
              { name: "Discord", icon: "💬" },
              { name: "YouTube", icon: "▶️" },
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href="#"
                className="text-2xl text-gray-400 hover:text-primary transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            &copy; 2025 Sylorlabs. All rights reserved.
          </motion.p>

          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="text-primary font-semibold"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Making music production better, one plugin at a time ✨
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
