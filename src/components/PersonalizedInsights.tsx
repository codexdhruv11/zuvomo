import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertCircle, 
  CheckCircle,
  Lightbulb,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

// Sample data for the logged-in sales person
const personalData = {
  name: "Alice Johnson",
  role: "Senior Sales Representative",
  thisMonth: {
    leadsContacted: 42,
    dealsWon: 3,
    revenue: 285000,
    conversionRate: 7.1
  },
  lastMonth: {
    leadsContacted: 38,
    dealsWon: 2,
    revenue: 190000,
    conversionRate: 5.3
  },
  quarterGoal: {
    revenue: 900000,
    deals: 12,
    progress: 68
  }
};

const personalPerformanceData = [
  { month: "Jan", revenue: 165000, deals: 2, activities: 45 },
  { month: "Feb", revenue: 190000, deals: 2, activities: 38 },
  { month: "Mar", revenue: 225000, deals: 3, activities: 52 },
  { month: "Apr", revenue: 285000, deals: 3, activities: 42 },
];

const activityData = [
  { activity: "Calls", thisWeek: 28, lastWeek: 22, target: 30 },
  { activity: "Emails", thisWeek: 45, lastWeek: 38, target: 40 },
  { activity: "Meetings", thisWeek: 12, lastWeek: 10, target: 15 },
  { activity: "Proposals", thisWeek: 3, lastWeek: 2, target: 4 }
];

export function PersonalizedInsights() {
  const revenueGrowth = ((personalData.thisMonth.revenue - personalData.lastMonth.revenue) / personalData.lastMonth.revenue * 100).toFixed(1);
  const conversionGrowth = ((personalData.thisMonth.conversionRate - personalData.lastMonth.conversionRate) / personalData.lastMonth.conversionRate * 100).toFixed(1);
  const quarterProgress = (personalData.thisMonth.revenue / personalData.quarterGoal.revenue * 100).toFixed(1);

  const aiRecommendations = [
    {
      type: "success",
      title: "Strong LinkedIn Performance",
      description: "Your LinkedIn outreach has 23% higher conversion than cold calls. Focus 60% of efforts here.",
      impact: "high",
      icon: CheckCircle
    },
    {
      type: "warning", 
      title: "Follow-up Gap Detected",
      description: "You have 8 prospects without follow-up for 5+ days. Schedule follow-ups to prevent loss.",
      impact: "medium",
      icon: AlertCircle
    },
    {
      type: "opportunity",
      title: "Best Calling Time",
      description: "Your calls between 2-4 PM have 40% better connection rates. Optimize your schedule.",
      impact: "medium",
      icon: Lightbulb
    },
    {
      type: "goal",
      title: "Quarter Goal on Track",
      description: "You need 2 more deals to hit quarterly target. Focus on your 3 hot prospects in negotiation.",
      impact: "high",
      icon: Target
    }
  ];

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "opportunity": return "bg-blue-100 text-blue-800 border-blue-200";
      case "goal": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Performance Overview */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Your Performance</CardTitle>
              <CardDescription>Personal metrics for {personalData.name}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {personalData.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-foreground">
                  ${(personalData.thisMonth.revenue / 1000).toFixed(0)}K
                </h3>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+{revenueGrowth}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {personalData.thisMonth.conversionRate}%
                </h3>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+{conversionGrowth}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quarter Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Quarterly Goal Progress</p>
              <span className="text-sm font-medium">{quarterProgress}%</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${quarterProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              ${(personalData.thisMonth.revenue / 1000).toFixed(0)}K of ${(personalData.quarterGoal.revenue / 1000).toFixed(0)}K goal
            </p>
          </div>

          {/* Performance Chart */}
          <div>
            <h4 className="text-sm font-medium mb-3">Monthly Trend</h4>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={personalPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${(value as number / 1000).toFixed(0)}K` : value,
                    name === 'revenue' ? 'Revenue' : 'Deals'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Recommendations */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">AI Recommendations</CardTitle>
          </div>
          <CardDescription>Personalized insights to boost your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <div key={index} className="p-4 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${getRecommendationColor(rec.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{rec.title}</h4>
                        <Badge variant="outline" className={getRecommendationColor(rec.type)}>
                          {rec.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Detailed Analytics
          </Button>
        </CardContent>
      </Card>

      {/* Activity Performance */}
      <Card className="bg-gradient-card shadow-card lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Weekly Activity Performance</CardTitle>
              <CardDescription>Compare your activity levels with targets and performance</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                WOW (8 weeks)
              </Button>
              <Button variant="outline" size="sm">
                MOM (12 months)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="activity" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="thisWeek" fill="hsl(var(--primary))" name="This Week" />
              <Bar dataKey="lastWeek" fill="hsl(var(--primary-variant))" name="Last Week" />
              <Bar dataKey="target" fill="hsl(var(--accent))" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}