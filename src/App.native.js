import {extend} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {LogBox} from 'react-native';
import {colors} from './gStyles';
import {Navigator} from './routes';
import {ProfileStore} from './stores/profileStore';

LogBox.ignoreLogs(['Warning:', 'Running ', 'WARN', '[mobx] Out of bounds read']);
LogBox.ignoreAllLogs();

/**Mobx Persist
 const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});
 hydrate('profile', profile).then(() => console.log('someStore has been hydrated'));
 */

extend({colors: {...colors}});

export const profile = ProfileStore();

const App: () => React$Node = observer(() => <Navigator />);
export default App;
