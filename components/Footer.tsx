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
              { name: "Twitter", icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3 L10.9 10.3 L23 17.5 L23 3 Z" fill="currentColor"/>
                  <path d="M10.9 10.3 L1 3 L1 21 L23 21 L23 17.5 L10.9 10.3 Z" fill="currentColor"/>
                </svg>
              )},
              { name: "Discord", icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                  <path d="M19 7 C17.5 5.5 15.5 5 12 5 C8.5 5 6.5 5.5 5 7 C3.5 8.5 3 11 3 14 C3 17 4 19 5 20 C6 21 7 21 8 20 L9 19 M15 19 L16 20 C17 21 18 21 19 20 C20 19 21 17 21 14 C21 11 20.5 8.5 19 7 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )},
              { name: "YouTube", icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M10 9 L15 12 L10 15 Z" fill="currentColor"/>
                </svg>
              )},
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
              Making music production better, one plugin at a time
              <svg className="inline-block w-4 h-4 ml-2 text-primary" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1 L9.5 5 L14 5 L10.5 8 L12 12 L8 9 L4 12 L5.5 8 L2 5 L6.5 5 Z" fill="currentColor"/>
              </svg>
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
