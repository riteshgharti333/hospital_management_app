import React from 'react';
import { FileText, Scale, Shield, BookOpen, AlertCircle, CheckCircle, ArrowLeft, Globe, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MdLocalHospital } from 'react-icons/md';

const Terms = () => {
  // Function to handle agreement
  const handleAgree = () => {
    localStorage.setItem('termsAgreed', 'true');
    alert('Thank you for accepting our Terms & Conditions!');
  };

  // Function to print terms
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg print:bg-white print:text-black">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <MdLocalHospital className="h-10 w-10 print:text-black" />
              <div>
                <h1 className="text-3xl font-bold">MediCare </h1>
                <p className="text-blue-100 print:text-gray-700">Hospital System Management</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/" 
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition duration-300 print:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 print:hidden"
              >
                <FileText className="h-5 w-5" />
                <span>Print Terms</span>
              </button>
            </div>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using MediCare Hospital System Management.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Effective: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Version 2.0
            </div>
            <div className="text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              Updated Regularly
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-800">Important Notice</h3>
              <p className="mt-1 text-yellow-700">
                By accessing or using MediCare  services, you agree to be bound by these Terms & Conditions. 
                If you disagree with any part, you may not access our services.
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Quick Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 print:shadow-none">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Quick Summary
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Service Agreement</h4>
                    <p className="text-sm text-gray-600">Terms for using our healthcare platform</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">User Responsibilities</h4>
                    <p className="text-sm text-gray-600">Your obligations when using the system</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <UserCheck className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">Account Terms</h4>
                    <p className="text-sm text-gray-600">Rules for account creation and management</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Quick Navigation</h4>
                <div className="space-y-2">
                  <a href="#acceptance" className="block text-blue-600 hover:text-blue-800 text-sm py-1">
                    1. Acceptance of Terms
                  </a>
                  <a href="#services" className="block text-blue-600 hover:text-blue-800 text-sm py-1">
                    2. Services Description
                  </a>
                  <a href="#accounts" className="block text-blue-600 hover:text-blue-800 text-sm py-1">
                    3. User Accounts
                  </a>
                  <a href="#conduct" className="block text-blue-600 hover:text-blue-800 text-sm py-1">
                    4. User Conduct
                  </a>
                  <a href="#liability" className="block text-blue-600 hover:text-blue-800 text-sm py-1">
                    5. Liability & Limitations
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Terms Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1 */}
            <section id="acceptance" className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">1. Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  These Terms & Conditions govern your use of the MediCare Hospital System Management 
                  platform and services. By accessing or using our services, you acknowledge that you 
                  have read, understood, and agree to be bound by these terms.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Key Points:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                      <span>You must be at least 18 years old or have parental consent</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                      <span>Healthcare providers must have valid professional credentials</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                      <span>Terms may be updated periodically - check back regularly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="services" className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">2. Services Description</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  MediCare  provides a comprehensive hospital management platform including but not 
                  limited to patient record management, appointment scheduling, billing, and healthcare 
                  provider coordination.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Included Services</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Electronic Health Records</li>
                      <li>• Appointment Management</li>
                      <li>• Billing & Insurance</li>
                      <li>• Lab Results Integration</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Service Limitations</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Not a substitute for emergency care</li>
                      <li>• Internet connection required</li>
                      <li>• Device compatibility may vary</li>
                      <li>• Service availability 99.5% uptime</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="accounts" className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">3. User Accounts & Security</h2>
              </div>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">Account Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">Requirements</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">Responsibilities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Patient Accounts</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Valid email, personal information</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Keep login credentials secure</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Provider Accounts</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Professional credentials verification</td>
                        <td className="px-4 py-3 text-sm text-gray-700">HIPAA compliance, accurate documentation</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Admin Accounts</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Hospital authorization, training</td>
                        <td className="px-4 py-3 text-sm text-gray-700">System management, user support</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-red-800">Security Notice</h4>
                      <p className="mt-1 text-sm text-red-700">
                        You are responsible for maintaining the confidentiality of your account credentials. 
                        Notify us immediately of any unauthorized use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="conduct" className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4. User Conduct & Responsibilities</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>All users must adhere to the following guidelines when using MediCare :</p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Do's</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Provide accurate information</li>
                          <li>• Use for intended medical purposes</li>
                          <li>• Report security concerns</li>
                          <li>• Maintain professional conduct</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Don'ts</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Share login credentials</li>
                          <li>• Access unauthorized data</li>
                          <li>• Misuse patient information</li>
                          <li>• Violate privacy regulations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="liability" className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">5. Liability & Limitations</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Disclaimer of Warranties</h4>
                  <p className="text-sm">
                    MediCare  is provided "as is" without warranties of any kind. While we strive for 
                    accuracy and reliability, we do not guarantee uninterrupted service or error-free operation.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Limitation of Liability</h4>
                  <p className="text-sm">
                    MediCare  shall not be liable for any indirect, incidental, special, or consequential 
                    damages arising from the use or inability to use our services.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Medical Disclaimer</h4>
                  <p className="text-sm">
                    MediCare  is a management tool and does not provide medical advice, diagnosis, 
                    or treatment. Always consult with qualified healthcare professionals for medical concerns.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-xl print:bg-white print:text-black print:shadow-none print:border">
          <h3 className="text-2xl font-bold mb-4">Accept Terms & Conditions</h3>
          <p className="mb-6 text-blue-100 max-w-2xl mx-auto print:text-gray-700">
            By clicking "I Agree", you acknowledge that you have read, understood, and accept all terms 
            and conditions outlined above.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleAgree}
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              <CheckCircle className="h-5 w-5" />
              I Agree to Terms & Conditions
            </button>
            <Link 
              to="/privacy-policy" 
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-300 print:border-gray-700 print:text-gray-800"
            >
              <Shield className="h-5 w-5" />
              View Privacy Policy
            </Link>
          </div>
          
          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-blue-500/30 print:border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200 print:text-gray-600">
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-1 print:text-gray-800">Updates</div>
                <div className="text-blue-100 print:text-gray-600">Reviewed Quarterly</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-1 print:text-gray-800">Governing Law</div>
                <div className="text-blue-100 print:text-gray-600">State of Incorporation</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-1 print:text-gray-800">Disputes</div>
                <div className="text-blue-100 print:text-gray-600">Arbitration Required</div>
              </div>
            </div>
          </div>
        </div>

        {/* Version Information */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Terms Version: 2.0 | Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="mt-1">© {new Date().getFullYear()} MediCare Hospital System Management. All rights reserved.</p>
        </div>
      </main>

      

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:border {
            border: 1px solid #ddd !important;
          }
          a[href]:after {
            content: " (" attr(href) ")";
          }
        }
      `}</style>
    </div>
  );
};

export default Terms;