import { Assessment, AssessmentQuestion, AssessmentResult, Category, ContentResource, Course, CourseDetails, Instructor, User, UserProgress } from "./types";

// Export the default user for demo purposes
export const currentUser: User = {
  id: "user1",
  name: "Momen",
  email: "m@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  role: "admin",
};

// Export default users
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Momen",
    email: "m@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "admin",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    role: "student",
  },
  {
    id: "user3",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "instructor",
  },
  {
    id: "user4",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    role: "instructor",
  },
  {
    id: "user5",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com", 
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    role: "instructor",
  }
];

export const categories: Category[] = [
  { id: "cat1", name: "Development", slug: "development" },
  { id: "cat2", name: "Business", slug: "business" },
  { id: "cat3", name: "Finance", slug: "finance" },
  { id: "cat4", name: "IT & Software", slug: "it-software" },
  { id: "cat5", name: "Design", slug: "design" },
  { id: "cat6", name: "Marketing", slug: "marketing" },
  { id: "cat7", name: "Health & Fitness", slug: "health-fitness" },
  { id: "cat8", name: "Music", slug: "music" },
];

export const instructors: Instructor[] = [
  {
    id: "ins1",
    name: "Dr. Sarah Johnson",
    bio: "Senior Developer and Educator with over 10 years of industry experience.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    expertise: ["Web Development", "JavaScript", "React"],
  },
  {
    id: "ins2",
    name: "Prof. Michael Chen",
    bio: "Design specialist and creative director with expertise in UI/UX principles.",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    expertise: ["UI/UX Design", "Graphic Design", "Figma"],
  },
  {
    id: "ins3",
    name: "Emily Rodriguez",
    bio: "Marketing expert and consultant for Fortune 500 companies.",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    expertise: ["Digital Marketing", "SEO", "Content Strategy"],
  },
  {
    id: "ins4",
    name: "Dr. James Wilson",
    bio: "Former Google engineer and computer science professor.",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    expertise: ["Algorithms", "Data Structures", "Python"],
  },
];

export const courses: Course[] = [
  {
    id: "course1",
    title: "React Fundamentals for Beginners",
    slug: "react-fundamentals",
    description: "Learn the core concepts of React and build your first application from scratch. Master hooks, state management, and component architecture through hands-on projects.",
    thumbnail: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg",    instructor: instructors[0],
    price: 49.99,
    discountPrice: 39.99,
    duration: "12 hours",
    level: "beginner",
    categories: [categories[0]],
    rating: 4.7,
    ratingCount: 1283,
    enrolledStudents: 12504,
    createdAt: "2023-08-15",
    updatedAt: "2024-03-20",
    featured: true,
    overview: "This comprehensive course covers everything you need to know about React, from basic concepts to advanced techniques. You'll build real-world projects and gain hands-on experience.",
  },
  {
    id: "course2",
    title: "UI/UX Design Principles",
    slug: "ui-ux-design-principles",
    description: "Master the fundamentals of UI/UX design and create beautiful, user-friendly interfaces. Learn design thinking, wireframing, prototyping, and user testing.",
    thumbnail: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg",    instructor: instructors[1],
    price: 59.99,
    duration: "12 hours",
    level: "intermediate",
    categories: [categories[4]],
    rating: 4.5,
    ratingCount: 875,
    enrolledStudents: 9240,
    createdAt: "2023-09-10",
    updatedAt: "2024-02-15",
    popular: true,
    overview: "Learn the fundamentals of UI/UX design through practical projects. This course covers design thinking, user research, wireframing, prototyping, and usability testing.",
  },
  {
    id: "course3",
    title: "Digital Marketing Strategy",
    slug: "digital-marketing-strategy",
    description: "Develop effective digital marketing strategies to grow your business online. Learn SEO, social media marketing, content strategy, and analytics.",
    thumbnail: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg",    instructor: instructors[2],
    price: 69.99,
    discountPrice: 49.99,
    duration: "15 hours",
    level: "beginner",
    categories: [categories[5]],
    rating: 4.8,
    ratingCount: 932,
    enrolledStudents: 8756,
    createdAt: "2023-10-05",
    updatedAt: "2024-01-30",
    new: true,
    overview: "Master digital marketing strategies with this comprehensive course. You'll learn how to create effective campaigns across multiple channels and measure their success.",
  },
  {
    id: "course4",
    title: "Advanced Algorithms and Data Structures",
    slug: "advanced-algorithms",
    description: "Master complex algorithms and data structures for technical interviews and efficient coding.",
    thumbnail: "https://www.kdnuggets.com/wp-content/uploads/algorithm-light-bulb-upgrade.jpg",
    instructor: instructors[3],
    price: 79.99,
    duration: "20 hours",
    level: "advanced",
    categories: [categories[0], categories[3]],
    rating: 4.9,
    ratingCount: 567,
    enrolledStudents: 5430,
    createdAt: "2023-11-20",
    updatedAt: "2024-03-10",
    popular: true,
  },
  {
    id: "course5",
    title: "Financial Planning for Beginners",
    slug: "financial-planning-beginners",
    description: "Learn the basics of financial planning and investment strategies for your future.",
    thumbnail: "https://www.investopedia.com/thmb/xQNRCBPK2j5LHtUjYxRwtIs8bDI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/financial-planner-5baff01146e0fb00263d4a29.jpg",
    instructor: instructors[2],
    price: 39.99,
    duration: "8 hours",
    level: "beginner",
    categories: [categories[2]],
    rating: 4.6,
    ratingCount: 753,
    enrolledStudents: 6820,
    createdAt: "2023-12-05",
    updatedAt: "2024-02-28",
  },
  {
    id: "course6",
    title: "Mobile App Development with Flutter",
    slug: "flutter-app-development",
    description: "Build cross-platform mobile apps with Flutter and Dart programming language.",
    thumbnail: "https://www.freecodecamp.org/news/content/images/size/w2000/2022/02/Flutter-Cover.png",
    instructor: instructors[0],
    price: 69.99,
    discountPrice: 54.99,
    duration: "18 hours",
    level: "intermediate",
    categories: [categories[0]],
    rating: 4.7,
    ratingCount: 623,
    enrolledStudents: 5240,
    createdAt: "2024-01-10",
    updatedAt: "2024-03-15",
    new: true,
  },
];

export const courseDetails: CourseDetails = {
  ...courses[0],
  objectives: [
    "Understand React component architecture and best practices",
    "Master state and props management with both class and functional components",
    "Build interactive UIs with React Hooks (useState, useEffect, useContext, and more)",
    "Implement routing with React Router for single-page applications",
    "Create and consume RESTful APIs with Axios and Fetch",
    "Learn state management with Context API and Redux",
    "Build reusable UI components with styled-components",
    "Set up testing with Jest and React Testing Library",
    "Deploy your React applications to Netlify, Vercel, and AWS",
  ],
  requirements: [
    "Basic knowledge of HTML, CSS, and JavaScript",
    "Understanding of ES6+ features (arrow functions, destructuring, modules)",
    "Node.js and npm installed on your computer",
    "Any code editor of your choice (VS Code recommended)",
    "Willingness to learn and practice through coding exercises"
  ],
  sections: [
    {
      id: "section1",
      title: "Introduction to React",
      lessons: [
        {
          id: "lesson1",
          title: "Welcome and Course Overview",
          type: "video",
          duration: "5:30",
          videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
          completed: true,
          resources: [
            {
              id: "res1",
              title: "Course Syllabus",
              description: "Complete course syllabus with timeline and learning outcomes",
              url: "https://react.dev/learn/describing-the-ui",
              type: "link"
            },
            {
              id: "res2",
              title: "React Official Documentation",
              description: "Link to the official React documentation",
              url: "https://react.dev/learn",
              type: "link"
            }
          ]
        },
        {
          id: "lesson2",
          title: "Setting Up Your Development Environment",
          type: "video",
          duration: "12:45",
          videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
          completed: true,
          resources: [
            {
              id: "res3",
              title: "Development Environment Setup Guide",
              description: "Step-by-step guide for setting up your React development environment",
              url: "https://create-react-app.dev/docs/getting-started",
              type: "link"
            },
            {
              id: "res4",
              title: "Create React App Tutorial",
              description: "Video tutorial on using Create React App",
              url: "https://www.youtube.com/embed/hn-0HJx1h0I",
              type: "video"
            }
          ]
        },
        {
          id: "lesson3",
          title: "React Basics Quiz",
          type: "quiz",
          duration: "10:00",
          completed: false,
          quiz: {
            questions: [
              {
                id: "q1",
                text: "What is JSX?",
                options: [
                  { id: "q1a", text: "JavaScript XML - a syntax extension for JavaScript" },
                  { id: "q1b", text: "A JavaScript library for building user interfaces" },
                  { id: "q1c", text: "JavaScript Extension - a new JavaScript version" },
                  { id: "q1d", text: "Java Syntax XML - a way to write Java in XML format" }
                ],
                correctAnswer: "q1a",
                explanation: "JSX is JavaScript XML, a syntax extension that allows you to write HTML-like code in JavaScript."
              },
              {
                id: "q2",
                text: "What is the virtual DOM in React?",
                options: [
                  { id: "q2a", text: "A direct copy of the browser's DOM" },
                  { id: "q2b", text: "A programming concept where UI is kept in memory and synced with the real DOM" },
                  { id: "q2c", text: "A type of database for storing component states" },
                  { id: "q2d", text: "A JavaScript function that renders HTML" }
                ],
                correctAnswer: "q2b",
                explanation: "The virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM through a process called reconciliation."
              }
            ]
          }
        }
      ],
    },
    {
      id: "section2",
      title: "React Components and Props",
      lessons: [
        {
          id: "lesson4",
          title: "Creating Your First Component",
          type: "video",
          duration: "15:20",
          videoUrl: "https://www.youtube.com/embed/Rh3tobg7hEo",
          completed: false,
          resources: [
            {
              id: "res5",
              title: "Component Architecture Diagram",
              description: "Visual representation of React component architecture",
              url: "https://react.dev/learn/thinking-in-react",
              type: "link"
            }
          ]
        },
        {
          id: "lesson5",
          title: "Understanding Props",
          type: "video",
          duration: "18:30",
          videoUrl: "https://www.youtube.com/embed/KnuYATM0huk",
          completed: false,
          resources: [
            {
              id: "res6",
              title: "Props vs State Cheatsheet",
              description: "Quick reference guide for understanding the difference between props and state",
              url: "https://react.dev/learn/passing-props-to-a-component",
              type: "link"
            }
          ]
        },
        {
          id: "lesson6",
          title: "Component Composition",
          type: "video",
          duration: "14:15",
          videoUrl: "https://www.youtube.com/embed/zRkFJGfAfWs",
          completed: false,
          resources: [
            {
              id: "res7",
              title: "Component Composition Patterns",
              description: "Advanced patterns for component composition in React",
              url: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
              type: "link"
            }
          ]
        },
      ],
    },
    {
      id: "section3",
      title: "State and Lifecycle Methods",
      lessons: [
        {
          id: "lesson7",
          title: "Introduction to State",
          type: "video",
          duration: "20:10",
          videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
          locked: true,
          resources: [
            {
              id: "res8",
              title: "State Management Flow Chart",
              description: "Visual representation of state management in React",
              url: "https://react.dev/learn/state-a-components-memory",
              type: "link"
            }
          ]
        },
        {
          id: "lesson8",
          title: "useState Hook",
          type: "video",
          duration: "25:45",
          videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0",
          locked: true,
          resources: [
            {
              id: "res9",
              title: "React Hooks Cheatsheet",
              description: "Quick reference for all React hooks",
              url: "https://react.dev/reference/react",
              type: "link"
            },
            {
              id: "res10",
              title: "useState Examples",
              description: "Video with multiple useState examples",
              url: "https://www.youtube.com/embed/9xhKH43llhU",
              type: "video"
            }
          ]
        },
        {
          id: "lesson9",
          title: "State Management Assignment",
          type: "assignment",
          duration: "45:00",
          locked: true,
          resources: [
            {
              id: "res11",
              title: "Assignment Instructions",
              description: "Detailed instructions for completing the state management assignment",
              url: "https://beta.reactjs.org/learn/updating-objects-in-state",
              type: "link"
            },
            {
              id: "res12",
              title: "Starter Code Repository",
              description: "GitHub repository with starter code for the assignment",
              url: "https://github.com/facebook/react",
              type: "link"
            }
          ]
        },
      ],
    },
    {
      id: "section4",
      title: "React Hooks Deep Dive",
      lessons: [
        {
          id: "lesson10",
          title: "useEffect Hook and API Calls",
          type: "video",
          duration: "28:15",
          videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
          locked: true,
          resources: [
            {
              id: "res13",
              title: "useEffect Patterns",
              description: "Common patterns and best practices for useEffect",
              url: "https://react.dev/reference/react/useEffect",
              type: "link"
            }
          ]
        },
        {
          id: "lesson11",
          title: "Custom Hooks",
          type: "video",
          duration: "22:30",
          videoUrl: "https://www.youtube.com/embed/6ThXsUwLWvc",
          locked: true,
          resources: [
            {
              id: "res14",
              title: "Custom Hooks Library",
              description: "Collection of useful custom hooks for React applications",
              url: "https://usehooks.com/",
              type: "link"
            }
          ]
        },
        {
          id: "lesson12",
          title: "Hooks Quiz",
          type: "quiz",
          duration: "15:00",
          locked: true,
          quiz: {
            questions: [
              {
                id: "q3",
                text: "Which hook should be used for data fetching?",
                options: [
                  { id: "q3a", text: "useState" },
                  { id: "q3b", text: "useEffect" },
                  { id: "q3c", text: "useRef" },
                  { id: "q3d", text: "useReducer" }
                ],
                correctAnswer: "q3b",
                explanation: "useEffect is typically used for data fetching and other side effects in functional components."
              },
              {
                id: "q4",
                text: "What is the purpose of useCallback?",
                options: [
                  { id: "q4a", text: "To memoize functions to prevent unnecessary re-renders" },
                  { id: "q4b", text: "To manage state in functional components" },
                  { id: "q4c", text: "To access DOM elements directly" },
                  { id: "q4d", text: "To handle form submissions" }
                ],
                correctAnswer: "q4a",
                explanation: "useCallback memoizes functions to prevent unnecessary re-renders when passed as props to child components."
              }
            ]
          }
        }
      ]
    },
    {
      id: "section5",
      title: "Routing and Navigation",
      lessons: [
        {
          id: "lesson13",
          title: "Introduction to React Router",
          type: "video",
          duration: "24:40",
          videoUrl: "https://www.youtube.com/embed/Law7wfdg_ls",
          locked: true,
          resources: [
            {
              id: "res15",
              title: "React Router Documentation",
              description: "Official documentation for React Router",
              url: "https://reactrouter.com/en/main",
              type: "link"
            }
          ]
        },
        {
          id: "lesson14",
          title: "Advanced Routing Techniques",
          type: "video",
          duration: "32:15",
          videoUrl: "https://www.youtube.com/embed/eKAnXcAZRpg",
          locked: true
        },
        {
          id: "lesson15",
          title: "Building a Navigation System",
          type: "assignment",
          duration: "60:00",
          locked: true
        }
      ]
    }
  ],
  totalLessons: 15,
  totalDuration: "5 hours 20 minutes",
};

export const userProgress: UserProgress[] = [
  {
    courseId: "course1",
    completedLessons: ["lesson1", "lesson2"],
    quizScores: { lesson3: 80 },
    lastAccessed: "2024-04-28T15:30:00Z",
    progress: 22,
  },
  {
    courseId: "course2",
    completedLessons: ["lesson1", "lesson2", "lesson3", "lesson4"],
    quizScores: { lesson5: 90 },
    lastAccessed: "2024-04-27T09:15:00Z",
    progress: 40,
  },
  {
    courseId: "course3",
    completedLessons: ["lesson1"],
    quizScores: {},
    lastAccessed: "2024-05-01T14:20:00Z",
    progress: 10,
  }
];

export const enrolledCourses = [courses[0], courses[1], courses[2]];

export const assessments: Assessment[] = [
  {
    id: "assessment1",
    title: "React Fundamentals Certification",
    description: "Test your knowledge of React fundamentals including components, props, state, and basic hooks.",
    timeLimit: 45, // in minutes
    passingScore: 70,
    courseId: "course1",
    questions: [
      {
        id: "aq1",
        text: "Which of the following is NOT a React Hook?",
        options: [
          { id: "aq1a", text: "useState" },
          { id: "aq1b", text: "useEffect" },
          { id: "aq1c", text: "useHistory" },
          { id: "aq1d", text: "useRender" }
        ],
        correctAnswer: "aq1d",
        explanation: "useRender is not a built-in React Hook. The others (useState, useEffect, and useHistory) are all valid hooks."
      },
      {
        id: "aq2",
        text: "What is the correct way to update state in a functional component?",
        options: [
          { id: "aq2a", text: "this.setState({ count: this.state.count + 1 })" },
          { id: "aq2b", text: "setCount(count + 1)" },
          { id: "aq2c", text: "count = count + 1" },
          { id: "aq2d", text: "this.count = this.count + 1" }
        ],
        correctAnswer: "aq2b",
        explanation: "In a functional component, you use the state updater function returned by useState to update state. The correct syntax is setCount(count + 1)."
      },
      {
        id: "aq3",
        text: "What happens when you pass a function to setState?",
        options: [
          { id: "aq3a", text: "It causes an error because setState only accepts objects" },
          { id: "aq3b", text: "It updates the state with the function itself as the new value" },
          { id: "aq3c", text: "It calls the function with the current state and props as arguments" },
          { id: "aq3d", text: "It schedules the function to run after the state has been updated" }
        ],
        correctAnswer: "aq3c",
        explanation: "When you pass a function to setState, React calls that function with the current state (and props if applicable) as arguments, allowing you to update state based on the previous state."
      },
      {
        id: "aq4",
        text: "What is the purpose of the key prop when rendering a list of elements?",
        options: [
          { id: "aq4a", text: "It's optional and only used for debugging purposes" },
          { id: "aq4b", text: "It helps React identify which items have changed, are added, or removed" },
          { id: "aq4c", text: "It's required for styling list elements" },
          { id: "aq4d", text: "It sets the order of elements in the list" }
        ],
        correctAnswer: "aq4b",
        explanation: "Keys help React identify which items in a list have changed, been added, or removed. They should be stable, predictable, and unique among siblings."
      },
      {
        id: "aq5",
        text: "What is the correct lifecycle method to use when you need to fetch data from an API in a class component?",
        options: [
          { id: "aq5a", text: "constructor" },
          { id: "aq5b", text: "componentWillMount" },
          { id: "aq5c", text: "componentDidMount" },
          { id: "aq5d", text: "componentWillUpdate" }
        ],
        correctAnswer: "aq5c",
        explanation: "componentDidMount is the appropriate lifecycle method for API calls in class components because it runs after the component has been mounted to the DOM."
      },
      {
        id: "aq6",
        text: "How would you prevent a component from re-rendering?",
        options: [
          { id: "aq6a", text: "Use the shouldComponentUpdate lifecycle method or React.memo" },
          { id: "aq6b", text: "Set the rerender prop to false" },
          { id: "aq6c", text: "Use the noRender attribute" },
          { id: "aq6d", text: "It's not possible to prevent a component from re-rendering" }
        ],
        correctAnswer: "aq6a",
        explanation: "You can prevent unnecessary re-renders by implementing shouldComponentUpdate in class components or wrapping functional components with React.memo."
      },
      {
        id: "aq7",
        text: "What is the purpose of React fragments?",
        options: [
          { id: "aq7a", text: "To create partial components that can be reused" },
          { id: "aq7b", text: "To group multiple elements without adding an extra node to the DOM" },
          { id: "aq7c", text: "To split components into smaller chunks for code splitting" },
          { id: "aq7d", text: "To fragment the rendering process for better performance" }
        ],
        correctAnswer: "aq7b",
        explanation: "React fragments let you group multiple elements without adding an extra node to the DOM, which is useful when returning multiple elements from a component."
      },
      {
        id: "aq8",
        text: "Which method is used for handling form submission in React?",
        options: [
          { id: "aq8a", text: "onSubmit" },
          { id: "aq8b", text: "handleSubmit" },
          { id: "aq8c", text: "formSubmit" },
          { id: "aq8d", text: "submitForm" }
        ],
        correctAnswer: "aq8a",
        explanation: "The onSubmit event handler is used to handle form submissions in React. It's attached to the form element."
      },
      {
        id: "aq9",
        text: "What is the purpose of the useContext hook?",
        options: [
          { id: "aq9a", text: "To manage component rendering context" },
          { id: "aq9b", text: "To create new context providers" },
          { id: "aq9c", text: "To subscribe to and consume values from a context" },
          { id: "aq9d", text: "To control the execution context of component methods" }
        ],
        correctAnswer: "aq9c",
        explanation: "The useContext hook allows functional components to subscribe to and consume values from a React context without wrapping the component in a Context.Consumer."
      },
      {
        id: "aq10",
        text: "Which of the following is the correct way to conditionally render a component in React?",
        options: [
          { id: "aq10a", text: "if (condition) { return <Component /> }" },
          { id: "aq10b", text: "<Component if={condition} />" },
          { id: "aq10c", text: "{condition && <Component />}" },
          { id: "aq10d", text: "<If condition={condition}><Component /></If>" }
        ],
        correctAnswer: "aq10c",
        explanation: "Using the logical AND operator ({condition && <Component />}) is a common and concise way to conditionally render components in React."
      }
    ]
  },
  {
    id: "assessment2",
    title: "Advanced React Concepts",
    description: "Test your knowledge of advanced React concepts including context API, hooks, optimization techniques, and more.",
    timeLimit: 60,
    passingScore: 75,
    courseId: "course1",
    questions: [
      {
        id: "aq11",
        text: "Which React hook would you use to persist values between renders without causing re-renders?",
        options: [
          { id: "aq11a", text: "useState" },
          { id: "aq11b", text: "useEffect" },
          { id: "aq11c", text: "useRef" },
          { id: "aq11d", text: "useMemo" }
        ],
        correctAnswer: "aq11c",
        explanation: "useRef returns a mutable ref object that persists for the lifetime of the component without causing re-renders when its .current property is updated."
      },
      {
        id: "aq12",
        text: "What's the purpose of React.lazy()?",
        options: [
          { id: "aq12a", text: "To lazily initialize state values" },
          { id: "aq12b", text: "To load components only when they're needed" },
          { id: "aq12c", text: "To delay the execution of event handlers" },
          { id: "aq12d", text: "To slowly render components for transition effects" }
        ],
        correctAnswer: "aq12b",
        explanation: "React.lazy() enables code splitting by letting you render a dynamic import as a regular component, loading it only when it's actually needed."
      },
      {
        id: "aq13",
        text: "What happens if you call setState inside useEffect without a dependency array?",
        options: [
          { id: "aq13a", text: "The component will update once and stop" },
          { id: "aq13b", text: "It will cause an infinite loop of renders" },
          { id: "aq13c", text: "React will ignore the setState call" },
          { id: "aq13d", text: "It will throw an error" }
        ],
        correctAnswer: "aq13b",
        explanation: "Without a dependency array, useEffect runs after every render. If it calls setState, it will trigger another render, leading to an infinite loop."
      },
      {
        id: "aq14",
        text: "How does React handle events compared to standard DOM events?",
        options: [
          { id: "aq14a", text: "React uses the exact same event system as the browser" },
          { id: "aq14b", text: "React events are unrelated to DOM events" },
          { id: "aq14c", text: "React uses a synthetic event system for cross-browser compatibility" },
          { id: "aq14d", text: "React doesn't support events, only props" }
        ],
        correctAnswer: "aq14c",
        explanation: "React implements a synthetic event system that wraps the browser's native event system, ensuring consistent behavior across browsers."
      },
      {
        id: "aq15",
        text: "What pattern can be used to share stateful logic between components?",
        options: [
          { id: "aq15a", text: "Higher-order components and custom hooks" },
          { id: "aq15b", text: "Global variables" },
          { id: "aq15c", text: "Class inheritance" },
          { id: "aq15d", text: "Static methods" }
        ],
        correctAnswer: "aq15a",
        explanation: "Higher-order components and custom hooks are design patterns in React that allow for sharing stateful logic between components."
      }
    ]
  },
  {
    id: "assessment3",
    title: "UI/UX Design Principles Test",
    description: "Evaluate your understanding of key UI/UX design principles, best practices, and common patterns.",
    timeLimit: 45,
    passingScore: 70,
    courseId: "course2",
    questions: [
      {
        id: "aq16",
        text: "What is the principle of 'proximity' in design?",
        options: [
          { id: "aq16a", text: "Elements that are related should be grouped together" },
          { id: "aq16b", text: "Elements should be placed as far apart as possible" },
          { id: "aq16c", text: "Elements should always be centered on the page" },
          { id: "aq16d", text: "All elements should be equally spaced" }
        ],
        correctAnswer: "aq16a",
        explanation: "The principle of proximity states that related items should be grouped together visually, as this helps users understand relationships between elements."
      },
      {
        id: "aq17",
        text: "What is the goal of responsive design?",
        options: [
          { id: "aq17a", text: "To make websites load faster" },
          { id: "aq17b", text: "To create sites that adapt to different screen sizes and devices" },
          { id: "aq17c", text: "To use as many animations as possible" },
          { id: "aq17d", text: "To respond to user feedback automatically" }
        ],
        correctAnswer: "aq17b",
        explanation: "Responsive design aims to create web layouts that adapt to different screen sizes and devices, providing an optimal viewing experience across various platforms."
      },
      {
        id: "aq18",
        text: "What is a heuristic evaluation in UX design?",
        options: [
          { id: "aq18a", text: "A mathematical calculation of design efficiency" },
          { id: "aq18b", text: "A method for training new designers" },
          { id: "aq18c", text: "An assessment of a user interface against recognized usability principles" },
          { id: "aq18d", text: "A technique for generating new design ideas" }
        ],
        correctAnswer: "aq18c",
        explanation: "A heuristic evaluation is a method where evaluators examine an interface against established usability principles (heuristics) to identify potential usability issues."
      }
    ]
  }
];

export const assessmentResults: AssessmentResult[] = [
  {
    id: "result1",
    assessmentId: "assessment1",
    userId: "user1",
    score: 80,
    passed: true,
    answers: {
      "aq1": "aq1d",
      "aq2": "aq2b", 
      "aq3": "aq3c",
      "aq4": "aq4b",
      "aq5": "aq5c",
      "aq6": "aq6a",
      "aq7": "aq7b",
      "aq8": "aq8a"
    },
    completedAt: "2024-04-25T14:30:00Z",
    timeSpent: 35
  },
  {
    id: "result2",
    assessmentId: "assessment2",
    userId: "user1",
    score: 60,
    passed: false,
    answers: {
      "aq11": "aq11c",
      "aq12": "aq12b",
      "aq13": "aq13a", // incorrect answer
      "aq14": "aq14c",
      "aq15": "aq15a"
    },
    completedAt: "2024-04-27T16:15:00Z",
    timeSpent: 40
  }
];
