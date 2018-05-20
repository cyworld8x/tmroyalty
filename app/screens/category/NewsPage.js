import React from 'react';
import {
  FlatList,
  Image,
  View,
  TouchableOpacity
} from 'react-native';
import {
  RkText,
  RkCard, RkStyleSheet
  
} from 'react-native-ui-kitten';
import {SocialBar} from '../../components';
import { connect } from 'react-redux';
import NotificationHelper from '../../utils/notificationHelper';

import {FontAwesome} from '../../assets/icons';
import PushNotification from 'react-native-push-notification';
let moment = require('moment');

import DateHelper from '../../utils/dateHelper';
class NewsPage extends React.Component {
 
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    
    return {
      title: params ? params.categoryname : 'A Nested Details Screen',
    }
  };

  
  constructor(props) {
    super(props);

    this.data = [];
    this.state = {
      isLoading: true,
      categoryid: this.props.navigation.state.params.categoryid,
      refreshing: false,
      page: 1,
    };
    this.renderItem = this._renderItem.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }


  componentWillMount() {
    
    this.getNews();
            
  }

  getNews() {
    this.setState({
      isLoading: true,
      refreshing: true
    });

    //console.error(this.props.navigation);
    var url = this.props.Settings.ApiUrl + '/post/'+(this.props.navigation.state.params.categoryid) + "/"+ this.state.page;
   
    //NotificationHelper.Notify(url);
    return fetch(url)
        .then((response) =>response.json()).then(responseJson => {
          responseJson = responseJson==null?[]:responseJson;
         
          this.data = this.data.concat(responseJson); 
         
                       
          this.setState({
              isLoading: false,
              refreshing: false,              
              notificationData: this.data!=null && this.data.length>0? this.data[0]:null
          }, function () {     
              
              // do something with new state
          });
          if(this.data!=null && this.data.length>0){
             
           
              try {
                  let notificationId = Number(this.props.categoryid) % 3;
                  PushNotification.cancelLocalNotifications({id: notificationId});
                  PushNotification.localNotificationSchedule({
                      id: notificationId,
                      foreground: false, // BOOLEAN: If the notification was received in foreground or not 
                      userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not 
                      message: this.state.notificationData.title, // STRING: The notification message 
                      data: {navigation: this.props.navigation, routeName:'DetailPage',post:this.state.notificationData},
                      playSound: false, 
                      date: new Date(Date.now()+(8*60*60*1000)),
                      //date: new Date(Date.now())
                  });
              }
              catch (error) {
                //console.error(error);
                NotificationHelper.Notify('Kết nối không thành công!');
                this.props.navigation.navigate('SplashScreen');
              } 
          }
           
      }).catch((error) => {
            NotificationHelper.Notify('Kết nối không thành công!');
            this.props.navigation.navigate('SplashScreen');
          });
  }

  onLoadMore() {
   
    if (!this.state.refreshing) {
      this.setState({page : this.state.page + 1} );

      this.getNews();
    }

  }
  _keyExtractor(post, index) {
    return post.id;
  }

  _renderItem(info) {
    
    return (
      <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('DetailPage', {post: info.item, categoryname: this.props.navigation.state.params.categoryname })}>
        <RkCard rkType='imgBlock' style={styles.card}>
          <Image rkCardImg source={{uri:info.item.image}}/>

          <View rkCardImgOverlay rkCardContent style={styles.overlay}>
            <RkText rkType='header4 inverseColor' numberOfLines={1}>{info.item.title}</RkText>
            <RkText style={styles.time}
                    rkType='secondary2 inverseColor'>{info.item.date}</RkText>
          </View>
          <View rkCardFooter>
            <SocialBar rkType='space' comments={DateHelper.getView(info.item.date,info.item.id)} showLabel={false}/>

            
          </View >
        </RkCard>
      </TouchableOpacity>
    )
  }

  render() {
   
    return (
      <FlatList
        data={this.data}
        renderItem={this.renderItem}
        keyExtractor={this._keyExtractor}
        onEndReached={this.onLoadMore}
        onEndReachedThreshold={0.5}
        style={styles.container}/>

    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  card: {
    marginVertical: 8,
  },
  time: {
    marginTop: 5
  }
}));


function mapStateToProps(state) {
  return { 
   Settings: state.Settings
  };
}
export default connect(
  mapStateToProps
	
)(NewsPage);