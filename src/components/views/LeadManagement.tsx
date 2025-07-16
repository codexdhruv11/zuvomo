import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LeadManagement() {
  // Mock lead data - will be replaced with Google Sheets integration
  const leads = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "hot",
      source: "Website",
      value: "$15,000",
      lastContact: "2024-01-15",
      nextAction: "Follow-up call"
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
      lastContact: "2024-01-14",
      nextAction: "Send proposal"
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
      lastContact: "2024-01-12",
      nextAction: "Schedule demo"
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
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Manage and track your sales leads</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, company, or email..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">All Leads</CardTitle>
          <CardDescription>
            {leads.length} leads found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Next Action</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{lead.company}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{lead.value}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.lastContact}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.nextAction}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Calendar className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}