import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Hero from "@/components/home/Hero";
import GameGrid from "@/components/home/GameGrid";
import MemoryGame from "@/components/games/MemoryGame";
import SlidingPuzzle from "@/components/games/SlidingPuzzle";

const Index = () => {
  const isMobile = useIsMobile();
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleBackToHome = () => {
    setIsGameStarted(false);
  };

  return (
    <div className="page-transition">
      <section className="min-h-screen flex flex-col items-center justify-center section-padding relative">
        {isGameStarted ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={handleBackToHome}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        ) : (
          <Hero />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GameGrid  />
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
