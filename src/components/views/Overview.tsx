import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  MoreHorizontal,
  Filter,
  Search
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Opportunities data with actionable insights
  const opportunities = [
    { stage: 'Qualify', value: 12, amount: '$125K' },
    { stage: 'Meet & Present', value: 8, amount: '$95K' },
    { stage: 'Proposal', value: 15, amount: '$180K' },
    { stage: 'Negotiate', value: 6, amount: '$75K' },
    { stage: 'Closed Won', value: 4, amount: '$65K' },
  ];

  // My Tasks - actionable items
  const myTasks = [
    {
      id: 1,
      task: "Call Sarah Johnson",
      type: "call",
      priority: "high",
      dueDate: "Today",
      lead: "TechCorp Inc.",
      completed: false
    },
    {
      id: 2,
      task: "Check contract responses",
      type: "review",
      priority: "medium", 
      dueDate: "Tomorrow",
      lead: "StartupXYZ",
      completed: false
    },
    {
      id: 3,
      task: "Send follow up emails",
      type: "email",
      priority: "high",
      dueDate: "May 24",
      lead: "Enterprise Solutions",
      completed: true
    },
    {
      id: 4,
      task: "Update email",
      type: "update",
      priority: "low",
      dueDate: "May 31",
      lead: "Tech Innovations",
      completed: false
    }
  ];

  // Recommended Actions - AI-powered suggestions
  const recommendedActions = [
    {
      id: 1,
      title: "New lead assigned to you today",
      description: "Emma Chen",
      type: "lead",
      priority: "high"
    },
    {
      id: 2,
      title: "New lead assigned to you today",
      description: "Michael Thompson", 
      type: "lead",
      priority: "high"
    },
    {
      id: 3,
      title: "New lead assigned to you today",
      description: "Sarah Wilson",
      type: "lead", 
      priority: "medium"
    },
    {
      id: 4,
      title: "New lead assigned to you today",
      description: "David Rodriguez",
      type: "lead",
      priority: "medium"
    }
  ];

  // Recent Records - latest activity
  const recentRecords = [
    {
      id: 1,
      name: "Carl McDouglas",
      type: "lead",
      action: "Created",
      time: "2 mins ago",
      icon: Target
    },
    {
      id: 2,
      name: "Big Deal Opportunity",
      type: "opportunity", 
      action: "Updated",
      time: "5 mins ago",
      icon: DollarSign
    },
    {
      id: 3,
      name: "Marketing Email",
      type: "campaign",
      action: "Sent",
      time: "1 hour ago", 
      icon: Mail
    },
    {
      id: 4,
      name: "Marketing",
      type: "task",
      action: "Completed",
      time: "2 hours ago",
      icon: CheckCircle
    }
  ];

  // Enhanced lead data with more details
  const myLeads = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson", 
      company: "TechCorp",
      city: "NYC",
      state: "NY",
      status: "hot",
      score: 85
    },
    {
      id: 2,
      firstName: "Mike",
      lastName: "Chen",
      company: "StartupXYZ",
      city: "LA", 
      state: "CA",
      status: "warm",
      score: 72
    },
    {
      id: 3,
      firstName: "Emma",
      lastName: "Wilson",
      company: "Enterprise",
      city: "Chi",
      state: "IL", 
      status: "cold",
      score: 45
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

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "call": return Phone;
      case "email": return Mail;
      case "review": return Eye;
      case "update": return Edit;
      default: return CheckCircle;
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
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
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

      {/* Salesforce-style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - My Leads */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">My Leads</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{lead.firstName}</span>
                      <span className="font-medium text-foreground">{lead.lastName}</span>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                    <p className="text-xs text-muted-foreground">{lead.city}, {lead.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{lead.score}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Convert</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary">
              View Report →
            </Button>
          </CardContent>
        </Card>

        {/* Center Column - All Opportunities */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">All Opportunities</CardTitle>
            </div>
            <Button size="sm" variant="ghost">
              New
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={opportunities} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--foreground))" />
                <YAxis type="category" dataKey="stage" stroke="hsl(var(--foreground))" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <Button variant="link" className="w-full mt-4 text-primary">
              View Report →
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - All Contacts */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">All Contacts</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myLeads.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{contact.firstName} {contact.lastName}</p>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                    <p className="text-xs text-muted-foreground">{contact.city}, {contact.state}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary">
              View Report →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Tasks and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Tasks */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">My Tasks</CardTitle>
            </div>
            <Button size="sm" variant="ghost">
              New
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myTasks.map((task) => {
                const TaskIcon = getTaskIcon(task.type);
                return (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors">
                    <Checkbox checked={task.completed} />
                    <TaskIcon className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-muted-foreground">{task.lead}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{task.dueDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="link" className="w-full mt-4 text-primary">
              View All →
            </Button>
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Recommended Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendedActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.title}</p>
                      <p className="text-sm font-medium text-primary">{action.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Recent Records</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <record.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{record.name}</p>
                    <p className="text-xs text-muted-foreground">{record.action} • {record.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {record.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}