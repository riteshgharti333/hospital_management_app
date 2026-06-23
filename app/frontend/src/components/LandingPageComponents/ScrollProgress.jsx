import React, { useState, useEffect } from "react";

const ScrollProgress = ({ 
  color = "from-blue-500 via-purple-500 to-pink-500",
  height = "h-1",
  position = "top",
  showPercentage = false,
  zIndex = "z-[100]",
  borderRadius = "rounded-full"
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = (scrollTop / docHeight) * 100;
          setScrollProgress(Math.min(scrollPercent, 100));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div
        className={`fixed ${position === "top" ? "top-0" : "top-20"} left-0 ${height} bg-gradient-to-r ${color} ${zIndex} ${borderRadius} transition-all duration-300 ease-out`}
        style={{ 
          width: `${scrollProgress}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
        }}
      />

      {/* Percentage Indicator */}
      {showPercentage && (
        <div className="fixed bottom-8 right-8 z-50 bg-white rounded-full shadow-xl p-3 flex items-center justify-center border border-gray-100">
          <span className="text-sm font-bold text-blue-600">
            {Math.round(scrollProgress)}%
          </span>
        </div>
      )}
    </>
  );
};

export default ScrollProgress;