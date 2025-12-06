import ActivePatientsCard from "../../components/DashboardComp/ActivePatientsCard";
import AdmissionsByGender from "../../components/DashboardComp/AdmissionsByGender";
import AdmissionsTrend from "../../components/DashboardComp/AdmissionsTrend";
import AgeDistribution from "../../components/DashboardComp/AgeDistribution";
import BillingVsReceipt from "../../components/DashboardComp/BillingVsReceipt";
import BillsByStatus from "../../components/DashboardComp/BillsByStatus";
import KPIStats from "../../components/DashboardComp/KPIStats";
import LedgerFlowSummary from "../../components/DashboardComp/LedgerFlowSummary";
import Number from "../../components/DashboardComp/Number";
import PaymentModeBreakdown from "../../components/DashboardComp/PaymentModeBreakdown";
import SectionHeader from "../../components/DashboardComp/SectionHeader";
import TodayAdmissionsCard from "../../components/DashboardComp/TodayAdmissionsCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Hospital Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Real-time analytics and insights
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="font-medium">Last Updated: </span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <KPIStats />
        </div>

        {/* Patient Analytics Section */}
        <SectionHeader
          title="Patient Analytics"
          subtitle="Admissions, Demographics & Age Distribution"
          color="blue"
        />
        {/* Row: Patient Analytics */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Full width chart */}
          <div className="w-full">
            <AdmissionsTrend />
          </div>

          {/* Two half-width charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdmissionsByGender />
            <AgeDistribution />
          </div>
        </div>

        {/* Financial Analytics Section */}
        <SectionHeader
          title="Financial Analytics"
          subtitle="Billing, Payments & Revenue"
          color="green"
        />
        {/* Row: Financial Analytics */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Full width chart */}
          <div className="w-full">
            <BillingVsReceipt />
          </div>

          {/* Two half-width charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BillsByStatus />
            <PaymentModeBreakdown />
          </div>
        </div>

        {/* Section 3: Operational Analytics */}
        {/* <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-3 h-6 bg-orange-600 rounded mr-2"></div>
            <h2 className="text-xl font-bold text-gray-800">
              Operational Analytics
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <ActivePatientsCard />
            <TodayAdmissionsCard />
          </div>
          <div className="mb-6"><StaffAvailabilityChart /></div>
        </div> */}

        {/* Ledger Insights Section */}
        <SectionHeader
          title="Ledger Insights"
          subtitle="Financial Flow & Balances"
          color="red"
        />
        <div className="mb-8">
          <LedgerFlowSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
