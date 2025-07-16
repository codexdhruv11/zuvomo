import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowDownRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export function Overview() {
  // Enhanced metrics data matching the reference dashboard
  const stats = [
    {
      title: "Total Leads Contacted",
      value: "247",
      change: "+12%",
      changeType: "increase",
      icon: Target,
      bgColor: "bg-blue-500",
      textColor: "text-white"
    },
    {
      title: "CEOs Engaged",
      value: "156", 
      change: "+8%",
      changeType: "increase",
      icon: Users,
      bgColor: "bg-purple-500",
      textColor: "text-white"
    },
    {
      title: "Proposals Sent",
      value: "43",
      change: "+23%",
      changeType: "increase", 
      icon: Mail,
      bgColor: "bg-green-500",
      textColor: "text-white"
    },
    {
      title: "Calls Scheduled",
      value: "28",
      change: "+15%",
      changeType: "increase",
      icon: Phone,
      bgColor: "bg-orange-500", 
      textColor: "text-white"
    }
  ];

  // Daily outreach activity data
  const dailyActivity = [
    { day: 'Mon', calls: 12, emails: 8 },
    { day: 'Tue', calls: 15, emails: 12 },
    { day: 'Wed', calls: 8, emails: 15 },
    { day: 'Thu', calls: 20, emails: 10 },
    { day: 'Fri', calls: 18, emails: 18 },
  ];

  // Service demand distribution data
  const serviceDemand = [
    { name: 'Advisory', value: 35, color: '#3B82F6' },
    { name: 'Marketing', value: 25, color: '#8B5CF6' },
    { name: 'Fundraising', value: 30, color: '#10B981' },
    { name: 'Combined', value: 10, color: '#F59E0B' },
  ];

  // Recent high-value leads
  const recentLeads = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "hot",
      source: "Website",
      value: "$15,000",
      priority: "high"
    },
    {
      id: 2,
      name: "Mike Chen",
      company: "StartupXYZ",
      email: "mike@startupxyz.com", 
      phone: "+1 (555) 987-6543",
      status: "warm",
      source: "LinkedIn",
      value: "$8,500",
      priority: "medium"
    },
    {
      id: 3,
      name: "Emma Wilson",
      company: "Enterprise Solutions",
      email: "emma@enterprise.com",
      phone: "+1 (555) 456-7890", 
      status: "cold",
      source: "Referral",
      value: "$25,000",
      priority: "high"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-red-500 text-white";
      case "warm": return "bg-yellow-500 text-white";
      case "cold": return "bg-blue-500 text-white";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Dashboard</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Wednesday, July 16, 2025</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            Profile
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-0 shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${stat.textColor} opacity-90`}>
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <h3 className={`text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className={`h-4 w-4 ${stat.textColor}`} />
                    ) : (
                      <ArrowDownRight className={`h-4 w-4 ${stat.textColor}`} />
                    )}
                    <span className={`text-sm ${stat.textColor} opacity-90`}>
                      {stat.change} from last week
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-white/10`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Outreach Activity Chart */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Daily Outreach Activity</CardTitle>
            <CardDescription>Calls and emails sent this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="calls" fill="#3B82F6" name="Calls" />
                <Bar dataKey="emails" fill="#8B5CF6" name="Emails" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Demand Distribution */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Service Demand Distribution</CardTitle>
            <CardDescription>Distribution of service requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDemand}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {serviceDemand.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Leads */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">High Priority Leads</CardTitle>
          <CardDescription>Focus on these high-value prospects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getPriorityColor(lead.priority)}>
                    {lead.priority.toUpperCase()} PRIORITY
                  </Badge>
                  
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.toUpperCase()}
                  </Badge>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">{lead.value}</p>
                    <p className="text-xs text-muted-foreground">via {lead.source}</p>
                  </div>

                  <Button size="sm" className="bg-gradient-primary">
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card cursor-pointer hover:shadow-glow transition-all group">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-foreground mb-2">Schedule Follow-ups</CardTitle>
            <CardDescription>Set automated reminders for important leads</CardDescription>
            <Button className="mt-4 w-full bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card cursor-pointer hover:shadow-glow transition-all group">
          <CardContent className="p-6 text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-foreground mb-2">Send Campaigns</CardTitle>
            <CardDescription>Create targeted email marketing campaigns</CardDescription>
            <Button className="mt-4 w-full bg-gradient-primary">
              <Mail className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card cursor-pointer hover:shadow-glow transition-all group">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-foreground mb-2">View Analytics</CardTitle>
            <CardDescription>Deep dive into your sales performance</CardDescription>
            <Button className="mt-4 w-full bg-gradient-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}