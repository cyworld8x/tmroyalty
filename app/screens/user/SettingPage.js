import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
  RkTheme
} from 'react-native-ui-kitten';

import _ from 'lodash';
import {RkSwitch} from '../../components/switch/index';
import {FontAwesome} from '../../assets/icons';

import { connect } from 'react-redux';
import { loadingUserInformation } from '../../api/actionCreators';

import NotificationHelper from '../../utils/notificationHelper'
class SettingPage extends React.Component {
  static navigationOptions = {
    title: 'Settings'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.data = [];
    this.state = {
        loading: true
    };
    this.onSettingNotificationChange = this._onSettingNotificationChange.bind(this);
  }
  getSettings(){
    var url = 'http://api-tmloyalty.yoong.vn/account/getsettingnotification/?accountId='+this.props.User.Id;
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
        if (responseJson!=null) {
           
          this.data = this.data.concat(responseJson.Data); 
          
          this.setState({loading:false});
        }else{
          NotificationHelper.Notify('Kết nối không thành công!');
         
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
  componentWillUnmount(){
      //NotificationHelper.Notify(JSON.stringify(this.data));
  }
  togglepush(item){
    this.setState({loading:true});
    var url = 'http://api-tmloyalty.yoong.vn/account/togglepush/';
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
        },
        body: JSON.stringify({
          AccountId: this.props.User.Id,
          AllowPush: item.AllowPush,
          NotificationTypeId: item.NotificationTypeId
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson!=null) {
           
          this.setState({loading:false});
        }else{
          NotificationHelper.Notify('Kết nối không thành công!');
         
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
  componentWillMount(){
    this.setState({loading:true}, this.getSettings)
  }
  _onSettingNotificationChange(item){
    item.AllowPush = !item.AllowPush;
    this.data = this.data.map(i => i.NotificationTypeId === item.NotificationTypeId?item:i);
    this.togglepush(item);
  }
  render() {
    
    let components = this.data.map((item)=>{ return(<View key={item.NotificationTypeId} style={styles.row}>
        <RkText rkType='header6'>{item.NotificationType}</RkText>
        <RkSwitch style={styles.switch}
                  value={item.AllowPush}
                  name={item.NotificationType}
                  onValueChange={() => {  this.onSettingNotificationChange(item);}}/>
      </View>);});
    return (
      <ScrollView style={styles.container}>
        <View style={styles.section}>
        {components}
        </View>
        
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {
    paddingVertical: 25
  },
  section: {
    marginVertical: 25
  },
  heading: {
    paddingBottom: 12.5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  rowButton: {
    flex: 1,
    paddingVertical: 24
  },
  switch: {
    marginVertical: 14
  },
}));


function mapStateToProps(state) {
    return { 
       User: state.UserManagement.User
    };
  }
  
  export default connect(mapStateToProps,{loadingUserInformation})(SettingPage);