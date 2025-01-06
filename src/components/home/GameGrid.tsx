import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
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
  Circle
} from "lucide-react";

export const games = [
  {
    id: "memory",
    title: "Memory Game",
    description: "Test your memory by matching pairs of cards",
    icon: <Gamepad2 className="w-6 h-6" />,
    available: true,
  },
  {
    id: "sliding",
    title: "Sliding Puzzle",
    description: "Arrange the numbers in order by sliding tiles",
    icon: <Puzzle className="w-6 h-6" />,
    available: true,
  },
  {
    id: "dice",
    title: "Dice Roll",
    description: "Roll the dice and test your luck",
    icon: <Dices className="w-6 h-6" />,
    available: true,
  },
  {
    id: "whack",
    title: "Whack-a-Mole",
    description: "Test your reflexes by catching the moles",
    icon: <Target className="w-6 h-6" />,
    available: true,
  },
  {
    id: "snake",
    title: "Snake Game",
    description: "Classic snake game with modern twist",
    icon: <Zap className="w-6 h-6" />,
    available: true,
  },
  {
    id: "bubble",
    title: "Bubble Pop",
    description: "Pop colorful bubbles in this relaxing game",
    icon: <Circle className="w-6 h-6" />,
    available: true,
  },
  {
    id: "tetris",
    title: "Mini Tetris",
    description: "Classic block-stacking puzzle game",
    icon: <Blocks className="w-6 h-6" />,
    available: false,
  },
  {
    id: "quiz",
    title: "Quick Quiz",
    description: "Test your knowledge with quick questions",
    icon: <Brain className="w-6 h-6" />,
    available: false,
  },
  {
    id: "match3",
    title: "Match Three",
    description: "Match similar items in rows or columns",
    icon: <Shapes className="w-6 h-6" />,
    available: false,
  },
  {
    id: "reaction",
    title: "Reaction Time",
    description: "Test your reaction speed",
    icon: <Timer className="w-6 h-6" />,
    available: false,
  },
];

const GameGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      {games.map((game) => (
        <Link 
          key={game.id} 
          to={`/games/${game.id}`}
          className={!game.available ? "pointer-events-none opacity-50" : ""}
        >
          <Card className="p-6 hover:bg-accent transition-colors group h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {game.icon}
              </div>
              <h3 className="text-xl font-semibold">{game.title}</h3>
            </div>
            <p className="text-muted-foreground">{game.description}</p>
            {!game.available && (
              <p className="text-sm text-muted-foreground mt-4 italic">Coming soon</p>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default GameGrid;