import _ from 'lodash';
import {makeAutoObservable} from 'mobx';
import {nanoid} from 'nanoid/non-secure';
import {profile} from '../App';
import {deviceHeight, deviceWidth, isBig, isWeb} from '../gStyles';
import {BuildingStore, CellStore, UnitStore} from './cellStore';
import {europeAllow, farm, flowers, fruits, harvest, mountains, tools, trees, unitsMap} from './sets';
import {chessColor, getAdjacentDiagIds, getAdjacentsIds, matchRecursiveAdjCells, pickRandom, unique} from './utils';

export const xCells = (cellSize = 13) => Math.ceil(deviceWidth / (cellSize * 4));
export const yCells = (cellSize = 13) => Math.ceil((deviceHeight * 0.9) / (cellSize * 4));

const VILLAGE_CELL_SIZE = isBig ? 24 : 16;
export const WORLD_SIZE = isWeb ? /*xCells * xCells*/ 20 * 20 : 13; // xCells * yCells; //
export const VILLAGE_SIZE = /*isWeb ?*/ xCells(VILLAGE_CELL_SIZE) * yCells(VILLAGE_CELL_SIZE);
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
    /*img: () => (Math.random() > 0.2 ? terrains['🌲'] : pickRandom(terrains, 1)),
    terrain: () => (Math.random() > 0.2 ? terrains['🌲'] : pickRandom(terrains, 1)),*/
    icon: (cellId, terrain) =>
      /*terrain === terrains['🌊']
        ? pickRandom(water, 0.2)
        :*/ (europeAllow.includes(cellId) || isWeb) &&
      pickRandom(mountains, 0.2),
    /*: pickRandom(water, 0.2),*/
    /*Math.random() > 0.1
        ?*/
    /*: pickRandom(nature, 0.25)*/
  },
  VILLAGE: {
    id: 2,
    icon: (terrain) => pickRandom(trees.concat(flowers, farm, trees /*, Object.keys(buildingsMap)*/), 0.2),
  },
  BATTLE: {
    id: 3,
    bg: (cellId) => chessColor(cellId),
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
      return this.shouldExplodeAll
        ? this.cells[cellIndex] === this.promotedDiag
        : this.matchRecursiveAdjIds.includes(cellIndex);
    },

    recruit(matchIcon) {
      const comboSize = this.matchRecursiveAdjIds.length;
      profile.addUnit(matchIcon, comboSize - 2);
      this.reassignCells({newIcons: Object.keys(unitsMap).filter((key) => key === matchIcon), currIcon: matchIcon});
      this.remMoves--;
    },
    collectCells(matchIcon = '🔥', isResource) {
      console.log('re', matchIcon, isResource);
      const comboSize = this.matchRecursiveAdjIds.length;
      console.log('cobmo', comboSize, this.matchRecursiveAdjIds);

      /**Updates harvestCombo*/
      if (comboSize > 6) {
        this.addMoves(comboSize - 6);
        if (comboSize >= this.harvestCombo.length) {
          this.setComboRecord(comboSize, matchIcon);
        }
      }
      console.log('this was also fine! :ok: ', comboSize);
      profile.harvestResource(matchIcon, comboSize, isResource);
      this.reassignCells({currIcon: matchIcon, newIcons: isResource ? harvest : fruits});
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

    get matchRecursiveAdjIds() {
      return unique(
        matchRecursiveAdjCells(this.currCellId, size, this.cells, boardsMap.withDiag || this.currCell.icon === '💎'),
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
      console.log('ogingt to cargarme: ', cells, newIcons, currIcon);
      cells.map((cur) => {
        console.log(
          'oim ina loop:: ',
          cur,
          pickRandom(
            newIcons.filter((icon) => icon !== currIcon),
            1,
          ),
        );
        this.setCell({
          icon: pickRandom(
            newIcons.filter((icon) => icon !== currIcon),
            1,
          ),
          overwrite: true,
          id: cur,
        });
      });
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
      unitIcon,
      buildIcon,
      isEvil = false,
    }) {
      const pos = overwrite ? id : this.findNextEmpty(id);
      const currCell = this.cells[pos];
      console.log('setting', icon, id, currCell, unitIcon, pos, id, overwrite, this.findNextEmpty(id));
      if (icon) {
        currCell.setIcon(icon);
      }
      if (unitIcon) {
        currCell.setUnit(UnitStore(unitIcon, pos, isEvil));
      }
      if (buildIcon) {
        currCell.setBuilding(BuildingStore(buildIcon, pos, isEvil));
      }
      if (terrain) {
        currCell.setTerrain(terrain);
      }
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
