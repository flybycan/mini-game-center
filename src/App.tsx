import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import React from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isGamePage = location.pathname.includes('/games/');
  const [currentLang, setCurrentLang] = React.useState(i18n.language);

  React.useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  return (
    <>
      {!isGamePage && <Navigation />}
      {/* <div className="fixed top-4 right-4 z-50">
        <Select
          value={currentLang}
          onValueChange={(value) => {
            setCurrentLang(value);
            i18n.changeLanguage(value);
          }}
        >
          <SelectTrigger className="w-[100px] bg-background/50 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div> */}
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
