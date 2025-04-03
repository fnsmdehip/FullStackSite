import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { PlusIcon, Download } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { PortfolioTable } from "@/components/dashboard/portfolio-table";
import { DollarSignIcon, BriefcaseIcon, UsersIcon, TrendingUpIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  
  // Attempt to get auth information (but don't require it for now due to debugging)
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (error) {
    console.log("Using dashboard without auth context");
  }

  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery<{
    metrics: {
      aum: { value: string; change: string; isPositive: boolean };
      activeDeals: { value: string; change: string; isPositive: boolean };
      portfolioCompanies: { value: string; change: string; isPositive: boolean };
      irr: { value: string; change: string; isPositive: boolean };
    };
  }>({
    queryKey: ["/api/dashboard/metrics"],
    enabled: true, // Always fetch metrics even if user is not authenticated (temporary)
  });

  const metrics = metricsData?.metrics;

  return (
    <AppLayout>
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {user ? (
              <>Welcome back, <span className="font-semibold">{user.name || user.username}</span>. Here's an overview of your portfolio and deal pipeline.</>
            ) : (
              <>Welcome to VentureFlow. Here's an overview of the portfolio and deal pipeline.</>
            )}
          </p>
          {user && (
            <div className="mt-2 inline-flex items-center py-1 px-2 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-xs font-medium rounded-md">
              Logged in as {user.name || user.username} ({user.role || "User"})
            </div>
          )}
        </div>
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <Button className="inline-flex items-center">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add New Deal
          </Button>
          <Button variant="outline" className="inline-flex items-center">
            <Download className="-ml-1 mr-2 h-5 w-5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="AUM"
          value={metrics?.aum.value || "..."}
          change={{
            value: metrics?.aum.change || "0%",
            isPositive: metrics?.aum.isPositive ?? true,
          }}
          context="vs last quarter"
          icon={<DollarSignIcon />}
          iconBgClass="bg-primary-100 dark:bg-primary-900/30"
          iconColorClass="text-primary-600 dark:text-primary-400"
        />

        <MetricCard
          title="Active Deals"
          value={metrics?.activeDeals.value || "..."}
          change={{
            value: metrics?.activeDeals.change || "0",
            isPositive: metrics?.activeDeals.isPositive ?? true,
          }}
          context="new this month"
          icon={<BriefcaseIcon />}
          iconBgClass="bg-blue-100 dark:bg-blue-900/30"
          iconColorClass="text-blue-600 dark:text-blue-400"
        />

        <MetricCard
          title="Portfolio Companies"
          value={metrics?.portfolioCompanies.value || "..."}
          change={{
            value: metrics?.portfolioCompanies.change || "0",
            isPositive: metrics?.portfolioCompanies.isPositive ?? true,
          }}
          context="new acquisitions"
          icon={<UsersIcon />}
          iconBgClass="bg-purple-100 dark:bg-purple-900/30"
          iconColorClass="text-purple-600 dark:text-purple-400"
        />

        <MetricCard
          title="Portfolio IRR"
          value={metrics?.irr.value || "..."}
          change={{
            value: metrics?.irr.change || "0%",
            isPositive: metrics?.irr.isPositive ?? true,
          }}
          context="vs benchmark"
          icon={<TrendingUpIcon />}
          iconBgClass="bg-green-100 dark:bg-green-900/30"
          iconColorClass="text-green-600 dark:text-green-400"
        />
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PipelineBoard />
        <AIInsights />
      </div>

      {/* Portfolio Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioChart />
        <PortfolioTable />
      </div>
    </AppLayout>
  );
}
