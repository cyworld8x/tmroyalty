import React from 'react';
import {
  FlatList,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions, Platform , Text
} from 'react-native';
import {
  RkText,
  RkCard, 
  RkStyleSheet,
  RkButton
} from 'react-native-ui-kitten';
import {SocialBar, UserInformationCard, TmTitle, TMService} from '../../components';

import {data} from '../../data';
import NotificationHelper from '../../utils/notificationHelper'
import Carousel , { ParallaxImage, Pagination } from 'react-native-snap-carousel';

import { connect } from 'react-redux';
import { loadingUserInformation,viewNotification} from '../../api/actionCreators';

let moment = require('moment');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
import {FontAwesome} from '../../assets/icons';
const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const borderRadius = 4;
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

import NotificationController from '../notification/NotificationController'
class HomePage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let renderNotification = () => {
      return (
        <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}  onPress={() =>  navigation.navigate('Notification')} style={styles.messageicon} rkType='circle'>
            <RkText rkType='awesome hero' style={styles.icon}>{FontAwesome.bell}</RkText>
            {params!=null && params.NumberOfNotification!=null && params.NumberOfNotification>0&&(<RkText style={styles.notificationtext}>{params.NumberOfNotification.toString()}</RkText>)}
          </TouchableOpacity>
      );
     
    };
    return (
      {
        title: 'TM Loyalty'.toUpperCase(),
        headerRight: renderNotification()
      }
    );
  }


  constructor(props) {
    super(props);
    //console.error(this.props.User);
    //this.props.loadingUserInformation();
    //console.error(this.props.User);
    this.renderItem = this._renderItem.bind(this);
    this.renderCarouselItem = this._renderCarouselItem.bind(this);
    this.state = {
      ActiveSlide: 1,
      banners: [],
      blogs: [],
      services:[],
      isLoading:true
    };
  }

  _keyExtractor(post, index) {
    return 'id-'+post.Id;
  }

  componentDidMount(){
    this.setState({ isLoading: false }, () => {
      if (!this.state.isLoading) {
        this.setState({ isLoading: true });
        {
          this.getNumberOfNotification();
        }
      }
    });
   
  }
  componentWillMount() {
    this.getBanners();
    this.getBlogs();
    this.getServices();
   
  }
  async getNotificationNumber(){
    await this.props.navigation.setParams({
      NumberOfNotification: parseInt(this.props.User.NumberOfNotification!=null?this.props.User.NumberOfNotification:0)
     })
  }

  getBanners(){
    var url = 'http://api-tmloyalty.yoong.vn/banner/home';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {

         this.setState({banners: responseJson});
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  getNumberOfNotification(){
    var url = 'http://api-tmloyalty.yoong.vn/account/totalunread/?AccountId='+this.props.User.Id;
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
        
        if (responseJson!=null) {;
          this.props.navigation.setParams({
            NumberOfNotification: parseInt(responseJson)
           })
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.User.NumberOfNotification) !== JSON.stringify(nextProps.User.NumberOfNotification)) // Check if it's a new user, you can also use some unique, like the ID
    {
      NotificationHelper.Notify(this.props.User.NumberOfNotification);
      this.props.navigation.setParams({
        NumberOfNotification: parseInt(nextProps.User.NumberOfNotification)
       })
    }
  }

  getBlogs(){
    var url = 'http://api-tmloyalty.yoong.vn/blog/showinhome';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {

         this.setState({blogs : responseJson.Items});
         
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  getServices(){
    var url = 'http://api-tmloyalty.yoong.vn/service';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {
          this.setState({services : responseJson.Items});         
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  _renderItem(info) {
   
    return (
      <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('ContentPage', {url:info.item.DetailsUrl, title:info.item.Name})} key={info.item.Id}>
        <RkCard rkType='imgBlock' style={styles.card}>
          <Image rkCardImg source={{uri:info.item.AvatarUrl}} style={{borderRadius: borderRadius}}/>

          <View style={styles.overlay}>
            <RkText rkType='header6 ' numberOfLines={1}>{info.item.Name}</RkText>
            <View style={styles.newsoverlay}>
              <RkText style={styles.time}
                rkType='secondary2 '>{info.item.CategoryName}</RkText>
              <View style={styles.news}/>
              <RkText style={styles.time}
                rkType='secondary2 '>{info.item.CreatedDate}</RkText>
            </View>
          </View>
          
          {/* <View rkCardFooter>
            <SocialBar rkType='space' showLabel={true}/>
          </View > */}
        </RkCard>
      </TouchableOpacity>
    )
  }

  _renderCarouselItem ({item, index}, parallaxProps) {
    return (
      <TouchableOpacity
      delayPressIn={70}
      activeOpacity={0.8}
      onPress={() => { if(item.UrlRef !=null) this.props.navigation.navigate('ContentPage', {url:item.DetailsUrl, title:item.Name})}}>
      <RkCard rkType='imgBlockSmall' style={{borderRadius: borderRadius, backgroundColor:'transparent'}}>
        <Image rkCardImg source={{uri:item.AvatarUrl}} style={{borderRadius: borderRadius}}/>

        {/* <View rkCardImgOverlay rkCardContent style={styles.overlay}>
          <RkText rkType='header4 inverseColor' numberOfLines={1}>{item.Name}</RkText>
          <RkText style={styles.time}
                  rkType='secondary2 inverseColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
        </View> */}
      </RkCard>
    </TouchableOpacity>
    );
}
  render() {
    const { ActiveSlide } = this.state;

    return (
      <ScrollView style={styles.root} >
      <NotificationController/>
       <View rkCardContent>
          {this.props.User!=null && <UserInformationCard rkType='circle medium' data={{name:this.props.User.FullName, balance:this.props.User.LoyaltyAmount}} img={{uri:this.props.User.AvatarUrl!=null&&this.props.User.AvatarUrl.length>0?this.props.User.AvatarUrl:this.props.User.SocialPicture}} />}
          {this.state.banners!=null && this.state.banners.length> 0 && <View >
          
            <Carousel layout={'default'}
              ref={c => this._slider = c}
              data={this.state.banners}
              renderItem={this.renderCarouselItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              firstItem={1}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.7}
              // inactiveSlideShift={20}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContentContainer}
              loop={true}
              loopClonesPerSide={2}
              autoplay={true}
              autoplayDelay={500}
              autoplayInterval={3000}
              onSnapToItem={(index) => this.setState({ ActiveSlide: index })}
            />
            <Pagination
              //dotsLength={this.data.length}
              dotsLength={6}
              activeDotIndex={ActiveSlide}
              containerStyle={styles.paginationContainer}
              dotColor={'rgba(255, 255, 255, 0.92)'}
              dotStyle={styles.paginationDot}
              inactiveDotColor={colors.black}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              carouselRef={this._slider}
              tappableDots={!!this._slider}
            />
          
          </View>
          }
          <TmTitle text='CÁC DỊCH VỤ CỦA TM GROUP' />
          {this.state.services!=null ? <TMService data={this.state.services} navigation={this.props.navigation}/>: <View></View> }
          <TouchableOpacity
            delayPressIn={70}
            activeOpacity={0.8} >
            <RkButton
              style={styles.popupButtonOrder}
              onPress={() => this.props.navigation.navigate('ServicePage')}
              rkType='clear'>
            </RkButton>
            <RkText rkType='header6' onPress={() => this.props.navigation.navigate('ServicePage')} style={{ color: '#FFFFFF', paddingBottom: 40, alignSelf: 'center', marginTop: -42 }}>GỬI YÊU CẦU</RkText>
          </TouchableOpacity>
          <TmTitle text='TIN TỨC VÀ SỰ KIỆN NỔI BẬT' />
          { this.state.blogs!=null && this.state.blogs.length>0 &&  
          <FlatList
          data={this.state.blogs}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          style={styles.container}/>
          }
         
        </View>        
      </ScrollView>
    )
  }
}

export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#21D4FD'
};
let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  container: {
    backgroundColor: theme.colors.screen.base,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius,
  },
  card: {
    marginVertical: 1,
    borderRadius: borderRadius,
    borderColor: 'transparent',
  },
  cardswiper: {
    borderTopRightRadius: borderRadius,
  },
  newsoverlay: {
    flexDirection: 'row',
  },
  overlay: {
    paddingTop: 10,
    paddingBottom: 15,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius
  },
  time: {
    marginTop: 5
  },
  newsarea: {
    flexDirection: 'row',
    marginHorizontal: 10
  },
  news: { marginHorizontal: 12, marginTop: 12, backgroundColor: '#999999', width: 6, height: 6, borderRadius: 3 },
  avatar: {
    marginRight: 17,
    flex: 1,
  },
  item: {
    flex: 1
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius
  },
  scrollview: {
    flex: 1
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  titleDark: {
    color: colors.black
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  slider: {
    marginTop: 15,
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? 8 : 0,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80
  },
  popupButtonOrder: {
    flex: 1,
    width:200,
    alignSelf: 'center',
    height: 0,
    borderTopColor: "#000000",
    borderTopWidth: 40,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  messageicon: {
    width: 36,
    height: 36,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    flexDirection: 'row',
    
  },
  
  icon: {
    width: 36,
    color:  theme.colors.screen.fontcolor,
    textAlign:'center',
    alignSelf: 'center',
    fontSize: 28,
  },
  notificationtext: {
    borderRadius:9,
    backgroundColor:'green',
    width: 18,    
    color: theme.colors.screen.base,
    fontWeight: 'bold',
    textAlign:'center',
    alignSelf: 'center',
    right:0,
    position: 'absolute',
    fontSize: 10,
  }
}));


function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation,viewNotification})(HomePage);