import { useEffect, useState } from "react";
import { Cell } from "../Cell/Cell";

const BOARD_SIZE = 10;
const DEFAULT_CELLS_VALUE = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(0));
const SPEED = 500;
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
  const [snake, setSnake] = useState([[1, 1]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState(ARROWS[0]);

  const handleKeyDown = (e) => {
    const index = ARROWS.indexOf(e.key);
    if (index > -1) {
      setDirection(ARROWS[index]);
    }
  };

  useEffect(() => document.addEventListener("keydown", handleKeyDown));

  useEffect(() => {
    const interval = gameLoop();
    return () => clearInterval(interval);
  }, [snake]);

  const generateFood = () => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
    } while (
      snake.some((item) => item[0] === newFood[0] && item[1] === newFood[1])
    );
    setFood(newFood);
  };

  const gameLoop = () => {
    const timer = setTimeout(() => {
      const newSnake = snake;
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
      }

      const head = [
        borders(newSnake[newSnake.length - 1][0] + move[0]),
        borders(newSnake[newSnake.length - 1][1] + move[1]),
      ];

      newSnake.push(head);
      let spliceIndex = 1;
      if (head[0] === food[0] && head[1] === food[1]) {
        spliceIndex = 0;
        generateFood();
      }
      setSnake(newSnake.slice(spliceIndex));
    }, SPEED);
    return timer;
  };
  return (
    <div>
      <h1>Result: {snake.length}</h1>
      {DEFAULT_CELLS_VALUE.map((row, indexR) => (
        <div className="row">
          {row.map((cell, indexC) => {
            let type =
              snake.some((item) => item[0] === indexR && item[1] === indexC) &&
              "snake";
            if (type !== "snake") {
              type = food[0] === indexR && food[1] === indexC && "food";
            }

            return <Cell key={indexC} type={type} />;
          })}
        </div>
      ))}
    </div>
  );
};
