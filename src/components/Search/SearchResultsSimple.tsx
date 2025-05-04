import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

const SearchResultsSimple = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative w-full md:max-w-sm lg:max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search licenses, vendors..."
          className="w-full rounded-lg pl-8 pr-8 bg-background"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default SearchResultsSimple;
