import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, Settings, CheckCircle } from "lucide-react";

export function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground">Connect with external services and APIs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Database className="h-5 w-5" />
              Google Sheets
            </CardTitle>
            <CardDescription>Connect to Google Sheets as your CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-success">Connected</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              API Endpoints
            </CardTitle>
            <CardDescription>Custom API integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-primary">
              <ExternalLink className="h-4 w-4 mr-2" />
              Setup API
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}