import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('RIGHT');
    setScore(0);
    setIsPlaying(false);
    generateFood();
  };

  const checkCollision = (head: Position): boolean => {
    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // Check self collision
    return snake.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying) return;

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
      if (score > highScore) {
        setHighScore(score);
        toast.success('New High Score!');
      }
      toast.error('Game Over!');
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      generateFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, direction, food, isPlaying, score, highScore, generateFood]);

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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake, isPlaying]);

  const handleDirectionClick = (newDirection: Direction) => {
    if (!isPlaying) return;
    
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

  return (
    <Card className="p-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm">Score: {score}</p>
          <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (isPlaying) {
              resetGame();
            } else {
              setIsPlaying(true);
            }
          }}
        >
          {isPlaying ? 'Reset' : 'Start'}
        </Button>
      </div>

      <div 
        className="relative bg-secondary rounded-lg overflow-hidden mb-4"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
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

      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('UP')}
        >
          <ArrowUp />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('LEFT')}
        >
          <ArrowLeft />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('RIGHT')}
        >
          <ArrowRight />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDirectionClick('DOWN')}
        >
          <ArrowDown />
        </Button>
        <div />
      </div>
    </Card>
  );
};

export default SnakeGame;