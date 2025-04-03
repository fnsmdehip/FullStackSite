import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, LogIn, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Attempt to get auth context but don't fail if not available
  let user = null;
  let logoutMutation: any = { isPending: false, mutateAsync: async () => {} };
  
  try {
    const auth = useAuth();
    user = auth?.user;
    logoutMutation = auth?.logoutMutation;
  } catch (error) {
    console.log("Using app layout without auth context");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
          <div className="relative flex flex-col h-full max-w-xs w-full bg-white dark:bg-gray-800">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-lg ml-4 md:ml-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search deals, companies, markets..."
                />
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              {/* Auth Button */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name || user.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.role || "User"}</div>
                  </div>
                  <Button 
                    variant="outline"
                    className="inline-flex items-center"
                    disabled={logoutMutation.isPending}
                    onClick={async () => {
                      try {
                        await logoutMutation.mutateAsync();
                        toast({
                          title: "Logged out successfully",
                          description: "You have been logged out of your account",
                        });
                        navigate('/auth');
                      } catch (error) {
                        toast({
                          title: "Logout failed",
                          description: "There was a problem logging you out",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  className="inline-flex items-center"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
