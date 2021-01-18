import C, {apply} from 'consistencss';
import _ from 'lodash';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {badgeWrapper, bgColor, bordColor, cell, colors, isIOS, shadow, textSize} from '../gStyles';

export default ({
  item,
  index,
  withTransp = true,
  img = item.img,
  bg = item.bg,
  currCellId,
  opacity = currCellId === index ? 1 : 0.85, //|| !withTransp ? 1 : 0.85,
  size = cell.Md,
  iconSize = textSize.L,
  selColor = colors.water,
  showRes = false,
  showFlag = false,
  wrapStyle,
  onPress,
}) => {
  const isCurrent = currCellId === index;
  const {icon, isEvil, unit, building} = item;
  /*console.log('item: ', item);*/
  const shouldHighlight = !_.isEmpty(unit) || !_.isEmpty(unit);
  return (
    <TouchableOpacity activeOpacity={0.7} style={[{opacity: opacity}, size]} onPress={onPress} opacity={opacity}>
      <FastImage
        source={img}
        opacity={opacity}
        resizeMode={isIOS ? 'center' : 'center'}
        style={apply(
          size,
          C.absolute,
          bgColor(bg),
          C.itemsCenter,
          C.justifyCenter,
          isCurrent && bordColor(selColor, 2),
        )}
      />
      <Text
        style={apply(
          iconSize,
          /*size,*/
          C.selfCenter,
          C.textCenter,
          C.justifyCenter,
          bgColor(shouldHighlight && (isEvil ? colors.salmon + '90' : colors.blue + '90')),
          shouldHighlight && C.radius8,
          shouldHighlight && C.p1,
          wrapStyle,
        )}>
        {icon}
      </Text>
      {/**Badge*/}
      {showRes && item.availResources && (
        <View style={badgeWrapper}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{item.availResources}</Text>
        </View>
      )}
      {showFlag && item.flag && (
        <View style={apply(C.absolute, C.bottom1, C.right1, C.bgWhite, C.radius2)}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{item.flag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
