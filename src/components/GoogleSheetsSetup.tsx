import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, ExternalLink, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService } from "@/services/googleSheets";

interface GoogleSheetsSetupProps {
  onConfigured?: (configured: boolean) => void;
}

export function GoogleSheetsSetup({ onConfigured }: GoogleSheetsSetupProps) {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!spreadsheetId || !apiKey || !clientId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Initialize the Google Sheets service
      await googleSheetsService.initialize({
        spreadsheetId,
        apiKey,
        clientId,
        range: 'Sheet1!A:M'
      });

      // Authenticate with Google
      const authenticated = await googleSheetsService.authenticate();
      
      if (authenticated) {
        // Create headers if they don't exist
        await googleSheetsService.createSpreadsheetHeaders();
        
        setIsConnected(true);
        setShowSetup(false);
        onConfigured?.(true);
        
        toast({
          title: "Connected Successfully",
          description: "Google Sheets integration is now active. Your leads will sync automatically.",
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Sheets. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const getSpreadsheetIdFromUrl = (url: string): string => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Database className="h-5 w-5" />
          Google Sheets Integration
        </CardTitle>
        <CardDescription>
          Connect your lead management system to Google Sheets for real-time data sync
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isConnected ? (
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium text-success">Connected to Google Sheets</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowSetup(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Reconfigure
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <span className="font-medium text-warning">Not Connected</span>
              </div>
              <Button onClick={() => setShowSetup(true)}>
                <Database className="h-4 w-4 mr-2" />
                Setup Connection
              </Button>
            </div>
          )}

          <Dialog open={showSetup} onOpenChange={setShowSetup}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Google Sheets Setup</DialogTitle>
                <DialogDescription>
                  Configure your Google Sheets integration to sync lead data automatically.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spreadsheet-url">Google Sheets URL or ID</Label>
                  <Input
                    id="spreadsheet-url"
                    placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit..."
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(getSpreadsheetIdFromUrl(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste your Google Sheets URL or just the spreadsheet ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">Google API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Your Google API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Create an API key in the Google Cloud Console
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-id">OAuth Client ID</Label>
                  <Input
                    id="client-id"
                    placeholder="Your OAuth 2.0 Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Create an OAuth client ID for web applications
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Setup Instructions:</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Create a Google Sheets document</li>
                    <li>Go to Google Cloud Console and create a new project</li>
                    <li>Enable the Google Sheets API</li>
                    <li>Create credentials (API Key and OAuth 2.0 Client ID)</li>
                    <li>Copy the spreadsheet ID from your Google Sheets URL</li>
                  </ol>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto mt-2"
                    onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Google Cloud Console
                  </Button>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowSetup(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleConnect} disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}