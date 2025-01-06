import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface TetrisBlock {
  shape: boolean[][];
  x: number;
  y: number;
  color: string;
}

const SHAPES = {
  I: {
    shape: [
      [true],
      [true],
      [true],
      [true]
    ],
    color: "#FF0D0D"
  },
  O: {
    shape: [
      [true, true],
      [true, true]
    ],
    color: "#4ECDC4"
  },
  T: {
    shape: [
      [true, true, true],
      [false, true, false]
    ],
    color: "#45B7D1"
  },
  L: {
    shape: [
      [true, false],
      [true, false],
      [true, true]
    ],
    color: "#96CEB4"
  },
  J: {
    shape: [
      [false, true],
      [false, true],
      [true, true]
    ],
    color: "#FFEEAD"
  },
  S: {
    shape: [
      [false, true, true],
      [true, true, false]
    ],
    color: "#FF6B6B"
  },
  Z: {
    shape: [
      [true, true, false],
      [false, true, true]
    ],
    color: "#C7F464"
  }
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const GAME_SPEED = 1000;

const TetrisGame = () => {
  const [board, setBoard] = useState<string[][]>(
    Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(""))
  );
  const [currentBlock, setCurrentBlock] = useState<TetrisBlock>({
    shape: SHAPES.I.shape,
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0,
    color: SHAPES.I.color
  });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const createNewBlock = useCallback(() => {
    const shapes = Object.values(SHAPES);
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
      shape: randomShape.shape,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      color: randomShape.color
    };
  }, []);

  const checkCollision = useCallback(
    (block: TetrisBlock, boardToCheck: string[][] = board) => {
      return block.shape.some((row, dy) =>
        row.some((cell, dx) => {
          if (!cell) return false;
          const newY = block.y + dy;
          const newX = block.x + dx;
          return (
            newY >= BOARD_HEIGHT ||
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            (newY >= 0 && boardToCheck[newY][newX])
          );
        })
      );
    },
    [board]
  );

  const moveBlock = useCallback(
    (dx: number) => {
      if (isPaused || isGameOver) return;
      const newBlock = {
        ...currentBlock,
        x: currentBlock.x + dx
      };
      if (!checkCollision(newBlock)) {
        setCurrentBlock(newBlock);
      }
    },
    [currentBlock, checkCollision, isPaused, isGameOver]
  );

  const rotateBlock = useCallback(() => {
    if (isPaused || isGameOver) return;
    const newShape = currentBlock.shape[0].map((_, index) =>
      currentBlock.shape.map(row => row[index]).reverse()
    );
    const newBlock = {
      ...currentBlock,
      shape: newShape
    };
    if (!checkCollision(newBlock)) {
      setCurrentBlock(newBlock);
    }
  }, [currentBlock, checkCollision, isPaused, isGameOver]);

  const dropBlock = useCallback(() => {
    if (isPaused || isGameOver) return;
    const newBlock = {
      ...currentBlock,
      y: currentBlock.y + 1
    };
    if (!checkCollision(newBlock)) {
      setCurrentBlock(newBlock);
    } else {
      // Merge block with board
      const newBoard = board.map(row => [...row]);
      currentBlock.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell && currentBlock.y + dy >= 0) {
            newBoard[currentBlock.y + dy][currentBlock.x + dx] = currentBlock.color;
          }
        });
      });

      // Check for completed lines
      let completedLines = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell !== "")) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(""));
          completedLines++;
          y++;
        }
      }

      // Update score
      if (completedLines > 0) {
        const points = [0, 100, 300, 500, 800][completedLines];
        setScore(score => score + points);
        toast({
          title: "Lines Cleared!",
          description: `You cleared ${completedLines} lines! +${points} points`,
        });
      }

      setBoard(newBoard);
      const nextBlock = createNewBlock();
      if (checkCollision(nextBlock, newBoard)) {
        setIsGameOver(true);
        toast({
          title: "Game Over!",
          description: `Final Score: ${score}`,
          variant: "destructive",
        });
      } else {
        setCurrentBlock(nextBlock);
      }
    }
  }, [currentBlock, board, checkCollision, createNewBlock, isPaused, isGameOver, score, toast]);

  useEffect(() => {
    if (isPaused || isGameOver) return;
    const interval = setInterval(dropBlock, GAME_SPEED);
    return () => clearInterval(interval);
  }, [dropBlock, isPaused, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          moveBlock(-1);
          break;
        case "ArrowRight":
          moveBlock(1);
          break;
        case "ArrowDown":
          dropBlock();
          break;
        case "ArrowUp":
          rotateBlock();
          break;
        case " ":
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [moveBlock, dropBlock, rotateBlock]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    currentBlock.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (
          cell &&
          currentBlock.y + dy >= 0 &&
          currentBlock.y + dy < BOARD_HEIGHT &&
          currentBlock.x + dx >= 0 &&
          currentBlock.x + dx < BOARD_WIDTH
        ) {
          displayBoard[currentBlock.y + dy][currentBlock.x + dx] = currentBlock.color;
        }
      });
    });

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className="w-6 h-6 border border-gray-700"
            style={{ backgroundColor: cell || "transparent" }}
          />
        ))}
      </div>
    ));
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill("")));
    setCurrentBlock(createNewBlock());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold">Score: {score}</p>
        <div className="space-x-2">
          <Button onClick={() => setIsPaused(p => !p)}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button onClick={resetGame}>New Game</Button>
        </div>
      </div>

      <div className="bg-background border-2 border-primary p-2 rounded-lg">
        {renderBoard()}
      </div>

      {(isGameOver || isPaused) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">
              {isGameOver ? "Game Over!" : "Paused"}
            </h2>
            {isGameOver && <p className="text-xl">Final Score: {score}</p>}
            <Button onClick={isGameOver ? resetGame : () => setIsPaused(false)}>
              {isGameOver ? "Play Again" : "Resume"}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      <div className="md:hidden mt-8 grid grid-cols-3 gap-4">
        <Button onClick={() => moveBlock(-1)}>←</Button>
        <Button onClick={rotateBlock}>Rotate</Button>
        <Button onClick={() => moveBlock(1)}>→</Button>
        <Button onClick={dropBlock} className="col-span-3">
          Drop
        </Button>
      </div>
    </div>
  );
};

export default TetrisGame;