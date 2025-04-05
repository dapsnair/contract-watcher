
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="border-b border-border p-4 bg-background flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold hidden md:block">Contract Watcher</h1>
      </div>
      
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 bg-background"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs" variant="destructive">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 font-medium">Notifications</div>
            <div className="px-4 py-2 border-t">
              <div className="text-sm font-medium">Contract Expiring Soon</div>
              <div className="text-xs text-muted-foreground">ACME Inc's domain renewal in 7 days</div>
            </div>
            <div className="px-4 py-2 border-t">
              <div className="text-sm font-medium">Contract Expired</div>
              <div className="text-xs text-muted-foreground">TechCorp server hosting has expired</div>
            </div>
            <div className="px-4 py-2 border-t">
              <div className="text-sm font-medium">New Customer Added</div>
              <div className="text-xs text-muted-foreground">Global Systems Inc. was added to your customers</div>
            </div>
            <DropdownMenuItem className="cursor-pointer justify-center font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
