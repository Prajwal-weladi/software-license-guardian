import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { License } from "@/data/mockData";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, FileText, Calendar, Tag, X } from "lucide-react";
import { getLicenses } from "@/services/dataService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SearchResults = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load licenses when component mounts
  useEffect(() => {
    const loadedLicenses = getLicenses();
    setLicenses(loadedLicenses);
  }, []);

  // Filter licenses based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLicenses([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = licenses.filter(license => 
      license.name.toLowerCase().includes(query) || 
      license.vendor.toLowerCase().includes(query) || 
      license.department.toLowerCase().includes(query) ||
      license.type.toLowerCase().includes(query)
    );
    
    setFilteredLicenses(results.slice(0, 5)); // Limit to 5 results
  }, [searchQuery, licenses]);

  // Handle license selection
  const handleSelectLicense = (license: License) => {
    setOpen(false);
    setSearchQuery("");
    navigate(`/licenses?id=${license.id}`);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() && !open) {
      setOpen(true);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "expiring":
        return "warning";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="relative w-full md:max-w-sm lg:max-w-md">
      <Popover open={open && filteredLicenses.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search licenses, vendors..."
              className="w-full rounded-lg pl-8 pr-8 bg-background"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.trim() && filteredLicenses.length > 0) {
                  setOpen(true);
                }
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup heading="Licenses">
                {filteredLicenses.map((license) => (
                  <CommandItem
                    key={license.id}
                    onSelect={() => handleSelectLicense(license)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-primary" />
                          <span className="font-medium">{license.name}</span>
                        </div>
                        <Badge variant={getStatusBadgeVariant(license.status)}>
                          {license.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{license.vendor}</span>
                        <span className="mx-1">•</span>
                        <span>{license.department}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchResults;
