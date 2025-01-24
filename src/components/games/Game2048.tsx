import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Game2048 = () => {
  const { t } = useTranslation();
  const [board, setBoard] = useState<number[][]>([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('2048-highscore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);

  // 初始化游戏
  const initGame = useCallback(() => {
    const newBoard = Array(4).fill(0).map(() => Array(4).fill(0));
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  // 在随机空位添加新的数字
  const addNewTile = (currentBoard: number[][]) => {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      currentBoard[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // 检查是否可以继续移动
  const canMove = (board: number[][]) => {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true;
      }
    }
    // 检查相邻的数字是否可以合并
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3 && board[i][j] === board[i + 1][j]) return true;
        if (j < 3 && board[i][j] === board[i][j + 1]) return true;
      }
    }
    return false;
  };

  // 移动和合并数字
  const move = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;

    let moved = false;
    const newBoard = board.map(row => [...row]);
    let newScore = score;

    const moveAndMerge = (line: number[]) => {
      // 移除空格
      let newLine = line.filter(cell => cell !== 0);
      // 合并相同的数字
      for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
          newLine[i] *= 2;
          newScore += newLine[i];
          newLine.splice(i + 1, 1);
        }
      }
      // 补充空格
      while (newLine.length < 4) {
        newLine.push(0);
      }
      return newLine;
    };

    // 根据方向处理每一行/列
    if (direction === 'LEFT' || direction === 'RIGHT') {
      for (let i = 0; i < 4; i++) {
        const line = newBoard[i];
        const oldLine = [...line];
        const newLine = moveAndMerge(direction === 'LEFT' ? line : line.reverse());
        newBoard[i] = direction === 'LEFT' ? newLine : newLine.reverse();
        if (oldLine.some((val, idx) => val !== newBoard[i][idx])) moved = true;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const line = newBoard.map(row => row[j]);
        const oldLine = [...line];
        const newLine = moveAndMerge(direction === 'UP' ? line : line.reverse());
        const finalLine = direction === 'UP' ? newLine : newLine.reverse();
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = finalLine[i];
        }
        if (oldLine.some((val, idx) => val !== finalLine[idx])) moved = true;
      }
    }

    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('2048-highscore', newScore.toString());
        toast.success(t('game.2048.newRecord'));
      }

      if (!canMove(newBoard)) {
        setGameOver(true);
        toast.error(t('game.2048.gameOver'));
      }
    }
  };

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          move('UP');
          break;
        case 'ArrowDown':
          move('DOWN');
          break;
        case 'ArrowLeft':
          move('LEFT');
          break;
        case 'ArrowRight':
          move('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, score, gameOver]);

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, [initGame]);

  // 获取方块的背景颜色
  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      2: 'bg-blue-200',
      4: 'bg-blue-300',
      8: 'bg-green-300',
      16: 'bg-green-400',
      32: 'bg-yellow-300',
      64: 'bg-yellow-400',
      128: 'bg-orange-300',
      256: 'bg-orange-400',
      512: 'bg-red-300',
      1024: 'bg-red-400',
      2048: 'bg-purple-400'
    };
    return colors[value] || 'bg-gray-200';
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto flex flex-col gap-4 min-h-[80vh]">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold">{t('game.2048.score')}: {score}</p>
          <p className="text-sm text-muted-foreground">{t('game.2048.bestScore')}: {highScore}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={initGame}
          className="h-8 w-8"
          title={t('game.2048.restart')}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4 bg-secondary rounded-lg">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-16 h-16 flex items-center justify-center rounded-lg
                ${getTileColor(cell)} transition-all duration-100 text-primary-foreground font-bold
                ${cell >= 100 ? 'text-lg' : 'text-xl'}
                ${cell >= 1000 ? 'text-base' : ''}
              `}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mt-auto">
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => move('UP')}
          className="aspect-square"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => move('LEFT')}
          className="aspect-square"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
          {t('game.2048.useArrows')}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => move('RIGHT')}
          className="aspect-square"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => move('DOWN')}
          className="aspect-square"
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
        <div />
      </div>
    </Card>
  );
};

export default Game2048;