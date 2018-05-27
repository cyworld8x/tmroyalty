import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  StatusBar
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
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

let timeFrame = 500;

import { connect } from 'react-redux';
import { loadingDataStorage, saveSettings, loadSettings } from '../../api/actionCreators';

import StoragePosts from '../../api/storagePosts';

import {FontAwesome} from '../../assets/icons';
import UserStorage from '../../api/userStorage';
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

    this.loadingServerSettings = this.loadingServerSettings.bind(this);
    this.FBLoginCallback = this.FBLoginCallback.bind(this);
  }

  loadingServerSettings()
	{

		StoragePosts.loadingSettings().then((settings)=> {
			
			if(settings==null){
  				settings = {
 					ApiUrl : 'http://api.gdptthegioi.net',
 					WebsiteUrl : 'http://gdptthegioi.net'
  				}
  			}
  			if(settings.ApiUrl==null){
 				settings.ApiUrl = 'http://api.gdptthegioi.net';
  			}
  			if(settings.WebsiteUrl==null){
 				settings.WebsiteUrl = 'http://gdptthegioi.net';
			  }
			
  			fetch(settings.ApiUrl+ '/info')
  					.then((response) => response.json())
					.then((responseJson) => {

						if (responseJson != null) {
							this.setState({
							isLoadingDataStorage: false,
							});	
							
							var settings = JSON.parse(EncryptHelper.decode_base(responseJson.key)); 
						
							var serverSettings = settings;
							
              StoragePosts.saveSettings(responseJson.key);
							this.props.saveSettings(settings);
							//console.error(this.Settings);
							if(serverSettings.ShowNotification!=null && serverSettings.ShowNotification== true){
								if(serverSettings.Notification.Reopened ==true || 
									(serverSettings.Notification.Reopened ==false && 
											(settings.Notification.Version==null ||   settings.Notification.Version != serverSettings.Notification.Version) )){
									setTimeout(() => {
										this.setState({											
											isShowPopup:true,
											Notification:serverSettings.Notification
										});
									}, 1000);
								}else{
									setTimeout(() => {
										this.setState({
											isLoadingSetting: false
										});
									}, 1000);
								}
							}
							else{
								setTimeout(() => {
									this.setState({
										isLoadingSetting: false
									});
								}, 1000);
							}
						}

					})
					.catch((error) => {
           
						this.setState({
							networkError: true
						})
						NotificationHelper.Notify('Vui lòng bật kết nối mạng');
					});	


		});
	}


  componentDidMount() {

    try {
			let notificationId = 9999;
			PushNotification.cancelLocalNotifications({ id: notificationId });
			PushNotification.localNotificationSchedule({
				id: notificationId,
				message: "Bạn ơi! Có nhiều bài mới đang chờ bạn khám phá!", // (required) 
				date: new Date(Date.now()+60*60*1000*24) // in 60 secs 
			});

		}
		catch (error) {

		}
			
		// StoragePosts.getPosts().then((data)=> {
		// 	let posts = JSON.parse(data);
		// 	posts = posts!=null? posts:[];
			
		// 	this.setState({
		// 		isLoadingDataStorage: false,
		// 	});		

		// });

		this.loadingServerSettings();

    StatusBar.setHidden(true, 'none');
    RkTheme.setTheme(TmTheme);
    var $this= this;
    this.timer = setInterval(() => {
      if (this.state.progress == 1 && this.state.isLoadingDataStorage == false) {
        clearInterval(this.timer);
        Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)',$this.FBLoginCallback,$this.FBLoginCallback);
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
      setTimeout(() => {
        StatusBar.setHidden(false, 'slide');
        let toHome = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'Home'})]
        });
        this.props.navigation.dispatch(toHome)
      }, timeFrame);
      NotificationHelper.Notify(JSON.stringify(result));
      //Facebook.LogOut();
      UserStorage.saveFacebookAccessToken(result);
      //console.error(result);
      
      // Retrieve and save user details in state. In our case with 
      // Redux and custom action saveUser
      //console.error(result);
     
    }
  }
  render() {
    let width = Dimensions.get('window').width;
    return (
      <View style={styles.container}>
        <View>
          <Image style={[styles.image, {width}]} source={require('../../assets/images/splashBack.png')}/>
          <View style={styles.text}>
            <RkText rkType='light' style={styles.hero}>TM Loyalty</RkText>
          </View>
        </View>
        {this.state.isShowLogin == 1  ? (<View style={styles.login}>
          <View style={styles.buttons}>
            <RkButton style={styles.button} rkType='social' onPress={() => Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)', this.FBLoginCallback, this.FBLoginCallback)}>
              <RkText rkType='awesome hero accentColor'>{FontAwesome.facebook}</RkText>
            </RkButton>
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Đăng nhập tài khoản Facebook?</RkText>
              <RkButton rkType='clear'>
                <RkText rkType='header6' onPress={() => Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)', this.FBLoginCallback, this.FBLoginCallback)}> Đăng nhập </RkText>
              </RkButton>
            </View>
          </View>
        </View>):<View/>}
        <ProgressBar
          color={RkTheme.current.colors.accent}
          style={styles.progress}
          progress={this.state.progress} width={scale(320)}/>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: KittenTheme.colors.screen.base,
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
    resizeMode: 'cover',
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
   FavoritedPosts: state.Storage.FavoritedPosts,
   Settings: state.Settings
  };
}

export default connect(mapStateToProps,{ loadingDataStorage, saveSettings, loadSettings })(SplashScreen);
