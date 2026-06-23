import React from "react";
import {
  MdSecurity,
  MdSync,
  MdSearch,
  MdSpeed,
  MdStorage,
  MdCloudQueue,
  MdAccountTree,
  MdExtension,
  MdLocalHospital,
  MdVerifiedUser,
  MdInsights,
} from "react-icons/md";
import "./lp.css";
import { APP_CONFIG } from "../../config";
import {Link} from "react-router-dom"

const LPFeature = () => {
  const features = [
    {
      icon: <MdLocalHospital className="text-3xl" />,
      title: "Comprehensive Hospital Management",
      description:
        "Manage patients, admissions, appointments, doctors, nurses, prescriptions, billing, ledgers, and birth records from a unified platform.",
      color: "blue",
    },
    {
      icon: <MdVerifiedUser className="text-3xl" />,
      title: "Enterprise Security & RBAC",
      description:
        "Protect sensitive healthcare data with JWT authentication, bcrypt password hashing, cookie-based sessions, and role-based access control.",
      color: "indigo",
    },
    {
      icon: <MdSpeed className="text-3xl" />,
      title: "High-Performance Data Engine",
      description:
        "Optimized with dual-layer caching, indexed queries, and efficient pagination to deliver sub-100ms responses for cached operations.",
      color: "emerald",
    },
    {
      icon: <MdSearch className="text-3xl" />,
      title: "Lightning-Fast Search",
      description:
        "PostgreSQL full-text search combined with Redis acceleration enables rapid discovery of patients, admissions, bills, and medical records.",
      color: "cyan",
    },
    {
      icon: <MdInsights className="text-3xl" />,
      title: "Interactive Analytics Dashboard",
      description:
        "Monitor revenue, admissions, payments, patient demographics, and operational KPIs through real-time charts and visual reports.",
      color: "purple",
    },
    {
      icon: <MdAccountTree className="text-3xl" />,
      title: "Shared Schema Monorepo",
      description:
        "Built with a scalable monorepo architecture using shared Zod validation schemas to ensure consistency between frontend and backend.",
      color: "teal",
    },
    {
      icon: <MdStorage className="text-3xl" />,
      title: "Scalable Database Architecture",
      description:
        "Powered by PostgreSQL and Prisma with 18+ relational models designed for reliable, structured, and maintainable healthcare data.",
      color: "orange",
    },
    {
      icon: <MdExtension className="text-3xl" />,
      title: "Modern React Experience",
      description:
        "Features 50+ responsive pages, reusable components, custom hooks, and data-rich tables for an efficient and intuitive user experience.",
      color: "rose",
    },
  ];

  return (
    <section className="relative  overflow-hidden pb-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 features-grid-pattern opacity-[0.02]"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-6 border border-emerald-100">
            ✨ Core Features
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Powerful Features Built for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Real-World Healthcare
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Everything you need to manage a modern healthcare facility
            efficiently and securely.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 feature-card-${feature.color} fade-in-up-delay-${index + 1}`}
            >
              {/* Hover Gradient Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg
                  ${feature.color === "blue" ? "from-blue-50 to-blue-100 text-blue-600 group-hover:shadow-blue-200/50" : ""}
                  ${feature.color === "indigo" ? "from-indigo-50 to-indigo-100 text-indigo-600 group-hover:shadow-indigo-200/50" : ""}
                  ${feature.color === "cyan" ? "from-cyan-50 to-cyan-100 text-cyan-600 group-hover:shadow-cyan-200/50" : ""}
                  ${feature.color === "emerald" ? "from-emerald-50 to-emerald-100 text-emerald-600 group-hover:shadow-emerald-200/50" : ""}
                  ${feature.color === "purple" ? "from-purple-50 to-purple-100 text-purple-600 group-hover:shadow-purple-200/50" : ""}
                  ${feature.color === "orange" ? "from-orange-50 to-orange-100 text-orange-600 group-hover:shadow-orange-200/50" : ""}
                  ${feature.color === "teal" ? "from-teal-50 to-teal-100 text-teal-600 group-hover:shadow-teal-200/50" : ""}
                  ${feature.color === "rose" ? "from-rose-50 to-rose-100 text-rose-600 group-hover:shadow-rose-200/50" : ""}
                `}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-[16px] font-semibold">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 lg:mt-20 fade-in-up">
          <p className="text-gray-600 mb-8 text-lg">
            Want to see how these features work together?
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            <MdSpeed className="text-xl" />
            Explore Live Demo
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LPFeature;
