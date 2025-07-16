import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

// Sample lead data with CEO/VC outreach info
const leadData = [
  {
    id: 1,
    name: "John Smith",
    company: "TechCorp Inc",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    stage: "qualified",
    source: "website",
    value: 75000,
    probability: 70,
    lastContact: "2024-01-15",
    assignedTo: "Alice Johnson",
    notes: "Interested in enterprise package",
    contactType: "CEO",
    responsibility: "Product Demo Scheduled",
    recommendations: "Follow up on enterprise features, prepare ROI analysis",
    outreachType: "CEO",
    nextAction: "Schedule technical call",
    urgency: "high"
  },
  {
    id: 2,
    name: "Sarah Davis",
    company: "Innovate Solutions",
    email: "sarah.davis@innovate.com",
    phone: "+1 (555) 987-6543",
    stage: "proposal",
    source: "referral",
    value: 120000,
    probability: 85,
    lastContact: "2024-01-14",
    assignedTo: "Bob Wilson",
    notes: "Ready to sign, waiting for approval",
    contactType: "VC",
    responsibility: "Contract Review",
    recommendations: "Expedite legal review, prepare implementation timeline",
    outreachType: "VC",
    nextAction: "Schedule final approval meeting",
    urgency: "high"
  },
  {
    id: 3,
    name: "Mike Chen",
    company: "Digital Dynamics",
    email: "mike.chen@digital.com",
    phone: "+1 (555) 456-7890",
    stage: "contacted",
    source: "linkedin",
    value: 45000,
    probability: 30,
    lastContact: "2024-01-13",
    assignedTo: "Alice Johnson",
    notes: "Initial interest shown",
    contactType: "CEO",
    responsibility: "Needs Assessment",
    recommendations: "Conduct discovery call, identify pain points",
    outreachType: "CEO",
    nextAction: "Schedule discovery call",
    urgency: "medium"
  },
  {
    id: 4,
    name: "Lisa Rodriguez",
    company: "Future Systems",
    email: "lisa.r@futuresys.com",
    phone: "+1 (555) 234-5678",
    stage: "negotiation",
    source: "cold-call",
    value: 95000,
    probability: 60,
    lastContact: "2024-01-12",
    assignedTo: "Charlie Brown",
    notes: "Price negotiation in progress",
    contactType: "VC",
    responsibility: "Price Negotiation",
    recommendations: "Prepare competitive analysis, offer volume discount",
    outreachType: "VC",
    nextAction: "Present revised proposal",
    urgency: "high"
  },
  {
    id: 5,
    name: "David Wilson",
    company: "Smart Industries",
    email: "d.wilson@smart.com",
    phone: "+1 (555) 345-6789",
    stage: "closed-won",
    source: "website",
    value: 85000,
    probability: 100,
    lastContact: "2024-01-10",
    assignedTo: "Bob Wilson",
    notes: "Deal closed successfully",
    contactType: "CEO",
    responsibility: "Onboarding Support",
    recommendations: "Ensure smooth implementation, schedule kickoff meeting",
    outreachType: "CEO",
    nextAction: "Begin onboarding process",
    urgency: "low"
  },
  {
    id: 6,
    name: "Emma Thompson",
    company: "Growth Capital",
    email: "emma.t@growthcap.com",
    phone: "+1 (555) 567-8901",
    stage: "qualified",
    source: "referral",
    value: 150000,
    probability: 75,
    lastContact: "2024-01-16",
    assignedTo: "Alice Johnson",
    notes: "Interested in full platform suite",
    contactType: "VC",
    responsibility: "Platform Demo",
    recommendations: "Showcase advanced analytics, prepare case studies",
    outreachType: "VC",
    nextAction: "Schedule platform demo",
    urgency: "high"
  },
  {
    id: 7,
    name: "Robert Kim",
    company: "NextGen Ventures",
    email: "r.kim@nextgen.com",
    phone: "+1 (555) 678-9012",
    stage: "contacted",
    source: "linkedin",
    value: 200000,
    probability: 40,
    lastContact: "2024-01-11",
    assignedTo: "Charlie Brown",
    notes: "Exploring options for portfolio companies",
    contactType: "VC",
    responsibility: "Portfolio Assessment",
    recommendations: "Understand portfolio needs, prepare multi-company proposal",
    outreachType: "VC",
    nextAction: "Portfolio needs analysis",
    urgency: "medium"
  },
  {
    id: 8,
    name: "Jennifer Lee",
    company: "Innovation Labs",
    email: "j.lee@innovlabs.com",
    phone: "+1 (555) 789-0123",
    stage: "proposal",
    source: "website",
    value: 95000,
    probability: 80,
    lastContact: "2024-01-09",
    assignedTo: "Bob Wilson",
    notes: "Reviewing proposal with board",
    contactType: "CEO",
    responsibility: "Board Approval",
    recommendations: "Prepare board presentation, highlight quick wins",
    outreachType: "CEO",
    nextAction: "Board presentation",
    urgency: "high"
  }
];

// Chart data
const conversionData = [
  { month: "Jan", leads: 45, qualified: 28, proposals: 15, closed: 8 },
  { month: "Feb", leads: 52, qualified: 35, proposals: 18, closed: 12 },
  { month: "Mar", leads: 48, qualified: 30, proposals: 20, closed: 10 },
  { month: "Apr", leads: 61, qualified: 42, proposals: 25, closed: 15 },
  { month: "May", leads: 55, qualified: 38, proposals: 22, closed: 14 },
  { month: "Jun", leads: 67, qualified: 45, proposals: 28, closed: 18 }
];

const sourceData = [
  { name: "Website", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Referral", value: 25, color: "hsl(var(--chart-2))" },
  { name: "LinkedIn", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Cold Call", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" }
];

const stageColors = {
  "new": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "contacted": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "qualified": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "proposal": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "negotiation": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "closed-won": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "closed-lost": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
};

export default function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedOutreachType, setSelectedOutreachType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("last-month");

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leadData.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = selectedStage === "all" || lead.stage === selectedStage;
      const matchesSource = selectedSource === "all" || lead.source === selectedSource;
      const matchesAssignee = selectedAssignee === "all" || lead.assignedTo === selectedAssignee;
      const matchesOutreachType = selectedOutreachType === "all" || lead.outreachType === selectedOutreachType;

      return matchesSearch && matchesStage && matchesSource && matchesAssignee && matchesOutreachType;
    });
  }, [searchTerm, selectedStage, selectedSource, selectedAssignee, selectedOutreachType]);

  // Calculate metrics
  const totalLeads = leadData.length;
  const qualifiedLeads = leadData.filter(lead => ["qualified", "proposal", "negotiation", "closed-won"].includes(lead.stage)).length;
  const totalValue = leadData.reduce((sum, lead) => sum + lead.value, 0);
  const avgDealSize = totalValue / totalLeads;
  const conversionRate = (leadData.filter(lead => lead.stage === "closed-won").length / totalLeads * 100).toFixed(1);
  
  // CEO/VC specific metrics
  const ceoLeads = leadData.filter(lead => lead.outreachType === "CEO");
  const vcLeads = leadData.filter(lead => lead.outreachType === "VC");
  const ceoConversionRate = (ceoLeads.filter(lead => lead.stage === "closed-won").length / ceoLeads.length * 100).toFixed(1);
  const vcConversionRate = (vcLeads.filter(lead => lead.stage === "closed-won").length / vcLeads.length * 100).toFixed(1);
  const ceoTotalValue = ceoLeads.reduce((sum, lead) => sum + lead.value, 0);
  const vcTotalValue = vcLeads.reduce((sum, lead) => sum + lead.value, 0);
  
  // Status distribution for pie chart
  const statusData = [
    { name: "New", value: leadData.filter(lead => lead.stage === "new").length, color: "hsl(var(--chart-1))" },
    { name: "Contacted", value: leadData.filter(lead => lead.stage === "contacted").length, color: "hsl(var(--chart-2))" },
    { name: "Qualified", value: leadData.filter(lead => lead.stage === "qualified").length, color: "hsl(var(--chart-3))" },
    { name: "Proposal", value: leadData.filter(lead => lead.stage === "proposal").length, color: "hsl(var(--chart-4))" },
    { name: "Negotiation", value: leadData.filter(lead => lead.stage === "negotiation").length, color: "hsl(var(--chart-5))" },
    { name: "Closed Won", value: leadData.filter(lead => lead.stage === "closed-won").length, color: "hsl(var(--primary))" }
  ].filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageLabel = (stage: string) => {
    return stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage your sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Trend Buttons */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={selectedPeriod === "last-week" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedPeriod("last-week")}
        >
          Last Week
        </Button>
        <Button 
          variant={selectedPeriod === "last-month" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedPeriod("last-month")}
        >
          Last Month
        </Button>
        <Button 
          variant={selectedPeriod === "last-12-months" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedPeriod("last-12-months")}
        >
          Last 12 Months
        </Button>
      </div>

      {/* CEO/VC Outreach Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CEO Outreach</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{ceoLeads.length}</div>
            <p className="text-xs text-muted-foreground">Total CEO Contacts</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Conversion Rate:</span>
                <span className="font-medium">{ceoConversionRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pipeline Value:</span>
                <span className="font-medium">{formatCurrency(ceoTotalValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VC Outreach</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{vcLeads.length}</div>
            <p className="text-xs text-muted-foreground">Total VC Contacts</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Conversion Rate:</span>
                <span className="font-medium">{vcConversionRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pipeline Value:</span>
                <span className="font-medium">{formatCurrency(vcTotalValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
            <CardDescription>Monthly lead progression through pipeline stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                leads: { label: "Leads", color: "hsl(var(--chart-1))" },
                qualified: { label: "Qualified", color: "hsl(var(--chart-2))" },
                proposals: { label: "Proposals", color: "hsl(var(--chart-3))" },
                closed: { label: "Closed", color: "hsl(var(--chart-4))" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="leads" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="qualified" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  <Line type="monotone" dataKey="proposals" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  <Line type="monotone" dataKey="closed" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
            <CardDescription>Current status of all leads in pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Leads" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Database</CardTitle>
          <CardDescription>Manage and track all your leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search leads, companies, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="cold-call">Cold Call</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedOutreachType} onValueChange={setSelectedOutreachType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CEO">CEO</SelectItem>
                <SelectItem value="VC">VC</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Team Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team Members</SelectItem>
                <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                <SelectItem value="Bob Wilson">Bob Wilson</SelectItem>
                <SelectItem value="Charlie Brown">Charlie Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads Table */}
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{lead.name}</h3>
                      <Badge className={stageColors[lead.stage as keyof typeof stageColors]}>
                        {getStageLabel(lead.stage)}
                      </Badge>
                      <Badge variant="outline" className={lead.outreachType === "CEO" ? "border-blue-500 text-blue-600" : "border-purple-500 text-purple-600"}>
                        {lead.outreachType}
                      </Badge>
                      <span className="text-sm text-muted-foreground">• {lead.company}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last contact: {lead.lastContact}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Responsibility:</span>
                        <p className="text-muted-foreground">{lead.responsibility}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Next Action:</span>
                        <p className="text-muted-foreground">{lead.nextAction}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Assigned to:</span>
                        <p className="text-muted-foreground">{lead.assignedTo}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-foreground">Recommendations:</span>
                      <p className="text-sm text-muted-foreground">{lead.recommendations}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{formatCurrency(lead.value)}</div>
                      <div className="text-sm text-muted-foreground">{lead.probability}% probability</div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {lead.notes && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Notes:</strong> {lead.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No leads found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}