import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
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
  Circle,
  Palette,
  Keyboard
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
    id: "2048",
    title: "2048",
    description: "Classic number merging puzzle game",
    icon: <Blocks className="w-6 h-6" />,
    available: true,
  },
  {
    id: "tetris",
    title: "Mini Tetris",
    description: "Classic block-stacking puzzle game",
    icon: <Blocks className="w-6 h-6" />,
    available: true,
  },
  {
    id: "reaction",
    title: "Reaction Time",
    description: "Test your reaction speed",
    icon: <Timer className="w-6 h-6" />,
    available: true,
  },
  {
    id: "match3",
    title: "Match Three",
    description: "Match similar items in rows or columns",
    icon: <Shapes className="w-6 h-6" />,
    available: true,
  },
  {
    id: "quiz",
    title: "Quick Quiz",
    description: "Test your knowledge with quick questions",
    icon: <Brain className="w-6 h-6" />,
    available: true,
  },
  {
    id: "color",
    title: "Color Match",
    description: "Quickly determine if the colors match",
    icon: <Palette className="w-6 h-6" />,
    available: true,
  },
  {
    id: "typing",
    title: "Typing Speed",
    description: "Test your typing speed",
    icon: <Keyboard className="w-6 h-6" />,
    available: true,
  },
];

const GameGrid = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      {games.map((game) => (
        <Link 
          key={game.id} 
          to={`/mini-game-center/games/${game.id}/${i18n.language}`}
          className={!game.available ? "pointer-events-none opacity-50" : ""}
        >
          <Card className="p-6 hover:bg-accent transition-colors group h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {game.icon}
              </div>
              <h3 className="text-xl font-semibold">{t(`game.${game.id}.title`)}</h3>
            </div>
            <p className="text-muted-foreground">{t(`game.${game.id}.desc`)}</p>
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