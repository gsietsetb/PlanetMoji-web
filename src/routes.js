import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import C, {apply} from 'consistencss';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {profile} from './App';
import {colors, fonts, isSmall, isWeb, shadow, textSize} from './gStyles';
import Battle from './screens/Battle';
import Collect from './screens/Collect';
import Harvest from './screens/Harvest';
import Profile from './screens/Profile';
import Recruit from './screens/Recruit';
import Village from './screens/Village';
import Welcome from './screens/Welcome';
import World from './screens/World';

const Tab = createBottomTabNavigator();
export const SCREEN_TABS = 'TABS';
export const screens = {
  Planet: {icon: '🌍', Comp: World, name: 'Planet'},
  Village: {icon: '🏘', Comp: Village, name: 'Village'},
  Collect: {icon: '🧺', Comp: Harvest, name: 'Collect'},
  Fruit: {icon: '🧺', Comp: () => <Collect currentBoard={profile.boards.fruitsMap} />, name: 'Fruit'},
  Tools: {icon: '🧺', Comp: () => <Collect currentBoard={profile.boards.toolsMap} />, name: 'Tools'},
  Recruit: {icon: '🏋️‍', Comp: Recruit, name: 'Recruit'},
  Battle: {icon: '⚔️', Comp: Battle, name: 'Battle'},
  Train: {icon: '🏋️‍', Comp: Battle, name: 'Train'},
  Fight: {icon: '🤼‍', Comp: Battle, name: 'Fight'},
  Profile: {icon: '🧝‍', Comp: Profile, name: 'Profile'},
};

export const tabs = [
  screens.Planet,
  screens.Village,
  screens.Collect,
  screens.Recruit,
  screens.Battle,
  screens.Profile,
];
const Stack = createStackNavigator();

export const WebNavigation = ({currScreen, onSet}) => (
  <View style={apply(C.row, C.justifyBetween, C.px4, C.radius2, C.itemsCenter, C.shadowMd)}>
    {tabs.map(({icon, Comp, name}, index) => (
      <TouchableOpacity
        onPress={() => onSet(name)}
        style={apply(C.itemsCenter, !isSmall && C.row, C.justifyCenter, C.radius8, C.px2)}>
        <Text style={apply(name === currScreen ? [textSize.L] : textSize.Md, C.mr2)}>{icon}</Text>
        <Text style={apply(name === currScreen ? [fonts.subtitle, C.textBlue] : [fonts.body1, C.textBlack40])}>
          {name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const nav = (screen, useNav) => {
  console.log('teho', screen, useNav);
  if (isWeb) {
    /*profile.setCurrentScreen(screen);*/
    profile.modal.showModal();
  } else {
    useNav.navigate(screen);
  }
};

const Tabs = ({currTabs = tabs}) => (
  <Tab.Navigator
    initialRouteName={screens.Planet.name}
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
    {!profile.isSignedIn ? (
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
    ) : (
      <Stack.Navigator
        screenOptions={({route, navigation}) => ({
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
        })}>
        {!isWeb && <Stack.Screen name={SCREEN_TABS} component={Tabs} />}
        {Object.values(screens).map(({name, icon, badge, Comp}, index) => (
          <Stack.Screen name={name} component={Comp} />
        ))}
      </Stack.Navigator>
    )}
  </NavigationContainer>
);
