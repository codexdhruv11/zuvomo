import React, { useState, useMemo, useEffect } from "react";
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
  PieChart as PieChartIcon,
  Loader2
} from "lucide-react";
import { AddLeadForm } from "@/components/AddLeadForm";
import { LoadingAnimatedLogo } from "@/components/LoadingAnimatedLogo";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { googleSheetsService, LeadData } from "@/services/googleSheets";
import { initializeGoogleSheetsWithData, checkIfDataExists } from "@/utils/seedData";
import { useToast } from "@/hooks/use-toast";

// Data now loaded from Google Sheets via state management

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
  "new": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "contacted": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  "qualified": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "proposal": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "negotiation": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "closed-won": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "closed-lost": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "outreach": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "calls": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "closed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const statusColors = {
  "cold": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "warm": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "hot": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

export default function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedOutreachType, setSelectedOutreachType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("last-month");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [selectedProjectStages, setSelectedProjectStages] = useState<string[]>([]);
  const [selectedLeadTypes, setSelectedLeadTypes] = useState<string[]>([]);
  const [selectedConversionRange, setSelectedConversionRange] = useState("all");
  const [selectedContactStatus, setSelectedContactStatus] = useState<string[]>([]);
  const [selectedProposalStatus, setSelectedProposalStatus] = useState<string[]>([]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("all");
  const [editingLead, setEditingLead] = useState<any>(null);
  
  // Google Sheets integration
  const [leadData, setLeadData] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  // Load data from Google Sheets
  const loadLeadsData = async () => {
    try {
      setIsLoading(true);
      await googleSheetsService.autoInitialize();
      const leads = await googleSheetsService.getLeads();
      setLeadData(leads);
    } catch (error) {
      console.error('Failed to load leads:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load leads from Google Sheets. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Sheets with seed data
  const initializeWithSeedData = async () => {
    try {
      setIsInitializing(true);
      const hasData = await checkIfDataExists();
      
      if (!hasData) {
        await initializeGoogleSheetsWithData();
        toast({
          title: "Data Initialized",
          description: "Google Sheets has been set up with sample lead data.",
        });
      }
      
      await loadLeadsData();
    } catch (error) {
      console.error('Failed to initialize:', error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize Google Sheets. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    initializeWithSeedData();
  }, []);

  // Filter options
  const teamMembers = ["Alice Johnson", "Bob Wilson", "Charlie Brown"];
  const projectStages = ["Outreach", "Proposal", "Calls", "Closed"];
  const leadTypes = ["CEO", "VC", "Partner"];
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
      const matchesOutreachType = selectedOutreachType === "all" || lead.contactType === selectedOutreachType;
      const matchesLeadStatus = selectedLeadStatus === "all" || lead.leadStatus === selectedLeadStatus;

      return matchesSearch && matchesStage && matchesSource && matchesAssignee && matchesOutreachType && matchesLeadStatus;
    });
  }, [searchTerm, selectedStage, selectedSource, selectedAssignee, selectedOutreachType, selectedLeadStatus, leadData]);

  // Calculate metrics
  const totalLeads = leadData.length;
  const qualifiedLeads = leadData.filter(lead => ["qualified", "proposal", "negotiation", "closed-won"].includes(lead.stage)).length;
  const totalValue = leadData.reduce((sum, lead) => sum + lead.value, 0);
  const avgDealSize = totalValue / totalLeads;
  const conversionRate = (leadData.filter(lead => lead.stage === "closed-won").length / totalLeads * 100).toFixed(1);
  
  // CEO/VC specific metrics
  const ceoLeads = leadData.filter(lead => lead.contactType === "CEO");
  const vcLeads = leadData.filter(lead => lead.contactType === "VC");
  const ceoConversionRate = ceoLeads.length > 0 ? (ceoLeads.filter(lead => lead.stage === "closed-won").length / ceoLeads.length * 100).toFixed(1) : "0";
  const vcConversionRate = vcLeads.length > 0 ? (vcLeads.filter(lead => lead.stage === "closed-won").length / vcLeads.length * 100).toFixed(1) : "0";
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

  // Handler functions for CRUD operations
  const handleDeleteLead = async (leadIndex: number, leadName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${leadName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await googleSheetsService.deleteLead(leadIndex);
      toast({
        title: "Lead Deleted",
        description: `${leadName} has been deleted from your pipeline and Google Sheets.`,
      });
      await loadLeadsData(); // Refresh data
    } catch (error) {
      console.error('Failed to delete lead:', error);
      toast({
        title: "Error Deleting Lead",
        description: "Failed to delete lead from Google Sheets. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateLeadStatus = async (leadIndex: number, newStatus: string) => {
    try {
      await googleSheetsService.updateLeadField(leadIndex, 'leadStatus', newStatus);
      toast({
        title: "Status Updated",
        description: `Lead status updated to ${newStatus}.`,
      });
      await loadLeadsData(); // Refresh data
    } catch (error) {
      console.error('Failed to update lead status:', error);
      toast({
        title: "Error Updating Status",
        description: "Failed to update lead status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProjectStage = async (leadIndex: number, newStage: string) => {
    try {
      await googleSheetsService.updateLeadField(leadIndex, 'projectStage', newStage);
      toast({
        title: "Stage Updated",
        description: `Project stage updated to ${newStage}.`,
      });
      await loadLeadsData(); // Refresh data
    } catch (error) {
      console.error('Failed to update project stage:', error);
      toast({
        title: "Error Updating Stage",
        description: "Failed to update project stage. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading || isInitializing) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <LoadingAnimatedLogo 
                className="w-20 h-20"
                size={80}
                showProgress={true}
                progress={75}
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-1">
                {isInitializing ? "Setting up Google Sheets..." : "Loading your leads..."}
              </p>
              <p className="text-sm text-muted-foreground">
                {isInitializing 
                  ? "Preparing your lead management system" 
                  : "Fetching data from Google Sheets"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Track and manage your sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedLeadStatus} onValueChange={setSelectedLeadStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Lead Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <AddLeadForm 
            editLead={editingLead} 
            editIndex={editingLead ? leadData.findIndex(lead => lead === editingLead) : undefined}
            onClose={() => setEditingLead(null)}
            onLeadUpdated={loadLeadsData}
          >
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </AddLeadForm>
        </div>
      </div>

      {/* Date Range and Filters */}
      <div className="space-y-4 mb-6">
        {/* Date Range Dropdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Team Members Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </label>
            <Select value={selectedTeamMembers[0] || "all"} onValueChange={(value) => setSelectedTeamMembers(value === "all" ? [] : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member}>{member}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Stage Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Project Stage
            </label>
            <Select value={selectedProjectStages[0] || "all"} onValueChange={(value) => setSelectedProjectStages(value === "all" ? [] : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {projectStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lead Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Lead Type
            </label>
            <Select value={selectedLeadTypes[0] || "all"} onValueChange={(value) => setSelectedLeadTypes(value === "all" ? [] : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {leadTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conversion % Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Conversion %
            </label>
            <Select value={selectedConversionRange} onValueChange={setSelectedConversionRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Ranges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                {conversionRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Status
            </label>
            <Select value={selectedContactStatus[0] || "all"} onValueChange={(value) => setSelectedContactStatus(value === "all" ? [] : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {contactStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Proposals Sent Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Proposals Sent
            </label>
            <Select value={selectedProposalStatus[0] || "all"} onValueChange={(value) => setSelectedProposalStatus(value === "all" ? [] : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="All Proposals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Proposals</SelectItem>
                {proposalStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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

      {/* Visual Trends */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground">Visual Analytics</h2>
        
        {/* Two-column layout for charts with proper spacing */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Monthly Trends */}
          <Card className="bg-gradient-card min-h-[500px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary">Monthly Trends</CardTitle>
              <CardDescription>Revenue, leads, and conversion trends over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full h-[400px]">
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "hsl(var(--primary))" },
                    leads: { label: "Leads", color: "hsl(var(--chart-2))" },
                    conversions: { label: "Conversions", color: "hsl(var(--chart-3))" }
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="leads" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="conversions" stackId="3" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Trends */}
          <Card className="bg-gradient-card min-h-[500px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary">Platform Performance</CardTitle>
              <CardDescription>Lead generation and revenue by platform</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full h-[400px]">
                <ChartContainer
                  config={{
                    leads: { label: "Leads", color: "hsl(var(--primary))" },
                    revenue: { label: "Revenue", color: "hsl(var(--accent))" }
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformTrends} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="platform" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="leads" fill="hsl(var(--primary))" />
                      <Bar dataKey="revenue" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trends */}
          <Card className="bg-gradient-card min-h-[500px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary">Revenue Trends by Lead Type</CardTitle>
              <CardDescription>CEO vs VC revenue performance over quarters</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full h-[400px]">
                <ChartContainer
                  config={{
                    ceo: { label: "CEO Revenue", color: "hsl(var(--primary))" },
                    vc: { label: "VC Revenue", color: "hsl(var(--accent))" }
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueTrends} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="quarter" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="ceo" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))" }} />
                      <Line type="monotone" dataKey="vc" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ fill: "hsl(var(--accent))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lead Status Distribution */}
          <Card className="bg-gradient-card min-h-[500px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary">Lead Status Distribution</CardTitle>
              <CardDescription>Current status of all leads in pipeline</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full h-[400px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: { label: "Leads" }
                  }}
                  className="w-full h-full"
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
              </div>
            </CardContent>
          </Card>
        </div>
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
            {filteredLeads.map((lead, filteredIndex) => {
              const originalIndex = leadData.findIndex(l => l.email === lead.email && l.name === lead.name);
              return (
              <div key={`${lead.email}-${filteredIndex}`} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{lead.name}</h3>
                      <Badge className={stageColors[lead.stage as keyof typeof stageColors]}>
                        {getStageLabel(lead.stage)}
                      </Badge>
                      <Badge variant="outline" className={lead.contactType === "CEO" ? "border-blue-500 text-blue-600" : "border-purple-500 text-purple-600"}>
                        {lead.contactType}
                      </Badge>
                      <Badge className={statusColors[lead.leadStatus as keyof typeof statusColors]}>
                        {lead.leadStatus?.charAt(0).toUpperCase() + lead.leadStatus?.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="border-gray-400 text-gray-600">
                        {lead.projectStage}
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
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs">
                                Status: {lead.leadStatus?.charAt(0).toUpperCase() + lead.leadStatus?.slice(1)}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-popover border border-border shadow-md">
                              <DropdownMenuItem onClick={() => handleUpdateLeadStatus(originalIndex, 'cold')}>Cold</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateLeadStatus(originalIndex, 'warm')}>Warm</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateLeadStatus(originalIndex, 'hot')}>Hot</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs">
                                Stage: {lead.projectStage}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-popover border border-border shadow-md">
                              <DropdownMenuItem onClick={() => handleUpdateProjectStage(originalIndex, 'Outreach')}>Outreach</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateProjectStage(originalIndex, 'Proposal')}>Proposal</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateProjectStage(originalIndex, 'Calls')}>Calls</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateProjectStage(originalIndex, 'Closed')}>Closed</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                           <Button variant="ghost" size="sm" onClick={() => setEditingLead(lead)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteLead(originalIndex, lead.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
            })}
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