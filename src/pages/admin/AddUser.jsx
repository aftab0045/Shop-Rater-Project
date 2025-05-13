
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "../../components/ui/use-toast";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { addUser } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    
    // Name validation (20-60 characters)
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 20) {
      newErrors.name = "Name must be at least 20 characters";
    } else if (formData.name.length > 60) {
      newErrors.name = "Name cannot exceed 60 characters";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Address validation (max 400 characters)
    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters";
    }
    
    // Password validation (8-16 chars, uppercase, special char)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password must be 8-16 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const result = await addUser(formData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "User has been successfully added",
        });
        navigate("/admin/users");
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Add user error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Add New User</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="User's full name (20-60 characters)"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="User's address (max 400 characters)"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="8-16 characters with uppercase and special char"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
                <option value="user">User</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/admin/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding User..." : "Add User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;
