import C, {apply, boxShadow} from 'consistencss';
import {Dimensions, Platform} from 'react-native';
import {isTablet} from 'react-native-device-info';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

export const st = (styles) => apply(styles);

export const colors = {
  blue: '#355eb9',
  black: '#020202',
  black40: 'rgba(0, 0, 0, 0.4)',
  wood: '#804000',
  salmon: '#c14e2b',
  salmon40: '#c14e2b20',
  blueGrey: '#9399ac',
  grass: '#baf2b5',
  blueGreen: '#006637',
  greenDark: '#276622',
  green: '#418a6e',
  water: '#60a6d0',
  ground: '#d5db7a',
  groundSand: '#bc9c4f',
  sand: '#efd9a2',
  sand30: '#efd9a230',
  white: '#ffffff',
  paleGreyTwo: '#eff2f9',
  paleGreyThree: '#dee0e6',
  black12: 'rgba(0, 0, 0, 0.12)',
  paleGrey: '#f6f7fc',
};

export const bgColor = (color = colors.blueGrey) => ({backgroundColor: color});
export const bordColor = (color = colors.blueGrey, width = 1) => ({
  borderColor: color,
  borderWidth: width,
});
export const textColor = (color) => ({color: color});

export const wrongIcon = {
  '⭐️': '⚡️',
  '🪵': '🏹',
  '🪨': '🗿',
};
export const setIcon = (icon) => (iOS ? icon : wrongIcon[icon]);
/**Responsiveness*/

export const isTabl = isTablet();
export const iOS = Platform.OS === 'ios';
export const isWeb = Platform.OS === 'web';

export const w100 = (num = 70) => ({maxWidth: deviceWidth * num});
export const h100 = (num = 70) => ({maxHeight: deviceHeight * num});
export const minH100 = (num = 70) => ({minHeight: deviceHeight * num});

export const iconSizeBig = isTabl ? C.font16 : C.font12;
export const textSize = {
  Xs: isTabl ? C.font4 : C.font3,
  Sm: isTabl ? C.font6 : C.font4,
  Md: isTabl ? C.font9 : C.font6,
  L: isTabl ? C.font16 : C.font10,
  XL: isTabl ? C.font20 : C.font13,
};
export const cell = {
  Xs: apply(isTabl ? [C.w6, C.w6, C.flex, C.minh6] : [C.w4, C.h4]), // 6 & 4
  Sm: apply(isTabl ? [C.w17, C.w17, C.flex, C.minh17] : [C.w12, C.h12]), // 17 & 12
  Md: apply(isTabl ? [C.w20, C.w20, C.flex, C.minh20] : [C.w13, C.h13]), // 20 & 13
  L: apply(isTabl ? [C.w22, C.w22, C.flex, C.minh22] : [C.w12, C.h12]), // 22 & 12
  XL: apply(isTabl ? [C.w24, C.w24, C.flex, C.minh24] : [C.w14, C.h14]), // 24 & 14
};

export const emptyStateURL =
  'https://orbit.kiwi/files/EmptyState-attempt-at-joke.png';
export const darkShadow = boxShadow(1, 0, 1, 8, colors.black40, 1);
export const shadow = (col = colors.paleGreyThree, blur = 5, opacity = 1) =>
  boxShadow(blur, 1, 1, blur, col, opacity);

export const topBorder = {
  borderTopRightRadius: 8,
  borderTopLeftRadius: 8,
};

export const imgs = {
  mvprio: require('./assets/mvprio.png'),
};

export const badgeWrapper = apply(
  bgColor(colors.paleGreyThree),
  C.radius4,
  C.w5,
  C.h5,
  C.itemsCenter,
  C.justifyCenter,
  shadow(colors.wood, 1),
  C.absolute,
  /* shadow(colors.sand),*/
  C.right1,
  C.top1,
);

/**Fonts*/
export const fonts = {
  input: {
    fontFamily: 'Avenir-Roman',
    fontSize: isTabl ? 20 : 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.blueGrey,
  },
  title1: {
    fontFamily: 'Avenir',
    fontSize: isTabl ? 28 : 24,
    fontWeight: '900',
    fontStyle: 'normal',
    lineHeight: 40,
    letterSpacing: 0,
    color: colors.black,
  },
  subtitle: {
    fontFamily: 'Avenir',
    fontSize: isTabl ? 20 : 16,
    fontWeight: '900',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  caption: {
    fontFamily: 'Avenir',
    fontSize: isTabl ? 13 : 11,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.black,
  },
  body1: {
    fontFamily: 'Avenir',
    fontSize: isTabl ? 20 : 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.black,
  },
};

export const strikeThrough = {
  textDecorationLine: 'line-through',
  textDecorationStyle: 'solid',
};
