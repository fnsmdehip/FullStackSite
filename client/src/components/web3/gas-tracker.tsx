import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Gas price data interface
interface GasPrice {
  network: string;
  slow: {
    price: string;
    time: string;
  };
  standard: {
    price: string;
    time: string;
  };
  fast: {
    price: string;
    time: string;
  };
  rapid: {
    price: string;
    time: string;
  };
  base_fee: string;
  last_updated: string;
}

// Transaction interface
interface Transaction {
  hash: string;
  network: string;
  timestamp: string;
  gas_price: string;
  gas_used: string;
  total_cost: string;
  status: 'success' | 'pending' | 'failed';
}

// Mock data for gas prices
const mockGasPrices: GasPrice[] = [
  {
    network: 'Ethereum',
    slow: {
      price: '24 Gwei',
      time: '5-10 min'
    },
    standard: {
      price: '32 Gwei',
      time: '2-4 min'
    },
    fast: {
      price: '48 Gwei',
      time: '30-60 sec'
    },
    rapid: {
      price: '64 Gwei',
      time: '15-30 sec'
    },
    base_fee: '22.5 Gwei',
    last_updated: '1 min ago'
  },
  {
    network: 'Polygon',
    slow: {
      price: '80 Gwei',
      time: '3-5 min'
    },
    standard: {
      price: '120 Gwei',
      time: '1-2 min'
    },
    fast: {
      price: '150 Gwei',
      time: '30-45 sec'
    },
    rapid: {
      price: '200 Gwei',
      time: '10-20 sec'
    },
    base_fee: '78 Gwei',
    last_updated: '2 min ago'
  },
  {
    network: 'Arbitrum',
    slow: {
      price: '0.1 Gwei',
      time: '5-10 min'
    },
    standard: {
      price: '0.15 Gwei',
      time: '2-4 min'
    },
    fast: {
      price: '0.25 Gwei',
      time: '30-60 sec'
    },
    rapid: {
      price: '0.35 Gwei',
      time: '15-30 sec'
    },
    base_fee: '0.1 Gwei',
    last_updated: '2 min ago'
  },
  {
    network: 'Optimism',
    slow: {
      price: '0.001 Gwei',
      time: '2-4 min'
    },
    standard: {
      price: '0.005 Gwei',
      time: '1-2 min'
    },
    fast: {
      price: '0.01 Gwei',
      time: '30-45 sec'
    },
    rapid: {
      price: '0.02 Gwei',
      time: '10-20 sec'
    },
    base_fee: '0.001 Gwei',
    last_updated: '1 min ago'
  },
  {
    network: 'Base',
    slow: {
      price: '0.05 Gwei',
      time: '3-5 min'
    },
    standard: {
      price: '0.1 Gwei',
      time: '1-2 min'
    },
    fast: {
      price: '0.2 Gwei',
      time: '30-45 sec'
    },
    rapid: {
      price: '0.3 Gwei',
      time: '10-20 sec'
    },
    base_fee: '0.05 Gwei',
    last_updated: '3 min ago'
  }
];

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    hash: '0x7a16b331a65de3826f6b7d91e1dbf86364a91682', 
    network: 'Ethereum',
    timestamp: '10 min ago',
    gas_price: '42 Gwei',
    gas_used: '125,000',
    total_cost: '0.00525 ETH',
    status: 'success'
  },
  {
    hash: '0x9c57a05b1a51a3b139bae9f356e79332',
    network: 'Arbitrum',
    timestamp: '15 min ago',
    gas_price: '0.25 Gwei',
    gas_used: '520,000',
    total_cost: '0.00013 ETH',
    status: 'success'
  },
  {
    hash: '0x7c31b7aa678b27f5d8af2b5a3254a058',
    network: 'Polygon',
    timestamp: '25 min ago',
    gas_price: '135 Gwei',
    gas_used: '95,000',
    total_cost: '0.012825 MATIC',
    status: 'pending'
  },
  {
    hash: '0x3f5a9e4c28d7b9b6c1d2b3e4f5a6b7c8',
    network: 'Optimism',
    timestamp: '35 min ago',
    gas_price: '0.01 Gwei',
    gas_used: '185,000',
    total_cost: '0.00000185 ETH',
    status: 'success'
  },
  {
    hash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
    network: 'Base',
    timestamp: '50 min ago',
    gas_price: '0.2 Gwei',
    gas_used: '78,000',
    total_cost: '0.0000156 ETH',
    status: 'failed'
  }
];

export function GasTracker() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");

  // Filter gas prices based on selected network
  const filteredGasPrices = selectedNetwork === "all" 
    ? mockGasPrices 
    : mockGasPrices.filter(price => price.network === selectedNetwork);

  // Filter transactions based on selected network
  const filteredTransactions = selectedNetwork === "all" 
    ? mockTransactions 
    : mockTransactions.filter(tx => tx.network === selectedNetwork);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gas Price Tracker</h1>
          <div className="flex items-center gap-2">
            <Select 
              value={selectedNetwork} 
              onValueChange={setSelectedNetwork}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                {mockGasPrices.map(price => (
                  <SelectItem key={price.network} value={price.network}>
                    {price.network}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">Refresh</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Slow</CardTitle>
              <CardDescription>Higher Confirmation Time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedNetwork === "all" ? mockGasPrices[0].slow.price : filteredGasPrices[0]?.slow.price}
              </div>
              <p className="text-xs text-muted-foreground">
                Est. Time: {selectedNetwork === "all" ? mockGasPrices[0].slow.time : filteredGasPrices[0]?.slow.time}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Standard</CardTitle>
              <CardDescription>Recommended</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedNetwork === "all" ? mockGasPrices[0].standard.price : filteredGasPrices[0]?.standard.price}
              </div>
              <p className="text-xs text-muted-foreground">
                Est. Time: {selectedNetwork === "all" ? mockGasPrices[0].standard.time : filteredGasPrices[0]?.standard.time}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fast</CardTitle>
              <CardDescription>Quick Confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedNetwork === "all" ? mockGasPrices[0].fast.price : filteredGasPrices[0]?.fast.price}
              </div>
              <p className="text-xs text-muted-foreground">
                Est. Time: {selectedNetwork === "all" ? mockGasPrices[0].fast.time : filteredGasPrices[0]?.fast.time}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rapid</CardTitle>
              <CardDescription>Priority Transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedNetwork === "all" ? mockGasPrices[0].rapid.price : filteredGasPrices[0]?.rapid.price}
              </div>
              <p className="text-xs text-muted-foreground">
                Est. Time: {selectedNetwork === "all" ? mockGasPrices[0].rapid.time : filteredGasPrices[0]?.rapid.time}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="gasPrices" className="w-full">
          <TabsList>
            <TabsTrigger value="gasPrices">Gas Prices</TabsTrigger>
            <TabsTrigger value="recentTx">Recent Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="gasPrices">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Network</TableHead>
                      <TableHead>Slow</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Fast</TableHead>
                      <TableHead>Rapid</TableHead>
                      <TableHead>Base Fee</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGasPrices.map((price) => (
                      <TableRow key={price.network}>
                        <TableCell className="font-medium">{price.network}</TableCell>
                        <TableCell>
                          <div>{price.slow.price}</div>
                          <div className="text-xs text-muted-foreground">{price.slow.time}</div>
                        </TableCell>
                        <TableCell>
                          <div>{price.standard.price}</div>
                          <div className="text-xs text-muted-foreground">{price.standard.time}</div>
                        </TableCell>
                        <TableCell>
                          <div>{price.fast.price}</div>
                          <div className="text-xs text-muted-foreground">{price.fast.time}</div>
                        </TableCell>
                        <TableCell>
                          <div>{price.rapid.price}</div>
                          <div className="text-xs text-muted-foreground">{price.rapid.time}</div>
                        </TableCell>
                        <TableCell>{price.base_fee}</TableCell>
                        <TableCell>{price.last_updated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recentTx">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Gas Price</TableHead>
                      <TableHead>Gas Used</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.hash}>
                        <TableCell className="font-medium">
                          <span className="text-xs font-mono">
                            {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                          </span>
                        </TableCell>
                        <TableCell>{tx.network}</TableCell>
                        <TableCell>{tx.timestamp}</TableCell>
                        <TableCell>{tx.gas_price}</TableCell>
                        <TableCell>{tx.gas_used}</TableCell>
                        <TableCell>{tx.total_cost}</TableCell>
                        <TableCell>
                          <Badge variant={
                            tx.status === 'success' ? 'default' :
                            tx.status === 'pending' ? 'outline' : 'destructive'
                          }>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </TableCell>
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
              <CardTitle>Gas Price History (24h)</CardTitle>
              <CardDescription>Gas price trends over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">📈</div>
                  <p className="text-muted-foreground">Historical gas price chart would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gas Price Predictions</CardTitle>
              <CardDescription>AI-powered gas price forecasts for the next 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Ethereum</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Based on historical patterns and current network activity
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>6 hours from now</span>
                      <Badge variant="outline">35-50 Gwei</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>12 hours from now</span>
                      <Badge variant="outline">28-42 Gwei</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>24 hours from now</span>
                      <Badge variant="outline">22-38 Gwei</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Polygon</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Based on historical patterns and current network activity
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>6 hours from now</span>
                      <Badge variant="outline">100-140 Gwei</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>12 hours from now</span>
                      <Badge variant="outline">90-120 Gwei</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>24 hours from now</span>
                      <Badge variant="outline">70-100 Gwei</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gas Optimization Tips</CardTitle>
            <CardDescription>
              Save on transaction costs with these helpful tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Timing Your Transactions</h3>
                <p className="text-muted-foreground text-sm">
                  Gas prices are typically lowest during off-peak hours (weekends and late nights).
                  Scheduling non-urgent transactions during these periods can save significant costs.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Layer 2 Solutions</h3>
                <p className="text-muted-foreground text-sm">
                  Consider using Layer 2 solutions like Arbitrum, Optimism, or Base for lower gas fees
                  and faster transaction confirmations when interacting with DeFi protocols.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Gas Limit Optimization</h3>
                <p className="text-muted-foreground text-sm">
                  Set appropriate gas limits for your transactions. While you need enough gas to complete 
                  the transaction, setting unnecessarily high limits wastes funds if not used.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View More Gas Saving Tips</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}