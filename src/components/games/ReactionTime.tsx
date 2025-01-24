import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';

const ReactionTime = () => {
  const { t } = useTranslation();
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
        title: t('game.reaction.tooEarly'),
        description: t('game.reaction.waitForGreen'),
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
          title: t('game.reaction.newRecord'),
          description: t('game.reaction.recordDesc', { time }),
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
        <h1>{t('game.reaction.title')}</h1>
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
          {state === "waiting" ? t('game.reaction.wait') :
           state === "ready" ? t('game.reaction.clickNow') :
           reactionTime ? t('game.reaction.tryAgain', { time: reactionTime }) :
           t('game.reaction.clickToStart')}
        </p>
      </div>

      {bestTime && (
        <div className="text-center">
          <p className="text-lg font-semibold">{t('game.reaction.bestTime', { time: bestTime })}</p>
        </div>
      )}

      <Button onClick={startGame} variant="outline">
        Reset
      </Button>
    </div>
  );
};

export default ReactionTime;