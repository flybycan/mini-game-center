import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Award, List, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
    correctAnswer: 1,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: 2,
  },
];

const QuickQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Game state changed:", { gameStarted, gameOver, score, timeLeft });
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, currentQuestion]);

  const startGame = () => {
    console.log("Starting new game");
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
  };

  const handleAnswer = (selectedIndex: number) => {
    console.log("Answer selected:", selectedIndex);
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(selectedIndex);
    const correct = selectedIndex === questions[currentQuestion].correctAnswer;
    
    if (correct) {
      setScore((prev) => prev + 1);
      toast({
        title: "Correct!",
        description: "+1 point",
        duration: 1500,
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
      } else {
        handleGameOver();
      }
    }, 1000);
  };

  const handleGameOver = () => {
    console.log("Game over. Final score:", score);
    setGameOver(true);
    setGameStarted(false);
    toast({
      title: "Game Over!",
      description: `Final Score: ${score}/${questions.length}`,
      duration: 3000,
    });
  };

  if (!gameStarted || gameOver) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Quick Quiz</h1>
            {gameOver && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  <p className="text-xl">Final Score: {score}/{questions.length}</p>
                </div>
              </div>
            )}
            <p className="text-muted-foreground">
              Test your knowledge with quick questions! You have 15 seconds per question.
            </p>
          </div>
          <Button onClick={startGame} className="w-full">
            {gameOver ? "Play Again" : "Start Game"}
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5" />
            <span>Question {currentQuestion + 1}/{questions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center">{question.question}</h2>
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  selectedAnswer === null
                    ? "hover:bg-accent"
                    : selectedAnswer === index
                    ? index === question.correctAnswer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : index === question.correctAnswer
                    ? "bg-green-500 text-white"
                    : ""
                }`}
                disabled={selectedAnswer !== null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer !== null && index === question.correctAnswer && (
                    <Check className="w-5 h-5" />
                  )}
                  {selectedAnswer === index && index !== question.correctAnswer && (
                    <X className="w-5 h-5" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span>Score: {score}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickQuiz;