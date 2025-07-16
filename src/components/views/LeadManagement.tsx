import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Plus, 
  Building, 
  Calendar, 
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  Target,
  Briefcase,
  Crown,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Send,
  UserCheck,
  FileCheck,
  Bell,
  MessageCircle,
  Folder,
  Star,
  SlidersHorizontal,
  Globe
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from "recharts";

// Mock data for VC leads
const vcLeads = [
  {
    id: 1,
    name: "Sarah Chen",
    company: "Sequoia Capital",
    industry: "Technology",
    stage: "contact",
    platforms: ["LinkedIn", "Email"],
    dateContacted: "2024-01-15",
    responsible: "John Doe",
    score: 85,
    status: "hot",
    nextFollowUp: "2024-01-20",
    notes: "Very interested in B2B SaaS. Mentioned they're looking for Series A opportunities."
  },
  {
    id: 2,
    name: "Michael Torres",
    company: "Andreessen Horowitz",
    industry: "FinTech",
    stage: "call_scheduled",
    platforms: ["Reference", "LinkedIn"],
    dateContacted: "2024-01-12",
    responsible: "Jane Smith",
    score: 92,
    status: "hot",
    nextFollowUp: "2024-01-18",
    notes: "Scheduled call for demo. Very responsive and engaged."
  },
  {
    id: 3,
    name: "Lisa Wang",
    company: "Kleiner Perkins",
    industry: "Healthcare",
    stage: "follow_up",
    platforms: ["Email", "Website Form"],
    dateContacted: "2024-01-10",
    responsible: "Bob Johnson",
    score: 68,
    status: "warm",
    nextFollowUp: "2024-01-25",
    notes: "Interested but wants to see more traction metrics."
  }
];

// Mock data for CEO leads
const ceoLeads = [
  {
    id: 1,
    name: "David Kim",
    company: "TechCorp Inc",
    industry: "Technology",
    stage: "contact",
    platforms: ["Upwork", "LinkedIn"],
    dateContacted: "2024-01-14",
    responsible: "Alice Brown",
    score: 78,
    status: "warm",
    nextFollowUp: "2024-01-21",
    notes: "CEO of mid-size company looking for digital transformation."
  },
  {
    id: 2,
    name: "Emma Rodriguez",
    company: "GreenTech Solutions",
    industry: "CleanTech",
    stage: "proposal_sent",
    platforms: ["Website Form", "Email"],
    dateContacted: "2024-01-08",
    responsible: "Charlie Davis",
    score: 88,
    status: "hot",
    nextFollowUp: "2024-01-19",
    notes: "Proposal sent for sustainability consulting. Very engaged."
  },
  {
    id: 3,
    name: "James Wilson",
    company: "HealthFirst",
    industry: "Healthcare",
    stage: "onboarding",
    platforms: ["LinkedIn", "Telegram"],
    dateContacted: "2024-01-05",
    responsible: "Diana Evans",
    score: 95,
    status: "hot",
    nextFollowUp: "2024-01-16",
    notes: "Deal closed! Starting onboarding process."
  }
];

// Pipeline data for charts
const vcPipelineData = [
  { stage: "Contact VC", count: 25, color: "#3B82F6" },
  { stage: "Call Scheduled", count: 18, color: "#10B981" },
  { stage: "Follow-up", count: 12, color: "#F59E0B" },
  { stage: "Announcement", count: 8, color: "#EF4444" }
];

const ceoPipelineData = [
  { stage: "Contact CEO", count: 30, color: "#8B5CF6" },
  { stage: "Call Scheduled", count: 22, color: "#06B6D4" },
  { stage: "Proposal Sent", count: 15, color: "#84CC16" },
  { stage: "Onboarding", count: 9, color: "#F97316" }
];

const platformData = [
  { platform: "LinkedIn", vcCount: 45, ceoCount: 38, color: "#0077B5" },
  { platform: "Email", vcCount: 32, ceoCount: 41, color: "#EA4335" },
  { platform: "Upwork", vcCount: 8, ceoCount: 28, color: "#6FDA44" },
  { platform: "Website Form", vcCount: 15, ceoCount: 22, color: "#FF6B6B" },
  { platform: "Telegram", vcCount: 12, ceoCount: 18, color: "#0088CC" },
  { platform: "Reference", vcCount: 18, ceoCount: 12, color: "#9C27B0" }
];

const performanceData = [
  { name: "John Doe", contacted: 45, scheduled: 32, proposals: 18, closed: 12 },
  { name: "Jane Smith", contacted: 38, scheduled: 28, proposals: 22, closed: 15 },
  { name: "Bob Johnson", contacted: 42, scheduled: 25, proposals: 15, closed: 8 },
  { name: "Alice Brown", contacted: 35, scheduled: 22, proposals: 20, closed: 14 }
];

export function LeadManagement() {
  const [activeTab, setActiveTab] = useState("vc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [showFloatingFilter, setShowFloatingFilter] = useState(false);

  // Platform icons mapping
  const platformIcons = {
    LinkedIn: Globe,
    Email: Mail,
    Telegram: MessageSquare,
    Discord: MessageSquare,
    Reference: Users,
    "Website Form": Globe,
    "Zuvomo Lead": Target,
    Upwork: Briefcase
  };

  // Filtered leads based on active tab
  const currentLeads = activeTab === "vc" ? vcLeads : ceoLeads;
  const filteredLeads = currentLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-red-500";
      case "warm": return "bg-yellow-500";
      case "cold": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "contact": return "bg-blue-100 text-blue-800";
      case "call_scheduled": return "bg-green-100 text-green-800";
      case "proposal_sent": return "bg-purple-100 text-purple-800";
      case "onboarding": return "bg-emerald-100 text-emerald-800";
      case "follow_up": return "bg-yellow-100 text-yellow-800";
      case "announcement": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStage = (stage: string) => {
    return stage.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Manage VC and CEO outreach campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 p-1">
          <TabsTrigger 
            value="vc" 
            className="flex items-center gap-2 h-full data-[state=active]:bg-purple-500 data-[state=active]:text-white font-medium"
          >
            <Crown className="h-4 w-4" />
            VC Outreach
          </TabsTrigger>
          <TabsTrigger 
            value="ceo" 
            className="flex items-center gap-2 h-full data-[state=active]:bg-indigo-500 data-[state=active]:text-white font-medium"
          >
            <Briefcase className="h-4 w-4" />
            CEO Outreach
          </TabsTrigger>
        </TabsList>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 items-center py-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Stages</option>
            <option value="Contact">Contact</option>
            <option value="Call Scheduled">Call Scheduled</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Proposal Sent">Proposal Sent</option>
          </select>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Platforms</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Email">Email</option>
            <option value="Telegram">Telegram</option>
            <option value="Discord">Discord</option>
            <option value="Reference">Reference</option>
            <option value="Website Form">Website Form</option>
            <option value="Zuvomo Lead">Zuvomo Lead</option>
            <option value="Upwork">Upwork</option>
          </select>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFloatingFilter(!showFloatingFilter)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
        </div>

        {/* Floating Filter */}
        {showFloatingFilter && (
          <div className="fixed top-20 right-4 z-50 bg-white border rounded-lg shadow-lg p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Advanced Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFloatingFilter(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All Time</option>
                  <option value="Last Week">Last Week</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Last 12 Months">Last 12 Months</option>
                  <option value="Custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Team Member</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All Team Members</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Sarah Wilson">Sarah Wilson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="date">Date Added</option>
                  <option value="name">Name</option>
                  <option value="stage">Stage</option>
                  <option value="platform">Platform</option>
                </select>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        )}

        <TabsContent value="vc" className="space-y-6">
          {/* VC Pipeline Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  VC Pipeline
                </CardTitle>
                <CardDescription>Current stage distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={vcPipelineData}>
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
                <CardDescription>VC leads by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    vcCount: {
                      label: "VC Count",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformData}>
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="vcCount" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* VC Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                VC Leads
              </CardTitle>
              <CardDescription>Active VC outreach campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search VCs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="contact">Contact VC</SelectItem>
                    <SelectItem value="call_scheduled">Call Scheduled</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{lead.name}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">{lead.score}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {lead.company}
                          </span>
                          <span>{lead.industry}</span>
                          <span>By {lead.responsible}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getStageColor(lead.stage)}>
                            {formatStage(lead.stage)}
                          </Badge>
                           <div className="flex gap-1">
                             {lead.platforms.map((platform, index) => {
                               const IconComponent = platformIcons[platform] || Globe;
                               return (
                                 <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                                   <IconComponent className="h-3 w-3" />
                                   {platform}
                                 </Badge>
                               );
                             })}
                           </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{lead.notes}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ceo" className="space-y-6">
          {/* CEO Pipeline Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  CEO Pipeline
                </CardTitle>
                <CardDescription>Current stage distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ceoPipelineData}>
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
                <CardDescription>CEO leads by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ceoCount: {
                      label: "CEO Count",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformData}>
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="ceoCount" fill="#F97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* CEO Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                CEO Leads
              </CardTitle>
              <CardDescription>Active CEO outreach campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search CEOs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="contact">Contact CEO</SelectItem>
                    <SelectItem value="call_scheduled">Call Scheduled</SelectItem>
                    <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{lead.name}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">{lead.score}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {lead.company}
                          </span>
                          <span>{lead.industry}</span>
                          <span>By {lead.responsible}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getStageColor(lead.stage)}>
                            {formatStage(lead.stage)}
                          </Badge>
                           <div className="flex gap-1">
                             {lead.platforms.map((platform, index) => {
                               const IconComponent = platformIcons[platform] || Globe;
                               return (
                                 <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                                   <IconComponent className="h-3 w-3" />
                                   {platform}
                                 </Badge>
                               );
                             })}
                           </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{lead.notes}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Performance
          </CardTitle>
          <CardDescription>Individual performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              contacted: {
                label: "Contacted",
                color: "hsl(var(--chart-1))",
              },
              scheduled: {
                label: "Scheduled",
                color: "hsl(var(--chart-2))",
              },
              proposals: {
                label: "Proposals",
                color: "hsl(var(--chart-3))",
              },
              closed: {
                label: "Closed",
                color: "hsl(var(--chart-4))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="contacted" fill="#3B82F6" />
                <Bar dataKey="scheduled" fill="#10B981" />
                <Bar dataKey="proposals" fill="#F59E0B" />
                <Bar dataKey="closed" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}