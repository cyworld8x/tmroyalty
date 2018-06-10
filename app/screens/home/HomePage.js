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
  RkCard, RkStyleSheet
} from 'react-native-ui-kitten';
import {SocialBar, UserInformationCard, TmTitle, TMService} from '../../components';
import {data} from '../../data';

import NotificationHelper from '../../utils/notificationHelper'
import Carousel , { ParallaxImage, Pagination } from 'react-native-snap-carousel';
let moment = require('moment');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const borderRadius = 4;
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class HomePage extends React.Component {
  static navigationOptions = {
    title: 'TM Loyalty'.toUpperCase()
  };

  constructor(props) {
    super(props);
    
    this.data = data.getnews('news');
    this.user = data.getUserInfo();
    this.renderItem = this._renderItem.bind(this);
    this.renderCarouselItem = this._renderCarouselItem.bind(this);
    this.state = {
      ActiveSlide: 1,
      banners: [],
      blogs: [],
      services:[]
    };
  }

  _keyExtractor(post, index) {
    return 'id-'+post.Id;
  }

  componentWillMount() {
    this.getBanners();
    this.getBlogs();
    this.getServices();
  }

  getBanners(){
    var url = 'http://api-tmloyalty.yoong.vn/banner/home';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {

         this.setState({banners: responseJson});
         //NotificationHelper.Notify(JSON.stringify(responseJson));
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
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
        onPress={() => this.props.navigation.navigate('Article', {id: info.item.Id})} key={info.item.Id}>
        <RkCard rkType='imgBlock' style={styles.card}>
          <Image rkCardImg source={{uri:info.item.AvatarUrl}} style={{borderRadius: borderRadius}}/>

          <View rkCardImgOverlay rkCardContent style={styles.overlay}>
            <RkText rkType='header6 inverseColor' numberOfLines={1}>{info.item.Name}</RkText>
            <View style={styles.newsoverlay}>
              <RkText style={styles.time}
                rkType='secondary2 inverseColor'>{info.item.CategoryName}</RkText>
              <View style={styles.news}/>
              <RkText style={styles.time}
                rkType='secondary2 inverseColor'>{info.item.CreatedDate}</RkText>
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
      onPress={() => this.props.navigation.navigate('Article', {id:item.id})}>
      <RkCard rkType='imgBlockSmall' style={{borderRadius: borderRadius, backgroundColor:'transparent'}}>
        <Image rkCardImg source={{uri:item.AvatarUrl}} style={{borderRadius: borderRadius}}/>

        <View rkCardImgOverlay rkCardContent style={styles.overlay}>
          <RkText rkType='header4 inverseColor' numberOfLines={1}>{item.Name}</RkText>
          {/* <RkText style={styles.time}
                  rkType='secondary2 inverseColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText> */}
        </View>
      </RkCard>
    </TouchableOpacity>
    );
}
  render() {
    const { ActiveSlide } = this.state;

    return (
      <ScrollView style={styles.root} >
       <View rkCardContent>
          <UserInformationCard rkType='circle medium' data={{name:this.user.name, balance:this.user.balance}} img={{uri:this.user.picture}} />
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
    marginVertical: 8,
    borderRadius: borderRadius,
  },
  cardswiper: {
    borderTopRightRadius: borderRadius,
  },
  newsoverlay: {
    flexDirection: 'row',
  },
  overlay:{
    borderTopLeftRadius:borderRadius,
    borderTopRightRadius:borderRadius
  },
  time: {
    marginTop: 5
  },
  newsarea: {
    flexDirection: 'row',
    marginHorizontal: 10
  },
  news: { marginHorizontal: 12, marginTop:12, backgroundColor:'#999999', width:6, height:6, borderRadius:3},
  avatar: {
    marginRight: 17,
    flex: 1,
  },
  item:{
    flex:1
  },
  imageContainer: {
    flex: 1,
    marginBottom:  Platform.OS === 'ios' ? 0 : -1, // Prevent a random Android rendering issue
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
        borderRadius: Platform.OS === 'ios'  ? 8 : 0,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80
    },
}));