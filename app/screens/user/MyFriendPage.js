import React from 'react';
import {
  ListView,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import _ from 'lodash';
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
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
import { loadingDataStorage, loadSettings } from '../../api/actionCreators';

import StoragePosts from '../../api/storagePosts';
import UserStorage from '../../api/userStorage';
import NotificationHelper from '../../utils/notificationHelper'


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
class MyFriendPage extends React.Component {
  static navigationOptions = {
    title: 'Facebook friends'.toUpperCase()
  };

  constructor(props) {
    super(props);

    this.user = [];
    this.state = {
      data: [],
      textSearch:''
    };
   
   

    this.filter = this._filter.bind(this);
    this.setData = this._setData.bind(this);
    this.renderHeader = this._renderHeader.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }

  componentWillMount() {
    this.getMyTaggedFriends();
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.reload) !== JSON.stringify(nextProps.reload)) // Check if it's a new user, you can also use some unique, like the ID
    {
      this.setState({textSearch:''});
      this.getMyTaggedFriends();
    }
  }
  
  _setData(data) {
    this.setState({
      data: data
    })
  }
  getMyTaggedFriends(){
    var url = 'http://api-tmloyalty.yoong.vn/account/mytagfriends';
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        AccountId: 281,
        CurrentPage: 1,
        PageSize: 1000
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        
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
        <Avatar rkType='circle' style={[styles.avatar]}  img={{ uri: 'http://graph.facebook.com/' + row.item.SocialId + '/picture?type=square' }} />
        <View style={{ width: wp(60), flex: 1, flexDirection: 'column' }}>
          <RkText numberOfLines={1}  >{name}</RkText>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={[styles.accountstatusbullet,{backgroundColor: row.IsActive? 'green':'red'}]}></View><RkText style={styles.accountstatustext}>{row.IsActive? 'Đã kích hoạt':'Chưa kích hoạt'}</RkText></View>
        </View>
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
                     value={this.state.textSearch}
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
    this.setState({textSearch:text});
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
          ListEmptyComponent={<RkText rkType='header6' style={{ paddingHorizontal: 20, fontStyle: 'italic', }}>{'Không có dữ liệu'}</RkText>}
          keyExtractor={this._keyExtractor}
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
  switch: {
    marginHorizontal:16,
    position: 'absolute',
    right: 0,
  },
  accountstatusbullet:{
    width:12, height: 12, borderRadius: 6, 
  },
  accountstatustext:{
    fontSize: 10, fontStyle: 'italic', paddingLeft: 5, fontFamily: 'Roboto-Regular'
  }
}));


function mapStateToProps(state) {
  return { 
   Settings: state.Settings
  };
}

export default connect(mapStateToProps,{ loadingDataStorage, loadSettings })(MyFriendPage);