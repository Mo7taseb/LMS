import apiClient from './api';
import { Course, CourseDetails, UserProgress, ContentResource } from '@/data/types';
import { courses, courseDetails } from '@/data/mockData';
import { courseService } from './localStorageService';

// Mock data for course progress
const userProgressData: UserProgress[] = [
  {
    courseId: "1",
    completedLessons: ["lesson1", "lesson2", "lesson3"],
    quizScores: { "quiz1": 85 },
    lastAccessed: new Date().toISOString(),
    progress: 30
  },
  {
    courseId: "2",
    completedLessons: ["lesson1"],
    quizScores: {},
    lastAccessed: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    progress: 10
  }
];

// Mock lesson resources
const lessonResources: Record<string, ContentResource[]> = {
  "lesson1": [
    {
      id: "resource1",
      title: "Introduction to React Hooks - PDF Guide",
      description: "Complete guide to understanding React hooks",
      url: "/resources/react-hooks-guide.pdf",
      type: "pdf"
    },
    {
      id: "resource2",
      title: "React Hooks Demo Video",
      description: "Watch demonstration of using hooks",
      url: "https://www.example.com/videos/hooks-demo",
      type: "video"
    }
  ],
  "lesson2": [
    {
      id: "resource3",
      title: "Component Lifecycle Cheatsheet",
      description: "Quick reference for React component lifecycle",
      url: "/resources/lifecycle-cheatsheet.pdf",
      type: "pdf"
    }
  ]
};

export const coursesApi = {
  // Get a course by ID (used in CourseDetailsPage)
  getCourseById: async (id: string | number): Promise<Course> => {
    const courseId = String(id);
    console.log(`Fetching course with ID: ${courseId}`);
    try {
      // First try to get the course from localStorage
      const storedCourse = courseService.getById(courseId);
      if (storedCourse) {
        return {
          ...storedCourse,
          modules: courseDetails.modules,
          instructor: courseDetails.instructor
        };
      }

      // If not in localStorage, fall back to mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
      }

      // Save to localStorage for persistence
      courseService.update(course.id, course);

      return {
        ...course,
        modules: courseDetails.modules, // Add modules from mock data
        instructor: courseDetails.instructor // Ensure instructor data
      };
    } catch (error) {
      console.error(`Error fetching course with ID ${courseId}:`, error);
      throw error;
    }
  },

  // Get course by slug
  getCourseBySlug: async (slug: string): Promise<CourseDetails> => {
    console.log(`Fetching course with slug: ${slug}`);
    try {
      // First try to get from localStorage
      const storedCourse = courseService.getBySlug(slug);
      // Using mock data instead of making an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Find course with matching slug
      const course = storedCourse || courses.find(c => c.slug === slug);
      if (!course) {
        throw new Error(`Course with slug ${slug} not found`);
      }

      // Save to localStorage for persistence
      if (!storedCourse) {
        courseService.update(course.id, course);
      }
      
      // Create mock sections and lessons for this course
      const mockSections = [
        {
          id: "section1",
          title: "Getting Started",
          lessons: [
            {
              id: "lesson1",
              title: "Introduction to the Course",
              type: "video" as const,
              duration: "10:23",
              videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
              completed: false,
              resources: lessonResources.lesson1
            },
            {
              id: "lesson2",
              title: "Setting Up Your Environment",
              type: "video" as const,
              duration: "15:45",
              videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
              completed: false,
              resources: lessonResources.lesson2
            }
          ]
        },
        {
          id: "section2",
          title: "Core Concepts",
          lessons: [
            {
              id: "lesson3",
              title: "Understanding the Basics",
              type: "video" as const,
              duration: "20:15",
              videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
              completed: false
            },
            {
              id: "lesson4",
              title: "Working with Data",
              type: "text" as const,
              duration: "15 min read",
              content: "<h2>Working with Data</h2><p>In this lesson, we'll explore how to work with data effectively in your applications.</p><p>Data handling is one of the most important aspects of modern web development.</p><ul><li>Data fetching strategies</li><li>State management</li><li>Data persistence</li></ul>",
              completed: false
            },
            {
              id: "lesson5",
              title: "Basic Concepts Quiz",
              type: "quiz" as const,
              duration: "10 min",
              quiz: {
                questions: [
                  {
                    id: "q1",
                    text: "What is React primarily used for?",
                    options: [
                      { id: "a", text: "Server-side rendering" },
                      { id: "b", text: "Building user interfaces" },
                      { id: "c", text: "Database management" },
                      { id: "d", text: "Network requests" }
                    ],
                    correctAnswer: "b"
                  }
                ]
              },
              completed: false
            }
          ]
        },
        {
          id: "section3",
          title: "Advanced Topics",
          lessons: [
            {
              id: "lesson6",
              title: "Performance Optimization",
              type: "video" as const,
              duration: "18:30",
              videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
              completed: false
            },
            {
              id: "lesson7",
              title: "Security Best Practices",
              type: "text" as const,
              duration: "20 min read",
              content: "<h2>Security Best Practices</h2><p>Security is essential for building robust applications.</p><p>In this lesson, we'll cover the most important security considerations.</p>",
              completed: false
            }
          ]
        }
      ];
      
      // Create a mock course details object
      const courseDetails: CourseDetails = {
        ...course,
        sections: mockSections,
        objectives: [
          "Understand core principles",
          "Build professional applications",
          "Implement best practices"
        ],
        requirements: [
          "Basic understanding of programming",
          "Familiarity with web technologies",
          "A computer with internet access"
        ],
        totalLessons: mockSections.reduce((acc, section) => acc + section.lessons.length, 0),
        totalDuration: "4 hours 30 minutes"
      };
      
      return courseDetails;
    } catch (error) {
      console.error(`Error fetching course with slug ${slug}:`, error);
      throw error;
    }
  },

  // Get all available courses
  getAllCourses: async (): Promise<Course[]> => {
    console.log('Fetching all courses');
    try {
      // First try to get courses from localStorage
      const storedCourses = courseService.getAll();
      if (storedCourses && storedCourses.length > 0) {
        return storedCourses;
      }

      // If no courses in localStorage, use mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Save courses to localStorage for persistence
      courses.forEach(course => {
        courseService.update(course.id, course);
      });
      
      return courses;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      return [];
    }
  },

  // Get enrolled courses for the current user
  getEnrolledCourses: async (): Promise<Course[]> => {
    console.log('Fetching enrolled courses');
    try {
      // Get enrolled courses from localStorage
      const enrolledCourses = courseService.getEnrolled();
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      if (enrolledCourses && enrolledCourses.length > 0) {
        return enrolledCourses;
      }
      
      // If no enrolled courses in localStorage yet, use mock data (first 3 courses)
      const defaultEnrolledCourses = courses.slice(0, 3);
      
      // Save these to localStorage for persistence
      defaultEnrolledCourses.forEach(course => {
        courseService.enroll(course.id);
      });
      
      return defaultEnrolledCourses;
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      return [];
    }
  },

  // Enroll in a course
  enrollInCourse: async (courseId: string): Promise<{ success: boolean }> => {
    console.log(`Enrolling in course ${courseId}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      courseService.enroll(courseId);
      return { success: true };
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      return { success: false };
    }
  },

  // Get progress for a specific course
  getCourseProgress: async (courseId: string): Promise<UserProgress | null> => {
    console.log(`Fetching course progress for course ID: ${courseId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find progress data for this course
    const progress = userProgressData.find(p => p.courseId === courseId);
    
    // If no progress data exists, create initial progress data
    if (!progress) {
      return {
        courseId,
        completedLessons: [],
        quizScores: {},
        lastAccessed: new Date().toISOString(),
        progress: 0
      };
    }
    
    return progress;
  },

  // Mark a lesson as complete
  markLessonComplete: async (courseId: string, lessonId: string): Promise<UserProgress> => {
    console.log(`Marking lesson ${lessonId} as complete for course ${courseId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find or create progress data for this course
    let progress = userProgressData.find(p => p.courseId === courseId);
    
    if (!progress) {
      // Create new progress entry
      progress = {
        courseId,
        completedLessons: [lessonId],
        quizScores: {},
        lastAccessed: new Date().toISOString(),
        progress: 0
      };
      userProgressData.push(progress);
    } else {
      // Update existing progress
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      progress.lastAccessed = new Date().toISOString();
    }
    
    // Calculate new progress percentage (mock implementation)
    // In a real app, we would count the total lessons in the course
    const mockCourse = await coursesApi.getCourseBySlug(courses.find(c => c.id === courseId)?.slug || "");
    const totalLessons = mockCourse.sections.reduce((acc, section) => 
      acc + section.lessons.length, 0);
    
    progress.progress = Math.round((progress.completedLessons.length / totalLessons) * 100);
    
    return progress;
  },

  // Submit quiz answers
  submitQuizAnswers: async (
    courseId: string, 
    lessonId: string, 
    answers: Record<string, string>
  ): Promise<{score: number, passed: boolean}> => {
    console.log(`Submitting quiz answers for lesson ${lessonId} in course ${courseId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Mock score calculation (in a real app, this would compare with correct answers)
    const score = Math.round(Math.random() * 30) + 70; // Random score between 70-100
    const passed = score >= 70;
    
    // Update progress data
    const progress = userProgressData.find(p => p.courseId === courseId);
    if (progress) {
      progress.quizScores[lessonId] = score;
      if (passed && !progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        
        // Recalculate progress percentage
        const mockCourse = await coursesApi.getCourseBySlug(courses.find(c => c.id === courseId)?.slug || "");
        const totalLessons = mockCourse.sections.reduce((acc, section) => 
          acc + section.lessons.length, 0);
        
        progress.progress = Math.round((progress.completedLessons.length / totalLessons) * 100);
      }
    }
    
    return { score, passed };
  },

  // Create a new course (for instructors/admins)
  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    console.log('Creating new course:', courseData);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new course with a unique ID
      const existingCourses = courseService.getAll();
      const newId = String(existingCourses.length + 1);
      
      const newCourse: Course = {
        id: newId,
        title: courseData.title || 'New Course',
        slug: courseData.title?.toLowerCase().replace(/\s+/g, '-') || `course-${Date.now()}`,
        description: courseData.description || '',
        level: courseData.level || 'beginner',
        price: courseData.price || 0,
        discountPrice: courseData.discountPrice,
        thumbnail: courseData.thumbnail || '/placeholder.svg',
        duration: courseData.duration || '0 hours',
        rating: 0,
        ratingCount: 0,
        enrolledStudents: 0,
        categories: courseData.categories || [],
        instructor: courseDetails.instructor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage for persistence
      courseService.create(newCourse);
      
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update an existing course
  updateCourse: async (id: string | number, courseData: Partial<Course>): Promise<Course> => {
    const courseId = String(id);
    console.log(`Updating course with ID: ${courseId}`);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the existing course
      const existingCourse = courseService.getById(courseId);
      if (!existingCourse) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      
      // Update the course
      const updatedCourse = {
        ...existingCourse,
        ...courseData,
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage for persistence
      courseService.update(courseId, updatedCourse);
      
      return updatedCourse;
    } catch (error) {
      console.error(`Error updating course with ID ${courseId}:`, error);
      throw error;
    }
  },

  // Delete a course (admin only)
  deleteCourse: async (id: string | number): Promise<void> => {
    const courseId = String(id);
    console.log(`Deleting course with ID: ${courseId}`);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Delete from localStorage
      courseService.delete(courseId);
    } catch (error) {
      console.error(`Error deleting course with ID ${courseId}:`, error);
      throw error;
    }
  },

  // Assign instructor to a course
  assignInstructor: async (courseId: number, instructorId: number): Promise<Course> => {
    console.log(`Assigning instructor ${instructorId} to course ${courseId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Get the course
      const course = await coursesApi.getCourseById(courseId);
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      
      // In a real app, we would update the instructor here
      
      return course;
    } catch (error) {
      console.error(`Error assigning instructor ${instructorId} to course ${courseId}:`, error);
      throw error;
    }
  },
};
