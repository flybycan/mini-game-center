import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Gamepad2, 
  Puzzle, 
  Dices, 
  Target, 
  Blocks, 
  Brain, 
  Shapes, 
  Timer, 
  Zap,
  Sparkles 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MemoryGame from "@/components/games/MemoryGame";
import SlidingPuzzle from "@/components/games/SlidingPuzzle";
import DiceGame from "@/components/games/DiceGame";
import WhackAMole from "@/components/games/WhackAMole";

const games = [
  {
    id: "memory",
    title: "Memory Game",
    description: "Test your memory by matching pairs of cards",
    icon: <Gamepad2 className="w-6 h-6" />,
    component: MemoryGame,
  },
  {
    id: "sliding",
    title: "Sliding Puzzle",
    description: "Arrange the numbers in order by sliding tiles",
    icon: <Puzzle className="w-6 h-6" />,
    component: SlidingPuzzle,
  },
  {
    id: "dice",
    title: "Dice Roll",
    description: "Roll the dice and test your luck",
    icon: <Dices className="w-6 h-6" />,
    component: DiceGame,
  },
  {
    id: "whack",
    title: "Whack-a-Mole",
    description: "Test your reflexes by catching the moles",
    icon: <Target className="w-6 h-6" />,
    component: WhackAMole,
  },
  {
    id: "snake",
    title: "Snake Game",
    description: "Classic snake game with modern twist",
    icon: <Zap className="w-6 h-6" />,
    component: SnakeGame,
  },
  {
    id: "tetris",
    title: "Mini Tetris",
    description: "Classic block-stacking puzzle game",
    icon: <Blocks className="w-6 h-6" />,
    component: null,
  },
  {
    id: "quiz",
    title: "Quick Quiz",
    description: "Test your knowledge with quick questions",
    icon: <Brain className="w-6 h-6" />,
    component: null,
  },
  {
    id: "match3",
    title: "Match Three",
    description: "Match similar items in rows or columns",
    icon: <Shapes className="w-6 h-6" />,
    component: null,
  },
  {
    id: "reaction",
    title: "Reaction Time",
    description: "Test your reaction speed",
    icon: <Timer className="w-6 h-6" />,
    component: null,
  },
  {
    id: "bubble",
    title: "Bubble Pop",
    description: "Pop colorful bubbles in this relaxing game",
    icon: <Sparkles className="w-6 h-6" />,
    component: null,
  },
];

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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto"
          >
            {games.map((game) => (
              <Link 
                key={game.id} 
                to={`/games/${game.id}`}
                className={game.component ? "" : "pointer-events-none opacity-50"}
              >
                <Card className="p-6 hover:bg-accent transition-colors group h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {game.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{game.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{game.description}</p>
                  {!game.component && (
                    <p className="text-sm text-muted-foreground mt-4 italic">Coming soon</p>
                  )}
                </Card>
              </Link>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Index;
