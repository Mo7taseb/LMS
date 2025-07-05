
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, ClipboardCheck, Settings, Plus } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const adminModules = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      link: "/user-management",
      count: "Loading...",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Course Management",
      description: "Create, edit and delete courses",
      icon: BookOpen,
      link: "/admin/courses",
      count: "Loading...",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Assessment Management",
      description: "Create and manage assessments",
      icon: ClipboardCheck,
      link: "/admin/assessments",
      count: "Loading...",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: Settings,
      link: "/settings",
      count: null,
      color: "bg-gray-100 text-gray-700"
    }
  ];

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminModules.map((module) => (
          <Card key={module.title} className="overflow-hidden">
            <CardHeader className={`${module.color} p-4`}>
              <div className="flex justify-between items-center">
                <module.icon className="h-8 w-8" />
                {module.count && (
                  <span className="text-2xl font-bold">{module.count}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{module.title}</CardTitle>
              <CardDescription className="mt-2">
                {module.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" asChild className="w-full">
                <Link to={module.link}>Manage</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
