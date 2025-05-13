
import { createContext, useContext, useState } from 'react';
import { useToast } from '../components/ui/use-toast';

const DataContext = createContext({});

export const useData = () => useContext(DataContext);

// Mock data
const DEMO_STORES = [
  { 
    id: 1, 
    name: 'Grocery Store', 
    email: 'grocery@example.com', 
    address: '123 Market St', 
    ownerId: 2,
    ratings: [
      { userId: 3, rating: 4 },
      { userId: 4, rating: 5 }
    ] 
  },
  { 
    id: 2, 
    name: 'Electronics Shop', 
    email: 'electronics@example.com', 
    address: '456 Tech Blvd', 
    ownerId: 5,
    ratings: [
      { userId: 3, rating: 3 }
    ] 
  },
  { 
    id: 3, 
    name: 'Coffee Shop', 
    email: 'coffee@example.com', 
    address: '789 Brew Ave', 
    ownerId: 6,
    ratings: [] 
  }
];

const DEMO_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', address: '123 Admin St', role: 'admin' },
  { id: 2, name: 'Store Owner', email: 'store@example.com', address: '456 Store Ave', role: 'store_owner' },
  { id: 3, name: 'Regular User', email: 'user@example.com', address: '789 User Blvd', role: 'user' },
  { id: 4, name: 'Another User', email: 'user2@example.com', address: '101 User St', role: 'user' },
  { id: 5, name: 'Tech Store Owner', email: 'tech@example.com', address: '202 Tech Rd', role: 'store_owner' },
  { id: 6, name: 'Coffee Store Owner', email: 'coffeeowner@example.com', address: '303 Bean St', role: 'store_owner' }
];

export const DataProvider = ({ children }) => {
  const [stores, setStores] = useState(DEMO_STORES);
  const [users, setUsers] = useState(DEMO_USERS);
  const { toast } = useToast();

  // Store methods
  const getStores = () => {
    return stores;
  };

  const getStoreById = (id) => {
    return stores.find(store => store.id === parseInt(id));
  };

  const getStoresByOwnerId = (ownerId) => {
    return stores.filter(store => store.ownerId === ownerId);
  };

  const addStore = (storeData) => {
    const newStore = {
      id: stores.length + 1,
      ...storeData,
      ratings: []
    };
    
    setStores([...stores, newStore]);
    
    toast({
      title: "Store added",
      description: `${storeData.name} has been successfully added`,
    });
    
    return { success: true, storeId: newStore.id };
  };

  // User methods
  const getUsers = () => {
    return users;
  };

  const getUserById = (id) => {
    return users.find(user => user.id === parseInt(id));
  };

  const addUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData
    };
    
    setUsers([...users, newUser]);
    
    toast({
      title: "User added",
      description: `${userData.name} has been successfully added`,
    });
    
    return { success: true, userId: newUser.id };
  };

  // Rating methods
  const submitRating = (storeId, userId, rating) => {
    const updatedStores = stores.map(store => {
      if (store.id === storeId) {
        // Find existing rating from this user if any
        const existingRatingIndex = store.ratings.findIndex(r => r.userId === userId);
        
        if (existingRatingIndex >= 0) {
          // Update existing rating
          store.ratings[existingRatingIndex].rating = rating;
        } else {
          // Add new rating
          store.ratings.push({ userId, rating });
        }
      }
      return store;
    });
    
    setStores(updatedStores);
    
    toast({
      title: "Rating submitted",
      description: "Your rating has been successfully recorded",
    });
    
    return { success: true };
  };

  const getUserRatingForStore = (storeId, userId) => {
    const store = stores.find(store => store.id === storeId);
    if (!store) return null;
    
    const userRating = store.ratings.find(rating => rating.userId === userId);
    return userRating ? userRating.rating : null;
  };

  const getAverageRatingForStore = (storeId) => {
    const store = stores.find(store => store.id === storeId);
    if (!store || store.ratings.length === 0) return 0;
    
    const sum = store.ratings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / store.ratings.length).toFixed(1);
  };

  const getUsersWhoRatedStore = (storeId) => {
    const store = stores.find(store => store.id === storeId);
    if (!store) return [];
    
    return store.ratings.map(rating => {
      const user = users.find(user => user.id === rating.userId);
      return {
        ...user,
        rating: rating.rating
      };
    });
  };

  // Stats methods
  const getStats = () => {
    return {
      totalUsers: users.filter(user => user.role !== 'admin').length,
      totalStores: stores.length,
      totalRatings: stores.reduce((total, store) => total + store.ratings.length, 0)
    };
  };

  const value = {
    // Store methods
    getStores,
    getStoreById,
    getStoresByOwnerId,
    addStore,
    
    // User methods
    getUsers,
    getUserById,
    addUser,
    
    // Rating methods
    submitRating,
    getUserRatingForStore,
    getAverageRatingForStore,
    getUsersWhoRatedStore,
    
    // Stats methods
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
