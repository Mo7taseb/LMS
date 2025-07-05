
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Clock, HelpCircle, Timer, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Mock assessment data
const mockAssessment = {
  id: "assessment-1",
  title: "Final Assessment: Web Development Fundamentals",
  description: "Test your knowledge of HTML, CSS, and JavaScript basics",
  timeLimit: 20, // in minutes
  passingScore: 70,
  questions: [
    {
      id: "q1",
      text: "Which HTML tag is used to create a hyperlink?",
      options: [
        { id: "a", text: "<link>" },
        { id: "b", text: "<a>" },
        { id: "c", text: "<href>" },
        { id: "d", text: "<url>" }
      ],
      correctAnswer: "b"
    },
    {
      id: "q2",
      text: "Which CSS property is used to change the text color?",
      options: [
        { id: "a", text: "color" },
        { id: "b", text: "text-color" },
        { id: "c", text: "font-color" },
        { id: "d", text: "text-style" }
      ],
      correctAnswer: "a"
    },
    {
      id: "q3",
      text: "Which JavaScript method is used to add an element at the end of an array?",
      options: [
        { id: "a", text: "push()" },
        { id: "b", text: "append()" },
        { id: "c", text: "addToEnd()" },
        { id: "d", text: "insert()" }
      ],
      correctAnswer: "a"
    },
    {
      id: "q4",
      text: "What does CSS stand for?",
      options: [
        { id: "a", text: "Computer Style Sheets" },
        { id: "b", text: "Creative Style Sheets" },
        { id: "c", text: "Cascading Style Sheets" },
        { id: "d", text: "Colorful Style Sheets" }
      ],
      correctAnswer: "c"
    },
    {
      id: "q5",
      text: "Which of the following is NOT a JavaScript data type?",
      options: [
        { id: "a", text: "Boolean" },
        { id: "b", text: "String" },
        { id: "c", text: "Character" },
        { id: "d", text: "Object" }
      ],
      correctAnswer: "c"
    }
  ]
};

const AssessmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(mockAssessment.timeLimit * 60); // in seconds
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // In a real app, you'd fetch the assessment data based on the ID
  // const { data: assessment, isLoading } = useQuery(...)
  const assessment = mockAssessment;
  
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setAssessmentSubmitted(true);
    
    // Calculate score
    let correctAnswers = 0;
    assessment.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / assessment.questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
    
    // Show appropriate toast based on score
    if (calculatedScore >= assessment.passingScore) {
      toast({
        title: "Assessment Passed!",
        description: `You scored ${calculatedScore}%. Congratulations!`,
      });
    } else {
      toast({
        title: "Assessment Not Passed",
        description: `You scored ${calculatedScore}%. The passing score is ${assessment.passingScore}%.`,
        variant: "destructive",
      });
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setAssessmentSubmitted(false);
    setShowResults(false);
    setTimeLeft(assessment.timeLimit * 60);
  };

  const currentQuestionData = assessment.questions[currentQuestion];
  const isAnswered = !!answers[currentQuestionData?.id];
  const questionProgress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  
  // Format time left as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format time left as mm:ss
  const answeredQuestionsCount = Object.keys(answers).length;
  
  if (showResults) {
    return (
      <div className="container py-8 animate-fadeIn">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Assessment Results</CardTitle>
              <CardDescription>
                {assessment.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-6">
                <div className={`text-6xl font-bold mb-4 ${score >= assessment.passingScore ? 'text-green-500' : 'text-red-500'}`}>
                  {score}%
                </div>
                <div className="text-xl font-medium mb-2">
                  {score >= assessment.passingScore ? "Assessment Passed!" : "Assessment Not Passed"}
                </div>
                <div className="text-muted-foreground">
                  {score >= assessment.passingScore 
                    ? "Congratulations on your achievement!" 
                    : `You need ${assessment.passingScore}% to pass this assessment.`}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Questions Summary:</h3>
                
                {assessment.questions.map((question, index) => {
                  const isCorrect = answers[question.id] === question.correctAnswer;
                  const selectedAnswer = question.options.find(opt => opt.id === answers[question.id]);
                  const correctAnswer = question.options.find(opt => opt.id === question.correctAnswer);
                  
                  return (
                    <div 
                      key={question.id} 
                      className={`p-4 rounded-md ${
                        isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect 
                          ? <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" /> 
                          : <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        }
                        <div>
                          <p className="font-medium">Question {index + 1}: {question.text}</p>
                          <p className="text-sm mt-1">
                            Your answer: {selectedAnswer?.text || "No answer"} 
                            {!isCorrect && (
                              <span className="text-red-600 ml-1">
                                (Correct: {correctAnswer?.text})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/my-learning")}
              >
                Back to Learning
              </Button>
              <Button onClick={handleRetake}>
                Retake Assessment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        {/* Assessment Info Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">{assessment.description}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
              <span>{answeredQuestionsCount} answered</span>
            </div>
            <Progress value={questionProgress} className="h-2" />
          </div>
        </div>
        
        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-base font-medium">
              {currentQuestionData.text}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestionData.id] || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestionData.id, value)}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  <Label 
                    htmlFor={`option-${option.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            
            {currentQuestion < assessment.questions.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!isAnswered}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={Object.keys(answers).length < assessment.questions.length}>
                    Submit Assessment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Assessment</AlertDialogTitle>
                    <AlertDialogDescription>
                      {Object.keys(answers).length < assessment.questions.length ? (
                        <div className="flex items-center gap-2 text-amber-600">
                          <AlertTriangle className="h-5 w-5" />
                          <span>
                            You haven't answered all questions. 
                            You've answered {Object.keys(answers).length} out of {assessment.questions.length}.
                          </span>
                        </div>
                      ) : (
                        "Are you sure you want to submit your assessment? You won't be able to change your answers after submission."
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>

        {/* Help Hint */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <HelpCircle className="h-4 w-4" /> 
            Need help? You can retake this assessment later if needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
