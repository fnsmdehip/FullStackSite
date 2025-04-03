import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Deal {
  id: string;
  companyName: string;
  description: string;
  sector: string;
  sectorColor: string;
  amount: string;
  round: string;
  date: string;
  assigneeImage?: string;
  stage: string;
}

interface Stage {
  id: string;
  name: string;
  deals: Deal[];
}

export function PipelineBoard() {
  const [selectedStage, setSelectedStage] = useState<string>("all");

  const { data: pipelineData, isLoading } = useQuery<{ stages: Stage[] }>({
    queryKey: ["/api/deals/pipeline"],
  });

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md lg:col-span-2">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Deal Pipeline</h2>
        <div className="flex space-x-2">
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="due-diligence">Due Diligence</SelectItem>
              <SelectItem value="term-sheet">Term Sheet</SelectItem>
              <SelectItem value="closing">Closing</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="p-1">
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[280px] space-y-3">
                <Skeleton className="h-8 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {pipelineData?.stages
              .filter(
                (stage) => selectedStage === "all" || stage.id === selectedStage
              )
              .map((stage) => (
                <div
                  key={stage.id}
                  className="pipeline-stage flex flex-col bg-gray-50 dark:bg-gray-700/50 rounded-lg min-w-[280px]"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {stage.name}
                    </h3>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {stage.deals.length}
                    </span>
                  </div>

                  <div className="p-3 overflow-y-auto max-h-[400px]">
                    {stage.deals.map((deal) => (
                      <div
                        key={deal.id}
                        className="deal-card mb-3 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {deal.companyName}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded ${deal.sectorColor}`}
                          >
                            {deal.sector}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {deal.description}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {deal.amount}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-1">
                              {deal.round}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                              {deal.date}
                            </span>
                            {deal.assigneeImage && (
                              <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                                <img
                                  src={deal.assigneeImage}
                                  alt="Assignee"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
}
