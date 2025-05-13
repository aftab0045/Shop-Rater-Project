
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "../../components/ui/use-toast";

const AddStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [storeOwners, setStoreOwners] = useState([]);
  
  const { addStore, getUsers } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
   
    const users = getUsers();
    const owners = users.filter(user => user.role === "store_owner");
    setStoreOwners(owners);
    
    if (owners.length > 0 && !formData.ownerId) {
      setFormData(prev => ({ ...prev, ownerId: owners[0].id }));
    }
  }, [getUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = "Store name is required";
    } else if (formData.name.length < 20) {
      newErrors.name = "Store name must be at least 20 characters";
    } else if (formData.name.length > 60) {
      newErrors.name = "Store name cannot exceed 60 characters";
    }
    
  
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    
    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters";
    }
    

    if (!formData.ownerId) {
      newErrors.ownerId = "Store owner is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {

      const storeData = {
        ...formData,
        ownerId: parseInt(formData.ownerId)
      };
      
      const result = await addStore(storeData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Store has been successfully added",
        });
        navigate("/admin/stores");
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add store",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Add store error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Add New Store</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Store name (20-60 characters)"
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
                placeholder="store@example.com"
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
                placeholder="Store address (max 400 characters)"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerId">Store Owner</Label>
              {storeOwners.length > 0 ? (
                <select
                  id="ownerId"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="" disabled>Select a store owner</option>
                  {storeOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-amber-600 bg-amber-50 p-3 rounded-md">
                  No store owners found. Please add a user with the Store Owner role first.
                </div>
              )}
              {errors.ownerId && <p className="text-red-500 text-sm">{errors.ownerId}</p>}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/admin/stores")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || storeOwners.length === 0}>
              {isLoading ? "Adding Store..." : "Add Store"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddStore;
