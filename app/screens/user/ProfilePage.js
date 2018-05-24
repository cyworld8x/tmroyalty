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
  RkAvoidKeyboard
} from 'react-native-ui-kitten';
import RadioForm, {RadioButton} from 'react-native-simple-radio-button';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

import NotificationHelper from '../../utils/notificationHelper';
import {DatePicker} from '../../components/picker/datePicker';
export default class ProfilePage extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      birthday: {day: 1, month:1, year:1990},
      email: '',
      content: '',
      userid:'',
      gender:0,
      pickerVisible: false,
    };
    
    
    this.UpdateProfile = this._updateProfile.bind(this);
  
    this.Validate = this._validate.bind(this);
  }

  handlePickedDate(date) {
    //console.error(JSON.stringify(date));
    this.setState({birthday:{day: date.day, month: date.month, year: date.year}});
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
                  customDateParts={[DatePicker.DatePart.YEAR, DatePicker.DatePart.MONTH, DatePicker.DatePart.DAY]}/>
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
                animation={true}
                onPress={(value) => { this.setState({ gender:value }) }}
              />
               </View>
               <RkText rkType='header5' style={styles.birthDayInnerInput}>
                Email
              </RkText>
              <RkTextInput rkType='rounded'   maxLength={100} value ={this.state.email} onChangeText={(text) => this.setState({email:text})}/>
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
    if(this.state.birthday==null){
      NotificationHelper.Notify("Vui lòng nhập họ tên");
    } else if(this.state.birthday.lenght>100){
      NotificationHelper.Notify("Họ tên không vượt quá 100 ký tự");
    } else if(this.state.email.length==0){
      NotificationHelper.Notify("Vui lòng nhập email");
    } else {
      return true;
    }
    return false;
  }
  _updateProfile() {
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
          body: JSON.stringify({
            name: this.state.name,
            birthday: this.state.birthday.day + '/'+ this.state.birthday.month+ '/'+ this.state.birthday.year,
            email: this.state.email,
            gender: this.state.gender
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            NotificationHelper.Notify("Gửi thành công");
            NotificationHelper.Notify(JSON.stringify(responseJson))

            navigation.navigate('Home');
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