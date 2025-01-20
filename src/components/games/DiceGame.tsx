import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Trophy, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const DiceGame = () => {
  const [diceCount, setDiceCount] = useState(2);
  const [diceValues, setDiceValues] = useState<number[]>(Array(2).fill(1));
  const [isRolling, setIsRolling] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('diceGameHighScore');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('diceGameHighScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    setDiceValues(Array(diceCount).fill(1));
  }, [diceCount]);

  const calculateScore = (values: number[]) => {
    let points = values.reduce((sum, val) => sum + val, 0);
    
    // 当只有一个骰子时，直接返回点数
    if (values.length === 1) {
      toast.success(`Earned ${points} points`);
      return points;
    }
    
    // 多个骰子时的特殊组合检查
    const sortedValues = [...values].sort((a, b) => a - b);
    const uniqueValues = new Set(values);
    
    // 检查全相同
    if (uniqueValues.size === 1) {
      points *= 3;
      toast.success(`All same! Score x3! Earned ${points} points`);
      return points;
    }
    
    // 检查顺子
    let isSequence = true;
    for (let i = 1; i < sortedValues.length; i++) {
      if (sortedValues[i] !== sortedValues[i-1] + 1) {
        isSequence = false;
        break;
      }
    }
    
    if (isSequence) {
      points += values.length * 5;
      toast.success(`Sequence! Bonus +${values.length * 5}! Total ${points} points`);
      return points;
    }
    
    // 检查对子
    const valueCounts = new Map();
    values.forEach(val => {
      valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
    });
    
    let maxPairCount = 0;
    valueCounts.forEach(count => {
      if (count > maxPairCount) maxPairCount = count;
    });
    
    if (maxPairCount > 1) {
      points *= maxPairCount;
      toast.success(`${maxPairCount} of a kind! Score x${maxPairCount}! Earned ${points} points`);
      return points;
    }
    
    return points;
  };

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setRolls(prev => prev + 1);
    
    new Audio('/dice-roll.mp3').play().catch(() => {});
    
    const rollInterval = setInterval(() => {
      setDiceValues(prev => 
        prev.map(() => Math.floor(Math.random() * 6) + 1)
      );
    }, 50);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValues = Array(diceCount)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1);
      
      setDiceValues(finalValues);
      setIsRolling(false);
      
      const roundScore = calculateScore(finalValues);
      setScore(prev => prev + roundScore);
    }, 1000);
  };

  const getDiceFace = (value: number) => {
    return `⚀⚁⚂⚃⚄⚅`[value - 1];
  };

  const adjustDiceCount = (delta: number) => {
    const newCount = diceCount + delta;
    if (newCount >= 1 && newCount <= 6) {
      setDiceCount(newCount);
    }
  };

  return (
    <Card className="p-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Dices className="w-5 h-5" />
          Dice game
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Trophy className="w-4 h-4" />
            <span>{highScore}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setRolls(0);
              setScore(0);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => adjustDiceCount(-1)}
          disabled={diceCount <= 1 || isRolling}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium">{diceCount} Dice</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => adjustDiceCount(1)}
          disabled={diceCount >= 6 || isRolling}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex justify-center gap-4 flex-wrap my-8">
        <AnimatePresence mode="wait" initial={false}>
          {diceValues.map((dice, index) => (
            <motion.div
              key={`${dice}-${isRolling}-${index}`}
              initial={{ rotateX: 0, opacity: 1 }}
              animate={{ rotateX: isRolling ? [0, 360, 720, 1080] : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isRolling ? 1 : 0 }}
              className="text-6xl"
            >
              {getDiceFace(dice)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button 
        className="w-full" 
        onClick={rollDice} 
        disabled={isRolling}
      >
        {isRolling ? 'Rolling...' : 'Roll the dice'}
      </Button>

      <div className="text-sm text-muted-foreground mt-4 text-center space-y-1">
        <p>Current Score: {score}</p>
        <p>Total Rolls: {rolls}</p>
      </div>
    </Card>
  );
};

export default DiceGame;
