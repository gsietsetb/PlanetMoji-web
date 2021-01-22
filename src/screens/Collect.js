import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import _ from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {profile} from '../App';
import {CloseButton, Column, ResourcesMap, StatsMap, Tag} from '../comp/Box';
import Cell from '../comp/Cell';
import {bgColor, bordColor, cell, colors, deviceWidth, fonts, isBig, isIOS, isWeb, shadow, textSize} from '../gStyles';
import {CHESS_SIZE} from '../stores/boardStore';

export default observer(
  ({
    currentBoard = profile.boards.harvestMap,
    hint = 'Also matches diagonally 💥',
    ExtraComp,
    showCombo = true,
    withBonus = false,
    isResource = false,
  }) => {
    const {bombIcon, harvestCombo, cells, remMoves, remShuffles, remBombs} = currentBoard;
    const [showMatching, setShowMatching] = useState(false);
    const {goBack} = !isWeb && useNavigation();

    const tryCollect = (index, icon) => {
      currentBoard.setCurrent(index);
      if (currentBoard.validMatch) {
        currentBoard.setCurrResource(icon);
        blinkBg(() => currentBoard.collectCells(icon, isResource));
      }
    };

    const blinkBg = (onAfter) => {
      setShowMatching(true);
      setTimeout(() => {
        onAfter();
        setShowMatching(false);
      }, 600);
    };

    return (
      <SafeAreaView style={apply(isIOS && C.py4, C.hFull, C.itemsCenter, bgColor(colors.white))}>
        {!isWeb && <CloseButton navigate={goBack} />}
        {/**Resources*/}
        <StatsMap currProfile={profile} />
        <ResourcesMap
          resources={profile.resources}
          withBord={false}
          highlightIcon={showMatching ? currentBoard.currResource : ''}
        />

        {cells && (
          <FlatList
            data={cells}
            numColumns={CHESS_SIZE}
            style={apply(C.my6, remMoves < 1 && C.opacity25)}
            contentContainerStyle={[isBig && C.p2]}
            extraData={currentBoard.currCellId}
            scrollEnabled={false}
            renderItem={({item, index}) => {
              const highlight = showMatching && currentBoard.shouldHighlight(index);
              return (
                <Cell
                  size={cell.L}
                  iconSize={isBig ? textSize.XL : textSize.L}
                  withFlex={!isWeb}
                  withTransp={false}
                  cShadow={shadow(highlight ? colors.fire : colors.blue, highlight ? 15 : 3)}
                  cBord={bordColor(highlight ? colors.fire : colors.water, isIOS ? /*highlight ? 3 :*/ 0.5 : 1)}
                  bg={!isIOS && highlight ? colors.fire + '60' : colors.white}
                  wrapStyle={C.radius3}
                  index={index}
                  onPress={() => remMoves > 0 && tryCollect(index, item.icon)} //currentBoard.setCurrent(index)}
                  item={item}
                />
              );
            }}
          />
        )}

        {!withBonus && (
          <View style={apply(C.row, C.mb2)}>
            {/**Moves*/}
            {/*<Column isBig text={'⚡️'} val={'Moves (' + remMoves + ')'} />*/}
            {/**Shuffle*/}
            <Column
              isBig
              text={'🔄'}
              val={'Shuffle (' + remShuffles + ')'}
              onPress={remShuffles > 0 && (() => currentBoard.shuffle())}
            />
            {/**Bombs*/}
            <Column
              isBig
              onPress={remBombs > 0 && (() => blinkBg(() => currentBoard.explodeAll()))}
              text={'💣'}
              val={'Explode (' + remBombs + ')'}
            />
          </View>
        )}
        {/*/*: (
          <CollectList units={Object.entries(profile.collected)} />
        )}*/}
        <Tag text={'⚡️ Moves:' + remMoves} />

        {/**Highest combo strike*/}
        {showCombo
          ? harvestCombo.length > 2 && (
              <View style={apply(C.itemsCenter, C.row, C.mb3)}>
                <Tag text={'🔝 combo: (' + harvestCombo.length + ')'} col={colors.fire} />
                {/*<Text style={apply(fonts.subtitle)}> ⚡️Highest combo: ({harvestCombo.length})</Text>*/}
                <Text numberOfLines={2} style={apply(textSize.Md, {maxWidth: deviceWidth * 0.6})}>
                  {_.range(harvestCombo.length).map((item) => harvestCombo.icon)}
                </Text>
              </View>
            )
          : hint && (
              <View style={apply(C.row, C.itemsCenter, C.mb4)}>
                <Tag text={'💡Hint'} />
                <Text style={apply(fonts.body1)}>
                  {bombIcon} {hint}{' '}
                </Text>
              </View>
            )}
      </SafeAreaView>
    );
  },
);

export const CollectList = ({units = Object.entries(profile.units)}) => (
  <View style={apply(C.row, C.radius2)}>
    {/*<Text>{JSON.stringify(units)}</Text>*/}
    {/*{units.map(([key, value]) => (
      <TouchableOpacity style={apply(C.itemsCenter, isTabl && C.row, C.selfStart, C.py4, C.maxw12)}>
        {value >= 3 ? (
          <Text style={apply(C.font12)}>{key}</Text>
        ) : (
          _.range(value).map((item) => <Text style={apply(C.font12)}>{key}</Text>)
        )}
        <ProgressBar backgroundColor={colors.grass} progress={Math.random() * 100} noFlex={'80%'} height={12} />
        {value >= 3 && <Text style={apply(C.font4)}>x{value}</Text>}
      </TouchableOpacity>
    ))}*/}
  </View>
);
