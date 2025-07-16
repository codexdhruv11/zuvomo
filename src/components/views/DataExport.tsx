import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Shield, FileText, Database } from "lucide-react";

export function DataExport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Export</h1>
        <p className="text-muted-foreground">Export your data securely (Admin only)</p>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Download className="h-5 w-5" />
            <Shield className="h-4 w-4 text-warning" />
            Secure Data Export
          </CardTitle>
          <CardDescription>Export leads, contacts, and analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Data export functionality (Admin access required)</p>
            <Button className="mt-4" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}