import {useNavigation} from '@react-navigation/core';
import C, {apply} from 'consistencss';
import _ from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {CloseButton, ResourcesMap, StatsMap, Tag, VertInfo} from '../comp/Box';
import {bgColor, bordColor, cell, colors, deviceWidth, fonts, shadow, textSize} from '../gStyles';
import {profile} from '../stores/profileStore';

export default observer(
  ({
    currentBoard = profile.boards.harvestMap,
    hint = 'Also matches diagonally 💥',
    ExtraComp,
    showCombo = true,
    withBonus = false,
    isResource = false,
  }) => {
    const {promotedDiag, harvestCombo, validMatch, cells, remMoves, remShuffles, remBombs} = currentBoard;
    const [showMatching, setShowMatching] = useState(false);
    const {navigate} = useNavigation();

    const tryCollect = (index, icon) => {
      currentBoard.setCurrent(index);
      if (validMatch) {
        blinkBg(() => currentBoard.collectCells(icon, isResource));
      }
    };

    const blinkBg = (onAfter) => {
      setShowMatching(true);
      setTimeout(() => {
        onAfter();
        setShowMatching(false);
      }, 500);
    };

    return (
      <SafeAreaView style={apply(C.py8, C.itemsCenter, bgColor(colors.white), C.flex)}>
        <CloseButton navigate={navigate} />
        {/**Resources*/}
        <StatsMap profile={profile} />
        <ResourcesMap resources={profile.resources} withBord={false} highlightIcon={promotedDiag} />

        {cells && (
          <FlatList
            data={cells}
            numColumns={8}
            extraData={cells}
            scrollEnabled={false}
            renderItem={({item, index}) => (
              <View style={apply(remMoves < 1 && C.opacity25)}>
                <TouchableOpacity
                  style={apply(
                    cell.Sm,
                    C.radius2,
                    bordColor(colors.water, 0.5),
                    shadow(colors.water, 2, 0.5),
                    C.mHairline,
                  )}
                  onPress={() => remMoves > 0 && tryCollect(index, item.icon)}>
                  <Text
                    style={apply(
                      textSize.L,
                      shadow(colors.blue, showMatching && currentBoard.shouldHighlight(index) ? 14 : 3),
                    )}>
                    {item.icon}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {withBonus ? (
          <View style={apply(C.row, C.mb4)}>
            {/**Moves*/}
            <VertInfo isBig descr={'Moves'} text={'💥'} val={'(' + remMoves + ')'} />
            {/**Shuffle*/}
            <VertInfo
              isBig
              onPress={() => currentBoard.shuffle()}
              text={'🔄'}
              descr={'Shuffle'}
              val={'(' + remShuffles + ')'}
            />
            {/**Bombs*/}
            <VertInfo
              isBig
              onPress={() => remBombs > 0 && blinkBg(() => currentBoard.explodeAll())}
              descr={'Explode'}
              text={'💣'}
              val={'(' + remBombs + ')'}
            />
          </View>
        ) : (
          <CollectList units={Object.entries(profile.collected)} />
        )}
        {/**Highest combo strike*/}
        {showCombo && harvestCombo.length > 2 && (
          <View style={apply(C.itemsCenter, C.row, C.mb3)}>
            <Tag text={'🔝 combo: (' + harvestCombo.length + ')'} />
            {/*<Text style={apply(fonts.subtitle)}> ⚡️Highest combo: ({harvestCombo.length})</Text>*/}
            <Text numberOfLines={2} style={apply(textSize.Md, {maxWidth: deviceWidth * 0.6})}>
              {_.range(harvestCombo.length).map((item) => harvestCombo.icon)}
            </Text>
          </View>
        )}

        {/**Hint*/}
        {hint && (
          <View style={apply(C.row, C.itemsCenter, C.mb4)}>
            <Tag text={'💡Hint'} />
            <Text style={apply(fonts.body1)}>
              {promotedDiag} {hint}{' '}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  },
);

export const CollectList = ({units = Object.entries(profile.units)}) => (
  <View style={apply(C.row, C.radius2)}>
    <Text>{JSON.stringify(units)}</Text>
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
