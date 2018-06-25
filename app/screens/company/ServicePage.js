import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  FlatList,
  TextInput,
  Platform,
  Text,
  TouchableOpacity
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
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-material-dropdown';
import {FontAwesome} from '../../assets/icons';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

import {TmTitle} from '../../components';
import NotificationHelper from '../../utils/notificationHelper'

const items = [
  {
    name: "Apple",
    id: 10,
  },{
    name: "Strawberry",
    id: 17,
  },{
    name: "Pineapple",
    id: 13,
  },{
    name: "Banana",
    id: 14,
  },{
    name: "Watermelon",
    id: 15,
  },{
    name: "Kiwi fruit",
    id: 16,
  }
]

import _ from 'lodash';
export default class ServicePage extends React.Component {
  static navigationOptions = {
    title: 'Yêu cầu dịch vụ'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      AccountId: 281,
      ServiceTypeId: null,
      ServiceTypeLabel: null,
      FullName: '',
      PhoneNumber : '',
      DepartureDate:'',
      DepartureLocation:'',
      DriverId :'',
      CarTypes :'',
      NumberOfDatesUseService :'',
      StartDatesUseService :'',
      EndDatesUseService :'',
      HairStyles :'',
      ServiceStaffId:'',
      DatetOfService:'',
      TimeOfService:'',
      selectedItems: [],
      selectedHairServices:[],
      hairServices:[],
      selectedCarServices:[],
      carServices:[],
      hairStaffServices:[],
      driverStaffServices:[],
      showDateOfService:false,
      showDateOfStartService:false,
      showDateOfEndService:false,
      displayOfDateOfUseService:'Thời gian sử dụng: __:__ __/__/____',
      displayOfStartDatesUseService:'Ngày bắt đầu: __/__/____',
      displayOfEndDatesUseService:'Ngày kết thúc: __/__/____',
      ServiceType:[]
    };

  
    
    this.SubmitContact = this._SubmitContact.bind(this);
    this.Validate = this._validate.bind(this);
  
    this._navigateAction = this._navigate.bind(this);
  }

  componentWillMount() {
    this.getBookingServices();
  }

  onSelectedDateOfUseServiceChange = (date) => {
    let serviceDate = date.getFullYear().toString()+"/"+date.getMonth().toString()+"/"+date.getDate().toString();

    let serviceDateDisplay = date.getDate().toString()+"/"+date.getMonth().toString()+"/"+date.getFullYear().toString();
    let serviceTime = date.getHours().toString()+":"+date.getMinutes().toString();
    this.setState({
      displayOfDateOfUseService:'Thời gian sử dụng: '+serviceTime + ' ' + serviceDateDisplay, 
      DatetOfService: serviceDate,
      TimeOfService: serviceTime,
      showDateOfService:false
    })
  }

  onSelectedStartDatesUseServiceChange = (date) => {
    let serviceDate = date.getFullYear().toString()+"/"+date.getMonth().toString()+"/"+date.getDate().toString();

    let serviceDateDisplay = date.getDate().toString()+"/"+date.getMonth().toString()+"/"+date.getFullYear().toString();
  
    this.setState({
      displayOfStartDatesUseService:'Ngày bắt đầu: ' + serviceDateDisplay, 
      StartDatesUseService: serviceDate,
      showDateOfStartService:false
    })
  }

  onSelectedEndDatesUseServiceChange = (date) => {
    let serviceDate = date.getFullYear().toString()+"/"+date.getMonth().toString()+"/"+date.getDate().toString();

    let serviceDateDisplay = date.getDate().toString()+"/"+date.getMonth().toString()+"/"+date.getFullYear().toString();
  
    this.setState({
      displayOfEndDatesUseService:'Ngày kết thúc: ' + serviceDateDisplay, 
      EndDatesUseService: serviceDate,
      showDateOfEndService:false
    })
  }

  onSelectedHairServicesChange = (selectedItems) => {
    this.setState({selectedHairServices:selectedItems});
    this.setState({HairStyles:(selectedItems!=null?selectedItems.join(','):'')});
  }

  onSelectedCarServicesChange = (selectedItems) => {
    this.setState({selectedCarServices:selectedItems});
    this.setState({CarTypes:(selectedItems!=null?selectedItems.join(','):'')});
  }

  _filter(serviceTypeDatas) {
    
    let hairServices = _.filter(serviceTypeDatas.ListDetailsServiceType, (service) => {

      if (service.ServiceTypeId == 1)
        return service;
    });

    let carServices = _.filter(serviceTypeDatas.ListDetailsServiceType, (service) => {

      if (service.ServiceTypeId == 0)
        return service;
    });

    let hairStaffServices = _.filter(serviceTypeDatas.ListStaffAndDirver, (service) => {

      if (service.ServiceTypeId == 1)
        return service;
    });

    let driverStaffServices = _.filter(serviceTypeDatas.ListStaffAndDirver, (service) => {

      if (service.ServiceTypeId == 0)
        return service;
    });

    this.setState({
      hairServices,carServices,hairStaffServices,driverStaffServices,ServiceType: serviceTypeDatas.ListServiceType
    });
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
  
  getBookingServices(){
    var url = 'http://api-tmloyalty.yoong.vn/bookingRequest/getAllBookingServiceType';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {

          this._filter(responseJson);
          //console.error(responseJson);
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
  _clearAll(){
    this.SectionedMultiSelect._removeAllItems();
  }
 
  render() {
   
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
            <Dropdown containerStyle={styles.dropdown}
                    valueExtractor={(item)=> { return item.Value}}
                    labelExtractor={(item)=> { return item.Text}}
                    label={'Chọn dịch vụ'}
                    data={this.state.ServiceType}
                    onChangeText={(data)=>{this.setState({ServiceTypeId:data})}}
                    fontSize={18}
                  />
            <SectionedMultiSelect
                      style={[styles.dropdownlist]}
                      ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
                      items={this.state.hairServices}
                      uniqueKey='Value'
                      displayKey='Text'
                      selectText='Chọn kiểu tóc ...'
                      showDropDowns={false}
                      readOnlyHeadings={false}
                      onSelectedItemsChange={this.onSelectedHairServicesChange}
                      selectedItems={this.state.selectedHairServices}
                      button='#f9bc1a'
                      confirmText='Chọn'
                      tagBorderColor='#f9bc1a'
                      selectedText='kiểu tóc'
                      itemFontFamily= {{ fontFamily:'Roboto-Regular', fontWeight: '200' }}
                      subItemFontFamily= {{ fontFamily: 'Roboto-Regular', fontWeight: '200' }}
                      searchTextFontFamily= {{ fontFamily:'Roboto-Regular', fontWeight: '200'}}
                      confirmFontFamily= {{ fontFamily:'Roboto-Regular', fontWeight: '200' }}
                      searchPlaceholderText='Chọn kiểu tóc'
                      colors={{primary:'#000000',text:'#f9bc1a',success:'#f9bc1a'}}
                    />
            <SectionedMultiSelect
                      style={[styles.dropdownlist]}
                      ref={SectionedMultiSelect => this.CarSectionedMultiSelect = SectionedMultiSelect}
                      items={this.state.carServices}
                      uniqueKey='Value'
                      displayKey='Text'
                      selectText='Chọn xe ...'
                      showDropDowns={false}
                      readOnlyHeadings={false}
                      onSelectedItemsChange={this.onSelectedCarServicesChange}
                      selectedItems={this.state.selectedCarServices}
                      button='#f9bc1a'
                      confirmText='Chọn'
                      tagBorderColor='#f9bc1a'
                      selectedText='xe'
                      itemFontFamily= {{ fontFamily:'Roboto-Regular', fontWeight: '200' }}
                      subItemFontFamily= {{ fontFamily: 'Roboto-Regular', fontWeight: '200' }}
                      searchTextFontFamily= {{ fontFamily:'Roboto-Regular', fontWeight: '200'}}
                      confirmFontFamily= {{ fontFamily:'Roboto-Regular', fontWeight: '200' }}
                      searchPlaceholderText='Chọn xe'
                      colors={{primary:'#000000',text:'#f9bc1a',success:'#f9bc1a'}}
                    />
            <Dropdown containerStyle={styles.dropdown}
              label={'Chọn nhân viên dịch vụ tóc'}
              valueExtractor={(item)=> { return item.Value}}
              labelExtractor={(item)=> { return item.Text}}
              data={this.state.hairStaffServices}
              onChangeText={(data) => { this.setState({ ServiceStaffId : data }) }}
              fontSize={18}
            />
             <Dropdown containerStyle={styles.dropdown}
                    label={'Chọn tài xế'}
                    valueExtractor={(item) => { return item.Value }}
                    labelExtractor={(item) => { return item.Text }}
                    data={this.state.driverStaffServices}
                    onChangeText={(data)=>{this.setState({DriverId:data})}}
                    fontSize={18}
                  />

              <DateTimePicker
                isVisible={this.state.showDateOfService}
                onConfirm={this.onSelectedDateOfUseServiceChange}
                onCancel={()=>this.setState({showDateOfService:false})}
                is24Hour={true}
                mode='datetime'
              />
                    
              <TouchableOpacity onPress={()=>this.setState({showDateOfService:true})}>
                  <RkText style={styles.fakedtextinput} >{this.state.displayOfDateOfUseService}</RkText>
              </TouchableOpacity>

              <DateTimePicker
                isVisible={this.state.showDateOfStartService}
                onConfirm={this.onSelectedStartDatesUseServiceChange}
                onCancel={()=>this.setState({showDateOfStartService:false})}
                is24Hour={true}
                mode='date'
              />
                    
              <TouchableOpacity onPress={()=>this.setState({showDateOfStartService:true})}>
                  <RkText style={styles.fakedtextinput} >{this.state.displayOfStartDatesUseService}</RkText>
              </TouchableOpacity>

              <DateTimePicker
                isVisible={this.state.showDateOfEndService}
                onConfirm={this.onSelectedEndDatesUseServiceChange}
                onCancel={()=>this.setState({showDateOfEndService:false})}
                is24Hour={true}
                mode='date'
              />
                    
              <TouchableOpacity onPress={()=>this.setState({showDateOfEndService:true})}>
                  <RkText style={styles.fakedtextinput} >{this.state.displayOfEndDatesUseService}</RkText>
              </TouchableOpacity>

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
  fakedtextinput: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical:10,
    paddingHorizontal: 5,
    height: 40,
    borderColor: '#f9bc1a',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular'
  },
  dropdownlist: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: '#f9bc1a',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular'
  },
  dropdown:{
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 15,
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