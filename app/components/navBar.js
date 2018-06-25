import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text
} from 'react-native';
import _ from 'lodash';
import {RkText, RkButton, RkStyleSheet} from 'react-native-ui-kitten';
import {FontAwesome} from '../assets/icons';
import {UIConstants} from '../config/appConstants';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';

export class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {width: undefined};

  }

  _renderRight(headerRight) {
    let windowWidth = Dimensions.get('window').width;
    const width = this.state.width
      ? (windowWidth - this.state.width) / 2
      : undefined;

    return headerRight && (
        <View style={[{width}, styles.right]}>{headerRight}</View>
      );
  }

  _renderLeft(headerLeft) {
    if (headerLeft) {
      return (
        <View style={styles.left}>{headerLeft}</View>
      )
    }

    let windowWidth = Dimensions.get('window').width;
    const width = this.state.width
      ? (windowWidth - this.state.width) / 2
      : undefined;

    let renderLeftContent = () => {
      let index = _.findIndex(this.props.headerProps.scenes, {isActive: true});
      if (index > 0) {
        return <RkButton
          rkType='clear'
          style={styles.menu}
          onPress={() => {
            this.props.navigation.goBack()
          }}>
          <RkText rkType='awesome hero' style={styles.icontext}>{FontAwesome.chevronLeft}</RkText>
        </RkButton>
      }
      else {
        return <RkButton
          rkType='clear'
          style={styles.menu}
          onPress={() => {
            this.props.navigation.navigate('DrawerOpen')
          }}>
          <RkText rkType='awesome' style={styles.icontext}>{FontAwesome.bars}</RkText>
        </RkButton>
      }
    };

    return (
      <View style={[{width}, styles.left]}>
        {renderLeftContent()}
      </View>
    )
  }

  _renderTitle(title, headerTitle) {
    if (headerTitle) {
      return (
        <View style={styles.title} onLayout={onLayout}><RkText style={{color:styles.titletext.fontcolor}} numberOfLines={1}>{headerTitle}</RkText></View>);
    }

    const onLayout = (e) => {
      this.setState({
        width: e.nativeEvent.layout.width,
      });
    };

    return (
      <View style={styles.title} onLayout={onLayout}>
        <RkText style={styles.titletext}>{title}</RkText>
      </View>
    )
  }

  render() {
    let options = this.props.headerProps.getScreenDetails(this.props.headerProps.scene).options;
    return (
      <View style={styles.layout}>
        <View style={styles.container}>
          {this._renderTitle(options.title, options.headerTitle)}
          {this._renderLeft(options.headerLeft)}
          {this._renderRight(options.headerRight)}
        </View>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  layout: {
    backgroundColor: theme.colors.screen.base,
    paddingTop: UIConstants.StatusbarHeight,
    //borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: theme.colors.border.base
  },
  container: {
    flexDirection: 'row',
    height: UIConstants.AppbarHeight,

  },
  left: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  title: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.screen.background
  },
  titletext:{
    color: theme.colors.screen.fontcolor,
  },
  icontext:{
    color: theme.colors.screen.fontcolor,
    paddingLeft:5,
    fontSize: 26,
  },
  menu: {
    width: 40
  }
}));