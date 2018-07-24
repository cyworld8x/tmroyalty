import React from 'react';
import {
  TouchableOpacity,
  FlatList,
  View,
  Image
} from 'react-native';
import {RkStyleSheet, RkText} from 'react-native-ui-kitten';
import {Avatar} from '../../components';
let moment = require('moment');

import {NavigationActions} from 'react-navigation';
import { connect } from 'react-redux';
import { loadingUserInformation,viewNotification } from '../../api/actionCreators';

import NotificationHelper from '../../utils/notificationHelper'
const readicon = require('../../assets/images/read.png');
const unreadicon = require('../../assets/images/unread.png');
class NotificationPage extends React.Component {
  static navigationOptions = {
    title: 'Thông báo'
  };

  constructor(props) {
    super(props);
    this.data = [];
    this.state = {
      refreshing: false,
      page: 1,
    };
    this.viewNotification = this._viewNotification.bind(this);
    this.navigateAction = this._navigateAction.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }
  componentWillMount(){
    this.setState({page:1}, this.getNotifications)
  }
  getNotifications(){
    var url = 'http://api-tmloyalty.yoong.vn/account/getnotification';
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
        },
        body: JSON.stringify({
          AccountId: this.props.User.Id,
          CurrentPage: this.state.page,
          PageSize: 10
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson!=null) {
          this.data = this.data.concat(responseJson.Items); 
          this.setState({refreshing:false});
          
        }else{
          NotificationHelper.Notify('Kết nối không thành công!');
          this.setState({refreshing:false});
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  _navigateAction(click_action, data) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: click_action,params:data })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  _viewNotification(item){
    
   
    if(item.FcmJson!=null){
      let fcm = JSON.parse(item.FcmJson);
      if(fcm!=null && fcm.notification!=null){
        if(fcm.notification.click_action!=null){
          if(fcm.notification.click_action.toUpperCase()=='HOMEPAGE'){
            this.navigateAction(fcm.notification.click_action,{uri:fcm.notification.url});
          }else{
            this.props.navigation.navigate(fcm.notification.click_action,{uri:fcm.notification.url});
          }
        }
       
      }
      
    }
    var url = 'http://api-tmloyalty.yoong.vn/account/togglereadstatus/?AccountId='+this.props.User.Id+'&PushNotiId='+item.Id;
      return fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.error(responseJson);
        if (responseJson!=null) {
          this.props.viewNotification( Math.floor(Math.random()*100));
          
        }
      })
      .catch((error) => {
        //console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
     
     
  }

  _renderRow(row) {
    let icon = !row.item.IsRead? readicon:unreadicon;
    let badgeticon = !row.item.IsRead? 'unread':'default';
    let markStyle = !row.item.IsRead?{fontWeight:'bold'}: {fontWeight:'normal',color:'#90949c'};
    let mainTitleStyle = !row.item.IsRead? 'header6':'primary2';
    return (
      <TouchableOpacity onPress={() => {this.viewNotification(row.item)} } style={styles.container} key={row.item.Id+''}>
        <Avatar img={icon}
                rkType='square'
                style={styles.avatar}
                badge={badgeticon}/>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <View style={styles.message}>
                <RkText rkType={mainTitleStyle} numberOfLines={1}>{row.item.Title}</RkText>
                <RkText rkType='primary2' style={markStyle} numberOfLines={2}>{row.item.Message}</RkText>
            </View>
            <RkText rkType='secondary5 hintColor' >{row.item.StrCreatedDate}</RkText>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor(item, index) {
    return item.Id.toString();
  }

  onLoadMore() {
    if (!this.state.refreshing) {
      this.setState({page : this.state.page + 1,refreshing: true}, this.getNotifications );
    }

  }

  render() {
    return (
     
      <FlatList
      style={styles.root}
      data={this.data}
      renderItem={this.renderRow}
      keyExtractor={this._keyExtractor}
      onEndReached={this.onLoadMore.bind(this)}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<RkText rkType='header6' style={{ paddingHorizontal: 20, fontStyle: 'italic', }}>{'Không có dữ liệu'}</RkText>}
      />
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base,
    alignItems: 'flex-start'
  },
  message:{
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  avatar: {},
  text: {
    marginBottom: 5,
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0
  },
  mainContent: {
    marginRight: 0
  },
  img: {
    height: 50,
    width: 50,
    margin: 0
  },
  attachment: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 50
  }
}));

function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation,viewNotification})(NotificationPage);