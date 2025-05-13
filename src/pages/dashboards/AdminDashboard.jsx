
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const StatCard = ({ title, value, icon: Icon, description, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const { getStats } = useData();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  useEffect(() => {
    
    const fetchStats = () => {
      const data = getStats();
      setStats(data);
    };

    fetchStats();
  }, [getStats]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/admin/add-user">Add User</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/add-store">Add Store</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Active users on the platform"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Stores"
          value={stats.totalStores}
          icon={Store}
          description="Registered stores"
          color="bg-green-500"
        />
        <StatCard
          title="Total Ratings"
          value={stats.totalRatings}
          icon={Star}
          description="Submitted ratings"
          color="bg-yellow-500"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest users who joined the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Name</span>
                <span className="text-gray-500">Role</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Regular User</span>
                <span className="text-gray-500">User</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Store Owner</span>
                <span className="text-gray-500">Store Owner</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/admin/users">View All Users</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Stores</CardTitle>
            <CardDescription>Latest stores added to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Store Name</span>
                <span className="text-gray-500">Rating</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Grocery Store</span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span>4.5</span>
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Electronics Shop</span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span>3.0</span>
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/admin/stores">View All Stores</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
