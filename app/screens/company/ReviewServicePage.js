import React from 'react';
import {
  TouchableOpacity,
  FlatList,
  View,
  Image,
  ScrollView,
  Dimensions,
  TextInput
} from 'react-native';
import {RkStyleSheet, RkText,RkCard,RkButton} from 'react-native-ui-kitten';
import {Avatar} from '../../components';
let moment = require('moment');

import {NavigationActions} from 'react-navigation';
import { connect } from 'react-redux';
import { loadingUserInformation } from '../../api/actionCreators';

import NotificationHelper from '../../utils/notificationHelper'
import {FontAwesome} from '../../assets/icons';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
function wp (percentage) {
  const value = (percentage * deviceWidth) / 100;
  return Math.round(value);
}
import Facebook from '../other/Facebook';
import {TMReview} from '../../components';
class ReviewServicePage extends React.Component {
  static navigationOptions = {
    title: 'Đánh giá dịch vụ'
  };

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.shareLinkContent = {
      contentType: 'link',
      contentTitle: this.params.ShareFormat,
      contentUrl: this.params.ShareLink,
      contentDescription: this.params.ShareFormat
    };
    //console.error(this.shareLinkContent);
    this.data = [];
    
    this.state = {
      refreshing: false,
      page: 1,
      Content:'',
      Rate:0
    };
    this.navigateAction = this._navigateAction.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }
  componentWillMount(){
    this.setState({page:1}, this.getReviews)
  }
  getReviews(){
      
    var url = 'http://api-tmloyalty.yoong.vn/review/getreviews';
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
        },
        body: JSON.stringify({
            EntityName: 'Category',
            EntityId: this.params.EntityId,
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
        if (__DEV__) {
          console.error(error);
        }
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }


  facebookCallback(result){
    if(result.Status!=null){
      if(__DEV__)
      {
        NotificationHelper.Notify(``+result.Status);
      }
      
    }
  }
  submitReview(){
    const shareLinkContent = this.shareLinkContent;
    if(this.state.Content.length==null || this.state.Rate==0){
      return;
    }
    let that = this;
    var url = 'http://api-tmloyalty.yoong.vn/review/SubmitReview';
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
        },
        body: JSON.stringify({
            EntityName: 'Category',
            EntityId: this.params.EntityId,
            AccountId:this.props.User.Id,
            Content : this.state.Content,
            Rate : this.state.Rate,
            IsSharedThis:false
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson!=null&& responseJson.StatusCode==2) {
          this.setState({Rate:0, Content:''});
          Facebook.share(shareLinkContent, that.facebookCallback);
          //NotificationHelper.Notify(responseJson.Message);
          
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


  _navigateAction(click_action, data) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: click_action,params:data })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

    renderStar(star) {

        let stars = [];
        for (let i = 1; i <= 5; i++) {

            stars.push(<RkText key={'' + i} style={{ color: i <= star ? 'yellow' : 'gray' }} rkType='awesome secondaryColor'>{FontAwesome.star}</RkText>);
        }
        return stars;
    }

    renderRate() {

        let stars = [];
        for (let i = 1; i <= 5; i++) {

            stars.push(<TouchableOpacity
                delayPressIn={70}
                activeOpacity={0.8}
                onPress={() => this.setState({Rate:i},this.renderRate) } key={'' + i} >
                <RkText style={[{ color: i<=this.state.Rate?'yellow': 'gray' },styles.star]}   rkType='awesome secondaryColor'>{FontAwesome.star}</RkText></TouchableOpacity>);
        }
        return stars;
    }
    _renderRow(row) {

        return (<View rkCardHeader style={styles.rootContainer} key={row.item.Id}>
            <View style={styles.reviewcontainer}>
                <View style={styles.starReview}>
                    <Avatar img={{uri:row.item.AvatarUrl}}
                        rkType='circle'
                        style={styles.avatar}
                    />
                    <RkText rkType='secondary6' style={{flexWrap: 'wrap'}}>{row.item.FullName||'Unknown'}</RkText>

                </View>
                <View style={styles.barReview}>
                    <View style={styles.stars}>
                        {this.renderStar(row.item.Rate)}
                        
                    </View>
                    <RkText rkType='secondary6' style={{flexWrap: 'wrap'}}>{row.item.Content}</RkText>
                </View>
            </View>

        </View>)
    }

  _keyExtractor(item, index) {
    return item.Id.toString();
  }

  onLoadMore() {
    if (!this.state.refreshing) {
      this.setState({page : this.state.page + 1,refreshing: true}, this.getReviews );
    }

  }

  render() {
    return (
        <ScrollView style={styles.root}>

            <RkCard rkType='article'>
                <View rkCardHeader>
                    <TMReview data={this.params.data} navigation={this.props.navigation} />
                </View>
                <View rkCardHeader style={{ flexDirection: 'column'}}>
                <RkText  rkType='primary2'>{'GỬI NHẬN XÉT CỦA BẠN'}</RkText>
                <RkText  rkType='secondary6'>{'Đánh giá của bạn về dịch vụ này'}</RkText>
                <View style={styles.stars}>{this.renderRate(this.state.Rate)}</View>
                <RkText  rkType='secondary6'>{'Viết nhận xét của bạn về dịch vụ này'}</RkText>
                <TextInput style={styles.textarea} multiline={true}    
                 placeholder='Nội dung' maxLength={200} value ={this.state.Content} onChangeText={(text) => this.setState((state)=> (state.Content=text, state))} />
                    <View style={{ flexDirection: 'row', justifyContent:'center', alignItems:'center' }}>

                        <RkButton onPress={() => this.submitReview()}
                            style={{
                                width:160,
                                height: 40,
                                marginVertical: 10,
                                backgroundColor: '#f9bc1a'
                            }}
                            rkType='clear'>
                            <RkText rkType='primary2' style={{ color: '#FFFFFF' }}>Gửi nhận xét</RkText>
                        </RkButton>
                    </View>
                </View>
                <View rkCardContent> 
                <FlatList
      style={styles.root}
      data={this.data}
      renderItem={this.renderRow}
      keyExtractor={this._keyExtractor}
      onEndReached={this.onLoadMore.bind(this)}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<RkText rkType='header6' style={{ paddingHorizontal: 20, fontStyle: 'italic', }}>{'Không có dữ liệu'}</RkText>}
      />
                </View>
            </RkCard>
        </ScrollView>
    
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
    rootContainer: {
        flexDirection: 'column',
        paddingVertical: 5,
    },
    reviewcontainer: { flexDirection: 'row', flex: 1 },
    starReview: { width: wp(25), flexDirection: 'column', alignItems: 'center' },
    barReview: { width: wp(75) },
    stars: { flexDirection: 'row', flex: 1, paddingVertical: 5 },
    summary: { flexDirection: 'row', flex: 1, alignItems: 'flex-end', paddingVertical: 5 },
    message: {
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
    },
    star:{
        fontSize:26,
        paddingHorizontal: 10,
    },
    textarea: {
        minHeight: 80,
        borderRadius: 5,
        marginVertical: 10,
        borderColor: '#f9bc1a',
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'Roboto-Regular'
      },
}));

function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation})(ReviewServicePage);