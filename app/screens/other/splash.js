import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import {
  RkText,
  RkTheme,
  RkButton
} from 'react-native-ui-kitten'
import {ProgressBar} from '../../components';
import {
  DarkKittenTheme
} from '../../config/darkTheme';
import {
  KittenTheme
} from '../../config/theme';

import {
  TmTheme
} from '../../config/tmTheme';
import {NavigationActions} from 'react-navigation';
var DeviceInfo = require('react-native-device-info');
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

let timeFrame = 500;

import _ from 'lodash';
import { connect } from 'react-redux';
import { loadingUserInformation, saveUserInformation } from '../../api/actionCreators';

import StoragePosts from '../../api/storagePosts';
import UserStorage from '../../api/userStorage';

import {FontAwesome} from '../../assets/icons';
import NetInfoHelper from '../../utils/netInfoHelper'
import NotificationHelper from '../../utils/notificationHelper'
import EncryptHelper from '../../utils/encryptHelper'
import Facebook from './Facebook'
class SplashScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      isLoadingDataStorage: true,
      isShowLogin : false
    }
    this.UserId = 0;
    this.Token = "";
    //this.loadingServerSettings = this.loadingServerSettings.bind(this);
    this.FBLoginCallback = this.FBLoginCallback.bind(this);
    this.FBGetFriendsListCallback = this.FBGetFriendsListCallback.bind(this)
  }



  componentDidMount() {


    StatusBar.setHidden(true, 'none');
    RkTheme.setTheme(TmTheme);
    var $this= this;
    this.timer = setInterval(() => {
      if (this.state.progress == 1 ) {
        clearInterval(this.timer);
        Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)',$this.FBLoginCallback,$this.FBLoginCallback);
        // setTimeout(() => {
        //   StatusBar.setHidden(false, 'slide');
        //   let toHome = NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({routeName: 'Home'})]
        //   });
        //   this.props.navigation.dispatch(toHome)
        // }, timeFrame);
        this.setState({isShowLogin:true});
      } else {
        let random = Math.random() * 0.5;
        let progress = this.state.progress + random;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({progress});
      }
    }, timeFrame)

  }

  FBLoginCallback(error, result) {
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
     
     
      //Facebook.LogOut();
      
    }
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
        if (responseJson != null && responseJson.StatusCode == 2) {
          if (responseJson.Data != null) {
            setTimeout(() => {
              StatusBar.setHidden(false, 'slide');
              let toHome = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'Home'})]
              });
              this.props.navigation.dispatch(toHome)
            }, timeFrame);
            this.props.saveUserInformation(responseJson.Data);            
            this.UserId = responseJson.Data.Id;
            this.Token = responseJson.Data.AccessToken.split('__')[0];
            Facebook.GetFriends_FBGraphRequest('id,name,email', this.FBGetFriendsListCallback.bind(this));
          }
        }else{
          
          NotificationHelper.Notify('Kết nối không thành công!');
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
  FBGetFriendsListCallback(error, result) {
  
    if (error) {
      NotificationHelper.Notify("Kết nối không thành công!");
      //console.error(error);
      // this.setState({
      //   showLoadingModal: false,
      // });
    } else {
      this.users = result.data;
      
      let friends = result.data.map((data) => {
        return {
          FullName: data.name,
          Email: data.email,
          SocialId: data.id,
          SocialPicture: 'http://graph.facebook.com/' + data.id + '/picture?type=square',
          SocialUrl: 'https://www.facebook.com/profile.php?id=' + data.id,
        }
      });
      //let token = this.Token;
      let friendsLoyalty = {
        CurrentUserId: this.UserId,
        MyFriends: friends,
        Token: this.Token
      }
      this._SubmitFriends(friendsLoyalty)
    }
  }

  _SubmitFriends(data) {
    try {
      //console.error(data);
      fetch('http://api-tmloyalty.yoong.vn/account/updatefriends', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
            'Authorization': 'Bearer ' +  data.Token
          },
          body: JSON.stringify(data),
        })
        
          .then((response) => response.json())
          .then((responseJson) => {
           
            if(responseJson!=null && responseJson.StatusCode==2)
            {
              if (__DEV__) {
                NotificationHelper.Notify("Gửi thành công data");
              }
             
            }else{
              if (__DEV__) {
                NotificationHelper.Notify("Cập nhật dữ liệu không hoàn tất");
              }
             
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
    let width = Dimensions.get('window').width;
    return (
      <View style={styles.container}>
      
        <View>
          <Image style={[styles.image, {width}]} source={require('../../assets/images/splashBack.png')}/>
          {/* <View style={styles.text}>
            <RkText rkType='light' style={styles.hero}>TM Group</RkText>
          </View> */}
        </View>
        {this.state.isShowLogin == 1  ? (<View style={styles.login}>
          <View style={styles.buttons}>
            <RkButton style={styles.button} rkType='social' onPress={() => Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)', this.FBLoginCallback, this.FBLoginCallback)}>
              <RkText rkType='awesome hero accentColor'>{FontAwesome.facebook}</RkText>
            </RkButton>
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3 inverseColor'>Đăng nhập tài khoản Facebook?</RkText>
              <RkButton rkType='clear'>
                <RkText rkType='header6 inverseColor' onPress={() => Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)', this.FBLoginCallback, this.FBLoginCallback)}> Đăng nhập </RkText>
              </RkButton>
            </View>
          </View>
        </View>):<View/>}
        <ProgressBar
          color='#f9bc1a'
          style={styles.progress}
          progress={this.state.progress} width={scale(320)}/>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#475462',
    justifyContent: 'space-between',
    flex: 1
  },
  login: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1
  },
  image: {
    alignSelf:'center',
    height: scaleVertical(430),
  },
  text: {
    alignItems: 'center'
  },
  hero: {
    fontSize: 37,
  },
  appName: {
    fontSize: 40,
  },
  progress: {
    alignSelf: 'center',
    marginBottom: 35,
    backgroundColor: '#e5e5e5'
  },
  progressbg: {
    backgroundColor: '#f9bc1a'
  },
  footer: {
    justifyContent: 'flex-end',
   
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24)
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
});


function mapStateToProps(state) {
  return { 
    User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{ loadingUserInformation, saveUserInformation })(SplashScreen);
