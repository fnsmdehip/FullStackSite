import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, TrendingUp, TrendingDown, BarChart2, 
  Search, Zap, FileText, Layers, Shield, 
  ChevronRight, ExternalLink, Download, RefreshCw, 
  BarChart, PieChart, LineChart, 
  Flag
} from "lucide-react";

interface RiskCategory {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface RiskFactor {
  name: string;
  value: number;
  benchmark: number;
  description: string;
}

interface CompanyRisk {
  id: string;
  name: string;
  sector: string;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: RiskCategory[];
  factors: RiskFactor[];
  lastUpdated: string;
}

export function RiskAssessment() {
  const [selectedCompany, setSelectedCompany] = useState<string>("company-1");
  const [searchQuery, setSearchQuery] = useState("");
  
  const company = RISK_DATA.find(c => c.id === selectedCompany) || RISK_DATA[0];
  
  // Filter companies based on search query
  const filteredCompanies = RISK_DATA.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRiskColorClass = (riskLevel: string) => {
    switch(riskLevel) {
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return '';
    }
  };
  
  const getRiskProgressColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">AI-Powered Risk Assessment</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Portfolio Companies</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {RISK_DATA.length} Companies
                </Badge>
              </div>
              <CardDescription>Risk analysis by company</CardDescription>
              
              <div className="relative w-full mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedCompany === company.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedCompany(company.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{company.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{company.sector}</p>
                      </div>
                      <Badge className={`${getRiskColorClass(company.riskLevel)}`}>
                        {company.riskLevel.charAt(0).toUpperCase() + company.riskLevel.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Risk Score</span>
                        <span>{company.overallScore}%</span>
                      </div>
                      <Progress 
                        value={company.overallScore} 
                        className="h-1.5" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <CardDescription>{company.sector}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={`${getRiskColorClass(company.riskLevel)} mb-1`}>
                      {company.riskLevel.charAt(0).toUpperCase() + company.riskLevel.slice(1)} Risk
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Last updated: {company.lastUpdated}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Overall Risk Score</h4>
                      <span className="font-bold text-lg">{company.overallScore}%</span>
                    </div>
                    <Progress 
                      value={company.overallScore} 
                      className={`h-2 ${getRiskProgressColor(company.riskLevel)}`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {company.categories.map((category, index) => (
                      <Card key={index} className="border bg-background">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{category.name}</h5>
                            <div className={`px-1.5 py-0.5 rounded text-xs ${getRiskColorClass(category.riskLevel)}`}>
                              {category.score}%
                            </div>
                          </div>
                          <div className="mt-1">
                            <Progress 
                              value={category.score} 
                              className={`h-1.5 mt-1 ${getRiskProgressColor(category.riskLevel)}`}
                            />
                          </div>
                          <div className="flex items-center mt-2 text-xs">
                            {category.trend === 'up' ? (
                              <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                            ) : category.trend === 'down' ? (
                              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <BarChart2 className="h-3 w-3 text-muted-foreground mr-1" />
                            )}
                            <span className="text-muted-foreground">{category.description}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="details">Risk Details</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="history">Risk History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factor Analysis</CardTitle>
                    <CardDescription>Detailed breakdown of risk factors with AI insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {company.factors.map((factor, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <h4 className="font-medium">{factor.name}</h4>
                            {factor.value > 70 && (
                              <Flag className="h-4 w-4 text-red-500 ml-2" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{factor.value}%</span>
                            <span className="text-xs text-muted-foreground">
                              vs. {factor.benchmark}% benchmark
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={factor.value} 
                          className={`h-2 mt-1 mb-1 ${
                            factor.value > 70 ? 'bg-red-500' :
                            factor.value > 50 ? 'bg-orange-500' :
                            factor.value > 30 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                        {index < company.factors.length - 1 && <Separator className="mt-4 mb-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Actions</CardTitle>
                      <CardDescription>AI-generated risk mitigation strategies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="bg-primary/10 rounded-full p-1.5 h-fit">
                            <Zap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Implement additional monitoring</p>
                            <p className="text-xs text-muted-foreground">
                              Set up quarterly operational reviews with management team to address cash flow concerns
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="bg-primary/10 rounded-full p-1.5 h-fit">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Diversify supplier relationships</p>
                            <p className="text-xs text-muted-foreground">
                              Current supply chain concentration exceeds industry benchmarks by 35%
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="bg-primary/10 rounded-full p-1.5 h-fit">
                            <Layers className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Negotiate debt covenants</p>
                            <p className="text-xs text-muted-foreground">
                              Current leverage ratios approaching covenant limits; recommend proactive discussion
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparison Analysis</CardTitle>
                      <CardDescription>Risk profile vs. peer group</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Overall Risk</span>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{company.overallScore}%</span>
                              <span className="text-xs text-muted-foreground ml-1">vs. 45% avg</span>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${getRiskProgressColor(company.riskLevel)}`}
                              style={{ width: `${company.overallScore}%` }}
                            ></div>
                            <div 
                              className="h-2.5 w-1 bg-black absolute rounded-full"
                              style={{ marginLeft: '45%', marginTop: '-10px' }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex flex-col items-center">
                            <BarChart className="h-4 w-4 mb-1 text-primary" />
                            <span>Financial</span>
                            <Badge 
                              variant="outline" 
                              className="mt-1 text-xs"
                            >
                              +12% vs avg
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <PieChart className="h-4 w-4 mb-1 text-primary" />
                            <span>Market</span>
                            <Badge 
                              variant="outline" 
                              className="mt-1 text-xs"
                            >
                              -5% vs avg
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <LineChart className="h-4 w-4 mb-1 text-primary" />
                            <span>Operational</span>
                            <Badge 
                              variant="outline" 
                              className="mt-1 text-xs"
                            >
                              +8% vs avg
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>View Full Benchmark Report</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="analysis" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Risk Analysis</CardTitle>
                    <CardDescription>Advanced risk analysis powered by Gemini 2.5</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
                        <h4 className="font-medium mb-2">Executive Summary</h4>
                        <p className="text-sm">
                          {company.name} presents a {company.riskLevel} risk profile based on comprehensive 
                          analysis of financial, operational, and market factors. The company shows particular 
                          vulnerability in cash flow management and supply chain resilience, while demonstrating 
                          strengths in market positioning and management experience.
                        </p>
                        <p className="text-sm mt-2">
                          Recommend enhanced monitoring frequency and implementation of suggested risk mitigation 
                          strategies to protect investment value. Historical trends indicate risk score has 
                          increased 8% over the previous quarter, primarily driven by macroeconomic factors 
                          affecting the broader {company.sector} sector.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />
                            Key Risk Drivers
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>Limited runway (18 months) with current burn rate</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>High concentration of revenue (72%) from top two customers</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>Increasing competitive pressure in core market segments</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>Potential regulatory challenges in European markets</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-2 flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
                            Mitigating Factors
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>Strong IP portfolio with 12 patents and 8 pending applications</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>Experienced management team with successful exits</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>Diversified product development pipeline</span>
                            </li>
                            <li className="flex items-start">
                              <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-primary" />
                              <span>Strategic partnerships providing market access advantages</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                        <p className="text-sm">
                          Based on our analysis, we recommend implementing a more structured cash flow monitoring 
                          system with monthly reporting. Additionally, developing a customer diversification strategy 
                          should be prioritized to reduce concentration risk. The company should also consider 
                          exploring strategic partnerships to strengthen competitive positioning in core markets.
                        </p>
                        <div className="flex justify-end mt-3">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            Export Full Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Score History</CardTitle>
                    <CardDescription>12-month risk profile trend analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border rounded-md">
                      <div className="text-center text-muted-foreground">
                        [Risk Score History Chart]
                        <p className="text-sm mt-2">Historical risk score visualization</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <h4 className="font-medium">Key Risk Events</h4>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-24 text-xs text-muted-foreground pt-0.5">
                            Apr 2025
                          </div>
                          <div className="flex-1 border-l pl-3 pb-3">
                            <h5 className="font-medium text-sm">Q1 Financial Review</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              Risk score increased from 52% to 58% based on declining gross margins and
                              increased customer concentration.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-24 text-xs text-muted-foreground pt-0.5">
                            Feb 2025
                          </div>
                          <div className="flex-1 border-l pl-3 pb-3">
                            <h5 className="font-medium text-sm">Loss of Key Client</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              Major client representing 15% of revenue did not renew annual contract,
                              triggering reassessment of market risk factors.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-24 text-xs text-muted-foreground pt-0.5">
                            Dec 2024
                          </div>
                          <div className="flex-1 border-l pl-3 pb-3">
                            <h5 className="font-medium text-sm">New Debt Financing</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              $5M debt raised with restrictive covenants, increasing financial risk profile
                              but providing needed growth capital.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-24 text-xs text-muted-foreground pt-0.5">
                            Oct 2024
                          </div>
                          <div className="flex-1 border-l pl-3">
                            <h5 className="font-medium text-sm">Market Expansion</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              Entry into European markets increased regulatory risk exposure but reduced
                              geographic concentration risk.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample risk assessment data
const RISK_DATA: CompanyRisk[] = [
  {
    id: "company-1",
    name: "TechVision Inc.",
    sector: "Software & SaaS",
    overallScore: 58,
    riskLevel: "medium",
    categories: [
      {
        name: "Financial",
        score: 65,
        trend: "up",
        riskLevel: "high",
        description: "Increased 12% over last quarter"
      },
      {
        name: "Market",
        score: 42,
        trend: "stable",
        riskLevel: "medium",
        description: "Stable competitive position"
      },
      {
        name: "Operational",
        score: 55,
        trend: "up",
        riskLevel: "medium",
        description: "Supply chain pressures increasing"
      },
      {
        name: "Regulatory",
        score: 30,
        trend: "down",
        riskLevel: "low",
        description: "Risk decreasing with compliance updates"
      }
    ],
    factors: [
      {
        name: "Cash Runway",
        value: 75,
        benchmark: 60,
        description: "Current burn rate indicates 18 months of runway, below the sector average of 24 months. Recommend monitoring monthly cash flow metrics."
      },
      {
        name: "Customer Concentration",
        value: 72,
        benchmark: 40,
        description: "Top two customers represent 72% of revenue, significantly above industry benchmark of 40%. High risk of revenue disruption if relationships change."
      },
      {
        name: "Competitive Position",
        value: 45,
        benchmark: 50,
        description: "Market share stable but increasing pressure from new entrants with lower-cost alternatives. Product differentiation remains a strength."
      },
      {
        name: "Management Experience",
        value: 28,
        benchmark: 35,
        description: "Strong leadership team with prior successful exits and relevant industry experience. CEO previously scaled a company to $100M ARR."
      },
      {
        name: "Supply Chain Resilience",
        value: 63,
        benchmark: 45,
        description: "Limited supplier diversification and increasing dependence on components with extended lead times. Potential for production delays."
      }
    ],
    lastUpdated: "Apr 02, 2025"
  },
  {
    id: "company-2",
    name: "BioTech Innovations",
    sector: "Healthcare & Biotech",
    overallScore: 72,
    riskLevel: "high",
    categories: [
      {
        name: "Financial",
        score: 80,
        trend: "up",
        riskLevel: "critical",
        description: "Burn rate accelerating"
      },
      {
        name: "Market",
        score: 65,
        trend: "up",
        riskLevel: "high",
        description: "Increased competition in key segments"
      },
      {
        name: "Operational",
        score: 60,
        trend: "stable",
        riskLevel: "medium",
        description: "Clinical trial progress on target"
      },
      {
        name: "Regulatory",
        score: 78,
        trend: "up",
        riskLevel: "high",
        description: "Pending FDA decision critical"
      }
    ],
    factors: [
      {
        name: "Cash Runway",
        value: 85,
        benchmark: 60,
        description: "Current funding covers only 10 months of operations at current burn rate. Additional fundraising needed before Q4."
      },
      {
        name: "Regulatory Approval",
        value: 78,
        benchmark: 65,
        description: "Phase III clinical trial results pending with FDA. Approval timeline uncertain with potential for delays."
      },
      {
        name: "IP Protection",
        value: 45,
        benchmark: 50,
        description: "Core patents secured with 12 years remaining, but potential challenges from competitors in adjacent technology areas."
      },
      {
        name: "Market Timing",
        value: 68,
        benchmark: 45,
        description: "Window of opportunity narrowing as competing therapies advance through clinical pipelines."
      }
    ],
    lastUpdated: "Mar 28, 2025"
  },
  {
    id: "company-3",
    name: "GreenEnergy Solutions",
    sector: "Renewable Energy",
    overallScore: 35,
    riskLevel: "low",
    categories: [
      {
        name: "Financial",
        score: 30,
        trend: "down",
        riskLevel: "low",
        description: "Strong cash position"
      },
      {
        name: "Market",
        score: 25,
        trend: "down",
        riskLevel: "low",
        description: "Expanding market share"
      },
      {
        name: "Operational",
        score: 40,
        trend: "stable",
        riskLevel: "medium",
        description: "Minor supply chain challenges"
      },
      {
        name: "Regulatory",
        score: 35,
        trend: "down",
        riskLevel: "low",
        description: "Favorable policy environment"
      }
    ],
    factors: [
      {
        name: "Government Incentives",
        value: 20,
        benchmark: 45,
        description: "Secured long-term incentives through 2030, reducing revenue uncertainty and enhancing project economics."
      },
      {
        name: "Technology Adoption",
        value: 30,
        benchmark: 55,
        description: "Customer acquisition rates exceeding projections by 25%, with lower customer acquisition costs than forecast."
      },
      {
        name: "Supply Chain",
        value: 45,
        benchmark: 50,
        description: "Multiple supplier relationships established with inventory buffers to mitigate component shortages."
      },
      {
        name: "Competitive Landscape",
        value: 28,
        benchmark: 40,
        description: "Proprietary technology maintains efficiency advantages over competitors with strong barriers to entry."
      }
    ],
    lastUpdated: "Mar 25, 2025"
  },
  {
    id: "company-4",
    name: "Quantum Computing Inc.",
    sector: "Advanced Technology",
    overallScore: 82,
    riskLevel: "critical",
    categories: [
      {
        name: "Financial",
        score: 85,
        trend: "up",
        riskLevel: "critical",
        description: "Critical funding needs"
      },
      {
        name: "Market",
        score: 75,
        trend: "up",
        riskLevel: "high",
        description: "Uncertain market timing"
      },
      {
        name: "Operational",
        score: 80,
        trend: "up",
        riskLevel: "critical",
        description: "Technical milestones delayed"
      },
      {
        name: "Regulatory",
        score: 60,
        trend: "stable",
        riskLevel: "medium",
        description: "Export controls monitoring needed"
      }
    ],
    factors: [
      {
        name: "Technical Feasibility",
        value: 88,
        benchmark: 60,
        description: "Core technology still requires significant breakthroughs to achieve stated performance goals."
      },
      {
        name: "Funding Requirements",
        value: 90,
        benchmark: 65,
        description: "Capital intensive research with uncertain timeline to commercial viability; next funding round critical."
      },
      {
        name: "Talent Retention",
        value: 70,
        benchmark: 50,
        description: "High competition for quantum computing specialists with increasing turnover of key technical staff."
      },
      {
        name: "Commercialization Path",
        value: 85,
        benchmark: 60,
        description: "Unclear path from research stage to viable commercial products; market applications still theoretical."
      }
    ],
    lastUpdated: "Mar 22, 2025"
  },
  {
    id: "company-5",
    name: "Urban Mobility Ltd.",
    sector: "Transportation & Logistics",
    overallScore: 48,
    riskLevel: "medium",
    categories: [
      {
        name: "Financial",
        score: 45,
        trend: "down",
        riskLevel: "medium",
        description: "Improving unit economics"
      },
      {
        name: "Market",
        score: 55,
        trend: "up",
        riskLevel: "medium",
        description: "Increasing competition"
      },
      {
        name: "Operational",
        score: 40,
        trend: "down",
        riskLevel: "medium",
        description: "Fleet efficiency improving"
      },
      {
        name: "Regulatory",
        score: 60,
        trend: "up",
        riskLevel: "medium",
        description: "New urban regulations pending"
      }
    ],
    factors: [
      {
        name: "Regulatory Landscape",
        value: 65,
        benchmark: 55,
        description: "Varying city-by-city regulations creating operational complexity and unpredictable market access."
      },
      {
        name: "Unit Economics",
        value: 45,
        benchmark: 50,
        description: "Contribution margins improving but still below target; path to profitability relies on scale assumptions."
      },
      {
        name: "Customer Acquisition",
        value: 38,
        benchmark: 45,
        description: "Strong brand recognition and decreasing customer acquisition costs in established markets."
      },
      {
        name: "Infrastructure Dependencies",
        value: 52,
        benchmark: 40,
        description: "Reliance on urban charging infrastructure development which varies significantly by location."
      }
    ],
    lastUpdated: "Mar 20, 2025"
  }
];