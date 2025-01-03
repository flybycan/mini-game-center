import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import MemoryGame from "@/components/games/MemoryGame";
import SlidingPuzzle from "@/components/games/SlidingPuzzle";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="page-transition">
      <section className="min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-wider mb-4 inline-block"
          >
            Welcome
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Creative Developer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-lg mx-auto mb-8"
          >
            Crafting digital experiences with attention to detail and a focus on user experience
          </motion.p>
        </div>

        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full space-y-8"
          >
            <MemoryGame />
            <SlidingPuzzle />
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Index;