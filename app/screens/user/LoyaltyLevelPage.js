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
const award = require('../../assets/images/award.png');
class LoyaltyLevelPage extends React.Component {
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
    
    var url = 'http://api-tmloyalty.yoong.vn/loyalty/getloyaltyleveldetails?accountId='+this.props.User.Id;
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

  

  _renderRow(row) {
    let icon = award;
    let levels = row.item.LoyaltyLevelDetails.map((item)=>{
      return(<View style={styles.level} key={(Math.round(Math.random()*1000).toString())}>
      <View style={[styles.levelachievement]}>
        
        <Image source={award}
          style={{width:70,height:70}}
           />
           <RkText rkType='secondary3' style={{position:'absolute', justifyContent:'center', color:'#FFFFFF'}}  numberOfLines={4}>{item.Level}</RkText>
        </View>
        <View style={styles.levelContent}>
          <RkText rkType='header6'  numberOfLines={1}>{'CẤP ĐỘ ' + item.Level + ' : '+item.Amount + ' Đ'}</RkText>
          <RkText rkType='primary2' style={{fontStyle:'italic'}}  numberOfLines={1}>{'Có ' +item.TotalChilds + ' người'}</RkText>
          
        </View>
      </View>);
    });
  
    return (
      <TouchableOpacity style={styles.container} key={row.item.ServiceName + ''}>
        
        <View style={styles.headerCard}>
        <RkText rkType='primary2' style={styles.headertext} numberOfLines={1}>{row.item.ServiceName.toUpperCase()}</RkText>
        </View>
        <View style={styles.contentCard}>
        {levels}
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor(item, index) {
    return item.ServiceName.toString();
  }


  render() {
    return (
     
      <FlatList
      style={styles.root}
      data={this.data}
      renderItem={this.renderRow}
      keyExtractor={this._keyExtractor}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={<View rkCardContent >
        {this.props.User != null && <UserInformationCard rkType='circle medium' Component={ <RkButton style={{marginTop: 5, width:180, height:40, borderRadius: 20, backgroundColor:'#f9bc1a'}} onPress={() => { this.props.navigation.navigate('WithdrawalHistory')}}><RkText rkType='header6'>RÚT TIỀN</RkText></RkButton>} data={{ name: this.props.User.FullName, balance: this.props.User.LoyaltyAmount }} img={{ uri: this.props.User.AvatarUrl != null && this.props.User.AvatarUrl.length > 0 ? this.props.User.AvatarUrl : this.props.User.SocialPicture }} />}
        </View>}
      ListEmptyComponent={<RkText rkType='header6' style={{  paddingHorizontal: 20, fontStyle: 'italic', }}>{'Không có dữ liệu'}</RkText>}
      />
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  container: {
    paddingTop: 10,
  },
  headerCard: {
    flex:1,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',   
    borderLeftWidth: 15,
    borderLeftColor: '#f2b81c',
    borderBottomWidth: 1,
    borderBottomColor: '#f2b81c',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  contentCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',   
    
  },
  icon: {
    padding:10,  
    flex:1
  },
  headertext: {
    paddingLeft: 10,
    fontSize: 20,  
    color: '#f2b81c',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  level: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  levelachievement: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    padding: 10,
    width:wp(20),
    borderBottomWidth: 8,
    borderBottomColor: '#de5145',
    
    //backgroundColor:'#de5145'
  },
  levelContent: {
    padding:10,
    flexDirection: 'column',
    justifyContent:'center',
    //backgroundColor: '#f9bc1a',
    width:wp(80),
    alignItems:'flex-start',
    borderBottomWidth: 8,
    
    borderBottomColor: '#50bbb6',
  }
}));

function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation,viewNotification})(LoyaltyLevelPage);