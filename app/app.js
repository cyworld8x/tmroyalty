import { AppRegistry } from 'react-native';
import React from 'react';

import StoreManagement from "./api/storageManagement";
import { Provider } from 'react-redux';
import {
  DrawerNavigator,
  StackNavigator
} from 'react-navigation';
import {withRkTheme} from 'react-native-ui-kitten';
import {AppRoutes,NavigationRoutes,CategoryRoutes} from './config/navigation/routesBuilder';
import * as Screens from './screens';

import SplashScreen from './screens/other/splash';
import CategoryPage from './screens/category/CategoryPage';
import {bootstrap} from './config/bootstrap';
//import track from './config/analytics';
import {data} from './data'
import {View} from "react-native";
bootstrap();
data.populateData();

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

let SideMenu = withRkTheme(Screens.SideMenu);
const KittenApp = StackNavigator({
  First: {
    screen: SplashScreen
  },
  // Home: {
  //   screen: CategoryPage
  // },
  Home: {
    screen: DrawerNavigator({
        ...AppRoutes,
      },
      {
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        drawerBackgroundColor: "transparent",
        contentComponent: (props) => <SideMenu {...props}/>
      })
  }
}, {
  headerMode: 'none',
});

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      loaded: false
    };
    
  }
 

  componentWillMount() {
    this._loadAssets();
  }

  _loadAssets = async() => {
    // await Font.loadAsync({
    //   'fontawesome': require('./assets/fonts/fontawesome.ttf'),
    //   'icomoon': require('./assets/fonts/icomoon.ttf'),
    //   'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
    //   'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    //   'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    //   'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    //   'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    // });
    this.setState({loaded: true});
  };

  render() {
    // if (!this.state.loaded) {
    //   return <View style={{flex: 1}}/>;
    // }

    return (
      <Provider store={StoreManagement}>
        <View style={{flex: 1}}>
          <KittenApp
            onNavigationStateChange={(prevState, currentState) => {
              const currentScreen = getCurrentRouteName(currentState);
              const prevScreen = getCurrentRouteName(prevState);

              if (prevScreen !== currentScreen) {
                //track(currentScreen);
              }
            }}
          />
        </View>
      </Provider>
    );
  }
}

