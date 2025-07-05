
import { useState } from "react";
import { Link } from "react-router-dom";
import { Assessment } from "@/data/types";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Eye, 
  Edit, 
  Trash, 
  Plus, 
  Search 
} from "lucide-react";

// Mock assessments data
const mockAssessments: Assessment[] = [
  {
    id: "1",
    title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals",
    timeLimit: 30,
    passingScore: 70,
    questions: [],
    courseId: "1"
  },
  {
    id: "2",
    title: "React Components",
    description: "Assessment on React component patterns",
    timeLimit: 45,
    passingScore: 80,
    questions: [],
    courseId: "2"
  },
  {
    id: "3",
    title: "Database Concepts",
    description: "Basic database design and SQL queries",
    timeLimit: 60,
    passingScore: 75,
    questions: [],
    courseId: "3"
  }
];

export default function AssessmentManagement() {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const handleDeleteAssessment = (assessmentId: string) => {
    setAssessments(assessments.filter(assessment => assessment.id !== assessmentId));
    toast({
      title: "Assessment Deleted",
      description: "The assessment has been successfully deleted.",
    });
  };
  
  const filteredAssessments = searchTerm 
    ? assessments.filter(assessment => 
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : assessments;
  
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assessment Management</CardTitle>
              <CardDescription>
                Create and manage assessments for courses
              </CardDescription>
            </div>
            <Button asChild>
              <Link to="/admin/assessments/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Assessment
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Passing Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No assessments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      <TableCell>{assessment.description}</TableCell>
                      <TableCell>{assessment.timeLimit} minutes</TableCell>
                      <TableCell>{assessment.passingScore}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/assessment/${assessment.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/assessments/edit/${assessment.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteAssessment(assessment.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
