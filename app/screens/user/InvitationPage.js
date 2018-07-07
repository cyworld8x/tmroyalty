import React from 'react';
import {
  ListView,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import _ from 'lodash';
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
  RkButton
} from 'react-native-ui-kitten';
import {
  RkSwitch,
  FindFriends
} from '../../components';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {FontAwesome} from '../../assets/icons';
import Facebook from '../other/Facebook';

import { connect } from 'react-redux';
import { loadingUserInformation } from '../../api/actionCreators';

import StoragePosts from '../../api/storagePosts';
import UserStorage from '../../api/userStorage';
import NotificationHelper from '../../utils/notificationHelper'


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
class InvitationPage extends React.Component {
  static navigationOptions = {
    title: 'Facebook friends'.toUpperCase()
  };

  constructor(props) {
    super(props);

    this.user = [];
    this.state = {
      data: []
    };
    this.filter = this._filter.bind(this);
    this.setData = this._setData.bind(this);
    this.renderHeader = this._renderHeader.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }

  
  componentWillMount() {
    this.getMyFriends();
  }

  _setData(data) {
    this.setState({
      data: data
    })
  }

  
  submitTaggedFriends(data){
   
    this.users = _.filter(this.users, (user) => {

      if (user.SocialId !=data.SocialId)
        return user;
    });
    let updatedList = _.filter(this.state.data, (user) => {

      if (user.SocialId != data.SocialId)
        return user;
    });  
    var url = 'http://api-tmloyalty.yoong.vn/account/tagfriends';
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
      },
      body: JSON.stringify({
        TagById: this.props.User.Id,
        MyFriends:[data]
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {
          
         this.setState({data:updatedList});
         NotificationHelper.Notify('Bạn đã tag '+data.FullName +' thành công!');
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  getMyFriends(){
    var url = 'http://api-tmloyalty.yoong.vn/account/myfriends';
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
      },
      body: JSON.stringify({
        AccountId: this.props.User.Id,
        CurrentPage: 1,
        PageSize: 1000
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.error(responseJson);
        if (responseJson!=null) {
          this.users = responseJson.Items;
          this.setState( {
            data: this.users
          });
         
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
 

  _renderRow(row) {
    let name = row.item.FullName;
    return (
      // <TouchableOpacity >
        <View style={styles.container}>
          <Avatar rkType='circle' style={styles.avatar} img={{uri:'http://graph.facebook.com/'+row.item.SocialId+'/picture?type=square'}}/>
          <RkText numberOfLines={1}  style={{width:wp(60)}}>{name}</RkText>
          {/* <RkSwitch style={[styles.switch]}
                      ref={'rkSwitch'+row.item.SocialId}
                      //value={this.state.sendPush}
                      name="Push"
                      onColor='#123122'
                      onValueChange={(check) => this.submitTaggedFriends({
                            FullName:row.item.FullName, 
                            Email:row.item.Email,
                            SocialId:row.item.SocialId,
                            SocialPicture:row.item.SocialPicture,
                            SocialUrl:row.item.SocialUrl 
                          }).bind(this)}
                      /> */}
          
        <RkButton
          rkType='clear'
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#ff5607', alignItems:'center', position:'absolute', right:15 }}
          onPress={(check) => this.submitTaggedFriends({
            FullName: row.item.FullName,
            Email: row.item.Email,
            SocialId: row.item.SocialId,
            SocialPicture: row.item.SocialPicture,
            SocialUrl: row.item.SocialUrl,
            TagById:this.props.User.Id
          })}><RkText style={[styles.inviteicon]} rkType='awesome'>{FontAwesome.friends}</RkText></RkButton>
          
        </View>
      // </TouchableOpacity>
    )
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View style={styles.separator}/>
    )
  }

  _renderHeader() {
    return (
      <View style={styles.searchContainer}>
        <RkTextInput autoCapitalize='none'
                     autoCorrect={false}
                     onChange={(event) => this._filter(event.nativeEvent.text)}
                     label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
                     rkType='row'
                     placeholder='Tìm kiếm ...'/>
      </View>
    )
  }

  _filter(text) {
    text = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let pattern = new RegExp(text,'i');
    let users = _.filter(this.users, (user) => {

      if (user.FullName.search(pattern) != -1)
        return user;
    });

    this.setData(users);
  }
  _keyExtractor(item, index) {
    return 'id-'+item.SocialId;
  }
  render() {
    return (
      <View style={styles.root}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderRow}

          ListHeaderComponent={this.renderHeader}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={<RkText rkType='header6' style={{ paddingHorizontal: 20, fontStyle: 'italic', }}>{'Không có dữ liệu'}</RkText>}
        />

      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base
  },
  inviteicon: {
    position: 'absolute',
    alignSelf: 'center',
    color:'white'
  },
}));


function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation})(InvitationPage);