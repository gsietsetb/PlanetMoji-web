import C, {apply, extend} from 'consistencss';
import _ from 'lodash';
import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';
import {bgColor, colors} from './gStyles';
import {screens, WebNavigation} from './routes';
import {ProfileStore} from './stores/profileStore';
/*LogBox.ignoreLogs(['Warning:', 'Running ', 'WARN', '[mobx] Out of bounds read']);
LogBox.ignoreAllLogs();*/

/**Mobx Persist
 const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});
 hydrate('profile', profile).then(() => console.log('someStore has been hydrated'));
 */

extend({colors: {...colors}});

/*
const App: () => React$Node = observer(() => <Navigator />);
*/
export const profile = ProfileStore();

const App: () => React$Node = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [Comp, setComp] = useState(null);

  /*autorun(() => {
    console.log('treggt', profile.currentScreen);
    setComp(screens[profile.currentScreen].Comp);
  });*/

  const init = useCallback(() => {
    /**Init stores*/
    profile.initBoards();
    setComp(screens[profile.currentScreen].Comp);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    /*init();*/
    profile.initBoards();
    setComp(screens[profile.currentScreen].Comp);
    setIsLoading(false);
  }, []);

  return (
    <SafeAreaView style={apply(bgColor(colors.paleGrey))}>
      <WebNavigation currScreen={profile.currentScreen} onSet={(index) => profile.setCurrentScreen(index)} />
      {/*<Spinner speed={200} />*/}
      <ScrollView style={apply(C.flex, C.hFull)}>
        {_.isEmpty(profile.boards) || isLoading ? <Text>erfrefre waiting...{isLoading.toString()}</Text> : <Comp />}
        <Text>{JSON.stringify(profile.boards)}</Text>
      </ScrollView>
      {/*<AddEmojiModal Comp={<CollectFruit />} />*/}

      {/*<Navigator />*/}
    </SafeAreaView>
  );
});
export default App;
