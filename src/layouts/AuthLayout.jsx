
import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (isAuthenticated && userRole) {
      navigate(`/dashboard/${userRole}`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="py-4 bg-white shadow">
        <div className="container-custom mx-auto">
          <Link to="/" className="text-xl font-bold text-blue-600">
            StoreRater
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container-custom py-8">
          <Outlet />
        </div>
      </main>
      
      <footer className="py-4 bg-white border-t">
        <div className="container-custom mx-auto">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} StoreRater. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
