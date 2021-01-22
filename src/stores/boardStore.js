import _ from 'lodash';
import {makeAutoObservable} from 'mobx';
import {nanoid} from 'nanoid/non-secure';
import {profile} from '../App';
import {BASE_PIXEL, deviceHeight, deviceWidth, isBig, isWeb} from '../gStyles';
import {BuildingStore, CellStore, UnitStore} from './cellStore';
import {europeAllow, farm, flowers, fruits, harvest, mountains, tools, trees, unitsMap} from './sets';
import {chessColor, getAdjacentDiagIds, getAdjacentsIds, matchRecursiveAdjCells, pickRandom, unique} from './utils';

export const xCells = (cellSize = 13) => Math.ceil(deviceWidth / (cellSize * BASE_PIXEL));
export const yCells = (cellSize = 13) => Math.ceil((deviceHeight * 0.9) / (cellSize * BASE_PIXEL));

const VILLAGE_CELL_SIZE = isBig ? 24 : 16;
export const WORLD_SIZE = isWeb ? /*xCells * xCells*/ 20 * 20 : 13; // xCells * yCells; //
export const VILLAGE_SIZE = /*isWeb ?*/ xCells(VILLAGE_CELL_SIZE) * yCells(VILLAGE_CELL_SIZE) * 1.2;
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
    size: WORLD_SIZE,
    id: 1,
    startingCell: 27,
    icon: (cellId, terrain) => (europeAllow.includes(cellId) || isWeb) && pickRandom(mountains, isBig ? 0.1 : 0.2),
  },
  VILLAGE: {
    size: VILLAGE_SIZE,
    id: 2,
    icon: (terrain) =>
      pickRandom(trees.concat(flowers, farm, trees /*, Object.keys(buildingsMap)*/), isBig ? 0.1 : 0.2),
  },
  BATTLE: {
    id: 3,
    bg: (cellId) => chessColor(cellId),
    icon: (cellId) => cellId > 16 && cellId < 48 && pickRandom(trees, 0.2),
  },

  /**Harvest*/
  HARVEST: {
    id: 4,
    initMoves: 16,
    bombs: 3,
    shuffle: 1,
    icon: () => pickRandom(harvest, 1),
    collectList: harvest,
  },
  RECRUIT: {
    id: 5,
    icon: () => pickRandom(Object.keys(unitsMap), 1),
    withDiag: true,
    collectList: Object.keys(unitsMap),
  },
  FRUITS: {id: 6, icon: () => pickRandom(fruits, 1), collectList: fruits, withDiag: true},
  TOOLS: {id: 7, icon: () => pickRandom(tools, 1), collectList: tools, withDiag: true},
};

const initStore = (size, boardMap) => _.range(size * size).map((j) => CellStore({id: j, boardMap}));

export const BoardStore = (boardMap = boardsMap.WORLD, size = CHESS_SIZE, isEmpty = true) =>
  makeAutoObservable({
    size: boardMap.size, // 8x8
    cells: initStore(size, boardMap),
    shuffle(isStart = false) {
      if (!isStart && this.remShuffles > 0) {
        this.remShuffles--;
      }
      this.cells = initStore(size, boardMap);
    },
    currCellId: boardMap.startingCell || size * size - 1,
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
      unitIcon,
      buildIcon,
      isEvil = false,
      flag = isEvil ? '🇪🇸' : profile.flag,
    }) {
      let pos = id;
      if (!overwrite) {
        pos = this.findNextEmpty(id);
      }
      // overwrite ? id : this.findNextEmpty(id);
      const currCell = this.cells[pos];
      console.log('setting', icon, id, currCell, unitIcon, pos, id, overwrite); // this.findNextEmpty(id));
      if (icon) {
        currCell.setIcon(icon);
      }
      if (unitIcon) {
        currCell.setUnit(UnitStore(unitIcon, pos, isEvil));
      }
      if (buildIcon) {
        currCell.setBuilding(BuildingStore(buildIcon, pos, isEvil, flag));
      }
      if (terrain) {
        currCell.setTerrain(terrain);
      }
      return pos;
    },
    /**Harvest specific*/
    harvestCombo: {length: 1, icon: '🔥'},
    bombIcon: '🔥', //boardMap.collectList ? pickRandom(boardMap.collectList, 1) : '🔥',
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
      return this.cells.filter(({icon}) => icon === '🧟').map(({id}) => id);
    },
    explodeMatching(matchIcon = '🧟') {
      this.shouldExplodeAll = true;
      this.reassignCells({cells: this.cells.filter(({icon}) => icon === '🧟').map(({id}) => id), currIcon: matchIcon});
      this.remBombs--;
      this.shouldExplodeAll = false;
    },

    shouldHighlight(cellIndex) {
      return this.shouldExplodeAll
        ? this.cells[cellIndex] === this.bombIcon
        : this.matchRecursiveAdjIds.includes(cellIndex);
    },

    recruit(matchIcon) {
      const comboSize = this.matchRecursiveAdjIds.length;
      profile.addUnit(matchIcon, comboSize - 2);
      this.reassignCells({newIcons: Object.keys(unitsMap), currIcon: matchIcon});
      this.remMoves--;
    },
    /**In order to highgligth the matching one*/
    currResource: '',
    setCurrResource(res) {
      this.currResource = res;
    },
    collectCells(matchIcon = '🔥', isResource) {
      const comboSize = this.matchRecursiveAdjIds.length;
      console.log('wellknown we got: ', matchIcon, isResource, comboSize, this.currResource);

      /**Updates harvestCombo*/
      if (comboSize > 6) {
        this.addMoves(comboSize - 6);
        if (comboSize >= this.harvestCombo.length) {
          this.setComboRecord(comboSize, matchIcon);
        }
      }

      profile.harvestResource(matchIcon, comboSize, isResource);
      if (isResource) {
        this.remMoves--;
      }
      this.reassignCells({currIcon: matchIcon, newIcons: isResource ? harvest : fruits});
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

    get matchRecursiveAdjIds() {
      return unique(
        matchRecursiveAdjCells(this.currCellId, size, this.cells, boardMap.withDiag || this.currCell.icon === '🔥'),
      );
    },
    get validMatch() {
      return this.matchRecursiveAdjIds.length > 2;
    },
    get isCurrUnit() {
      return !!this.currCell.unit;
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
    reassignCells({cells = this.matchRecursiveAdjIds, newIcons = harvest, currIcon = '🔥'}) {
      console.log('Reasigning cells: ', cells, newIcons, currIcon);
      const filterSet = newIcons.filter((icon) => icon !== currIcon);
      cells.forEach((currCellId) => this.cells[currCellId].setIcon(pickRandom(filterSet, 1))); //this.setCell({icon: '💎', id: currCellId}));
    },
    randomMove() {
      const enemies = this.cells.filter(({unit, isEvil}) => unit && isEvil);
      const cellId = pickRandom(enemies, 1).id;
      const availMoves = getAdjacentDiagIds(cellId, size, true, false);
      const emptySpots = availMoves.filter(
        (currId) => !!currId && currId >= 0 && currId < 64 && currId !== cellId && !this.cells[currId]?.icon,
      );
      if (!_.isEmpty(emptySpots)) {
        this.moveToCell(pickRandom(emptySpots, 1), this.cells[cellId], true);
        return true;
      } else {
        return false;
      }
    },
    moveToCell(dest, origin = this.currCell, isEvil = false) {
      console.log('trying to move to ', dest, ' with ', origin);
      /**move to new location*/
      this.setCell({unitIcon: origin.icon, id: dest, isEvil});
      /**Remove previous*/
      origin.clearCell();
    },
    /*resetCollectedResource(resource = 0, id = this.currCellId) {
      this.currCell.setResources(resource);
    },*/
  });

//export const board = new BoardStore();
