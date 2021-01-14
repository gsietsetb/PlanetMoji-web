import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import AddCard from '../comp/AddCard';
import AddEmojiModal from '../comp/AddEmojiModal';
import {ResourcesMap, StatsMap} from '../comp/Box';
import {badgeWrapper, bordColor, cell, colors, deviceHeight, isTabl, minH100, shadow, textSize} from '../gStyles';
import {screens} from '../routes';
import {profile} from '../stores/profileStore';
import {buildingsMap} from '../stores/sets';

export default observer(() => {
  const currentBoard = profile.boards.worldMap;
  const {navigate} = useNavigation();

  /*useEffect(() => {
    currentBoard.shuffle(true);
  }, []);*/
  return (
    <SafeAreaView style={apply(C.py8, C.flex, C.bgWater)}>
      {currentBoard && (
        <FlatList
          data={currentBoard.cells}
          style={apply(C.radius2, C.bgWater, C.top_12, minH100(1.2))}
          numColumns={isTabl ? 26 : 8}
          extraData={currentBoard.currCellId}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.2}
              style={apply(
                cell.Md,
                /*bgColor(colors.water),*/
                currentBoard.currCellId === index && bordColor(colors.water, 2),
              )}
              onPress={
                () =>
                  item.isPressable
                    ? currentBoard.setCurrent(item.id)
                    : item.availResources && navigate(screens.FRUIT.name) //Alert.alert('⚠️ Restricted area', 'Please choose another placement')
              }>
              {/*<FastImage
                source={imgs.grass}
                opacity={item.isPressable ? 0.8 : 0.75}
                resizeMode={'center'}
                style={apply(
                  cell.Md,
                  bgColor(colors.water),
                  currentBoard.currCellId === index && bordColor(colors.water, 2),
                )}>*/}
              {!profile.isTablet && <Text style={textSize.L}>{item.icon}</Text>}
              {/**Badge*/}
              {item.availResources && (
                <View style={badgeWrapper}>
                  <Text style={apply(textSize.Xs, shadow(colors.sand, 5))}>{item.availResources}</Text>
                </View>
              )}
              {/*</FastImage>*/}
            </TouchableOpacity>
          )}
        />
      )}

      {/**Resources*/}
      <View style={apply(C.absolute, C.mt8, C.itemsCenter, C.left3)}>
        <StatsMap profile={profile} />
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
