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

export default observer(() => {
  const currentBoard = profile.boards.battleMap;
  const [myTurn, setMyTurn] = useState(true);
  const [attack, setAttack] = useState(false);
  const [moveMode, setMoveMode] = useState(false);

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
      /**Defaults the move*/
      currentBoard.setCurrent();
    }, 1500);
  };

  return (
    <SafeAreaView style={!isTabl && !isIOS && C.py10} contentContainerStyle={C.itemsCenter}>
      {/**Resources*/}
      <StatsMap currProfile={profile} showPopulation />
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
            /*contentContainerStyle={apply(C.radius2)}*/
            extraData={currentBoard.currCellId}
            scrollEnabled={false}
            renderItem={({item, index}) => {
              const availMove =
                moveMode &&
                !attack &&
                myTurn &&
                currentBoard.isCurrUnit &&
                !item.icon &&
                !currentBoard.isCurrEvil &&
                currentBoard.adjacentDiagIds.includes(index);

              const availAttack =
                moveMode &&
                !attack &&
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
                  ? colors.enemy /*'red'*/ /*colors.enemy*/
                  : colors.water /*+ '90'*/
                : 'transparent';

              return (
                <Cell
                  img={isIOS ? imgs.grass : imgs.grassCut}
                  opacity={isWeb ? 0.68 : 0.84}
                  iconOpacity={availMove && 0.4}
                  availAttack={availAttack && '⚔️'}
                  size={isWeb ? cell.Md : cell.Sm}
                  iconSize={isWeb ? textSize.L : textSize.L}
                  cShadow={shadow(highlightColor, 8)}
                  bg={availMove ? colors.grass : 'transparent' /*: availAttack && 'red'*/}
                  cBord={bordColor(
                    isSel ? colors.water : availMove ? colors.grass : availAttack ? colors.enemy : 'transparent',
                    availAttack ? 1 : item.unit ? 0 : isSel ? 3 : 2,
                  )}
                  index={index}
                  icon={availMove && currentBoard.currCell.icon}
                  wrapStyle={C.radius2}
                  onPress={() => {
                    if (availMove) {
                      /**Move*/
                      currentBoard.moveToCell(index);
                      setMyTurn(false);
                      currentBoard.setCurrent(index);
                      setAttack(false);
                      enemyAttack();
                    } else if (isSel) {
                      setMoveMode(!moveMode);
                    } else if (availAttack) {
                      setAttack({evil: item.unit, own: currentBoard.currCell.unit});
                    } else {
                      currentBoard.setCurrent(index);
                      setMoveMode(false);
                      setAttack(false);
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
              {/**Own unit*/}
              <AddCard item={attack.evil.icon} own isFight border={colors.enemy} currLife={12} />
              <View style={[C.itemsCenter, C.contentCenter]}>
                <View style={[C.row]}>
                  {/*<Text style={C.mx4}>◀️</Text>*/}
                  {/*<Text>▶️</Text>*/}
                </View>
                <View style={[C.row, C.itemsCenter]}>
                  <SpinIcon textStyle={[textSize.L, shadow(colors.salmon, 7), C.p4]} />
                  {/*<Text style={[textSize.L, C.absolute, C.right12, C.top_16]}>🆚</Text>*/}
                  <Text style={[textSize.L, C.absolute, C.left11, C.top_4]}>🤼‍</Text>
                  {/**Evil*/}
                  <SpinIcon textStyle={[textSize.L, shadow(colors.blue, 7), C.m2]} />
                </View>
              </View>
              <AddCard item={attack.own.icon} border={colors.blue} own currLife={6} />
            </View>
          ) : (
            <>
              {/*<Tag col={colors.blue} text={'💰 Buy units, then ⚡️ Move , ⚔️ Attack '} />*/}
              {/*<Text style={[fonts.subtitle, C.textBlue, C.my4]}>💰 Buy units, then ⚡️ Move, ⚔️ Attack </Text>*/}
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
