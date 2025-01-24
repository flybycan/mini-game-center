import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Award, List, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const getQuestions = (t: any): Question[] => [
  {
    question: t('game.quiz.q1.question'),
    options: [
      t('game.quiz.q1.options.0'),
      t('game.quiz.q1.options.1'),
      t('game.quiz.q1.options.2'),
      t('game.quiz.q1.options.3')
    ],
    correctAnswer: 2,
  },
  {
    question: t('game.quiz.q2.question'),
    options: [
      t('game.quiz.q2.options.0'),
      t('game.quiz.q2.options.1'),
      t('game.quiz.q2.options.2'),
      t('game.quiz.q2.options.3')
    ],
    correctAnswer: 1,
  },
  {
    question: t('game.quiz.q3.question'),
    options: [
      t('game.quiz.q3.options.0'),
      t('game.quiz.q3.options.1'),
      t('game.quiz.q3.options.2'),
      t('game.quiz.q3.options.3')
    ],
    correctAnswer: 1,
  },
  {
    question: t('game.quiz.q4.question'),
    options: [
      t('game.quiz.q4.options.0'),
      t('game.quiz.q4.options.1'),
      t('game.quiz.q4.options.2'),
      t('game.quiz.q4.options.3')
    ],
    correctAnswer: 1,
  },
  {
    question: t('game.quiz.q5.question'),
    options: [
      t('game.quiz.q5.options.0'),
      t('game.quiz.q5.options.1'),
      t('game.quiz.q5.options.2'),
      t('game.quiz.q5.options.3')
    ],
    correctAnswer: 2,
  },
];


const QuickQuiz = () => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const questions = getQuestions(t);
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
        title: t('game.quiz.correct'),
        description: t('game.quiz.point'),
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
      title: t('game.quiz.gameOver'),
      description: t('game.quiz.finalScore', { score, total: questions.length }),
      duration: 3000,
    });
  };

  if (!gameStarted || gameOver) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">{t('game.quiz.title')}</h1>
            {gameOver && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  <p className="text-xl">{t('game.quiz.finalScore', { score, total: questions.length })}</p>
                </div>
              </div>
            )}
            <p className="text-muted-foreground">
              {t('game.quiz.instruction')}
            </p>
          </div>
          <Button onClick={startGame} className="w-full">
            {gameOver ? t('game.quiz.playAgain') : t('game.quiz.startGame')}
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('game.quiz.title')}</h1>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <span className="text-xl">{timeLeft}s</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <List className="w-5 h-5" />
            <p className="text-lg">{t('game.quiz.question', { current: currentQuestion + 1, total: questions.length })}</p>
          </div>
          <p className="text-2xl font-medium">{question.question}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className={`w-full text-left justify-start text-lg py-6 ${selectedAnswer === index ? (index === question.correctAnswer ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : ''}`}
                variant={selectedAnswer === null ? 'outline' : 'secondary'}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center gap-3">
                  {selectedAnswer === index ? (
                    index === question.correctAnswer ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )
                  ) : null}
                  {option}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>{t('game.quiz.score')}: {score}</p>
          <p>{t('game.quiz.timeLeft')}: {timeLeft}s</p>
        </div>
      </Card>
    </div>
  );
};

export default QuickQuiz;