import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const BASE_SPEED = 200; // 降低基础速度，原来是较快的
const SPEED_INCREMENT = 10; // 保持相同的速度增量
// 定义安全区域的边距
const SAFE_MARGIN = 4;

// 生成随机的初始蛇位置
const getRandomInitialPosition = (): Position => {
  return {
    x: SAFE_MARGIN + Math.floor(Math.random() * (GRID_SIZE - 2 * SAFE_MARGIN)),
    y: SAFE_MARGIN + Math.floor(Math.random() * (GRID_SIZE - 2 * SAFE_MARGIN))
  };
};

const INITIAL_SNAKE: Position[] = [getRandomInitialPosition()];

const SnakeGame = () => {
  const { t } = useTranslation();
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved) : 0;
  });

  // 根据分数计算游戏速度
  const getCurrentSpeed = useCallback(() => {
    return Math.max(BASE_SPEED - Math.floor(score / 5) * SPEED_INCREMENT, 50);
  }, [score]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // 确保食物不会生成在蛇身上
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      generateFood();
      return;
    }
    setFood(newFood);
    // 播放食物生成音效
    new Audio('/food-appear.mp3').play().catch(() => {});
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('RIGHT');
    setScore(0);
    setIsPlaying(false);
    setIsPaused(false);
    generateFood();
  };

  const checkCollision = (head: Position): boolean => {
    // 检查墙壁碰撞
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // 检查自身碰撞
    return snake.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || isPaused) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    if (checkCollision(head)) {
      setIsPlaying(false);
      // 播放游戏结束音效
      new Audio('/game-over.mp3').play().catch(() => {});
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snake-highscore', score.toString());
        toast.success(t('game.snake.newRecord'));
      }
      toast.error(t('game.snake.gameOver'));
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      // 播放吃到食物音效
      new Audio('/eat-food.mp3').play().catch(() => {});
      setScore((prev) => prev + 1);
      generateFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, direction, food, isPlaying, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (!isPlaying || isPaused) return;
    
    const gameLoop = setInterval(moveSnake, getCurrentSpeed());
    return () => clearInterval(gameLoop);
  }, [moveSnake, isPlaying, isPaused, getCurrentSpeed]);

  const handleDirectionClick = (newDirection: Direction) => {
    if (!isPlaying || isPaused) return;
    
    switch (newDirection) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  };

  // 处理触摸滑动
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPlaying || isPaused) return;

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50 && direction !== 'LEFT') {
          setDirection('RIGHT');
        } else if (deltaX < -50 && direction !== 'RIGHT') {
          setDirection('LEFT');
        }
      } else {
        if (deltaY > 50 && direction !== 'UP') {
          setDirection('DOWN');
        } else if (deltaY < -50 && direction !== 'DOWN') {
          setDirection('UP');
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [direction, isPlaying, isPaused]);

  return (
    <Card className="p-6 w-full max-w-md mx-auto flex flex-col gap-4 min-h-[80vh]">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold">{t('game.snake.score')}: {score}</p>
          <p className="text-sm text-muted-foreground">{t('game.snake.highScore')}: {highScore}</p>
          <p className="text-xs text-muted-foreground">{t('game.snake.speed')}: {Math.round(1000 / getCurrentSpeed())}x</p>
        </div>
        <div className="space-x-2">
          {isPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(p => !p)}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isPlaying) {
                resetGame();
              } else {
                resetGame();
                setIsPlaying(true);
              }
            }}
          >
            {isPlaying ? t('game.snake.resetGame') : t('game.snake.startGame')}
          </Button>
        </div>
      </div>

      <div 
        className={`relative bg-secondary rounded-lg overflow-hidden mx-auto ${isPaused ? 'opacity-50' : ''}`}
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          maxWidth: '100%',
          aspectRatio: '1',
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-primary rounded-sm"
            style={{
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
            }}
          />
        ))}
        <div
          className="absolute bg-destructive rounded-full"
          style={{
            width: CELL_SIZE - 1,
            height: CELL_SIZE - 1,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mt-auto">
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('UP')}
          disabled={!isPlaying || isPaused}
          className="aspect-square"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('LEFT')}
          disabled={!isPlaying || isPaused}
          className="aspect-square"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
          {t('game.snake.controls')}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('RIGHT')}
          disabled={!isPlaying || isPaused}
          className="aspect-square"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('DOWN')}
          disabled={!isPlaying || isPaused}
          className="aspect-square"
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
        <div />
      </div>


    </Card>
  );
};

export default SnakeGame;