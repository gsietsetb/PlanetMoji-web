import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {profile} from '../App';
/*import FastImage from 'react-native-fast-image';*/
import AddCard from '../comp/AddCard';
import {ResourcesMap, StatsMap} from '../comp/Box';
import Cell from '../comp/Cell';
import {SpinIcon} from '../comp/ProgressBar';
import {bordColor, cell, colors, fonts, imgs, isIOS, isTabl, isWeb, shadow, textSize} from '../gStyles';
import {CHESS_SIZE} from '../stores/boardStore';
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

export default observer(() => {
  const currentBoard = profile.boards.battleMap;
  const [myTurn, setMyTurn] = useState(true);
  const [attack, setAttack] = useState(false);
  /*const nUnits = Object.keys(profile.units).length;*/

  useEffect(() => {
    if (!currentBoard.cells[0].icon) {
      profile.addEnemies();
    }
  }, []);

  const enemyAttack = () => {
    setTimeout(() => {
      let couldMove = false;
      let i = 100;
      do {
        couldMove = currentBoard.randomMove();
        i--;
      } while (!couldMove && i > 0);
      setMyTurn(true);
    }, 1500);
  };

  return (
    <SafeAreaView style={!isTabl && !isIOS && C.py10} contentContainerStyle={C.itemsCenter}>
      {/**Resources*/}
      <StatsMap profile={profile} showPopulation />
      <ResourcesMap resources={profile.resources} />
      {/*<Text>
        {currentBoard.currCellId} {attackMode.toString()}
      </Text>*/}
      <View style={apply(isTabl && C.row, C.itemsCenter, C.justifyBetween)}>
        {/**Chess board*/}
        {currentBoard && (
          <FlatList
            data={currentBoard.cells}
            style={apply(C.radius2, !isTabl ? C.mt6 : C.mt_16)}
            numColumns={CHESS_SIZE}
            contentContainerStyle={apply(C.radius2)}
            extraData={currentBoard.currCellId}
            scrollEnabled={false}
            renderItem={({item, index}) => {
              const availMove =
                myTurn &&
                currentBoard.isCurrUnit &&
                !item.icon &&
                !currentBoard.isCurrEvil &&
                currentBoard.adjacentDiagIds.includes(index);

              const availAttack =
                myTurn &&
                currentBoard.isCurrUnit &&
                item.isEvil &&
                /*!item.icon &&*/
                !currentBoard.isCurrEvil &&
                currentBoard.adjacentDiagIds.includes(index);
              const isSel = currentBoard.currCellId === index;
              const highlightColor = availMove
                ? colors.grass
                : item.unit
                ? item.isEvil
                  ? colors.salmon /*+ '90'*/
                  : colors.blue /*+ '90'*/
                : 'transparent';

              return (
                <Cell
                  img={isIOS ? imgs.grass : imgs.grassCut}
                  opacity={isWeb ? 0.7 : 0.84}
                  size={isWeb ? cell.Md : cell.Sm}
                  bg={highlightColor}
                  index={index}
                  wrapStyle={[
                    (availMove || availAttack) && bordColor(availMove ? colors.grass : colors.salmon, isSel ? 3 : 1),
                    C.flex,
                    item.unit && C.radius2,
                  ]}
                  onPress={() => {
                    if (availMove) {
                      currentBoard.moveToCell(index);
                      setMyTurn(false);
                      currentBoard.setCurrent(index);
                      enemyAttack();
                    } else if (availAttack) {
                      setAttack({evil: item.unit, own: currentBoard.currCell.unit});
                    } else {
                      currentBoard.setCurrent(index);
                    }
                  }}
                  currCellId={currentBoard.currCellId}
                  item={item}
                />
              );
            }}
          />
        )}

        {myTurn ? (
          attack ? (
            <View
              style={[C.row, C.m4, C.itemsCenter, /*bordColor(colors.wood, 2), C.radius2,*/ C.p2, C.justifyBetween]}>
              <AddCard item={attack.own.icon} own border={colors.salmon} currLife={45} />
              <View style={[C.itemsCenter, C.contentCenter]}>
                <View style={[C.row, C.itemsCenter]}>
                  {/*<Text style={C.mx4}>◀️</Text>*/}
                  <Text style={[fonts.title1]}> Fight!</Text>
                  {/*<Text>▶️</Text>*/}
                </View>
                <View style={C.row}>
                  <SpinIcon textStyle={[textSize.L, shadow(colors.salmon, 7), C.p4]} />
                  <Text style={textSize.L}>🤼‍</Text>
                  <SpinIcon textStyle={[textSize.L, shadow(colors.blue, 4), C.m4]} />
                </View>
              </View>
              <AddCard item={attack.evil.icon} own currLife={34} />
            </View>
          ) : (
            <>
              {/*<Tag col={colors.blue} text={'💰 Buy units, then ⚡️ Move & ⚔️ Attack '} />*/}
              <Text style={[fonts.subtitle, C.textBlue, C.my4]}>💰 Buy units, then ⚡️ Move & ⚔️ Attack </Text>
              <FlatList
                data={Object.keys(unitsMap)}
                style={apply(C.p2, C.mb12)}
                keyExtractor={(item) => item.key}
                horizontal={!isTabl}
                numColumns={isTabl ? 2 : 1}
                extraData={profile.score}
                renderItem={({item, index}) => (
                  <AddCard index={index} item={item} onSet={() => profile.buyUnit(item)} />
                )}
              />
            </>
          )
        ) : (
          <Text style={[fonts.subtitle, C.textSalmon, C.my4]}>⏳ Your oponent is 🤔 thinking...</Text>
        )}

        {/**Switch button*/}
        {/*<View style={apply(isTabl ? C.left_16 : C.top_16, nUnits === 0 && C.opacity30, C.flex)}>
          <TouchableOpacity
            onPress={() => nUnits > 0 && setAttackMode(!attackMode)}
            style={apply(C.radius2, C.p2, C.m4, shadow(colors.blue, 9), bordColor(colors.blue, 2))}>
            <Text style={apply(C.m2, textSize.Sm)}>{battleModes[attackMode ? 0 : 1].title}</Text>
          </TouchableOpacity>
          <Warriors />
        </View>*/}
      </View>
    </SafeAreaView>
  );
});
