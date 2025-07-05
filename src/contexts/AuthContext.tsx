import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/data/types';
import { authApi, userApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/localStorageService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>; // Added updateUser function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in on component mount
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (isAuthenticated && currentUser) {
      setUser(currentUser);
    }

    setIsLoading(false);
  }, []);

  const handleAuth = (response: AuthResponse) => {
    setUser(response.user);
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      handleAuth(response);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${response.user.name}!`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      handleAuth(response);
      toast({
        title: 'Registration successful',
        description: `Welcome, ${response.user.name}!`,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration failed',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Function to update user information
  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      if (user) {
        // Use the API to update the user
        const updatedUser = await userApi.updateUser(user.id, userData);
        setUser(updatedUser);

        toast({
          title: 'Profile Updated',
          description: 'Your profile information has been updated successfully.',
        });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
