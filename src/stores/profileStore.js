import _ from 'lodash';
import {makeAutoObservable} from 'mobx';
import {Alert} from 'react-native';
/*import SnackBar from 'rn-snackbar';*/
import {setIcon} from '../gStyles';
import {boardsMap, BoardStore, MATRIX_SIDES, modalStore} from './boardStore';
import {buildingsMap, levels, unitsMap} from './sets';
import {numFormat, objAdd, pickRandom} from './utils';

/**todo  rem
 * const initResources = () =>
 resources.reduce((item, accum, index) => {
    accum[item] = new ResourceStore(index, item, 150);
  }, {});*/

export const ProfileStore = (isIA = false, level = 1) =>
  makeAutoObservable({
    /**Auth*/
    uid: '' /*nanoid(12)*/,
    get isSignedIn() {
      return _.isEmpty(this.uid);
    },
    username: '',
    get emoji() {
      return levels[this.level - 1];
    },
    /*setMoji(emoji) {
                                  this.emoji = emoji;
                                },*/
    flag: '🇺🇸',
    setFlag(emoji) {
      this.flag = emoji;
    },

    /**Stats*/
    score: 1,
    get scoreForm() {
      return numFormat(this.score);
    },
    get remainingScoreForm() {
      return numFormat(Math.pow(10, this.level));
    },
    resources: {'💎': 150, '🪵': 150, '️🥩': 150, '🪨': 150},
    modal: new modalStore(),

    /**Units*/
    units: {},
    enemy: {},

    /**todo move to board*/
    collected: {'💎': 0, '🪵': 0, '🥩': 0, '🪨': 0, '⭐️': 0},
    buildingsList: [],
    /*enemyUnits: _.range(level - 1).map((item) =>
                                                                                                                                                                                                                                                              Object.keys(unitsMap).map((currItem) => profile.battle.setCellIcon(currItem)),
                                                                                                                                                                                                                                                            ),*/
    flagModal: new modalStore(),
    eMojiModal: new modalStore(),

    /**Boards*/
    boards: {
      worldMap: new BoardStore(boardsMap.WORLD, MATRIX_SIDES),
      villageMap: new BoardStore(boardsMap.VILLAGE, MATRIX_SIDES),
      recruitMap: new BoardStore(boardsMap.RECRUIT),
      harvestMap: new BoardStore(boardsMap.HARVEST),
      fruitsMap: new BoardStore(boardsMap.FRUITS),
      toolsMap: new BoardStore(boardsMap.TOOLS),
      battleMap: new BoardStore(boardsMap.BATTLE),
    },

    /**Population*/
    currPopulation: 0,
    maxPopulation: 5,
    get populationExceeded() {
      return this.currPopulation >= this.maxPopulation;
    },
    get level() {
      return Math.floor(Math.log10(this.score)) + 1;
    },
    harvestResource(resource, quant = 2, isResource) {
      this.collected[resource] ? (this.collected[resource] += quant) : quant;
      isResource && this.collect(resource, quant);
    },
    buyBuilding(buildIcon = buildingsMap['⛺️'], board = this.boards.worldMap) {
      objAdd(this.buildingsList, buildIcon);
      const {cost, score, population} = buildingsMap[buildIcon];

      /**Deduce resources*/
      Object.entries(cost).map(([res, amount]) => amount > 0 && (this.resources[res] -= amount));
      /**Update score & population*/
      this.score += score;
      if (population && population > 0) {
        this.maxPopulation += population;
      }

      /**Add to board*/
      board.setCellIcon(buildIcon, false, undefined, true);
    },

    /**Units*/
    buyUnit(unit, board = this.boards.battleMap) {
      if (this.populationExceeded) {
        Alert.alert(
          'Population exceded: ' + this.currPopulation + ' / ' + this.maxPopulation,
          'Please get more score so you can achieve next population level',
        );
      } else {
        this.addUnit(unit);
        const {cost, score} = unitsMap[unit];
        /**Deduce resources*/
        Object.entries(cost).map(([res, currCost]) => (this.resources[res].value -= currCost));
        /**Update score*/
        this.score += score;

        /**Add to board*/
        board.setCellIcon(unit, false, undefined, false, true);
      }
    },
    addUnit(unit, quant = 1) {
      this.currPopulation += quant;
      objAdd(this.units, unit, quant);
    },
    addUnitsBoard(board = this.boards.battleMap) {
      Object.entries(this.units).map(([key, value]) =>
        _.range(value).map((item) => board.setCellIcon(key, false, undefined, true, true)),
      );
    },
    addEnemies(num = 16) {
      _.range(num).map((item) =>
        this.boards.battleMap.setCellIcon(pickRandom(Object.keys(unitsMap), 1), false, 15, true, true),
      );
    },
    collect(resource, val) {
      const combo = Math.pow(2, val);
      if (resource === setIcon('⭐️')) {
        this.score += combo;
      } else if (resource === '🔥') {
        this.score += combo * 2;
      } else {
        this.score += val;
        this.resources[resource] += combo;
      }
      /*val > 7 &&
        SnackBar.show('💥 Combo of ' + val + ' ' + resource + '! => ' + combo, {
          style: apply(C.radius2, C.mb16, C.mx4),
          backgroundColor: colors.black,
          buttonColor: colors.paleGrey,
          textColor: colors.paleGrey,
        });*/
    },
  });

export const profile = new ProfileStore();
