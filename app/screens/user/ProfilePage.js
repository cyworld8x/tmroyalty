import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView, Text, TextInput,
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

import DateTimePicker from 'react-native-modal-datetime-picker';
import {Avatar} from '../../components';
import RadioForm, {RadioButton} from 'react-native-simple-radio-button';
import PhotoUpload from 'react-native-photo-upload';
import {NavigationActions} from 'react-navigation';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import {data} from '../../data';
import NotificationHelper from '../../utils/notificationHelper';
import {DatePicker} from '../../components/picker/datePicker';

import _ from 'lodash';
import { connect } from 'react-redux';
import { loadingUserInformation,saveUserInformation} from '../../api/actionCreators';
class ProfilePage extends React.Component {
  
  static navigationOptions = {
    title: 'Thông tin cá nhân'.toUpperCase()
  };

  constructor(props) {
    super(props);
    let dayofbirth = this.props.User.DateOfBirth!=null&& this.props.User.DateOfBirth.length>0?this.props.User.DateOfBirth:'2000-1-1';
    let dateArr = _.map(_.split(dayofbirth,'-',3),_.unary(parseInt)) ;
    
    this.state = {
      id:this.props.User.Id,
      name: this.props.User.FullName,
      phone: this.props.User.PhoneNumber,
      email: this.props.User.Email,
      gender: this.props.User.Gender==null ||this.props.User.Gender=='Male'? 0:1,
      picture: this.props.User.AvatarUrl!=null && this.props.User.AvatarUrl.length>0? this.props.User.AvatarUrl:this.props.User.SocialPicture,
      birthday: {day:dateArr[2], month:dateArr[1], year:dateArr[0]},
      unverifiedPhone:this.props.User.PhoneNumber,
      balance: 0,
      activeCode:'',
      activeCodeVisible: false,
      pickerVisible: false,
      sendPhoneVisible:false,
      date: new Date(dateArr[0],dateArr[1],dateArr[2])
    };
    this.UpdateProfile = this._updateProfile.bind(this);
    this.UpdateProfilePicture = this._updateProfilePicture.bind(this);
    this.RequestVerificationCode = this._requestVerificationCode.bind(this);
    this.CheckPhoneVerificationCode = this._checkPhoneVerificationCode.bind(this);
    this.OnPhoneNumberChange = this._onPhoneNumberChange.bind(this);
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
    if(this.state.birthday!=null){
      this.setState({birthdayDisplay:this.state.birthday.day+'/'+this.state.birthday.month+'/'+this.state.birthday.year})
    }
    
  }

  onSelectedDateChange = (date) => {

    this.setState({birthday: {day: date.getDate(), month: date.getMonth(), year: date.getFullYear()}});

    let birthdayDisplay = this.getDateStringDisplay(date);
    this.setState({
      birthdayDisplay:birthdayDisplay,
      pickerVisible:false
    })
  }

  _onPhoneNumberChange(text){
    this.setState({unverifiedPhone:text});
    if(this.state.phone!=text){
      this.setState({sendPhoneVisible:true});
    }else{
      this.setState({sendPhoneVisible:false});
    }
  }
  getDateStringDisplay(dt){
    var arr = new Array(dt.getDate(), dt.getMonth(), dt.getFullYear());

    for(var i=0;i<arr.length;i++) {
      if(arr[i].toString().length == 1) arr[i] = "0" + arr[i];
    }
  
    return arr.join('/'); 
  }

  render() {
   
    if(this.state.id==null){
      return(<View/>)
    }
    return (
      <ScrollView>
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
       
          <View style={[styles.header]}>
            <PhotoUpload
              onPhotoSelect={avatar => {
                if (avatar) {
                  this.UpdateProfilePicture(avatar);
                }
              }}
            >
              <Avatar img={{ uri: this.state.picture }} rkType='big rounded' />
            </PhotoUpload>
          </View>
          <View style={styles.content}>
            <View>
              <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Họ & Tên
              </RkText>

              <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  
                  placeholder='Họ & Tên' maxLength={100} value ={this.state.name} onChangeText={(text) => this.setState({name:text})} />
             
              <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Ngày sinh
              </RkText>
              
              <View style={[styles.birthdayBlock]}>
               
              <DateTimePicker
                isVisible={this.state.pickerVisible}
                onConfirm={this.onSelectedDateChange}
                onCancel={()=>this.setState({pickerVisible:false})}
                is24Hour={true}
                titleIOS='Chọn ngày sinh'
                date={this.state.date}
                mode='date'
              />
              <View style={{justifyContent: 'space-between', flex:1}}>
                <TouchableOpacity onPress={()=>this.setState({pickerVisible:true})}>
                    <RkText style={styles.fakedtextinput} >{this.state.birthdayDisplay}</RkText>
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
                initial={this.state.gender}
                animation={false}
                onPress={(value) => { this.setState({ gender:value }) }}
              />
               </View>
               <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Email
              </RkText>
              
              <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  
                  placeholder='Email' maxLength={100} value ={this.state.email} onChangeText={(text) => this.setState({email:text})} />
              
              <RkText rkType='header5' style={styles.birthDayInnerInput}>
              Số điện thoại
              </RkText>
              <View style={{justifyContent: 'space-between', flex:1}}>
              <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  keyboardType = 'numeric'
                  placeholder='Số điện thoại' maxLength={30} value ={this.state.unverifiedPhone} onChangeText={(text) => this.OnPhoneNumberChange(text)} />
               {this.state.sendPhoneVisible &&  <TouchableOpacity style={{   height: 40, position: 'absolute', justifyContent: 'center', alignItems: 'center',right: 5, top:10}} onPress={() => this.RequestVerificationCode()}>
                  <RkText rkType='secondary2' style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color:'#189eff'}}>
                  Gửi mã xác thực
                  </RkText>
                </TouchableOpacity>
               }

               {!this.state.sendPhoneVisible && this.state.phone!=null && this.state.phone.length>0 &&

                <View style={{ height: 40, position: 'absolute', justifyContent: 'center', alignItems: 'center', right: 5, top: 10 }} onPress={() => this.RequestVerificationCode()}>
                  <RkText rkType='secondary2' style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    (Đã xác nhận)
                  </RkText>
                </View>
               }
              </View>

              
               { 
                 this.state.activeCodeVisible == true &&
                <View style={{justifyContent: 'space-between', flex:1, }}>
                  <TextInput style={styles.textinput} underlineColorAndroid="transparent"
                    placeholder='Mã xác thực' maxLength={30} value={this.state.activeCode} onChangeText={(text) => this.setState({ activeCode: text })} />
                  <TouchableOpacity style={{ height: 40, position: 'absolute', justifyContent: 'center', alignItems: 'center', right: 5, top: 10 }} onPress={() => this.CheckPhoneVerificationCode()}>
                    <RkText rkType='secondary2' style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', color: '#189eff' }}>
                      Kích hoạt
                  </RkText>
                </TouchableOpacity>
              </View>
               }
              <GradientButton style={styles.save} rkType='large' text='CẬP NHẬT' onPress={() => {
                this.UpdateProfile();
              }} />
            </View>
            <View style={styles.footer}>
              <View style={styles.textRow}>
                <RkText rkType='primary3'>TM GROUP</RkText>
              </View>
            </View>
          </View>
      </RkAvoidKeyboard>
      </ScrollView>
    )
  }
  _validate(){
    if(this.state.birthday==null){
      NotificationHelper.Notify("Vui lòng nhập họ tên");
    } else if(this.state.birthday.lenght>100){
      NotificationHelper.Notify("Họ tên không vượt quá 100 ký tự");
    } else if(this.state.email ==null || this.state.email.length==0){
      NotificationHelper.Notify("Vui lòng nhập email");
    } 
    else 
    if(this.state.phone.length==0){
      NotificationHelper.Notify("Vui lòng nhập số điện thoại");
    } else if(this.state.unverifiedPhone.length>0 && this.state.unverifiedPhone!=this.state.phone){
      NotificationHelper.Notify("Số điện thoại chưa xác thực");
    }
    else {
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
        fetch('http://api-tmloyalty.yoong.vn/account/updateprofile', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
            'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
          },
          body: JSON.stringify({
            AccountId: this.props.User.Id,
            FullName: this.state.name,
            DateOfBirth: this.state.birthday.year + '-' + this.state.birthday.month + '-' + this.state.birthday.day,
            Email: this.state.email,
            PhoneNumber:this.state.phone,
            Gender: this.state.gender==0?'Male':'FeMale'
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
           
            if(responseJson!=null && responseJson.StatusCode==2){
              NotificationHelper.Notify("Cập nhật thành công");
              this.props.saveUserInformation(responseJson.Data);
              this._navigateAction('Home');
            }
            else{
              NotificationHelper.Notify("Cập nhật không thành công."+responseJson.Messages);
            }
            
          })
          .catch((error) => {
            if (__DEV__) {
              NotificationHelper.Notify("Cập nhật không thành công");
            }
          });;

      }
    }
    catch (error) {
      if (__DEV__) {
        console.error(error);
      }
    }
  }

  _requestVerificationCode() {
    try {
     
        fetch('http://api-tmloyalty.yoong.vn/account/AddOrUpdatePhoneNumber', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
            'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
          },
          body: JSON.stringify({
            AccountId: this.props.User.Id,
            PhoneNumber:this.state.unverifiedPhone,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
           
            if(responseJson!=null && responseJson.StatusCode==2){
              NotificationHelper.Notify(""+responseJson.Message);
              this.setState({phone:this.state.unverifiedPhone, activeCodeVisible:true});
            }
            else{
              NotificationHelper.Notify("Gửi mã kích hoạt không thành công."+responseJson.Messages);
            }
            
          })
          .catch((error) => {
            if (__DEV__) {
              NotificationHelper.Notify("Gửi mã kích hoạt không thành công");
            }
          });
    }
    catch (error) {
      if (__DEV__) {
        console.error(error);
      }
    }
  }

  _checkPhoneVerificationCode() {
    try {
        fetch('http://api-tmloyalty.yoong.vn/account/VerifyPhoneNumber', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',            
            'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
          },
          body: JSON.stringify({
            AccountId: this.props.User.Id,
            PhoneNumber:this.state.unverifiedPhone,
            Token:this.state.activeCode
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
           
            if(responseJson!=null && responseJson.StatusCode==2){
              NotificationHelper.Notify(""+responseJson.Message);
              this.setState({phone:this.state.unverifiedPhone, activeCodeVisible:false});
              this.props.User.PhoneNumber = this.state.unverifiedPhone;
              this.props.saveUserInformation(this.props.User);
            }
            else{
              NotificationHelper.Notify("Gửi mã kích hoạt không thành công."+responseJson.Messages);
            }
            
          })
          .catch((error) => {
            if (__DEV__) {
              NotificationHelper.Notify("Gửi mã kích hoạt không thành công");
            }
          });;

      
    }
    catch (error) {
      if (__DEV__) {
        console.error(error);
      }
    }
  }

  _updateProfilePicture(imagebase64) {
   
    try {
       fetch('http://api-tmloyalty.yoong.vn/account/uploadavatar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
          },
          body: JSON.stringify({
            StrBase64Img: 'data:image/jpeg;base64,'+imagebase64,
            AccountId: this.props.User.Id
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson!=null && responseJson.StatusCode==2){
              this.setState({picture:responseJson.Data.AvatarUrl});
              this.props.saveUserInformation(responseJson.Data);
              NotificationHelper.Notify("Cập nhật thành công");
            }else{

              NotificationHelper.Notify("Lỗi kết nối. 500");
            }
          })
          .catch((error) => {
            if (__DEV__) {
              console.error(error);
            }
          });

    }
    catch (error) {
      if (__DEV__) {
        console.error(error);
      }
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
    flexDirection: 'row',
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
  fakedtextinput: {
    alignSelf: "stretch",
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical:10,
    paddingHorizontal: 5,
    height: 40,
    borderColor: '#f9bc1a',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular'
  },
  
  textinput: {
    borderRadius: 5,
    marginVertical: 10,
    height: 40,
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

export default connect(mapStateToProps,{loadingUserInformation,saveUserInformation})(ProfilePage);