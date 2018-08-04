import React from 'react';
import {
  TouchableOpacity,
  FlatList,
  View,
  Image,
  Dimensions
} from 'react-native';
import {RkStyleSheet, RkText,RkButton} from 'react-native-ui-kitten';
import {Avatar} from '../../components';
import {data} from '../../data';
let moment = require('moment');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
import { connect } from 'react-redux';
import { loadingUserInformation,viewNotification } from '../../api/actionCreators';

import {UserInformationCard} from '../../components';
import NotificationHelper from '../../utils/notificationHelper'
const pocket = require('../../assets/images/pocket.png');
class LoyaltyHistoryPage extends React.Component {
  static navigationOptions = {
    title: 'Lịch sử loyalty'
  };

  constructor(props) {
    super(props);
    this.data = [];
    this.state = {
      refreshing: false,
      page: 1,
    };
    this.getLoyaltyHistories = this._getLoyaltyHistories.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }
  componentWillMount(){
    this.setState({page:1}, this.getLoyaltyHistories)
  }
  _getLoyaltyHistories(){
    
    var url = 'http://api-tmloyalty.yoong.vn/loyalty/loyaltyhistory';
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
          PageSize: 15
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
        if (__DEV__) {
          console.error(error);
        }
        
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  

  _renderRow(row) {
    
    //let badgeticon = !row.item.IsRead? 'unread':'default';
    //let markStyle = !row.item.IsRead?{fontWeight:'bold'}: {fontWeight:'normal',color:'#90949c'};
   
    return (
      <TouchableOpacity style={styles.container} key={row.item.Id+''}>
        <View style={styles.avatar}>
          <Avatar img={pocket}
          rkType='square'
          style={styles.profile}
          badge={'follow'} />
                </View>
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <View style={styles.message}>
                <RkText rkType='secondary6'   numberOfLines={4}>{row.item.Note}</RkText>
                <RkText rkType='secondary4' style={{paddingTop:5}}   numberOfLines={1}>{row.item.Date}</RkText>
            </View>
            
          </View>
          <View style={styles.attachment}>
            <RkText rkType='primary2' style={{ alignSelf: 'center',  color:'#FFFFFF', fontWeight:'bold'}} >{'+'+row.item.Amount + ' đ'}</RkText>
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
      this.setState({page : this.state.page + 1,refreshing: true}, this.getLoyaltyHistories );
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
      ListHeaderComponent={<View rkCardContent >
        {this.props.User != null && <UserInformationCard rkType='circle medium' Component={ <RkButton style={{paddingTop:10, width:200, height:44, borderRadius: 22, backgroundColor:'#f9bc1a'}} onPress={() => { this.props.navigation.navigate('WithdrawalHistory')}}><RkText rkType='header6'>RÚT TIỀN</RkText></RkButton>} data={{ name: this.props.User.FullName, balance: this.props.User.LoyaltyAmount }} img={{ uri: this.props.User.AvatarUrl != null && this.props.User.AvatarUrl.length > 0 ? this.props.User.AvatarUrl : this.props.User.SocialPicture }} />}
        </View>}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    //backgroundColor:'#475462',
  },
  message:{
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  avatar: {
    flexDirection: 'column',
    justifyContent:'center',
    width:wp(13),
    borderBottomWidth: 8,
    borderBottomColor: '#83ecb8',
  },
  profile: {
    padding:10,  
    flex:1,
  },
  text: {
    marginBottom: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
   
    padding: 10,
    width:wp(60),
    borderBottomWidth: 8,
    borderBottomColor: '#50bbb6',
  },
  img: {
    height: 50,
    width: 50,
    margin: 0
  },
  attachment: {
    flex:1,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent:'flex-end',
    backgroundColor: '#f9bc1a',
    width:wp(27),
    borderBottomWidth: 8,
    borderBottomColor: '#de5145',
  }
}));

function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation,viewNotification})(LoyaltyHistoryPage);