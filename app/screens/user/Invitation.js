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
class Invitation extends React.Component {
  static navigationOptions = {
    title: 'Facebook friends'.toUpperCase()
  };

  constructor(props) {
    super(props);

    this.user = [];
    this.state = {
      data: []
    };
    Facebook.GetFriends_FBGraphRequest('id,name',this.FBGetFriendsListCallback.bind(this));
   

    this.filter = this._filter.bind(this);
    this.setData = this._setData.bind(this);
    this.renderHeader = this._renderHeader.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }

  _setData(data) {
    this.setState({
      data: data
    })
  }

  
  FBGetFriendsListCallback(error, result) {
    if (error) {
      console.error(error);
      // this.setState({
      //   showLoadingModal: false,
      // });
    } else {
      this.users = result.data;
      this.setState( {
        data: this.users
      });
    }
  }

  _renderRow(row) {
    let name = row.item.name;
    return (
      // <TouchableOpacity >
        <View style={styles.container}>
          <Avatar rkType='circle' style={styles.avatar} img={{uri:'http://graph.facebook.com/'+row.item.id+'/picture?type=square'}}/>
          <RkText numberOfLines={1}  style={{width:wp(60)}}>{name}</RkText>
          <RkSwitch style={[styles.switch]}
                      ref={'rkSwitch'+row.item.Id}
                      //value={this.state.sendPush}
                      name="Push"
                      onColor='#123122'
                      onValueChange={(check) => this.refs['rkSwitch'+row.item.id].setAttribute('value',check)}
                      />
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
                     placeholder='Search'/>
      </View>
    )
  }

  _filter(text) {
    let pattern = new RegExp(text, 'i');
    let users = _.filter(this.users, (user) => {

      if (user.name.search(pattern) != -1)
        return user;
    });

    this.setData(users);
  }
  _keyExtractor(item, index) {
    return 'id-'+item.Id;
  }
  render() {
    return (

      <FlatList
      data={this.state.data}
      renderItem={this.renderRow}
          
      ListHeaderComponent={this.renderHeader}
      keyExtractor={this._keyExtractor}
      />
      // <ListView
      //   style={styles.root}
      //   dataSource={this.state.data}
      //   renderRow={this.renderRow}
      //   renderSeparator={this.renderSeparator}
      //   renderHeader={this.renderHeader}
      //   enableEmptySections={true}/>
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
}));


function mapStateToProps(state) {
  return { 
   Settings: state.Settings
  };
}

export default connect(mapStateToProps,{ loadingDataStorage, loadSettings })(Invitation);