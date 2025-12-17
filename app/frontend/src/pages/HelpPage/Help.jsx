import React, { useState } from "react";
import {
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MdLocalHospital } from "react-icons/md";

const Help = () => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Support",
      detail: "+1 (800) 555-HELP",
      description: "Available 24/7 for urgent issues",
      action: "tel:+18005554357",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      detail: "support@medicare.com",
      description: "Response within 4 hours",
      action: "mailto:support@medicare.com",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      detail: "Click to start chat",
      description: "Available Mon-Fri, 9AM-6PM",
      action: "#",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const quickLinks = [
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "Terms & Conditions", link: "/terms-&-conditions" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !selectedIssue || !message) {
      alert("Please fill all required fields");
      return;
    }

    alert(
      `Thank you ${name}! Your support request has been submitted. We'll contact you at ${email} regarding: ${selectedIssue}`
    );

    // Reset form
    setName("");
    setEmail("");
    setSelectedIssue("");
    setMessage("");
  };

  const handleLiveChat = () => {
    alert(
      "Live chat would open in a real application. For demo: support@medicare-.com"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MdLocalHospital className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">MediCare </h1>
                <p className="text-blue-100">Help & Support</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-4">
            <MdLocalHospital className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Need Help?</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Contact our support team or submit a request. We're here to help.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${method.color} mb-4`}
              >
                {method.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{method.description}</p>

              {method.title === "Live Chat" ? (
                <button
                  onClick={handleLiveChat}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                >
                  Start Chat
                </button>
              ) : (
                <a
                  href={method.action}
                  className="block w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                >
                  {method.title === "Call Support" ? "Call Now" : "Send Email"}
                </a>
              )}

              <p className="mt-3 text-sm text-gray-700">{method.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send Support Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type *
                </label>
                <select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="Technical">Technical Problem</option>
                  <option value="Account">Account Issue</option>
                  <option value="Billing">Billing Question</option>
                  <option value="Medical">Medical Records</option>
                  <option value="Appointment">Appointment Help</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your issue..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Submit Request
              </button>
            </form>
          </div>

          {/* Quick Help Section */}
          <div className="space-y-8">
            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Quick Links
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.link}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition duration-300"
                  >
                    <div className="h-2 w-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700 hover:text-blue-600">
                      {link.text}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start">
                <Shield className="h-6 w-6 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Medical Emergency?</h3>
                  <p className="mb-4">
                    This system is NOT for medical emergencies. If you have a
                    medical emergency:
                  </p>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <p className="font-bold text-lg">Call 911 immediately</p>
                    <p className="text-sm opacity-90">
                      or go to the nearest emergency room
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">We're Here to Help</h3>
          <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
            Our average response time is 2 hours for email and immediate for
            phone calls. You'll receive a confirmation email when your request
            is received.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+18005554357"
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              <Phone className="h-5 w-5" />
              Call Now: (800) 555-HELP
            </a>
            <a
              href="mailto:support@medicare-.com"
              className="flex items-center gap-2 bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-300"
            >
              <Mail className="h-5 w-5" />
              Email Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
