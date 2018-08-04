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
  Modal,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
  RkCard,
} from 'react-native-ui-kitten';
import {NavigationActions} from 'react-navigation';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-material-dropdown';

import { connect } from 'react-redux';
import { loadingUserInformation} from '../../api/actionCreators';
import {FontAwesome} from '../../assets/icons';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import {UIConstants} from '../../config/appConstants';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import {TmTitle} from '../../components';
import NotificationHelper from '../../utils/notificationHelper'
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
import _ from 'lodash';
class ServicePage extends React.Component {
  static navigationOptions = {
    title: 'Yêu cầu dịch vụ'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      CarServiceRequest:{
        AccountId:this.props.User.Id,
        ServiceTypeId: 0,
        PhoneNumber: (this.props.User.PhoneNumber!=null?this.props.User.PhoneNumber:''),
        CarTypes:'',
        DriverId :'',
        DepartureLocation:'',
        Destination:'',
        NumberOfDatesUseService:'2',
        StartDatesUseService :'',
        EndDatesUseService :'',
        Note:''
      },
      HairServiceRequest:{
        AccountId:this.props.User.Id,
        ServiceTypeId: 1,
        PhoneNumber: (this.props.User.PhoneNumber!=null?this.props.User.PhoneNumber:''),
        HairStyles :'',
        ServiceStaffId:'',
        DatetOfService:'',
        TimeOfService:'',
        Note:''
      },
      ServiceTypeId: null,
      ServiceTypeLabel: null,
      FullName: '',
      PhoneNumber : '',     
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
      displayOfStartDatesUseService:'Ngày khởi hành: __/__/____',
      displayOfEndDatesUseService:  'Ngày kết thúc  : __/__/____',
      ServiceType:[],
      modalVisible:false
    };

  
    
    this.SubmitServiceRequest = this._SubmitServiceRequest.bind(this);
    this.Validate = this._validate.bind(this);
    this.onTouchChangeEvent = this._onTouchChangeEvent.bind(this);
    this._navigateAction = this._navigate.bind(this);
  }

  componentWillMount() {
    this.getBookingServices();
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onSelectedDateOfUseServiceChange = (date) => {
    let serviceDate = this.getDateString(date);

    let serviceDateDisplay = this.getDateStringDisplay(date);
    let serviceTime = this.getTimeString(date);
    this.setState((state)=> 
    {
      state.displayOfDateOfUseService = 'Thời gian sử dụng: '+serviceTime + ' ' + serviceDateDisplay;
      state.HairServiceRequest.DatetOfService = serviceDate;
      state.HairServiceRequest.TimeOfService = serviceTime;
      state.showDateOfService = false;
      return state;
    });
  }

  onSelectedStartDatesUseServiceChange = (date) => {
    let serviceDate = this.getDateString(date);
    let serviceDateDisplay = this.getDateStringDisplay(date);
    this.setState((state)=> (state.CarServiceRequest.StartDatesUseService=serviceDate, state));
    this.setState({
      displayOfStartDatesUseService:'Ngày khởi hành: ' + serviceDateDisplay, 
      //StartDatesUseService: serviceDate,
      showDateOfStartService:false
    })
  }

  onSelectedEndDatesUseServiceChange = (date) => {
    let serviceDate = this.getDateString(date);

    let serviceDateDisplay = this.getDateStringDisplay(date);
    this.setState((state)=> (state.CarServiceRequest.EndDatesUseService=serviceDate, state));
    this.setState({
      displayOfEndDatesUseService:'Ngày kết thúc  : ' + serviceDateDisplay, 
      //EndDatesUseService: serviceDate,
      showDateOfEndService:false
    })
  }

  getDateStringDisplay(dt){
    var arr = new Array(dt.getDate(), dt.getMonth(), dt.getFullYear());

    for(var i=0;i<arr.length;i++) {
      if(arr[i].toString().length == 1) arr[i] = "0" + arr[i];
    }
  
    return arr.join('/'); 
  }

  getDateString(dt){
    var arr = new Array( dt.getFullYear(),dt.getMonth(), dt.getDate());

    for(var i=0;i<arr.length;i++) {
      if(arr[i].toString().length == 1) arr[i] = "0" + arr[i];
    }
  
    return arr.join('/'); 
  }

  getTimeString(dt){
    var arr = new Array(dt.getHours(),dt.getMinutes());

    for(var i=0;i<arr.length;i++) {
      if(arr[i].toString().length == 1) arr[i] = "0" + arr[i];
    }
    return arr.join(':'); 
  }

  onSelectedHairServicesChange = (selectedItems) => {
    this.setState({selectedHairServices:selectedItems});
    this.setState((state)=> (state.HairServiceRequest.HairStyles = (selectedItems!=null?selectedItems.join(','):''), state));
  }

  onSelectedCarServicesChange = (selectedItems) => {
    this.setState({selectedCarServices:selectedItems});
    this.setState((state)=> (state.CarServiceRequest.CarTypes = (selectedItems!=null?selectedItems.join(','):''), state));
  }

  _filter(serviceTypeDatas) {
    
    let hairServices = _.filter(serviceTypeDatas.ListDetailsServiceType, (service) => {

      if (service.ServiceTypeId == 1)
        return service;
    });

    let carServices = _.filter(serviceTypeDatas.ListDetailsServiceType, (service) => {

      if (service.ServiceTypeId == 0)
        return  {
          ServiceTypeId : service.ServiceTypeId,
          AvatarUrl : service.AvatarUrl,
          Value : service.Value,
          Text : service.Text,
          Checked: false
        };;
    });

    let hairStaffServices = _.filter(serviceTypeDatas.ListStaffAndDirver, (service) => {

      if (service.ServiceTypeId == 1)
        return service;
    });

    let driverStaffServices = _.filter(serviceTypeDatas.ListStaffAndDirver, (service) => {

      if (service.ServiceTypeId == 0)
        return service
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
        if (__DEV__) {
          console.error(error);
        }
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  _onTouchChangeEvent(item){
    item.Checked = !item.Checked;
   
    this.setState({carServices : this.state.carServices.map(i => i.Value === item.Value?item:i)});
    let carTypes =  [];
    _.forEach(this.state.carServices,(car) => {

      if (car.Checked == true)
        return carTypes.push(car.Value);
    });
    this.setState((state)=> (state.CarServiceRequest.CarTypes= carTypes.join(','), state));
  }

  _clearAll(){
    this.SectionedMultiSelect._removeAllItems();
  }
 
  render() {
   
    return (
      <ScrollView style={styles.scrollview} >
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
      
          <View style={styles.content}>
            <View>
            <Dropdown containerStyle={styles.dropdown}
                    fontSize={12}
                    labelFontSize={12}
                    valueExtractor={(item)=> { return item.Value}}
                    labelExtractor={(item)=> { return item.Text}}
                    label={'Chọn dịch vụ'}
                    data={this.state.ServiceType}
                    onChangeText={(data)=>{this.setState({ServiceTypeId:data})}}
                    fontSize={18}
                  />
            {this.state.ServiceTypeId ==1 &&
                <View>
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
                    itemFontFamily={{ fontFamily: 'Roboto-Regular', fontWeight: '200' }}
                    subItemFontFamily={{ fontFamily: 'Roboto-Regular', fontWeight: '200' }}
                    searchTextFontFamily={{ fontFamily: 'Roboto-Regular', fontWeight: '200' }}
                    confirmFontFamily={{ fontFamily: 'Roboto-Regular', fontWeight: '200' }}
                    searchPlaceholderText='Chọn kiểu tóc'
                    colors={{ primary: '#000000', text: '#f9bc1a', success: '#f9bc1a' }}
                  />
                  <Dropdown containerStyle={styles.dropdown}
                    label={'Chọn nhân viên dịch vụ tóc'}
                    valueExtractor={(item) => { return item.Value }}
                    labelExtractor={(item) => { return item.Text }}
                    data={this.state.hairStaffServices}
                    onChangeText={(data) => {this.setState((state)=> (state.HairServiceRequest.ServiceStaffId=data, state))} }
                    fontSize={18}
                  />
                  <DateTimePicker
                    isVisible={this.state.showDateOfService}
                    onConfirm={this.onSelectedDateOfUseServiceChange}
                    onCancel={() => this.setState({ showDateOfService: false })}
                    is24Hour={true}
                    mode='datetime'
                  />
                  <TouchableOpacity onPress={() => this.setState({ showDateOfService: true })}>
                    <RkText style={styles.fakedtextinput} >{this.state.displayOfDateOfUseService}</RkText>
                  </TouchableOpacity>
                  <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"   keyboardType='numeric'
                   placeholder='Số điện thoại' maxLength={100} value ={this.state.HairServiceRequest.PhoneNumber} onChangeText={(text) => this.setState((state)=> (state.HairServiceRequest.PhoneNumber=text, state))} />
                  <TextInput style={styles.textArea}  underlineColorAndroid = "transparent"  multiline={true} 
                  placeholder='Ghi chú' maxLength={100} value ={this.state.CarServiceRequest.Note} onChangeText={(text) => this.setState((state)=> (state.CarServiceRequest.Note=text, state))} />

 
                </View>
            }
             {this.state.ServiceTypeId ==0 &&
             <View>
            {/* <SectionedMultiSelect
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
                    /> */}
                     
                  <TouchableOpacity onPress={() => this._setModalVisible(true)}>
                  <RkText style={styles.dropdownbox} >{'Chọn xe ...'}</RkText>
                    <View style={styles.downicon}>
                    <RkText rkType='secondary6' style={{   position: 'absolute', right:0, 
                      justifyContent:'center', alignSelf:'center', 
                     paddingRight: 10, textAlign:'center', color:'#9e9e9e',
                     textAlignVertical:'center' }} rkType='awesome'  numberOfLines={1}>{FontAwesome.down}</RkText>
                    </View>
                  </TouchableOpacity>
                    <View style={{flexDirection:'row', alignItems:'flex-start',flexWrap:'wrap', padding:5}}>
            {this.state.carServices.map((car)=>{
                    return(
                      <TouchableOpacity delayPressIn={70} style={[styles.selecteditem,
                        !car.Checked && {display: 'none'}]}
                      rkType='clear' key={car.Value} >
                        
                          <RkText rkType='secondary6 inverseColor' style={{ padding: 5,  }} numberOfLines={1}>{car.Text}</RkText>
                          <RkButton activeOpacity={0.8} style={{  alignSelf:'center',  paddingHorizontal: 5,borderRadius: 15, width:30, height:30}} rkType='clear' onPress={() => this.onTouchChangeEvent(car)}>
                            <RkText rkType='secondary2 inverseColor' style={{ fontSize: 20, textAlignVertical:'center'  }} rkType='awesome'  numberOfLines={1}>{FontAwesome.delete}</RkText>
                          </RkButton>
                        
                      </TouchableOpacity>);
            })}</View>
             <Dropdown containerStyle={styles.dropdown}
                    label={'Chọn tài xế'}
                    valueExtractor={(item) => { return item.Value }}
                    labelExtractor={(item) => { return item.Text }}
                    data={this.state.driverStaffServices}
                    onChangeText={(data)=>{this.setState((state)=> (state.CarServiceRequest.DriverId=data, state))}}
                    fontSize={18}
                  />
             
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
              <TextInput style={styles.textArea}  underlineColorAndroid = "transparent"   multiline={true}
                numberOfLines={4} placeholder='Địa điểm khởi hành' maxLength={1000} value ={this.state.CarServiceRequest.DepartureLocation} onChangeText={(text) => this.setState((state)=> (state.CarServiceRequest.DepartureLocation=text, state))} />
              <TextInput style={styles.textArea}  underlineColorAndroid = "transparent"   multiline={true}
                numberOfLines={4} placeholder='Địa điểm đến' maxLength={1000} value ={this.state.CarServiceRequest.Destination} onChangeText={(text) => this.setState((state)=> (state.CarServiceRequest.Destination=text, state))} />
              
              <TouchableOpacity onPress={()=>this.setState({showDateOfEndService:true})}>
                  <RkText style={styles.fakedtextinput} >{this.state.displayOfEndDatesUseService}</RkText>
              </TouchableOpacity>
              
              <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"   keyboardType='numeric' 
                 placeholder='Số điện thoại' maxLength={100} value ={this.state.CarServiceRequest.PhoneNumber} onChangeText={(text) => this.setState((state)=> (state.CarServiceRequest.PhoneNumber=text, state))} />
            
              <TextInput style={styles.textArea}  underlineColorAndroid = "transparent"   multiline={true}
              placeholder='Ghi chú' maxLength={1000} value ={this.state.CarServiceRequest.Note} onChangeText={(text) => this.setState((state)=> (state.CarServiceRequest.Note=text, state))} />

 
              </View>
           
             }
         
           
               <RkButton onPress={() => this.SubmitServiceRequest()}
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
      <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => this._setModalVisible(false)}
          visible={this.state.modalVisible}>
          <ScrollView>
          <View style={styles.popupOverlay}>
         
            <View style={styles.popup}>
              <View style={styles.popupContent}>
                  <View style={styles.popupHeader}>
                  <RkText style={styles.popupHeaderText} rkType='header6'>{'Chọn dịch vụ xe'.toUpperCase()}</RkText>
                  </View>
                  {this.state.carServices.map((car)=>{
                    return(
                      <TouchableOpacity delayPressIn={70}
                      activeOpacity={0.8} onPress={()=> this.onTouchChangeEvent(car)} rkType='clear' key={car.Value} >
                      <RkCard rkType='imgBlock' style={[styles.card,car.Checked==true?styles.cardChecked: styles.cardUnchecked]} >
                        <Image  rkCardImg source={{ uri: car.AvatarUrl }} />
                       
                        <View rkCardImgOverlay rkCardContent style={{zIndex:1}} >
                          <RkText rkType='secondary2 inverseColor' numberOfLines={1}>{car.Text}</RkText>
                          
                        </View>
                        <View style={styles.viewicon}>
                          <RkButton delayPressIn={70}
                          activeOpacity={0.8} onPress={()=> this.onTouchChangeEvent(car)} rkType='clear' style={styles.containericon}>
                            <RkText style={[styles.texticon,car.Checked==true?styles.checked: styles.unchecked]} rkType='awesome'>{FontAwesome.check}</RkText>
                          </RkButton>
                        </View>
                      </RkCard></TouchableOpacity>);
                  })}
              </View>
              <View style={styles.popupButtons}>
               
               
                <RkButton onPress={() => this._setModalVisible(false)}
                          style={styles.popupButtonOK}
                          rkType='clear'>
                  <RkText style={{color:'#FFFFFF'}}>Đóng</RkText>
                </RkButton>
              </View>
            </View>
           
          </View>
          </ScrollView>
        </Modal>
      </ScrollView>
    )
  }
  _validate(){
    if(this.state.ServiceTypeId ==1){
      return this._validateHairServiceRequest(this.state.HairServiceRequest);
    } else if(this.state.ServiceTypeId ==0){
      return this._validateCarServiceRequest(this.state.CarServiceRequest);
    } 
    NotificationHelper.Notify("Vui lòng chọn dịch vụ");
    return false;
  }
  _validateHairServiceRequest(HairServiceRequest){
    if(HairServiceRequest.HairStyles.length==0){
      NotificationHelper.Notify("Vui lòng chọn kiểu tóc");
    }  else if(HairServiceRequest.DatetOfService.length==0){
      NotificationHelper.Notify("Vui lòng chọn thời gian sử dụng dịch vụ");
    }  else if(HairServiceRequest.PhoneNumber.length==0){
      NotificationHelper.Notify("Vui lòng nhậo số điện thoại");
    } else{
      return true;
    }

    
    return false;
  }

  _validateCarServiceRequest(CarServiceRequest){
    if(CarServiceRequest.CarTypes.length==0){
      NotificationHelper.Notify("Vui lòng chọn xe");
    } else if(CarServiceRequest.StartDatesUseService.length==0){
      NotificationHelper.Notify("Vui lòng chọn ngày khởi hành");
    }  else if(CarServiceRequest.DepartureLocation.length==0){
      NotificationHelper.Notify("Vui lòng chọn nơi khởi hành");
    } else if(CarServiceRequest.PhoneNumber.length==0){
      NotificationHelper.Notify("Vui lòng nhập số điện thoại");
    } else{
      return true;
    }
    return false;
  }
  _SubmitServiceRequest() {
    try{
    let navigation = this.props.navigation;
      if (this.Validate() == false) {
        return;
      } else {
        let request = this.state.ServiceTypeId == 0? this.state.CarServiceRequest: this.state.HairServiceRequest;
       
        fetch('http://api-tmloyalty.yoong.vn/bookingRequest/bookingRequestService', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson!=null && responseJson.StatusCode==2){
              NotificationHelper.Notify("Gửi thành công");
            }            
           
            this._navigateAction();

          })
          .catch((error) => {
            if (__DEV__) {
              console.error(error);
            }
          });;

      }
    }
  catch(error) {
    if (__DEV__) {
      console.error(error);
    }
  }};
}

let styles = RkStyleSheet.create(theme => ({
  scrollview:{
    backgroundColor: theme.colors.screen.base
  },
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
  dropdownbox: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical:10,
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f0ec',
    color:'#9e9e9e',
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
    marginHorizontal: 15,
    borderColor: '#f9bc1a',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular'
  },
  dropdown:{
    borderRadius: 5,
    
    marginHorizontal: 10,
  },
  textArea: {
    minHeight: 80,
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
  popup: {
    backgroundColor: theme.colors.screen.base,
    marginTop: scaleVertical(20),
    marginHorizontal: 10,
    borderRadius: 3,
    
  },
  popupHeader:{
    marginVertical: 10,
    alignItems: 'center',
  },
  popupOverlay: {
    backgroundColor: theme.colors.screen.overlay,
    flex: 1,
    minHeight: viewportHeight,
    marginTop: UIConstants.HeaderHeight,
    alignContent: 'center',
  },
  popupContent: {
    margin: 10
  },
  popupHeaderText: {
    //marginBottom: scaleVertical(5)
  },
  popupButtons: {
    marginHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 5,
  },
  popupButtonOK: {
    flex: 1,
    height:40,
    marginVertical: 10,
    backgroundColor: '#f9bc1a'
  },
  popupButtonCancel: {
    flex: 1,
    height:40,
    marginVertical: 10,
    backgroundColor: '#242424'
  },
  card: {
    marginVertical: 4,
    
    borderColor: 'transparent',
  },
  cardChecked: {
    borderColor:'green',
    borderWidth:1,
    opacity:0.8
  },
  cardUnchecked: {
    borderColor:'transparent',
    borderWidth:1,
  },
  viewicon:{
    position:'absolute',
    bottom:0,
    right:0,
    width:wp(13),
    height:wp(13),
    zIndex:2,
    backgroundColor: '#f9bc1a',
    borderTopLeftRadius: 10,   
    
  },
  downicon:{
    flex:1,
    position:'absolute',
    right:7,
    width:wp(13),
    height:wp(13),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },

  containericon:{
    flex:1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  texticon:{
    fontSize:30,
    textAlign:'center',
    textAlignVertical: 'center'
  },
  checked: {    
    color:'green'
  },
  unchecked:{
    color:'#FFFFFF',
  },
  selecteditem:{
     flexDirection: 'row', 
     alignItems: 'flex-start', 
     paddingLeft:5,
     flexWrap: 'nowrap', 
     borderRadius: 20, 
     backgroundColor: '#f9bc1a', 
     margin:5 
  }
}));


function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation})(ServicePage);