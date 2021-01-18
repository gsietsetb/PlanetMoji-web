import _ from 'lodash';
import emojiList from '../assets/fullEmoji.json';
import {colors} from '../gStyles';
import {CHESS_SIZE} from './boardStore';

export const objAdd = (obj, icon, quant = 1) => (obj.hasOwnProperty(icon) ? (obj[icon] += quant) : (obj[icon] = quant));
export const pickRandom = (list = [], uncertainty = 0.4) =>
  list[Math.floor((Math.random() * list.length) / uncertainty)];

export const numFormat = (num, digits = 1) => {
  const si = [
    {value: 1, symbol: ''},
    {value: 1e3, symbol: 'k'},
    {value: 1e6, symbol: 'M'},
    {value: 1e9, symbol: 'G'},
    {value: 1e12, symbol: 'T'},
    {value: 1e15, symbol: 'P'},
    {value: 1e18, symbol: 'E'},
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i = si.length - 1;
  for (i; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

export const checkAdjacents = (icon, size = CHESS_SIZE) => [];

/*
export const getAdjacentsIds = (id, size = CHESS_SIZE) => [
  id, // current
  (id % size) - size + 1 !== 0 && id + 1, //right
  id % size !== 0 && id - 1, //left
  id - size, //top
  id + size, //bottom
];
*/

/**Base operations*/
export const withinBoard = (id, extraCond = true, size = CHESS_SIZE) => id >= 0 && id < size * size && id && extraCond;

export const up = (id, size = CHESS_SIZE) => withinBoard(id - size);
export const down = (id, size = CHESS_SIZE) => withinBoard(id + size);
export const left = (id, size = CHESS_SIZE) => withinBoard(id - 1);
export const right = (id, size = CHESS_SIZE) => withinBoard(id + 1);

const avoidLeft = (id, size = CHESS_SIZE) => id % size !== 0;
const avoidRight = (id, size = CHESS_SIZE) => (id % size) - size + 1 !== 0;

const addIfWithin = (res, id) => {
  withinBoard(id) && res.push(id);
  return res;
};

export const getAdjacentsIds = (id, size = CHESS_SIZE, withSelf = true) => [
  withSelf && id, // current
  up(id, size), //top
  down(id, size), //bottom
  avoidRight(id) && right(id, size), //right
  avoidLeft(id) && left(id, size), //left
];
/**Composed ops*/
export const getAdjacentsIds2 = (id, size = CHESS_SIZE, withSelf = true) => {
  /*let res = [];
  addIfWithin(res, up(id, size));
  addIfWithin(res, down(id, size));
  addIfWithin(res, avoidRight(right(id, size)), right(id, size));
  addIfWithin(res, avoidLeft(left(id, size)), left(id, size));
  addIfWithin(res,avoidRight(id) && left(id, size) )
  res.push(withinBoard()*/
  return [
    withSelf && id, // current
    up(id, size), //top
    down(id, size), //bottom
    avoidRight(id) && right(id, size), //right
    avoidLeft(id) && left(id, size), //left
  ];
  /* return res;*/
};

export const getAdjacentDiagIds = (id, size = CHESS_SIZE, withDiag = true, withSelf = true) =>
  !withDiag
    ? getAdjacentsIds(id, size, withSelf)
    : [
        ...getAdjacentsIds(id, size),
        avoidRight(id) && down(right(id)) /*id - size - 1,*/, //bottom right
        avoidRight(id) && up(right(id)) /*id % size !== 0 &&*/ /*id + size - 1,*/, //top left
        avoidLeft(id) && left(down(id)) /*id % size !== 0 &&*/ /*id - size + 1,*/, //bottom left
        avoidLeft(id) && left(up(id)), //id + size + 1, //top right
      ];

/** Board as a set of cells*/
export const matchingAdjacentIds = (id, size, board, withDiag) => {
  return getAdjacentDiagIds(id, size, withDiag).filter((adjId) => board[adjId]?.icon === board[id]?.icon);
}; // Conjunto grande        =>   Subconjunto

export const matchingRecursiveAdjacentIds = (id, size, board, withDiag = false, acum = [id]) =>
  acum.concat(
    _.difference(matchingAdjacentIds(id, size, board, withDiag), acum).flatMap((adjId) =>
      matchingRecursiveAdjacentIds(adjId, size, board, withDiag, acum.concat(adjId)),
    ),
  );

export const efficientMatch = (id, size, board, acum = matchingAdjacentIds(id, size, board)) =>
  acum.flatMap(
    (adjId) => !acum.includes(adjId) && matchingRecursiveAdjacentIds(adjId, size, board, acum.concat(adjId)),
  );
// Conjunto grande        =>   Subconjunto

export const factorial = (x, acum = 1) => (x ? factorial(x - 1, x * acum) : acum);

export const unique = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);

/*if (!isPressable) {   return id % 6 === 0 ? '🪨' : '';
                                                                                                                          } else if (id === (MATRIX_SIDES * MATRIX_SIDES) / 2 + 5) {
                                                                                                                            return '🏰';
                                                                                                                          } else if (id === 34) {
                                                                                                                            return '⚱️';
                                                                                                                          } else if (id === 47) {
                                                                                                                            return '💎';
                                                                                                                          } else if (id === MATRIX_SIDES / 2) {
                                                                                                                            return '🏰';
                                                                                                                          } else if (id % 3 === 0) {
                                                                                                                            return pickRandom(trees);
                                                                                                                          } else if (id % 7 === 0) {
                                                                                                                            return pickRandom(cultivos);
                                                                                                                          } else {
                                                                                                                            return '';
                                                                                                                          }*/

export const chessColor = (id) => (parseInt(id / CHESS_SIZE + id, 10) % 2 === 0 ? colors.sand : colors.groundSand);

export const emojiMatch = (text, cat: categories = 'Animals & Nature') =>
  Object.values(emojiList[cat]).filter(({keywords}) => keywords.includes(text));

export const allIcons = () => {
  let res = [];
  Object.keys(emojiList).map((key) => {
    res.push(...Object.values(emojiList[key]));
    /*console.log('reh', accum, key);
                                                                                                                                                                                                                                                                                                return accum.concat(emojiList[key]);*/
  });
  return res;
};

export const emojiFullMatch = (text) => allIcons().filter(({keywords}) => keywords.includes(text));

export const categories = Object.keys(emojiList);
