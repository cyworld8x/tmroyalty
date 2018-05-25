import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView, Text,
  Platform, TouchableOpacity
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';

import {Avatar} from '../../components';
import RadioForm, {RadioButton} from 'react-native-simple-radio-button';
import PhotoUpload from 'react-native-photo-upload';
import {NavigationActions} from 'react-navigation';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import {data} from '../../data';
import NotificationHelper from '../../utils/notificationHelper';
import {DatePicker} from '../../components/picker/datePicker';
export default class ProfilePage extends React.Component {
  
  static navigationOptions = {
    title: 'Thông tin cá nhân'.toUpperCase()
  };

  constructor(props) {
    super(props);
    
    this.state = {
      user: {
        name: '',
        birthday: { day: 1, month: 1, year: 1990 },
        email: '',
        userid: '',
        gender: 0,
        picture: 'https://www.uv.mx/sin-humo/files/2014/06/Ponentes.png'
      },

      pickerVisible: false,
    };
    
    
    this.UpdateProfile = this._updateProfile.bind(this);
    this.UpdateProfilePicture = this._updateProfilePicture.bind(this);
    this.Validate = this._validate.bind(this);

    this._navigateAction = this._navigate.bind(this);
  }

  _navigate(route) {
    let resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }

  componentDidMount(){
    let user = data.getUser();
    this.setState({user: user})
  }
  handlePickedDate(date) {
    //console.error(JSON.stringify(date));
    this.setState({...state, birthday:{day: date.day, month: date.month, year: date.year}});
    this.hidePicker()
  }

  hidePicker() {
    this.setState({pickerVisible: false});
  }
  render() {
    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../../assets/images/logo.png')}/>;
      return <Image style={styles.image} source={require('../../assets/images/logoDark.png')}/>
    };
    if(this.state.user==null){
      return(<View/>)
    }
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        <ScrollView>
          <View style={[styles.header]}>
            <PhotoUpload
              onPhotoSelect={avatar => {
                if (avatar) {
                  this.UpdateProfilePicture(avatar);
                }
              }}
            >
              <Avatar img={{ uri: this.state.user.picture }} rkType='big rounded' />
            </PhotoUpload>
          </View>
          <View style={styles.content}>
            <View>
              <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Họ & Tên
              </RkText>
              <RkTextInput rkType='rounded' maxLength={100} placeholder='' returnKeyLabel = {"next"} value ={this.state.user.name} onChangeText={(text) => this.setState({name:text})}/>
              <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Ngày sinh
              </RkText>
              <View style={[styles.birthdayBlock]}>
                <DatePicker
                  cancelButtonText ='Hủy'
                  confirmButtonText ='Chọn'
                  title ='Chọn ngày sinh'
                  onConfirm={(date) => this.handlePickedDate(date)}
                  onCancel={() => this.hidePicker()}
                  selectedYear={this.state.user.birthday.year}
                  selectedMonth={this.state.user.birthday.month}
                  selectedDay={this.state.user.birthday.day}
                  visible={this.state.pickerVisible}
                  customDateParts={[DatePicker.DatePart.YEAR, DatePicker.DatePart.MONTH, DatePicker.DatePart.DAY]}/>
                <View style={[styles.birthdayInput, styles.balloon]}>
                  <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                    <RkText rkType='medium' style={styles.birthDayInnerInput}>
                      {this.state.user.birthday.day}
                    </RkText>
                  </TouchableOpacity>
                </View>
                <View style={[styles.birthdayDelimiter]}/>
                <View style={[styles.birthdayInput, styles.balloon]}>
                  <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                    <RkText rkType='medium' style={styles.birthDayInnerInput}>
                      {this.state.user.birthday.month}
                    </RkText>
                  </TouchableOpacity>
                </View>
                <View style={[styles.birthdayDelimiter]}/>
                <View style={[styles.birthdayInput, styles.balloon]}>
                  <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                    <RkText rkType='medium' style={styles.birthdayInnerInput}>
                      {this.state.user.birthday.year}
                    </RkText>
                  </TouchableOpacity>
                </View>
              </View>
              <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Giới tính
              </RkText>
              <View style={[styles.gender]}>
              <RadioForm style={[styles.genderRadio]}
                radio_props={[
                  {label: 'Nam', value: 0 },
                  {label: 'Nữ', value: 1 }
                ]}
                radioStyle ={{flex:1}}
                formHorizontal={true}
                labelHorizontal={true}
                buttonColor={'#a59e90'}
                selectedButtonColor ={'#f9bc1a'}
                labelHorizontal={true}
                initial={this.state.user.gender}
                animation={true}
                onPress={(value) => { this.setState({ gender:value }) }}
              />
               </View>
               <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Email
              </RkText>
              <RkTextInput rkType='rounded'   maxLength={100} value ={this.state.user.email} onChangeText={(text) => {  this.setState({...state.user,email:text})}}/>
              <GradientButton style={styles.save} rkType='large' text='GỬI YÊU CẦU' onPress={() => {
                this.UpdateProfile();
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
    if(this.state.user.birthday==null){
      NotificationHelper.Notify("Vui lòng nhập họ tên");
    } else if(this.state.user.birthday.lenght>100){
      NotificationHelper.Notify("Họ tên không vượt quá 100 ký tự");
    } else if(this.state.user.email.length==0){
      NotificationHelper.Notify("Vui lòng nhập email");
    } else {
      return true;
    }
    return false;
  }
  _updateProfile() {
    try {
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
          body: JSON.stringify({
            name: this.state.name,
            birthday: this.state.user.birthday.day + '/' + this.state.user.birthday.month + '/' + this.state.user.birthday.year,
            email: this.state.user.email,
            gender: this.state.user.gender
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            NotificationHelper.Notify("Cập nhật thành công");
            NotificationHelper.Notify(JSON.stringify(responseJson))

            this._navigateAction('Home');
          })
          .catch((error) => {
            NotificationHelper.Notify("Cập nhật không thành công");
          });;

      }
    }
    catch (error) {
      console.error(error);
    }
  }
  _updateProfilePicture(imagebase64) {
   
    try {
       fetch('http://api.monanngon.tk/contact.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imagebase64: imagebase64,
            userid: 111
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            
            NotificationHelper.Notify("Cập nhật thành công");
            this.setState({picture:'https://www.ienglishstatus.com/wp-content/uploads/2018/03/Friendship-Profile-Pics-300x259.png'});
            
          })
          .catch((error) => {
            console.error(error);
          });

    }
    catch (error) {
      console.error(error);
    }
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base
  },
  header: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 17
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 18,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base
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
  birthdayBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  gender: {
    paddingTop: 5,
    flex:1
  },
  genderRadio: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flex:1
  },
  birthdayInput: {
    flex: 0.48,
    marginVertical: 10,
  },
  birthdayInnerInput: {
    textAlign: 'center'
  },
  birthdayDelimiter: {
    flex: 0.04
  },
  balloon: {
    maxWidth: scale(250),
    padding: 15,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: theme.colors.border.solid,
  },
}));