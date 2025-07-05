import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  AuthResponse, 
  Course, 
  CourseDetails, 
  LoginRequest, 
  RegisterRequest, 
  User 
} from '@/data/types';
import { 
  authService, 
  userService, 
  courseService 
} from './localStorageService';

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api';

console.log("Connecting to backend at:", API_URL);

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lms_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`API Request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response from: ${response.config.url}`, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error.message, error.response?.status);
    
    // Handle 401 errors (unauthorized) - redirect to login page
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs using localStorage data service
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log('Attempting login with localStorage data:', credentials.email);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      return authService.login(credentials.email, credentials.password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    console.log('Attempting registration with localStorage data:', userData.email);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      return authService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    console.log('Logging out user');
    authService.logout();
  },
  
  getCurrentUser: async (): Promise<User> => {
    console.log('Fetching current user from localStorage');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }
    
    return user;
  }
};

// User APIs using localStorage data service
export const userApi = {
  getUsers: async (): Promise<User[]> => {
    console.log('Fetching users from localStorage');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return userService.getAll();
  },
  
  getUserById: async (id: string): Promise<User> => {
    console.log(`Fetching user with ID: ${id} from localStorage`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = userService.getById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return user;
  },
  
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    console.log('Creating new user with localStorage:', userData);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return userService.create(userData);
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    console.log(`Updating user with ID: ${id} using localStorage`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return userService.update(id, userData);
  },
  
  deleteUser: async (id: string): Promise<void> => {
    console.log(`Deleting user with ID: ${id} using localStorage`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    userService.delete(id);
  }
};

// Course APIs using localStorage data service
export const coursesApi = {
  getAllCourses: async (): Promise<Course[]> => {
    console.log('Fetching all courses from localStorage');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return courseService.getAll();
  },
  
  getCourseBySlug: async (slug: string): Promise<CourseDetails | null> => {
    console.log(`Fetching course details for slug: ${slug}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the course with the matching slug
    const course = courseService.getBySlug(slug);
    if (!course) {
      console.error(`Course not found for slug: ${slug}`);
      return null;
    }
    
    // Get course details
    const details = courseService.getCourseDetails(course.id);
    if (!details) {
      console.error(`Course details not found for ID: ${course.id}`);
      return null;
    }
    
    return details;
  },
  
  getEnrolledCourses: async (): Promise<Course[]> => {
    console.log('Fetching enrolled courses from localStorage');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return courseService.getEnrolled();
  },
  
  enrollInCourse: async (courseId: string): Promise<{ success: boolean }> => {
    console.log(`Enrolling in course: ${courseId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      courseService.enroll(courseId);
      return { success: true };
    } catch (error) {
      console.error("Enrollment error:", error);
      return { success: false };
    }
  }
};

// Export the axios instance for other custom API calls
export default apiClient;
