/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  Platform,
  ScrollView,
  AsyncStorage,
  
} from 'react-native';


import firebase from 'react-native-firebase';

import {registerAppListener} from "../../utils/FirebaseEventListener";

import NotificationHelper from '../../utils/notificationHelper';
import { connect } from 'react-redux';
import { loadingUserInformation} from '../../api/actionCreators';
class NotificationController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      tokenCopyFeedback: ""
    }
  }

  async componentDidMount() {
    try {
      if(this.props.User.AllowReceiveNotification!=null && this.props.User.AllowReceiveNotification==true){
        this.messageListener();
        await this.registerNotification();
      }
    }
    catch (error) {
      console.log(error);
    }

  }
  
  saveToken(){
    fetch('http://api-tmloyalty.yoong.vn/account/addfirebasetoken', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',   
        'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0] 
      },
      body: JSON.stringify({AccountId: this.props.User.Id, Token:this.state.token}),
    })
    
      .then((response) => response.json())
      .then((responseJson) => {
       
        if(responseJson!=null && responseJson.StatusCode==2)
        {
          NotificationHelper.Notify("Gửi thành công token");
        }else{
          //console.error(responseJson);
          NotificationHelper.Notify("Cập nhật dữ liệu không hoàn tất");
        }
        
       

      })
      .catch((error) => {
        if (__DEV__) {
          console.error(error);
        }
      });;
  }

  componentWillUnmount(){
    this.onTokenRefreshListener();
  }

  async registerNotification(){
    try{
      firebase.messaging().requestPermissions();
      firebase.messaging().getInitialNotification()
        .then((notificationOpen) => {
          //NotificationHelper.Notify(JSON.stringify(notificationOpen));
          if (notificationOpen!=null && notificationOpen.notification!=null) {
            // Get information about the notification that was opened
            const notif = notificationOpen.notification;
            
            if(notif.click_action!=null && notif.click_action.length>0){
              Notification.Notify(notif.title);
              setTimeout(()=>{
                this.props.navigation.navigate(notif.click_action)
              }, 500)
            }
          }
        });
      
      firebase.messaging().getToken().then(token => {
        console.log("TOKEN (getFCMToken)", token);
        this.setState({token: token || ""}, this.saveToken)
      });
  
      // topic example
      firebase.messaging().subscribeToTopic(''+this.props.User.Id);
      firebase.messaging().subscribeToTopic('all');
      //firebase.messaging().unsubscribeFromTopic('NewsTopic');
  
      var offline = await AsyncStorage.getItem('TM-Loyalty-Headless')
      if(offline){
        this.setState({
          offlineNotif: offline
        });
        AsyncStorage.removeItem('TM-Loyalty-Headless');
      }
    }
    catch(error) {
      NotificationHelper.Notify('FB.500');
    }
  }
 displayNotification(message){
  if (message) {
   
    var notification = {
      ...message.fcm,
      local_notification: true,
      show_in_foreground: true,
      collapseKey: 'red',
      priority: 'high',
      tag: 'red',
      icon: 'ic_launcher',
      click_action: 'HomePage',
      sound: 'default',
      opened_from_tray: true,
      big_text: 'Tin nhắn từ TM Loyalty'
   };
   
   Notification.Notify("Có tin nhắn mới từ hệ thống")
   firebase.messaging().createLocalNotification(notification);
   return notification;
  }
}
  messageListener() {
    firebase.messaging().onMessage(message=>{
      this.displayNotification(message);
    })
  }

  onTokenRefreshListener(){
    firebase.messaging().onTokenRefresh(token => {
      this.setState({token: token || ""},this.saveToken);
    });
  }

 
  displayNotificationFromCustomData(message){
    NotificationHelper.Notify(JSON.stringify(message));
    // if(message.data && message.data.title){
    //   let notification = new firebase.notifications.Notification();
    //     notification = notification
    //     .setTitle(message.data.title)
    //     .setBody(message.data.body)
    //     .setData(message.data)
    //     .setSound("bell.mp3")
    //     notification.android.setPriority(firebase.notifications.Android.Priority.High)
    //     notification.android.setChannelId("news-channel")
    //   firebase.notifications().displayNotification(notification);
    // }
  }


  showLocalNotification() {
    let notification = new firebase.notifications.Notification();
    notification = notification.setNotificationId(new Date().valueOf().toString())
    .setTitle( "Test Notification with action")
    .setBody("Force touch to reply")
    .setSound("bell.mp3")
    .setData({
      now: new Date().toISOString()
    });
    notification.ios.badge = 10
    notification.android.setAutoCancel(true);

    notification.android.setBigPicture("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png", "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg", "content title", "summary text")
    notification.android.setColor("red")
    notification.android.setColorized(true)
    notification.android.setOngoing(true)
    notification.android.setPriority(firebase.notifications.Android.Priority.High)
    notification.android.setSmallIcon("ic_launcher")
    notification.android.setVibrate([300])
    notification.android.addAction(new firebase.notifications.Android.Action("view", "ic_launcher", "VIEW"))
    notification.android.addAction(new firebase.notifications.Android.Action("reply", "ic_launcher", "REPLY").addRemoteInput(new firebase.notifications.Android.RemoteInput("input")) )
    notification.android.setChannelId("test-channel")

    firebase.notifications().displayNotification(notification)
  }

  scheduleLocalNotification() {
    let notification = new firebase.notifications.Notification();
    notification = notification.setNotificationId(new Date().valueOf().toString())
    .setTitle( "Test Notification with action")
    .setBody("Force touch to reply")
    .setSound("bell.mp3")
    .setData({
      now: new Date().toISOString()
    });
    notification.android.setChannelId("test-channel")
    notification.android.setPriority(firebase.notifications.Android.Priority.High)
    notification.android.setSmallIcon("ic_launcher")

    firebase.notifications().scheduleNotification(notification, { fireDate: new Date().getTime() + 5000 })
  }


  render() {   

    return <View/>;
  }
}

function mapStateToProps(state) {
    return { 
       User: state.UserManagement.User
    };
  }
  
  export default connect(mapStateToProps,{loadingUserInformation})(NotificationController);

