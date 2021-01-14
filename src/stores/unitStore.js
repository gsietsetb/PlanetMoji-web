import {makeAutoObservable} from 'mobx';
import {modalStore} from './boardStore';
import {unitsMap} from './sets';
import {numFormat} from './utils';

/**todo improve*/
export const UnitStore = (icon, isEvil = false, level = 1) =>
  makeAutoObservable({
    icon: icon,
    isEvil: isEvil,
    get stats() {
      return unitsMap[icon];
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
  });

/*
export const profile = persist(new ProfileStore());
*/
