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
        title: "right!",
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
          title: "New Record!",
          description: `Your highest score is: ${score}`,
        });
      }
    }
  }, [isPlaying, timeLeft, score, bestScore, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Typing speed</h1>
        <p className="text-muted-foreground">
        Enter the displayed words quickly and accurately
        </p>
      </div>

      {!isPlaying ? (
        <Button onClick={startGame} size="lg">
          Play the game
        </Button>
      ) : (
        <>
          <div className="text-center space-y-4">
            <p className="text-2xl">time: {timeLeft}s</p>
            <p className="text-xl">score: {score}</p>
            <p className="text-sm text-muted-foreground">Top score: {bestScore}</p>
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
              placeholder="Enter the word..."
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
