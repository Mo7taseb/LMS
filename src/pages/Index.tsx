import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar,
  ChevronRight,
  PlayCircle,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { currentUser, courses, enrolledCourses, userProgress } from "@/data/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const inProgressCourses = userProgress.map(progress => {
    const course = courses.find(c => c.id === progress.courseId);
    return { course, progress };
  });

  const featuredCourses = courses.filter(course => course.featured).slice(0, 3);
  const popularCourses = courses.filter(course => course.popular).slice(0, 3);
  const newCourses = courses.filter(course => course.new).slice(0, 3);

  return (
    <div className="container py-8 space-y-8">
      <section className="animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
            <p className="text-muted-foreground mt-1">Continue your learning journey</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            {isAdmin && (
              <Button variant="outline" asChild>
                <Link to="/user-management">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link to="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
        
        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressCourses.map(({ course, progress }) => (
              course && (
                <Card key={progress.courseId} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button size="sm" variant="secondary" className="rounded-full">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Instructor: {course.instructor.name}
                      </p>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{progress.progress}% complete</span>
                        <span className="text-sm text-muted-foreground">
                          Last accessed: {new Date(progress.lastAccessed).toLocaleDateString()}
                        </span>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpen className="mr-1 h-4 w-4" />
                          <span>{course.totalLessons || "9"} lessons</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/courses/${course.slug}`} className="flex items-center">
                            Continue 
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground mb-4">You haven't started any courses yet.</p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6">Explore Courses</h2>
        <Tabs defaultValue="featured">
          <TabsList className="mb-6">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
            <TabsTrigger value="new">Newest</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Lessons</h2>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
        
        <div className="space-y-4">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => (
              <Card key={course.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()} · 
                        {index === 0 ? ' Next Lesson: Components and Props' : ' Next Lesson: UI Design Principles'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No upcoming lessons scheduled.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

interface CourseCardProps {
  course: typeof courses[0];
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden course-card">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          {course.featured && (
            <span className="bg-yellow-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              Featured
            </span>
          )}
          {course.popular && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              Popular
            </span>
          )}
          {course.new && (
            <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="bg-white/90 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {course.duration}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {course.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-bold text-primary">
              ${course.discountPrice || course.price}
            </span>
            {course.discountPrice && (
              <span className="text-muted-foreground line-through ml-2">
                ${course.price}
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link to={`/courses/${course.slug}`}>
              View Course
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
