import { useState, useEffect, useCallback } from "react";
import { Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
const GAME_DURATION = 30; // seconds

const BubblePop = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("bubblePopHighScore");
    return saved ? parseInt(saved) : 0;
  });
  
  const { toast } = useToast();

  const createBubble = useCallback(() => {
    const bubble: Bubble = {
      id: Math.random(),
      x: Math.random() * (window.innerWidth - 60),
      y: Math.random() * (window.innerHeight - 200),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 20 + 40,
    };
    return bubble;
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setBubbles([]);
  };

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    setScore((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const bubbleInterval = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length >= 10) return prev;
        return [...prev, createBubble()];
      });
    }, 1000);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          clearInterval(bubbleInterval);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("bubblePopHighScore", score.toString());
            toast({
              title: "New High Score!",
              description: `Congratulations! You set a new record: ${score}`,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(timer);
    };
  }, [isPlaying, createBubble, score, highScore, toast]);

  return (
    <div className="min-h-screen relative overflow-hidden p-4">
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-10 glass p-4 rounded-lg">
        <div className="space-y-2">
          <p className="text-lg font-semibold">Score: {score}</p>
          <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-lg font-semibold">Time: {timeLeft}s</p>
          {!isPlaying && (
            <Button onClick={startGame}>
              {timeLeft === GAME_DURATION ? "Start Game" : "Play Again"}
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isPlaying &&
          bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: "absolute",
                left: bubble.x,
                top: bubble.y,
                cursor: "pointer",
              }}
              onClick={() => popBubble(bubble.id)}
              className="transition-transform hover:scale-110"
            >
              <Circle
                fill={bubble.color}
                size={bubble.size}
                className="animate-bounce"
              />
            </motion.div>
          ))}
      </AnimatePresence>

      {!isPlaying && timeLeft === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Game Over!</h2>
            <p className="text-xl">Final Score: {score}</p>
            <Button onClick={startGame}>Play Again</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubblePop;