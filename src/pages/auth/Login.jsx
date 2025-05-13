
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "../../components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    
    if (!password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect based on role
        switch (result.role) {
          case "admin":
            navigate("/dashboard/admin");
            break;
          case "store_owner":
            navigate("/dashboard/store-owner");
            break;
          case "user":
            navigate("/dashboard/user");
            break;
          default:
            navigate("/dashboard/user");
        }
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: "Admin", email: "admin@example.com", password: "Admin123!" },
    { role: "Store Owner", email: "store@example.com", password: "Store123!" },
    { role: "User", email: "user@example.com", password: "User123!" }
  ];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login to StoreRater</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <p className="mt-4 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        {/* Demo credentials box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="grid grid-cols-3 text-sm">
                <span className="font-medium">{cred.role}:</span>
                <span className="text-gray-600">{cred.email}</span>
                <span className="text-gray-600">{cred.password}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
