import C, {apply} from 'consistencss';
import _ from 'lodash';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {badgeWrapper, bgColor, bordColor, cell, colors, gradLife, isIOS, shadow, textSize} from '../gStyles';
import {TrackBar} from './ProgressBar';

export default ({
  item,
  index,
  availAttack,
  img = item.img,
  icon = item.icon,
  currCellId,
  opacity = currCellId === index ? 1 : 0.85, //|| !withTransp ? 1 : 0.85,
  iconOpacity = 1,
  /**sizes*/
  size = cell.Md,
  iconSize = textSize.L,

  /**wrap styles*/
  bg = item.bg,
  cBord = currCellId === index && bordColor(colors.water, 2),
  cShadow = shadow(!!item.unit || (!!item.building && (item.isEvil ? 'red' : 'blue'))),
  wrapStyle,

  /**Booleans*/
  showLife = currCellId === index && item.unit,
  showRes = false,
  showFlag = false,
  withFlex = false,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={C.itemsCenter} onPress={onPress} opacity={opacity}>
      {img && (
        <FastImage
          source={img}
          opacity={opacity}
          resizeMode={isIOS ? 'center' : 'cover'}
          style={apply(C.absolute, bgColor(bg), {opacity: opacity}, size)}
        />
      )}
      <View
        style={apply(
          C.itemsCenter,
          C.justifyCenter,
          C.contentCenter,
          iconOpacity && {opacity: iconOpacity},
          size,
          !img && bgColor(bg),
          withFlex ? C.flex : size,
          cBord,
          wrapStyle,
        )}>
        <Text style={apply(iconSize, C.alignCenter, cShadow, wrapStyle)}>
          {_.isEmpty(item.icon) ? icon : item.icon}
        </Text>
      </View>
      {showLife && <TrackBar grad={gradLife} progress={item.unit.lifePerc} wrapStyle={[C.absolute, {top: -2}]} />}
      {/**Attack mode*/}
      {showRes && item.availResources && (
        <View style={badgeWrapper}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{item.availResources}</Text>
        </View>
      )}
      {/**Badge*/}
      {availAttack && (
        <View style={[badgeWrapper, C.top_1, C.right0]}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{availAttack}</Text>
        </View>
      )}
      {/**Flag*/}
      {showFlag && item.flag && (
        <>
          {/*<Badge text={'🧝‍♀️'} bottom right />*/}
          <View style={apply(C.absolute, cell.Sm, C.top_5, C.left6)}>
            <Text style={apply(textSize.Md, shadow(colors.sand, 5))}>{item.flag}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};
