import _ from 'lodash';
import {makeAutoObservable} from 'mobx';
import {nanoid} from 'nanoid/non-secure';
import {profile} from '../App';
import {boardsMap} from './boardStore';
import {buildingsMap, natureToResource, terrains, unitsMap} from './sets';
import {pickRandom} from './utils';

export const UnitStore = (unitIcon = '👩‍🌾', pos, isEvil = false) =>
  makeAutoObservable({
    id: nanoid(6),
    unit: unitsMap[unitIcon],
    icon: unitIcon,
    cellPos: pos,
    isEvil: isEvil,
    life: unitsMap[unitIcon].skills['❤️'] || 100,
    map: null,
    get isAssigned() {
      return this.map && this.cellPos;
    },
    get lifePerc() {
      return this.life / this.unit.skills['❤️'];
    },
    impactAttack(attack = 0) {
      const impact = attack - this.unit.skills['🛡'];
      if (impact > 0) {
        this.life -= impact;
      }
    },
    assign(map, newPos) {
      this.map = map;
      this.cellPos = newPos;
    },
    move(newPos) {
      this.cellPos = newPos;
    },
    /* redLife(amount) {
      this.currLife -= amount;
    },*/
  });
export const BuildingStore = (buildIcon, pos, isEvil = false, flag = profile.flag) =>
  makeAutoObservable({
    id: nanoid(6),
    building: buildingsMap[buildIcon],
    icon: buildIcon,
    cellPos: pos,
    flag: flag,
    isEvil: isEvil,
    map: null,
    get isAssigned() {
      return this.map && this.cellPos;
    },
    assign(map, newPos) {
      this.map = map;
      this.cellPos = newPos;
    },
    move(newPos) {
      this.cellPos = newPos;
    },
    redLife(amount) {
      this.currLife -= amount;
    },
  });

export const CellStore = ({
  id,
  icon,
  boardMap = boardsMap.WORLD,
  unit,
  building,
  terrain /*terrains['🌲']*/,
  img /*terrain.img*/,
  bg /*terrain.bg*/,
  badge,
  flag,
  isEvil = false,
  complSeconds = Math.floor(Math.random() * 10),
}) =>
  makeAutoObservable({
    id: id,
    icon: icon || boardMap.icon(id), //(boardMap.terrain && (() => pickRandom(boardMap.terrain.icons, 1))),
    isEvil: isEvil,
    unit: unit,
    building: building,
    badge: badge,
    terrain: terrain,
    flag: flag,
    img: img,
    bg: bg,
    //bg: terrain || (boardMap.terrain && boardMap.terrain().bg),
    isEmpty: false,
    isPressable: !icon /*iconGenerator(id, isPressable)*/,
    /*get bgColor() {
      return chessColor(this.id); //this.isPressable ? /!*colors.white *!/ grassGenerator(this.id) : colors.water;
    },*/
    get isUnit() {
      return !_.isEmpty(this.unit);
    },
    get ourBuilding() {
      return !!this.building && this.isEvil;
    },

    /**Timer*/
    /*complSeconds: complSeconds,
    get taskExpiry() {
      return moment().add(/!*id % 3 === 0 ? 0 :*!/ this.complSeconds, 'seconds');
    },
    get taskReady() {
      return moment(this.taskExpiry).diff(moment(), 'seconds', true) > 0;
    },
    get badge() {
      return this.taskReady;
    },*/
    get availResources() {
      return /*this.taskReady*/ this.id % 7 === 0 && natureToResource(this.icon);
    },
    setIcon(newIcon) {
      this.icon = newIcon;
    },
    setEvil(isCurrEvil = true) {
      this.isEvil = isCurrEvil;
    },
    setUnit(newUnit, isNewEvil = newUnit.isEvil, newFlag = profile.flag) {
      this.unit = newUnit;
      this.icon = newUnit.icon;
      this.isEvil = isNewEvil;
      this.flag = newFlag;
    },
    clearCell() {
      this.unit = undefined;
      this.icon = '';
      this.isEvil = false;
    },
    setBuilding(newBuild = true, isNewEvil = newBuild.isEvil, newFlag = newBuild.flag) {
      this.building = newBuild;
      this.icon = newBuild.icon;
      this.isEvil = isNewEvil;
      this.flag = newFlag;
    },
    setTerrain(newTerrain = terrains['🌲']) {
      this.bg = newTerrain.bg;
      this.icon = pickRandom(newTerrain.icons, 0.3);
      this.img = newTerrain.img;
    },
  });
