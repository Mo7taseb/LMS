
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export function Layout() {
  const { isAuthenticated, user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for sidebar collapse changes
  useEffect(() => {
    const handleStorageChange = () => {
      const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
      setIsSidebarCollapsed(isCollapsed);
      console.log('Sidebar collapsed state updated:', isCollapsed);
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Initial check
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Ensure we correctly detect the authentication state
  useEffect(() => {
    console.log('Layout rendering, isAuthenticated:', isAuthenticated, 'user:', user);
  }, [isAuthenticated, user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 ${isAuthenticated ? (isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64') : ''} transition-all duration-300 p-4`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
