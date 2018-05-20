import React from 'react';
import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  WebView,
  Dimensions,
  Spinner,
  FlatList
} from 'react-native';
import {
  RkCard,
  RkText,
  RkStyleSheet,RkTheme
} from 'react-native-ui-kitten';
import {data} from '../../data';
import {Avatar} from '../../components';
import {SocialBar} from '../../components';
let moment = require('moment');

import DateHelper from '../../utils/dateHelper';
const deviceHeight = Dimensions.get("window").height;

const deviceWidth = Dimensions.get("window").width;
const logo = require('../../assets/images/logo@x2.png')
import { connect } from 'react-redux';
import { bookmarkPost } from '../../api/actionCreators';
import NotificationHelper from '../../utils/notificationHelper';



const script = `<script>
                       ;(function() {
                        var calculator = document.createElement("div");
                        calculator.id = "height-calculator";
                        while (document.body.firstChild) {
                            calculator.appendChild(document.body.firstChild);
                        }
                        document.body.appendChild(calculator);
                        var images = document.getElementsByTagName('img'); 
                        var srcList = [];
                        for(var i = 0; i < images.length; i++) {
                            srcList.push(images[i].src);
                        }
                        var allimgs = document.images;
                        for (var i = 0; i < allimgs.length; i++) {
                            allimgs[i].onerror = function() {
                                this.style.visibility = "hidden"; // Other elements aren't affected. 
                            }
                        }
                        var i = 0;
                        function updateHeight() {
                            document.title = calculator.clientHeight;
                            window.location.hash = ++i;
                        }
                        updateHeight();
                       
                        window.addEventListener("load", function() {
                            updateHeight();
                            setTimeout(updateHeight, 1000);
                        });
                        window.addEventListener("resize", updateHeight);
                        }());
                        </script>`;
const htmlStyle = `<style>
        body, html, #height-calculator {
            margin: 0;
            padding: 0;
            color: [FONTWEBGDPT];
            text-align: justify;
        }
        #height-calculator {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
        }
        @font-face {font-family: 'OpenSans-Light';src: url('file:///app/assets/fonts/rubicon-icon-font.ttf') format('truetype');}";
        body {
            width:98%;
        }
        h2 {
            font-size: 18px;
            color: '#A8A8A8';
        }
        p {
            font-size: 18px;
        }
        h3 {
            font-size: 32px
        }
        img {
            //width:100% !important;
            height:auto !important;
            max-width: 100% !important;
        }
        td {
            display: block !important;
            width: 100% !important;
        }
        hr {
            width: 98%;
        }
        ol li ol li ol li {
            position: relative; right: 85px;
        }
        ul {
            width: 98%,
            margin-left: -25px;
        }
        li {
            width: 98%;
        }
        .tabs {
            display: none;
        }
        .tabs > li {
            display: none;
        }
        .tabs-content {
            padding: 0;
            list-style-type: none;
        }
        tr {
            display: flex;
            flex-direction: column;
        }
</style>`;
class DetailPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    
    return {
      title: params ? params.categoryname : '...',
    }
  };

  constructor(props) {
    super(props);
    this.data = this.props.navigation.state.params.post;
    this.state = {
      isLoading: true,
      Height: deviceHeight,
    };
    this.renderItem = this._renderItem.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  onNavigationStateChange(event) {
       
    if (event.title ) {
        const htmlHeight = Number(event.title);//convert to number
        if(htmlHeight>0){
            this.setState({Height:htmlHeight});
            
        }
        
    }

 }

  componentWillMount() {

    var url = this.props.navigation.state.params.post.api;
    //console.error(this.props);
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
      
        if (responseJson.length > 0) {

        
          //console.error(responseJson[0]);
          this.arr = responseJson[0].posts;
          this.setState({
            isLoading: false,
            post: responseJson[0],
            postcontent: htmlStyle + '<body>' + responseJson[0].content + '</body>' + script,
            posts: responseJson[0].posts,
            isShowAd: true,
          }, function () {
            this.props.postcontent = this.state.postcontent;
            //  this.saveUserState();
          });

        }

      })
      .catch((error) => {
        NotificationHelper.Notify('Kết nối không thành công!');
        this.props.navigation.navigate('SplashScreen');
      });
  }

  _keyExtractor(post, index) {
    return post.id;
  }

  _renderItem(info) {
    return (
      <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('DetailPage', {post: info.item, categoryname: info.item.categoryname})}>
        <RkCard rkType='blog' style={styles.card}>
          <Image rkCardImg source={{uri:info.item.image}}/>
          <View rkCardHeader style={styles.content}>
            {/* <RkText style={styles.section} rkType='header4'>{info.item.title}</RkText> */}
          </View>
          <View rkCardContent>
            <View>
              <RkText rkType='primary3 mediumLine' numberOfLines={2}>{info.item.title}</RkText>
            </View>
          </View>
          <View rkCardFooter>
            <View style={styles.userInfo}>
              <Avatar style={styles.avatar} rkType='circle small' img={logo}/>
            </View>
            <RkText rkType='secondary2 hintColor'>{info.item.date}</RkText>
          </View>
        </RkCard>
      </TouchableOpacity>
    )
  }


  render() {
    if(!this.state.isLoading && this.state.postcontent != null ){
      //console.error(this.state.postcontent.replace("[FONT]", RkTheme.current.colors.fontcolorhtml))
    }
    
    return (
      <ScrollView style={styles.root} ref='_scrollView' scrollEnabled={true}>
        <RkCard rkType='article'>
          <Image rkCardImg source={{uri:this.data.image}}/>
          <View rkCardHeader>
            <View>
              {/* <RkText style={styles.title} rkType='header4'>{this.data.title}</RkText> */}
              <RkText rkType='secondary2 hintColor'>{moment().add(this.data.date, 'seconds').fromNow()}</RkText>
            </View>
            <TouchableOpacity>
              <Avatar rkType='circle' img={logo}/>
            </TouchableOpacity>
          </View>
          <View rkCardContent>
            <View>
              <RkText rkType='primary3 bigLine'>{this.data.title}</RkText>
            
            </View>
          </View>
          <View rkCardFooter>
            <SocialBar rkType='space' comments={DateHelper.getView(this.data.date,this.data.id)} showLabel={false}/>

            
          </View >
          {!this.state.isLoading && this.state.postcontent != null ?
            <View  style={{ paddingTop: 10, height: this.state.Height, flex:1, justifyContent: 'center', alignItems: 'center',}}>
           
              <WebView scrollEnabled={false}

                ref='_webView'
                domStorageEnabled={false}
                source={{ html: this.state.postcontent.replace("[FONTWEBGDPT]", RkTheme.current.colors.fontcolorhtml), baseUrl: this.props.Settings.WebsiteUrl }}
                style={{ height: this.state.Height, width: deviceWidth - 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
                automaticallyAdjustContentInsets={false}

                renderLoading={() => {
                  return <View style={{ flex: 1 }}>
                    <Spinner style={{ paddingTop: deviceHeight / 2 }} color='green' />
                  </View>
                }
                }
                onNavigationStateChange={this.onNavigationStateChange.bind(this)}>
              </WebView> 
             
              </View>
              : <View></View>
            }
          {!this.state.isLoading && this.state.posts != null ?<View style={{ paddingTop: 10, flex:1, justifyContent: 'center', alignItems: 'center'}}><FlatList
              data={this.state.posts}
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
              style={styles.container}/></View>: <View></View>}
         
        </RkCard>
      </ScrollView>
    )
  }
  
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  title: {
    marginBottom: 5
  },
  container: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  card: {
    marginVertical: 8,
  },
  fontColor:theme.color,
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    marginRight: 17
  }
}));
function mapStateToProps(state) {
  return { 
     FavoritedPosts: state.Storage.FavoritedPosts,
     Settings: state.Settings
  };
}

export default connect(mapStateToProps,{bookmarkPost})(DetailPage);