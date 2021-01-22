import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import _ from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
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
        <TrackBar colAccent={colors.grass} progress={1} />
        {value >= 1 && <Text style={apply(C.font4)}>x{value}</Text>}
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

  const gameOver = currentBoard.remMoves < 1 || profile.currPopulation >= profile.maxPopulation;
  const {remShuffles, remBombs} = currentBoard;

  return (
    <SafeAreaView style={apply(C.py8, C.itemsCenter, bgColor(colors.white), C.flex)}>
      {/**Resources*/}
      <StatsMap currProfile={profile} showPopulation />
      <ResourcesMap resources={profile.resources} withBord={false} />

      {currentBoard && (
        <FlatList
          data={currentBoard.cells}
          numColumns={CHESS_SIZE}
          style={apply(C.my6, gameOver && C.opacity25)}
          extraData={currentBoard.cells}
          scrollEnabled={false}
          renderItem={({item, index}) => {
            const matchZombie = currentBoard.cells
              .filter(({icon}) => icon === '🧟')
              .map(({id}) => id)
              .includes(index);
            const highlight = showMatching && currentBoard.shouldHighlight(index);
            return (
              <Cell
                size={cell.L}
                iconSize={isBig ? textSize.XL : textSize.L}
                bg={!isIOS && highlight ? colors.water + '40' : colors.white}
                cShadow={shadow(matchZombie ? colors.salmon : colors.blue, highlight ? 14 : 1)}
                cBord={bordColor(colors.water, isIOS ? 0.5 : 1)}
                wrapStyle={C.radius3}
                index={index}
                onPress={() => !gameOver && clearCellGroup(index, item.icon)}
                item={item}
              />
            );
          }}
        />
      )}

      <View style={apply(C.row, C.mb2)}>
        {/**Moves*/}
        {/*<Column isBig text={'⚡️'} val={'Moves (' + remMoves + ')'} />*/}
        {/**Shuffle*/}
        <Column
          isBig
          text={'🔄'}
          val={'Shuffle ( ' + remShuffles + ' )'}
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
          val={'Heal Zombies ( ' + remBombs + ' )'}
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
    </SafeAreaView>
  );
});
