import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {FlatList, ImageBackground, SafeAreaView, View} from 'react-native';
import {profile} from '../App';
import {ResourcesMap, StatsMap} from '../comp/Box';
import Cell from '../comp/Cell';
import {absCenter, cell, deviceHeight, imgs, isBig, isIOS, isWeb, minH100, textSize} from '../gStyles';
import {nav, screens} from '../routes';
import {xCells} from '../stores/boardStore';
import {CollapsableCards} from './World';

export default observer(() => {
  const currentBoard = profile.boards.villageMap;
  const useNav = !isWeb && useNavigation();
  return (
    <SafeAreaView style={apply(/*C.py8, */ C.flex, C.hFull, C.bgWater)}>
      {currentBoard && (
        <ImageBackground
          imageStyle={{resizeMode: 'cover'}}
          source={imgs.cat}
          style={apply(isIOS && C.top_12, C.wFull, {height: deviceHeight * 0.94})}>
          <FlatList
            data={currentBoard.cells}
            style={apply(C.radius2, isIOS && C.top_12, !isWeb && minH100(1.2))}
            numColumns={xCells()}
            scrollEnabled={false}
            extraData={currentBoard.currCellId}
            renderItem={({item, index}) => (
              <Cell
                img={isIOS ? imgs.grass : imgs.grassCut}
                size={cell.L}
                opacity={0.7}
                showRes
                iconSize={isBig ? textSize.XL : textSize.L}
                index={index}
                onPress={() => {
                  currentBoard.setCurrent(item.id);
                  item.availResources && nav(screens.Fruit.name, useNav);
                }}
                currCellId={currentBoard.currCellId}
                item={item}
              />
            )}
          />
        </ImageBackground>
      )}

      {/**Resources*/}
      <View style={absCenter}>
        <StatsMap currProfile={profile} showPopulation />
        <ResourcesMap resources={profile.resources} />
        <CollapsableCards onPress={(item) => profile.buyBuilding(item, currentBoard)} />
        {/*<FlatList
          data={Object.keys(buildingsMap)}
          style={apply(C.absolute, isWeb ? [C.left10, C.top10] : {top: deviceHeight * 0.68})}
          keyExtractor={(item) => item.key}
          horizontal={!isWeb}
          numColumns={isWeb ? 2 : 1}
          extraData={profile.level}
          renderItem={({item, index}) => (
            <AddCard
              list={buildingsMap}
              index={index}
              item={item}
              onSet={() => profile.buyBuilding(item, profile.boards.villageMap)}
            />
          )}
        />*/}
        {/*<AddEmojiModal />*/}
      </View>
    </SafeAreaView>
  );
});
