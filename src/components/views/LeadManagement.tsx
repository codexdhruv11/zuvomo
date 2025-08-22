import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Phone, 
  Mail,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  Upload,
  Crown
} from "lucide-react";
import { AddLeadForm } from "@/components/AddLeadForm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Comparison stats for top bar
  const comparisonStats = [
    {
      title: "New Leads",
      current: "43",
      previous: "38",
      change: "+13.2%",
      trend: "up",
      icon: Users,
      bgColor: "bg-blue-500",
      textColor: "text-white"
    },
    {
      title: "Qualified Leads", 
      current: "28",
      previous: "25",
      change: "+12.0%", 
      trend: "up",
      icon: CheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-white"
    },
    {
      title: "Pipeline Value",
      current: "$340K",
      previous: "$295K",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-emerald-500",
      textColor: "text-white"
    },
    {
      title: "Conversion Rate",
      current: "18.5%", 
      previous: "16.2%",
      change: "+2.3%",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-purple-500",
      textColor: "text-white"
    }
  ];

  // Lead data with new stages
  const [leads, setLeads] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Smith", 
      email: "john.smith@techcorp.com",
      phone: "+1 (555) 123-4567",
      company: "TechCorp Inc",
      position: "Product Demo Scheduled",
      leadType: "CEO",
      leadStatus: "warm",
      status: "Warm",
      stage: "Proposal",
      source: "linkedin",
      value: "$75,000",
      assignedTo: "Alice Johnson",
      lastContact: "2024-01-15",
      probability: "70%",
      notes: "Interested in enterprise package",
      recommendations: "Follow up on enterprise features, prepare ROI analysis"
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Davis",
      email: "sarah.davis@innovate.com", 
      phone: "+1 (555) 987-6543",
      company: "Innovate Solutions",
      position: "Contact Review",
      leadType: "VC",
      leadStatus: "hot",
      status: "Hot",
      stage: "Calls",
      source: "website",
      value: "$120,000",
      assignedTo: "Bob Wilson",
      lastContact: "2024-01-14",
      probability: "85%",
      notes: "Ready to sign, waiting for approval",
      recommendations: "Expedite legal review, prepare implementation timeline"
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@startup.com",
      phone: "+1 (555) 456-7890", 
      company: "StartupXYZ",
      position: "Initial Contact",
      leadType: "CEO",
      leadStatus: "cold",
      status: "Cold",
      stage: "Outreach",
      source: "referral",
      value: "$45,000",
      assignedTo: "Charlie Brown",
      lastContact: "2024-01-13",
      probability: "30%",
      notes: "Need to understand requirements better",
      recommendations: "Schedule discovery call, send product overview"
    }
  ]);

  const updateLeadStatus = (leadId: number, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, leadStatus: newStatus.toLowerCase() } : lead
    ));
  };

  const updateLeadStage = (leadId: number, newStage: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ));
  };

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = filterStage === 'all' || lead.stage.toLowerCase() === filterStage;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    const matchesType = filterType === 'all' || lead.leadType.toLowerCase() === filterType;
    
    return matchesSearch && matchesStage && matchesSource && matchesType;
  });

  const ceoLeads = leads.filter(lead => lead.leadType === "CEO");
  const vcLeads = leads.filter(lead => lead.leadType === "VC");

  const renderLeadCard = (lead: any) => (
    <Card key={lead.id} className="bg-gradient-card shadow-card hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="px-2 py-1 text-xs" variant={lead.leadStatus === 'qualified' ? 'default' : 'secondary'}>
                Qualified
              </Badge>
              <Badge className={`px-2 py-1 text-xs ${lead.leadType === 'CEO' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
                {lead.leadType}
              </Badge>
              <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                <SelectTrigger className="w-20 h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cold">Cold</SelectItem>
                  <SelectItem value="Warm">Warm</SelectItem>
                  <SelectItem value="Hot">Hot</SelectItem>
                </SelectContent>
              </Select>
              <Select value={lead.stage} onValueChange={(value) => updateLeadStage(lead.id, value)}>
                <SelectTrigger className="w-24 h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Outreach">Outreach</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Calls">Calls</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {lead.firstName} {lead.lastName}
            </h3>
            <p className="text-primary font-medium">{lead.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4" />
            </Button>
            <AddLeadForm 
              leadData={lead} 
              isEdit={true}
            >
              <Button size="sm" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
            </AddLeadForm>
            <Button size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{lead.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{lead.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Last contact: {lead.lastContact}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">{lead.value}</span>
            <p className="text-sm text-muted-foreground">{lead.probability} probability</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Responsibility:</p>
            <p className="font-medium text-foreground">{lead.position}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Action:</p>
            <p className="font-medium text-foreground">Schedule technical call</p>
          </div>
          <div>
            <p className="text-muted-foreground">Assigned to:</p>
            <p className="font-medium text-foreground">{lead.assignedTo}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-muted-foreground text-sm mb-2">Recommendations:</p>
          <p className="text-foreground text-sm">{lead.recommendations}</p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm mb-1">Notes:</p>
          <p className="text-foreground text-sm">{lead.notes}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Comparison Top Bar */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Lead Management</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Period Comparison</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="this-month">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="last-month">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Compare to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {comparisonStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{stat.current}</p>
                      <div className={`flex items-center gap-1 text-xs ${
                        stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                        {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                        {stat.trend === 'stable' && <Target className="h-3 w-3" />}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">vs {stat.previous}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Database with Tabs */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Lead Database</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <AddLeadForm />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, company, or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="calls">Calls</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="cold-call">Cold Call</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ceo">CEO</SelectItem>
                <SelectItem value="vc">VC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Leads ({leads.length})</TabsTrigger>
              <TabsTrigger value="ceo">CEO Leads ({ceoLeads.length})</TabsTrigger>
              <TabsTrigger value="vc">VC Leads ({vcLeads.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredLeads.map((lead) => renderLeadCard(lead))}
            </TabsContent>
            
            <TabsContent value="ceo" className="space-y-4">
              {ceoLeads.filter(lead => 
                (filterStage === 'all' || lead.stage.toLowerCase() === filterStage) &&
                (filterSource === 'all' || lead.source === filterSource) &&
                (lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((lead) => renderLeadCard(lead))}
            </TabsContent>
            
            <TabsContent value="vc" className="space-y-4">
              {vcLeads.filter(lead => 
                (filterStage === 'all' || lead.stage.toLowerCase() === filterStage) &&
                (filterSource === 'all' || lead.source === filterSource) &&
                (lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((lead) => renderLeadCard(lead))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}