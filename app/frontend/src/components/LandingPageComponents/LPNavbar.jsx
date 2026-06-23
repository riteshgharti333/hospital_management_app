import React, { useState, useEffect } from "react";
import { MdLocalHospital } from "react-icons/md";
import { FaGithub, FaStar } from "react-icons/fa";
import { HiPlay, HiMenuAlt3, HiX } from "react-icons/hi";
import { BsArrowRight } from "react-icons/bs";
import { APP_CONFIG } from "../../config";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "System Capabilities", href: "#capabilities" },
  { label: "Modules", href: "#modules" },
  { label: "Tech Stack", href: "#tech" },
  { label: "Impact", href: "#impact" },
];

const LPNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 ${
        isScrolled
          ? "bg-white shadow-2xl shadow-blue-500/10 rounded-lg mt-0"
          : "bg-white/90 backdrop-blur-xl rounded-3xl mt-0"
      }`}
    >
      <div className="px-3 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                <MdLocalHospital className="text-xl text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-gray-900">Medi</span>
                <span className="text-blue-600">Care</span>
              </h1>
              <span className="text-[10px] font-medium text-blue-400 tracking-widest uppercase -mt-1">
                Healthcare
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-xl hover:bg-blue-50/80 transition-all duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <HiPlay className="text-lg" />
              <span>Live Demo</span>
              <BsArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={APP_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 rounded-xl shadow-lg shadow-gray-500/20 hover:shadow-gray-500/40 transition-all duration-300 hover:scale-105"
            >
              <FaGithub className="text-base" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <HiX className="text-xl text-gray-700" />
            ) : (
              <HiMenuAlt3 className="text-xl text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-[600px] opacity-100 mt-4 pb-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 border-t border-gray-100 pt-4">
            {/* All Navigation Links */}
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 text-xs font-bold">
                  {link.label.charAt(0)}
                </span>
                {link.label}
              </a>
            ))}

            {/* Mobile CTA Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
              >
                <HiPlay className="text-lg" />
                <span>Live Demo</span>
                <BsArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={APP_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all duration-300"
              >
                <FaGithub className="text-base" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LPNavbar;
