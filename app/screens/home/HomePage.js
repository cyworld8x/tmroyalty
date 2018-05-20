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
import {SocialBar, UserInformationCard} from '../../components';
import {data} from '../../data';
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

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class HomePage extends React.Component {
  static navigationOptions = {
    title: 'TM Royalty'.toUpperCase()
  };

  constructor(props) {
    super(props);

    this.data = data.getArticles();
    this.renderItem = this._renderItem.bind(this);
    this.state = {
      ActiveSlide: 1
  };
  }

  _keyExtractor(post, index) {
    return post.id;
  }

  _renderItem(info) {
    return (
      <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('Article', {id: info.item.id})}>
        <RkCard rkType='imgBlock' style={styles.card}>
          <Image rkCardImg source={info.item.photo}/>

          <View rkCardImgOverlay rkCardContent style={styles.overlay}>
            <RkText rkType='header4 inverseColor' numberOfLines={1}>{info.item.header}</RkText>
            <RkText style={styles.time}
                    rkType='secondary2 inverseColor'>{moment().add(info.item.time, 'seconds').fromNow()}</RkText>
          </View>
          <View rkCardFooter>
            <SocialBar rkType='space' showLabel={true}/>
          </View >
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
      <RkCard rkType='imgBlock' style={{borderRadius: 8}}>
        <Image rkCardImg source={item.photo} style={{borderRadius: 8}}/>

        <View rkCardImgOverlay rkCardContent style={[styles.overlay,{borderTopLeftRadius: 8, borderTopRightRadius: 8}]}>
          <RkText rkType='header4 inverseColor' numberOfLines={1}>{item.header}</RkText>
          <RkText style={styles.time}
                  rkType='secondary2 inverseColor'>{moment().add(item.time, 'seconds').fromNow()}</RkText>
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
          <UserInformationCard rkType='circle medium' data={{name:'Nguyễn Thái Bình', balance:50000}} img={{uri:'https://s3.amazonaws.com/wspimage/hshot_tsukernik.jpg'}} />
          <View >
          <Carousel layout={'default'}
                  ref={c => this._slider = c}
                  data={this.data}
                  renderItem={this._renderCarouselItem}
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
                  onSnapToItem={(index) => this.setState({ ActiveSlide: index }) }
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
          <FlatList
          data={this.data}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          style={styles.container}/>
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
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  card: {
    marginVertical: 8,
  },
  cardswiper: {
    borderTopRightRadius: 8,
  },
  time: {
    marginTop: 5
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
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