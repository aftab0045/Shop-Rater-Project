
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
    }
  }, [currentUser]);

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const roleName = {
    admin: "System Administrator",
    store_owner: "Store Owner",
    user: "Normal User"
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Your Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start">
            <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <div className="font-medium">Name</div>
              <div className="text-gray-600">{profileData.name}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-gray-600">{profileData.email}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <div className="font-medium">Address</div>
              <div className="text-gray-600">{profileData.address}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <div className="font-medium">Role</div>
              <div className="text-gray-600">
                {roleName[profileData.role] || profileData.role}
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button asChild className="w-full">
              <Link to="/change-password">
                Change Password
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
