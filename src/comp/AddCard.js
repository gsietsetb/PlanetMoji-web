import C, {apply} from 'consistencss';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {profile} from '../App';
import {BASE_PIXEL, bordColor, colors, gradLife, shadow, textSize} from '../gStyles';
import {unitsMap} from '../stores/sets';
import {Column} from './Box';
import {TrackBar} from './ProgressBar';

export default ({
  item,
  list = unitsMap,
  isBuilding = false,
  border,
  own = false,
  isFight = false,
  currLife = list[item].skills['❤️'],
  onSet = profile.buyUnit,
}) => {
  const {level, cost, score, skills} = list[item];
  const tooExpensive = Object.entries(cost).some(([res, currCost], index) => currCost > profile.resources[res] || 0);
  const isReady = profile.level >= level;
  const forbidden = !isReady || tooExpensive || (!isBuilding && profile.populationExceeded);
  const highlightColor = border || (forbidden ? colors.blueGrey : colors.blue);
  return (
    <View
      style={apply(
        C.m1,
        own ? C.p2 : C.p1,
        C.bgWhite,
        C.radius2,
        bordColor(highlightColor, 1),
        shadow(highlightColor, 2),
      )}>
      <TouchableOpacity
        activeOpacity={0.4}
        style={apply(!own && forbidden && C.opacity20, C.itemsCenter)}
        onPress={() => !forbidden && onSet(item)}>
        <View style={apply(C.row, isFight && C.mb2)}>
          <Text style={apply(textSize.Xs, C.mr1)}>⭐️ {level}</Text>
          <Text style={textSize.Xs}>
            ❤️{isFight && currLife + ' /'} {skills['❤️']}
          </Text>
        </View>
        {isFight && (
          <TrackBar
            maxWidth={20 * BASE_PIXEL}
            colAccent={gradLife(currLife / skills['❤️']).toString()}
            progress={currLife / skills['❤️']}
          />
        )}
        <Text style={apply(textSize.L, C.m1)}>{item}</Text>
        <View style={C.row}>
          {Object.entries(skills).map(
            ([skill, amount]) =>
              amount > 0 && skill !== '❤️' && <Column text={skill} /*col={colors.green}*/ val={amount > 1 && amount} />,
          )}
        </View>

        {!currLife && (
          /*<ProgressBar height={12} animated progress={0.3} noFlex={'40%'} />*/
          <View style={C.row}>
            {Object.entries(cost).map(
              ([res, resCost]) => resCost > 0 && <Column text={res} col={colors.salmon} val={resCost} />,
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
