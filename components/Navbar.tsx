"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navbarBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(15, 23, 42, 0.0)", "rgba(15, 23, 42, 0.95)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      style={{ backgroundColor: navbarBg }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg border-b border-gray-800" : ""
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="logo"
          >
            <motion.h1
              className="text-2xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              SYLORLABS
            </motion.h1>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-8"
          >
            {["Products", "About"].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <motion.a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 font-medium hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1, color: "#6366f1" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </nav>
    </motion.header>
  );
}
