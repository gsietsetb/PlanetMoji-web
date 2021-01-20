import C, {apply} from 'consistencss';
import _ from 'lodash';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {badgeWrapper, bgColor, bordColor, cell, colors, shadow, textSize} from '../gStyles';
import {TrackBar} from './ProgressBar';

export default ({
  item,
  index,
  availAttack,
  img = item.img,
  bg = item.bg,
  icon = /*item?.unit?.icon || item?.building?.icon ||*/ item?.icon,
  currCellId,
  opacity = currCellId === index ? 1 : 0.85, //|| !withTransp ? 1 : 0.85,
  iconOpacity = 1,
  size = cell.Md,
  iconSize = textSize.L,
  selColor = colors.water,
  showRes = false,
  showFlag = false,
  withFlex = false,
  wrapStyle,
  onPress,
}) => {
  const isCurrent = currCellId === index;
  const {isEvil, unit, building} = item;
  const shouldHighlight = !!unit || !!building;
  return (
    <TouchableOpacity activeOpacity={0.7} style={[bgColor(bg + '90'), size]} onPress={onPress} opacity={opacity}>
      {img && (
        <Image
          source={img}
          opacity={opacity}
          resizeMode={'cover'}
          style={apply(
            size,
            C.absolute,
            /*bgColor(bg),*/
            C.itemsCenter,
            C.justifyCenter,
            {opacity: opacity},
            /*isCurrent && bordColor(selColor, 2),*/
          )}
        />
      )}
      <View
        style={apply(
          iconOpacity && {opacity: iconOpacity},
          C.itemsCenter,
          size,
          isCurrent && bordColor(selColor, 2),
          /*bgColor(bg),*/
          wrapStyle,
          /* bgColor(bg + '40'),*/
        )}>
        <Text style={apply(iconSize)}>{_.isEmpty(item.icon) ? icon : item.icon}</Text>
      </View>
      {isCurrent && unit && <TrackBar wrapStyle={[C.absolute, C.bottom0, C.shadowMd]} />}
      {/**Badge*/}
      {showRes && item.availResources && (
        <View style={badgeWrapper}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{item.availResources}</Text>
        </View>
      )}
      {/**Attack mode*/}
      {availAttack && (
        <View style={[badgeWrapper, C.top_1, C.right0]}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{availAttack}</Text>
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
