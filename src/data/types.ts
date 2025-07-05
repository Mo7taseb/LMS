export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "instructor" | "admin";
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  expertise: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  price: number;
  discountPrice?: number;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  categories: Category[];
  rating: number;
  ratingCount: number;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  totalLessons?: number;
  overview?: string;
  modules?: Module[];
  studentsCount?: number;
  reviewsCount?: number;
}

export interface Module {
  title: string;
  lessons: {
    title: string;
    duration: string;
  }[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface ContentResource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: "pdf" | "video" | "link";
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "quiz" | "assignment" | "text";
  duration: string;
  videoUrl?: string;
  content?: string;
  completed?: boolean;
  locked?: boolean;
  resources?: ContentResource[];
  quiz?: Quiz;
}

export interface CourseDetails extends Course {
  sections: Section[];
  objectives: string[];
  requirements: string[];
  totalLessons: number;
  totalDuration: string;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastAccessed: string;
  progress: number;
}

export interface UserCourses {
  enrolled: Course[];
  wishlist: Course[];
  progress: UserProgress[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: AssessmentQuestion[];
  courseId: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: AssessmentOption[];
  correctAnswer: string;
  explanation?: string;
}

export interface AssessmentOption {
  id: string;
  text: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  completedAt: string;
  timeSpent: number;
}

// API interfaces for backend connection
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: "student" | "instructor" | "admin";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}
