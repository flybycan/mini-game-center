import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const GRID_SIZE = 9; // 3x3 grid
const GAME_DURATION = 30; // 30 seconds
const MOLE_INTERVAL = 1000; // New mole appears every second

const WhackAMole = () => {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('whackamole-highscore');
    return saved ? parseInt(saved) : 0;
  });

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setActiveMole(Math.floor(Math.random() * GRID_SIZE));
  };

  const whackMole = (index: number) => {
    if (index === activeMole) {
      setScore(prev => prev + 1);
      setActiveMole(Math.floor(Math.random() * GRID_SIZE));
    }
  };

  const updateHighScore = useCallback(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('whackamole-highscore', score.toString());
      toast.success(t('common.newRecord'));
    }
  }, [score, highScore]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let moleTimer: NodeJS.Timeout;

    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            updateHighScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      moleTimer = setInterval(() => {
        setActiveMole(Math.floor(Math.random() * GRID_SIZE));
      }, MOLE_INTERVAL);
    }

    return () => {
      clearInterval(timer);
      clearInterval(moleTimer);
    };
  }, [isPlaying, updateHighScore]);

  return (
    <Card className="p-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          {t('game.whack.title')}
        </h3>
        <div className="text-sm">{t('common.highScore')}: {highScore}</div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm">{t('common.score')}: {score}</div>
        <div className="text-sm">{t('game.whack.time')}: {timeLeft}s</div>
      </div>

      <div className="grid grid-cols-3 gap-2 aspect-square mb-4">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              variant="outline"
              className={`w-full h-full aspect-square ${
                activeMole === index ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => isPlaying && whackMole(index)}
              disabled={!isPlaying}
            >
              {activeMole === index && (
                <AnimatePresence>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    🦔
                  </motion.div>
                </AnimatePresence>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <Button 
        className="w-full" 
        onClick={startGame}
        disabled={isPlaying}
      >
        {isPlaying ? t('game.whack.inProgress') : t('common.start')}
      </Button>
    </Card>
  );
};

export default WhackAMole;
