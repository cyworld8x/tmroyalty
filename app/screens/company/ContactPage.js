import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  FlatList,
  TextInput
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
  
} from 'react-native-ui-kitten';
import {NavigationActions} from 'react-navigation';
import {FontAwesome} from '../../assets/icons';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

import {TmTitle} from '../../components';
import NotificationHelper from '../../utils/notificationHelper'
export default class ContactPage extends React.Component {
  static navigationOptions = {
    title: 'Liên hệ'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      FullName: '',
      Phone: '',
      Email: '',
      Content: '',
      userid:'',
      locations: []
    };

    
    this.SubmitContact = this._SubmitContact.bind(this);
    this.Validate = this._validate.bind(this);
    this.RenderLocation = this._renderLocation.bind(this);
  
    this._navigateAction = this._navigate.bind(this);
  }

  _navigate() {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }
  componentWillMount() {
    this.getLocations();
  }
  getLocations(){
    var url = 'http://api-tmloyalty.yoong.vn/contact/getAllLocation';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {

         this.setState({locations: responseJson});
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  _renderLocation(info) {
   
    return (
      <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>{info.item.GroupName}</RkText>
          </View>
          {info.item.LocationDetails.map((location) => {
            return (
              <View>
                <View style={styles.row}>
                  <View style={styles.text}>
                    <RkText rkType='awesome' style={styles.iconbullet}>{FontAwesome.homepage}</RkText>
                    <RkText rkType='primary header6' style={{color: '#41abe1' }}>{location.Name}</RkText>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.text}>
                    <RkText rkType='awesome' style={styles.iconbullet}>{FontAwesome.contact}</RkText>
                    <RkText rkType='header6'>{location.Phone}</RkText>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.text}>
                    <RkText rkType='awesome' style={styles.iconbullet}>{FontAwesome.location}</RkText>
                    <RkText rkType='header6' style={{ paddingRight: 15, }}>{location.Address}</RkText>
                  </View>
                </View>
                
              </View>
            )
          })}
         
        </View>
    )
  }

  _keyExtractor(post, index) {
    return 'id-'+index;
  }
  render() {
    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../../assets/images/logo.png')}/>;
      return <Image style={styles.image} source={require('../../assets/images/logoDark.png')}/>
    };
    return (
      <ScrollView>
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
      
          {/* <View style={{ alignItems: 'center' }}>
            {renderIcon()}
            <RkText rkType='h1'>Liên hệ</RkText>
          </View> */}
          <View style={styles.content}>
            <View>
            <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"   placeholder='Họ & Tên' maxLength={100} returnKeyLabel = {"next"} value ={this.state.FullName} onChangeText={(text) => this.setState({FullName:text})}/>
            <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  placeholder='Số điện thoại' maxLength={100}  keyboardType = 'numeric' returnKeyLabel = {"next"} value ={this.state.Phone} onChangeText={(text) => this.setState({Phone:text})}/>
            <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  placeholder='Email'  maxLength={100} value ={this.state.Email} onChangeText={(text) => this.setState({Email:text})}/>
            <TextInput style={styles.textArea}  underlineColorAndroid = "transparent"   multiline={true}
                numberOfLines={4} placeholder='Nội dung liên hệ' maxLength={1000} value ={this.state.Content} onChangeText={(text) => this.setState({Content:text})} />
            

               <RkButton onPress={() => this.SubmitContact()}
                          style={styles.popupButtonOK}
                          rkType='clear'>
                  <RkText style={{color:'#FFFFFF'}}>GỬI YÊU CẦU</RkText>
                </RkButton>
            </View>
            <View style={styles.footer}>
              <View style={styles.textRow}>
                <TmTitle text='' />
                <RkText rkType='primary3'>TM LOYALTY</RkText>
              </View>
            </View>
          </View>
         
          <FlatList
          data={this.state.locations}
          renderItem={this.RenderLocation}
          keyExtractor={this._keyExtractor}
          />
        
      </RkAvoidKeyboard>
      </ScrollView>
    )
  }
  _validate(){
    if(this.state.FullName.length==0){
      NotificationHelper.Notify("Vui lòng nhập tên liên hệ");
    } else if(this.state.Content.length==0){
      NotificationHelper.Notify("Vui lòng nhập nội dung");
    } else if(this.state.Phone.length==0){
      NotificationHelper.Notify("Vui lòng nhập số điện thoại");
    } else{
      return true;
    }
    return false;
  }
  _SubmitContact() {
    try{
    let navigation = this.props.navigation;
      if (this.Validate() == false) {
        return;
      } else {
        fetch('http://api-tmloyalty.yoong.vn/contact/contactUs', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ FullName: this.state.FullName,
            Email: this.state.Email,
            Phone: this.state.Phone,
            Content: this.state.Content,
            Deleted: false,
            Published: true
            }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            NotificationHelper.Notify("Gửi thành công");
            this.setState({
              FullName: '',
              Phone: '',
              Email: '',
              Content: ''
            });
            this._navigateAction();

          })
          .catch((error) => {
            console.error(error);
          });;

      }
    }
  catch(error) {
    console.error(error);
  }};
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 5,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    marginBottom: 10,
    height: scaleVertical(77),
    resizeMode: 'contain'
  },
  content: {
    justifyContent: 'space-between'
  },
  save: {
    marginVertical: 20
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
    justifyContent: 'space-around'
  },
  footer: {
    justifyContent: 'flex-end'
  },
  textRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center'
  },
  section: {
    paddingVertical: 15
  },
  heading: {
    paddingBottom: 12.5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  textinput: {
    height: 25
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  iconbullet: { width: 35, color: '#41abe1' },
  textinput: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    height: 40,
    borderColor: '#f9bc1a',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular'
  },
  textArea: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: '#f9bc1a',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular'
  },

  popupButtonOK: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#f9bc1a'
  },
}));