import { Dashboard } from "@/components/Dashboard";
import { Login } from "@/components/Login";
import { useState } from "react";

const Index = () => {
  const [user, setUser] = useState<{ role: string } | null>(null);

  const handleLogin = (role: string) => {
    setUser({ role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard userRole={user.role} onLogout={handleLogout} />;
};

export default Index;
