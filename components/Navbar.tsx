"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  const navbarBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(15, 23, 42, 0.0)", "rgba(15, 23, 42, 0.95)"]
  );

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 50);
  };

  const handleAccountMenuEnter = () => {
    if (accountMenuTimeoutRef.current) {
      clearTimeout(accountMenuTimeoutRef.current);
      accountMenuTimeoutRef.current = null;
    }
    setShowAccountMenu(true);
  };

  const handleAccountMenuLeave = () => {
    accountMenuTimeoutRef.current = setTimeout(() => {
      setShowAccountMenu(false);
    }, 150);
  };

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
            <motion.a
              href="/"
              className="text-2xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              SYLORLABS
            </motion.a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-12 items-center"
          >
            <motion.li
              className="relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div 
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="flex items-center space-x-8">
                  <Link href="/products" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Audio Tools
                  </Link>  
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  >
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <motion.div 
                  className="absolute top-full left-0 mt-2 w-48 bg-dark-bg border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ 
                    opacity: showDropdown ? 1 : 0,
                    y: showDropdown ? 0 : -10,
                    display: showDropdown ? 'block' : 'none'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="/zenith"
                    className="block px-6 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Zenith DAW
                  </a>
                  <a
                    href="/plugins"
                    className="block px-6 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Audio Plugins
                  </a>
                  <a
                    href="/samples"
                    className="block px-6 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Sample Packs
                  </a>
                </motion.div>
              </div>
            </motion.li>

            <motion.li
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div 
                className="relative"
                onMouseEnter={handleAccountMenuEnter}
                onMouseLeave={handleAccountMenuLeave}
              >
                {user ? (
                  <motion.div 
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer shadow-lg border-2 border-primary/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user.profilePicture ? (
                      <>
                        <img 
                          src={user.profilePicture.startsWith('http') ? `/api/auth/proxy/profile-picture?url=${encodeURIComponent(user.profilePicture)}` : user.profilePicture}
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initial if image fails to load
                            const target = e.currentTarget;
                            const fallback = target.nextElementSibling as HTMLElement;
                            target.style.display = 'none';
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center" style={{ display: 'none' }}>
                          <span className="text-white font-semibold text-sm">
                            {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
                
                <motion.div 
                  className="absolute top-full right-0 mt-3 w-56 bg-dark-bg border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
                  onMouseEnter={handleAccountMenuEnter}
                  onMouseLeave={handleAccountMenuLeave}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ 
                    opacity: showAccountMenu ? 1 : 0,
                    y: showAccountMenu ? 0 : -10,
                    scale: showAccountMenu ? 1 : 0.95,
                    display: showAccountMenu ? 'block' : 'none'
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {user ? (
                    <>
                      <div className="px-6 py-4 border-b border-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                        {user.username && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                        )}
                        {user.hasGoogleLinked && (
                          <div className="flex items-center gap-2 mt-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                            </svg>
                            <span className="text-blue-400 text-xs">Google linked</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={logout}
                        className="w-full px-6 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Log Out</span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-6 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border-b border-gray-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="10 17 15 12 10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Log In</span>
                        </div>
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-6 py-3 text-gray-300 hover:bg-secondary/10 hover:text-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Sign Up</span>
                        </div>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.li>
          </motion.ul>
        </div>
      </nav>
    </motion.header>
  );
}
