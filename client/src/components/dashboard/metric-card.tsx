import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
  context: string;
  icon: ReactNode;
  iconBgClass: string;
  iconColorClass: string;
}

export function MetricCard({
  title,
  value,
  change,
  context,
  icon,
  iconBgClass,
  iconColorClass,
}: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBgClass}`}>
            <div className={`h-6 w-6 ${iconColorClass}`}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
                <div className="mt-1 flex items-baseline text-sm">
                  <span className={`font-semibold ${change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {change.isPositive ? '+' : ''}{change.value}
                  </span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">{context}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
