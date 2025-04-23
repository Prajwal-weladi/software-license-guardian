
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart, Database, User, Calendar, Settings, Shield, 
  ChevronLeft, ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-bold text-xl">License<span className="text-primary">Management</span></span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn(
            "text-sidebar-foreground hover:text-white hover:bg-sidebar-accent",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <SidebarItem icon={<BarChart />} text="Dashboard" active collapsed={collapsed} />
          <SidebarItem icon={<Database />} text="Licenses" collapsed={collapsed} />
          <SidebarItem icon={<User />} text="Users" collapsed={collapsed} />
          <SidebarItem icon={<Calendar />} text="Renewals" collapsed={collapsed} />
          <SidebarItem icon={<Shield />} text="Compliance" collapsed={collapsed} />
          <SidebarItem icon={<Settings />} text="Settings" collapsed={collapsed} />
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-medium">
            PW
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">Prajwal Weladi</p>
              <p className="text-xs text-sidebar-foreground/70">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon, text, active = false, collapsed }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
        collapsed ? "px-2" : "px-3"
      )}
    >
      <span className={collapsed ? "mx-auto" : "mr-2"}>{icon}</span>
      {!collapsed && <span>{text}</span>}
    </Button>
  );
};

export default Sidebar;
