import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  FileText,
  CheckCircle,
  ArrowLeft,
  Download,
  Mail,
  Phone,
  Clock,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MdLocalHospital } from "react-icons/md";

const Policy = () => {
  // Function to handle contact click
  const handleContactClick = () => {
    window.location.href =
      "mailto:privacy@medicare.com?subject=Privacy Policy Inquiry&body=Dear MediCare  Privacy Team,";
  };

  // Function to generate and download PDF
  const handleDownloadPDF = () => {
    // Create PDF content
    const pdfContent = `
      MediCare - Comprehensive Privacy Policy
      ============================================
      
      Effective Date: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      
      TABLE OF CONTENTS
      -----------------
      1. Introduction & Scope
      2. Information We Collect
      3. How We Use Your Information
      4. Data Sharing & Disclosure
      5. Data Security Measures
      6. Your Rights & Choices
      7. Retention Periods
      8. International Transfers
      9. Changes to This Policy
      10. Contact Information
      
      1. INTRODUCTION & SCOPE
      ------------------------
      This Privacy Policy describes how MediCare Hospital Management System
      ("MediCare ," "we," "our," or "us") collects, uses, discloses, and
      protects the personal information of patients, healthcare providers,
      and other users of our services.
      
      Scope: This policy applies to all personal and health information
      collected through our platform, mobile applications, and during
      healthcare services.
      
      2. INFORMATION WE COLLECT
      --------------------------
      A. Personal Identifiable Information (PII):
         • Full name, date of birth, gender
         • Contact information (address, phone, email)
         • Insurance information and policy numbers
         • Government-issued identification numbers
      
      B. Protected Health Information (PHI):
         • Medical history and current conditions
         • Diagnostic test results and imaging
         • Treatment plans and medication records
         • Surgical history and procedure notes
         • Allergies and adverse reactions
         • Family medical history
      
      C. Technical and Usage Data:
         • IP addresses and device identifiers
         • Browser type and version
         • Usage patterns and feature interactions
         • System logs and error reports
      
      3. HOW WE USE YOUR INFORMATION
      -------------------------------
      Primary Uses:
      • Providing medical treatment and healthcare services
      • Coordinating care among healthcare providers
      • Processing insurance claims and billing
      • Scheduling appointments and reminders
      • Maintaining accurate medical records
      
      Secondary Uses (with consent):
      • Medical research and quality improvement
      • Training healthcare professionals
      • System development and enhancement
      • Public health reporting
      
      4. DATA SHARING & DISCLOSURE
      -----------------------------
      We may share your information with:
      • Authorized healthcare providers in your care team
      • Insurance companies for claims processing
      • Laboratory and diagnostic service providers
      • Pharmacy services for medication management
      • Government agencies as required by law
      • Emergency services in life-threatening situations
      
      5. DATA SECURITY MEASURES
      --------------------------
      We implement comprehensive security measures:
      • AES-256 encryption for data at rest and in transit
      • Multi-factor authentication for all system access
      • Regular security audits and penetration testing
      • 24/7 security monitoring and threat detection
      • Role-based access controls with least privilege principle
      • Regular staff training on data protection
      
      6. YOUR RIGHTS & CHOICES
      -------------------------
      As a patient, you have the right to:
      • Access your complete medical record
      • Request corrections to inaccurate information
      • Obtain a copy of your health information
      • Request restrictions on certain uses/disclosures
      • Receive an accounting of disclosures
      • File a complaint about privacy practices
      
      7. RETENTION PERIODS
      ---------------------
      • Medical records: Minimum of 10 years from last visit
      • Billing records: 7 years from transaction date
      • Minor records: Until patient reaches age of majority + period
      • Research data: As specified in research consent forms
      
      8. INTERNATIONAL TRANSFERS
      ---------------------------
      • Data primarily stored in [Country/Region]
      • Transfers only to countries with adequate protection
      • Standard contractual clauses for international transfers
      • Explicit consent required for cross-border transfers
      
      9. CHANGES TO THIS POLICY
      --------------------------
      • Policy updates will be posted on our website
      • Material changes notified via email or platform notice
      • Continued use constitutes acceptance of changes
      
      10. CONTACT INFORMATION
      ------------------------
      Privacy Officer: Dr. Sarah Johnson
      Email: privacy@medicare-.com
      Phone: +1 (800) 555-HEALTH
      Address: 123 Healthcare Ave, Medical District, City, State 12345
      
      For complaints or concerns:
      • Internal: privacy@medicare-.com
      • Regulatory: Contact local health department
      
      ----------------------------------------------------------
      This document constitutes the complete privacy policy
      for MediCare Hospital System Management.
      
      Document Version: 3.1
      Review Frequency: Quarterly
      Next Review Date: ${new Date(
        new Date().setMonth(new Date().getMonth() + 3)
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MediCare--Privacy-Policy-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    alert(
      "Privacy Policy PDF has been downloaded successfully!\n\nFile: MediCare--Privacy-Policy.pdf"
    );
  };

  // Function to simulate printing
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
                <p className="text-blue-100 print:text-gray-700">
                  Hospital System Management
                </p>
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
                <span>Print Policy</span>
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
            <Lock className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Privacy & Data Protection Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protecting your health information with enterprise-grade security
            and compliance standards.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              HIPAA Compliant
            </div>
            <div className="text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              GDPR Ready
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Quick Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 print:shadow-none">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600" />
                Policy Highlights
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      HIPAA Compliant
                    </h4>
                    <p className="text-sm text-gray-600">
                      Fully compliant with health data regulations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      End-to-End Encryption
                    </h4>
                    <p className="text-sm text-gray-600">
                      AES encryption for all sensitive data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Patient Control
                    </h4>
                    <p className="text-sm text-gray-600">
                      Full control over your health information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Regular Audits
                    </h4>
                    <p className="text-sm text-gray-600">
                      Quarterly security and compliance audits
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">
                  Need Immediate Help?
                </h4>
                <div className="space-y-2">
                  <a
                    href="mailto:privacy@medicare-.com"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    privacy@medicare-.com
                  </a>
                  <a
                    href="tel:+18005554323"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    +1 (800) 555-HEALTH
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Policy Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1 */}
            <section className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  1. Information We Collect & Process
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="mb-4">
                  MediCare  collects and processes information necessary to
                  provide comprehensive healthcare services while maintaining
                  the highest standards of privacy and security.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Personal Information
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Full name and contact details</li>
                      <li>• Date of birth and gender</li>
                      <li>• Insurance information</li>
                      <li>• Emergency contacts</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Health Information
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Medical history and conditions</li>
                      <li>• Treatment plans and progress</li>
                      <li>• Laboratory test results</li>
                      <li>• Medication records</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Consent & Collection Methods
                  </h4>
                  <p className="text-sm">
                    Information is collected through patient registration forms,
                    healthcare provider inputs, diagnostic systems, and direct
                    patient interactions, always with appropriate consent.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  2. How We Use Your Information
                </h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                          Purpose
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-blue-700">
                          Legal Basis
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Medical Treatment
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Providing healthcare services and treatment
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Performance of contract
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Care Coordination
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Sharing with authorized healthcare providers
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Consent & Legitimate interest
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Billing & Insurance
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Processing payments and insurance claims
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Legal obligation
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Quality Improvement
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Enhancing healthcare services
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Legitimate interest
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  3. Data Security & Protection
                </h2>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">
                          AES
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        Advanced Encryption
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      All sensitive data is encrypted using military-grade
                      AES-256 encryption both at rest and in transit.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-sm">
                          MFA
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        Access Controls
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Multi-factor authentication and role-based access controls
                      ensure only authorized personnel access data.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-800">
                        Security Monitoring
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700">
                        24/7 security monitoring, regular penetration testing,
                        and continuous vulnerability assessments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                4. Your Rights & Choices
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Right to Access
                      </h4>
                      <p className="text-sm text-gray-600">
                        Request copies of your medical records and information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Right to Correction
                      </h4>
                      <p className="text-sm text-gray-600">
                        Request corrections to inaccurate or incomplete
                        information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Right to Restrict
                      </h4>
                      <p className="text-sm text-gray-600">
                        Limit how we use or disclose your information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Right to Portability
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive your information in a structured, commonly used
                        format
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  To exercise any of these rights, please contact our Privacy
                  Officer at privacy@medicare-.com. We will respond to your
                  request within 30 days as required by law.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-xl print:bg-white print:text-black print:shadow-none print:border">
          <h3 className="text-2xl font-bold mb-4">
            Questions or Concerns About Privacy?
          </h3>
          <p className="mb-6 text-blue-100 max-w-2xl mx-auto print:text-gray-700">
            Our dedicated privacy team is committed to protecting your
            information and addressing any concerns you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContactClick}
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              <Mail className="h-5 w-5" />
              Contact Privacy Officer
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-300 print:border-gray-700 print:text-gray-800"
            >
              <Download className="h-5 w-5" />
              Download Full Policy (PDF)
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-blue-500/30 print:border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200 print:text-gray-600">
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-1 print:text-gray-800">
                  24/7 Support
                </div>
                <div className="text-blue-100 print:text-gray-600">
                  Emergency privacy concerns
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-1 print:text-gray-800">
                  Response Time
                </div>
                <div className="text-blue-100 print:text-gray-600">
                  Within 24 business hours
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-1 print:text-gray-800">
                  Compliance
                </div>
                <div className="text-blue-100 print:text-gray-600">
                  HIPAA & GDPR Compliant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version Information */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Policy Version: 3.1 | Effective Date:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} MediCare Hospital System Management.
            All rights reserved.
          </p>
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

export default Policy;
