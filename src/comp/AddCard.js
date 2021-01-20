import C, {apply} from 'consistencss';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {profile} from '../App';
import {bordColor, colors, gradLife, isWeb, textSize} from '../gStyles';
import {unitsMap} from '../stores/sets';
import {Column} from './Box';
import {TrackBar} from './ProgressBar';

export default ({item, list = unitsMap, border = colors.blue, own = false, currLife, onSet = profile.buyUnit}) => {
  const {level, cost, score, skills} = list[item];
  const tooExpensive = Object.entries(cost).some(([res, currCost], index) => currCost > profile.resources[res] || 0);
  const isReady = profile.level >= level;
  const forbidden = !isReady || tooExpensive || profile.populationExceeded;
  return (
    <View
      style={apply(C.m1, own ? C.p2 : C.p1, C.bgWhite, C.radius2, bordColor(forbidden ? colors.blueGrey : border, 2))}>
      <TouchableOpacity
        activeOpacity={0.4}
        style={apply(!own && forbidden && C.opacity20, C.itemsCenter)}
        onPress={() => !forbidden && onSet(item)}>
        <View style={apply(C.row, currLife && C.mb2)}>
          <Text style={apply(textSize.Xs, C.mr1)}>⭐️ {level}</Text>
          <Text style={textSize.Xs}>
            ❤️{currLife && currLife + ' /'} {skills['❤️']}
          </Text>
        </View>
        {currLife && !isWeb && (
          <TrackBar
            maxWidth={20 * 4}
            colAccent={gradLife(currLife / skills['❤️']).toString()}
            progress={currLife / skills['❤️']}
          />
        )}
        <Text style={apply(textSize.L, C.m1)}>{item}</Text>
        <View style={C.row}>
          {Object.entries(skills).map(
            ([skill, amount]) =>
              amount > 0 && skill !== '❤️' && <Column text={skill} /*col={colors.green}*/ val={amount} />,
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
