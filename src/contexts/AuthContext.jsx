
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
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('registeredUsers');
    return storedUsers ? JSON.parse(storedUsers) : DEMO_USERS;
  });
  const { toast } = useToast();

  useEffect(() => {

    const storedUser = localStorage.getItem('currentUser');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (storedUser && isAuthenticated) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }, [users]);

  const login = (email, password) => {
    
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      
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
    const existingUser = users.find(user => user.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: 'Email already in use' };
    }
    
 
    const newUser = {
      id: users.length + 1,
      ...userData,
      role: 'user'
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    
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
   


    
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated",
    });
    
    return { success: true };
  };

  const value = {
    currentUser,
    users,
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
