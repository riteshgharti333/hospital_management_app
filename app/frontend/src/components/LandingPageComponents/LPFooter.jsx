import React from "react";
import {
  MdLocalHospital,
  MdEmail,
  MdLocationOn,
  MdPhone,
  MdArrowUpward,
  MdFavorite,
} from "react-icons/md";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaStar,
  FaCode,
} from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";
import "./lp.css";
import { APP_CONFIG } from "../../config";

const LPFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Modules", href: "#modules" },
        { name: "System Capabilities", href: "#system" },
        { name: "Tech Stack", href: "#tech" },
        { name: "Live Demo", href: APP_CONFIG.liveDemo },
      ],
    },

    company: {
      title: "Company",
      links: [
        {
          name: "About",
          href: APP_CONFIG.about,
          icon: <HiExternalLink className="text-xs" />,
        },
        {
          name: "Portfolio",
          href: APP_CONFIG.portfolio,
          icon: <HiExternalLink className="text-xs" />,
        },
        {
          name: "Resume",
          href: APP_CONFIG.resume,
          icon: <HiExternalLink className="text-xs" />,
        },
        {
          name: "Contact",
          href: APP_CONFIG.contact,
          icon: <HiExternalLink className="text-xs" />,
        },
      ],
    },
    connect: {
      title: "Connect",
      links: [
        {
          name: "GitHub",
          href: APP_CONFIG.githubProfile,
          icon: <FaGithub className="text-xs" />,
        },
        {
          name: "LinkedIn",
          href: APP_CONFIG.linkedin,
          icon: <FaLinkedin className="text-xs" />,
        },
        {
          name: "Email",
          href: "#email",
          icon: <MdEmail className="text-xs" />,
        },
      ],
    },
  };

  return (
    <footer className="relative  pt-20 pb-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 footer-pattern opacity-[0.03]"></div>

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                <MdLocalHospital className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="text-gray-900">Medi</span>
                  <span className="text-blue-600">Care</span>
                </h2>
                <span className="text-xs font-medium text-blue-400 tracking-widest uppercase">
                  Healthcare Platform
                </span>
              </div>
            </a>

            <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
              A modern, full-stack hospital management system designed to
              streamline healthcare operations with secure role-based access,
              real-time data sync, and high-performance data handling.
            </p>

            {/* GitHub Stars */}
            <div className="flex items-center gap-3 mb-6">
              <a
                href={APP_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <FaGithub className="text-lg" />
                <span className="text-sm font-semibold">Star on GitHub</span>
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:riteshgharti333@gmail.com"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <MdEmail className="text-base" />
                </div>
                <span className="text-sm">riteshgharti333@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-1 group"
                    >
                      <span className="w-1 h-1 bg-gray-400 group-hover:bg-blue-600 rounded-full transition-colors"></span>
                      {link.name}
                      {link.icon && (
                        <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
                          {link.icon}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>© {currentYear} MediCare Platform.</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <span>Back to Top</span>
              <MdArrowUpward className="text-base group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Additional Footer Links */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <a
              href={APP_CONFIG.privacyPolicy}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href={APP_CONFIG.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href={APP_CONFIG.helpCenter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LPFooter;
