
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Mail, Users } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getStoreById, getUserRatingForStore, getAverageRatingForStore, submitRating } = useData();
  const { toast } = useToast();
  
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch store details
    const storeData = getStoreById(id);
    
    if (!storeData) {
      toast({
        title: "Store not found",
        description: "The store you're looking for does not exist",
        variant: "destructive",
      });
      navigate("/stores");
      return;
    }
    
    // Get user's current rating for this store
    const currentUserRating = getUserRatingForStore(storeData.id, currentUser?.id);
    setUserRating(currentUserRating || 0);
    
    // Enhanced store with average rating
    const averageRating = getAverageRatingForStore(storeData.id);
    setStore({
      ...storeData,
      averageRating
    });
  }, [id, currentUser, getStoreById, getUserRatingForStore, getAverageRatingForStore, navigate, toast]);

  const handleRatingSubmit = async (rating) => {
    setIsLoading(true);
    
    try {
      const result = await submitRating(store.id, currentUser.id, rating);
      
      if (result.success) {
        setUserRating(rating);
        
        // Update average rating
        const newAverageRating = getAverageRatingForStore(store.id);
        setStore(prev => ({
          ...prev,
          averageRating: newAverageRating
        }));
        
        toast({
          title: "Rating submitted",
          description: "Your rating has been successfully saved",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit rating",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Rating submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!store) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Define rating stars component
  const RatingStars = ({ userRating, onRatingChange, disabled }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <span
            key={rating}
            onClick={() => !disabled && onRatingChange(rating)}
            onMouseEnter={() => !disabled && setHoverRating(rating)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            className={`cursor-pointer transition-colors ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          >
            <Star
              className={`h-8 w-8 ${
                (hoverRating ? rating <= hoverRating : rating <= userRating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{store.name}</h1>
        <Button variant="outline" onClick={() => navigate("/stores")}>
          Back to Stores
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Store Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <span>{store.address}</span>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <span>{store.email}</span>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <span>{store.ratings?.length || 0} ratings</span>
            </div>
            
            <div className="flex items-center mt-3">
              <Star className="h-6 w-6 text-yellow-400 mr-2" fill="currentColor" />
              <span className="text-2xl font-bold">{store.averageRating}</span>
              <span className="text-gray-500 ml-2">average rating</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Rating Card */}
        <Card>
          <CardHeader>
            <CardTitle>Rate this Store</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <p className="mb-4 text-gray-600">
                  {userRating ? "Your current rating:" : "Select your rating:"}
                </p>
                <RatingStars
                  userRating={userRating}
                  onRatingChange={handleRatingSubmit}
                  disabled={isLoading}
                />
                
                {userRating > 0 && (
                  <p className="mt-4 text-sm text-gray-500">
                    Click on the stars again to change your rating
                  </p>
                )}
                
                {isLoading && (
                  <div className="mt-4 flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreDetails;
