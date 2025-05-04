
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart, Database, User, Calendar, Settings, Shield,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: <BarChart /> },
    { name: "Licenses", href: "/licenses", icon: <Database /> },
    { name: "Users", href: "/users", icon: <User /> },
    { name: "Renewals", href: "/renewals", icon: <Calendar /> },
    { name: "Compliance", href: "/compliance", icon: <Shield /> },
    { name: "Settings", href: "/settings", icon: <Settings /> }
  ];

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
          {navItems.map((item) => {
            const isActive = location.pathname === item.href ||
                            (item.href === "/" && (location.pathname === "/dashboard" || location.pathname === "/admin/dashboard"));
            return (
              <SidebarItem
                key={item.name}
                icon={item.icon}
                text={item.name}
                href={item.href}
                active={isActive}
                collapsed={collapsed}
              />
            );
          })}
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
  href: string;
  active?: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon, text, href, active = false, collapsed }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
        collapsed ? "px-2" : "px-3"
      )}
      asChild
    >
      <Link to={href}>
        <span className={collapsed ? "mx-auto" : "mr-2"}>{icon}</span>
        {!collapsed && <span>{text}</span>}
      </Link>
    </Button>
  );
};

export default Sidebar;
