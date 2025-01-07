import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ReactionTime = () => {
  const [state, setState] = useState<"waiting" | "ready" | "clicked">("waiting");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const { toast } = useToast();

  const getRandomDelay = () => Math.floor(Math.random() * 4000) + 1000;

  const startGame = useCallback(() => {
    setState("waiting");
    setReactionTime(null);
    
    const timeout = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
    }, getRandomDelay());

    return () => clearTimeout(timeout);
  }, []);

  const handleClick = () => {
    if (state === "waiting") {
      toast({
        title: "Too early!",
        description: "Wait for the green color before clicking!",
        variant: "destructive",
      });
      startGame();
    } else if (state === "ready") {
      const endTime = Date.now();
      const time = endTime - startTime;
      setReactionTime(time);
      setState("clicked");
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        toast({
          title: "New Best Time!",
          description: `${time}ms - You've set a new record!`,
        });
      }
    } else {
      startGame();
    }
  };

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Timer className="w-6 h-6" />
        <h1>Reaction Time Test</h1>
      </div>
      
      <div 
        onClick={handleClick}
        className={`w-full max-w-md aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
          state === "waiting" ? "bg-red-500" :
          state === "ready" ? "bg-green-500" :
          "bg-blue-500"
        }`}
      >
        <p className="text-white text-xl font-bold text-center p-4">
          {state === "waiting" ? "Wait..." :
           state === "ready" ? "Click now!" :
           reactionTime ? `${reactionTime}ms - Click to try again` :
           "Click to start"}
        </p>
      </div>

      {bestTime && (
        <div className="text-center">
          <p className="text-lg font-semibold">Best Time: {bestTime}ms</p>
        </div>
      )}

      <Button onClick={startGame} variant="outline">
        Reset
      </Button>
    </div>
  );
};

export default ReactionTime;