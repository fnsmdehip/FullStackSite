import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText, Upload, Search, Filter, Download, 
  Eye, Edit2, Archive, Share2, Star, Clock, 
  Users, MessageSquare, PenTool, CheckCircle, AlertTriangle
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  lastModified: string;
  size: string;
  sharedWith: number;
  comments: number;
  starred: boolean;
}

interface Contract {
  id: string;
  name: string;
  counterparty: string;
  status: 'draft' | 'in_review' | 'approved' | 'signed' | 'expired';
  value: string;
  expiryDate: string;
  reviewers: string[];
}

export function DocumentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
  const handleDocumentSelect = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };
  
  const filteredDocuments = DOCUMENTS.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Document Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="legal">Legal Documents</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center mt-4 mb-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Documents</CardTitle>
              <CardDescription>Manage all your documents in one place</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedDocuments.length === DOCUMENTS.length}
                        onCheckedChange={() => {
                          if (selectedDocuments.length === DOCUMENTS.length) {
                            setSelectedDocuments([]);
                          } else {
                            setSelectedDocuments(DOCUMENTS.map(doc => doc.id));
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedDocuments.includes(document.id)}
                          onCheckedChange={() => handleDocumentSelect(document.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{document.name}</span>
                          {document.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                        </div>
                      </TableCell>
                      <TableCell>{document.type}</TableCell>
                      <TableCell>
                        <Badge variant={document.status === "Active" ? "default" : "secondary"}>
                          {document.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{document.lastModified}</span>
                        </div>
                      </TableCell>
                      <TableCell>{document.size}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-0">
          <ContractReviewSection />
        </TabsContent>
        
        <TabsContent value="legal" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>View and manage legal documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Filter applied: Document Type = Legal
              </p>
              <div className="mt-4">
                {DOCUMENTS.filter(doc => doc.type === "Legal").length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No legal documents found</h3>
                    <p className="text-muted-foreground mt-2">
                      Upload legal documents to see them here
                    </p>
                    <Button className="mt-4">Upload Legal Document</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DOCUMENTS.filter(doc => doc.type === "Legal").map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{document.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={document.status === "Active" ? "default" : "secondary"}>
                              {document.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{document.lastModified}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Financial Documents</CardTitle>
              <CardDescription>View and manage financial documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Filter applied: Document Type = Financial
              </p>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DOCUMENTS.filter(doc => doc.type === "Financial").map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{document.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={document.status === "Active" ? "default" : "secondary"}>
                            {document.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{document.lastModified}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContractReviewSection() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>Manage and review your contracts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {CONTRACTS.map((contract) => (
                <div 
                  key={contract.id}
                  className={`border-b p-4 cursor-pointer hover:bg-muted/50 ${selectedContract?.id === contract.id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedContract(contract)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{contract.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">with {contract.counterparty}</p>
                    </div>
                    <Badge
                      variant={
                        contract.status === 'signed' ? 'default' :
                        contract.status === 'in_review' ? 'secondary' :
                        contract.status === 'approved' ? 'outline' :
                        contract.status === 'expired' ? 'destructive' : 'outline'
                      }
                    >
                      {contract.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Value: {contract.value}</span>
                    <span>Expires: {contract.expiryDate}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {selectedContract ? (
          <Card className="h-full">
            <CardHeader className="flex flex-row justify-between items-start space-y-0">
              <div>
                <CardTitle>{selectedContract.name}</CardTitle>
                <CardDescription className="mt-1">
                  Contract with {selectedContract.counterparty}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status</p>
                    <div>
                      <Badge
                        variant={
                          selectedContract.status === 'signed' ? 'default' :
                          selectedContract.status === 'in_review' ? 'secondary' :
                          selectedContract.status === 'approved' ? 'outline' :
                          selectedContract.status === 'expired' ? 'destructive' : 'outline'
                        }
                      >
                        {selectedContract.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Value</p>
                    <p>{selectedContract.value}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Expiry Date</p>
                    <p>{selectedContract.expiryDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reviewers</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedContract.reviewers.join(', ')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Review Status</h4>
                    <Badge variant="outline">3/5 Approved</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Sarah Johnson (Principal)</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">Approved</Badge>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>James Williams (Legal)</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">Approved</Badge>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Maria Rodriguez (Finance)</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">Approved</Badge>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>David Chen (Compliance)</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Robert Taylor (Partner)</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">Pending</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Comments</h4>
                  <div className="space-y-3">
                    <div className="border p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">James Williams</span>
                          <span className="text-xs text-muted-foreground">Legal</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Yesterday at 3:42 PM</span>
                      </div>
                      <p className="mt-1 text-sm">
                        Please review section 8.3 regarding indemnification clauses. We should add additional protection for intellectual property.
                      </p>
                    </div>
                    
                    <div className="border p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Maria Rodriguez</span>
                          <span className="text-xs text-muted-foreground">Finance</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Apr 01 at 11:15 AM</span>
                      </div>
                      <p className="mt-1 text-sm">
                        Payment terms look good. I've updated the financial models to reflect the new pricing structure.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Input placeholder="Add a comment..." />
                    <Button className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center py-10">
              <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Select a contract to review</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Click on any contract from the list to view details, add comments, and collaborate with your team.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Sample data
const DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    name: "Investment Terms - TechVision",
    type: "Legal",
    status: "Active",
    lastModified: "Today at 2:35 PM",
    size: "1.2 MB",
    sharedWith: 5,
    comments: 3,
    starred: true
  },
  {
    id: "doc-2",
    name: "Q1 Financial Report",
    type: "Financial",
    status: "Active",
    lastModified: "Yesterday at 9:15 AM",
    size: "3.8 MB",
    sharedWith: 8,
    comments: 12,
    starred: false
  },
  {
    id: "doc-3",
    name: "Due Diligence Checklist",
    type: "Legal",
    status: "Draft",
    lastModified: "Mar 30 at 4:22 PM",
    size: "540 KB",
    sharedWith: 3,
    comments: 0,
    starred: false
  },
  {
    id: "doc-4",
    name: "Portfolio Performance Analysis",
    type: "Financial",
    status: "Active",
    lastModified: "Mar 28 at 11:30 AM",
    size: "2.1 MB",
    sharedWith: 6,
    comments: 4,
    starred: true
  },
  {
    id: "doc-5",
    name: "NDA - Quantum Computing Startup",
    type: "Legal",
    status: "Active",
    lastModified: "Mar 25 at 3:45 PM",
    size: "890 KB",
    sharedWith: 2,
    comments: 1,
    starred: false
  },
  {
    id: "doc-6",
    name: "Investment Memo - BioTech Series B",
    type: "Analysis",
    status: "Draft",
    lastModified: "Mar 22 at 5:10 PM",
    size: "1.7 MB",
    sharedWith: 4,
    comments: 8,
    starred: false
  },
  {
    id: "doc-7",
    name: "Fund Performance Q1 2025",
    type: "Financial",
    status: "Active",
    lastModified: "Mar 20 at 10:15 AM",
    size: "4.2 MB",
    sharedWith: 10,
    comments: 7,
    starred: true
  }
];

const CONTRACTS: Contract[] = [
  {
    id: "contract-1",
    name: "Series A Investment Agreement",
    counterparty: "TechVision Inc.",
    status: "in_review",
    value: "$5,000,000",
    expiryDate: "Dec 31, 2030",
    reviewers: ["Sarah Johnson", "James Williams", "Maria Rodriguez", "David Chen", "Robert Taylor"]
  },
  {
    id: "contract-2",
    name: "Strategic Partnership Agreement",
    counterparty: "Global Ventures LLC",
    status: "approved",
    value: "Non-monetary",
    expiryDate: "Jun 15, 2026",
    reviewers: ["James Williams", "Robert Taylor", "Emily Davidson"]
  },
  {
    id: "contract-3",
    name: "Convertible Note",
    counterparty: "BioTech Innovations",
    status: "signed",
    value: "$2,500,000",
    expiryDate: "Mar 22, 2027",
    reviewers: ["Sarah Johnson", "Maria Rodriguez", "David Chen"]
  },
  {
    id: "contract-4",
    name: "Fund Advisory Agreement",
    counterparty: "Thompson Investment Group",
    status: "draft",
    value: "$150,000/year",
    expiryDate: "Jan 01, 2028",
    reviewers: ["Robert Taylor", "Sarah Johnson"]
  },
  {
    id: "contract-5",
    name: "Co-Investment Agreement",
    counterparty: "Quantum Capital",
    status: "expired",
    value: "$10,000,000 (pooled)",
    expiryDate: "Dec 31, 2024",
    reviewers: ["Robert Taylor", "Sarah Johnson", "David Chen"]
  }
];