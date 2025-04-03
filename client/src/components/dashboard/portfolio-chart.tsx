import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartData {
  name: string;
  value: number;
  benchmark?: number;
}

export function PortfolioChart() {
  const { data, isLoading } = useQuery<{ data: ChartData[] }>({
    queryKey: ["/api/portfolio/performance"],
  });

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio Performance</h2>
        <div className="flex space-x-2">
          <Select defaultValue="12m">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12m">Last 12 Months</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
              <SelectItem value="q">Last Quarter</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 h-72">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Performance']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: 'rgb(229 231 235)',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
              {/* Only render benchmark if it exists in the data */}
              {data?.data.some(item => item.benchmark !== undefined) && (
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
