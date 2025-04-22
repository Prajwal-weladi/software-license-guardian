
import { Bell, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <div className="hidden md:flex">
          <span className="font-semibold text-xl text-primary">LicenseGuardian</span>
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
          <Button variant="link" className="text-sm font-medium">Dashboard</Button>
          <Button variant="link" className="text-sm font-medium">Licenses</Button>
          <Button variant="link" className="text-sm font-medium">Reports</Button>
          <Button variant="link" className="text-sm font-medium">Settings</Button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
