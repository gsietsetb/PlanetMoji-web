/*
import {useNavigation} from '@react-navigation/core';
*/
import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, SafeAreaView, Text, View} from 'react-native';
import {profile} from '../App';
import AddCard from '../comp/AddCard';
import {ResourcesMap, StatsMap} from '../comp/Box';
import Cell from '../comp/Cell';
import {absCenter, cell, colors, deviceHeight, deviceWidth, imgs, isIOS, isSmall, isWeb, textSize} from '../gStyles';
import {buildingsMap} from '../stores/sets';

export default observer(() => {
  const currentBoard = profile.boards.worldMap;
  const useNav = !isWeb && useNavigation();
  const [showRecruit, setShowRecruit] = useState(false);

  useEffect(() => {
    /*currentBoard.shuffle(true);*/
    currentBoard.setCell({building: '🛖', isEvil: true, id: 96});
    /**Set Water*/
    /*getAdjacentsIds(76).map((item) => currentBoard.setCell({overwrite: false, terrain: terrains['🌊'], icon: '🌊'}));*/
  }, [currentBoard]);
  return (
    <SafeAreaView style={apply(C.flex, C.bgWater)}>
      {currentBoard && (
        <ImageBackground
          imageStyle={{resizeMode: 'cover'}}
          source={
            isWeb
              ? {
                  uri: 'https://www.pngkey.com/png/full/205-2054388_792px-blank-map-europe-no-borders-europe-map.png',
                }
              : imgs.europeWest
          }
          style={apply(isIOS && C.top_12, C.wFull, {width: deviceWidth, height: deviceHeight})}>
          <FlatList
            data={currentBoard.cells}
            style={apply(C.radius2, isIOS && C.top_12 /*!isWeb && minH100(1.2)*/)}
            numColumns={Math.ceil(deviceWidth / (13 * 4))}
            scrollEnabled={false}
            extraData={currentBoard.currCellId}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) => (
              <Cell /*img={isWeb ? imgs.grassText : imgs.grass}*/ /*bg={item.bg}*/ ///*index % 5 === 0 ?*/ item.icon ? colors.groundSand : colors.sand} //item.boardMap.terrain.bg}
                opacity={isIOS ? 0.7 : 0.6} //!isWeb && europeAllow.includes(index) ? 0.75 : 0.6}
                bg={isIOS ? colors.water : colors.groundSand}
                img={isIOS ? imgs.grass : imgs.grassCut}
                index={index}
                showFlag
                onPress={() => {
                  currentBoard.setCurrent(index);
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
        {/*<Spinner />*/}
        {showRecruit && (
          <FlatList
            data={Object.keys(buildingsMap)}
            style={apply(C.top4, C.flex, {top: deviceHeight * (isSmall ? 0.4 : 0.45)})}
            keyExtractor={(item) => item.key}
            horizontal
            extraData={profile.level}
            renderItem={({item, index}) => (
              <AddCard
                list={buildingsMap}
                index={index}
                item={item}
                onSet={() => {
                  profile.buyBuilding(item);
                  setShowRecruit(false);
                }}
              />
            )}
          />
        )}
        <View
          style={[
            C.bgWhite,
            cell.L,
            C.itemsCenter,
            C.justifyCenter,
            C.radius8,
            C.absolute,
            C.right4,
            {top: deviceHeight * (isSmall ? 0.4 : 0.8)},
          ]}>
          <Text style={[textSize.L]} onPress={() => setShowRecruit(!showRecruit)}>
            🛠️
          </Text>
        </View>
      </View>

      {/*<AddEmojiModal />*/}
    </SafeAreaView>
  );
});
