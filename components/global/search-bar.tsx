import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchBar = ({ value, onChange, className }: SearchBarProps) => {
  return (
    <div className={`relative sm:block w-64 ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-10 h-10 bg-secondary border-border"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};
export default SearchBar;
