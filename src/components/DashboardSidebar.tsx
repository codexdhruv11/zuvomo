import { 
  BarChart3, 
  Users, 
  Target, 
  Settings, 
  FileText, 
  Download,
  UserPlus,
  Shield,
  Home,
  Database
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { id: "overview", title: "Overview", icon: Home },
  { id: "leads", title: "Lead Management", icon: Target },
  { id: "ceo-outreach", title: "CEO Outreach", icon: Target },
  { id: "vc-outreach", title: "VC Outreach", icon: Target },
  { id: "partner-outreach", title: "Partner Outreach", icon: Target },
  { id: "contacts", title: "Contacts", icon: Users },
  { id: "analytics", title: "Analytics", icon: BarChart3 },
  { id: "reports", title: "Reports", icon: FileText },
  { id: "export", title: "Data Export", icon: Download, restricted: true },
];

const adminItems = [
  { id: "users", title: "User Management", icon: UserPlus },
  { id: "roles", title: "Roles & Permissions", icon: Shield },
  { id: "integrations", title: "Integrations", icon: Database },
  { id: "settings", title: "System Settings", icon: Settings },
];

interface DashboardSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: string;
}

export function DashboardSidebar({ currentView, setCurrentView, userRole }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const isAdmin = userRole === "superadmin";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            {collapsed ? (
              <img 
                src="/logo/Z logo .png" 
                alt="Zuvomo" 
                className="w-8 h-8 object-contain"
              />
            ) : (
              <img 
                src="/logo/zuvomo_01.png" 
                alt="Zuvomo - Startup Funding Launchpad" 
                className="h-8 object-contain"
              />
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = currentView === item.id;
                const isRestricted = item.restricted && !isAdmin;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => !isRestricted && setCurrentView(item.id)}
                      className={`
                        ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}
                        ${isRestricted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      `}
                      disabled={isRestricted}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                      {isRestricted && !collapsed && (
                        <Shield className="h-3 w-3 ml-auto text-warning" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => {
                  const isActive = currentView === item.id;
                  
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setCurrentView(item.id)}
                        className={`
                          ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}
                        `}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Sidebar Toggle */}
        <div className="mt-auto p-4">
          <SidebarTrigger className="w-full" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}