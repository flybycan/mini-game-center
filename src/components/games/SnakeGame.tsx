import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
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

type GameMode = 'SINGLE' | 'TWO_PLAYERS' | 'VS_AI';

// 移动蛇的辅助函数
const moveSnake = (snake: Position[], direction: Direction): Position[] => {
  const head = snake[0];
  const newHead = {
    x: head.x + (direction === 'RIGHT' ? 1 : direction === 'LEFT' ? -1 : 0),
    y: head.y + (direction === 'DOWN' ? 1 : direction === 'UP' ? -1 : 0)
  };
  return [newHead, ...snake.slice(0, -1)];
};

// 检查碰撞的辅助函数
const checkCollision = (head: Position, obstacles: Position[]): boolean => {
  return obstacles.some(pos => pos.x === head.x && pos.y === head.y) ||
    head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
};

const SnakeGame = () => {
  const { t } = useTranslation();
  const [gameMode, setGameMode] = useState<GameMode>('SINGLE');
  const [snake1, setSnake1] = useState<Position[]>(INITIAL_SNAKE);
  const [snake2, setSnake2] = useState<Position[]>([]);
  const [direction1, setDirection1] = useState<Direction>('RIGHT');
  const [direction2, setDirection2] = useState<Direction>('LEFT');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved) : 0;
  });
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });

  // 根据分数计算游戏速度
  const getCurrentSpeed = useCallback(() => {
    return Math.max(BASE_SPEED - Math.floor(score1 / 5) * SPEED_INCREMENT, 50);
  }, [score1]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // 确保食物不会生成在任何蛇身上
    if (snake1.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
        snake2.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      generateFood();
      return;
    }
    setFood(newFood);
    // 播放食物生成音效
    new Audio('/food-appear.mp3').play().catch(() => {});
  }, [snake1, snake2]);

  const resetGame = () => {
    setSnake1(INITIAL_SNAKE);
    setSnake2([]);
    setDirection1('RIGHT');
    setDirection2('LEFT');
    setScore1(0);
    setScore2(0);
    setIsPlaying(false);
    setIsPaused(false);
    setIsGameOver(false);
    generateFood();
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setSnake1(INITIAL_SNAKE);
    if (mode !== 'SINGLE') {
      const initialSnake2: Position[] = [{
        x: GRID_SIZE - SAFE_MARGIN,
        y: GRID_SIZE - SAFE_MARGIN
      }];
      setSnake2(initialSnake2);
    } else {
      setSnake2([]);
    }
    setDirection1('RIGHT');
    setDirection2('LEFT');
    setScore1(0);
    setScore2(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsGameOver(false);
    generateFood();
  };

  const handleDirectionClick = (dir: Direction) => {
    if (!isPlaying || isPaused) return;
    
    // 防止反向移动
    if (dir === 'UP' && direction1 === 'DOWN') return;
    if (dir === 'DOWN' && direction1 === 'UP') return;
    if (dir === 'LEFT' && direction1 === 'RIGHT') return;
    if (dir === 'RIGHT' && direction1 === 'LEFT') return;
    
    setDirection1(dir);
  };

  // AI方向决策函数
  const getAIDirection = useCallback((snake: Position[], food: Position, otherSnake: Position[]): Direction => {
    const head = snake[0];
    const possibleMoves: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    
    // 首先过滤掉会导致碰撞的移动
    const safeMoves = possibleMoves.filter(dir => {
      const newHead = {
        x: head.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
        y: head.y + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0)
      };
      return !checkCollision(newHead, [...snake.slice(1), ...otherSnake]);
    });
    
    // 如果没有安全移动，返回任意方向（游戏会结束）
    if (safeMoves.length === 0) return 'RIGHT';
    
    // 计算每个安全移动到食物的距离
    const moveDistances = safeMoves.map(dir => {
      const newHead = {
        x: head.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
        y: head.y + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0)
      };
      // 计算曼哈顿距离
      return {
        direction: dir,
        distance: Math.abs(newHead.x - food.x) + Math.abs(newHead.y - food.y)
      };
    });
    
    // 按距离排序并选择最短的
    moveDistances.sort((a, b) => a.distance - b.distance);
    return moveDistances[0].direction;
  }, []);

  // 游戏主循环
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const gameLoop = setInterval(() => {
      setSnake1(prevSnake => {
        const newSnake = moveSnake(prevSnake, direction1);
        const head = newSnake[0];

        if (checkCollision(head, [...prevSnake.slice(1), ...snake2])) {
          toast.error(t('game.snake.player1Lost'));
          // 更新高分记录
          if (score1 > highScore) {
            setHighScore(score1);
            localStorage.setItem('snake-highscore', score1.toString());
          }
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        if (head.x === food.x && head.y === food.y) {
          setScore1(s => s + 1);
          generateFood();
          return [head, ...prevSnake];
        }

        return newSnake;
      });

      if (gameMode !== 'SINGLE') {
        setSnake2(prevSnake => {
          if (!prevSnake.length) return prevSnake;

          const newDirection = gameMode === 'VS_AI' ?
            getAIDirection(prevSnake, food, snake1) : direction2;

          const newSnake = moveSnake(prevSnake, newDirection);
          const head = newSnake[0];

          if (checkCollision(head, [...prevSnake.slice(1), ...snake1])) {
            toast.error(t('game.snake.player2Lost'));
            // 更新高分记录
            if (score1 > highScore) {
              setHighScore(score1);
              localStorage.setItem('snake-highscore', score1.toString());
            }
            setIsGameOver(true);
            setIsPlaying(false);
            return prevSnake;
          }

          if (head.x === food.x && head.y === food.y) {
            setScore2(s => s + 1);
            generateFood();
            return [head, ...prevSnake];
          }

          return newSnake;
        });
      }
    }, getCurrentSpeed());

    return () => clearInterval(gameLoop);
  }, [isPlaying, isPaused, direction1, direction2, gameMode, food, snake1, snake2, generateFood, getCurrentSpeed, getAIDirection, t, score1, highScore]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;

      // Player 1 controls (Arrow keys)
      switch (e.key) {
        case 'ArrowUp':
          setDirection1(prev => prev !== 'DOWN' ? 'UP' : prev);
          break;
        case 'ArrowDown':
          setDirection1(prev => prev !== 'UP' ? 'DOWN' : prev);
          break;
        case 'ArrowLeft':
          setDirection1(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
          break;
        case 'ArrowRight':
          setDirection1(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
          break;
      }

      // Player 2 controls (WASD)
      if (gameMode === 'TWO_PLAYERS') {
        switch (e.key.toLowerCase()) {
          case 'w':
            setDirection2(prev => prev !== 'DOWN' ? 'UP' : prev);
            break;
          case 's':
            setDirection2(prev => prev !== 'UP' ? 'DOWN' : prev);
            break;
          case 'a':
            setDirection2(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
            break;
          case 'd':
            setDirection2(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isPaused, gameMode]);

  return (
    <Card className="p-6 w-full max-w-md mx-auto flex flex-col gap-4 min-h-[80vh]">
      {!isPlaying && !isGameOver ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">{t('game.snake.title')}</h2>
          <div className="grid grid-cols-1 gap-4">
            <Button onClick={() => startGame('SINGLE')}>
              {t('game.snake.singlePlayer')}
            </Button>
            <Button onClick={() => startGame('TWO_PLAYERS')}>
              {t('game.snake.twoPlayers')}
            </Button>
            <Button onClick={() => startGame('VS_AI')}>
              {t('game.snake.vsAI')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-semibold">
                {gameMode === 'SINGLE' ? 
                  `${t('game.snake.score')}: ${score1}` : 
                  `${t('game.snake.player1')}: ${score1}`
                }
              </p>
              {gameMode !== 'SINGLE' && (
                <p className="text-lg font-semibold">
                  {`${gameMode === 'TWO_PLAYERS' ? t('game.snake.player2') : t('game.snake.ai')}: ${score2}`}
                </p>
              )}
              <p className="text-sm text-muted-foreground">{t('game.snake.highScore')}: {highScore}</p>
            </div>
            <div className="space-x-2">
              {!isGameOver && (
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
                onClick={resetGame}
              >
                {t('game.snake.resetGame')}
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
              {/* Player 1 Snake */}
              {snake1.map((segment, index) => (
                <div
                  key={`p1-${index}`}
                  className="absolute bg-primary rounded-sm"
                  style={{
                    width: CELL_SIZE - 1,
                    height: CELL_SIZE - 1,
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                  }}
                />
              ))}
              
              {/* Player 2 Snake */}
              {snake2.map((segment, index) => (
                <div
                  key={`p2-${index}`}
                  className="absolute bg-blue-500 rounded-sm"
                  style={{
                    width: CELL_SIZE - 1,
                    height: CELL_SIZE - 1,
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                  }}
                />
              ))}
              
              {/* Food */}
              <div
                className="absolute bg-destructive rounded-full"
                style={{
                  width: CELL_SIZE - 1,
                  height: CELL_SIZE - 1,
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                }}
              />

              {/* Game Over Overlay */}
              {isGameOver && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
                  <h2 className="text-2xl font-bold mb-4">{t('game.snake.gameOver')}</h2>
                  <p className="text-xl mb-2">
                    {gameMode === 'SINGLE' ? 
                      `${t('game.snake.finalScore')}: ${score1}` : 
                      `${t('game.snake.player1')}: ${score1}, ${gameMode === 'TWO_PLAYERS' ? t('game.snake.player2') : t('game.snake.ai')}: ${score2}`
                    }
                  </p>
                  {score1 > highScore && (
                    <p className="text-yellow-400 text-lg mb-4">{t('game.snake.newRecord')}!</p>
                  )}
                  <Button 
                    onClick={() => startGame(gameMode)}
                    className="mt-4"
                  >
                    {t('game.snake.playAgain')}
                  </Button>
                </div>
              )}
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
        </>
      )}
    </Card>
  );
};

export default SnakeGame;