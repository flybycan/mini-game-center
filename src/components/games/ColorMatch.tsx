import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const colors = [
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Cyan", value: "#06B6D4" },
];

const INITIAL_TIME = 30;
const COMBO_THRESHOLD = 3;
const TIME_BONUS = 2;

const ColorMatch = () => {
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [colorText, setColorText] = useState("");
  const [displayColor, setDisplayColor] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [combo, setCombo] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const generateNewRound = () => {
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    let displayColor;
    
    // 根据难度增加匹配概率
    if (Math.random() < 0.3 + (difficulty * 0.1)) {
      displayColor = textColor;
    } else {
      do {
        displayColor = colors[Math.floor(Math.random() * colors.length)];
      } while (displayColor === textColor);
    }
    
    setColorText(textColor.name);
    setDisplayColor(displayColor.value);
    setIsMatching(textColor.value === displayColor.value);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setGameStarted(true);
    setCombo(0);
    setDifficulty(1);
    generateNewRound();
  };

  const handleAnswer = (playerAnswer: boolean) => {
    if (playerAnswer === isMatching) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      // 计算分数（包含连击奖励）
      const comboBonus = Math.floor(newCombo / COMBO_THRESHOLD);
      const points = 1 + comboBonus;
      setScore((prev) => prev + points);
      
      // 连击奖励提示
      toast({
        title: "Correct! 🎯",
        description: comboBonus > 0 ? `${newCombo} combo! +${points} points` : undefined,
        duration: 1000,
      });
      
      // 每5分增加难度
      if (score > 0 && score % 5 === 0) {
        setDifficulty(prev => Math.min(prev + 1, 5));
      }
      
      // 连击奖励额外时间
      if (newCombo % COMBO_THRESHOLD === 0) {
        setTimeLeft(prev => prev + TIME_BONUS);
        toast({
          title: "Time Bonus! ⌛",
          description: `+${TIME_BONUS} seconds`,
          duration: 1000,
        });
      }
    } else {
      setCombo(0);
      toast({
        title: "Incorrect! ❌",
        variant: "destructive",
        duration: 1000,
      });
    }
    generateNewRound();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
      if (score > bestScore) {
        setBestScore(score);
        toast({
          title: "New record!",
          description: `Your highest score is: ${score}`,
        });
      }
    }
  }, [gameStarted, timeLeft, score, bestScore, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Color Challenge</h1>
        <p className="text-muted-foreground">
          Test your reflexes! Match the word with its displayed color
        </p>
      </div>

      <div className="relative w-full max-w-lg">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: gameStarted ? 0 : 1,
            y: gameStarted ? -100 : 0
          }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Button 
            onClick={startGame} 
            size="lg" 
            className="w-full py-8 text-xl font-bold transition-all duration-300"
            disabled={gameStarted}
          >
            Start Game
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: gameStarted ? 1 : 0,
            y: gameStarted ? 0 : 20
          }}
          transition={{ duration: 0.5 }}
          className={`w-full ${!gameStarted ? 'pointer-events-none' : ''}`}
        >
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center items-center gap-4">
              <p className="text-2xl">Time: {timeLeft}s</p>
              <p className="text-xl">Score: {score}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-muted-foreground">Personal Best: {bestScore}</p>
              {combo >= COMBO_THRESHOLD && (
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-sm font-semibold text-green-500"
                >
                  {combo} Combo! 🔥
                </motion.p>
              )}
            </div>
          </div>

          <motion.div 
            className="text-center space-y-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: gameStarted ? 1 : 0.8,
              opacity: gameStarted ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 
              className="text-6xl font-bold" 
              style={{ color: displayColor }}
            >
              {colorText}
            </h2>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer(true)}
              >
                Matching
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer(false)}
              >
                Mismatch
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {!gameStarted && timeLeft === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card p-8 rounded-lg shadow-lg text-center space-y-4 max-w-sm w-full mx-4"
          >
            <h2 className="text-2xl font-bold">Game Over!</h2>
            <div className="space-y-2">
              <p className="text-lg">Final Score: {score}</p>
              <p className="text-muted-foreground">Best Score: {bestScore}</p>
              {combo >= COMBO_THRESHOLD && (
                <p className="text-green-500">Max Combo: {combo} 🔥</p>
              )}
            </div>
            <Button 
              onClick={startGame}
              size="lg"
              className="w-full"
            >
              Play Again
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ColorMatch;
