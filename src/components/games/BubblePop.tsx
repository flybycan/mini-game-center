import { useRef } from "react";
import { Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useBubbleGame, GAME_DURATION, COMBO_THRESHOLD, DifficultyLevel } from "@/hooks/use-bubble-game";

const BubblePop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    bubbles,
    score,
    combo,
    timeLeft,
    isPlaying,
    difficulty,
    highScore,
    setDifficulty,
    startGame,
    popBubble
  } = useBubbleGame(containerRef);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="w-[80vw] h-[80vh] p-6 flex flex-col bg-background/40 backdrop-blur-sm rounded-xl border border-primary/20 shadow-lg">
        <div className="flex justify-between items-center glass p-4 rounded-xl mb-4 bg-background/60 border border-primary/20 shadow-md">
          <div className="space-y-3">
            <div className="flex items-baseline gap-4">
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                {score}
              </p>
              <p className="text-sm text-muted-foreground font-medium">最高分: {highScore}</p>
            </div>
            {combo >= COMBO_THRESHOLD && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-500"
              >
                <span className="text-sm font-semibold">{combo} 连击</span>
                <span className="text-lg">🔥</span>
              </motion.div>
            )}
          </div>

          <div className="text-right space-y-3">
            <div className="text-xl font-bold">
              <motion.span
                key={timeLeft}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={timeLeft <= 10 ? 'text-red-500' : ''}
              >
                {timeLeft}s
              </motion.span>
            </div>
            {!isPlaying && (
              <div className="space-y-3">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="block w-full p-2 rounded-lg border border-primary/20 bg-background/60 backdrop-blur-sm transition-colors hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="easy">简单</option>
                  <option value="normal">普通</option>
                  <option value="hard">困难</option>
                </select>
                <Button 
                  onClick={startGame}
                  className="w-full transition-all hover:scale-105 active:scale-95"
                  size="lg"
                >
                  {timeLeft === GAME_DURATION ? "开始游戏" : "再来一局"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="flex-1 relative overflow-hidden rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-b from-background/40 to-background/20 backdrop-blur-sm"
      >
        <AnimatePresence>
          {isPlaying &&
            bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                initial={{ scale: 0, y: containerRef.current?.clientHeight || 600 }}
                animate={{
                  scale: 1,
                  y: [null, -100],
                  x: bubble.frozen ? bubble.x : [
                    bubble.x - bubble.amplitude! * Math.sin(bubble.angle!),
                    bubble.x + bubble.amplitude! * Math.sin(bubble.angle!)
                  ]
                }}
                transition={{
                  scale: { duration: 0.2 },
                  y: {
                    duration: bubble.frozen ? 8 : 4 / (bubble.speed || 1),
                    ease: "linear"
                  },
                  x: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                exit={{ scale: 0, opacity: 0 }}
                style={{
                  position: "absolute",
                  left: bubble.x,
                  bottom: 0,
                }}
                onClick={() => popBubble(bubble.id)}
                className="cursor-pointer transition-transform hover:scale-110 active:scale-90"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Circle
                  fill={bubble.color}
                  size={bubble.size}
                  className={`
                    ${bubble.type === 'special' ? 'animate-pulse shadow-lg shadow-yellow-500/50' : ''}
                    ${bubble.type === 'ice' ? 'shadow-lg shadow-cyan-500/50' : ''}
                    ${bubble.type === 'bomb' ? 'shadow-lg shadow-red-500/50' : ''}
                    ${bubble.frozen ? 'opacity-50 blur-[0.5px]' : ''}
                  `}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isPlaying && timeLeft === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center space-y-6 p-8 rounded-xl bg-background/60 border border-primary/20 shadow-xl"
            >
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                游戏结束！
              </h2>
              <p className="text-2xl font-semibold">最终得分: {score}</p>
              <Button 
                onClick={startGame} 
                size="lg"
                className="transition-all hover:scale-105 active:scale-95"
              >
                再来一局
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BubblePop;