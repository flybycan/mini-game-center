import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices } from 'lucide-react';
import { toast } from 'sonner';

const DiceGame = () => {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rolls, setRolls] = useState(0);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setRolls(prev => prev + 1);
    
    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 50);

    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      const final1 = Math.floor(Math.random() * 6) + 1;
      const final2 = Math.floor(Math.random() * 6) + 1;
      setDice1(final1);
      setDice2(final2);
      setIsRolling(false);
      
      if (final1 === final2) {
        toast.success('Double pairs!');
      }
    }, 1000);
  };

  const getDiceFace = (value: number) => {
    return `⚀⚁⚂⚃⚄⚅`[value - 1];
  };

  return (
    <Card className="p-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Dices className="w-5 h-5" />
          Dice game
        </h3>
        <Button variant="outline" size="sm" onClick={() => setRolls(0)}>
          Reset
        </Button>
      </div>
      
      <div className="flex justify-center gap-8 my-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={dice1}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isRolling ? [0, 360, 720, 1080] : 0 }}
            transition={{ duration: isRolling ? 1 : 0 }}
            className="text-6xl"
          >
            {getDiceFace(dice1)}
          </motion.div>
          <motion.div
            key={dice2}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isRolling ? [0, 360, 720, 1080] : 0 }}
            transition={{ duration: isRolling ? 1 : 0 }}
            className="text-6xl"
          >
            {getDiceFace(dice2)}
          </motion.div>
        </AnimatePresence>
      </div>

      <Button 
        className="w-full" 
        onClick={rollDice} 
        disabled={isRolling}
      >
        {isRolling ? 'The dice are rolling...' : 'Roll the dice'}
      </Button>

      <p className="text-sm text-muted-foreground mt-4 text-center">
      Number of throws: {rolls}
      </p>
    </Card>
  );
};

export default DiceGame;
