import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import C, {apply} from 'consistencss';
import React from 'react';
import {Text} from 'react-native';
import {colors, shadow} from './gStyles';
import Battle from './screens/Battle';
import Harvest, {CollectFruit, CollectTools} from './screens/Harvest';
import Profile from './screens/Profile';
import Recruit from './screens/Recruit';
import Village from './screens/Village';
import World from './screens/World';
import {profile} from './stores/profileStore';

const Tab = createBottomTabNavigator();
export const SCREEN_TABS = 'TABS';
export const screens = {
  WORLD: {icon: '🌏', Comp: World, name: 'Map'},
  VILLAGE: {icon: '🏘', Comp: Village, name: 'Village'},
  HARVEST: {icon: '🧺', Comp: Harvest, name: 'Collect'},
  FRUIT: {icon: '🧺', Comp: CollectFruit, name: 'Fruit'},
  TOOLS: {icon: '🧺', Comp: CollectTools, name: 'Tools'},
  RECRUIT: {icon: '🏋️‍', Comp: Recruit, name: 'Recruit'},
  BATTLE: {icon: '⚔️', Comp: Battle, name: 'Battle'},
  TRAIN: {icon: '🏋️‍', Comp: Battle, name: 'Train'},
  FIGHT: {icon: '🤼‍', Comp: Battle, name: 'Fight'},
  PROFILE: {
    icon: '🤩',
    badge: profile.level,
    Comp: Profile,
    name: 'Profile',
  },
};

const tabs = [screens.WORLD, screens.VILLAGE, screens.HARVEST, screens.RECRUIT, screens.FIGHT, screens.PROFILE];
const Stack = createStackNavigator();

const Tabs = ({currTabs = tabs}) => (
  <Tab.Navigator
    initialRouteName={screens.WORLD.name}
    tabBarOptions={{
      activeTintColor: colors.blue,
      inactiveTintColor: colors.blueGrey,
    }}>
    {tabs.map(({name, icon, badge, Comp}, index) => (
      <Tab.Screen
        name={name}
        options={{
          tabBarLabel: name,
          tabBarBadge: badge,
          tabBarIcon: ({focused}) => (
            <Text style={apply(focused ? C.font8 : C.font7, focused && shadow(colors.blue, 15))}>{icon}</Text>
          ),
        }}
        component={Comp}
      />
    ))}
  </Tab.Navigator>
);

export const Navigator = () => (
  <NavigationContainer>
    {/*{!profile.isSignedIn ? (
      <Stack.Screen
        name="SignIn"
        component={Welcome}
        options={{
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: profile.isSignedIn ? 'pop' : 'push',
        }}
      />
    ) : (*/}
    <Stack.Navigator
      screenOptions={({route, navigation}) => ({
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
      })}>
      <Stack.Screen name={SCREEN_TABS} component={Tabs} />
      {Object.values(screens).map(({name, icon, badge, Comp}, index) => (
        <Stack.Screen name={name} component={Comp} />
      ))}
    </Stack.Navigator>
    {/*)}*/}
  </NavigationContainer>
);
