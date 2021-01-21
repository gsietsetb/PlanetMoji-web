import C, {apply, extend} from 'consistencss';
import {autorun} from 'mobx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import AddEmojiModal from './comp/AddEmojiModal';
import {bgColor, colors} from './gStyles';
import {screens, WebNavigation} from './routes';
import {CollectFruit} from './screens/Harvest';
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
  /*const [isLoading, setIsLoading] = useState(true);*/
  let Comp = screens[profile.currentScreen].Comp;
  autorun(() => {
    console.log('treggt', profile.currentScreen);
    Comp = screens[profile.currentScreen].Comp;
  });

  /* useEffect(() => {
    /!**Init stores*!/
  });*/

  return (
    <SafeAreaView style={apply(bgColor(colors.paleGrey))}>
      <WebNavigation currScreen={profile.currentScreen} onSet={(index) => profile.setCurrentScreen(index)} />
      {/*<Spinner speed={200} />*/}
      <ScrollView style={apply(C.flex, C.hFull)}>
        <Comp />
      </ScrollView>
      <AddEmojiModal Comp={<CollectFruit />} />

      {/*<Navigator />*/}
    </SafeAreaView>
  );
});
export default App;
