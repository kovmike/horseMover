import { createStore, createEvent, combine, sample, forward } from "effector";

const FEILDSIZE = 8;

const FIELD = new Array(FEILDSIZE)
  .fill(" ")
  .map((_, indexLine) => new Array(FEILDSIZE).fill(0));

const turn = createEvent();
const firstTurn = createEvent();
const reset = createEvent();

const $emptyField = createStore(FIELD);
const $possibleMoves = createStore([]).reset(reset);

const $horseHistory = createStore([])
  .on(turn, (history, nextTurn) => [...history, nextTurn])
  .reset(reset);
const $firstTurn = createStore(true)
  .on(firstTurn, (_, p) => false)
  .reset(reset);

forward({
  from: turn,
  to: firstTurn
});

sample({
  source: turn,
  fn: (turn) => {
    let possibleMoves = [];
    if (turn[0] + 2 < FEILDSIZE && turn[1] + 1 < FEILDSIZE)
      possibleMoves.push([turn[0] + 2, turn[1] + 1]);
    if (turn[0] + 2 < FEILDSIZE && turn[1] - 1 >= 0)
      possibleMoves.push([turn[0] + 2, turn[1] - 1]);
    if (turn[0] - 2 >= 0 && turn[1] + 1 < FEILDSIZE)
      possibleMoves.push([turn[0] - 2, turn[1] + 1]);
    if (turn[0] - 2 >= 0 && turn[1] - 1 >= 0)
      possibleMoves.push([turn[0] - 2, turn[1] - 1]);
    if (turn[0] + 1 < FEILDSIZE && turn[1] + 2 < FEILDSIZE)
      possibleMoves.push([turn[0] + 1, turn[1] + 2]);
    if (turn[0] + 1 < FEILDSIZE && turn[1] - 2 >= 0)
      possibleMoves.push([turn[0] + 1, turn[1] - 2]);
    if (turn[0] - 1 >= 0 && turn[1] + 2 < FEILDSIZE)
      possibleMoves.push([turn[0] - 1, turn[1] + 2]);
    if (turn[0] - 1 >= 0 && turn[1] - 2 >= 0)
      possibleMoves.push([turn[0] - 1, turn[1] - 2]);
    return possibleMoves;
  },
  target: $possibleMoves
});

const $fullField = combine(
  $emptyField,
  $horseHistory,
  $possibleMoves,
  (emptyField, horseHistory, possibleMoves) => {
    const fullField = emptyField.map((line) => [...line]);

    horseHistory.forEach((turn, index) => {
      if (index === horseHistory.length - 1) {
        fullField[turn[0]][turn[1]] = "h";
      } else {
        fullField[turn[0]][turn[1]] = index + 1;
      }
    });

    possibleMoves.forEach((move) => {
      if (fullField[move[0]][move[1]] < 1) fullField[move[0]][move[1]] = "p";
    });
    return fullField;
  }
);

export { FEILDSIZE, turn, reset, $fullField, $firstTurn };
