import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import Hero from "@/components/home/Hero";
import GameGrid from "@/components/home/GameGrid";
import MemoryGame from "@/components/games/MemoryGame";
import SlidingPuzzle from "@/components/games/SlidingPuzzle";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="page-transition">
      <section className="min-h-screen flex flex-col items-center justify-center section-padding">
        <Hero />
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full space-y-8"
          >
            <MemoryGame />
            <SlidingPuzzle />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GameGrid />
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Index;