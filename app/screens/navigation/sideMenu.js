import React from 'react';
import {
  TouchableHighlight,
  View,
  ScrollView,
  Image,
  Platform,
  StyleSheet
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {
  RkStyleSheet,
  RkText,
  RkTheme
} from 'react-native-ui-kitten';
import {MainRoutes,SmallMainRoutes,DefaultRoutes} from '../../config/navigation/routes';
import {FontAwesome} from '../../assets/icons';

export class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this._navigateAction = this._navigate.bind(this);
  }

  _navigate(route) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: route.id})
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }

  _renderIcon() {
    if (RkTheme.current.name === 'light')
      return <Image style={styles.logo} source={require('../../../app/assets/images/logo@x2.png')}/>;
    return <Image style={styles.logo} source={require('../../../app/assets/images/logo@x2.png')}/>

  }

  render() {
    let menu = SmallMainRoutes.map((route, index) => {
      return (
        <TouchableHighlight
          style={styles.container}
          key={route.id}
          underlayColor={RkTheme.current.colors.button.underlay}
          activeOpacity={1}
          onPress={() => this._navigateAction(route)}>
          <View style={styles.content}>
            <View style={styles.content}>
              <RkText style={styles.icon}
                      rkType='awesome secondaryColor large'>{route.icon}</RkText>
              <RkText rkType='header6' style={{color:'#969696'}}>{route.title}</RkText>
            </View>
            { route.children!=null && route.children.length>0 && <RkText rkType='awesome secondaryColor small'>{FontAwesome.chevronRight}</RkText> }
            
          </View>
        </TouchableHighlight>
      )
    });

    return (
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <TouchableHighlight onPress={() => this._navigateAction(DefaultRoutes)}>
          <View style={[styles.logocontainer, styles.content]}>
          <View style={styles.content}>
              {this._renderIcon()}
              <RkText rkType='logo header4'>TM Loyalty</RkText>
            </View>
           
            <RkText rkType='awesome secondaryColor small'>{FontAwesome.chevronRight}</RkText>
          </View>
          </TouchableHighlight>          
          {menu}
        </ScrollView>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  logocontainer: {
    height: 80,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor:  theme.colors.border.base
  },
  container: {
    height: 59,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor:  theme.colors.border.base
  },
  root: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: theme.colors.screen.base
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    marginRight: 13,
    width:40,
    height:40,
    borderRadius: 20,
  },
  icon: {
    marginRight: 13,
    width:30,
    alignSelf: 'center',
    alignContent: 'center',
  }
}));