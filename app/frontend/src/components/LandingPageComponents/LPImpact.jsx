import React from "react";
import {
  MdSpeed,
  MdSecurity,
  MdSync,
  MdTrendingUp,
  MdAutoFixHigh,
  MdVerified,
  MdArrowForward,
  MdCheckCircle,
  MdViewModule,
  MdDashboard,
  MdAccountTree,
  MdStorage,
  MdSearch,
} from "react-icons/md";
import "./lp.css";

const LPImpact = () => {
  const impacts = [
    {
      icon: <MdSpeed className="text-3xl" />,
      title: "Optimized API Performance",
      description:
        "Dual-layer caching and query optimization reduce API latency from ~1.5s to under 100ms.",
      metric: "<100ms",
      metricLabel: "API Response",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      statColor: "text-blue-600",
    },
    {
      icon: <MdSearch className="text-3xl" />,
      title: "Lightning-Fast Search",
      description:
        "PostgreSQL full-text search with Redis optimization delivers 40x+ faster record retrieval.",
      metric: "40x+",
      metricLabel: "Faster Search",
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
      statColor: "text-emerald-600",
    },
    {
      icon: <MdStorage className="text-3xl" />,
      title: "Million-Scale Data Ready",
      description:
        "Designed to efficiently process and manage healthcare datasets exceeding one million records.",
      metric: "1M+",
      metricLabel: "Records",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-violet-500",
      statColor: "text-purple-600",
    },
    {
      icon: <MdAccountTree className="text-3xl" />,
      title: "Shared Schema Monorepo",
      description:
        "33 shared Zod schemas provide end-to-end validation and eliminate frontend/backend type drift.",
      metric: "33",
      metricLabel: "Shared Schemas",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
      statColor: "text-orange-600",
    },
    {
      icon: <MdDashboard className="text-3xl" />,
      title: "Comprehensive Analytics",
      description:
        "Real-time dashboards track admissions, revenue, billing, payments, demographics, and operational KPIs.",
      metric: "11",
      metricLabel: "Analytics APIs",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50",
      iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500",
      statColor: "text-indigo-600",
    },
    {
      icon: <MdViewModule className="text-3xl" />,
      title: "Scalable Frontend Architecture",
      description:
        "Built with 51+ pages and 39 reusable components for a modular, maintainable user experience.",
      metric: "51+",
      metricLabel: "Pages",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50",
      iconBg: "bg-gradient-to-br from-teal-500 to-cyan-500",
      statColor: "text-teal-600",
    },
  ];

  return (
    <section className="relative  overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/5 rounded-full mix-blend-multiply filter blur-3xl animate-float-slower"></div>

        {/* Dot Pattern */}
        <div className="impact-grid-pattern absolute inset-0 opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 text-sm font-semibold rounded-full mb-6 border border-emerald-100">
            <MdCheckCircle className="text-base" />
            Real-World Impact
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900">Measurable Results &</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Performance Impact
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Proven improvements in data access speed, security, and operational
            efficiency across hospital management workflows.
          </p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {impacts.map((impact, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden fade-in-up-delay-${(index % 6) + 1}`}
            >
              {/* Gradient Border Top */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${impact.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              ></div>

              {/* Hover Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${impact.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon and Metric Row */}
                <div className="flex items-start justify-between mb-6">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-2xl ${impact.iconBg} text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                  >
                    {impact.icon}
                  </div>

                  {/* Metric */}
                  {/* <div className="text-right">
                    <div className={`text-3xl lg:text-4xl font-black ${impact.statColor}`}>
                      {impact.metric}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                      {impact.metricLabel}
                    </div>
                  </div> */}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300">
                  {impact.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {impact.description}
                </p>

                {/* Progress Indicator */}
                {/* <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Impact Score</span>
                    <span className={`${impact.statColor}`}>{95 - (index * 5)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${impact.gradient} rounded-full transition-all duration-1000 group-hover:scale-x-105`}
                      style={{ width: `${95 - (index * 5)}%` }}
                    ></div>
                  </div>
                </div> */}
              </div>

              {/* Corner Accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LPImpact;
