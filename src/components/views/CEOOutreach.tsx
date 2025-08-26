import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, Phone, Mail, Calendar, Edit, Eye, Trash2 } from "lucide-react";
import { AddLeadForm } from "@/components/AddLeadForm";

const ceoLeads = [
  {
    id: 1,
    name: "John Smith",
    company: "TechCorp Inc",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    stage: "qualified",
    leadStatus: "warm",
    value: 75000,
    lastContact: "2024-01-15",
    assignedTo: "Alice Johnson",
    notes: "Interested in enterprise package"
  },
  {
    id: 3,
    name: "Mike Chen",
    company: "Digital Dynamics",
    email: "mike.chen@digital.com",
    phone: "+1 (555) 456-7890",
    stage: "contacted",
    leadStatus: "cold",
    value: 45000,
    lastContact: "2024-01-13",
    assignedTo: "Alice Johnson",
    notes: "Initial interest shown"
  }
];

export function CEOOutreach() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-7-days");
  const [editingLead, setEditingLead] = useState<any>(null);

  const filteredLeads = useMemo(() => {
    // Filter by last 7 days if selected
    if (selectedPeriod === "last-7-days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return ceoLeads.filter(lead => new Date(lead.lastContact) >= sevenDaysAgo);
    }
    return ceoLeads;
  }, [selectedPeriod]);

  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = (filteredLeads.filter(lead => lead.stage === "closed-won").length / filteredLeads.length * 100).toFixed(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CEO Outreach</h1>
          <p className="text-muted-foreground">Manage your CEO lead pipeline</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <AddLeadForm editLead={editingLead} onClose={() => setEditingLead(null)}>
            <Button size="sm">Add CEO Lead</Button>
          </AddLeadForm>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Total CEO Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLeads.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>CEO Leads Database</CardTitle>
          <CardDescription>Manage your CEO outreach pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{lead.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">CEO</Badge>
                      <Badge variant="outline">{lead.leadStatus}</Badge>
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
                    {lead.notes && (
                      <p className="text-sm text-muted-foreground">{lead.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{formatCurrency(lead.value)}</div>
                      <div className="text-sm text-muted-foreground">Assigned to: {lead.assignedTo}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingLead(lead)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}