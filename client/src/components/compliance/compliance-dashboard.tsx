import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, AlertTriangle, BarChart4, FileCheck, Lock, 
  Server, Clock, Database, Search, FileText 
} from "lucide-react";

// Financial compliance dashboard that adheres to SEC and FINRA requirements
export function ComplianceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Run Audit
          </Button>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Compliance Alert</AlertTitle>
        <AlertDescription>
          Quarterly SEC filing deadline approaching in 15 days. 3 documents pending review.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audits">Audit Logs</TabsTrigger>
          <TabsTrigger value="records">Recordkeeping</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComplianceCard 
              title="Rule 4370" 
              description="Business Continuity"
              status="compliant"
              icon={<Server className="h-5 w-5" />}
              details="Last backup: 2 hours ago"
            />
            <ComplianceCard 
              title="Rules 3110/3120" 
              description="Audit Trails"
              status="attention"
              icon={<Clock className="h-5 w-5" />}
              details="5 new activities flagged"
            />
            <ComplianceCard 
              title="Rule 17a-3/17a-4" 
              description="Recordkeeping"
              status="compliant"
              icon={<Database className="h-5 w-5" />}
              details="All records up to date"
            />
            <ComplianceCard 
              title="Regulation S-P" 
              description="Privacy Protection"
              status="compliant"
              icon={<Lock className="h-5 w-5" />}
              details="Encryption standards met"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Activity Timeline</CardTitle>
              <CardDescription>Recent compliance-related events and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start border-l-2 border-green-500 pl-4 pb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <FileCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Quarterly Compliance Review Completed</p>
                    <p className="text-sm text-muted-foreground">All documentation properly maintained according to Rule 17a-4</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">2 hours ago</Badge>
                      <Badge variant="outline">Auto-documented</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start border-l-2 border-amber-500 pl-4 pb-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Risk Assessment Flag</p>
                    <p className="text-sm text-muted-foreground">Potential Rule 3110 compliance gap detected in due diligence documentation</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">1 day ago</Badge>
                      <Badge variant="outline">Requires review</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start border-l-2 border-blue-500 pl-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <BarChart4 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Cybersecurity Risk Assessment</p>
                    <p className="text-sm text-muted-foreground">Automated vulnerability scanning completed per Cybersecurity Risk Management Rule</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">3 days ago</Badge>
                      <Badge variant="outline">No issues found</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Complete audit trails of all risk assessment decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AUDIT_LOGS.map((log, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.user} • {log.timestamp}
                      </p>
                    </div>
                    <Badge 
                      variant={log.type === 'access' ? 'outline' : 
                               log.type === 'change' ? 'secondary' : 'default'}
                    >
                      {log.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Recordkeeping</CardTitle>
              <CardDescription>Structured recordkeeping with automated retention policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECORD_CATEGORIES.map((category, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        <p className="font-semibold">{category.name}</p>
                      </div>
                      <Badge>{category.recordCount} records</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Retention policy: {category.retentionPolicy}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Last updated: {category.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Measures</CardTitle>
              <CardDescription>End-to-end encryption and cybersecurity risk management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <p className="font-semibold">Data Encryption</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    End-to-end encryption of all customer information with zero-knowledge architecture
                  </p>
                  <Badge className="mt-2" variant="outline">Regulation S-P Rule 30 Compliant</Badge>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <p className="font-semibold">Vulnerability Management</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Continuous vulnerability scanning and automated patch management
                  </p>
                  <Badge className="mt-2" variant="outline">Cybersecurity Risk Management Rule Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Compliance status card component
function ComplianceCard({ 
  title, 
  description, 
  status, 
  icon, 
  details 
}: { 
  title: string; 
  description: string; 
  status: 'compliant' | 'attention' | 'violation'; 
  icon: React.ReactNode;
  details: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
          <div>
            {icon}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <Badge
              variant={status === 'compliant' ? 'default' : 
                     status === 'attention' ? 'secondary' : 'destructive'}
            >
              {status === 'compliant' ? 'Compliant' : 
               status === 'attention' ? 'Needs Attention' : 'Violation'}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{details}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Example audit logs data
const AUDIT_LOGS = [
  {
    action: "Accessed portfolio performance data",
    user: "John Smith (Partner)",
    timestamp: "Today at 2:35 PM",
    type: "access"
  },
  {
    action: "Modified risk assessment for TechVision deal",
    user: "Sarah Johnson (Principal)",
    timestamp: "Today at 11:20 AM",
    type: "change"
  },
  {
    action: "Generated quarterly compliance report",
    user: "System",
    timestamp: "Yesterday at 5:00 PM",
    type: "system"
  },
  {
    action: "Accessed sensitive client information",
    user: "Michael Chen (Analyst)",
    timestamp: "Yesterday at 3:42 PM",
    type: "access"
  },
  {
    action: "Updated information barrier controls",
    user: "Admin",
    timestamp: "Apr 01 at 10:15 AM",
    type: "change"
  }
];

// Example record categories
const RECORD_CATEGORIES = [
  {
    name: "Investment Records",
    recordCount: 285,
    retentionPolicy: "7 years after investment exit",
    lastUpdated: "Today at 3:15 PM"
  },
  {
    name: "Client Communications",
    recordCount: 1204,
    retentionPolicy: "5 years from date of communication",
    lastUpdated: "Yesterday at 2:30 PM"
  },
  {
    name: "Risk Assessments",
    recordCount: 158,
    retentionPolicy: "10 years from assessment date",
    lastUpdated: "Mar 30 at 11:45 AM"
  },
  {
    name: "Financial Statements",
    recordCount: 93,
    retentionPolicy: "Permanent",
    lastUpdated: "Mar 28 at 4:20 PM"
  }
];