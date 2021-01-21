import _ from 'lodash';
import {makeAutoObservable} from 'mobx';
import {Alert} from 'react-native';
import {profile} from '../App';
/*import SnackBar from 'rn-snackbar';*/
import {setIcon} from '../gStyles';
import {screens} from '../routes';
import {boardsMap, BoardStore, modalStore, VILLAGE_SIZE, WORLD_SIZE} from './boardStore';
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
    matchEurope: {},
    addMatchEurope(id) {
      /*res[index] ? (res[index] = false) : (res[index] = true);*/
      this.matchEurope[id] ? (this.matchEurope[id] = false) : (this.matchEurope[id] = true);
      /*this.matchEurope[id] = !this.matchEurope[id];*/
    },
    get cleanMatching() {
      return Object.keys(this.matchEurope);
    },
    get isSignedIn() {
      return _.isEmpty(this.uid);
    },
    currentScreen: 'Collect', //Only for web
    setCurrentScreen(screenName) {
      this.currentScreen = screenName;
    },
    get Comp() {
      return screens[this.currentScreen].Comp;
    },
    username: '',
    get emoji() {
      return levels[this.level - 1];
    },
    setMoji(emoji) {
      this.emoji = emoji;
    },
    flag: '🇪🇸',
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
    modal: modalStore(),

    /**Units*/
    units: {},
    enemy: {},

    /**todo move to board*/
    collected: {'💎': 0, '🪵': 0, '🥩': 0, '🪨': 0, '🔥': 0},
    buildingsList: [],
    /*enemyUnits: _.range(level - 1).map((item) =>
                                                                                                                                                                                                                                                              Object.keys(unitsMap).map((currItem) => profile.battle.setCellIcon(currItem)),
                                                                                                                                                                                                                                                            ),*/
    flagModal: modalStore(),
    eMojiModal: modalStore(),

    /**Boards*/
    boards: {
      worldMap: BoardStore(boardsMap.WORLD, WORLD_SIZE),
      villageMap: BoardStore(boardsMap.VILLAGE, VILLAGE_SIZE),
      recruitMap: BoardStore(boardsMap.RECRUIT),
      harvestMap: BoardStore(boardsMap.HARVEST),
      fruitsMap: BoardStore(boardsMap.FRUITS),
      toolsMap: BoardStore(boardsMap.TOOLS),
      battleMap: BoardStore(boardsMap.BATTLE),
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
      //if(this.collected[resource]) (this.collected[resource] += quant) else quant;
      isResource && this.collect(resource, quant);
    },
    buyBuilding(buildIcon = buildingsMap['⛺️'], board = this.boards.worldMap) {
      console.log('_createPadding, ', buildIcon);
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
      //board.setCellIcon(buildIcon, false, undefined, true);
      board.setCell({buildIcon, overwrite: false, flag: profile.flag});
    },

    /**Units*/
    buyUnit(unitIcon, board = this.boards.battleMap) {
      if (this.populationExceeded) {
        Alert.alert(
          'Population exceded: ' + this.currPopulation + ' / ' + this.maxPopulation,
          'Please get more score so you can achieve next population level',
        );
      } else {
        this.addUnit(unitIcon);
        const {cost, score} = unitsMap[unitIcon];
        /**Spend resources*/
        Object.entries(cost).map(([res, currCost]) => (this.resources[res] -= currCost));
        /**Update score*/
        this.score += score;

        /**Add to board*/
        board.setCurrent(board.setCell({unitIcon: unitIcon, overwrite: false}));
      }
    },
    addUnit(unit, quant = 1) {
      this.currPopulation += quant;
      objAdd(this.units, unit, quant);
    },
    addUnitsBoard(board = this.boards.battleMap) {
      Object.entries(this.units).map(([key, value]) =>
        _.range(value).map((item) => board.setCell({unitIcon: key, overwrite: false})),
      );
    },
    addEnemies(num = 16) {
      for (let i = 0; i < num; i++) {
        this.boards.battleMap.setCell({
          unitIcon: pickRandom(Object.keys(unitsMap), 1),
          overwrite: false,
          id: 15,
          isEvil: true,
        });
      }
    },
    collect(resource, val) {
      const combo = Math.pow(2, val);
      if (resource === setIcon('🔥')) {
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

/*export const profile = ProfileStore();*/
