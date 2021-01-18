import C, {apply} from 'consistencss';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {profile} from '../App';
import {bgColor, bordColor, colors, textSize} from '../gStyles';
import {unitsMap} from '../stores/sets';
import {Column} from './Box';

export default ({item, list = unitsMap, showAttack = false, onSet = profile.buyUnit}) => {
  const {level, cost, score, skills} = list[item];
  const tooExpensive = Object.entries(cost).some(([res, currCost], index) => currCost > profile.resources[res] || 0);
  const isReady = profile.level >= level;
  const forbidden = !isReady || tooExpensive || profile.populationExceeded;
  return (
    <View style={apply(bgColor(), C.m1, C.p1, C.bgWhite, C.flex, C.radius2, bordColor(colors.wood, 2))}>
      <TouchableOpacity
        activeOpacity={0.4}
        style={apply(forbidden && C.opacity20, C.itemsCenter)}
        onPress={() => !forbidden && onSet(item)}>
        <View style={apply(C.row)}>
          <Text style={apply(textSize.Xs, C.mr1)}>🧩 {level}</Text>
          <Text style={textSize.Xs}>❤️ {skills['❤️']}</Text>
        </View>
        <Text style={apply(textSize.L, C.m1)}>{item}</Text>
        <View style={C.row}>
          {Object.entries(skills).map(
            ([skill, amount]) =>
              amount > 0 && skill !== '❤️' && <Column text={skill} /*col={colors.green}*/ val={amount} />,
          )}
        </View>
        <View style={C.row}>
          {Object.entries(cost).map(
            ([res, resCost]) => resCost > 0 && <Column text={res} col={colors.salmon} val={resCost} />,
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
