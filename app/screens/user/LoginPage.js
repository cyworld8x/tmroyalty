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

var DeviceInfo = require('react-native-device-info');
import {NavigationActions} from 'react-navigation';
import {FontAwesome} from '../../assets/icons';
import {GradientButton} from '../../components/gradientButton';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

import NotificationHelper from '../../utils/notificationHelper'
import { connect } from 'react-redux';
import { saveUserInformation } from '../../api/actionCreators';
import Facebook from '../other/Facebook'
class LoginPage extends React.Component {
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

  _LoginOrRegister(user){
    var url = 'http://api-tmloyalty.yoong.vn/account/loginorregister';
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson!=null && responseJson.StatusCode == 2) {
        if(responseJson.Data!=null){
          
          this.props.saveUserInformation(responseJson.Data);
        }
          
         
        }

      })
      .catch((error) => {
        if (__DEV__) {
          console.error(error);
          NotificationHelper.Notify('Kết nối không thành công!');
        }
      });
  }


  _FBLoginCallback(error, result) {
    if (error) {
      //console.error(error);
      this.setState({
        showLoadingModal: false,
      });
    } else {
      this._LoginOrRegister({
        SocialId: result.id,
        FullName: result.name,
        Email:result.email,
        SocialPicture: 'http://graph.facebook.com/' + result.id + '/picture?type=square',
        SocialUrl: 'https://www.facebook.com/profile.php?id=' + result.id,
        ProviderName: "facebook",
        DeviceId: DeviceInfo.getUniqueID(),
        DeviceType: Platform.OS
      });
      Facebook.GetFriends_FBGraphRequest('id,name,email',this.FBGetFriendsListCallback.bind(this));
      setTimeout(() => {
        let toHome = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Home'})]
        });
        this.props.navigation.dispatch(toHome)
      }, 500);
     
    }
  }

  FBGetFriendsListCallback(error, result) {
  
    if (error) {
      NotificationHelper.Notify("Error:500");
      // this.setState({
      //   showLoadingModal: false,
      // });
    } else {
     
      let friends = result.data.map((data) => {
        return {
          FullName: data.name,
          Email: data.email,
          SocialId: data.id,
          SocialPicture: 'http://graph.facebook.com/' + data.id + '/picture?type=square',
          SocialUrl: 'https://www.facebook.com/profile.php?id=' + data.id,
        }
      });
      let friendsLoyalty = {
        CurrentUserId: 281,
        MyFriends: friends
      }
      this._SubmitFriends(friendsLoyalty)
    }
  }

  _SubmitFriends(data) {
    try {
      fetch('http://api-tmloyalty.yoong.vn/account/updatefriends', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson!=null && responseJson.StatusCode)
            {
              if (__DEV__) {
                NotificationHelper.Notify(JSON.stringify(responseJson));
                NotificationHelper.Notify("Gửi thành công");
              }
            }else{
              NotificationHelper.Notify("Cập nhật dữ liệu không hoàn tất");
            }
            
           

          })
          .catch((error) => {
            if (__DEV__) {
              console.error(error);
            }
          });;
    }
    catch (error) {
      if (__DEV__) {
        console.error(error);
      }
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


function mapStateToProps(state) {
  return { 
   Settings: state.Settings
  };
}

export default connect(mapStateToProps,{ saveUserInformation })(LoginPage);
