import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import _ from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {useRef, useState} from 'react';
import {Animated, FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {profile} from '../App';
import {ResourcesMap, StatsMap, Tag} from '../comp/Box';
import Cell from '../comp/Cell';
import {TrackBar} from '../comp/ProgressBar';
import {bgColor, bordColor, cell, colors, isTabl, isWeb, shadow, textSize} from '../gStyles';
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
        {!isWeb && <TrackBar colAccent={colors.grass} progress={Math.random() * 100} height={12} />}
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

  return (
    <SafeAreaView style={apply(C.py8, C.itemsCenter, bgColor(colors.white), C.flex)}>
      {/**Resources*/}
      <StatsMap profile={profile} showPopulation />
      <ResourcesMap resources={profile.resources} withBord={false} />

      {currentBoard && (
        <FlatList
          data={currentBoard.cells}
          numColumns={CHESS_SIZE}
          extraData={currentBoard.cells}
          scrollEnabled={false}
          renderItem={({item, index}) => (
            <Cell
              size={cell.XL}
              iconSize={textSize.L}
              withFlex
              bg={colors.white}
              wrapStyle={[
                C.px1,
                bordColor(colors.water, 0.5),
                C.radius2,
                shadow(colors.blue, showMatching && currentBoard.shouldHighlight(index) ? 14 : 3),
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

      <Tag
        text={'️Add to map⤴'}
        onPress={() => {
          profile.addUnitsBoard();
          navigate(screens.Battle);
        }}
      />
      <Warriors />
      {/*<AddEmojiModal />*/}
    </SafeAreaView>
  );
});
