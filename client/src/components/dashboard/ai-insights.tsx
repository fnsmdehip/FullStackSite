import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, SendIcon, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Insight {
  id: string;
  type: "info" | "warning" | "opportunity";
  title: string;
  description: string;
  actionLink?: string;
  actionText?: string;
}

interface GeminiResponse {
  response: string;
}

export function AIInsights() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/ai/insights"],
  });
  
  // Handle error state with a separate useEffect
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error fetching insights",
        description: "Could not load AI insights. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);
  
  const insights = data as { insights: Insight[] } | undefined;

  const geminiMutation = useMutation({
    mutationFn: async (queryText: string) => {
      const res = await apiRequest("POST", "/api/ai/query", { query: queryText });
      return await res.json() as { response: string };
    },
    onSuccess: (data: GeminiResponse) => {
      setAiResponse(data.response);
      setQuery("");
      toast({
        title: "AI Response Received",
        description: "Gemini AI has processed your query.",
      });
      
      // Refresh insights after a successful query
      queryClient.invalidateQueries({ queryKey: ["/api/ai/insights"] });
    },
    onError: (error) => {
      toast({
        title: "Error processing query",
        description: "Failed to get response from Gemini AI. Please try again.",
        variant: "destructive",
      });
      console.error("Error querying Gemini AI:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setAiResponse(null);
    geminiMutation.mutate(query);
  };

  const getInsightStyles = (type: string) => {
    switch (type) {
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          title: "text-blue-800 dark:text-blue-300",
          text: "text-blue-700 dark:text-blue-200",
          actionText: "text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200",
          icon: <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          title: "text-yellow-800 dark:text-yellow-300",
          text: "text-yellow-700 dark:text-yellow-200",
          actionText: "text-yellow-700 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-200",
          icon: <AlertTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
        };
      case "opportunity":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          title: "text-green-800 dark:text-green-300",
          text: "text-green-700 dark:text-green-200",
          actionText: "text-green-700 dark:text-green-300 hover:text-green-600 dark:hover:text-green-200",
          icon: <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />,
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-200 dark:border-gray-800",
          title: "text-gray-800 dark:text-gray-300",
          text: "text-gray-700 dark:text-gray-200",
          actionText: "text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200",
          icon: <InfoIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />,
        };
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <svg className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          AI Insights
        </h2>
        <Button variant="ghost" size="icon">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </Button>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </>
          ) : (
            <>
              {insights?.insights.map((insight) => {
                const styles = getInsightStyles(insight.type);
                return (
                  <div
                    key={insight.id}
                    className={`p-3 ${styles.bg} rounded-lg border ${styles.border}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {styles.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${styles.title}`}>
                          {insight.title}
                        </h3>
                        <div className={`mt-1 text-sm ${styles.text}`}>
                          <p>{insight.description}</p>
                        </div>
                        {insight.actionLink && insight.actionText && (
                          <div className="mt-2">
                            <a
                              href={insight.actionLink}
                              className={`text-xs font-medium ${styles.actionText}`}
                            >
                              {insight.actionText}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <Separator className="my-4" />

          {/* Display AI Response if available */}
          {aiResponse && (
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Gemini AI Response
                  </h3>
                  <AlertDescription className="mt-1 text-sm text-blue-700 dark:text-blue-200 whitespace-pre-line">
                    {aiResponse}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          {/* Gemini AI query form */}
          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ask Gemini AI
              </h3>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <Textarea
                    rows={2}
                    name="ai-query"
                    id="ai-query"
                    placeholder="Analyze market trends for AI healthcare startups..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full resize-none"
                    disabled={geminiMutation.isPending}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <div className="flex items-center">
                      {geminiMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    </div>
                    <Button
                      type="submit"
                      disabled={geminiMutation.isPending || !query.trim()}
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary-500"
                    >
                      {geminiMutation.isPending ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <SendIcon className="h-3 w-3 mr-1" />
                          Ask
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
