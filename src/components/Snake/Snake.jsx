import { useEffect, useState } from "react";
import { Cell } from "../Cell/Cell";

const BOARD_SIZE = 10;
const DEFAULT_CELLS_VALUE = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(0));

export const Snake = () => {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([0, 0]);

  useEffect(() => {});
  return (
    <div>
      {DEFAULT_CELLS_VALUE.map((row, indexR) => (
        <div className="row">
          {row.map((cell, indexC) => {
            let type = food[0] === indexR && food[1] === indexC && "food";
            return <Cell key={indexC} type={type} />;
          })}
        </div>
      ))}
    </div>
  );
};
