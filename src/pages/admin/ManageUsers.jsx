
import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Search, Plus } from "lucide-react";

const ManageUsers = () => {
  const { getUsers } = useData();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: ""
  });

  useEffect(() => {
    // Fetch all users
    const allUsers = getUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  }, [getUsers]);

  const applyFilters = () => {
    let result = [...users];
    
    // Apply each filter
    if (filters.name) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.email) {
      result = result.filter(user => 
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    if (filters.address) {
      result = result.filter(user => 
        user.address.toLowerCase().includes(filters.address.toLowerCase())
      );
    }
    
    if (filters.role) {
      result = result.filter(user => 
        user.role.toLowerCase() === filters.role.toLowerCase()
      );
    }
    
    setFilteredUsers(result);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    
    // If already sorting by this key, toggle direction
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
    
    // Sort the filtered users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(sortedUsers);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleFilterReset = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
      role: ""
    });
    setFilteredUsers(users);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
        <Button asChild>
          <Link to="/admin/add-user">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Filter form */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Filter by name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Filter by email"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                placeholder="Filter by address"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={handleFilterReset}>
              Reset
            </Button>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </form>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="table-container">
          <table className="table-custom">
            <thead>
              <tr>
                <th 
                  className="table-header px-6 py-3 sortable"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon columnKey="name" />
                  </div>
                </th>
                <th 
                  className="table-header px-6 py-3 sortable"
                  onClick={() => requestSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon columnKey="email" />
                  </div>
                </th>
                <th 
                  className="table-header px-6 py-3 sortable"
                  onClick={() => requestSort("address")}
                >
                  <div className="flex items-center">
                    Address
                    <SortIcon columnKey="address" />
                  </div>
                </th>
                <th 
                  className="table-header px-6 py-3 sortable"
                  onClick={() => requestSort("role")}
                >
                  <div className="flex items-center">
                    Role
                    <SortIcon columnKey="role" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="table-cell">{user.name}</td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">{user.address}</td>
                    <td className="table-cell capitalize">{user.role.replace("_", " ")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="table-cell text-center py-8 text-gray-500">
                    No users found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
