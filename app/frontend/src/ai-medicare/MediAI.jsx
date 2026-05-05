import React, { useState, useRef, useEffect } from "react";
import {
  IoChatbubbleEllipses,
  IoClose,
  IoSend,
  IoPeople,
  IoCash,
  IoBed,
  IoTime,
  IoMedkit,
  IoHeart,
} from "react-icons/io5";
import Avatar from "./Avatar";

const MediAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Medi AI, your nursing assistant. How can I help you today? 💙",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample data for demo
  const hospitalData = {
    totalPatients: 47,
    occupiedBeds: 38,
    totalBeds: 52,
    todayRevenue: 284500,
    admissions: 12,
    discharges: 8,
    icuPatients: 6,
    emergencyWaitTime: "15 min",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(
      () => {
        const botResponse = generateResponse(inputMessage.toLowerCase());
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 2,
            text: botResponse,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    );
  };

  const generateResponse = (query) => {
    if (
      query.includes("patient") ||
      query.includes("admitted") ||
      query.includes("total")
    ) {
      return `📊 Currently, there are **${hospitalData.totalPatients} patients** admitted. Today we had ${hospitalData.admissions} new admissions and ${hospitalData.discharges} discharges. ICU occupancy: ${hospitalData.icuPatients} patients.`;
    } else if (
      query.includes("revenue") ||
      query.includes("income") ||
      query.includes("money") ||
      query.includes("earn")
    ) {
      return `💰 Today's revenue is **₹${hospitalData.todayRevenue.toLocaleString()}**. This includes consultations, procedures, and pharmacy sales.`;
    } else if (
      query.includes("emergency") ||
      query.includes("wait") ||
      query.includes("er")
    ) {
      return `🚨 Current emergency wait time: **${hospitalData.emergencyWaitTime}**. Emergency department is operational 24/7.`;
    } else if (
      query.includes("hello") ||
      query.includes("hi") ||
      query.includes("hey")
    ) {
      return "👋 Hello! I'm Medi AI, your friendly nursing assistant. You can ask me about patient admissions, today's revenue, bed availability, or emergency wait times!";
    } else if (query.includes("thank")) {
      return "You're welcome! 💙 Is there anything else I can help you with?";
    } else {
      return "I can help you with: 📋 Total patients admitted, 💰 Today's revenue, 🛏️ Bed availability, 🚨 Emergency wait time. What would you like to know?";
    }
  };

  const handleQuickAction = (action) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: action,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(action.toLowerCase());
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          text: response,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <Avatar setIsOpen={setIsOpen} isOpen={isOpen} />
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-blue-100 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
                <span className="text-2xl">👩‍⚕️</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-base flex items-center gap-2">
                Medi AI
                <span className="text-blue-200 text-xs font-normal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                  Online
                </span>
              </h3>
              <p className="text-blue-100 text-xs">Nursing Assistant</p>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs">
                <IoMedkit />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <IoClose className="text-lg" />
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-blue-50 p-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => handleQuickAction("Total patients")}
              className="flex-shrink-0 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1 shadow-sm"
            >
              <IoPeople className="text-blue-500" />
              {hospitalData.totalPatients} patients
            </button>
            <button
              onClick={() => handleQuickAction("Revenue today")}
              className="flex-shrink-0 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors flex items-center gap-1 shadow-sm"
            >
              <IoCash className="text-green-500" />₹
              {hospitalData.todayRevenue.toLocaleString()}
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-blue-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-sm">👩‍⚕️</span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] ${msg.sender === "user" ? "order-1" : "order-2"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-100"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <p
                    className={`text-xs text-gray-400 mt-1 ${msg.sender === "user" ? "text-right mr-1" : "ml-1"}`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-sm">👩‍⚕️</span>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => handleQuickAction("Total patients admitted")}
              className="flex-shrink-0 bg-white hover:bg-blue-50 text-xs text-blue-600 px-3 py-1.5 rounded-full border border-blue-200 transition-colors flex items-center gap-1"
            >
              <IoPeople className="text-xs" />
              Patients
            </button>
            <button
              onClick={() => handleQuickAction("Today's revenue")}
              className="flex-shrink-0 bg-white hover:bg-green-50 text-xs text-green-600 px-3 py-1.5 rounded-full border border-green-200 transition-colors flex items-center gap-1"
            >
              <IoCash className="text-xs" />
              Revenue
            </button>
            <button
              onClick={() => handleQuickAction("Emergency wait time")}
              className="flex-shrink-0 bg-white hover:bg-red-50 text-xs text-red-600 px-3 py-1.5 rounded-full border border-red-200 transition-colors flex items-center gap-1"
            >
              <IoTime className="text-xs" />
              ER Wait
            </button>
            <button
              onClick={() => handleQuickAction("ICU status")}
              className="flex-shrink-0 bg-white hover:bg-purple-50 text-xs text-purple-600 px-3 py-1.5 rounded-full border border-purple-200 transition-colors flex items-center gap-1"
            >
              <IoHeart className="text-xs" />
              ICU
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-500/20"
            >
              <IoSend className="text-white" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #93c5fd;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #60a5fa;
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          height: 0;
        }
      `}</style>
    </>
  );
};

export default MediAI;
