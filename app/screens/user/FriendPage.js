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

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import InvitationPage from './InvitationPage';
import MyFriendPage from './MyFriendPage';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
class FriendPage extends React.Component {
  static navigationOptions = {
    title: 'Facebook friends'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'InvitationPage', title: '+ Bạn mới' },
        { key: 'MyFriendPage', title: 'Đã mời' },
      ],
    };
   
  }
  
  _renderTabBar(props){
   return(
    <TabBar
      {...props}
      style ={{ backgroundColor: '#242424' }} 
    />
   )
  }

  _renderScene = ({ route }) => {
    
    switch (route.key) {
    case 'InvitationPage':
      return <InvitationPage />;
      case 'MyFriendPage':
      return (<MyFriendPage reload={Math.random()} />);
    default:
      return <MyFriendPage />;
    }
  }

  render() {
    return (

      <TabView ref='TabView'
        navigationState={this.state}
        onIndexChange={(index) => {this.setState({ index });
        }}
        style={styles.root}
        renderTabBar={this._renderTabBar}
        renderScene={this._renderScene}
      />
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

export default connect(mapStateToProps,{ loadingDataStorage, loadSettings })(FriendPage);