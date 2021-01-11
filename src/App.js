import React from "react";
import { useStore } from "effector-react";
import {
  turn,
  reset,
  $fullField,
  $firstTurn,
  enterFieldSize,
  $fieldSize,
  $incorrect,
  $crazyPlayer,
  $youWin,
  $youLose
} from "./model";
import cl from "./App.module.css";

const App = () => {
  const fullField = useStore($fullField);
  const firstTurn = useStore($firstTurn);
  const fieldSize = useStore($fieldSize);
  const incorrect = useStore($incorrect);
  const crazyPlayer = useStore($crazyPlayer);
  const winFlag = useStore($youWin);
  const loseFlag = useStore($youLose);

  const typeSize = (e) => {
    enterFieldSize(e.target.value);
  };

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
      <h1>Лошадью ходи</h1>
      <h5>Заполни шахматное поле, совершая ходы конем</h5>
      {winFlag && !incorrect && <h1>Ты выиграл</h1>}
      {loseFlag && !firstTurn && <h1>Ты проиграл</h1>}
      {winFlag && loseFlag && !firstTurn && <h1>ЧИТОР</h1>}
      <input
        placeholder={"Введите размерность поля"}
        onChange={(e) => typeSize(e)}
      />
      <br />
      <span>
        {incorrect ? "неправильный ввод" : crazyPlayer ? "crazy" : ""}
      </span>
      <br />
      <button onClick={reset}>Начать заново</button>
      <div
        className={cl.field}
        style={{ height: `${40 * fieldSize}px`, width: `${40 * fieldSize}px` }}
      >
        {draw(fullField)}
      </div>
    </div>
  );
};

export { App };

//♞
