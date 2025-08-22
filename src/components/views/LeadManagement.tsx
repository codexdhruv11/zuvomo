import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Upload,
  CalendarDays,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { AddLeadForm } from "@/components/AddLeadForm";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

// Sample lead data with CEO/VC outreach info
const leadData = [
  {
    id: 1,
    name: "John Smith",
    company: "TechCorp Inc",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    stage: "proposal",
    leadStatus: "hot",
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
    stage: "calls",
    leadStatus: "hot",
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
    stage: "outreach",
    leadStatus: "warm",
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
    stage: "calls",
    leadStatus: "warm",
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
    stage: "closed",
    leadStatus: "hot",
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
    stage: "proposal",
    leadStatus: "hot",
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
    stage: "outreach",
    leadStatus: "cold",
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
    stage: "calls",
    leadStatus: "warm",
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

// Monthly trends data
const monthlyTrends = [
  { month: "Jan", revenue: 850000, leads: 45, conversions: 8 },
  { month: "Feb", revenue: 1200000, leads: 52, conversions: 12 },
  { month: "Mar", revenue: 950000, leads: 48, conversions: 10 },
  { month: "Apr", revenue: 1425000, leads: 61, conversions: 15 },
  { month: "May", revenue: 1330000, leads: 55, conversions: 14 },
  { month: "Jun", revenue: 1710000, leads: 67, conversions: 18 }
];

// Platform trends data
const platformTrends = [
  { platform: "LinkedIn", leads: 95, revenue: 2850000, growth: 15.2 },
  { platform: "Website", leads: 78, revenue: 2340000, growth: 8.7 },
  { platform: "Referrals", leads: 64, revenue: 1920000, growth: 22.1 },
  { platform: "Cold Email", leads: 45, revenue: 1350000, growth: -3.2 },
  { platform: "Events", leads: 32, revenue: 960000, growth: 11.8 }
];

// Revenue trends data
const revenueTrends = [
  { quarter: "Q1 2023", ceo: 2100000, vc: 1800000 },
  { quarter: "Q2 2023", ceo: 2450000, vc: 2200000 },
  { quarter: "Q3 2023", ceo: 2800000, vc: 2650000 },
  { quarter: "Q4 2023", ceo: 3200000, vc: 3100000 },
  { quarter: "Q1 2024", ceo: 3650000, vc: 3500000 }
];

const sourceData = [
  { name: "Website", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Referral", value: 25, color: "hsl(var(--chart-2))" },
  { name: "LinkedIn", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Cold Call", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" }
];

const stageColors = {
  "outreach": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "proposal": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300", 
  "calls": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "closed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const statusColors = {
  "cold": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "warm": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  "hot": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

export default function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedOutreachType, setSelectedOutreachType] = useState("all");
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("last-month");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [selectedProjectStages, setSelectedProjectStages] = useState<string[]>([]);
  const [selectedLeadTypes, setSelectedLeadTypes] = useState<string[]>([]);
  const [selectedConversionRange, setSelectedConversionRange] = useState("all");
  const [selectedContactStatus, setSelectedContactStatus] = useState<string[]>([]);
  const [selectedProposalStatus, setSelectedProposalStatus] = useState<string[]>([]);
  const [editingLead, setEditingLead] = useState<number | null>(null);

  // Filter options
  const teamMembers = ["Alice Johnson", "Bob Wilson", "Charlie Brown"];
  const projectStages = ["Outreach", "Proposal", "Calls", "Closed"];
  const leadTypes = ["CEO", "VC"];
  const leadStatuses = ["Cold", "Warm", "Hot"];
  const conversionRanges = [
    { label: "0-25%", value: "0-25" },
    { label: "26-50%", value: "26-50" },
    { label: "51-75%", value: "51-75" },
    { label: "76-100%", value: "76-100" }
  ];
  const contactStatuses = ["Contacted", "Not Contacted", "Follow-up Needed"];
  const proposalStatuses = ["Sent", "Not Sent", "Under Review"];

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
      const matchesLeadStatus = selectedLeadStatus === "all" || lead.leadStatus === selectedLeadStatus;

      return matchesSearch && matchesStage && matchesSource && matchesAssignee && matchesOutreachType && matchesLeadStatus;
    });
  }, [searchTerm, selectedStage, selectedSource, selectedAssignee, selectedOutreachType, selectedLeadStatus]);

  // Calculate metrics
  const totalLeads = leadData.length;
  const qualifiedLeads = leadData.filter(lead => ["proposal", "calls", "closed"].includes(lead.stage)).length;
  const totalValue = leadData.reduce((sum, lead) => sum + lead.value, 0);
  const avgDealSize = totalValue / totalLeads;
  const conversionRate = (leadData.filter(lead => lead.stage === "closed").length / totalLeads * 100).toFixed(1);
  
  // CEO/VC specific metrics
  const ceoLeads = leadData.filter(lead => lead.outreachType === "CEO");
  const vcLeads = leadData.filter(lead => lead.outreachType === "VC");
  const ceoConversionRate = (ceoLeads.filter(lead => lead.stage === "closed").length / ceoLeads.length * 100).toFixed(1);
  const vcConversionRate = (vcLeads.filter(lead => lead.stage === "closed").length / vcLeads.length * 100).toFixed(1);
  const ceoTotalValue = ceoLeads.reduce((sum, lead) => sum + lead.value, 0);
  const vcTotalValue = vcLeads.reduce((sum, lead) => sum + lead.value, 0);
  
  // Status distribution for pie chart
  const statusData = [
    { name: "Outreach", value: leadData.filter(lead => lead.stage === "outreach").length, color: "hsl(var(--chart-1))" },
    { name: "Proposal", value: leadData.filter(lead => lead.stage === "proposal").length, color: "hsl(var(--chart-2))" },
    { name: "Calls", value: leadData.filter(lead => lead.stage === "calls").length, color: "hsl(var(--chart-3))" },
    { name: "Closed", value: leadData.filter(lead => lead.stage === "closed").length, color: "hsl(var(--chart-4))" }
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
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  const handleQuickEdit = (leadId: number, field: string, value: string) => {
    // Here you would update the lead in your data source
    console.log(`Updating lead ${leadId}: ${field} = ${value}`);
  };

  const renderLeadCard = (lead: any) => (
    <div key={lead.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground">{lead.name}</h3>
            {/* Quick Edit Stage */}
            <Select value={lead.stage} onValueChange={(value) => handleQuickEdit(lead.id, 'stage', value)}>
              <SelectTrigger className="w-32 h-6">
                <Badge className={stageColors[lead.stage as keyof typeof stageColors]}>
                  {getStageLabel(lead.stage)}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="calls">Calls</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            {/* Quick Edit Lead Status */}
            <Select value={lead.leadStatus} onValueChange={(value) => handleQuickEdit(lead.id, 'leadStatus', value)}>
              <SelectTrigger className="w-20 h-6">
                <Badge className={statusColors[lead.leadStatus as keyof typeof statusColors]}>
                  {lead.leadStatus?.charAt(0).toUpperCase() + lead.leadStatus?.slice(1)}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
              </SelectContent>
            </Select>
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
            <Button variant="ghost" size="sm" onClick={() => setEditingLead(lead.id)}>
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
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage your sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Lead Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedLeadStatus("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedLeadStatus("hot")}>Hot</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedLeadStatus("warm")}>Warm</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedLeadStatus("cold")}>Cold</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <AddLeadForm>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </AddLeadForm>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {qualifiedLeads} qualified leads
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(avgDealSize)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              CEO: {ceoConversionRate}% | VC: {vcConversionRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Split</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ceoTotalValue + vcTotalValue)}</div>
            <p className="text-xs text-muted-foreground">
              CEO: {formatCurrency(ceoTotalValue)} | VC: {formatCurrency(vcTotalValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Lead Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
            <CardDescription>Current pipeline breakdown by stage</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={{
                outreach: {
                  label: "Outreach",
                  color: "hsl(var(--chart-1))",
                },
                proposal: {
                  label: "Proposal",
                  color: "hsl(var(--chart-2))",
                },
                calls: {
                  label: "Calls", 
                  color: "hsl(var(--chart-3))",
                },
                closed: {
                  label: "Closed",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="var(--color-outreach)"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Lead conversion funnel over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                leads: {
                  label: "Total Leads",
                  color: "hsl(var(--chart-1))",
                },
                qualified: {
                  label: "Qualified",
                  color: "hsl(var(--chart-2))",
                },
                proposals: {
                  label: "Proposals",
                  color: "hsl(var(--chart-3))",
                },
                closed: {
                  label: "Closed Won",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="var(--color-leads)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-leads)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qualified"
                    stroke="var(--color-qualified)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-qualified)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="proposals"
                    stroke="var(--color-proposals)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-proposals)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="closed"
                    stroke="var(--color-closed)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-closed)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>CEO vs VC outreach performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                ceo: {
                  label: "CEO Outreach",
                  color: "hsl(var(--chart-1))",
                },
                vc: {
                  label: "VC Outreach", 
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: any) => [formatCurrency(value), ""]}
                  />
                  <Bar dataKey="ceo" fill="var(--color-ceo)" />
                  <Bar dataKey="vc" fill="var(--color-vc)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Source Performance</CardTitle>
            <CardDescription>Revenue generation by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-3))",
                },
                growth: {
                  label: "Growth %",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={platformTrends}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: any, name: any) => [
                      name === "revenue" ? formatCurrency(value) : `${value}%`,
                      name === "revenue" ? "Revenue" : "Growth"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fillOpacity={1}
                    fill="url(#fillRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lead Management Tabs */}
      <Tabs defaultValue="ceo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ceo">CEO Lead Management</TabsTrigger>
          <TabsTrigger value="vc">VC Lead Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ceo" className="space-y-6">
          {/* CEO Lead Database */}
          <Card>
            <CardHeader>
              <CardTitle>CEO Lead Database</CardTitle>
              <CardDescription>Manage and track all your CEO leads</CardDescription>
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
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="calls">Calls</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
              </div>

              {/* CEO Leads */}
              <div className="space-y-4">
                {filteredLeads.filter(lead => lead.outreachType === "CEO").map(renderLeadCard)}
              </div>

              {filteredLeads.filter(lead => lead.outreachType === "CEO").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No CEO leads found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vc" className="space-y-6">
          {/* VC Lead Database */}
          <Card>
            <CardHeader>
              <CardTitle>VC Lead Database</CardTitle>
              <CardDescription>Manage and track all your VC leads</CardDescription>
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
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="calls">Calls</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
              </div>

              {/* VC Leads */}
              <div className="space-y-4">
                {filteredLeads.filter(lead => lead.outreachType === "VC").map(renderLeadCard)}
              </div>

              {filteredLeads.filter(lead => lead.outreachType === "VC").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No VC leads found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
