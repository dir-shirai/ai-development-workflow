import type { Board, Tetromino, TetrominoType } from '@/app/types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_SHAPES, TETROMINO_COLORS } from '@/app/constants/tetris';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

export function createRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    type,
    shape: TETROMINO_SHAPES[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    color: TETROMINO_COLORS[type],
  };
}

export function isValidMove(board: Board, piece: Tetromino, newX: number, newY: number): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = newX + x;
        const boardY = newY + y;

        // Check boundaries
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with existing pieces (but allow negative Y for spawning)
        if (boardY >= 0 && board[boardY][boardX]) {
          return false;
        }
      }
    }
  }
  return true;
}

export function mergePieceToBoard(board: Board, piece: Tetromino): Board {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;

        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isFull = row.every(cell => cell !== null);
    if (isFull) {
      linesCleared++;
      return false;
    }
    return true;
  });

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }

  return { newBoard, linesCleared };
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const n = piece.shape.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(0));

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      rotated[x][n - 1 - y] = piece.shape[y][x];
    }
  }

  return {
    ...piece,
    shape: rotated,
  };
}

export function calculateScore(linesCleared: number): number {
  const baseScores = [0, 100, 300, 500, 800];
  return baseScores[Math.min(linesCleared, 4)];
}
