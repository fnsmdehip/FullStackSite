import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// ICO/Token Sale interface
interface TokenSale {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  category: string;
  category_color: string;
  chain: string;
  status: 'upcoming' | 'active' | 'ended';
  start_date: string;
  end_date: string;
  target: string;
  raised: string;
  progress: number;
  initial_price: string;
  current_price?: string;
  roi?: string;
  roi_value?: number;
  website: string;
}

// Team member interface for project team
interface TeamMember {
  id: string;
  name: string;
  role: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

// Mock data for token sales
const mockTokenSales: TokenSale[] = [
  {
    id: "1",
    name: "Aptos Network",
    symbol: "APT",
    logo: "🔵",
    category: "Layer 1",
    category_color: "bg-blue-500",
    chain: "Aptos",
    status: 'active',
    start_date: "2025-04-05",
    end_date: "2025-05-05",
    target: "$30M",
    raised: "$18.7M",
    progress: 62,
    initial_price: "$0.85",
    website: "https://aptoslabs.com"
  },
  {
    id: "2",
    name: "Scroll Protocol",
    symbol: "SCRL",
    logo: "🟣",
    category: "Layer 2",
    category_color: "bg-purple-500",
    chain: "Ethereum",
    status: 'upcoming',
    start_date: "2025-05-10",
    end_date: "2025-06-10",
    target: "$25M",
    raised: "$0",
    progress: 0,
    initial_price: "$0.12",
    website: "https://scroll.io"
  },
  {
    id: "3",
    name: "Sui Finance",
    symbol: "SUI",
    logo: "🟢",
    category: "Layer 1",
    category_color: "bg-blue-500",
    chain: "Sui",
    status: 'ended',
    start_date: "2025-01-15",
    end_date: "2025-02-15",
    target: "$50M",
    raised: "$52.3M",
    progress: 100,
    initial_price: "$0.03",
    current_price: "$0.08",
    roi: "+166%",
    roi_value: 166,
    website: "https://sui.io"
  },
  {
    id: "4",
    name: "Mina Protocol",
    symbol: "MINA",
    logo: "⚫",
    category: "ZK",
    category_color: "bg-gray-700",
    chain: "Mina",
    status: 'ended',
    start_date: "2024-11-20",
    end_date: "2024-12-20",
    target: "$18.7M",
    raised: "$18.7M",
    progress: 100,
    initial_price: "$0.25",
    current_price: "$0.82",
    roi: "+228%",
    roi_value: 228,
    website: "https://minaprotocol.com"
  },
  {
    id: "5",
    name: "Eigenlayer",
    symbol: "EIGEN",
    logo: "🟠",
    category: "Infrastructure",
    category_color: "bg-orange-500",
    chain: "Ethereum",
    status: 'active',
    start_date: "2025-03-20",
    end_date: "2025-04-20",
    target: "$35M",
    raised: "$28.3M",
    progress: 81,
    initial_price: "$1.25",
    website: "https://eigenlayer.xyz"
  },
];

// Mock team member data
const mockTeamMembers: { [projectId: string]: TeamMember[] } = {
  "1": [
    { id: "1-1", name: "Alex Chen", role: "CEO & Founder", linkedin: "alexchen", twitter: "alexc" },
    { id: "1-2", name: "Sarah Johnson", role: "CTO", linkedin: "sarahjohnson", github: "sarahj" },
    { id: "1-3", name: "David Park", role: "Head of Research", linkedin: "davidpark", twitter: "dpark" }
  ],
  "3": [
    { id: "3-1", name: "Adeniyi Abiodun", role: "Co-Founder", linkedin: "abiodun", twitter: "adeniyi" },
    { id: "3-2", name: "Evan Cheng", role: "Co-Founder & CEO", linkedin: "evancheng", twitter: "evancheng" },
    { id: "3-3", name: "Sam Blackshear", role: "CTO", linkedin: "samblackshear", github: "sblackshear" }
  ],
  "5": [
    { id: "5-1", name: "Sreeram Kannan", role: "Founder", linkedin: "sreeramkannan", twitter: "sreeramkannan" },
    { id: "5-2", name: "Soubhik Deb", role: "Co-Founder", linkedin: "soubhikdeb", github: "sdeb" }
  ]
};

export function ICOTracker() {
  const [selectedProject, setSelectedProject] = useState<TokenSale | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("all");

  // Filter token sales based on status
  const filteredSales = activeStatusFilter === "all" 
    ? mockTokenSales 
    : mockTokenSales.filter(sale => sale.status === activeStatusFilter);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">ICO & Token Sale Tracker</h1>
          <div className="flex items-center gap-3">
            <Input 
              type="search" 
              placeholder="Search projects..." 
              className="w-64" 
            />
            <Button variant="outline" className="gap-2">
              Add to Watchlist
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveStatusFilter}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span className="ml-1">Filter</span>
              </Button>
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                <span className="ml-1">Sort</span>
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-2xl">{sale.logo}</div>
                            <div>
                              <div className="font-medium">{sale.name}</div>
                              <div className="text-sm text-muted-foreground">{sale.symbol}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${sale.category_color} text-white`}>
                            {sale.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{sale.chain}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sale.status === 'upcoming' ? 'outline' :
                            sale.status === 'active' ? 'default' : 'secondary'
                          }>
                            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{sale.start_date}</div>
                            <div className="text-muted-foreground">to {sale.end_date}</div>
                          </div>
                        </TableCell>
                        <TableCell>{sale.target}</TableCell>
                        <TableCell>
                          <div className="w-full space-y-1">
                            <Progress value={sale.progress} className="h-2" />
                            <div className="flex justify-between text-xs">
                              <span>{sale.raised}</span>
                              <span>{sale.progress}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedProject(sale)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* These are identical tabs but with filtered data through the state */}
          <TabsContent value="upcoming" className="mt-0">
            {/* Same structure as "all" but filtered */}
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            {/* Same structure as "all" but filtered */}
          </TabsContent>
          <TabsContent value="ended" className="mt-0">
            {/* Same structure as "all" but filtered */}
          </TabsContent>
        </Tabs>

        {selectedProject && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedProject.logo}</div>
                  <div>
                    <CardTitle>{selectedProject.name} ({selectedProject.symbol})</CardTitle>
                    <CardDescription>
                      <div className="flex gap-2 mt-1">
                        <Badge className={`${selectedProject.category_color} text-white`}>
                          {selectedProject.category}
                        </Badge>
                        <Badge variant="outline">{selectedProject.chain}</Badge>
                      </div>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedProject.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                  <Button variant="default" size="sm">
                    Add to Portfolio
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={
                      selectedProject.status === 'upcoming' ? 'outline' :
                      selectedProject.status === 'active' ? 'default' : 'secondary'
                    } className="text-base">
                      {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Sale Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>{selectedProject.start_date}</div>
                    <div className="text-muted-foreground">to {selectedProject.end_date}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Token Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>{selectedProject.initial_price}</div>
                    {selectedProject.current_price && (
                      <div className="text-green-600">Current: {selectedProject.current_price}</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProject.roi ? (
                      <div className={selectedProject.roi_value && selectedProject.roi_value > 0 ? 'text-green-600' : 'text-red-600'}>
                        {selectedProject.roi}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Not available yet</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Fundraising Progress</h3>
                <div className="space-y-2">
                  <Progress value={selectedProject.progress} className="h-3" />
                  <div className="flex justify-between">
                    <div>Raised: <span className="font-medium">{selectedProject.raised}</span></div>
                    <div>Target: <span className="font-medium">{selectedProject.target}</span></div>
                    <div>Progress: <span className="font-medium">{selectedProject.progress}%</span></div>
                  </div>
                </div>
              </div>

              {mockTeamMembers[selectedProject.id] && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockTeamMembers[selectedProject.id].map(member => (
                      <Card key={member.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.role}</div>
                              <div className="flex gap-2 mt-1">
                                {member.linkedin && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <a href={`https://linkedin.com/in/${member.linkedin}`} target="_blank" rel="noopener noreferrer">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                                      </svg>
                                    </a>
                                  </Button>
                                )}
                                {member.twitter && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <a href={`https://twitter.com/${member.twitter}`} target="_blank" rel="noopener noreferrer">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                      </svg>
                                    </a>
                                  </Button>
                                )}
                                {member.github && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                      </svg>
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Project Description</h3>
                <p className="text-muted-foreground">
                  {selectedProject.name} is a cutting-edge blockchain project in the {selectedProject.category} space.
                  This project aims to revolutionize the way users interact with {selectedProject.chain} blockchain
                  through innovative technologies and user-friendly interfaces.
                  
                  {/* This would normally contain actual project description data */}
                  The token sale presents an opportunity for early investors to participate in the growth of
                  this promising project.
                </p>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}