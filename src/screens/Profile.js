import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {FlatList, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {profile} from '../App';
import Box, {Badge, ResourcesMap, Tag} from '../comp/Box';
import {TrackBar} from '../comp/ProgressBar';
import {bordColor, colors, deviceWidth, fonts, gradGold, isWeb, shadow, textSize} from '../gStyles';
import {nav, screens} from '../routes';
import {levels, tools} from '../stores/sets';

export default observer(() => {
  const levProgress = profile.level / 10;
  const levColor = gradGold(levProgress).toString();
  const useNav = !isWeb && useNavigation();
  return (
    <ScrollView contentContainerStyle={apply(C.bgWhite, C.py16, C.itemsCenter)}>
      {/**Emoji setter*/}
      <TouchableOpacity
        onPress={() => profile.eMojiModal.showModal()}
        style={apply(C.font18, C.selfCenter, C.w24, C.h24, bordColor(colors.blue, 3), C.itemsCenter, C.radius20)}>
        <Text style={apply(C.font18)}>{profile.emoji}</Text>
        {/**Flag*/}
        <TouchableOpacity
          onPress={() => profile.flagModal.showModal()}
          style={apply(
            C.selfCenter,
            C.bgWhite,
            C.shadowMd,
            /*bordColor(colors.sand, 3),*/ C.radius6,
            C.absolute,
            C.top13,
            C.left16,
          )}>
          <Text style={apply(C.font9)}>{profile.flag}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <Text style={apply(fonts.title2, C.my2, C.selfCenter)}>{profile.username}</Text>

      {/**Level*/}
      <View style={apply(C.row, C.my2, C.itemsCenter)}>
        <Box icon={'⭐️️'} text={profile.level} value={'/ 10'} border={false} />
        <TrackBar progress={levProgress} colAccent={levColor} maxWidth={deviceWidth * 0.7} height={20} />
      </View>

      {/**Icons associated to Level*/}
      <View style={apply(C.row, C.mb3, isWeb && C.shadowSm, C.p2, C.radius2, shadow(levColor, 4))}>
        {levels.map((item, index) => (
          <Text
            style={apply(
              C.font8,
              C.flex,
              C.alignCenter,
              index === profile.level - 1 && [C.radius4, bordColor(levColor, 2)],
            )}>
            {item}
          </Text>
        ))}
      </View>

      {/**Score*/}
      <View style={apply(C.row, C.my3, C.selfCenter)}>
        <Box
          icon={'🔥'}
          text={profile.scoreForm}
          bg={colors.fire}
          value={'/ ' + profile.remainingScoreForm}
          border={false}
        />
        <TrackBar
          progress={profile.score / Math.pow(10, profile.level)}
          colAccent={colors.fire}
          maxWidth={deviceWidth * 0.7}
          height={20}
        />
      </View>
      {/**Resoruces*/}
      <Text style={apply(fonts.title2, C.mt8, C.mb2, C.textLeft)}>Resources </Text>
      <ResourcesMap />

      {/**Buildings*/}
      <Text style={apply(fonts.title2, C.mt8, C.mb2, C.textLeft)}>🏠 Buildings </Text>
      <FlatList
        horizontal
        data={Object.entries(profile.buildingsList)}
        ListEmptyComponent={
          <Tag text={'➕ Build 🧱'} col={colors.salmon} onPress={() => nav(screens.Village.name, useNav)} />
        }
        keyExtractor={(item) => item[0]}
        renderItem={({item}) => (
          <View style={C.m4}>
            <Text style={textSize.L}>{item[0]}</Text>
            {item[1] > 1 && <Text style={fonts.subtitle}>{item[1]}</Text>}
            <Badge text={'⚔️'} isBig left top />
          </View>
        )}
      />

      {/**Units*/}
      <Text style={apply(fonts.title2, C.mt8, C.mb2, C.textLeft)}>🥷🏻 Units </Text>
      <FlatList
        horizontal
        data={Object.entries(profile.units)}
        keyExtractor={(item) => item[0]}
        ListEmptyComponent={
          <Tag text={'➕ Recruit 🏋'} col={colors.blue} onPress={() => nav(screens.Recruit.name, useNav)} />
        }
        renderItem={({item}) => (
          <View style={C.m4}>
            <Text style={textSize.Md}>{item[0]}</Text>
            <TrackBar progress={levProgress} />
            {item[1] > 1 && <Text style={fonts.subtitle}>{item[1]}</Text>}
          </View>
        )}
      />

      {/**Units*/}
      <Text style={apply(fonts.subtitle, C.mt8, C.mb2, C.textLeft)}>⚙️ Special features </Text>
      <FlatList
        /*numColumns={6}*/
        horizontal
        data={tools}
        keyExtractor={(item) => item[0]}
        renderItem={({item}) => (
          <View style={[C.m4, C.shadowMd, shadow(colors.blue)]}>
            <Text style={textSize.Sm}>{item}</Text>
            {/*<TrackBar progress={levProgress} />
            {item[1] > 1 && <Text style={fonts.subtitle}>{item[1]}</Text>}*/}
          </View>
        )}
      />

      {/**Header*/}
      {/*<Text style={apply(C.font10, C.my6, C.selfCenter)}>🅿️L🅰️NE™️🌏Jℹ️</Text>*/}
      {/*<Text style={apply(C.font5, C.mt4, C.mb_2, C.selfCenter)}>🅿🅻🅰🅽🅴🆃</Text>
      <Text style={apply(C.font7, C.m2, C.selfCenter)}>️🅼🌏🅹🅸️</Text>*/}
      {/*<AddEmojiModal category={Categories.flag} onSet={(emoji) => profile.setFlag(emoji)} modal={profile.flagModal} />
      <AddEmojiModal category={Categories.flag} onSet={(emoji) => profile.setMoji(emoji)} modal={profile.eMojiModal} />
   */}
    </ScrollView>
  );
});

export const ProfileRow = ({icon, value, text, border = colors.sand, triangDown = false, triangUp = false}) => {
  return (
    <View
      style={apply(
        C.row,
        C.bgWhite,
        C.border1,
        bordColor(border),
        C.flex,
        C.mx2,
        C.p1,
        C.itemsCenter,
        C.justifyBetween,
        C.radius2,
      )}>
      <Text style={apply(C.font8, C.selfCenter)}>{icon}</Text>
      <Text style={apply(fonts.subtitle, C.selfCenter)}>{text}</Text>
      <Text style={apply(fonts.body1, C.selfCenter)}>{value}</Text>
      {/*{triangDown && <Icon name="caret-down" size={30} color={border} style={apply(C.absolute, C.top9, C.leftHalf)} />}
      {triangUp && <Icon name="caret-up" size={30} color={border} style={apply(C.absolute, C.top_6, C.leftHalf)} />}*/}
      {/*<Text style={apply(fonts.body1)}>{profile.username}</Text>*/}
    </View>
  );
};
