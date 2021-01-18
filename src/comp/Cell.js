import C, {apply} from 'consistencss';
import React from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native-web';
import {badgeWrapper, bgColor, bordColor, cell, colors, shadow, textSize} from '../gStyles';

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
  const {icon} = item;
  return (
    <TouchableOpacity activeOpacity={0.2} /*style={{opacity: opacity}}*/ onPress={onPress}>
      <ImageBackground
        source={img}
        style={apply(
          size,
          bgColor(bg),
          C.itemsCenter,
          C.justifyCenter,
          {opacity: opacity},
          isCurrent && bordColor(selColor, 2),
        )}>
        {/*<Text style={C.absolute}>{JSON.stringify(item.bg)}</Text>*/}
        <Text style={apply(iconSize, wrapStyle)}>{icon}</Text>
      </ImageBackground>
      {/**Badge*/}
      {showRes && item.availResources && (
        <View style={badgeWrapper}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{item.availResources}</Text>
        </View>
      )}
      {showFlag && item.flag && (
        <View style={badgeWrapper}>
          <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{item.flag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
