import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const colors = [
  { name: "红色", value: "#EF4444" },
  { name: "蓝色", value: "#3B82F6" },
  { name: "绿色", value: "#10B981" },
  { name: "黄色", value: "#F59E0B" },
];

const ColorMatch = () => {
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [colorText, setColorText] = useState("");
  const [displayColor, setDisplayColor] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const generateNewRound = () => {
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    const displayColor = colors[Math.floor(Math.random() * colors.length)];
    setColorText(textColor.name);
    setDisplayColor(displayColor.value);
    setIsMatching(textColor.value === displayColor.value);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameStarted(true);
    generateNewRound();
  };

  const handleAnswer = (playerAnswer: boolean) => {
    if (playerAnswer === isMatching) {
      setScore((prev) => prev + 1);
      toast({
        title: "正确!",
        duration: 1000,
      });
    } else {
      toast({
        title: "错误!",
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
          title: "新记录!",
          description: `你的最高分是: ${score}`,
        });
      }
    }
  }, [gameStarted, timeLeft, score, bestScore, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">颜色匹配</h1>
        <p className="text-muted-foreground">
          判断文字与颜色是否匹配
        </p>
      </div>

      {!gameStarted ? (
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

          <div className="text-center space-y-8">
            <h2 
              className="text-6xl font-bold" 
              style={{ color: displayColor }}
            >
              {colorText}
            </h2>

            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer(true)}
              >
                匹配
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer(false)}
              >
                不匹配
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorMatch;