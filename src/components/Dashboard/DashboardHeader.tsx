
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">License Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your software licenses in one place
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">

      </div>
    </div>
  );
};

export default DashboardHeader;
