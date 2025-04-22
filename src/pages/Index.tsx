
import DashboardLayout from "@/components/Layout/DashboardLayout";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import LicenseSummary from "@/components/Dashboard/LicenseSummary";
import ExpiringLicenses from "@/components/Dashboard/ExpiringLicenses";
import UsageChart from "@/components/Dashboard/UsageChart";
import CostBreakdown from "@/components/Dashboard/CostBreakdown";
import LicenseCard from "@/components/Dashboard/LicenseCard";
import { licenses } from "@/data/mockData";

const Index = () => {
  // Get 3 recent licenses to display
  const recentLicenses = [...licenses]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <div className="space-y-6">
        <LicenseSummary />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UsageChart />
          <CostBreakdown />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Licenses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentLicenses.map((license) => (
                <LicenseCard key={license.id} license={license} />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Expiring Soon</h2>
            <ExpiringLicenses />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
