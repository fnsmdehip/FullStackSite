import { useEffect, ReactNode } from "react";
import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface RouteMap {
  [path: string]: ReactNode;
}

interface AuthRoutesProps {
  publicRoutes: RouteMap;
  privateRoutes: RouteMap;
  appLayout: React.ComponentType<{ children: ReactNode }>;
}

export default function AuthRoutes({ 
  publicRoutes, 
  privateRoutes, 
  appLayout: AppLayout 
}: AuthRoutesProps) {
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Handle redirection based on auth state
  useEffect(() => {
    if (!isLoading) {
      // If user is logged in and trying to access a public route like /auth
      if (user && Object.keys(publicRoutes).includes(location)) {
        setLocation("/dashboard");
      } 
      // If user is not logged in and trying to access a private route
      else if (!user && !Object.keys(publicRoutes).includes(location)) {
        setLocation("/auth");
      }
    }
  }, [user, isLoading, location, publicRoutes, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle public routes (not requiring authentication)
  if (!user) {
    return (
      <Switch>
        {Object.entries(publicRoutes).map(([path, component]) => (
          <Route key={path} path={path}>
            {component}
          </Route>
        ))}
        <Route path="*">
          {publicRoutes["/auth"] || <div>Redirecting to login...</div>}
        </Route>
      </Switch>
    );
  }

  // Handle private routes (requiring authentication)
  return (
    <AppLayout>
      <Switch>
        {Object.entries(privateRoutes).map(([path, component]) => (
          <Route key={path} path={path}>
            {component}
          </Route>
        ))}
      </Switch>
    </AppLayout>
  );
}