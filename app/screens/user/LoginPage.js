import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Keyboard,
  BackHandler,
  Platform
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme
} from 'react-native-ui-kitten';

import {NavigationActions} from 'react-navigation';
import {FontAwesome} from '../../assets/icons';
import {GradientButton} from '../../components/gradientButton';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

import UserStorage from '../../api/userStorage';
import Facebook from '../other/Facebook'
export default class LoginPage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    
    Facebook.LogOut();
    this.FBLoginCallback = this._FBLoginCallback.bind(this);
  }

  _renderImage(image) {
    let contentHeight = scaleModerate(375, 1);
    let height = Dimensions.get('window').height - contentHeight;
    let width = Dimensions.get('window').width;

    if (RkTheme.current.name === 'light')
      image = (<Image style={[styles.image, {height, width}]}
                      source={require('../../assets/images/backgroundLoginV1.png')}/>);
    else
      image = (<Image style={[styles.image, {height, width}]}
                      source={require('../../assets/images/backgroundLoginV1DarkTheme.png')}/>);
    return image;
  }

  LogIn(){
    Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)',this.FBLoginCallback,this.FBLoginCallback);
  }

  LogOut(){
    BackHandler.exitApp();
  }


  _FBLoginCallback(error, result) {
    if (error) {
      //console.error(error);
      this.setState({
        showLoadingModal: false,
      });
    } else {
      let toHome = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Home'})]
      });
      this.props.navigation.dispatch(toHome);

      UserStorage.saveFacebookAccessToken(result);
     
    }
  }

  render() {
    let image = this._renderImage();

    return (
      <RkAvoidKeyboard
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}
        style={styles.screen}>
        {image}
        <View style={styles.container}>
          <View style={styles.buttons}>
          <RkButton style={styles.button} rkType='social' onPress={() => this.LogIn()}>
              <RkText rkType='awesome hero accentColor'>{FontAwesome.facebook}</RkText>
            </RkButton>
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Đăng nhập tài khoản Facebook?</RkText>
              <RkButton rkType='clear'>
                <RkText rkType='header6' onPress={() => this.LogIn()}> Đăng nhập </RkText>
              </RkButton>
            </View>
          </View>
          <GradientButton onPress={() => {
            this.LogIn()
          }} rkType='large' style={styles.save} text='ĐĂNG NHẬP'/>
          {Platform.OS === "android" ?
            <GradientButton onPress={() => {
              this.LogOut()
            }} rkType='large' style={styles.save} text='THOÁT' /> : <View />}
        </View>
      </RkAvoidKeyboard>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 10
  },
  button: {
    marginHorizontal: 14
  },
  save: {
    marginVertical: 9
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  }
}));