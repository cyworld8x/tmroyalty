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
import { loadingUserInformation } from '../../api/actionCreators';
import NotificationHelper from '../../utils/notificationHelper';
import {NavigationActions} from 'react-navigation';

import {GradientButton} from '../../components/gradientButton';
import {DefaultRoutes} from '../../config/navigation/routes';
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
class WebPage extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: state && state.params? state.params.title : '...',
    }
  };
  _getRoute(navigation){
    let page =  {
      url: 'http://api-tmloyalty.yoong.vn/topic/dieu-khoan-va-thoa-thuan-su-dung',
    };
    
    switch(navigation.routeName){
      case 'TermAndCondition':
      return {
        url: 'http://api-tmloyalty.yoong.vn/topic/dieu-khoan-va-thoa-thuan-su-dung',
      }; break;
      case 'PrivacyPolicy':
      return {
        url: 'http://api-tmloyalty.yoong.vn/topic/quyen-rieng-tu',
      }; break;
      case 'AboutTMGroup':
      return {
        url: 'http://api-tmloyalty.yoong.vn/topic/ve-tm-group',
      }; break;
      case 'AboutTMLoyalty':
      return {
        url: 'http://api-tmloyalty.yoong.vn/topic/ve-tm-loyalty',
        title:'Về TM Loyalty'
      }; break;
      case 'UserGuide':
      return {
        url: 'http://api-tmloyalty.yoong.vn/topic/huong-dan-su-dung',
      }; break;
    }
   
    return page;
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      Height: deviceHeight,
    };
    this.getRoute = this._getRoute.bind(this);
    
    this.page = this.getRoute(this.props.navigation.state);
    
    this._navigateAction = this._navigate.bind(this);
  }

  _onNavigationStateChange(event) {
       
    if (event.title ) {
        const htmlHeight = Number(event.title);//convert to number
        if(htmlHeight>0){
            this.setState({Height:htmlHeight});
            //NotificationHelper.Notify(htmlHeight);
        }
    }

 }

 
 _navigate(route) {
  let resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName: route.id})
    ]
  });
  this.props.navigation.dispatch(resetAction)
}

  componentWillMount() {

    var url = this.page.url;
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {

          this.setState({
            isLoading: false,
            content: htmlStyle + '<body>' + responseJson.FullDescription + '</body>' + script,
            isShowAd: true,
          });

        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
        _navigate('SplashScreen');
      });
  }


  render() {
    return (
      <View style={styles.container}>
       


        {!this.state.isLoading && this.state.content != null ?
          <View style={{ paddingTop: 10, height: this.state.Height, flex: 1, justifyContent: 'center', alignItems: 'center', }}>
           
            <WebView scrollEnabled={false}

              ref='_webView'
              domStorageEnabled={false}
              source={{ html: this.state.content.replace("[FONTWEBGDPT]", RkTheme.current.colors.fontcolorhtml), baseUrl: 'http://api-tmloyalty.yoong.vn/' }}
              style={{ height: this.state.Height, width: deviceWidth - 20, flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
              automaticallyAdjustContentInsets={false}

              renderLoading={() => {
                return <View style={{ flex: 1 }}>
                  <Spinner style={{ paddingTop: deviceHeight / 2 }} color='green' />
                </View>
              }
              }
              onNavigationStateChange={this._onNavigationStateChange.bind(this)}>
            </WebView>  
            <GradientButton style={styles.agreeButton}
              text={this.props.navigation.routeName=='TermAndCondtion'?'Tôi đồng ý':'Quay lại'}
              onPress={() => {
                this._navigateAction(DefaultRoutes);
              }} />
          </View> : <View />}
      </View>
    );
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
    flex:1,
    backgroundColor: theme.colors.screen.base,
  },
  card: {
    marginVertical: 8,
  },
  agreeButton:{
    margin:8,
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
    User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation})(WebPage);