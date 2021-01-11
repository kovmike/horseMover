import React from "react";
import { useStore } from "effector-react";
import { FEILDSIZE, turn, reset, $fullField, $firstTurn } from "./model";
import cl from "./App.module.css";

const App = () => {
  const fullField = useStore($fullField);
  const firstTurn = useStore($firstTurn);

  const draw = (pattern) => {
    return pattern.map((line, indexColumn) => {
      return line.map((item, indexRow) => (
        <div
          style={{ fontSize: `${item === "h" ? 30 : 20}px` }}
          className={`${cl.ceil} ${
            (indexColumn + indexRow) % 2 !== 0 ? cl.ceilBlack : ""
          } ${item === "p" ? cl.ceilGreen : ""}`}
          onClick={() => {
            if (item === "p" || firstTurn) turn([indexColumn, indexRow]);
          }}
        >
          {item > 0 ? item : item === "h" ? "♞" : ""}
        </div>
      ));
    });
  };

  return (
    <div className={cl.app}>
      <h1>Hello Старый</h1>
      <button onClick={reset}>Начать заново</button>
      <div
        className={cl.field}
        style={{ height: `${40 * FEILDSIZE}px`, width: `${40 * FEILDSIZE}px` }}
      >
        {draw(fullField)}
      </div>
    </div>
  );
};

export { App };

//♞
