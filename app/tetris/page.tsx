'use client';

import { useTetris } from '@/app/hooks/useTetris';
import type { Tetromino } from '@/app/types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/app/constants/tetris';

function TetrisCell({ color }: { color: string | null }) {
  return (
    <div
      className="w-6 h-6 border border-gray-700"
      style={{
        backgroundColor: color || '#1a1a2e',
      }}
    />
  );
}

function TetrisBoard({
  board,
  currentPiece,
}: {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
}) {
  // Create a display board that includes the current piece
  const displayBoard = board.map(row => [...row]);

  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;

          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
  }

  return (
    <div
      className="inline-grid gap-0 border-2 border-gray-600 bg-gray-900 p-1"
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
      }}
    >
      {displayBoard.map((row, y) =>
        row.map((cell, x) => <TetrisCell key={`${y}-${x}`} color={cell} />)
      )}
    </div>
  );
}

function NextPiecePreview({ piece }: { piece: Tetromino | null }) {
  if (!piece) return null;

  const size = piece.shape.length;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-sm font-semibold mb-2">Next</h3>
      <div
        className="inline-grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {piece.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="w-5 h-5 border border-gray-700"
              style={{
                backgroundColor: cell ? piece.color : '#1a1a2e',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function TetrisPage() {
  const { gameState, actions } = useTetris();

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Tetris</h1>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <TetrisBoard board={gameState.board} currentPiece={gameState.currentPiece} />

            {/* Controls Info */}
            <div className="mt-6 bg-gray-800 rounded-lg p-4 text-white text-sm max-w-md">
              <h3 className="font-semibold mb-2">Controls</h3>
              <ul className="space-y-1 text-gray-300">
                <li>← → : Move left/right</li>
                <li>↓ : Soft drop</li>
                <li>↑ : Rotate</li>
                <li>Space : Hard drop</li>
                <li>P : Pause/Resume</li>
              </ul>
            </div>
          </div>

          {/* Side Panel */}
          <div className="flex flex-col gap-4">
            {/* Score */}
            <div className="bg-gray-800 rounded-lg p-4 min-w-[160px]">
              <h3 className="text-white text-sm font-semibold mb-2">Score</h3>
              <p className="text-3xl font-bold text-blue-400">{gameState.score}</p>
            </div>

            {/* Next Piece */}
            <NextPiecePreview piece={gameState.nextPiece} />

            {/* Status */}
            {gameState.isPaused && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <p className="text-yellow-200 font-semibold text-center">PAUSED</p>
              </div>
            )}

            {gameState.gameOver && (
              <div className="bg-red-900 border border-red-600 rounded-lg p-4">
                <p className="text-red-200 font-semibold text-center mb-2">GAME OVER</p>
                <button
                  onClick={actions.resetGame}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Reset Button (when not game over) */}
            {!gameState.gameOver && (
              <button
                onClick={actions.resetGame}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Reset Game
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
