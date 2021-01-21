/*
import {useNavigation} from '@react-navigation/core';
*/
import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {profile} from '../App';
import AddCard from '../comp/AddCard';
import {Badge, ResourcesMap, StatsMap} from '../comp/Box';
import Cell from '../comp/Cell';
import {
  absCenter,
  cell,
  colors,
  deviceHeight,
  deviceWidth,
  imgs,
  isBig,
  isIOS,
  isSmall,
  isWeb,
  shadow,
  textSize,
} from '../gStyles';
import {nav, screens} from '../routes';
import {xCells} from '../stores/boardStore';
import {buildingsMap} from '../stores/sets';

export default observer(() => {
  const currentBoard = profile.boards.worldMap;
  const useNav = !isWeb && useNavigation();

  useEffect(() => {
    /*currentBoard.shuffle(true);*/
    currentBoard.setCell({buildIcon: '🛖', isEvil: true, id: 105, flag: '🇮🇪'});
    /**Set Water*/
    /*getAdjacentsIds(76).map((item) => currentBoard.setCell({overwrite: false, terrain: terrains['🌊'], icon: '🌊'}));*/
  }, [currentBoard]);
  return (
    <SafeAreaView style={apply(C.flex, C.bgWater)}>
      {currentBoard && (
        <ImageBackground
          imageStyle={{resizeMode: 'cover'}}
          source={isWeb ? imgs.europeWeb : imgs.europeWest}
          style={apply(isIOS && C.top_12, C.wFull, {width: deviceWidth, height: deviceHeight})}>
          <FlatList
            data={currentBoard.cells}
            style={apply(isIOS && C.top_12 /*!isWeb && minH100(1.2)*/)}
            numColumns={xCells()}
            scrollEnabled={false}
            extraData={currentBoard.currCellId}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) => (
              <Cell /*img={isWeb ? imgs.grassText : imgs.grass}*/ /*bg={item.bg}*/ ///*index % 5 === 0 ?*/ item.icon ? colors.groundSand : colors.sand} //item.boardMap.terrain.bg}
                opacity={isWeb ? 0.55 : isIOS ? 0.7 : 0.6} //!isWeb && europeAllow.includes(index) ? 0.75 : 0.6}
                bg={!isWeb && (isIOS ? colors.water : colors.groundSand)}
                img={isIOS ? imgs.grass : imgs.grassCut}
                index={index}
                showFlag
                showRes
                onPress={() => {
                  currentBoard.setCurrent(index);
                  if (currentBoard.cells[index].ourBuilding) {
                    nav(screens.Village.name, useNav);
                  } else if (item.availResources) {
                    nav(screens.Fruit.name, useNav);
                  }

                  /*profile.addMatchEurope(index);
                  /!*res[index] ? (res[index] = false) : (res[index] = true);*!/
                  console.log(
                    'res: ',
                    profile.cleanMatching,
                    /!*res,
                    Object.keys(res).filter((item) => !!item),*!/
                  );*/
                  /*item.availResources && nav(screens.Fruit.name, useNav);*/
                }}
                wrapStyle={C.radius2}
                currCellId={currentBoard.currCellId}
                item={item}
              />
            )}
          />
        </ImageBackground>
      )}

      {/**Resources*/}
      <View style={absCenter}>
        <StatsMap profile={profile} />
        <ResourcesMap resources={profile.resources} />
        <CollapsableCards onPress={(item) => profile.buyBuilding(item)} />
      </View>
    </SafeAreaView>
  );
});

export const CollapsableCards = ({onPress, icon = '🧙‍'}) => {
  const [showRecruit, setShowRecruit] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowRecruit(!showRecruit)}
        style={[
          C.bgWhite,
          isBig ? cell.XL : cell.L,
          C.itemsCenter,
          C.justifyCenter,
          C.radius8,
          C.absolute,
          C.right4,
          {top: deviceHeight * (isSmall ? 0.4 : 0.8)},
        ]}>
        {/**Badge*/}
        <Badge text={'🔨'} top left isBig />
        <Text style={[textSize.XL, shadow(colors.sand, 2), C.top_1]}>{icon}</Text>
      </TouchableOpacity>
      {showRecruit && (
        <FlatList
          data={Object.keys(buildingsMap)}
          style={apply(C.top4, C.flex, {top: deviceHeight * (isSmall ? 0.4 : 0.5)})}
          keyExtractor={(item) => item.key}
          horizontal
          extraData={profile.level}
          renderItem={({item, index}) => (
            <AddCard
              list={buildingsMap}
              index={index}
              item={item}
              onSet={() => {
                onPress(item);
                setShowRecruit(false);
              }}
            />
          )}
        />
      )}
    </>
  );
};
