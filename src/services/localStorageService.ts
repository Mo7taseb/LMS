import { 
  User, 
  Category, 
  Course, 
  Instructor, 
  CourseDetails, 
  UserProgress, 
  Assessment
} from '@/data/types';
import { 
  categories as defaultCategories, 
  courses as defaultCourses,
  courseDetails as defaultCourseDetails,
  currentUser as defaultCurrentUser,
  instructors as defaultInstructors,
  mockUsers as defaultUsers,
  userProgress as defaultUserProgress,
  enrolledCourses as defaultEnrolledCourses
} from '@/data/mockData';

// Keys for localStorage
const STORAGE_KEYS = {
  USERS: 'lms_users',
  CURRENT_USER: 'lms_current_user',
  CATEGORIES: 'lms_categories',
  COURSES: 'lms_courses',
  COURSE_DETAILS: 'lms_course_details',
  INSTRUCTORS: 'lms_instructors',
  USER_PROGRESS: 'lms_user_progress',
  ENROLLED_COURSES: 'lms_enrolled_courses',
  AUTH_TOKEN: 'lms_auth_token'
};

// Initialize localStorage with default data if not already set
const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultCurrentUser));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(defaultCourses));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.COURSE_DETAILS)) {
    localStorage.setItem(STORAGE_KEYS.COURSE_DETAILS, JSON.stringify(defaultCourseDetails));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.INSTRUCTORS)) {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(defaultInstructors));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)) {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(defaultUserProgress));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ENROLLED_COURSES)) {
    localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(defaultEnrolledCourses));
  }
};

// Generic getter function for any data type
const getData = <T>(key: string): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) as T : null;
};

// Generic setter function for any data type
const setData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// User related operations
export const userService = {
  getAll: (): User[] => {
    return getData<User[]>(STORAGE_KEYS.USERS) || [];
  },
  
  getById: (id: string): User | undefined => {
    const users = getData<User[]>(STORAGE_KEYS.USERS) || [];
    return users.find(user => user.id === id);
  },
  
  getByEmail: (email: string): User | undefined => {
    const users = getData<User[]>(STORAGE_KEYS.USERS) || [];
    return users.find(user => user.email === email);
  },
  
  create: (user: Omit<User, 'id'>): User => {
    const users = getData<User[]>(STORAGE_KEYS.USERS) || [];
    const newUser: User = {
      ...user,
      id: `user${users.length + 1}`,
      avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    users.push(newUser);
    setData(STORAGE_KEYS.USERS, users);
    
    return newUser;
  },
  
  update: (id: string, userData: Partial<User>): User => {
    const users = getData<User[]>(STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...userData
    };
    
    users[userIndex] = updatedUser;
    setData(STORAGE_KEYS.USERS, users);
    
    // If updating the current user, update the current user in localStorage too
    const currentUser = getData<User>(STORAGE_KEYS.CURRENT_USER);
    if (currentUser && currentUser.id === id) {
      setData(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }
    
    return updatedUser;
  },
  
  delete: (id: string): void => {
    const users = getData<User[]>(STORAGE_KEYS.USERS) || [];
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    setData(STORAGE_KEYS.USERS, filteredUsers);
    
    // If deleting the current user, clear the current user
    const currentUser = getData<User>(STORAGE_KEYS.CURRENT_USER);
    if (currentUser && currentUser.id === id) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};

// Authentication related operations
export const authService = {
  login: (email: string, password: string): { token: string; user: User } => {
    // In a real app, you would validate the password
    const user = userService.getByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Set the current user
    setData(STORAGE_KEYS.CURRENT_USER, user);
    
    // Generate a fake token
    const token = `mock-auth-token-${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    
    return {
      token,
      user
    };
  },
  
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'instructor' | 'admin';
  }): { token: string; user: User } => {
    // Check if user already exists
    const existingUser = userService.getByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = userService.create({
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student'
    });
    
    // Set the current user
    setData(STORAGE_KEYS.CURRENT_USER, newUser);
    
    // Generate a fake token
    const token = `mock-auth-token-${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    
    return {
      token,
      user: newUser
    };
  },
  
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  getCurrentUser: (): User | null => {
    return getData<User>(STORAGE_KEYS.CURRENT_USER);
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

// Course related operations
export const courseService = {
  getAll: (): Course[] => {
    return getData<Course[]>(STORAGE_KEYS.COURSES) || [];
  },
  
  getById: (id: string): Course | undefined => {
    const courses = getData<Course[]>(STORAGE_KEYS.COURSES) || [];
    return courses.find(course => course.id === id);
  },
  
  getBySlug: (slug: string): Course | undefined => {
    const courses = getData<Course[]>(STORAGE_KEYS.COURSES) || [];
    return courses.find(course => course.slug === slug);
  },
  
  getCourseDetails: (id: string): CourseDetails | undefined => {
    const courseDetails = getData<CourseDetails>(STORAGE_KEYS.COURSE_DETAILS);
    if (courseDetails && courseDetails.id === id) {
      return courseDetails;
    }
    
    // If we don't have details for this specific course, return the default
    // In a real app, you would have multiple course details objects
    return courseDetails;
  },
  
  create: (course: Omit<Course, 'id'>): Course => {
    const courses = getData<Course[]>(STORAGE_KEYS.COURSES) || [];
    const newCourse: Course = {
      ...course,
      id: `course${courses.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      rating: 0,
      ratingCount: 0,
      enrolledStudents: 0
    };
    
    courses.push(newCourse);
    setData(STORAGE_KEYS.COURSES, courses);
    
    return newCourse;
  },
  
  update: (id: string, courseData: Partial<Course>): Course => {
    const courses = getData<Course[]>(STORAGE_KEYS.COURSES) || [];
    const courseIndex = courses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${id} not found`);
    }
    
    const updatedCourse = {
      ...courses[courseIndex],
      ...courseData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    courses[courseIndex] = updatedCourse;
    setData(STORAGE_KEYS.COURSES, courses);
    
    return updatedCourse;
  },
  
  delete: (id: string): void => {
    const courses = getData<Course[]>(STORAGE_KEYS.COURSES) || [];
    const filteredCourses = courses.filter(course => course.id !== id);
    
    if (filteredCourses.length === courses.length) {
      throw new Error(`Course with ID ${id} not found`);
    }
    
    setData(STORAGE_KEYS.COURSES, filteredCourses);
  },
  
  getEnrolled: (): Course[] => {
    return getData<Course[]>(STORAGE_KEYS.ENROLLED_COURSES) || [];
  },
  
  enroll: (courseId: string): void => {
    const course = courseService.getById(courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
    const enrolledCourses = getData<Course[]>(STORAGE_KEYS.ENROLLED_COURSES) || [];
    
    // Check if already enrolled
    if (enrolledCourses.some(c => c.id === courseId)) {
      return; // Already enrolled
    }
    
    enrolledCourses.push(course);
    setData(STORAGE_KEYS.ENROLLED_COURSES, enrolledCourses);
    
    // Update the course's enrolled students count
    courseService.update(courseId, {
      enrolledStudents: course.enrolledStudents + 1
    });
  },
  
  unenroll: (courseId: string): void => {
    const enrolledCourses = getData<Course[]>(STORAGE_KEYS.ENROLLED_COURSES) || [];
    const filteredCourses = enrolledCourses.filter(course => course.id !== courseId);
    
    if (filteredCourses.length === enrolledCourses.length) {
      throw new Error(`Not enrolled in course with ID ${courseId}`);
    }
    
    setData(STORAGE_KEYS.ENROLLED_COURSES, filteredCourses);
    
    // Update the course's enrolled students count
    const course = courseService.getById(courseId);
    if (course) {
      courseService.update(courseId, {
        enrolledStudents: Math.max(0, course.enrolledStudents - 1)
      });
    }
  }
};

// Category related operations
export const categoryService = {
  getAll: (): Category[] => {
    return getData<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
  },
  
  getById: (id: string): Category | undefined => {
    const categories = getData<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    return categories.find(category => category.id === id);
  },
  
  getBySlug: (slug: string): Category | undefined => {
    const categories = getData<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    return categories.find(category => category.slug === slug);
  },
  
  create: (category: Omit<Category, 'id'>): Category => {
    const categories = getData<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    const newCategory: Category = {
      ...category,
      id: `cat${categories.length + 1}`
    };
    
    categories.push(newCategory);
    setData(STORAGE_KEYS.CATEGORIES, categories);
    
    return newCategory;
  },
  
  update: (id: string, categoryData: Partial<Category>): Category => {
    const categories = getData<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...categoryData
    };
    
    categories[categoryIndex] = updatedCategory;
    setData(STORAGE_KEYS.CATEGORIES, categories);
    
    return updatedCategory;
  },
  
  delete: (id: string): void => {
    const categories = getData<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    const filteredCategories = categories.filter(category => category.id !== id);
    
    if (filteredCategories.length === categories.length) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    setData(STORAGE_KEYS.CATEGORIES, filteredCategories);
  }
};

// Instructor related operations
export const instructorService = {
  getAll: (): Instructor[] => {
    return getData<Instructor[]>(STORAGE_KEYS.INSTRUCTORS) || [];
  },
  
  getById: (id: string): Instructor | undefined => {
    const instructors = getData<Instructor[]>(STORAGE_KEYS.INSTRUCTORS) || [];
    return instructors.find(instructor => instructor.id === id);
  },
  
  create: (instructor: Omit<Instructor, 'id'>): Instructor => {
    const instructors = getData<Instructor[]>(STORAGE_KEYS.INSTRUCTORS) || [];
    const newInstructor: Instructor = {
      ...instructor,
      id: `ins${instructors.length + 1}`
    };
    
    instructors.push(newInstructor);
    setData(STORAGE_KEYS.INSTRUCTORS, instructors);
    
    return newInstructor;
  },
  
  update: (id: string, instructorData: Partial<Instructor>): Instructor => {
    const instructors = getData<Instructor[]>(STORAGE_KEYS.INSTRUCTORS) || [];
    const instructorIndex = instructors.findIndex(instructor => instructor.id === id);
    
    if (instructorIndex === -1) {
      throw new Error(`Instructor with ID ${id} not found`);
    }
    
    const updatedInstructor = {
      ...instructors[instructorIndex],
      ...instructorData
    };
    
    instructors[instructorIndex] = updatedInstructor;
    setData(STORAGE_KEYS.INSTRUCTORS, instructors);
    
    return updatedInstructor;
  },
  
  delete: (id: string): void => {
    const instructors = getData<Instructor[]>(STORAGE_KEYS.INSTRUCTORS) || [];
    const filteredInstructors = instructors.filter(instructor => instructor.id !== id);
    
    if (filteredInstructors.length === instructors.length) {
      throw new Error(`Instructor with ID ${id} not found`);
    }
    
    setData(STORAGE_KEYS.INSTRUCTORS, filteredInstructors);
  }
};

// User progress related operations
export const userProgressService = {
  getAll: (): UserProgress[] => {
    return getData<UserProgress[]>(STORAGE_KEYS.USER_PROGRESS) || [];
  },
  
  getByCourseId: (courseId: string): UserProgress | undefined => {
    const progress = getData<UserProgress[]>(STORAGE_KEYS.USER_PROGRESS) || [];
    return progress.find(p => p.courseId === courseId);
  },
  
  update: (courseId: string, progressData: Partial<UserProgress>): UserProgress => {
    const allProgress = getData<UserProgress[]>(STORAGE_KEYS.USER_PROGRESS) || [];
    const progressIndex = allProgress.findIndex(p => p.courseId === courseId);
    
    // If progress doesn't exist yet, create it
    if (progressIndex === -1) {
      const newProgress: UserProgress = {
        courseId,
        completedLessons: progressData.completedLessons || [],
        quizScores: progressData.quizScores || {},
        lastAccessed: new Date().toISOString(),
        progress: progressData.progress || 0
      };
      
      allProgress.push(newProgress);
      setData(STORAGE_KEYS.USER_PROGRESS, allProgress);
      return newProgress;
    }
    
    // Update existing progress
    const updatedProgress = {
      ...allProgress[progressIndex],
      ...progressData,
      lastAccessed: new Date().toISOString()
    };
    
    allProgress[progressIndex] = updatedProgress;
    setData(STORAGE_KEYS.USER_PROGRESS, allProgress);
    
    return updatedProgress;
  }
};

// Initialize localStorage with default data
initializeLocalStorage();

export default {
  userService,
  authService,
  courseService,
  categoryService,
  instructorService,
  userProgressService,
  initializeLocalStorage
};