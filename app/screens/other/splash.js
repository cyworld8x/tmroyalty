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
  RkTheme
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
      isLoadingDataStorage: true
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
        //Facebook.GetUserInfo_FBGraphRequest('id, email,name, picture.type(large)',$this.FBLoginCallback,$this.FBLoginCallback);
        setTimeout(() => {
          StatusBar.setHidden(false, 'slide');
          let toHome = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Home'})]
          });
          this.props.navigation.dispatch(toHome)
        }, timeFrame);
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
      Facebook.LogOut();
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
            <RkText rkType='light' style={styles.hero}>Version 1.0</RkText>
            <RkText rkType='logo' style={styles.appName}>GDPT</RkText>
          </View>
        </View>
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
    fontSize: 62,
  },
  progress: {
    alignSelf: 'center',
    marginBottom: 35,
    backgroundColor: '#e5e5e5'
  }
});


function mapStateToProps(state) {
  return { 
   FavoritedPosts: state.Storage.FavoritedPosts,
   Settings: state.Settings
  };
}

export default connect(mapStateToProps,{ loadingDataStorage, saveSettings, loadSettings })(SplashScreen);
