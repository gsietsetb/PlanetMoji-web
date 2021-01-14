import {makeAutoObservable} from 'mobx';
import {MATRIX_SIDES} from './boardStore';
import {natureToResource} from './sets';
import {chessColor} from './utils';

export const CellStore = ({
  id,
  icon,
  boardMap,
  isPressable = true, //id % 6 !== 0,
  isEvil = false,
  isUnit = false,
  /*badge = 0,*/
  isEmpty = false,
  complSeconds = Math.floor(Math.random() * 10),
}) =>
  makeAutoObservable({
    id: id,
    icon: icon || boardMap.icon(id),
    isEvil: isEvil,
    isUnit: isUnit,
    isEmpty: false,
    isPressable: !icon /*iconGenerator(id, isPressable)*/,
    get bgColor() {
      return chessColor(this.id); //this.isPressable ? /*colors.white */ grassGenerator(this.id) : colors.water;
    },
    get x() {
      return Math.floor(id % MATRIX_SIDES);
    },
    get y() {
      return Math.floor(id / MATRIX_SIDES);
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
    setIcon(newIcon, price = 600) {
      this.icon = newIcon;
    },
    setEvil(isCurrEvil = true) {
      this.isEvil = isCurrEvil;
    },
    setUnit(isCurrUnit = true) {
      this.isUnit = isCurrUnit;
    },
    /*setResources(resource) {
      this.availResources = resource;
    },*/
  });
