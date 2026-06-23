import React from "react";
import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiPostgresql,
  SiRedis,
  SiTailwindcss,
  SiAmazonwebservices,
  SiTypescript,
  SiSupabase,
} from "react-icons/si";
import { TbStack2, TbDatabase, TbCloud, TbTools } from "react-icons/tb";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";
import "./lp.css";
import { APP_CONFIG } from "../../config";

const LPTech = () => {
  const techCategories = [
    {
      category: "Frontend",
      icon: <TbStack2 className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      techs: [
        {
          name: "React",
          icon: <SiReact className="text-2xl" />,
          color: "#61DAFB",
          description: "UI Framework",
        },
        {
          name: "React Query",
          icon: <SiReact className="text-2xl" />,
          color: "#FF4154",
          description: "Data Fetching",
        },
        {
          name: "Tailwind CSS",
          icon: <SiTailwindcss className="text-2xl" />,
          color: "#06B6D4",
          description: "Styling",
        },
        {
          name: "TypeScript",
          icon: <SiTypescript className="text-2xl" />,
          color: "#3178C6",
          description: "Type Safety",
        },
      ],
    },
    {
      category: "Backend",
      icon: <TbDatabase className="text-2xl" />,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      techs: [
        {
          name: "Node.js",
          icon: <SiNodedotjs className="text-2xl" />,
          color: "#339933",
          description: "Runtime",
        },
        {
          name: "Express",
          icon: <SiExpress className="text-2xl" />,
          color: "#000000",
          description: "API Framework",
        },
        {
          name: "Prisma",
          icon: <SiPrisma className="text-2xl" />,
          color: "#2D3748",
          description: "ORM",
        },
        {
          name: "PostgreSQL",
          icon: <SiPostgresql className="text-2xl" />,
          color: "#4169E1",
          description: "Database",
        },
      ],
    },
    {
      category: "Infrastructure",
      icon: <TbCloud className="text-2xl" />,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      techs: [
        {
          name: "Redis",
          icon: <SiRedis className="text-2xl" />,
          color: "#DC382D",
          description: "Caching",
        },
        {
          name: "AWS S3",
          icon: <SiAmazonwebservices className="text-2xl" />,
          color: "#FF9900",
          description: "Storage",
        },
        {
          name: "Supabase",
          icon: <SiSupabase className="text-2xl" />,
          color: "#3ECF8E",
          description: "Backend Services",
        },
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden pb-10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="tech-grid-pattern absolute inset-0 opacity-[0.02]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm font-semibold rounded-full mb-6 border border-blue-100">
            <TbTools className="text-base" />
            Technology Stack
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900">Built with Modern</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            A robust tech stack chosen for performance, scalability, and
            developer experience.
          </p>
        </div>

        {/* Tech Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {techCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              className={`relative bg-white rounded-3xl p-8 border ${category.borderColor} shadow-sm hover:shadow-xl transition-all duration-500 fade-in-up-delay-${catIndex + 1}`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {category.category}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.techs.length} technologies
                  </p>
                </div>
              </div>

              {/* Technologies List */}
              <div className="space-y-4">
                {category.techs.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    {/* Tech Icon */}
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 group-hover:border-transparent group-hover:shadow-lg transition-all duration-300"
                      style={{ color: tech.color }}
                    >
                      {tech.icon}
                    </div>

                    {/* Tech Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {tech.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {tech.description}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    <MdArrowForward className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                ))}
              </div>

              {/* Category Badge */}
              <div
                className={`absolute -top-3 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${category.color} text-white text-xs font-bold shadow-lg`}
              >
                {catIndex + 1}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 fade-in-up">
          <a
            href={APP_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 rounded-2xl shadow-xl shadow-gray-500/25 hover:shadow-gray-500/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            <SiReact className="text-xl" />
            View Source Code on GitHub
            <MdArrowForward className="text-xl" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default LPTech;
