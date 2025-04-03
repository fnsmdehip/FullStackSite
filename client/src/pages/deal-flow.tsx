import { AppLayout } from "@/layouts/app-layout";

export default function DealFlow() {
  return (
    <AppLayout>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deal Flow</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track your investment opportunities from initial screening to closing.
        </p>
        
        {/* Content for Deal Flow page will go here */}
        <div className="p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Deal Flow Management</h3>
          <p className="text-gray-600 dark:text-gray-400">This page is under construction.</p>
        </div>
      </div>
    </AppLayout>
  );
}
