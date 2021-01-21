import C, {apply} from 'consistencss';
import _ from 'lodash';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {badgeWrapper, bgColor, bordColor, cell, colors, gradLife, isIOS, shadow, textSize} from '../gStyles';
import {Badge} from './Box';
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
    <TouchableOpacity activeOpacity={0.7} style={[C.itemsCenter]} onPress={onPress} opacity={opacity}>
      {img && (
        <FastImage
          source={img}
          opacity={opacity}
          resizeMode={isIOS ? 'center' : 'cover'}
          style={apply(
            size,
            C.absolute,
            bgColor(bg),
            C.itemsCenter,
            C.justifyCenter,
            {opacity: opacity},
            isCurrent && bordColor(selColor, 2),
          )}
        />
      )}
      <View
        style={apply(
          C.itemsCenter,
          C.justifyCenter,
          C.contentCenter,
          iconOpacity && {opacity: iconOpacity},
          withFlex ? C.flex : size,
        )}>
        <Text style={apply(iconSize, C.alignCenter, shadow(shouldHighlight && (isEvil ? 'red' : 'blue')), wrapStyle)}>
          {_.isEmpty(item.icon) ? icon : item.icon}
        </Text>
      </View>
      {isCurrent && unit && <TrackBar grad={gradLife} progress={Math.random()} wrapStyle={[C.absolute, C.bottom0]} />}
      {/**Attack mode*/}
      {showRes && item.availResources && (
        /*<Badge text={item.availResources} top right />*/
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
      {showFlag && item.flag && (
        /*<Badge text={item.flag} bottom right />*/
        /*<View>*/
        <>
          <Badge text={'🧝‍♀️'} bottom right />
          <View style={apply(C.absolute, cell.Sm, C.top_2, C.left5)}>
            <Text style={apply(textSize.Md, shadow(colors.sand, 5))}>{item.flag}</Text>
          </View>
        </>
        /*</View>*/
      )}
    </TouchableOpacity>
  );
};
