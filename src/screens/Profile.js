import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
/*import {Categories} from 'react-native-emoji-selector';*/
/*import Icon from 'react-native-vector-icons/FontAwesome';*/
import Box, {ResourcesMap} from '../comp/Box';
import ProgressBar from '../comp/ProgressBar';
import {bordColor, colors, fonts} from '../gStyles';
import {profile} from '../stores/profileStore';
import {levels} from '../stores/sets';

export default observer(() => {
  return (
    <SafeAreaView style={apply(C.bgWhite, C.py16, C.flex)}>
      {/**Emoji setter*/}
      <TouchableOpacity
        onPress={() => profile.eMojiModal.showModal()}
        style={apply(C.font18, C.selfCenter, C.w24, C.h24, bordColor(colors.blue, 3), C.itemsCenter, C.radius20)}>
        <Text style={apply(C.font18)}>{profile.emoji}</Text>
        {/**Flag*/}
        <TouchableOpacity
          onPress={() => profile.flagModal.showModal()}
          style={apply(C.selfCenter, C.bgWhite, bordColor(colors.sand, 3), C.radius6, C.absolute, C.top13, C.left16)}>
          <Text style={apply(C.font9)}>{profile.flag}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <Text style={apply(fonts.title1, C.my2, C.selfCenter)}>{profile.username}</Text>
      {/**Level*/}
      <View style={apply(C.row, C.m1, C.itemsCenter)}>
        <Box icon={'🧩️'} text={profile.level} value={'/ 10'} border={false} />
        <View>
          <ProgressBar
            progress={profile.level * 10}
            style={apply(C.p4)}
            height={40}
            noFlex={'75%'}
            trackColor={colors.white}
            backgroundColor={colors.paleGreyThree}
          />
          <View style={apply(C.row, C.absolute)}>
            {levels.map((item, index) => (
              <Text style={apply(C.font8, C.flex)}>{item}</Text>
            ))}
          </View>
        </View>
      </View>
      {/**Score*/}
      <View style={apply(C.row, C.my3, C.selfCenter)}>
        {/*<Box icon={setIcon('🪙')} border={false} />*/}
        {/*<View>*/}
        <ProgressBar
          progress={(profile.score / Math.pow(10, profile.level)) * 100}
          trackColor={colors.paleGrey}
          noFlex={'92%'}
          height={28}
          backgroundColor={colors.water}
        />
        <View style={apply(C.row, C.absolute, C.left_2)}>
          <Box
            icon={'⭐️'}
            text={profile.scoreForm}
            bg={false}
            value={'/ ' + profile.remainingScoreForm}
            border={false}
          />
        </View>
        {/*<View style={apply(C.row, C.m1, C.absolute)}>
            {_.range(10).map((item, index) => (
              <Text style={apply(C.font6, C.flex)}>⭐️</Text>
            ))}
          </View>*/}
        {/*</View>*/}
      </View>
      {/**Resoruces*/}
      <Text style={apply(fonts.subtitle, C.mt8, C.mb2, C.textLeft)}>Resources: </Text>
      <ResourcesMap />
      {/*<Text style={apply(fonts.subtitle, C.mt8, C.mb2, C.textLeft)}>Resources: </Text>
      <View style={apply(C.row, C.mb8)}>
        {profile.resources.map(({value, icon}) => (
          <ProfileRow icon={icon} value={value} />
        ))}
      </View>*/}
      {/**Header*/}
      {/*<Text style={apply(C.font10, C.my6, C.selfCenter)}>🅿️L🅰️NE™️🌏Jℹ️</Text>*/}
      {/*<Text style={apply(C.font5, C.mt4, C.mb_2, C.selfCenter)}>🅿🅻🅰🅽🅴🆃</Text>
      <Text style={apply(C.font7, C.m2, C.selfCenter)}>️🅼🌏🅹🅸️</Text>*/}
      {/* <AddEmojiModal category={Categories.flag} onSet={(emoji) => profile.setFlag(emoji)} modal={profile.flagModal} />
      <AddEmojiModal category={Categories.flag} onSet={(emoji) => profile.setMoji(emoji)} modal={profile.eMojiModal} />
   */}
    </SafeAreaView>
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
