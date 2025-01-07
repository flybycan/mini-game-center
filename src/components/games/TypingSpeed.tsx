import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const words = [
  "react", "typescript", "javascript", "programming", 
  "developer", "computer", "keyboard", "mouse",
  "screen", "coding", "learning", "practice",
  "speed", "accuracy", "testing", "game"
];

const TypingSpeed = () => {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCurrentWord(getRandomWord());
    setUserInput("");
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === currentWord) {
      setScore(prev => prev + 1);
      setUserInput("");
      setCurrentWord(getRandomWord());
      toast({
        title: "正确!",
        duration: 1000,
      });
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      if (score > bestScore) {
        setBestScore(score);
        toast({
          title: "新记录!",
          description: `你的最高分是: ${score}`,
        });
      }
    }
  }, [isPlaying, timeLeft, score, bestScore, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">打字速度</h1>
        <p className="text-muted-foreground">
          快速准确地输入显示的单词
        </p>
      </div>

      {!isPlaying ? (
        <Button onClick={startGame} size="lg">
          开始游戏
        </Button>
      ) : (
        <>
          <div className="text-center space-y-4">
            <p className="text-2xl">时间: {timeLeft}秒</p>
            <p className="text-xl">得分: {score}</p>
            <p className="text-sm text-muted-foreground">最高分: {bestScore}</p>
          </div>

          <div className="text-center space-y-8 w-full max-w-md">
            <h2 className="text-6xl font-bold">
              {currentWord}
            </h2>

            <Input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="输入单词..."
              className="text-center text-xl"
              autoComplete="off"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TypingSpeed;