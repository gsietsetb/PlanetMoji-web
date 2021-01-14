import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
/*import FastImage from 'react-native-fast-image';*/
import {bordColor, cell, colors, fonts, setIcon, shadow, textColor, textSize} from '../gStyles';
import {SCREEN_TABS} from '../routes';
import {profile} from '../stores/profileStore';
import {numFormat} from '../stores/utils';

const Box = ({icon, value, text, border = true, horiz = true, bg = true, highlightIcon}) => {
  return (
    <View
      style={apply(
        horiz && C.row,
        C.mx2,
        C.itemsCenter,
        (border || highlightIcon) && bordColor(highlightIcon ? colors.salmon : colors.sand, highlightIcon ? 4 : 2),
        bg && C.bgWhite,
        C.px1,
        C.justifyBetween,
        !border && !horiz && C.w18,
        C.radius2,
      )}>
      <Text style={apply(C.font6, C.selfCenter)}>{icon}</Text>
      <View style={horiz && C.row}>
        <Text numberOfLines={1} style={apply(fonts.subtitle, C.selfCenter)}>
          {text}
        </Text>
        <Text numberOfLines={1} style={apply(fonts.body1, C.selfCenter)}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export const ImgIcon = ({icon, size = textSize.XL}) =>
  typeof icon === 'string' ? <Text style={size}>{icon}</Text> : <Image source={icon} style={apply(cell.Md)} />;
export const Tag = ({text, col = colors.sand, onPress}) => (
  <Text onPress={onPress} style={apply(fonts.subtitle, shadow(col, 9), C.radius2, C.px1, bordColor(col))}>
    {text}
  </Text>
);
export const Column = ({text, val, col = colors.black, isBig = false, onPress = () => {}}) => (
  <TouchableOpacity onPress={onPress} style={apply(C.mxHairline, C.itemsCenter)}>
    <Text style={apply(isBig ? textSize.Md : textSize.Xs)}>{text}</Text>
    <Text style={apply(fonts.caption, textColor(col))}>{val}</Text>
  </TouchableOpacity>
);

export const VertInfo = ({text, val, descr, isBig = false, onPress = () => {}}) => (
  <TouchableOpacity onPress={onPress} style={apply(C.mx1, C.itemsCenter)}>
    <Text style={apply(isBig ? textSize.L : textSize.Sm, C.my2)}>{text}</Text>
    {descr && <Tag col={colors.water} text={descr + ' ' + val} />}
    {/*<Tag text={text} />*/}
    {/*<Text style={apply(isBig ? textSize.Md : textSize.Xs)}>{val}</Text>*/}
  </TouchableOpacity>
);
export const StatsMap = ({profile, showPopulation = false}) => (
  <View style={apply(C.row, C.m4, C.selfCenter)}>
    <Box icon={setIcon('⭐️')} text={profile.scoreForm} value={'/ ' + profile.remainingScoreForm} />
    <Box icon={'🧩'} text={profile.level} value={'/10'} />
    {showPopulation && <Box icon={'👨‍👩‍👧‍👦'} text={profile.currPopulation} value={'/' + profile.maxPopulation} />}
  </View>
);

export const CloseButton = (screen = SCREEN_TABS) => {
  const {navigate, goBack} = useNavigation();
  return (
    <Text style={apply(C.absolute, C.right4, C.top12, textSize.L, shadow(colors.salmon, 2))} onPress={() => goBack()}>
      ☠️️
    </Text>
  );
};
export const ResourcesMap = ({resources = profile.resources, withBord = false, highlightIcon}) => (
  <View style={apply(C.row, C.mb4, C.selfCenter, shadow(colors.sand))}>
    {Object.entries(resources).map(([icon, value]) => (
      <Box icon={icon} value={numFormat(value)} border={withBord} highlightIcon={highlightIcon === icon} />
    ))}
  </View>
);
/*const Tabs = ({tabs = Object.values(battleModes), setMode, currentTab = 0}) => (
  <View style={apply(C.row, C.mt4, C.justifySpaced, C.itemsCenter)}>
    {tabs.map(({title, Comp}, index) => (
      <TouchableOpacity
        onPress={() => setMode(index)}
        style={apply(
          C.flex,
          C.mx1,
          C.p2,
          topBorder,
          bgColor(index !== currentTab ? colors.black12 : colors.white),
          darkShadow,
          //bordColor(index === currentTab ? colors.wood : colors.black40, 1),
        )}>
        <Text numberOfLines={1} style={apply(fonts.subtitle)}>
          {title}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);*/

export default Box;
