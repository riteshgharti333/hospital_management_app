import React from 'react';
import { 
  MdPerson, 
  MdGroup, 
  MdLocalHospital, 
  MdCalendarToday, 
  MdReceipt, 
  MdBusiness, 
  MdMedication, 
  MdChildCare, 
  MdAccountBalance, 
  MdAdminPanelSettings, 
  MdDashboard, 
  MdLightbulb
} from 'react-icons/md';
import './lp.css';

const LPModules = () => {
 

    const modules = [
    {
      icon: <MdPerson className="text-2xl" />,
      title: "Patient Management",
      description: "Maintain patient profiles, demographics, medical history, and hospital records.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <MdCalendarToday className="text-2xl" />,
      title: "Appointments",
      description: "Schedule, track, and manage patient appointments with healthcare providers.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <MdLocalHospital className="text-2xl" />,
      title: "Admissions",
      description: "Handle admissions, discharges, and inpatient workflows with complete tracking.",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      icon: <MdGroup className="text-2xl" />,
      title: "Doctors & Nurses",
      description: "Manage healthcare staff, specializations, departments, and professional records.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      icon: <MdMedication className="text-2xl" />,
      title: "Prescriptions",
      description: "Create and organize digital prescriptions, medicines, and treatment details.",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      icon: <MdReceipt className="text-2xl" />,
      title: "Billing & Receipts",
      description: "Generate bills, track payments, and manage money receipts efficiently.",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
    {
      icon: <MdAccountBalance className="text-2xl" />,
      title: "Ledger & Accounts",
      description: "Manage ledgers, cash accounts, bank accounts, and financial transactions.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: <MdBusiness className="text-2xl" />,
      title: "Departments",
      description: "Organize hospital departments, assign heads, and streamline operations.",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      icon: <MdChildCare className="text-2xl" />,
      title: "Birth Records",
      description: "Maintain digital birth registrations with parent and newborn information.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
    {
      icon: <MdAdminPanelSettings className="text-2xl" />,
      title: "Access Management",
      description: "Secure staff access with role-based permissions and administrative controls.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      icon: <MdDashboard className="text-2xl" />,
      title: "Analytics Dashboard",
      description: "Visualize admissions, revenue, payments, demographics, and operational KPIs.",
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
    },
    
  ];


  return (
    <section className="relative  overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="modules-grid-pattern absolute inset-0 opacity-[0.02]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold rounded-full mb-6 border border-blue-100">
            <MdLocalHospital className="text-base" />
            What It Manages
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900">
              Comprehensive Hospital
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Management Modules
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            A complete suite of interconnected modules designed to streamline every 
            aspect of hospital operations and patient care.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 overflow-hidden fade-in-up-delay-${(index % 8) + 1}`}
            >
              {/* Colored Top Border */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${module.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color.replace('from-', 'from-').replace('to-', 'to-')} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${module.bgColor} ${module.textColor} mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md`}>
                  {module.icon}
                </div>

                {/* Title */}
                <h3 className={`text-base font-bold text-gray-900 mb-2 group-hover:${module.textColor} transition-colors duration-300`}>
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {module.description}
                </p>

                {/* Module Tag */}
                <div className={`mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${module.bgColor} ${module.textColor} text-xs font-semibold`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  Module {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

       

      </div>
    </section>
  );
};

export default LPModules;