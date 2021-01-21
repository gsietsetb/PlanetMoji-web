import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import _ from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {useRef, useState} from 'react';
import {Animated, FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {profile} from '../App';
import {Column, ResourcesMap, StatsMap, Tag} from '../comp/Box';
import Cell from '../comp/Cell';
import {TrackBar} from '../comp/ProgressBar';
import {bgColor, bordColor, cell, colors, isBig, isIOS, isTabl, isWeb, shadow, textSize} from '../gStyles';
import {screens} from '../routes';
import {CHESS_SIZE} from '../stores/boardStore';

export const Warriors = ({units = Object.entries(profile.units)}) => (
  <View style={apply(C.row, C.radius2)}>
    {units.map(([key, value]) => (
      <TouchableOpacity style={apply(C.itemsCenter, isTabl && C.row, C.selfStart, C.py4, C.maxw12)}>
        {value >= 3 ? (
          <Text style={apply(C.font12)}>{key}</Text>
        ) : (
          _.range(value).map((item) => <Text style={apply(C.font12)}>{key}</Text>)
        )}
        <TrackBar colAccent={colors.grass} progress={Math.random()} />
        {value >= 3 && <Text style={apply(C.font4)}>x{value}</Text>}
      </TouchableOpacity>
    ))}
  </View>
);
export default observer(() => {
  const currentBoard = profile.boards.recruitMap;
  const [showMatching, setShowMatching] = useState(false);
  const {navigate} = !isWeb && useNavigation();

  const clearCellGroup = (index, icon) => {
    currentBoard.setCurrent(index);
    if (currentBoard.validMatch) {
      blinkBg(() => currentBoard.recruit(icon));
    }
  };

  const blinkBg = (onAfter) => {
    setShowMatching(true);
    setTimeout(() => {
      onAfter();
      setShowMatching(false);
    }, 500);
  };

  /**Drag & Drop*/
  const pan = useRef(new Animated.ValueXY()).current;
  /*const panResponder = useRef(
                      PanResponder.create({
                        onMoveShouldSetPanResponder: (evt, gestureState) => {
                          return gestureState.dx != 0 && gestureState.dy != 0;
                        },
                        onPanResponderGrant: () => {
                          pan.setOffset({
                            x: pan.x._value,
                            y: pan.y._value,
                          });
                        },
                        onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
                        onPanResponderRelease: () => {
                          pan.flattenOffset();
                        },
                      }),
                    ).current;*/

  const gameOver = currentBoard.remMoves < 1 || profile.currPopulation >= profile.maxPopulation;
  const {remShuffles, remBombs} = currentBoard;

  return (
    <SafeAreaView style={apply(C.py8, C.itemsCenter, bgColor(colors.white), C.flex)}>
      {/**Resources*/}
      <StatsMap profile={profile} showPopulation />
      <ResourcesMap resources={profile.resources} withBord={false} />

      {currentBoard && (
        <FlatList
          data={currentBoard.cells}
          numColumns={CHESS_SIZE}
          style={apply(C.my6, gameOver && C.opacity25)}
          extraData={currentBoard.cells}
          scrollEnabled={false}
          renderItem={({item, index}) => (
            <Cell
              size={cell.L}
              iconSize={isBig ? textSize.XL : textSize.L}
              bg={colors.white}
              wrapStyle={[
                bordColor(colors.water, isIOS ? 0.5 : 1),
                isWeb ? C.m1 : C.px1,
                {margin: 2},
                C.radius3,
                !isIOS && showMatching && currentBoard.shouldHighlight(index) && bgColor(colors.water + '40'),
                shadow(
                  currentBoard.cells
                    .filter(({icon}) => icon === '🧟')
                    .map(({id}) => id)
                    .includes(index)
                    ? 'red'
                    : colors.blue,
                  showMatching && currentBoard.shouldHighlight(index) ? 14 : 5,
                ),
              ]}
              index={index}
              onPress={() => !gameOver && clearCellGroup(index, item.icon)}
              item={item}
            />
            /* <Animated.View style={apply(gameOver && C.opacity25)}>
              <TouchableOpacity
                style={apply(cell.Sm, C.radius2, bordColor(colors.wood, 0.5), shadow(colors.wood, 2, 0.5), C.mHairline)}
                onPress={() => !gameOver && clearCellGroup(index, item.icon)}>
                <Text
                  style={apply(
                    textSize.L,
                    shadow(colors.blue, showMatching && currentBoard.highlightCells.includes(index) ? 14 : 3),
                  )}>
                  {item.icon}
                </Text>
              </TouchableOpacity>
            </Animated.View>*/
          )}
        />
      )}

      <View style={apply(C.row, C.mb2)}>
        {/**Moves*/}
        {/*<Column isBig text={'⚡️'} val={'Moves (' + remMoves + ')'} />*/}
        {/**Shuffle*/}
        <Column
          isBig
          text={'🔄'}
          val={'Shuffle (' + remShuffles + ')'}
          opac={remShuffles <= 0}
          onPress={() => remShuffles > 0 && currentBoard.shuffle()}
        />
        {/**Bombs*/}
        <Column
          isBig
          opac={remBombs <= 0}
          onPress={() => remBombs > 0 && blinkBg(() => currentBoard.explodeMatching())}
          text={'💉🧟'}
          col={'red'}
          toShadow
          val={'Heal Zombies (' + remBombs + ')'}
        />
      </View>
      {/*<Text>{JSON.stringify(currentBoard.explodeCandidates)}</Text>
      <Text>{JSON.stringify(currentBoard.cells.filter(({icon}) => icon === '🧟').map(({id}) => id))}</Text>*/}

      {!_.isEmpty(profile.units) && (
        <View style={[C.absolute, C.right2, C.bottom12]}>
          <Tag
            text={'️ ➕ Add to map'}
            onPress={() => {
              profile.addUnitsBoard();
              navigate(screens.Battle);
            }}
          />
        </View>
      )}
      <Warriors />

      {/*<AddEmojiModal />*/}
    </SafeAreaView>
  );
});
