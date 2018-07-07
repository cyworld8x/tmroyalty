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
      balance: 0,
      pickerVisible: false,
    };
    this.UpdateProfile = this._updateProfile.bind(this);
    this.UpdateProfilePicture = this._updateProfilePicture.bind(this);
    this.Validate = this._validate.bind(this);
    this.handlePickedDate = this._handlePickedDate.bind(this);
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
    // let user = data.getUserInfo();
    // this.setState({...user});
    
  }
  _handlePickedDate(date) {
    try{
      this.setState({birthday: {day: date.day, month: date.month, year: date.year}});
      this.hidePicker();
    }catch(error){
      NotificationHelper.Notify('An error happend!')
    }
  }

  hidePicker() {
    this.setState({pickerVisible: false});
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
              <RkTextInput rkType='rounded' maxLength={100} placeholder='' returnKeyLabel = {"next"} value ={this.state.name} onChangeText={(text) => this.setState({name:text})}/>
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
                  selectedYear={this.state.birthday.year}
                  selectedMonth={this.state.birthday.month}
                  selectedDay={this.state.birthday.day}
                  visible={this.state.pickerVisible}
                  customDateParts={[DatePicker.DatePart.YEAR, DatePicker.DatePart.MONTH,DatePicker.DatePart.DAY]}/>
                <View style={[styles.birthdayInput, styles.balloon]}>
                  <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                    <RkText rkType='medium' style={styles.birthDayInnerInput}>
                      {this.state.birthday.day}
                    </RkText>
                  </TouchableOpacity>
                </View>
                <View style={[styles.birthdayDelimiter]}/>
                <View style={[styles.birthdayInput, styles.balloon]}>
                  <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                    <RkText rkType='medium' style={styles.birthDayInnerInput}>
                      {this.state.birthday.month}
                    </RkText>
                  </TouchableOpacity>
                </View>
                <View style={[styles.birthdayDelimiter]}/>
                <View style={[styles.birthdayInput, styles.balloon]}>
                  <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                    <RkText rkType='medium' style={styles.birthdayInnerInput}>
                      {this.state.birthday.year}
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
                initial={this.state.gender}
                animation={false}
                onPress={(value) => { this.setState({ gender:value }) }}
              />
               </View>
               <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Email
              </RkText>
              <RkTextInput rkType='rounded'   maxLength={100} value ={this.state.email} onChangeText={(text) => {  this.setState({email:text})}}/>
              <RkText rkType='header5' style={styles.birthDayInnerInput}>
              Số điện thoại
              </RkText>
              <RkTextInput rkType='rounded'  maxLength={100} value ={this.state.phone}  keyboardType = 'numeric'  onChangeText={(text) => {  this.setState({phone:text})}}/>
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
    } else if(this.state.email.length==0){
      NotificationHelper.Notify("Vui lòng nhập email");
    } else if(this.state.phone.length==0){
      NotificationHelper.Notify("Vui lòng nhập số điện thoại");
    }else {
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



function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation,saveUserInformation})(ProfilePage);