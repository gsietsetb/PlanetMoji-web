import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {FlatList, ImageBackground, SafeAreaView, View} from 'react-native';
import {profile} from '../App';
import AddCard from '../comp/AddCard';
import {ResourcesMap, StatsMap} from '../comp/Box';
import Cell from '../comp/Cell';
import {absCenter, cell, deviceHeight, deviceWidth, imgs, isIOS, isWeb, minH100, textSize} from '../gStyles';
import {nav, screens} from '../routes';
import {buildingsMap} from '../stores/sets';

const america = 'https://fvmstatic.s3.amazonaws.com/maps/m/WRLD-SA-01-0002.png';
const cat =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Mapa_provincial_de_Catalunya.svg/816px-Mapa_provincial_de_Catalunya.svg.png';
export default observer(() => {
  const currentBoard = profile.boards.villageMap;
  const useNav = !isWeb && useNavigation();
  const columns = Math.ceil(deviceWidth / (13 * 4));
  return (
    <SafeAreaView style={apply(C.py8, C.flex, C.bgWater)}>
      {currentBoard && (
        <ImageBackground
          imageStyle={{resizeMode: 'cover'}}
          source={{uri: cat}}
          style={apply(C.top_12, C.wFull, {width: deviceWidth, height: deviceHeight})}>
          <FlatList
            data={currentBoard.cells}
            style={apply(C.radius2, C.top_12, !isWeb && minH100(1.2))}
            numColumns={columns} ///*isWeb ? columns - 1 :*/ xCells(isWeb ? 24 : 16)}
            scrollEnabled={false}
            /* withFlex*/
            extraData={currentBoard.currCellId}
            renderItem={({item, index}) => (
              <Cell
                img={isIOS ? imgs.grass : imgs.grassCut}
                size={cell.L}
                opacity={0.7}
                iconSize={textSize.L}
                index={index}
                onPress={() => {
                  currentBoard.setCurrent(item.id);
                  !item.availResources && nav(screens.Tools.name, useNav);
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
        <StatsMap profile={profile} showPopulation />
        <ResourcesMap resources={profile.resources} />
        <FlatList
          data={Object.keys(buildingsMap)}
          style={apply(C.top4, C.flex, {top: deviceHeight * 0.55})}
          keyExtractor={(item) => item.key}
          horizontal
          extraData={profile.level}
          renderItem={({item, index}) => (
            <AddCard
              list={buildingsMap}
              index={index}
              item={item}
              onSet={() => profile.buyBuilding(item, profile.boards.villageMap)}
            />
          )}
        />
        {/*<AddEmojiModal />*/}
      </View>
    </SafeAreaView>
  );
});
