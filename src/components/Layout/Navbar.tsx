
import { Bell, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Licenses", href: "/licenses" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <div className="hidden md:flex">
          <span className="font-semibold text-xl text-primary">LicenseManagement</span>
        </div>
        <form className="flex-1 md:max-w-sm lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search licenses, vendors..."
              className="w-full rounded-lg pl-8 bg-background"
            />
          </div>
        </form>
        <nav className="flex-1 hidden md:flex justify-end">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href ||
                            (item.href === "/" && (location.pathname === "/dashboard" || location.pathname === "/admin/dashboard"));
            return (
              <Button
                key={item.name}
                variant="link"
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                asChild
              >
                <Link to={item.href}>{item.name}</Link>
              </Button>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link to="/settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          asChild
        >
          <Link to="/profile">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
