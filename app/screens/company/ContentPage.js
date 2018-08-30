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
  RkStyleSheet,
  RkTheme,
  RkButton
} from 'react-native-ui-kitten';
import {data} from '../../data';
import {Avatar} from '../../components';
import {SocialBar,TmTitle, TMService} from '../../components';
import {FontAwesome} from '../../assets/icons';
import NotificationHelper from '../../utils/notificationHelper';

import { connect } from 'react-redux';
import { loadingUserInformation} from '../../api/actionCreators';
let moment = require('moment');
import {TMReview} from '../../components';
const deviceHeight = Dimensions.get("window").height;

const deviceWidth = Dimensions.get("window").width;
function wp (percentage) {
  const value = (percentage * deviceWidth) / 100;
  return Math.round(value);
}
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

class ContentPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: state && state.params? state.params.title : '...',
    }
    
  };

  constructor(props) {
    super(props);
    let { params } = this.props.navigation.state;
    
    this.title = params.title;
    this.id = params.id;
    this.state = {
      isLoading: true,
      Height: deviceHeight,
      post: null,
      review:null,
      ShareLink: null,
      ShareFormat: null
    };
    
    this.renderItem = this._renderItem.bind(this);    
    this.renderStar = this._renderStar.bind(this);
  }
  _onNavigationStateChange(event) {

    if (event.title) {
      const htmlHeight = Number(event.title);//convert to number
      if (htmlHeight > 0) {
        this.setState({ Height: htmlHeight });
        //NotificationHelper.Notify(htmlHeight);
      }
    }

  }



  componentWillMount() {
    this.getcontent();
    //this.getReviewSummary();
  }
  // getReviewSummary() {
  //   var url = 'http://api-tmloyalty.yoong.vn/review/summary';
  //   return fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + this.props.User.AccessToken.split('__')[0]
  //     },
  //     body: JSON.stringify({
  //       EntityId: this.id,
  //       EntityName: 'Category'
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {

  //       if (responseJson != null && responseJson.StatusCode == 2) {
  //         this.setState({review:responseJson.Data})
  //       }else{
  //         NotificationHelper.Notify(responseJson.Message);
  //       }

  //     })
  //     .catch((error) => {
  //       if (__DEV__) {
  //         console.error(error);
  //       }
  //       NotificationHelper.Notify('Kết nối không thành công!');
  //     });
  // }


  getcontent() {
    var url = 'http://api-tmloyalty.yoong.vn/service/GetCategoryServiceDetails';
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.User.AccessToken.split('__')[0]
      },
      body: JSON.stringify({
        AccountId: this.props.User.Id,
        Id: this.id
      }),
    })
    
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson != null) {
          this.setState({
            isLoading: false,
            content: htmlStyle + '<body>' + responseJson.FullDescription + '</body>' + script,
            post: responseJson,
            posts: responseJson.ListRelatedPost,
            review: responseJson.ReviewSummaryViewModel,
            ShareLink: responseJson.ShareLink,
            ShareFormat: responseJson.ShareFormat
          });
         
          
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  _renderStar(){
    if(this.state.review!=null && this.state.review.AverageRating!=null)
    {
      return(<TMReview data={this.state.review} navigation={this.props.navigation}/>);
    }else{
      return <View/>;
    }
  
  }

  
  _keyExtractor(post, index) {
    return `K`+post.id;
  }

  _renderItem(info) {
   
    return (
      <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('NewsPage', {url:info.item.DetailsUrl, title:info.item.Name, id:info.item.Id})} key={info.item.Id}>
        <RkCard rkType='imgBlock' style={styles.card} key={info.item.Id}>
          <Image rkCardImg source={{uri:info.item.AvatarUrl}} style={{borderRadius: 4}}/>

          <View style={styles.overlay}>
            <RkText rkType='header6 ' style={{paddingTop:5}} numberOfLines={1}>{info.item.Name}</RkText>
            <View style={styles.cardoverlay}>
              <RkText style={styles.cardtime}
                rkType='secondary2 '>{info.item.ShortDescription}</RkText>
             
            </View>
          </View>
          
          {/* <View rkCardFooter>
            <SocialBar rkType='space' showLabel={true}/>
          </View > */}
        </RkCard>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <ScrollView style={styles.root}>
      { !this.state.isLoading && this.state.content!=null &&
         <RkCard rkType='article'>
          <Image rkCardImg style={{resizeMode: 'cover'}} source={{uri:this.state.post.AvatarUrl}}/>
          <View rkCardHeader>
            <View>
              <RkText style={styles.title} rkType='header4'>{this.state.post.ShortDescription}</RkText>
              {/* <RkText rkType='secondary2 hintColor'>{this.state.post.UpdatedDate}</RkText> */}
            </View>
          </View>         
          {this.renderStar()}
         
          <View style={{ flexDirection: 'row', paddingHorizontal:20}}>
         
              <RkButton onPress={() => this.props.navigation.navigate('ReviewServicePage', {data:this.state.review, EntityId:this.id, ShareFormat:this.state.ShareFormat,ShareLink:this.state.ShareLink})}
                style={{
                  flex: 1,
                  height: 40,
                  marginVertical: 10,
                  backgroundColor: '#242424'
                }}
                rkType='clear'>
                <RkText style={{ color: '#FFFFFF' }} rkType='light'>Đánh giá</RkText>
              </RkButton>
              <View style={{ width: 10 }} />
              <RkButton  onPress={() => this.props.navigation.navigate('ServicePage')}
                style={{
                  flex: 1,
                  height: 40,
                  marginVertical: 10,
                  backgroundColor: '#f9bc1a'
                }}
                rkType='clear'>
                <RkText style={{ color: '#FFFFFF' }}>Yêu cầu dịch vụ</RkText>
              </RkButton>
            </View>
          <View rkCardContent>
              <WebView scrollEnabled={false}

                ref='_webView'
                domStorageEnabled={false}
                source={{ html: this.state.content.replace("[FONTWEBGDPT]", RkTheme.current.colors.fontcolorhtml), baseUrl: 'http://api-tmloyalty.yoong.vn/' }}
                style={{ height: this.state.Height, width: deviceWidth - 30, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
                automaticallyAdjustContentInsets={false}

                renderLoading={() => {
                  return <View style={{ flex: 1 }}>
                    <Spinner style={{ paddingTop: deviceHeight / 2 }} color='green' />
                  </View>
                }
                }
                onNavigationStateChange={this._onNavigationStateChange.bind(this)}>
              </WebView> 
          </View>
        
          <View rkCardFooter>
         
          { this.state.posts!=null && this.state.posts.length>0 &&  
          <FlatList
          data={this.state.posts}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          ListHeaderComponent={<TmTitle text='TIN TỨC DỊCH VỤ LIÊN QUAN' />}
          style={styles.container}/>
          }
          </View>
           
        </RkCard>
          
      
    
      }
       </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {      
    flex:1,
    backgroundColor: theme.colors.screen.base,
  },
  root: {
    backgroundColor: theme.colors.screen.base
  },
  title: {
    marginBottom: 5
  },
  card: {
    marginVertical: 1,
    borderRadius: 4,
    borderColor: 'transparent',
  },
  cardcontainer: {
    backgroundColor: theme.colors.screen.scroll,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  cardoverlay: {
    paddingTop: 10,
    paddingBottom: 15,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  cardtime: {
    marginTop: 5
  },
  cardnews: { 
    marginHorizontal: 12, 
    marginTop: 12, 
    backgroundColor: '#999999', 
    width: 6, 
    height: 6, 
    borderRadius: 3 },
}));


function mapStateToProps(state) {
  return { 
    User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation})(ContentPage);