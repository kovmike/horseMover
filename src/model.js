import {
  createStore,
  createEvent,
  combine,
  sample,
  forward,
  guard
} from "effector";

const fieldGen = (s) =>
  new Array(s).fill(" ").map((_, indexLine) => new Array(s).fill(0));

const turn = createEvent();
const firstTurn = createEvent();
const setPossibleMoves = createEvent();
const enterCorrectSize = createEvent();
const enterFieldSize = createEvent();
const reset = createEvent();
const incorrectInput = createEvent();
const crazyInput = createEvent();
const genEmptyField = createEvent();
const win = createEvent();
const lose = createEvent();

const $fieldSize = createStore(0).on(enterCorrectSize, (_, size) => size);
const $emptyField = createStore([]).on(genEmptyField, (_, payload) => payload);
const $possibleMoves = createStore([])
  .on(setPossibleMoves, (_, moves) => moves)
  .reset([reset, $fieldSize]);

const $horseHistory = createStore([])
  .on(turn, (history, nextTurn) => [...history, nextTurn])
  .reset([reset, $fieldSize]);
const $firstTurn = createStore(true)
  .on(firstTurn, (_, p) => false)
  .reset([reset, $fieldSize]);
const $incorrect = createStore(false)
  .on(incorrectInput, () => true)
  .reset(enterCorrectSize);
const $crazyPlayer = createStore(false).on(crazyInput, (_, ci) => ci);
const $youWin = createStore(false).on(win, (_, p) => p);
const $youLose = createStore(false).on(lose, (_, p) => p);

//валидация ввода размерности поля
guard({
  source: enterFieldSize,
  filter: (size) => {
    return /[0-9]/g.test(+size) && size < 36;
  },
  target: enterCorrectSize
});

guard({
  source: enterFieldSize,
  filter: (size) => {
    return !/[0-9]/g.test(+size);
  },
  target: incorrectInput
});

sample({
  source: enterFieldSize,
  fn: (size) => +size > 36,
  target: crazyInput
});

//генерация пустого поля
sample({
  source: $fieldSize,
  fn: (size) => {
    return fieldGen(+size);
  },
  target: genEmptyField
});

//сброс флага первого хода
forward({
  from: turn,
  to: firstTurn
});

//стек возможных ходов
sample({
  source: $fieldSize,
  clock: turn,
  fn: (FIELDSIZE, turn) => {
    let possibleMoves = [];
    if (turn[0] + 2 < FIELDSIZE && turn[1] + 1 < FIELDSIZE)
      possibleMoves.push([turn[0] + 2, turn[1] + 1]);
    if (turn[0] + 2 < FIELDSIZE && turn[1] - 1 >= 0)
      possibleMoves.push([turn[0] + 2, turn[1] - 1]);
    if (turn[0] - 2 >= 0 && turn[1] + 1 < FIELDSIZE)
      possibleMoves.push([turn[0] - 2, turn[1] + 1]);
    if (turn[0] - 2 >= 0 && turn[1] - 1 >= 0)
      possibleMoves.push([turn[0] - 2, turn[1] - 1]);
    if (turn[0] + 1 < FIELDSIZE && turn[1] + 2 < FIELDSIZE)
      possibleMoves.push([turn[0] + 1, turn[1] + 2]);
    if (turn[0] + 1 < FIELDSIZE && turn[1] - 2 >= 0)
      possibleMoves.push([turn[0] + 1, turn[1] - 2]);
    if (turn[0] - 1 >= 0 && turn[1] + 2 < FIELDSIZE)
      possibleMoves.push([turn[0] - 1, turn[1] + 2]);
    if (turn[0] - 1 >= 0 && turn[1] - 2 >= 0)
      possibleMoves.push([turn[0] - 1, turn[1] - 2]);

    return possibleMoves;
  },
  target: setPossibleMoves
});

//заполнение поля
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
//проигрыш
sample({
  source: $possibleMoves,
  clock: $fullField,
  fn: (possibleMoves, field) =>
    possibleMoves.every((move) => field[move[0]][move[1]]) &&
    !field.every((line) => line.every((item) => item !== 0)),
  target: lose
});

//победа
sample({
  source: $fullField,
  fn: (field) => field.every((line) => line.every((item) => item !== 0)),
  target: win
});
export {
  $fieldSize,
  turn,
  reset,
  $fullField,
  $firstTurn,
  enterFieldSize,
  $crazyPlayer,
  $incorrect,
  $youWin,
  $youLose
};
