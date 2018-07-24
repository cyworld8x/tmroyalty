import React from 'react';
import {
  TouchableOpacity,
  FlatList,
  View,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import {RkStyleSheet, RkText} from 'react-native-ui-kitten';
import {Avatar} from '../../components';
let moment = require('moment');
import {UserInformationCard} from '../../components';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { loadingUserInformation,viewNotification } from '../../api/actionCreators';
import LoyaltyLevelPage from './LoyaltyLevelPage';
import LoyaltyHistoryPage from './LoyaltyHistoryPage';
import NotificationHelper from '../../utils/notificationHelper'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
class LoyaltyPage extends React.Component {
  static navigationOptions = {
    title: 'Lịch sử loyalty'
  };

  constructor(props) {
    super(props);
    this.renderScene = this._renderScene.bind(this);

    this.state = {
        index: 0,
        routes: [
          { key: 'LoyaltyLevelPage', title: 'Cấp độ' },
          
          { key: 'LoyaltyHistoryPage', title: 'Lịch sử' }
        ],
      };
  }
  componentWillMount(){
    
  }

  
  _renderTabBar(props){
    return(
     <TabBar
       {...props}
       style ={{ backgroundColor: '#2e3b46' }} 
     />
    )
   }
 
   _renderScene = ({ route }) => {
     
     switch (route.key) {
     case 'LoyaltyLevelPage':
       return <LoyaltyLevelPage navigation={this.props.navigation}/>;
     case 'LoyaltyHistoryPage':
       return (<LoyaltyHistoryPage navigation={this.props.navigation}/>);
     default:
       return <LoyaltyHistoryPage navigation={this.props.navigation}/>;
     }
   }
  

  render() {
    return (
      
      <View style={styles.maincontainer} >
      
      <TabView ref='TabView'
    navigationState={this.state}
    onIndexChange={(index) => { this.setState({ index }); }}
    renderScene={this.renderScene}
    style={styles.tabview} 
    renderTabBar={this._renderTabBar}
  />
    </View>
    
      // <ScrollView style={styles.root} >
      //   <View rkCardContent>
      //     <View >
      //       {this.props.User != null && <UserInformationCard rkType='circle medium' data={{ name: this.props.User.FullName, balance: this.props.User.LoyaltyAmount }} img={{ uri: this.props.User.AvatarUrl != null && this.props.User.AvatarUrl.length > 0 ? this.props.User.AvatarUrl : this.props.User.SocialPicture }} />}

      //     </View>

      //     <View style={styles.viewarea} >

      //       <TabView ref='TabView'
      //         navigationState={this.state}
      //         onIndexChange={(index) => { this.setState({ index }); }}
      //         renderScene={SceneMap({
      //           LoyaltyLevelPage: LoyaltyLevelPage,
      //           LoyaltyHistoryPage: LoyaltyHistoryPage,
      //         })}
      //         style={styles.tabview}
      //         renderTabBar={this._renderTabBar}
      //       />
      //     </View>
      //   </View>
      // </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
    
  },
  maincontainer:{
    flex: 1,
    flexDirection: 'column',
  },
  viewarea:{ 
    flex:1
  },
  tabview:{ 
    //flexDirection: 'row',
    //minHeight: viewportHeight,
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

export default connect(mapStateToProps,{loadingUserInformation,viewNotification})(LoyaltyPage);