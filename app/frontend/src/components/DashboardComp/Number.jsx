import {
  FaUserMd,
  FaProcedures,
  FaBed,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Number = () => {
  const cardData = [
    {
      title: "Doctors",
      value: 6,
      icon: <FaUserMd className="text-2xl" />,
      change: +2,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Patients",
      value: 6,
      icon: <FaProcedures className="text-2xl" />,
      change: -1,
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Total Beds",
      value: 20,
      icon: <FaBed className="text-2xl" />,
      change: 0,
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      title: "Reserved Beds",
      value: 40,
      icon: <FaCalendarAlt className="text-2xl" />,
      change: +5,
      color: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-200",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.0,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.0,
        ease: "easeOut",
      },
    },
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={cardVariants}
          className={`p-6 rounded-xl border ${card.borderColor} ${card.color} transition-all duration-300 cursor-default cursor-pointer`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
            </div>
            <div
              className={`p-3 rounded-lg ${card.color.replace("50", "100")}`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm">
            {card.change !== 0 ? (
              <>
                {card.change > 0 ? (
                  <FaArrowUp className="text-green-500" />
                ) : (
                  <FaArrowDown className="text-red-500" />
                )}
                <span
                  className={`ml-1 ${
                    card.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(card.change)} {card.change !== 0 && "this week"}
                </span>
              </>
            ) : (
              <span className="text-gray-500">No changes</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Number;
