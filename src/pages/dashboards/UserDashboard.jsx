
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { getStores, getUserRatingForStore, getAverageRatingForStore } = useData();
  const [stores, setStores] = useState([]);

  useEffect(() => {
    
    if (currentUser?.id) {
      const allStores = getStores();
      
      
      const enhancedStores = allStores.map(store => ({
        ...store,
        userRating: getUserRatingForStore(store.id, currentUser.id),
        averageRating: getAverageRatingForStore(store.id)
      }));

      const sortedStores = [...enhancedStores].sort((a, b) => {
        if (a.userRating && !b.userRating) return -1;
        if (!a.userRating && b.userRating) return 1;
        return 0;
      });
      
      setStores(sortedStores);
    }
  }, [currentUser, getStores, getUserRatingForStore, getAverageRatingForStore]);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {currentUser?.name}</h1>
        <Button asChild>
          <Link to="/stores">View All Stores</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Rated Stores</CardTitle>
        </CardHeader>
        <CardContent>
          {stores.filter(store => store.userRating).length > 0 ? (
            <div className="space-y-4">
              {stores
                .filter(store => store.userRating)
                .map((store) => (
                  <Link key={store.id} to={`/stores/${store.id}`}>
                    <div className="bg-white border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{store.name}</h3>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{store.address}</p>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Your Rating</div>
                          <StarRating rating={store.userRating} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Average</div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                            <span>{store.averageRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium mb-1">No rated stores yet</h3>
              <p className="text-gray-500 mb-4">
                You haven't rated any stores yet. Start exploring and leave your feedback!
              </p>
              <Button asChild>
                <Link to="/stores">Browse Stores</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommended Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stores
              .filter(store => !store.userRating)
              .slice(0, 3)
              .map((store) => (
                <Link key={store.id} to={`/stores/${store.id}`}>
                  <div className="bg-white border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{store.name}</h3>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{store.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span>{store.averageRating}</span>
                      </div>
                      <span className="text-blue-500 text-sm">Rate this store</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
