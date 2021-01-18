import C, {apply, boxShadow} from 'consistencss';
import {Dimensions, Platform} from 'react-native';
import {isTablet} from 'react-native-device-info';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

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
  '🪵': '🪵',
  '🪨': '🗿',
};
export const setIcon = (icon) => (isIOS ? icon : wrongIcon[icon]);
/**Responsiveness*/
export const isWeb = Platform.OS === 'web';
export const isTabl = isTablet();
export const isSmall = isWeb && deviceWidth < 450;
export const isBig = isTabl; //|| (isWeb && deviceWidth > 450);
export const isIOS = Platform.OS === 'ios';

export const w100 = (num = 70) => ({maxWidth: deviceWidth * num});
export const h100 = (num = 70) => ({maxHeight: deviceHeight * num});
export const minH100 = (num = 70) => ({minHeight: deviceHeight * num});

export const iconSizeBig = isBig ? C.font16 : C.font12;
export const textSize = {
  Xs: isBig ? C.font4 : C.font3,
  Sm: isBig ? C.font6 : C.font4,
  Md: isBig ? C.font9 : C.font6,
  L: isBig ? C.font14 : C.font10,
  XL: isBig ? C.font16 : C.font13,
};
export const cell = {
  Xs: apply(isBig ? [C.w6, C.w6, C.flex, C.minh6] : [C.w4, C.h4]), // 6 & 4
  Sm: apply(isBig ? [C.w17, C.w17, C.flex, C.minh17] : [C.w12, C.h12]), // 17 & 12
  Md: apply(isBig ? [C.w20, C.w20, C.flex, C.minh20] : [C.w13, C.h13]), // 20 & 13
  L: apply(isBig ? [C.w22, C.w22, C.flex, C.minh22] : [C.w13, C.h13]), // 22 & 14
  XL: apply(isBig ? [C.w24, C.w24, C.flex, C.minh24] : [C.w16, C.h16]), // 24 & 14
};

export const emptyStateURL = 'https://orbit.kiwi/files/EmptyState-attempt-at-joke.png';
export const absCenter = [
  C.absolute,
  isIOS && C.mt8,
  C.itemsCenter,
  C.justifyCenter,
  C.top0,
  !isSmall && [C.right0, C.left0],
];
export const darkShadow = boxShadow(1, 0, 1, 8, colors.black40, 1);
export const shadow = (col = colors.paleGreyThree, blur = 5, opacity = 1) => boxShadow(blur, 1, 1, blur, col, opacity);

export const topBorder = {
  borderTopRightRadius: 8,
  borderTopLeftRadius: 8,
};

export const imgs = {
  europe: require('./assets/europe.png'),
  europeWest: require('./assets/europeSp.png'),
  grass: require('./assets/grass.png'),
  farm2: require('./assets/farm.png'),
  barrack: require('./assets/barrack.png'),
  farm: require('./assets/farm2.png'),
  yard: require('./assets/yard.png'),
  yard2: require('./assets/img_1.png'),
  yard3: require('./assets/grass2.png'),
  ground2: {uri: 'https://images.template.net/wp-content/uploads/2017/01/25064122/Seamless-Soil-Texture.jpg'},
  grassGround: {uri: 'https://www.3dxo.com/images/textures/l/wildgrass_2_ur_1024.png'},
  ground: {
    uri:
      'https://img.freepik.com/free-photo/fertile-loam-soil-suitable-planting-soil-texture_38663-528.jpg?size=626&ext=jpg',
  },
  water: {uri: 'https://forums.submit.shutterstock.com/gallery/image/8278-waterpng'},
  water2: {uri: 'https://toppng.com/uploads/preview/water-texture-water-11562884439s4ftxqmf62.png'},
  water3: {uri: 'https://www.3dxo.com/images/textures/s/water_079_c_0085.jpg'},
  grassText: {uri: 'https://opengameart.org/sites/default/files/oga-textures/79629/256x%20grass%20overlay.png'},
  earth: {uri: 'https://storage3d.com/storage/2007.11/007a5a96f055a4cbef45c5783e6746e0.jpg'},
  grassText2: {
    uri:
      'https://4.bp.blogspot.com/-dd72o32H0NY/Vga4y-I_FEI/AAAAAAAAIKc/URHoGS6B9AM/s1600/Grass%2BSeptember%2Bseamless%2Btexture%2B%25281%2Bof%2B1%2529.jpg',
  },
  treeText: {uri: 'https://opengameart.org/sites/default/files/oga-textures/79629/256x%20grass%20overlay.png'},
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
    fontSize: isBig ? 20 : 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.blueGrey,
  },
  title1: {
    fontFamily: 'Avenir',
    fontSize: isBig ? 28 : 24,
    fontWeight: '900',
    fontStyle: 'normal',
    lineHeight: 40,
    letterSpacing: 0,
    color: colors.black,
  },
  subtitle: {
    fontFamily: 'Avenir',
    fontSize: isBig ? 20 : 16,
    fontWeight: '900',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  caption: {
    fontFamily: 'Avenir',
    fontSize: isBig ? 13 : 11,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.black,
  },
  body1: {
    fontFamily: 'Avenir',
    fontSize: isBig ? 20 : 16,
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
