import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "../../components/ui/use-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-lg border-blue-100 p-2">
          <CardHeader className="space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg py-8">
            <CardTitle className="text-3xl font-bold text-center text-blue-800">Login to StoreRater</CardTitle>
            <CardDescription className="text-center text-blue-600 text-lg">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-8 px-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700 text-lg">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-blue-200 focus-visible:ring-blue-400 py-6"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-blue-700 text-lg">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-400 pr-10 py-6"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? 
                      <EyeOffIcon className="h-5 w-5" /> : 
                      <EyeIcon className="h-5 w-5" />
                    }
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col pt-2 pb-6 px-8">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <p className="mt-6 text-center text-base text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
