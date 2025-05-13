
import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Search, Plus, Star } from "lucide-react";

const ManageStores = () => {
  const { getStores, getAverageRatingForStore } = useData();
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    

    const allStores = getStores().map(store => ({
      ...store,
      averageRating: getAverageRatingForStore(store.id)
    }));
    
    setStores(allStores);
    setFilteredStores(allStores);
  }, [getStores, getAverageRatingForStore]);

  const applyFilters = () => {
    let result = [...stores];
    
  
    if (filters.name) {
      result = result.filter(store => 
        store.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.email) {
      result = result.filter(store => 
        store.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    if (filters.address) {
      result = result.filter(store => 
        store.address.toLowerCase().includes(filters.address.toLowerCase())
      );
    }
    
    setFilteredStores(result);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
    
  
    if (key === "averageRating") {
      const sortedStores = [...filteredStores].sort((a, b) => {
        const ratingA = parseFloat(a[key]);
        const ratingB = parseFloat(b[key]);
        
        if (ratingA < ratingB) {
          return direction === "ascending" ? -1 : 1;
        }
        if (ratingA > ratingB) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
      
      setFilteredStores(sortedStores);
      return;
    }
    

    const sortedStores = [...filteredStores].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredStores(sortedStores);
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
      address: ""
    });
    setFilteredStores(stores);
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
        <h1 className="text-2xl font-bold tracking-tight">Manage Stores</h1>
        <Button asChild>
          <Link to="/admin/add-store">
            <Plus className="h-4 w-4 mr-2" />
            Add Store
          </Link>
        </Button>
      </div>

      {/* Filter form */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
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

      {/* Stores table */}
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
                  onClick={() => requestSort("averageRating")}
                >
                  <div className="flex items-center">
                    Rating
                    <SortIcon columnKey="averageRating" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="table-cell">{store.name}</td>
                    <td className="table-cell">{store.email}</td>
                    <td className="table-cell">{store.address}</td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span>{store.averageRating}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="table-cell text-center py-8 text-gray-500">
                    No stores found matching filters.
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

export default ManageStores;
