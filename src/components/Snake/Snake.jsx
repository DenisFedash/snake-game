import { useEffect, useState } from "react";
import { useInterval } from "../../hooks/useInterval";
import { Cell } from "../Cell/Cell";

const BOARD_SIZE = 10;
const DEFAULT_CELLS_VALUE = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(0));
const SPEED = 300;
const SNAKE_START = [[1, 1]];
const FOOD_START = [5, 5];
const ARROWS = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];

const borders = (position) => {
  switch (true) {
    case position >= BOARD_SIZE:
      return 0;

    case position < 0:
      return BOARD_SIZE - 1;

    default:
      return position;
  }
};

export const Snake = () => {
  const [snake, setSnake] = useState(SNAKE_START);
  const [food, setFood] = useState(FOOD_START);
  const [foodCell, setFoodCell] = useState([8, 8]);
  const [goldenfoodCell, setgoldenFoodCell] = useState([2, 2]);
  const [direction, setDirection] = useState(ARROWS[0]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => gameLoop(), speed);

  useEffect(() => document.addEventListener("keydown", handleKeyDown));

  const handleKeyDown = (e) => {
    const index = ARROWS.indexOf(e.key);
    if (index > -1) {
      setDirection(ARROWS[index]);
    }
  };

  const generateFood = () => {
    let newFood;
    let foodCell;
    let goldenFood;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
      foodCell = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
      goldenFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
    } while (
      snake.some(
        (item) =>
          (item[0] === newFood[0] && item[1] === newFood[1]) ||
          (foodCell[0] && item[1] === foodCell[1]) ||
          (goldenFood[0] && item[1] === goldenFood[1])
      )
    );
    setFood(newFood);
    setFoodCell(foodCell);
    setgoldenFoodCell(goldenFood);

    newFood = [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE),
    ];
  };

  const gameLoop = () => {
    const newSnake = [...snake];
    let move = [];

    switch (direction) {
      case ARROWS[0]:
        move = [1, 0];
        break;
      case ARROWS[1]:
        move = [-1, 0];
        break;
      case ARROWS[2]:
        move = [0, 1];
        break;
      case ARROWS[3]:
        move = [0, -1];
        break;
      default:
        return direction;
    }

    const head = [
      borders(newSnake[newSnake.length - 1][0] + move[0]),
      borders(newSnake[newSnake.length - 1][1] + move[1]),
    ];

    newSnake.push(head);
    setScore(snake.length + 1);

    let spliceIndex = 1;
    if (
      (head[0] === food[0] && head[1] === food[1]) ||
      (head[0] === foodCell[0] && head[1] === foodCell[1]) ||
      (head[0] === goldenfoodCell[0] && head[1] === goldenfoodCell[1])
    ) {
      spliceIndex = 0;
      generateFood();
    }

    if (checkCollision(head)) {
      setSpeed(null);
      setGameOver(true);
      handleSetScore();
    }

    if (snake.length === 6) {
      setSpeed(100);
    }

    setSnake(newSnake.slice(spliceIndex));
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setFood(FOOD_START);
    setDirection(ARROWS[0]);
    setSpeed(SPEED);
    setGameOver(false);
    setFoodCell([8, 8]);
    setgoldenFoodCell([2, 2]);
  };

  const onPause = () => {
    setSpeed(null);
  };
  const onPlay = () => {
    setSpeed(SPEED);
  };

  const checkCollision = (head) => {
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }
    return false;
  };

  const handleSetScore = () => {
    if (score > Number(localStorage.getItem("snakeScore"))) {
      localStorage.setItem("snakeScore", JSON.stringify(score));
    }
  };

  return (
    <div>
      <h2>Result: {snake.length - 1}</h2>
      <h2>High Score: {localStorage.getItem("snakeScore")}</h2>
      {DEFAULT_CELLS_VALUE.map((row, indexR) => (
        <div className="row" key={indexR}>
          {row.map((cell, indexC) => {
            let type =
              snake.some((item) => item[0] === indexR && item[1] === indexC) &&
              "snake";
            if (type !== "snake") {
              type =
                (food[0] === indexR && food[1] === indexC && "food") ||
                (foodCell[0] === indexR &&
                  foodCell[1] === indexC &&
                  "foodCell") ||
                (goldenfoodCell[0] === indexR &&
                  goldenfoodCell[1] === indexC &&
                  "goldenfoodCell");
            }

            return <Cell key={indexC} type={type} />;
          })}
        </div>
      ))}
      {gameOver && <div>Game Over!</div>}
      <button onClick={startGame}>Start Game</button>

      <button
        onClick={() => {
          {
            speed ? onPause() : onPlay();
          }
        }}
        disabled={gameOver}
      >
        {speed ? "Pause" : "Play"}
      </button>
    </div>
  );
};
