import React from "react";
import { IoClose } from "react-icons/io5";

const Avatar = ({ setIsOpen, isOpen }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse ring animation */}
      {!isOpen && (
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-2xl hover:shadow-blue-400/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
      >
        {isOpen ? (
          <IoClose className="text-white text-2xl" />
        ) : (
          <div className="relative">
            {/* Nurse Avatar */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-300">
              <div className="text-2xl">👩‍⚕️</div>
            </div>
            {/* Online indicator */}
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute -top-10 right-0 bg-white text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Chat with Medi AI 💬
        </div>
      )}
    </div>
  );
};

export default Avatar;