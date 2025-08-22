import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, Settings, CheckCircle } from "lucide-react";
import { GoogleSheetsSetup } from "@/components/GoogleSheetsSetup";

export function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground">Connect with external services and APIs</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GoogleSheetsSetup />

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