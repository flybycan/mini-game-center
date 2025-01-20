import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import MemoryGame from "./components/games/MemoryGame";
import SlidingPuzzle from "./components/games/SlidingPuzzle";
import DiceGame from "./components/games/DiceGame";
import WhackAMole from "./components/games/WhackAMole";
import SnakeGame from "./components/games/SnakeGame";
import BubblePop from "./components/games/BubblePop";
import TetrisGame from "./components/games/TetrisGame";
import ReactionTime from "./components/games/ReactionTime";
import MatchThree from "./components/games/MatchThree";
import QuickQuiz from "./components/games/QuickQuiz";
import ColorMatch from "./components/games/ColorMatch";
import TypingSpeed from "./components/games/TypingSpeed";
import AboutPage from "./components/about";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isGamePage = location.pathname.includes('/games/');

  return (
    <>
      {!isGamePage && <Navigation />}
      <main className='mt-16 flex justify-center items-center relative'>
        {isGamePage && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/games/memory" element={<MemoryGame />} />
          <Route path="/games/sliding" element={<SlidingPuzzle />} />
          <Route path="/games/dice" element={<DiceGame />} />
          <Route path="/games/whack" element={<WhackAMole />} />
          <Route path="/games/snake" element={<SnakeGame />} />
          <Route path="/games/bubble" element={<BubblePop />} />
          <Route path="/games/tetris" element={<TetrisGame />} />
          <Route path="/games/reaction" element={<ReactionTime />} />
          <Route path="/games/match3" element={<MatchThree />} />
          <Route path="/games/quiz" element={<QuickQuiz />} />
          <Route path="/games/color" element={<ColorMatch />} />
          <Route path="/games/typing" element={<TypingSpeed />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppContent />
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
