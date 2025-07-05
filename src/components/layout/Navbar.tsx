import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  User,
  Menu,
  X,
  LogOut,
  ClipboardCheck,
  BookOpen,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoLink } from "@/components/ui/logo";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New assessment available", icon: ClipboardCheck, read: false, link: "/assessment/1" },
    { id: 2, title: "New course added to catalog", icon: BookOpen, read: false, link: "/courses" },
    { id: 3, title: "Your certificate is ready", icon: BookOpen, read: false, link: "/my-learning" },
  ]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleTheme = () => {
      const root = window.document.documentElement;
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      }
    };

    localStorage.setItem('theme', theme);
    handleTheme();
  }, [theme]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <LogoLink to="/" />

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative group",
                isActive("/") && "text-primary"
              )}
            >
              Dashboard
              {isActive("/") && (
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-primary"></span>
              )}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/courses"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative group",
                isActive("/courses") && "text-primary"
              )}
            >
              Courses
              {isActive("/courses") && (
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-primary"></span>
              )}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/my-learning"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative group",
                isActive("/my-learning") && "text-primary"
              )}
            >
              My Learning
              {isActive("/my-learning") && (
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-primary"></span>
              )}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user && user.role === "admin" && (
              <Link
                to="/user-management"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative group",
                  isActive("/user-management") && "text-primary"
                )}
              >
                User Management
                {isActive("/user-management") && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-primary"></span>
                )}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-64 pl-8 rounded-full bg-background focus-visible:ring-primary"
            />
          </div>

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-muted">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && <Badge variant="outline">{unreadCount} new</Badge>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} asChild>
                        <Link
                          to={notification.link}
                          className={cn(
                            "flex items-center py-2 px-1",
                            !notification.read && "font-medium bg-muted/50"
                          )}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="mr-2 rounded-full bg-primary/10 p-1">
                            <notification.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">1 hour ago</p>
                          </div>
                          {!notification.read && (
                            <div className="ml-2 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center cursor-pointer">
                    Mark all as read
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                    {theme === 'light' ? (
                      <Sun className="h-5 w-5" />
                    ) : theme === 'dark' ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Laptop className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {theme === 'light' && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {theme === 'dark' && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Laptop className="mr-2 h-4 w-4" />
                    <span>System</span>
                    {theme === 'system' && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full hover:bg-muted pl-1 pr-2 py-1.5">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                      <AvatarImage src={user?.avatar} />
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user?.name || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                      <Badge variant="outline" className="mt-1 w-fit text-xs capitalize">
                        {user?.role || "user"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Laptop className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild className="hover:bg-primary/5">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="shadow-sm hover:shadow-md transition-shadow">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-muted"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Menu</span>
        </Button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background z-40 transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container py-6 flex flex-col gap-4">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 p-4 rounded-md hover:bg-accent",
              isActive("/") && "bg-muted font-medium"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/courses"
            className={cn(
              "flex items-center gap-2 p-4 rounded-md hover:bg-accent",
              isActive("/courses") && "bg-muted font-medium"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/my-learning"
            className={cn(
              "flex items-center gap-2 p-4 rounded-md hover:bg-accent",
              isActive("/my-learning") && "bg-muted font-medium"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Learning
          </Link>
          {user && user.role === "admin" && (
            <Link
              to="/user-management"
              className={cn(
                "flex items-center gap-2 p-4 rounded-md hover:bg-accent",
                isActive("/user-management") && "bg-muted font-medium"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              User Management
            </Link>
          )}
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8 rounded-full bg-background"
            />
          </div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                    <AvatarImage src={user?.avatar} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <Badge variant="outline" className="capitalize">
                    {user?.role || "user"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full relative h-8 w-8"
                      onClick={() => setIsMobileMenuOpen(false)}
                      asChild
                    >
                      <Link to="/profile">
                        <User className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full relative h-8 w-8"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 px-1 min-w-4 h-4 flex items-center justify-center text-[10px] rounded-full">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {theme === 'light' ? (
                    <Sun className="h-4 w-4" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Laptop className="h-4 w-4" />
                  )}
                  <span className="text-sm">Theme</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="h-8"
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="h-8"
                  >
                    Dark
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
