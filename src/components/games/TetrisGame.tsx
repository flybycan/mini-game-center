import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

type TetrisBlock = {
  shape: boolean[][];
  x: number;
  y: number;
  color: string;
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

const SHAPES = [
  {
    shape: [[1, 1, 1, 1]], // I
    color: "bg-cyan-500",
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ], // O
    color: "bg-yellow-500",
  },
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ], // T
    color: "bg-purple-500",
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ], // S
    color: "bg-green-500",
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ], // Z
    color: "bg-red-500",
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ], // L
    color: "bg-orange-500",
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ], // J
    color: "bg-blue-500",
  },
];

const TetrisGame = () => {
  const [board, setBoard] = useState<string[][]>(() =>
    Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(""))
  );
  const [currentBlock, setCurrentBlock] = useState<TetrisBlock | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const createNewBlock = useCallback(() => {
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      shape: randomShape.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(randomShape.shape[0].length / 2),
      y: 0,
      color: randomShape.color,
    };
  }, []);

  const checkCollision = useCallback(
    (block: TetrisBlock, boardState: string[][] = board) => {
      for (let y = 0; y < block.shape.length; y++) {
        for (let x = 0; x < block.shape[y].length; x++) {
          if (block.shape[y][x]) {
            const newX = block.x + x;
            const newY = block.y + y;
            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && boardState[newY][newX] !== "")
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [board]
  );

  const mergeBlockToBoard = useCallback(
    (block: TetrisBlock, boardState: string[][]) => {
      const newBoard = boardState.map(row => [...row]);
      for (let y = 0; y < block.shape.length; y++) {
        for (let x = 0; x < block.shape[y].length; x++) {
          if (block.shape[y][x]) {
            const boardY = block.y + y;
            if (boardY >= 0) {
              newBoard[boardY][block.x + x] = block.color;
            }
          }
        }
      }
      return newBoard;
    },
    []
  );

  const moveBlock = useCallback(
    (dx: number, dy: number) => {
      if (!currentBlock || gameOver || isPaused) return;

      const newBlock = {
        ...currentBlock,
        x: currentBlock.x + dx,
        y: currentBlock.y + dy,
      };

      if (!checkCollision(newBlock)) {
        setCurrentBlock(newBlock);
      } else if (dy > 0) {
        // Block has landed
        const newBoard = mergeBlockToBoard(currentBlock, board);
        setBoard(newBoard);

        // Check for completed lines
        let completedLines = 0;
        const updatedBoard = newBoard.filter((row) => {
          if (row.every((cell) => cell !== "")) {
            completedLines++;
            return false;
          }
          return true;
        });

        while (updatedBoard.length < BOARD_HEIGHT) {
          updatedBoard.unshift(Array(BOARD_WIDTH).fill(""));
        }

        if (completedLines > 0) {
          const points = [40, 100, 300, 1200][completedLines - 1] || 0;
          setScore((prev) => prev + points);
          toast({
            title: "Lines Cleared!",
            description: `You cleared ${completedLines} lines! +${points} points`,
          });
        }

        setBoard(updatedBoard);

        // Create new block
        const newBlock = createNewBlock();
        if (checkCollision(newBlock, updatedBoard)) {
          setGameOver(true);
          toast({
            title: "Game Over!",
            description: `Final Score: ${score}`,
            variant: "destructive",
          });
        } else {
          setCurrentBlock(newBlock);
        }
      }
    },
    [currentBlock, gameOver, isPaused, board, createNewBlock, checkCollision, mergeBlockToBoard, score, toast]
  );

  const rotateBlock = useCallback(() => {
    if (!currentBlock || gameOver || isPaused) return;

    const rotatedShape = currentBlock.shape[0].map((_, i) =>
      currentBlock.shape.map((row) => row[i]).reverse()
    );

    const newBlock = {
      ...currentBlock,
      shape: rotatedShape,
    };

    if (!checkCollision(newBlock)) {
      setCurrentBlock(newBlock);
    }
  }, [currentBlock, gameOver, isPaused, checkCollision]);

  useEffect(() => {
    if (!currentBlock && !gameOver) {
      setCurrentBlock(createNewBlock());
    }
  }, [currentBlock, gameOver, createNewBlock]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      moveBlock(0, 1);
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, moveBlock]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          moveBlock(-1, 0);
          break;
        case "ArrowRight":
          moveBlock(1, 0);
          break;
        case "ArrowDown":
          moveBlock(0, 1);
          break;
        case "ArrowUp":
          rotateBlock();
          break;
        case " ":
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver, isPaused, moveBlock, rotateBlock]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentBlock) {
      for (let y = 0; y < currentBlock.shape.length; y++) {
        for (let x = 0; x < currentBlock.shape[y].length; x++) {
          if (currentBlock.shape[y][x]) {
            const boardY = currentBlock.y + y;
            if (boardY >= 0) {
              displayBoard[boardY][currentBlock.x + x] = currentBlock.color;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <motion.div
            key={`${x}-${y}`}
            className={`w-6 h-6 border border-gray-700 ${
              cell || "bg-gray-900"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: cell ? 1 : 0.8 }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>
    ));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameOver || isPaused) return;
    const touch = e.touches[0];
    const touchStartX = touch.clientX;
    const touchStartY = touch.clientY;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) > 30) {
        moveBlock(deltaX > 0 ? 1 : -1, 0);
      }
      if (deltaY > 30) {
        moveBlock(0, 1);
      }
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleDoubleTap = () => {
    if (gameOver || isPaused) return;
    rotateBlock();
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill("")));
    setCurrentBlock(null);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-2xl font-bold">Score: {score}</h2>
        <Button
          variant="outline"
          onClick={() => setIsPaused((prev) => !prev)}
          disabled={gameOver}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button variant="destructive" onClick={resetGame}>
          Reset
        </Button>
      </div>

      <div
        className="border-4 border-gray-700 p-2 bg-gray-800"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onDoubleClick={isMobile ? handleDoubleTap : undefined}
      >
        {renderBoard()}
      </div>

      {(gameOver || isPaused) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              {gameOver ? "Game Over!" : "Paused"}
            </h2>
            {gameOver && <p className="mb-4">Final Score: {score}</p>}
            <Button onClick={gameOver ? resetGame : () => setIsPaused(false)}>
              {gameOver ? "Play Again" : "Resume"}
            </Button>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Swipe left/right to move</p>
          <p>Swipe down to drop faster</p>
          <p>Double tap to rotate</p>
        </div>
      )}
    </div>
  );
};

export default TetrisGame;