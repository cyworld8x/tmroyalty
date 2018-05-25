import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard
} from 'react-native-ui-kitten';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

import NotificationHelper from '../../utils/notificationHelper'
export default class ContactPage extends React.Component {
  static navigationOptions = {
    title: 'Liên hệ'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      email: '',
      content: '',
      userid:''
    };

    
    this.SubmitContact = this._SubmitContact.bind(this);
    this.Validate = this._validate.bind(this);
  
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

  render() {
    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../../assets/images/logo.png')}/>;
      return <Image style={styles.image} source={require('../../assets/images/logoDark.png')}/>
    };
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            {renderIcon()}
            <RkText rkType='h1'>Liên hệ</RkText>
          </View>
          <View style={styles.content}>
            <View>
              <RkTextInput rkType='rounded' placeholder='Họ & Tên' returnKeyLabel = {"next"} value ={this.state.name} onChangeText={(text) => this.setState({name:text})}/>
              <RkTextInput rkType='rounded' placeholder='Số điện thoại'   keyboardType = 'numeric' returnKeyLabel = {"next"} value ={this.state.phone} onChangeText={(text) => this.setState({phone:text})}/>
              <RkTextInput rkType='rounded' placeholder='Email'  maxLength={10} value ={this.state.email} onChangeText={(text) => this.setState({email:text})}/>
              <RkTextInput rkType='rounded' multiline={true}
                numberOfLines={4} placeholder='Nội dung liên hệ' value ={this.state.content} onChangeText={(text) => this.setState({content:text})} />
              <GradientButton style={styles.save} rkType='large' text='GỬI YÊU CẦU' onPress={() => {
                this.SubmitContact();
              }} />
            </View>
            <View style={styles.footer}>
              <View style={styles.textRow}>
                <RkText rkType='primary3'>TM GROUP</RkText>
              </View>
            </View>
          </View>
        </ScrollView>
        
      </RkAvoidKeyboard>
    )
  }
  _validate(){
    if(this.state.name.length==0){
      NotificationHelper.Notify("Vui lòng nhập tên liên hệ");
    } else if(this.state.content.length==0){
      NotificationHelper.Notify("Vui lòng nhập nội dung");
    } else if(this.state.phone.length==0){
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
        fetch('http://api.monanngon.tk/contact.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.state),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            NotificationHelper.Notify("Gửi thành công");
            //NotificationHelper.Notify(JSON.stringify(responseJson))
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
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    marginBottom: 10,
    height:scaleVertical(77),
    resizeMode:'contain'
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
  footer:{
    justifyContent:'flex-end'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
}));