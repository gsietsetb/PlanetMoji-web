import {colors, imgs, isWeb, setIcon} from '../gStyles';

export const resources = ['💎', setIcon('🪵'), '🥩', setIcon('🪨')];
export const harvest = ['🔥', ...resources];
export const trees = ['🌴', '🌳', '🌵', '🌲'];
export const nature = ['🌊', '🌪'];
export const water = ['🌊', '🛶'];
export const flowers = ['🌾', '🌻', '🌱', '🌿'];
export const mountains = ['🏔', '🌋', '🗻', '⛰', '🏜']; // ⛏
export const farm = ['🐓', '🐄', '🐖', '🐇']; // ⛏
export const workshops = ['🏕', '🪓', '🌾'];
export const cultivos = ['🏕', '🌱', '🌾'];
export const warriors = ['🥷🏻', '🧎🏻‍️', '🧙', '🏹', '🗼', '👸', '🤴'];
export const levels = ['👼', '👩‍🌾', '👩‍🚒', '🧝', '🥷🏻', '🧙', '👸', '🤴', '🧖🏻‍', '🧑‍🚀'];
export const tools = ['🔧', '🔨', '⚒', '🛠', '⛏', '🛡', '⚔', '️🗡', '🔪', '🪓'];
export const warriors2 = ['🏰', '🏇', '🤺', '👸', '🤴', '🥷🏻'];
export const warriors3 = ['🧜🏻‍️', '🧞', '️🦹🏼‍', '️👩🏼‍🚒', '👷‍', '️🧕', '🥷🏻'];
export const fruits = ['🍊', '🫐', '🌽', '🥦', '🍓️', '🍑', '🍏'];
export const animals = ['🐄', '🐎', '🐘', '🐓'];
export const skills = ['🛡', '⚔️', '️🪓', '⛏', '❤️', '🤼‍'];

export const terrains = {
  '🌊': {bg: colors.water, icons: water, img: imgs.water},
  '🪨': {bg: colors.ground, icons: nature.concat(trees), img: imgs.ground},
  '🌲': {
    bg: colors.grass,
    icons: trees,
    img: isWeb
      ? {uri: 'https://www.the3rdsequence.com/texturedb/download/1/texture/jpg/256/green+grass-256x256.jpg'}
      : imgs.grass,
  },
  '🏝': {bg: colors.sand, icons: water, img: isWeb ? imgs.grassText : imgs.ground},
};

export const europeAllow = isWeb
  ? [4, 2, 5, 3]
  : [
      25,
      26,
      34,
      39,
      40,
      41,
      42,
      47,
      48,
      50,
      51,
      53,
      54,
      55,
      58,
      59,
      61,
      62,
      63,
      67,
      68,
      69,
      70,
      71,
      74,
      75,
      76,
      77,
      78,
      79,
      83,
      84,
      85,
      86,
      87,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      102,
      104,
      105,
      106,
      107,
      110,
      112,
      113,
      114,
      121,
    ];
// : [48, 40, 43, 50, 51, 58, 59, 96, 97, 98, 99, 100, 104, 105, 106, 107, 112, 113, 114 /*...getAdjacentDiagIds(85)*/];

export const resMapping = {
  '️🪓': ['🌲', '🌴', '🌳', '🌵'],
  '⛏': ['🏔', '🌋', '🗻'],
  '🧺': ['🌾'],
};

export const natureToResource = (icon) => {
  if (mountains.includes(icon)) {
    return '⛏';
  } else if (trees.includes(icon)) {
    return '️🪓';
  } else if (flowers.includes(icon)) {
    return '🧺';
  }
};

/**Cost: ['💎', '🪵', '🥩', '🪨'];*/
export const unitsMap = {
  '🧕': {
    level: 1,
    cost: {'💎': 0, '🪵': 0, '️🥩': 3, '🪨': 0},
    score: 5,
    skills: {'❤️': 10, '🛡': 0, '⚔️': 1, '⚡️‍': 1},
    collect: {'️🪓': 3, '⛏': 3},
  },
  '👩‍🌾': {
    level: 1,
    cost: {'💎': 0, '🪵': 0, '️🥩': 10, '🪨': 0},
    score: 30,
    skills: {'❤️': 20, '🛡': 1, '⚔️': 2, '⚡️‍': 1},
    collect: {'️🪓': 5, '⛏': 5, '🪚': 2, '🧺': 2},
  },
  '‍🧝🏽‍': {
    level: 2,
    cost: {'💎': 0, '🪵': 10, '️🥩': 10, '🪨': 0},
    score: 60,
    skills: {'❤️': 30, '🛡': 2, '⚔️': 2, '⚡️‍': 1, '🏹': 10},
  },
  '🧟': {
    level: 2,
    cost: {'💎': 5, '🪵': 10, '️🥩': 50, '🪨': 0},
    score: 100,
    skills: {'❤️': 10, '🛡': 2, '⚔️': 2, '⚡️‍': 3, '🏹': 1},
  },
  '🧙‍️': {
    level: 3,
    cost: {'💎': 20, '🪵': 10, '️🥩': 30, '🪨': 0},
    score: 10,
    skills: {'❤️': 50, '🛡': 2, '⚔️': 2, '⚡️‍': 3, '🏹': 1},
  },
  '🤺': {
    level: 3,
    cost: {'💎': 0, '🪵': 0, '️🥩': 3, '🪨': 0},
    score: 10,
    skills: {'❤️': 50, '🛡': 2, '⚔️': 5, '⚡️‍': 1},
  },
  '🐴': {
    level: 3,
    cost: {'💎': 0, '🪵': 0, '️🥩': 3, '🪨': 0},
    score: 10,
    skills: {'❤️': 20, '🛡': 3, '⚔️': 1, '🏹': 1, '⚡️‍': 3},
  },
  '🥷🏻': {
    level: 4,
    cost: {'💎': 80, '🪵': 0, '️🥩': 20, '🪨': 0},
    score: 250,
    skills: {'❤️': 20, '🛡': 5, '⚔️': 5, '🏹': 1, '⚡️‍': 3},
  },
  '🦹‍': {
    level: 4,
    cost: {'💎': 30, '🪵': 10, '️🥩': 10, '🪨': 0},
    score: 30,
    skills: {'❤️': 50, '🛡': 5, '⚔️': 5, '🏹': 1, '⚡️‍': 3},
  },
  '🧞‍': {
    level: 5,
    cost: {'💎': 99, '🪵': 0, '️🥩': 50, '🪨': 0},
    score: 200,
    skills: {'❤️': 80, '🛡': 10, '⚔️': 10, '⚡️‍': 3},
  },
  '🏰': {
    level: 5,
    cost: {'💎': 80, '🪵': 0, '️🥩': 20, '🪨': 0},
    score: 500,
    skills: {'❤️': 50, '🛡': 20, '🏹': 10, '⚡️‍': 0},
  },
  '🐘': {
    level: 6,
    cost: {'💎': 10, '🪵': 10, '️🥩': 150, '🪨': 0},
    score: 10,
    skills: {'❤️': 150, '🛡': 30, '⚔️': 10, '🏹': 5, '⚡️‍': 2},
  },
  '🤴': {
    level: 7,
    cost: {'💎': 10, '🪵': 10, '️🥩': 150, '🪨': 0},
    score: 500,
    skills: {'❤️': 100, '🛡': 30, '⚔️': 10, '🏹': 3, '⚡️‍': 1},
  },
};
/**Cost: ['💎', '🪵', '🥩', '🪨'];*/
export const buildings = ['🗿', imgs.barrack, imgs.farm, imgs.yard, '⛺️', '🛖', '🏛', '🏰'];
export const buildingsMap = {
  /*'🗿': {
    level: 1,
    cost: {'💎': 0, '🪵': 0, '️🥩': 0, '🪨': 100},
    score: 4,
    skills: {'❤️': 10, '👨‍👩‍👧‍👦': 1},
  },*/
  '⛺️': {
    level: 1,
    cost: {'💎': 0, '🪵': 10, '️🥩': 10, '🪨': 0},
    score: 10,
    skills: {'❤️': 10, '👨‍👩‍👧‍👦': 3},
  },
  /* '🌾': {
    level: 1,
    cost: {'💎': 0, '🪵': 20, '️🥩': 10, '🪨': 0},
    score: 15,
    skills: {'❤️': 10, '🧺': 5},
  },*/
  '🛖': {
    level: 2,
    cost: {'💎': 0, '🪵': 50, '️🥩': 10, '🪨': 5},
    score: 30,
    skills: {'❤️': 20, '👨‍👩‍👧‍👦': 5},
  },
  '🏚': {
    level: 3,
    cost: {'💎': 0, '🪵': 100, '️🥩': 10, '🪨': 5},
    score: 30,
    skills: {'❤️': 20, '👨‍👩‍👧‍👦': 8},
  },
  '🗼': {
    level: 3,
    cost: {'💎': 0, '🪵': 100, '️🥩': 0, '🪨': 20},
    skills: {'❤️': 100, '👨‍👩‍👧‍👦': 1, '🏹': 15},
    score: 50,
  },
  '🕌': {
    level: 4,
    cost: {'💎': 0, '🪵': 100, '️🥩': 0, '🪨': 200},
    skills: {'❤️': 100, '👨‍👩‍👧‍👦': 3},
    score: 50,
  },
  '🏛': {
    level: 4,
    cost: {'💎': 0, '🪵': 10, '️🥩': 0, '🪨': 100},
    score: 75,
    skills: {'❤️': 100, '👨‍👩‍👧‍👦': 20},
  },
  '🏰': {
    level: 5,
    cost: {'💎': 100, '🪵': 20, '️🥩': 0, '🪨': 200},
    skills: {'❤️': 150, '👨‍👩‍👧‍👦': 25},
    score: 250,
  },
};
