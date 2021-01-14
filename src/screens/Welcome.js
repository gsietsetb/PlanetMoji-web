import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
/*import {Categories} from 'react-native-emoji-selector';*/
import {bordColor, colors, fonts} from '../gStyles';
import {profile} from '../stores/profileStore';

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
    </SafeAreaView>
  );
});
