import { AppLayout } from "@/layouts/app-layout";

export default function PortfolioManagement() {
  return (
    <AppLayout>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage your portfolio companies, track KPIs, and identify value creation opportunities.
        </p>
        
        {/* Content for Portfolio Management page will go here */}
        <div className="p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Portfolio Company Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-400">This page is under construction.</p>
        </div>
      </div>
    </AppLayout>
  );
}
