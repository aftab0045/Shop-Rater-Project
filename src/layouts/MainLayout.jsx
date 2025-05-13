
import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  LogOut, 
  User,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "../components/ui/use-toast";

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("userRole");
    
    if (!authStatus) {
      navigate("/login");
    }
    
    setIsAuthenticated(authStatus);
    setUserRole(role || "");
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ to, label, icon: Icon, onClick }) => {
    return (
      <Link
        to={to}
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
        onClick={onClick}
      >
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        <span>{label}</span>
      </Link>
    );
  };

  


  const getNavItems = () => {
    const commonItems = [
      {
        to: "/profile",
        label: "Profile",
        icon: User,
      },
      {
        to: "/change-password",
        label: "Change Password",
        icon: null,
      },
    ];



    switch (userRole) {
      case "admin":
        return [
          {
            to: "/dashboard/admin",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            to: "/admin/users",
            label: "Manage Users",
            icon: Users,
          },
          {
            to: "/admin/stores",
            label: "Manage Stores",
            icon: Store,
          },
          ...commonItems,
        ];
      case "store_owner":
        return [
          {
            to: "/dashboard/store-owner",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          ...commonItems,
        ];
      case "user":
        return [
          {
            to: "/dashboard/user",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            to: "/stores",
            label: "View Stores",
            icon: Store,
          },
          ...commonItems,
        ];
      default:
        return commonItems;
    }
  };


  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom mx-auto">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center">
              <Link to={`/dashboard/${userRole}`} className="text-xl font-bold text-blue-600">
                StoreRater
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-sm text-gray-500">
                Welcome, {currentUser?.name || "User"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg z-50">
          <nav className="container-custom py-4">
            {getNavItems().map((item, index) => (
              <div key={index} className="py-1">
                <NavLink
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  onClick={closeMobileMenu}
                />
              </div>
            ))}
            <div className="pt-4 mt-2 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md w-full"
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar - desktop only */}
        <aside className="hidden md:block w-64 bg-gray-50 border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {getNavItems().map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-100">
          <div className="container-custom py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
