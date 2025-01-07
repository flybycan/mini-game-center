import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const colors = [
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
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
        title: "right!",
        duration: 1000,
      });
    } else {
      toast({
        title: "wrong!",
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
        <h1 className="text-4xl font-bold">Color matching</h1>
        <p className="text-muted-foreground">
        Determine if the text matches the color
        </p>
      </div>

      {!gameStarted ? (
        <Button onClick={startGame} size="lg">
          Play the game
        </Button>
      ) : (
        <>
          <div className="text-center space-y-4">
            <p className="text-2xl">time: {timeLeft}second</p>
            <p className="text-xl">score: {score}</p>
            <p className="text-sm text-muted-foreground">Top score: {bestScore}</p>
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
          </div>
        </>
      )}
    </div>
  );
};

export default ColorMatch;
