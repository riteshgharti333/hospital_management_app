import React from 'react';
import { 
  MdStorage, 
  MdFilterList, 
  MdCached, 
  MdQueryStats, 
  MdAccountTree, 
  MdTrendingUp,
  MdCheckCircle,
  MdArrowForward
} from 'react-icons/md';
import './lp.css';

const LPSystem = () => {
  const capabilities = [
    {
      icon: <MdStorage className="text-3xl" />,
      title: "Handles Large Datasets Efficiently",
      description: "Tested with million-scale admission records, ensuring stable performance under heavy data load.",
      stat: "1M+",
      statLabel: "Records Tested",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <MdFilterList className="text-3xl" />,
      title: "Cursor-Based Pagination",
      description: "Implements efficient pagination to handle large datasets without performance degradation, avoiding costly offset queries.",
      stat: "10x",
      statLabel: "Faster Queries",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <MdCached className="text-3xl" />,
      title: "Multi-Layer Caching Strategy",
      description: "Uses in-memory and Redis caching to reduce database load and improve response times for frequently accessed data.",
      stat: "95%",
      statLabel: "Cache Hit Rate",
      gradient: "from-cyan-500 to-cyan-600"
    },
    {
      icon: <MdQueryStats className="text-3xl" />,
      title: "Optimized Database Queries",
      description: "Leverages indexing and selective data fetching to ensure fast and efficient query execution across modules.",
      stat: "50ms",
      statLabel: "Avg Response",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <MdAccountTree className="text-3xl" />,
      title: "Efficient Data Access Patterns",
      description: "Reusable query structure across modules ensures consistent performance for patients, admissions, and billing systems.",
      stat: "3x",
      statLabel: "Code Reusability",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <MdTrendingUp className="text-3xl" />,
      title: "Scalable Backend Architecture",
      description: "Designed to support growing datasets and multiple interconnected modules without compromising speed or reliability.",
      stat: "∞",
      statLabel: "Scalability",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="relative  overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="system-grid-pattern absolute inset-0 opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold rounded-full mb-6 border border-blue-100">
            <MdCheckCircle className="text-base" />
            System Capabilities
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900">
              Built for High-Volume
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Healthcare Data
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Designed to maintain performance and responsiveness even as data volume 
            grows across multiple hospital modules.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden fade-in-up-delay-${index + 1}`}
            >
              {/* Top Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${capability.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              
              {/* Background Pattern on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon & Stat Row */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${
                    index === 0 ? 'from-blue-50 to-blue-100 text-blue-600' :
                    index === 1 ? 'from-indigo-50 to-indigo-100 text-indigo-600' :
                    index === 2 ? 'from-cyan-50 to-cyan-100 text-cyan-600' :
                    index === 3 ? 'from-emerald-50 to-emerald-100 text-emerald-600' :
                    index === 4 ? 'from-purple-50 to-purple-100 text-purple-600' :
                    'from-orange-50 to-orange-100 text-orange-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {capability.icon}
                  </div>
                  
                  {/* Stat Badge */}
                  <div className="text-right">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${capability.gradient} bg-clip-text text-transparent`}>
                      {capability.stat}
                    </div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5">
                      {capability.statLabel}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {capability.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-[15px] mb-4">
                  {capability.description}
                </p>

                {/* Performance Indicator */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${capability.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                      style={{ width: `${85 - (index * 5)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {95 - (index * 3)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

     

       

      </div>
    </section>
  );
};

export default LPSystem;