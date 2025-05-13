
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "../../components/ui/use-toast";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { updatePassword } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    // Password validation (8-16 chars, uppercase, special char)
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      newErrors.newPassword = "Password must be 8-16 characters";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one special character";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const result = await updatePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated",
        });
        
        // Reset form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Change Password</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Your Password</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="8-16 characters with uppercase and special char"
                value={formData.newPassword}
                onChange={handleChange}
              />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </CardContent>
        </form>
      </Card>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Password Requirements</h3>
        <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
          <li>8-16 characters in length</li>
          <li>At least one uppercase letter</li>
          <li>At least one special character</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;
