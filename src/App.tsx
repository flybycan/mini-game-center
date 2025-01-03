import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import MemoryGame from "./components/games/MemoryGame";
import SlidingPuzzle from "./components/games/SlidingPuzzle";
import DiceGame from "./components/games/DiceGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Navigation />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games/memory" element={<MemoryGame />} />
            <Route path="/games/sliding" element={<SlidingPuzzle />} />
            <Route path="/games/dice" element={<DiceGame />} />
            {/* Additional game routes will be added as they are implemented */}
          </Routes>
        </main>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;