
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileContract,
  Bell,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Contracts",
    url: "/contracts",
    icon: FileContract,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
];

const utilityMenuItems = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Help",
    url: "#",
    icon: HelpCircle,
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const isActiveRoute = (route: string) => {
    if (route === '/' && location.pathname === '/') return true;
    if (route !== '/' && location.pathname.startsWith(route)) return true;
    return false;
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="font-bold text-xl text-brand-600">Contract Watcher</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    active={isActiveRoute(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-brand-100 text-brand-600">IT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">IT Admin</span>
            <span className="text-xs text-muted-foreground">admin@example.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
