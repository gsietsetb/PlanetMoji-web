import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
/*import FastImage from 'react-native-fast-image';*/
import AddCard from '../comp/AddCard';
import {ResourcesMap, StatsMap} from '../comp/Box';
import {bgColor, bordColor, cell, colors, deviceHeight, imgs, iOS, isTabl, shadow, textSize} from '../gStyles';
import {profile} from '../stores/profileStore';
import {unitsMap} from '../stores/sets';

/*const Warriors = ({units = Object.entries(profile.units)}) =>
  units.map(([key, value]) => (
    <View style={apply(C.itemsCenter, isTabl && C.row, C.selfStart, C.py4, C.maxw12)}>
      <Text style={C.font9}>🎲</Text>
      {value >= 3 ? (
        <Text style={apply(C.font12)}>{key}</Text>
      ) : (
        _.range(value).map((item) => <Text style={apply(C.font12)}>{key}</Text>)
      )}
      <ProgressBar backgroundColor={colors.grass} progress={Math.random() * 100} noFlex={'80%'} height={12} />
      {value >= 3 && <Text style={apply(C.font4)}>x{value}</Text>}
    </View>
  ));*/

/*const Graveyard = () =>
  Object.keys(profile.units).map((item) => (
    <Text style={C.font9}>
      {item} x{profile.units[item]}
    </Text>
  ));*/

const Recruit = () => (
  <FlatList
    data={Object.keys(unitsMap)}
    style={apply(C.p2, C.mb12 /*C.flex, isTabl ? C.top_16 : C.pb_6*/)}
    keyExtractor={(item) => item.key}
    horizontal={!isTabl}
    numColumns={isTabl && 2}
    extraData={profile.level}
    renderItem={({item, index}) => <AddCard index={index} item={item} onSet={() => profile.buyUnit(item)} />}
  />
);

/*const battleModes = {
  RECRUIT: {title: '🤺 Recruit', Comp: Recruit, id: 0},
  ATTACK: {title: '⚔️ Attack', Comp: Warriors, id: 1},
  GRAVEYARD: {title: '🪦 Graveyard', Comp: Warriors, id: 2},
};*/
/*
const battleModes = [
  {title: '🤺 Recruit', Comp: Recruit, id: 0},
  {title: '⚔️ Attack 🎲', Comp: Warriors, id: 1},
  /!*{title: '🪦 Graveyard', Comp: Warriors, id: 2},*!/
];
*/

export default observer(() => {
  const currentBoard = profile.boards.battleMap;

  const [attackMode, setAttackMode] = useState(false);
  /*const nUnits = Object.keys(profile.units).length;*/

  useEffect(() => {
    if (!currentBoard.cells[0].icon) {
      profile.addEnemies();
    }
  }, [currentBoard.cells]);

  return (
    <SafeAreaView style={!isTabl && !iOS && C.py10} contentContainerStyle={C.itemsCenter}>
      {/**Resources*/}
      <StatsMap profile={profile} showPopulation />
      <ResourcesMap resources={profile.resources} />
      {/*<Text>
        {currentBoard.currCellId} {attackMode.toString()}
      </Text>*/}
      <TouchableOpacity
        onPress={() => currentBoard.setCurrent(null)}
        style={apply(isTabl && C.row, C.itemsCenter, {minHeight: deviceHeight * 0.8})}>
        {/**Chess board*/}
        {currentBoard && (
          <FlatList
            data={currentBoard.cells}
            style={apply(C.radius2, !isTabl ? C.mt6 : C.mt_16)}
            numColumns={8}
            contentContainerStyle={apply(C.radius2)}
            extraData={currentBoard.currCellId}
            scrollEnabled={false}
            renderItem={({item, index}) => {
              const optMove =
                attackMode &&
                currentBoard.isCurrWarrior &&
                !item.icon &&
                !currentBoard.isCurrEvil &&
                currentBoard.adjacentDiagIds.includes(index);
              const isSel = currentBoard.currCellId === index;
              const highlightColor = optMove ? colors.water : item.bgColor;
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      /**Pressing twice allows to move*/
                      if (index === currentBoard.currCellId) {
                        setAttackMode(true);
                      }
                      if (optMove) {
                        currentBoard.moveToCell(index, undefined, false);
                        setAttackMode(!attackMode);
                        let couldMove = false;
                        let i = 100;
                        do {
                          couldMove = currentBoard.randomMove();
                          i--;
                        } while (!couldMove && i > 0);
                      } else {
                        currentBoard.setCurrent(index);
                      }
                    }}>
                    <ImageBackground
                      source={imgs.grass}
                      opacity={0.6} //index > 47 ? 0.75 : item.isPressable ? 0.65 : 0.85}
                      resizeMode={'center'}
                      style={apply(
                        cell.L,
                        C.itemsCenter,
                        C.justifyCenter,
                        bgColor(highlightColor),
                        bordColor(isSel ? colors.blue : colors.grass, optMove ? 1 : 0),
                        /*shadow(isEvil ? 'red' /!*colors.salmon*!/ : colors.water, item.isUnit ? 0 : 18),*/
                        isSel && C.radius2,
                      )}>
                      {/* <Text style={[font.Xs, C.absolute, C.left1, C.bottom0]}>{index}</Text>*/}
                      <Text
                        style={apply(
                          textSize.L,
                          optMove && C.opacity40,
                          shadow(item.isEvil ? colors.salmon : colors.blue, 6),
                        )}>
                        {optMove ? currentBoard.currCell.icon : item.icon} {/*{item.isUnit.toString()}*/}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}

        <FlatList
          data={Object.keys(unitsMap)}
          style={apply(C.p2, C.mb12 /*C.flex, isTabl ? C.top_16 : C.pb_6*/)}
          keyExtractor={(item) => item.key}
          horizontal={!isTabl}
          numColumns={isTabl && 2}
          extraData={profile.score}
          renderItem={({item, index}) => <AddCard index={index} item={item} onSet={() => profile.buyUnit(item)} />}
        />
        {/**Switch button*/}
        {/*<View style={apply(isTabl ? C.left_16 : C.top_16, nUnits === 0 && C.opacity30, C.flex)}>
          <TouchableOpacity
            onPress={() => nUnits > 0 && setAttackMode(!attackMode)}
            style={apply(C.radius2, C.p2, C.m4, shadow(colors.blue, 9), bordColor(colors.blue, 2))}>
            <Text style={apply(C.m2, textSize.Sm)}>{battleModes[attackMode ? 0 : 1].title}</Text>
          </TouchableOpacity>
          <Warriors />
        </View>*/}
      </TouchableOpacity>
    </SafeAreaView>
  );
});
