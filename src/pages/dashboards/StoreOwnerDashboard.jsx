
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const StoreOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const { getStoresByOwnerId, getAverageRatingForStore, getUsersWhoRatedStore } = useData();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [usersWhoRated, setUsersWhoRated] = useState([]);

  useEffect(() => {
  
    if (currentUser?.id) {
      const userStores = getStoresByOwnerId(currentUser.id);
      
      
      const enhancedStores = userStores.map(store => ({
        ...store,
        averageRating: getAverageRatingForStore(store.id)
      }));
      
      setStores(enhancedStores);
      
  
      if (enhancedStores.length > 0 && !selectedStore) {
        setSelectedStore(enhancedStores[0]);
      }
    }
  }, [currentUser, getStoresByOwnerId, getAverageRatingForStore, selectedStore]);

  useEffect(() => {
   
    if (selectedStore) {
      const ratingUsers = getUsersWhoRatedStore(selectedStore.id);
      setUsersWhoRated(ratingUsers);
    }
  }, [selectedStore, getUsersWhoRatedStore]);

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
        <span className="ml-2 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Store Owner Dashboard</h1>
      
      {stores.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className={`p-4 rounded-lg cursor-pointer ${
                        selectedStore?.id === store.id
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white border border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedStore(store)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{store.name}</h3>
                        <div className="flex items-center">
                          <Star
                            className="h-4 w-4 text-yellow-400 mr-1"
                            fill="currentColor"
                          />
                          <span>{store.averageRating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                      <p className="text-sm text-gray-500">{store.email}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {selectedStore && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Store Details: {selectedStore.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Average Rating</span>
                      <div className="flex items-center">
                        <Star
                          className="h-5 w-5 text-yellow-400 mr-1"
                          fill="currentColor"
                        />
                        <span className="font-bold">{selectedStore.averageRating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Ratings</span>
                      <span className="font-bold">{selectedStore.ratings?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Users Who Rated</h3>
                    {usersWhoRated.length > 0 ? (
                      <div className="space-y-2">
                        {usersWhoRated.map((user, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                            <StarRating rating={user.rating} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No ratings yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No stores found</h3>
              <p className="text-gray-500 mt-2">
                You don't have any stores assigned to your account.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
