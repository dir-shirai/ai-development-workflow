import { useState, useCallback, useEffect } from 'react';
import type { GameState, Tetromino } from '@/app/types/tetris';
import {
  createEmptyBoard,
  createRandomTetromino,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  rotatePiece,
  calculateScore,
} from '@/app/utils/tetris';
import { GAME_SPEED } from '@/app/constants/tetris';

export function useTetris() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: createRandomTetromino(),
    nextPiece: createRandomTetromino(),
    score: 0,
    gameOver: false,
    isPaused: false,
  }));

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newX = prev.currentPiece.position.x - 1;
      if (isValidMove(prev.board, prev.currentPiece, newX, prev.currentPiece.position.y)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: { ...prev.currentPiece.position, x: newX },
          },
        };
      }
      return prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newX = prev.currentPiece.position.x + 1;
      if (isValidMove(prev.board, prev.currentPiece, newX, prev.currentPiece.position.y)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: { ...prev.currentPiece.position, x: newX },
          },
        };
      }
      return prev;
    });
  }, []);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newY = prev.currentPiece.position.y + 1;
      if (isValidMove(prev.board, prev.currentPiece, prev.currentPiece.position.x, newY)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: { ...prev.currentPiece.position, y: newY },
          },
        };
      }

      // Piece cannot move down, lock it to the board
      const newBoard = mergePieceToBoard(prev.board, prev.currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = prev.score + calculateScore(linesCleared);

      // Check if game is over (piece locked at top)
      const gameOver = prev.currentPiece.position.y <= 0;

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: gameOver ? null : prev.nextPiece,
        nextPiece: gameOver ? null : createRandomTetromino(),
        score: newScore,
        gameOver,
      };
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const rotated = rotatePiece(prev.currentPiece);
      if (isValidMove(prev.board, rotated, rotated.position.x, rotated.position.y)) {
        return {
          ...prev,
          currentPiece: rotated,
        };
      }
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      let dropY = prev.currentPiece.position.y;
      while (isValidMove(prev.board, prev.currentPiece, prev.currentPiece.position.x, dropY + 1)) {
        dropY++;
      }

      const droppedPiece: Tetromino = {
        ...prev.currentPiece,
        position: { ...prev.currentPiece.position, y: dropY },
      };

      const newBoard = mergePieceToBoard(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = prev.score + calculateScore(linesCleared);

      const gameOver = droppedPiece.position.y <= 0;

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: gameOver ? null : prev.nextPiece,
        nextPiece: gameOver ? null : createRandomTetromino(),
        score: newScore,
        gameOver,
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: createRandomTetromino(),
      nextPiece: createRandomTetromino(),
      score: 0,
      gameOver: false,
      isPaused: false,
    });
  }, []);

  // Auto-drop piece
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const intervalId = setInterval(() => {
      moveDown();
    }, GAME_SPEED);

    return () => clearInterval(intervalId);
  }, [gameState.gameOver, gameState.isPaused, moveDown]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          rotate();
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameOver, moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause]);

  return {
    gameState,
    actions: {
      moveLeft,
      moveRight,
      moveDown,
      rotate,
      hardDrop,
      togglePause,
      resetGame,
    },
  };
}
