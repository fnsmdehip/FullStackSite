import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Blockchain Projects data interface
interface BlockchainProject {
  id: string;
  name: string;
  category: string;
  category_color: string;
  chain: string;
  stage: string;
  raised: string;
  valuation: string;
  holding: string;
  roi: string;
  roi_value: number;
  last_update: string;
}

// Token data interface
interface TokenHolding {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  amount: string;
  value_usd: string;
  price: string;
  change_24h: string;
  change_24h_value: number;
}

// NFT data interface
interface NFTHolding {
  id: string;
  name: string;
  collection: string;
  chain: string;
  token_id: string;
  floor_price: string;
  estimated_value: string;
  last_traded: string;
}

// Mock data for blockchain projects
const mockBlockchainProjects: BlockchainProject[] = [
  {
    id: "1",
    name: "Aave Protocol",
    category: "DeFi",
    category_color: "bg-blue-500",
    chain: "Ethereum",
    stage: "Growth",
    raised: "$5.1M",
    valuation: "$1.2B",
    holding: "3.5%",
    roi: "+425%",
    roi_value: 425,
    last_update: "2025-03-15"
  },
  {
    id: "2",
    name: "Arbitrum",
    category: "Layer 2",
    category_color: "bg-purple-500",
    chain: "Ethereum",
    stage: "Series B",
    raised: "$12M",
    valuation: "$3.1B",
    holding: "1.8%",
    roi: "+215%",
    roi_value: 215,
    last_update: "2025-03-25"
  },
  {
    id: "3",
    name: "Solana Ventures",
    category: "Infrastructure",
    category_color: "bg-green-500",
    chain: "Solana",
    stage: "Growth",
    raised: "$8.2M",
    valuation: "$2.3B",
    holding: "2.2%",
    roi: "+318%",
    roi_value: 318,
    last_update: "2025-03-20"
  },
  {
    id: "4",
    name: "Blur Marketplace",
    category: "NFT",
    category_color: "bg-orange-500",
    chain: "Ethereum",
    stage: "Seed",
    raised: "$2.5M",
    valuation: "$150M",
    holding: "5.5%",
    roi: "+85%",
    roi_value: 85,
    last_update: "2025-03-22"
  },
  {
    id: "5",
    name: "Celestia",
    category: "Infrastructure",
    category_color: "bg-green-500",
    chain: "Cosmos",
    stage: "Series A",
    raised: "$4.5M",
    valuation: "$520M",
    holding: "3.2%",
    roi: "+105%",
    roi_value: 105,
    last_update: "2025-03-18"
  },
];

// Mock data for token holdings
const mockTokenHoldings: TokenHolding[] = [
  {
    id: "1",
    symbol: "ETH",
    name: "Ethereum",
    chain: "Ethereum",
    amount: "156.25",
    value_usd: "$548,125",
    price: "$3,508.25",
    change_24h: "+4.2%",
    change_24h_value: 4.2
  },
  {
    id: "2",
    symbol: "SOL",
    name: "Solana",
    chain: "Solana",
    amount: "12,520",
    value_usd: "$1,220,324",
    price: "$97.45",
    change_24h: "+8.5%",
    change_24h_value: 8.5
  },
  {
    id: "3",
    symbol: "ARB",
    name: "Arbitrum",
    chain: "Ethereum",
    amount: "65,000",
    value_usd: "$162,500",
    price: "$2.50",
    change_24h: "-1.2%",
    change_24h_value: -1.2
  },
  {
    id: "4",
    symbol: "AAVE",
    name: "Aave",
    chain: "Ethereum",
    amount: "2,850",
    value_usd: "$307,800",
    price: "$108.00",
    change_24h: "+2.8%",
    change_24h_value: 2.8
  },
  {
    id: "5",
    symbol: "BLUR",
    name: "Blur",
    chain: "Ethereum",
    amount: "520,000",
    value_usd: "$124,800",
    price: "$0.24",
    change_24h: "-3.5%",
    change_24h_value: -3.5
  },
];

// Mock data for NFT holdings
const mockNFTHoldings: NFTHolding[] = [
  {
    id: "1",
    name: "Bored Ape #8245",
    collection: "Bored Ape Yacht Club",
    chain: "Ethereum",
    token_id: "8245",
    floor_price: "32.5 ETH",
    estimated_value: "$114,018",
    last_traded: "2025-02-10"
  },
  {
    id: "2",
    name: "DeGod #5729",
    collection: "DeGods",
    chain: "Solana",
    token_id: "5729",
    floor_price: "245 SOL",
    estimated_value: "$23,875",
    last_traded: "2025-03-05"
  },
  {
    id: "3",
    name: "Azuki #2156",
    collection: "Azuki",
    chain: "Ethereum",
    token_id: "2156",
    floor_price: "12.8 ETH",
    estimated_value: "$44,906",
    last_traded: "2025-03-12"
  },
];

export function Web3Dashboard() {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Web3 Investment Dashboard</h1>
          <Button variant="outline" className="gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Investment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Across 6 different blockchain ecosystems
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Investment Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$4.28M</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.4%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+186%</div>
              <p className="text-xs text-muted-foreground">
                Since initial investments
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="projects">Blockchain Projects</TabsTrigger>
              <TabsTrigger value="tokens">Token Holdings</TabsTrigger>
              <TabsTrigger value="nfts">NFT Holdings</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder={`Search ${activeTab === "projects" ? "projects" : activeTab === "tokens" ? "tokens" : "NFTs"}...`}
                className="w-64"
              />
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </Button>
            </div>
          </div>

          <TabsContent value="projects">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Raised</TableHead>
                      <TableHead>Valuation</TableHead>
                      <TableHead>Holding</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBlockchainProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge className={`${project.category_color} text-white`}>
                            {project.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.chain}</TableCell>
                        <TableCell>{project.stage}</TableCell>
                        <TableCell>{project.raised}</TableCell>
                        <TableCell>{project.valuation}</TableCell>
                        <TableCell>{project.holding}</TableCell>
                        <TableCell className={`text-right ${project.roi_value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {project.roi}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTokenHoldings.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-muted-foreground text-sm">{token.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{token.chain}</TableCell>
                        <TableCell>{token.amount}</TableCell>
                        <TableCell>{token.value_usd}</TableCell>
                        <TableCell>{token.price}</TableCell>
                        <TableCell className={`text-right ${token.change_24h_value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {token.change_24h}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Collection</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>Token ID</TableHead>
                      <TableHead>Floor Price</TableHead>
                      <TableHead>Estimated Value</TableHead>
                      <TableHead className="text-right">Last Traded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNFTHoldings.map((nft) => (
                      <TableRow key={nft.id}>
                        <TableCell className="font-medium">{nft.name}</TableCell>
                        <TableCell>{nft.collection}</TableCell>
                        <TableCell>{nft.chain}</TableCell>
                        <TableCell>{nft.token_id}</TableCell>
                        <TableCell>{nft.floor_price}</TableCell>
                        <TableCell>{nft.estimated_value}</TableCell>
                        <TableCell className="text-right">{nft.last_traded}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Chain Distribution</CardTitle>
              <CardDescription>
                Investment allocation across blockchains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">📊</div>
                  <p className="text-muted-foreground">Chain distribution chart would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Performance</CardTitle>
              <CardDescription>
                Return on investment over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">📈</div>
                  <p className="text-muted-foreground">Performance chart would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Web3 Market Intelligence</CardTitle>
            <CardDescription>
              Latest insights and opportunities in the blockchain space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Ethereum Layer 2 Solutions Gaining Momentum</h3>
                    <p className="text-muted-foreground mt-1">
                      Arbitrum and Optimism have seen substantial growth in TVL and user adoption in the past quarter, 
                      suggesting a strong market opportunity for scaling solutions.
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">Layer 2</Badge>
                      <Badge variant="outline">Ethereum</Badge>
                      <Badge variant="outline">Scaling</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-800 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">DeFi 2.0 Protocols Show Strong Growth Potential</h3>
                    <p className="text-muted-foreground mt-1">
                      New DeFi protocols focusing on capital efficiency and sustainable yield are outperforming 
                      traditional lending platforms, with potential for significant market expansion.
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">DeFi</Badge>
                      <Badge variant="outline">Yield</Badge>
                      <Badge variant="outline">Growth</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Market Insights</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}