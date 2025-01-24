import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = ['🎨', '🎮', '🎵', '💻', '📱', '🎯', '🎲', '🎪'];

const MemoryGame = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);

  const initializeGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (isChecking || flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);
      
      setTimeout(() => {
        checkMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkMatch = (currentFlippedCards: number[]) => {
    const [first, second] = currentFlippedCards;
    const newCards = [...cards];

    if (cards[first].emoji === cards[second].emoji) {
      newCards[first].isMatched = true;
      newCards[second].isMatched = true;
    } else {
      newCards[first].isFlipped = false;
      newCards[second].isFlipped = false;
    }

    setCards(newCards);
    setFlippedCards([]);
    setIsChecking(false);
  };

  return (
    <Card className="p-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          {t('game.memory.title')}
        </h3>
        <Button variant="outline" size="sm" onClick={initializeGame}>
          {t('common.reset')}
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileTap={{ scale: 0.95 }}
            className="aspect-square"
          >
            <Card
              className={`w-full h-full flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
                card.isFlipped ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.isFlipped ? card.emoji : '?'}
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

export default MemoryGame;