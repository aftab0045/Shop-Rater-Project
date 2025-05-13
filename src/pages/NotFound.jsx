
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

 
  const getHomeLink = () => {
    if (!currentUser) {
      return "/login";
    }
    
    switch (currentUser.role) {
      case "admin":
        return "/dashboard/admin";
      case "store_owner":
        return "/dashboard/store-owner";
      default:
        return "/dashboard/user";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Oops! Page not found</p>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to={getHomeLink()}>
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
