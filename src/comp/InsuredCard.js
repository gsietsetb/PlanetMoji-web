import React from 'react';
import {Image, Text, View} from 'react-native';
import C, {apply} from 'consistencss';
import {fonts, topBorder} from '../gStyles';

export default ({item, index}) => {
  const img = {uri: item.photo || 'https://picsum.photos/id/' + (index + 200) + '/200/300'};
  return item ? (
    <View style={apply(C.itemsCenter, C.radius2, C.bgWhite, C.flex, C.m3)}>
      <Image source={img} resizeMode={'cover'} style={apply({width: '100%'}, C.h40, C.bgRed, C.mb4, topBorder)} />
      <Text style={apply(fonts.subtitle, C.textStart, C.mx1)}>{item.name}</Text>
      <View style={[C.row, C.justifyBetween, C.flex, C.itemsCenter]}>
        <Text style={apply(fonts.body1, C.textStart, C.mx1)}>{item.description}</Text>
        <Text style={apply(fonts.caption, C.textStart, C.mx1, C.borderHairline, C.p1, C.borderBlue)}>
          {item.category}
        </Text>
      </View>
      <Text style={apply(fonts.caption, C.mx1, C.flex)}>{item.price} €</Text>
    </View>
  ) : (
    <View />
  );
};
