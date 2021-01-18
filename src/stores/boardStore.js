import _ from 'lodash';
import {makeAutoObservable} from 'mobx';
import {nanoid} from 'nanoid/non-secure';
import {profile} from '../App';
import {isWeb} from '../gStyles';
import {BuildingStore, CellStore, UnitStore} from './cellStore';
import {
  buildingsMap,
  europeAllow,
  flowers,
  fruits,
  harvest,
  mountains,
  terrains,
  tools,
  trees,
  unitsMap,
  water,
} from './sets';
import {
  chessColor,
  getAdjacentDiagIds,
  getAdjacentsIds,
  matchingRecursiveAdjacentIds,
  pickRandom,
  unique,
} from './utils';

export const WORLD_SIZE = isWeb ? 24 : 12;
export const VILLAGE_SIZE = 10;
export const CHESS_SIZE = 8;

export const modalStore = (show = false) =>
  makeAutoObservable({
    show: show,
    id: nanoid(6),
    isMain: false,
    showModal() {
      this.show = true;
    },
    closeModal() {
      this.show = false;
    },
    toggleModal() {
      this.show = !this.show;
    },
  });
export const boardsMap = {
  WORLD: {
    id: 1,
    startingCell: 27,
    img: () => (Math.random() > 0.2 ? terrains['🌲'] : pickRandom(terrains, 1)),
    terrain: () => (Math.random() > 0.2 ? terrains['🌲'] : pickRandom(terrains, 1)),
    icon: (cellId, terrain) =>
      /*terrain === terrains['🌊']
        ? pickRandom(water, 0.2)
        :*/ europeAllow.includes(cellId) || isWeb
        ? pickRandom(mountains, 0.2)
        : pickRandom(water, 0.2),
    /*Math.random() > 0.1
        ?*/
    /*: pickRandom(nature, 0.25)*/
  },
  VILLAGE: {id: 2, icon: (terrain) => pickRandom(trees.concat(flowers, mountains, Object.keys(buildingsMap)), 0.2)},
  BATTLE: {
    id: 3,
    terrain: (cellId) => chessColor(cellId),
    icon: (cellId) => cellId > 16 && cellId < 48 && pickRandom(trees, 0.2),
  },

  /**Harvest*/
  HARVEST: {
    id: 4,
    initMoves: 8,
    bombs: 3,
    shuffle: 1,
    icon: () => pickRandom(harvest, 1),
    collectList: harvest,
  },
  RECRUIT: {id: 5, icon: () => pickRandom(Object.keys(unitsMap), 1), collectList: Object.keys(unitsMap)},
  FRUITS: {id: 6, icon: () => pickRandom(fruits, 1), collectList: fruits, withDiag: true},
  TOOLS: {id: 7, icon: () => pickRandom(tools, 1), collectList: tools, withDiag: true},
};

const initStore = (size, boardMap) => _.range(size * size).map((j) => CellStore({id: j, boardMap}));

export const BoardStore = (boardMap = boardsMap.WORLD, size = CHESS_SIZE, isEmpty = true) =>
  makeAutoObservable({
    size: size, // 8x8
    cells: initStore(size, boardMap),
    shuffle(isStart = false) {
      if (!isStart && this.remShuffles > 0) {
        this.remShuffles--;
      }
      this.cells = initStore(size, boardMap);
    },
    currCellId: boardMap.startingCell || size * size - 1,

    /**Harvest specific*/
    harvestCombo: {length: 1, icon: '🔥'},
    promotedDiag: '🔥', //boardMap.collectList ? pickRandom(boardMap.collectList, 1) : '🔥',
    setComboRecord(length, icon) {
      this.harvestCombo = {length, icon};
    },

    remShuffles: boardMap.shuffle || 1,
    remBombs: boardMap.bombs || 1,
    remMoves: boardMap.initMoves || 3,
    addMoves(mov = -1) {
      this.remMoves += mov;
    },

    /** 💣 ExplodeAll 💥 */
    shouldExplodeAll: false,
    get explodeCandidates() {
      return this.cells.filter(({icon}) => icon === '🔥').map(({id}) => id);
    },
    explodeAll(matchIcon = '🔥') {
      this.shouldExplodeAll = true;
      this.reassignCells({cells: this.explodeCandidates, currIcon: matchIcon});
      this.remBombs--;
      this.shouldExplodeAll = false;
    },

    shouldHighlight(cellIndex) {
      return this.shouldExplodeAll ? this.cells[cellIndex] === this.promotedDiag : this.mathchingRecurisiveAdjacentIds;
    },

    recruit(matchIcon = '🔥') {
      const comboSize = this.mathchingRecurisiveAdjacentIds.length;
      profile.addUnit(matchIcon, comboSize - 2);
      this.reassignCells({newIcons: Object.keys(unitsMap), currIcon: matchIcon});
      this.remMoves--;
    },
    collectCells(matchIcon = '🔥', isResource) {
      const comboSize = this.mathchingRecurisiveAdjacentIds.length;
      /**Updates harvestCombo*/
      if (comboSize > 6) {
        this.addMoves(comboSize - 6);
        if (comboSize >= this.harvestCombo.length) {
          this.setComboRecord(comboSize, matchIcon);
        }
      }
      profile.harvestResource(matchIcon, comboSize, isResource);
      this.reassignCells({currIcon: matchIcon}, !isResource && fruits);
      isResource && this.remMoves--;
    },

    get currCell() {
      return this.cells[this.currCellId];
    },
    get adjacentIds() {
      return getAdjacentsIds(this.currCellId, size);
    },
    get adjacentDiagIds() {
      return getAdjacentDiagIds(this.currCellId, size);
    },
    setCurrent(cellId = 0) {
      this.currCellId = cellId > 0 ? cellId : 0;
    },

    get mathchingRecurisiveAdjacentIds() {
      return unique(
        matchingRecursiveAdjacentIds(
          this.currCellId,
          size,
          this.cells,
          boardsMap.withDiag || this.currCell.icon === '💎',
        ),
      );
    },
    get validMatch() {
      return this.mathchingRecurisiveAdjacentIds.length > 2;
    },
    get isCurrWarrior() {
      return !!unitsMap[this.currCell.icon];
    },
    get isCurrEvil() {
      return this.currCell.isEvil;
    },
    get randomEnemy() {
      return pickRandom(
        this.cells.filter(({isUnit, isEvil}) => isUnit && isEvil),
        1,
      );
    },
    reassignCells({cells = this.mathchingRecurisiveAdjacentIds, newIcons = harvest, currIcon = '🔥'}) {
      cells.map((cur) =>
        this.setCellIcon(
          pickRandom(
            newIcons.filter((icon) => icon !== currIcon),
            1,
          ),
          true,
          cur,
        ),
      );
      // profile.harvestResource(icon, this.mathchingRecurisiveAdjacentIds.length);
    },
    findNextEmpty(id) {
      let pos = id;
      while (!!this.cells[pos].icon && pos >= 0) {
        pos--;
        if (pos < 0) {
          pos = size * size - 1;
        }
      }
      return pos;
    },
    setCell({
      icon,
      id = this.currCellId,
      overwrite = true,
      terrain /*= terrains['🌲']*/,
      unit,
      building,
      isEvil = false,
    }) {
      const pos = overwrite ? id : this.findNextEmpty(id);
      if (icon) {
        this.cells[pos].setIcon(icon);
      }
      if (unit) {
        this.cells[pos].setUnit(UnitStore(unit, pos, isEvil));
      }
      if (building) {
        this.cells[pos].setBuilding(BuildingStore(building, pos, isEvil));
      }
      if (terrain) {
        this.cells[pos].setTerrain(terrain);
      }
    },
    setCellIcon(icon, overwrite = false, id = this.currCellId, isEvil = false, isUnit = false) {
      const pos = overwrite ? id : this.findNextEmpty(id);
      /*if (overwrite) {
        this.cells[pos].setIcon(icon);
      } else if (this.cells[pos]) {
          pos = this.findNextEmpty(id)*/
      /*while (!overwrite && !!this.cells[pos].icon && pos >= 0) {
          pos--;
          if (pos < 0) {
            pos = size * size - 1;
          }
        }*/
      this.cells[pos].setIcon(icon);
      overwrite && this.setCurrent(pos - 1);

      this.cells[pos].setUnit(isUnit);
      if (isUnit) {
        this.cells[pos].setEvil(isEvil);
      }
    },
    randomMove() {
      //id = this.randomEnemy, isEvil = true) {
      const enemies = this.cells.filter(({icon, isUnit, isEvil, isCurrEvil}) => {
        console.log('icon: ', icon, isUnit, isEvil, isCurrEvil);
        return isUnit && isCurrEvil;
      });
      console.log('trying to move1 ', enemies);

      const cellId = 13; //pickRandom(enemies, 1);
      console.log('trying to move', cellId);
      const availMoves = getAdjacentDiagIds(cellId, size, true, false);
      console.log('got this', cellId, this.cells[cellId]?.icon, availMoves);
      const emptySpots = availMoves.filter((currId) => {
        /*console.log('te', currId, this.cells[currId]?.icon);*/
        return !!currId && currId >= 0 && currId < 64 && currId !== cellId && !this.cells[currId]?.icon; //&& _.isEmpty(this.cells[item].icon);
      });
      console.log('got empty: ', emptySpots);
      if (!_.isEmpty(emptySpots)) {
        this.moveToCell(pickRandom(emptySpots, 1), this.cells[cellId], true, true);
        return true;
      } else {
        return false;
      }
    },
    moveToCell(dest, origin = this.currCell, isEvil) {
      console.log('trying to move to ', dest, ' with ', origin);
      /**move to new location*/
      this.setCellIcon(origin.icon, true, dest, isEvil, true);
      /**Remove previous*/
      this.setCellIcon('', true, origin.id, isEvil, false);
    },
    /*resetCollectedResource(resource = 0, id = this.currCellId) {
      this.currCell.setResources(resource);
    },*/
  });

//export const board = new BoardStore();
