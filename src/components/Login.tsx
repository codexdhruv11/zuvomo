import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (email === "superadmin@zuvomo.com" && password === "super123") {
      onLogin("superadmin");
    } else if (email === "sales@zuvomo.com" && password === "sales123") {
      onLogin("sales");
    } else if (email === "analyst@zuvomo.com" && password === "analyst123") {
      onLogin("analyst");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-gradient-card shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <img 
              src="/logo/Zuvomo logo.png" 
              alt="Zuvomo - Startup Funding Launchpad" 
              className="h-12 object-contain mx-auto"
            />
          </div>
          <CardTitle className="text-2xl text-foreground">Welcome to Zuvomo</CardTitle>
          <CardDescription>Sign in to your startup funding launchpad</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-gradient-primary">
              Sign In
            </Button>
          </form>
          
          <div className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => onLogin("sales")}
            >
              Skip Login (Demo as Sales)
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>Superadmin: superadmin@zuvomo.com / super123</p>
            <p>Sales: sales@zuvomo.com / sales123</p>
            <p>Analyst: analyst@zuvomo.com / analyst123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}