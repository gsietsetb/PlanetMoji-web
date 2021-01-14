import _ from 'lodash';
import {colors} from '../gStyles';

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

export const checkAdjacents = (icon, size = 8) => [];

/*
export const getAdjacentsIds = (id, size = 8) => [
  id, // current
  (id % size) - size + 1 !== 0 && id + 1, //right
  id % size !== 0 && id - 1, //left
  id - size, //top
  id + size, //bottom
];
*/

/**Base operations*/
export const withinBoard = (id, size = 8) => id; //id >= 0 && id < size * size && id;

export const up = (id, size = 8) => withinBoard(id - size);
export const down = (id, size = 8) => withinBoard(id + size);
export const left = (id, size = 8) => withinBoard(id - 1);
export const right = (id, size = 8) => withinBoard(id + 1);

const avoidLeft = (id, size = 8) => id % size !== 0;
const avoidRight = (id, size = 8) => (id % size) - size + 1 !== 0;

/**Composed ops*/
export const getAdjacentsIds = (id, size = 8, withSelf = true) => [
  withSelf && id, // current
  up(id, size), //top
  down(id, size), //bottom
  avoidRight(id) && right(id, size), //right
  avoidLeft(id) && left(id, size), //left
];

export const getAdjacentDiagIds = (id, size = 8, withDiag = true, withSelf = true) =>
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

export const chessColor = (id) => (parseInt(id / 8 + id, 10) % 2 === 0 ? colors.sand : colors.groundSand);
