import { Platform, AsyncStorage, AppState } from 'react-native';

import firebase from 'react-native-firebase';

function displayNotificationFromCustomData(message){
  if(message.data && message.data.title){
    let notification = new firebase.notifications.Notification();
      notification = notification
      .setTitle(message.data.title)
      .setBody(message.data.body)
      .setData(message.data)
      .setSound("bell.mp3")
      notification.android.setPriority(firebase.notifications.Android.Priority.High)
      notification.android.setChannelId("news-channel")
    firebase.notifications().displayNotification(notification);
  }
}

export async function registerHeadlessListener(message){
  await AsyncStorage.setItem('TM-Loyalty-Headless', new Date().toISOString());
  displayNotificationFromCustomData(message);
}

// these callback will be triggered only when app is foreground or background
export function registerAppListener(navigationCallBack){
  this.notificationListener = firebase.notifications().onNotification(notification => {
    firebase.notifications().displayNotification(notification);
  })
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    const notif  = notificationOpen.notification;

    if(notif.data.targetScreen === 'detail'){
      setTimeout(()=>{
        navigationCallBack();
      }, 500)
    }
    setTimeout(()=>{
        navigationCallBack();
    }, 500)
  });

  this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => {
    console.log("TOKEN (refreshUnsubscribe)", token);
  });

  this.messageListener = firebase.messaging().onMessage((message) => {
    displayNotificationFromCustomData(message);
  });

}