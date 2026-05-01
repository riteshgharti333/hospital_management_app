import React from "react";
import {
  HiPlay,
  HiArrowRight,
  HiMail,
  HiDocumentText,
  HiGlobe,
} from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdLocalHospital, MdStars } from "react-icons/md";
import "./lp.css";
import { APP_CONFIG } from "../../config";

const LPAction = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-slower"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 cta-pattern"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-blue-500/30 fade-in-up">
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full mix-blend-overlay filter blur-2xl"></div>

            {/* Animated Dots */}
            <div className="absolute top-10 right-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-1/2 right-10 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8">
                <MdStars className="text-yellow-300 text-lg" />
                <span className="text-sm font-semibold text-white">
                  Ready to Transform Healthcare Management?
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Start Building Better
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Healthcare Solutions
                </span>
              </h2>

              {/* Description */}
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Explore the live demo, check out the source code, or reach out
                to discuss how this system can be adapted for your needs.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href={APP_CONFIG.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-blue-700 bg-white hover:bg-gray-50 rounded-2xl shadow-xl shadow-blue-900/20 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <HiPlay className="text-xl" />
                Try Live Demo
                <HiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={APP_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30 hover:border-white/50 transform hover:-translate-y-1 transition-all duration-300"
              >
                <FaGithub className="text-xl" />
                View Source Code
                <HiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Secondary Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a
                href={APP_CONFIG.contact}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <HiMail className="text-base" />
                Contact Me
              </a>
              <a
                href={APP_CONFIG.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <HiDocumentText className="text-base" />
                Resume
              </a>
              <a
                href={APP_CONFIG.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <HiGlobe className="text-base" />
                Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Connect & Links */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-up">
          {/* Project Info */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg mb-4">
              <MdLocalHospital className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              MediCare Platform
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Hospital management system built with modern technologies.
            </p>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Connect With Me
            </h3>
            <div className="flex items-center justify-center gap-3">
              <a
                href={APP_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href={APP_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Follow for updates and more projects
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LPAction;
