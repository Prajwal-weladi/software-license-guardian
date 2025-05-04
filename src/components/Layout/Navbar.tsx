
import { Bell, Settings, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import SearchResultsSimple from "@/components/Search/SearchResultsSimple";

const Navbar = () => {
  const location = useLocation();
  // Simplified for demo - always authenticated
  const isAuthenticated = true;

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Licenses", href: "/licenses" }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <div className="hidden md:flex">
          <span className="font-semibold text-xl text-primary">LicenseManagement</span>
        </div>
        <div className="flex-1 md:max-w-sm lg:max-w-md">
          <SearchResultsSimple />
        </div>
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
        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
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
              onClick={() => console.log('Logout clicked')}
              className="text-sm font-medium"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              asChild
              className="text-sm font-medium"
            >
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button
              variant="default"
              asChild
              className="text-sm font-medium"
            >
              <Link to="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
