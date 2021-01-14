import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {FlatList, Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
/*import FastImage from 'react-native-fast-image';*/
import AddCard from '../comp/AddCard';
import AddEmojiModal from '../comp/AddEmojiModal';
import {ImgIcon, ResourcesMap, StatsMap} from '../comp/Box';
import {
  badgeWrapper,
  bgColor,
  bordColor,
  cell,
  colors,
  deviceHeight,
  imgs,
  isTabl,
  minH100,
  textSize,
} from '../gStyles';
import {screens} from '../routes';
import {profile} from '../stores/profileStore';
import {buildingsMap} from '../stores/sets';

export default observer(() => {
  const currentBoard = profile.boards.villageMap;
  const {navigate} = useNavigation();
  return (
    <SafeAreaView style={apply(C.py8, C.flex, C.bgWater)}>
      {currentBoard && (
        <FlatList
          data={currentBoard.cells}
          style={apply(C.radius2, C.bgWater, C.top_12, minH100(1.2))}
          numColumns={isTabl ? 26 : 7}
          extraData={currentBoard.currCellId}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={
                () =>
                  item.isPressable
                    ? currentBoard.setCurrent(item.id)
                    : item.availResources && navigate(screens.HARVEST.name) //Alert.alert('⚠️ Restricted area', 'Please choose another placement')
              }>
              <Image
                source={imgs.grass}
                opacity={item.isPressable ? 0.8 : 0.75}
                resizeMode={'center'}
                style={apply(
                  cell.XL,
                  bgColor(colors.water),
                  currentBoard.currCellId === index && bordColor(colors.water, 2),
                )}>
                {!profile.isTablet && <ImgIcon icon={item.icon} />}
                {/**Badge*/}
                {item.availResources && (
                  <View style={badgeWrapper}>
                    <Text style={apply(textSize.Xs)}>{item.availResources}</Text>
                  </View>
                )}
              </Image>
            </TouchableOpacity>
          )}
        />
      )}

      {/**Resources*/}
      <View style={apply(C.absolute, C.mt8, C.itemsCenter, C.left3)}>
        <StatsMap profile={profile} showPopulation />
        <ResourcesMap resources={profile.resources} />
        {/*<Text
          onPress={() => {
            currentBoard.setCellIcon('🥷🏻', true);
          }}>
          Button press me {currentBoard.currentCell} {JSON.stringify(currentBoard.cells[currentBoard.currentCell])}
        </Text>*/}
        <FlatList
          data={Object.keys(buildingsMap)}
          style={apply(C.top4, C.flex, {top: deviceHeight * 0.55})}
          keyExtractor={(item) => item.key}
          horizontal
          extraData={profile.level}
          renderItem={({item, index}) => (
            <AddCard list={buildingsMap} index={index} item={item} onSet={() => profile.buyBuilding(item)} />
          )}
        />
        <AddEmojiModal />
      </View>
    </SafeAreaView>
  );
});
