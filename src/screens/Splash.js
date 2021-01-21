import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {Spinner} from '../comp/Box';
import {screens} from '../routes';
/*import {Categories} from 'react-native-emoji-selector';*/

/*
export const profile = ProfileStore();
*/

export default observer(() => {
  const {navigate} = useNavigation();
  useEffect(() => {
    profile.initBoards();
    navigate(screens.Planet.name);
  }, []);
  return (
    <SafeAreaView style={apply(C.bgWhite, C.itemsCenter, C.justifyCenter, C.hFull)}>
      <Spinner size={[C.font32]} speed={200} />
      <Text>{profile.initComplete.toString()}</Text>
    </SafeAreaView>
  );
});
