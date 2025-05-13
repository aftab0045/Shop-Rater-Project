
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const DEMO_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'Admin123!', address: '123 Admin St', role: 'admin' },
  { id: 2, name: 'Store Owner', email: 'store@example.com', password: 'Store123!', address: '456 Store Ave', role: 'store_owner' },
  { id: 3, name: 'Regular User', email: 'user@example.com', password: 'User123!', address: '789 User Blvd', role: 'user' }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (storedUser && isAuthenticated) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // For demo purposes using mock data
    const user = DEMO_USERS.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Don't store the password in localStorage
      const { password, ...userWithoutPassword } = user;
      
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return { success: true, role: user.role };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const register = (userData) => {
    // In a real app, this would be an API call
    // For now, just simulate a successful registration
    const existingUser = DEMO_USERS.find(user => user.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: 'Email already in use' };
    }
    
    // For demo, we'll just log the registration
    console.log('User registered:', userData);
    
    toast({
      title: "Registration successful",
      description: "You can now login with your credentials",
    });
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updatePassword = (currentPassword, newPassword) => {
    // In a real app, this would verify the current password and update
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated",
    });
    
    return { success: true };
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updatePassword,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
