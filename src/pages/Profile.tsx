import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Award, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Simulated data
  const achievements = [
    { id: 1, title: "First Course Completed", description: "You completed your first course", icon: Award },
    { id: 2, title: "Learning Streak", description: "10 days continuous learning", icon: Award },
    { id: 3, title: "Knowledge Explorer", description: "Completed courses in 3 different categories", icon: BookOpen },
  ];

  const enrolledCourses = [
    { id: 1, title: "Introduction to React", progress: 75 },
    { id: 2, title: "Advanced JavaScript", progress: 45 },
    { id: 3, title: "UI/UX Design Fundamentals", progress: 20 },
  ];

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - User Info */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              <Badge variant="outline" className="mt-2 capitalize">
                {user?.role || "student"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="mt-2 text-center">
                <p className="text-muted-foreground text-sm">
                  Member since {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm mt-2">
                  {user?.bio || "No bio provided."}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4" />
                Edit Profile Settings
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Tabs content */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" /> Personal Information
                  </CardTitle>
                  <CardDescription>Your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm">Name</h3>
                      <p>{user?.name || "Not set"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Email</h3>
                      <p>{user?.email || "Not set"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Bio</h3>
                      <p className="text-muted-foreground">
                        {user?.bio || "No bio provided."}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Role</h3>
                      <p className="capitalize">{user?.role || "student"}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile Information
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Learning Tab */}
            <TabsContent value="learning">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> My Learning
                  </CardTitle>
                  <CardDescription>Your enrolled courses and progress.</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="flex flex-col space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{course.title}</p>
                            <span className="text-sm text-muted-foreground">
                              {course.progress}% complete
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        You haven't enrolled in any courses yet.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => navigate("/courses")}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" /> Achievements
                  </CardTitle>
                  <CardDescription>Your learning milestones and achievements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-md hover:bg-accent transition-colors">
                        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary">
                          <achievement.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
