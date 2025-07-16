import LeadManagement from "@/components/views/LeadManagement";
import { Overview } from "@/components/views/Overview";
import { Contacts } from "@/components/views/Contacts";
import { Analytics } from "@/components/views/Analytics";
import { Reports } from "@/components/views/Reports";
import { DataExport } from "@/components/views/DataExport";
import { UserManagement } from "@/components/views/UserManagement";
import { RolesPermissions } from "@/components/views/RolesPermissions";
import { Integrations } from "@/components/views/Integrations";
import { SystemSettings } from "@/components/views/SystemSettings";

interface DashboardContentProps {
  currentView: string;
  userRole: string;
}

export function DashboardContent({ currentView, userRole }: DashboardContentProps) {
  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <Overview />;
      case "leads":
        return <LeadManagement />;
      case "contacts":
        return <Contacts />;
      case "analytics":
        return <Analytics />;
      case "reports":
        return <Reports />;
      case "export":
        return <DataExport />;
      case "users":
        return <UserManagement />;
      case "roles":
        return <RolesPermissions />;
      case "integrations":
        return <Integrations />;
      case "settings":
        return <SystemSettings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="w-full">
      {renderView()}
    </div>
  );
}