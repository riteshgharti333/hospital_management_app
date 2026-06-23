import React from "react";
import { HiPlay, HiArrowRight } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import {
  MdSecurity,
  MdSpeed,
  MdSync,
  MdDevices,
  MdLocalHospital,
  MdApi,
  MdVerifiedUser,
  MdInsights,
} from "react-icons/md";
import "./lp.css";
import { APP_CONFIG } from "../../config";
import { Link } from "react-router-dom";

const LPBanner = () => {
  const features = [
    {
      icon: <MdLocalHospital className="text-xl" />,
      text: "18+ Hospital Management Modules",
    },
    {
      icon: <MdApi className="text-xl" />,
      text: "125+ Secure REST API Endpoints",
    },
    {
      icon: <MdVerifiedUser className="text-xl" />,
      text: "Role-Based Access & JWT Security",
    },
    {
      icon: <MdInsights className="text-xl" />,
      text: "Real-Time Analytics Dashboard",
    },
  ];

  const stats = [
    { value: "1M+", label: "Records Optimized" },
    { value: "<100ms", label: "API Response Time" },
    { value: "51+", label: "Application Pages" },
    { value: "39+", label: "Reusable Components" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-lg shadow-blue-100/50 mb-8 fade-in">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-700">
              Enterprise-Grade Healthcare Platform
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 fade-in-up">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                Scalable Hospital
              </span>
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed mb-12 fade-in-up-delay-1">
            A full-stack healthcare platform built with React, Node.js, and
            PostgreSQL, featuring secure role-based access, real-time data sync,
            and high-performance data handling for large-scale hospital
            workflows.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in-up-delay-2">
            <Link
              to="/dashboard"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-3">
                <HiPlay className="text-xl" />
                View Live Demo
                <HiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a
              href={APP_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-gray-800 bg-white hover:bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-gray-300 shadow-lg shadow-gray-200/50 hover:shadow-gray-200/80 transform hover:-translate-y-1 transition-all duration-300"
            >
              <FaGithub className="text-xl" />
              View Source Code
              <HiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto fade-in-up-delay-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex flex-col justify-center sm:flex-row items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 fade-in-up-delay-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120V60C240 0 480 0 720 30C960 60 1200 90 1440 60V120H0Z"
            fill="url(#waveGradient)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default LPBanner;
