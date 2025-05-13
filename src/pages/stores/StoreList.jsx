
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, Search, MapPin } from "lucide-react";

const StoreList = () => {
  const { currentUser } = useAuth();
  const { getStores, getUserRatingForStore, getAverageRatingForStore } = useData();
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentUser?.id) {
      // Fetch all stores and enhance with ratings
      const allStores = getStores();
      
      // Add user rating and average rating
      const enhancedStores = allStores.map(store => ({
        ...store,
        userRating: getUserRatingForStore(store.id, currentUser.id),
        averageRating: getAverageRatingForStore(store.id)
      }));
      
      setStores(enhancedStores);
      setFilteredStores(enhancedStores);
    }
  }, [currentUser, getStores, getUserRatingForStore, getAverageRatingForStore]);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredStores(stores);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = stores.filter(store => 
      store.name.toLowerCase().includes(query) || 
      store.address.toLowerCase().includes(query)
    );
    
    setFilteredStores(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredStores(stores);
  };

  // Generate star rating display
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
      
      {/* Search bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Stores
          </label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Search by name or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearSearch}>
            Clear
          </Button>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      
      {/* Store list */}
      {filteredStores.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <Link to={`/stores/${store.id}`} key={store.id}>
              <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-start mb-3">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{store.address}</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Average Rating</div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
                        <span className="text-lg font-semibold">{store.averageRating}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Your Rating</div>
                      {store.userRating ? (
                        <StarRating rating={store.userRating} />
                      ) : (
                        <span className="text-blue-600 text-sm">Rate now</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No stores found</h3>
          <p className="mt-2 text-gray-500">
            No stores match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreList;
