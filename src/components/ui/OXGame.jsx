"use client";

import React, { useState } from 'react';
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OXGame = () => {
  const [board, setBoard] = useState(Array(9).fill(" "));
  const [currentPlayer, setCurrentPlayer] = useState("○");
  const [winner, setWinner] = useState(null);
  const [playerPositions, setPlayerPositions] = useState({
    "○": [],
    "×": []
  });
  const [gameStarted, setGameStarted] = useState(false);

  const checkWinner = (boardState) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // 横
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // 縦
      [0, 4, 8], [2, 4, 6]              // 斜め
    ];
    
    for (const combo of winningCombinations) {
      if (boardState[combo[0]] !== " " &&
          boardState[combo[0]] === boardState[combo[1]] &&
          boardState[combo[1]] === boardState[combo[2]]) {
        return boardState[combo[0]];
      }
    }
    return null;
  };

  // 次に削除される要素の位置を取得する関数
  const getNextToRemovePosition = (player) => {
    return playerPositions[player].length === 3 ? playerPositions[player][0] : null;
  };

  const handleCellClick = (position) => {
    if (!gameStarted || board[position] !== " " || winner) return;

    const newBoard = [...board];
    const newPlayerPositions = {...playerPositions};

    // 3つ以上配置されている場合、最も古い位置のマークを消す
    if (playerPositions[currentPlayer].length >= 3) {
      const oldestPosition = playerPositions[currentPlayer][0];
      newBoard[oldestPosition] = " ";
      newPlayerPositions[currentPlayer] = playerPositions[currentPlayer].slice(1);
    }

    // 新しい位置を記録し、マークを配置
    newBoard[position] = currentPlayer;
    newPlayerPositions[currentPlayer] = [...newPlayerPositions[currentPlayer], position];

    setBoard(newBoard);
    setPlayerPositions(newPlayerPositions);

    // 勝敗チェック
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setCurrentPlayer(currentPlayer === "○" ? "×" : "○");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(" "));
    setCurrentPlayer("○");
    setWinner(null);
    setPlayerPositions({ "○": [], "×": [] });
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  // 次に削除される位置を取得
  const nextToRemovePosition = getNextToRemovePosition(currentPlayer);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">OXゲーム</CardTitle>
      </CardHeader>
      <CardContent>
        {!gameStarted ? (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>ゲームルール</AlertTitle>
              <ul className="list-disc pl-4 mt-2">
                <li>各プレイヤーは最大3つまでしかマークを置けません</li>
                <li>4つ目を置く際は最も古いマークが消えます</li>
                <li>先に3つ並べたプレイヤーの勝利です</li>
              </ul>
            </Alert>
            <Button 
              className="w-full"
              onClick={startGame}
            >
              ゲームを開始する
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {!winner && (
              <div className="text-center mb-4">
                プレイヤー{currentPlayer}の番です
                {nextToRemovePosition !== null && (
                  <div className="text-sm text-red-500 mt-1">
                    次のマークを置くと、赤枠のマークが消えます
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {board.map((cell, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-16 text-xl ${
                    index === nextToRemovePosition ? 'border-2 border-red-500' : ''
                  }`}
                  onClick={() => handleCellClick(index)}
                  disabled={winner !== null}
                >
                  {cell}
                </Button>
              ))}
            </div>
            {winner && (
              <Alert className="mt-4">
                <AlertTitle>ゲーム終了！</AlertTitle>
                プレイヤー{winner}の勝利です！
              </Alert>
            )}
            <Button 
              className="w-full mt-4"
              onClick={resetGame}
            >
              もう一度プレイする
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OXGame;