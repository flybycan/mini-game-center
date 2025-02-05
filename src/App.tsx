import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
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
import Game2048 from "./components/games/Game2048";
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
  const { i18n } = useTranslation();
  const isGamePage = location.pathname.includes('/games/');

  // 检查路径是否包含语言参数，如果没有则默认使用英语
  React.useEffect(() => {
    const hasLangParam = /\/(en|zh)$/.test(location.pathname);
    if (!hasLangParam) {
      const newPath = `${location.pathname}en`;
      navigate(newPath);
      return;
    }

    // 更新语言设置
    const currentLang = location.pathname.endsWith('/zh') ? 'zh' : 'en';
    i18n.changeLanguage(currentLang);
  }, [location.pathname, navigate, i18n]);


  return (
    <>
      {!isGamePage && <Navigation />}

      <main className='min-h-screen flex justify-center items-center relative'>
        {isGamePage && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            onClick={() => {
              const currentLang = location.pathname.endsWith('/zh') ? 'zh' : 'en';
              navigate(`/mini-game-center/${currentLang}`);
            }}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <Routes>
          <Route path="/:path(|mini-game-center|mini-game-center/)" element={<Navigate to="/mini-game-center/en" replace />} />
          <Route path="/mini-game-center/:lang" element={<Index />} />
          <Route path="/mini-game-center/about/:lang" element={<AboutPage />} />
          <Route path="/mini-game-center/games/memory/:lang" element={<MemoryGame />} />
          <Route path="/mini-game-center/games/sliding/:lang" element={<SlidingPuzzle />} />
          <Route path="/mini-game-center/games/dice/:lang" element={<DiceGame />} />
          <Route path="/mini-game-center/games/whack/:lang" element={<WhackAMole />} />
          <Route path="/mini-game-center/games/snake/:lang" element={<SnakeGame />} />
          <Route path="/mini-game-center/games/2048/:lang" element={<Game2048 />} />
          <Route path="/mini-game-center/games/tetris/:lang" element={<TetrisGame />} />
          <Route path="/mini-game-center/games/reaction/:lang" element={<ReactionTime />} />
          <Route path="/mini-game-center/games/match3/:lang" element={<MatchThree />} />
          <Route path="/mini-game-center/games/quiz/:lang" element={<QuickQuiz />} />
          <Route path="/mini-game-center/games/color/:lang" element={<ColorMatch />} />
          <Route path="/mini-game-center/games/typing/:lang" element={<TypingSpeed />} />
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
