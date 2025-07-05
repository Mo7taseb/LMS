import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Book,
  Users,
  User,
  Settings,
  Menu,
  X,
  ChevronRight,
  ClipboardCheck,
  BookOpen,
  Shield,
  LayoutDashboard,
  GraduationCap,
  Boxes
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
  section?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get the preference from localStorage or default to false
    const savedState = localStorage.getItem('sidebar-collapsed');
    return savedState === 'true';
  });

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    // Dispatch an event so other components can react to this change
    window.dispatchEvent(new Event('storage'));
  }, [isCollapsed]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const navItems: NavItem[] = [
    // Main navigation - for all users
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["student", "instructor", "admin"],
      section: "main",
    },
    {
      title: "Courses",
      href: "/courses",
      icon: Book,
      roles: ["student", "instructor", "admin"],
      section: "main",
      // badge: {
      //   text: "New",
      //   variant: "outline",
      // }
    },
    {
      title: "My Learning",
      href: "/my-learning",
      icon: GraduationCap,
      roles: ["student", "instructor", "admin"],
      section: "main",
    },
    {
      title: "Assessments",
      href: "/assessment/1",
      icon: ClipboardCheck,
      roles: ["student", "instructor", "admin"],
      section: "main",
    },

    // Admin section
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["admin"],
      section: "admin",
    },
    {
      title: "Course Management",
      href: "/admin/courses",
      icon: Boxes,
      roles: ["admin"],
      section: "admin",
    },
    {
      title: "User Management",
      href: "/user-management",
      icon: Users,
      roles: ["admin"],
      section: "admin",
    },
    {
      title: "Assessment Management",
      href: "/admin/assessments",
      icon: ClipboardCheck,
      roles: ["admin"],
      section: "admin",
    },

    // User settings section - consolidated
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      roles: ["student", "instructor", "admin"],
      section: "user",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["student", "instructor", "admin"],
      section: "user",
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  // Group navigation items by section
  const groupedNavItems = filteredNavItems.reduce((groups, item) => {
    const section = item.section || 'other';
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(item);
    return groups;
  }, {} as Record<string, NavItem[]>);

  // Order of sections
  const sectionOrder = ["main", "admin", "user", "other"];

  // Check if a route is active
  const isActive = (path: string) => {
    // Home page special case
    if (path === "/dashboard" && location.pathname === "/") {
      return true;
    }
    // Check for exact match or if it's a child path
    return location.pathname === path ||
      (path !== "/dashboard" && location.pathname.startsWith(path + "/"));
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden shadow-sm bg-background/95 backdrop-blur-sm"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Sidebar Content */}
      <div
        className={cn(
          "fixed left-0 top-16 bottom-0 z-40 border-r bg-background transition-all duration-300 ease-in-out md:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          isMobileSidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto py-4 px-3">
            <nav className="space-y-6">
              <TooltipProvider delayDuration={300}>
                {sectionOrder.map((sectionKey) => {
                  const items = groupedNavItems[sectionKey] || [];
                  if (items.length === 0) return null;

                  return (
                    <div key={sectionKey} className="space-y-1">
                      {!isCollapsed && sectionKey !== "main" && (
                        <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {sectionKey === "user" ? "Account" : sectionKey === "admin" ? "Administration" : sectionKey}
                        </h4>
                      )}

                      {items.map((item) => (
                        isCollapsed ? (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "flex items-center justify-center rounded-md p-2 text-sm font-medium transition-all",
                                  isActive(item.href)
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                <item.icon className="h-5 w-5" />
                                {item.badge && (
                                  <Badge
                                    variant={item.badge.variant}
                                    className="absolute -top-1.5 -right-1.5 h-4 min-w-4 p-0.5 flex items-center justify-center text-[10px]"
                                  >
                                    {item.badge.text}
                                  </Badge>
                                )}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all",
                              isActive(item.href)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <div className="flex items-center">
                              <span className={cn(
                                "mr-3 flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                                isActive(item.href)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground"
                              )}>
                                <item.icon className="h-4 w-4" />
                              </span>
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <Badge
                                variant={item.badge.variant}
                                className="ml-auto h-5 min-w-5"
                              >
                                {item.badge.text}
                              </Badge>
                            )}
                          </Link>
                        )
                      ))}
                    </div>
                  );
                })}
              </TooltipProvider>
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className={cn(
              "flex items-center transition-all duration-200",
              isCollapsed ? "justify-center" : "space-x-3"
            )}>
              <Avatar className={cn(
                "transition-all",
                isCollapsed ? "h-8 w-8" : "h-9 w-9"
              )}>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.name || "Guest"}</p>
                  <p className="text-xs text-muted-foreground capitalize truncate">
                    {user?.role || "Not logged in"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full border bg-background shadow-sm hidden md:flex items-center justify-center hover:bg-muted"
          >
            <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", isCollapsed ? "" : "rotate-180")} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
