import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Puzzle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GRID_SIZE = 3;

const SlidingPuzzle = () => {
  const { t } = useTranslation();
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initializeGame = () => {
    const numbers = Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1);
    numbers.push(0); // Empty tile
    const shuffled = shuffleTiles(numbers);
    setTiles(shuffled);
    setMoves(0);
  };

  const shuffleTiles = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleTileClick = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    if (!isAdjacent(index, emptyIndex)) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    setTiles(newTiles);
    setMoves(moves + 1);
  };

  const isAdjacent = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / GRID_SIZE);
    const col1 = index1 % GRID_SIZE;
    const row2 = Math.floor(index2 / GRID_SIZE);
    const col2 = index2 % GRID_SIZE;
    
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  };

  return (
    <Card className="p-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Puzzle className="w-5 h-5" />
          {t('game.sliding.title')}
        </h3>
        <Button variant="outline" size="sm" onClick={initializeGame}>
          {t('common.reset')}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 aspect-square">
        {tiles.map((tile, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`w-full h-full flex items-center justify-center text-xl font-semibold cursor-pointer ${
                tile === 0 ? 'invisible' : 'bg-secondary hover:bg-secondary/80'
              }`}
              onClick={() => handleTileClick(index)}
            >
              {tile !== 0 && tile}
            </Card>
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Moves: {moves}
      </p>
    </Card>
  );
};

export default SlidingPuzzle;