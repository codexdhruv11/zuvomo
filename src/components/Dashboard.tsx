import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardContent } from "@/components/DashboardContent";
import { useState } from "react";

export function Dashboard() {
  const [currentView, setCurrentView] = useState("overview");
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <DashboardContent currentView={currentView} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}