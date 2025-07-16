import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Settings, Lock } from "lucide-react";

export function RolesPermissions() {
  // Mock feature toggles - will be replaced with database
  const features = [
    { id: 'lead_management', name: 'Lead Management', enabled: true },
    { id: 'data_export', name: 'Data Export', enabled: false },
    { id: 'analytics', name: 'Advanced Analytics', enabled: true },
    { id: 'user_management', name: 'User Management', enabled: true },
    { id: 'integrations', name: 'Third-party Integrations', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
        <p className="text-muted-foreground">Configure user roles and feature access</p>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Feature Toggle System
          </CardTitle>
          <CardDescription>Enable or disable features for different user roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{feature.name}</span>
                </div>
                <Switch checked={feature.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}