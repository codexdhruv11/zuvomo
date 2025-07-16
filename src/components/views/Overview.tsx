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
  Plus
} from "lucide-react";

export function Overview() {
  // Mock data - will be replaced with real data from Google Sheets
  const stats = [
    {
      title: "Total Leads",
      value: "1,234",
      change: "+12.5%",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "Active Contacts",
      value: "856",
      change: "+8.2%",
      icon: Users,
      color: "text-success"
    },
    {
      title: "Monthly Revenue",
      value: "$89,432",
      change: "+23.1%",
      icon: DollarSign,
      color: "text-warning"
    },
    {
      title: "Conversion Rate",
      value: "18.3%",
      change: "+2.4%",
      icon: TrendingUp,
      color: "text-accent"
    }
  ];

  const recentLeads = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "hot",
      source: "Website",
      value: "$15,000"
    },
    {
      id: 2,
      name: "Mike Chen",
      company: "StartupXYZ",
      email: "mike@startupxyz.com", 
      phone: "+1 (555) 987-6543",
      status: "warm",
      source: "LinkedIn",
      value: "$8,500"
    },
    {
      id: 3,
      name: "Emma Wilson",
      company: "Enterprise Solutions",
      email: "emma@enterprise.com",
      phone: "+1 (555) 456-7890", 
      status: "cold",
      source: "Referral",
      value: "$25,000"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-destructive text-destructive-foreground";
      case "warm": return "bg-warning text-warning-foreground";
      case "cold": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Leads</CardTitle>
          <CardDescription>Your latest potential customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.toUpperCase()}
                  </Badge>
                  
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{lead.value}</p>
                    <p className="text-xs text-muted-foreground">via {lead.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card cursor-pointer hover:shadow-glow transition-all">
          <CardHeader className="text-center">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-foreground">Schedule Follow-up</CardTitle>
            <CardDescription>Set reminders for important leads</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-card shadow-card cursor-pointer hover:shadow-glow transition-all">
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-foreground">Send Campaign</CardTitle>
            <CardDescription>Create email marketing campaigns</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-card shadow-card cursor-pointer hover:shadow-glow transition-all">
          <CardHeader className="text-center">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-foreground">View Reports</CardTitle>
            <CardDescription>Analyze your sales performance</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}