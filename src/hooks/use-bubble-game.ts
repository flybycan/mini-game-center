import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from './use-toast';
import { useSoundEffects } from './use-sound-effects';

export interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  type: 'normal' | 'special' | 'ice' | 'bomb';
  speed?: number;
  frozen?: boolean;
  angle?: number;
  amplitude?: number;
}

export const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
export const SPECIAL_COLOR = "#FFD700";
export const ICE_COLOR = "#A5F3FC";
export const BOMB_COLOR = "#F43F5E";
export const COMBO_THRESHOLD = 3;
export const COMBO_BONUS = 0.5;
export const GAME_DURATION = 60;

export const DIFFICULTY_LEVELS = {
  easy: { spawnRate: 1500, maxBubbles: 8, baseSpeed: 0.5, specialChance: 0.15 },
  normal: { spawnRate: 1000, maxBubbles: 10, baseSpeed: 1, specialChance: 0.2 },
  hard: { spawnRate: 800, maxBubbles: 12, baseSpeed: 1.5, specialChance: 0.25 }
};

export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

export const useBubbleGame = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastPoppedType, setLastPoppedType] = useState<Bubble['type']>('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("normal");
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("bubblePopHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const [frozenTimer, setFrozenTimer] = useState<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { playSound } = useSoundEffects();

  const createBubble = useCallback(() => {
    if (!containerRef.current) return null;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rand = Math.random();
    const difficultySettings = DIFFICULTY_LEVELS[difficulty];
    
    let type: Bubble['type'] = 'normal';
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    if (rand < difficultySettings.specialChance * 0.5) {
      type = 'special';
      color = SPECIAL_COLOR;
    } else if (rand < difficultySettings.specialChance * 0.75) {
      type = 'ice';
      color = ICE_COLOR;
    } else if (rand < difficultySettings.specialChance) {
      type = 'bomb';
      color = BOMB_COLOR;
    }

    const timeProgress = 1 - timeLeft / GAME_DURATION;
    const speedMultiplier = 1 + timeProgress;
    const size = Math.random() * 20 + 40;
    const amplitude = Math.random() * 100 + 50;

    const bubble: Bubble = {
      id: Math.random(),
      x: Math.max(size, Math.min(containerRect.width - size, Math.random() * containerRect.width)),
      y: 0,
      color,
      size,
      type,
      speed: difficultySettings.baseSpeed * speedMultiplier,
      frozen: false,
      angle: Math.random() * Math.PI * 2,
      amplitude
    };
    return bubble;
  }, [difficulty, timeLeft]);

  const popBubble = useCallback((id: number) => {
    setBubbles((prev) => {
      const bubble = prev.find(b => b.id === id);
      if (!bubble) return prev;

      let points = 1;
      let message = "";

      if (bubble.type === lastPoppedType) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo >= COMBO_THRESHOLD) {
          const comboBonus = Math.floor(COMBO_BONUS * newCombo);
          points += comboBonus;
          message = `连击 x${newCombo}！+${comboBonus}分`;
        }
      } else {
        setCombo(0);
      }
      setLastPoppedType(bubble.type);

      switch (bubble.type) {
        case 'special':
          points *= 2;
          message = message || "双倍分数！";
          playSound("special");
          break;
        case 'ice':
          if (frozenTimer) clearTimeout(frozenTimer);
          setBubbles(bubbles => bubbles.map(b => ({ ...b, frozen: true })));
          const timer = setTimeout(() => {
            setBubbles(bubbles => bubbles.map(b => ({ ...b, frozen: false })));
          }, 3000);
          setFrozenTimer(timer);
          message = "冰冻效果！";
          break;
        case 'bomb':
          const bombRadius = 100;
          setBubbles(bubbles => bubbles.filter(b => {
            if (b.id === bubble.id) return false;
            const dx = b.x - bubble.x;
            const dy = b.y - bubble.y;
            return Math.sqrt(dx * dx + dy * dy) > bombRadius;
          }));
          message = "爆炸！";
          break;
      }

      setScore(prev => prev + points);
      if (message) {
        toast({
          title: message,
          description: points > 1 ? `+${points}分` : undefined,
          duration: 1000,
        });
      }
      playSound(bubble.type === 'special' ? "special" : "pop");
      
      return prev.filter((b) => b.id !== id);
    });
  }, [combo, lastPoppedType, frozenTimer, toast, playSound]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setBubbles([]);
    setCombo(0);
    setLastPoppedType('normal');
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const bubbleInterval = setInterval(() => {
      setBubbles((prev) => {
        const difficultySettings = DIFFICULTY_LEVELS[difficulty];
        if (prev.length >= difficultySettings.maxBubbles) return prev;
        const newBubble = createBubble();
        return newBubble ? [...prev, newBubble] : prev;
      });
    }, DIFFICULTY_LEVELS[difficulty].spawnRate);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          clearInterval(bubbleInterval);
          playSound("gameOver");
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("bubblePopHighScore", score.toString());
            toast({
              title: "新纪录！",
              description: `恭喜你创造了新的记录：${score}分`,
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
  }, [isPlaying, createBubble, difficulty, score, highScore, toast, playSound]);

  return {
    bubbles,
    score,
    combo,
    timeLeft,
    isPlaying,
    difficulty,
    highScore,
    setDifficulty,
    startGame,
    popBubble
  };
};