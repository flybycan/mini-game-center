import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Shapes } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

type Item = {
  id: string;
  color: string;
  isMatched: boolean;
};

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
const GRID_SIZE = 8;

const MatchThree = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [selectedItem, setSelectedItem] = useState<[number, number] | null>(null);
  const [grid, setGrid] = useState<Item[][]>([]);
  const [isSwapping, setIsSwapping] = useState(false);

  const createGrid = useCallback(() => {
    const newGrid: Item[][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row: Item[] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push({
          id: `${i}-${j}`,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          isMatched: false,
        });
      }
      newGrid.push(row);
    }
    return newGrid;
  }, []);

  const checkMatches = useCallback((board: Item[][]) => {
    let hasMatches = false;
    const matchedPositions = new Set<string>();

    // Check rows
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 2; j++) {
        if (
          board[i][j].color === board[i][j + 1].color &&
          board[i][j].color === board[i][j + 2].color
        ) {
          matchedPositions.add(`${i}-${j}`);
          matchedPositions.add(`${i}-${j + 1}`);
          matchedPositions.add(`${i}-${j + 2}`);
          hasMatches = true;
        }
      }
    }

    // Check columns
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (
          board[i][j].color === board[i + 1][j].color &&
          board[i][j].color === board[i + 2][j].color
        ) {
          matchedPositions.add(`${i}-${j}`);
          matchedPositions.add(`${i + 1}-${j}`);
          matchedPositions.add(`${i + 2}-${j}`);
          hasMatches = true;
        }
      }
    }

    if (hasMatches) {
      const newBoard = board.map((row, i) =>
        row.map((item, j) => ({
          ...item,
          isMatched: matchedPositions.has(`${i}-${j}`),
        }))
      );
      return newBoard;
    }

    return null;
  }, []);

  const removeMatches = useCallback((board: Item[][]) => {
    const newBoard = board.map((row) =>
      row.map((item) => {
        if (item.isMatched) {
          return {
            ...item,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            isMatched: false,
          };
        }
        return item;
      })
    );
    return newBoard;
  }, []);

  const handleItemClick = (row: number, col: number) => {
    if (isSwapping) return;

    if (!selectedItem) {
      setSelectedItem([row, col]);
      return;
    }

    const [selectedRow, selectedCol] = selectedItem;
    const isAdjacent =
      (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
      (Math.abs(selectedCol - col) === 1 && selectedRow === row);

    if (!isAdjacent) {
      setSelectedItem([row, col]);
      return;
    }

    setIsSwapping(true);
    const newGrid = [...grid];
    const temp = { ...newGrid[selectedRow][selectedCol] };
    newGrid[selectedRow][selectedCol] = { ...newGrid[row][col] };
    newGrid[row][col] = temp;

    const matchedGrid = checkMatches(newGrid);
    if (matchedGrid) {
      setGrid(matchedGrid);
      setTimeout(() => {
        const newGridAfterMatch = removeMatches(matchedGrid);
        setGrid(newGridAfterMatch);
        setScore((prev) => prev + 100);
        setIsSwapping(false);
      }, 300);
    } else {
      setTimeout(() => {
        const temp = { ...newGrid[row][col] };
        newGrid[row][col] = { ...newGrid[selectedRow][selectedCol] };
        newGrid[selectedRow][selectedCol] = temp;
        setGrid(newGrid);
        setIsSwapping(false);
        toast({
          title: t('game.match3.invalidMove'),
          description: t('game.match3.tryMatch'),
          variant: "destructive",
        });
      }, 300);
    }

    setSelectedItem(null);
  };

  useEffect(() => {
    setGrid(createGrid());
  }, [createGrid]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Shapes className="w-6 h-6" />
        <h1>{t('game.match3.title')}</h1>
      </div>

      <div className="text-xl font-bold">{t('game.match3.score')}: {score}</div>

      <div className="grid gap-1 p-2 bg-accent rounded-lg">
        {grid.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((item, j) => (
              <motion.div
                key={item.id}
                animate={{
                  scale: selectedItem?.[0] === i && selectedItem?.[1] === j ? 1.1 : 1,
                  opacity: item.isMatched ? 0.5 : 1,
                }}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded cursor-pointer"
                style={{ backgroundColor: item.color }}
                onClick={() => handleItemClick(i, j)}
              />
            ))}
          </div>
        ))}
      </div>

      <Button onClick={() => {
        setGrid(createGrid());
        setScore(0);
      }} variant="outline">
        {t('game.match3.newGame')}
      </Button>
    </div>
  );
};

export default MatchThree;