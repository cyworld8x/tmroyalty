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
    this.navigation  = this.props.navigation;
  }
  
  componentDidMount() {
    try {
     
      if(this.props.User.AllowReceiveNotification!=null && this.props.User.AllowReceiveNotification==true){
        this.messageListener = firebase.messaging().onMessage((message) => {
         
          this.displayNotification( message);
        });        
       
        this.registerNotification();
      }
    }
    catch (error) {
      if(__DEV__){
        console.log(error);
      }
     
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
          if (__DEV__) {
            NotificationHelper.Notify("Gửi thành công token");
          }
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
    
    this.messageListener();
    this.onTokenRefreshListener();
  }

  async registerNotification(){
    let that = this.navigation;
    try{
      firebase.messaging().requestPermissions();
      firebase.messaging().getInitialNotification()
        .then((notificationOpen) => {
         
          //NotificationHelper.Notify(JSON.stringify(notificationOpen));
          if (notificationOpen!=null && notificationOpen.opened_from_tray==true) {
            // Get information about the notification that was opened
           
            const data = notificationOpen
            if(data!=null && data.click_action!=null && data.click_action.length>0){
              let arr = data.click_action.split('|');
              that.navigate(arr[0],{url:arr.length>=2?arr[1]:"",title:data.title});
            }
          }
        });
      
      firebase.messaging().getToken().then(token => {
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
  displayNotification(message) {
    if (message) {
      try {
        var notification = {
          local_notification: true,
          show_in_foreground: true,
          collapseKey: 'red',
          priority: 'high',
          tag: 'red',
          icon: 'ic_launcher',
          sound: 'default',
          opened_from_tray: false,
          title:message.title,
          click_action:message.click_action
        };
        //console.error(message.fcm);
        firebase.messaging().createLocalNotification(notification);
     
        return notification;
      }
      catch (error) {
        if(__DEV__){
          console.error(error);
        }
        
        NotificationHelper.Notify('FB.500');
      }
    }
}


  onTokenRefreshListener(){
    firebase.messaging().onTokenRefresh(token => {
      this.setState({token: token || ""},this.saveToken);
    });
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

