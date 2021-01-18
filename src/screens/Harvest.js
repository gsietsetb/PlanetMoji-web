import React from 'react';
import {profile} from '../App';
import Collect from './Collect';

export default () => <Collect withBonus isResource />;
export const CollectFruit = () => <Collect currentBoard={profile.boards.fruitsMap} />;
export const CollectTools = () => <Collect currentBoard={profile.boards.toolsMap} />;
/*observer(() => {
  const currentBoard = profile.boards.harvestMap;
  const [showMatching, setShowMatching] = useState(false);

  const clearCellGroup = (index, icon) => {
    currentBoard.setCurrent(index);
    if (currentBoard.validMatch) {
      blinkBg(() => currentBoard.harvestGroup(icon));
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
      {/!**Resources*!/}
      <StatsMap profile={profile} />
      <ResourcesMap resources={profile.resources} withBord={false} />

      {currentBoard && (
        <FlatList
          data={currentBoard.cells}
          numColumns={8}
          extraData={currentBoard.cells}
          scrollEnabled={false}
          renderItem={({item, index}) => (
            <View style={apply(currentBoard.remMoves < 1 && C.opacity25)}>
              <TouchableOpacity
                style={apply(
                  cell.Sm,
                  C.radius2,
                  bordColor(colors.water, 0.5),
                  shadow(colors.water, 2, 0.5),
                  C.mHairline,
                )}
                onPress={() => currentBoard.remMoves > 0 && clearCellGroup(index, item.icon)}>
                <Text
                  style={apply(
                    textSize.L,
                    shadow(colors.blue, showMatching && currentBoard.highlightCells.includes(index) ? 14 : 3),
                  )}>
                  {item.icon}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={apply(C.row, C.mb4)}>
        {/!**Moves*!/}
        <VertInfo isBig descr={'Moves'} text={'💥'} val={'(' + currentBoard.remMoves + ')'} />
        {/!**Shuffle*!/}
        <VertInfo
          isBig
          onPress={() => currentBoard.shuffle()}
          text={'🔄'}
          descr={'Shuffle'}
          val={'(' + currentBoard.remainingShuffles + ')'}
        />
        {/!**Bombs*!/}
        <VertInfo
          isBig
          onPress={() => currentBoard.remainingBombs > 0 && blinkBg(() => currentBoard.explodeAll())}
          descr={'Explode'}
          text={'💣'}
          val={'(' + currentBoard.remainingBombs + ')'}
        />
      </View>

      {/!**Highest combo strike*!/}
      {currentBoard.harvestCombo.length > 2 && (
        <View style={apply(C.itemsCenter, C.row, C.mb3)}>
          <Tag text={'🔝 combo: (' + currentBoard.harvestCombo.length + ')'} />
          {/!*<Text style={apply(fonts.subtitle)}> ⚡️Highest combo: ({currentBoard.harvestCombo.length})</Text>*!/}
          <Text numberOfLines={2} style={apply(textSize.Md, {maxWidth: deviceWidth * 0.6})}>
            {_.range(currentBoard.harvestCombo.length).map((item) => currentBoard.harvestCombo.icon)}
          </Text>
        </View>
      )}

      {/!**Hint*!/}
      <View style={apply(C.row, C.itemsCenter, C.mb4)}>
        <Tag text={'💡Hint'} />
        <Text style={apply(fonts.body1)}> 💎 Also matches diagonally 💥 </Text>
      </View>

      {/!*<View style={apply(C.mb16, C.itemsCenter)}>
        <Text style={apply(fonts.title1, C.my2)}>💥 Collected</Text>
        <View style={C.row}>
          {Object.entries(profile.collected).map(([key, val]) => val > 0 && <Box icon={key} value={val} />)}
        </View>
      </View>*!/}
      {/!*<Text>{JSON.stringify(currentBoard.mathchingRecurisiveAdjacentIds)}</Text>
      <Text>{JSON.stringify(profile.collected)}</Text>
      <Text>{JSON.stringify(profile.resources)}</Text>*!/}
      <AddEmojiModal />
    </SafeAreaView>
  );
});*/
