import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import {
  RkText,
  RkCard,
  RkButton,
  RkStyleSheet,
  RkTheme,
  RkTextInput,
  RkPicker
} from 'react-native-ui-kitten';

import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux';
import { loadingUserInformation} from '../../api/actionCreators';
import {GradientButton} from '../../components/gradientButton';
import {data} from '../../data';
import {PasswordTextInput} from '../../components/passwordTextInput';
import {UIConstants} from '../../config/appConstants';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

import {UserInformationCard} from '../../components';
import NotificationHelper from '../../utils/notificationHelper'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
class WithdrawalHistoryPage extends React.Component {
  static navigationOptions = {
    title: 'Lịch sử rút tiền'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalNoticeVisible: false,
      AccountHolderName :'',
      BankAddress :'',
      BankAccountNumber :'',
      AmountToWithdraw:'',      
      PhoneNumber: this.props.User.PhoneNumber!=null?this.props.User.PhoneNumber:'',
      WithDrawTypeValue:'',
      WithDrawTypeText:null,
      WithDrawTypes:[],      
      data:[],
      service:{},
      pickerVisible: false,
    }
    this.SubmitRequest = this._SubmitRequest.bind(this);
    this.GethistoryWithdraw = this._gethistoryWithdraw.bind(this);
  }
  componentWillMount() {
    this.GethistoryWithdraw();
    this.getWithdrawServiceStatus();
    this.getwithDrawType();
  }

  getwithDrawType(){
    var url = 'http://api-tmloyalty.yoong.vn/historyWithdraw/withDrawType';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null) {
          let withDrawTypes = _.filter(responseJson, (withDrawType) => {
            
            if(withDrawType.Value!=null && withDrawType.Value!=''){
              return withDrawType;
            }
          }).map((item)=>{return {
            value: item.Value,
            label: item.Text
          }});
         
         this.setState({WithDrawTypes: withDrawTypes,WithDrawTypeValue : responseJson[0].Value,WithDrawTypeText : responseJson[0].Text });
         
        }

      })
      .catch((error) => {
        if (__DEV__) {
          console.error(error);
        }
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
  getWithdrawServiceStatus(){
    var url = 'http://api-tmloyalty.yoong.vn/withdraw/getwithdrawservicestatus?accountId='+this.props.User.Id;
      return fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
        }})
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null && responseJson.StatusCode == 2) {
          this.setState({service: responseJson.Data});
          
        }else{
          NotificationHelper.Notify('Kết nối không thành công!');
        }

      })
      .catch((error) => {
        console.error(error);
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
  _gethistoryWithdraw(){
    var url = 'http://api-tmloyalty.yoong.vn/historyWithdraw/history';
      return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
        },
        body: JSON.stringify({
          AccountId: this.props.User.Id,
          CurrentPage: 1,
          PageSize: 100
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (responseJson!=null && responseJson.StatusCode == 2) {
          this.setState({data: responseJson.Data.Items});
          
        }else{
          NotificationHelper.Notify('Kết nối không thành công!');
        }

      })
      .catch((error) => {
        
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }
  _VadidateWithDraw()
    {
        if (this.state.WithDrawTypeValue == null || this.state.WithDrawTypeValue == '') {
          NotificationHelper.Notify("Vui lòng chọn hình thức rút tiền");
        } else {
          if (this.state.WithDrawTypeValue == 'BankAccount') {
            if (this.state.AccountHolderName.length == 0) {
              NotificationHelper.Notify("Vui lòng nhập tên tài khoản");
            } else if (this.state.BankAddress.length == 0) {
              NotificationHelper.Notify("Vui lòng nhập Ngân hàng & CN giao dịch");
            } else if (this.state.AmountToWithdraw.length == 0) {
              NotificationHelper.Notify("Vui lòng nhập số tiền cần rút");
            } else if (this.state.BankAccountNumber.length == 0) {
              NotificationHelper.Notify("Vui lòng nhập số tài khoản");
            } else {
              return true;
            }
          } else if (this.state.WithDrawTypeValue == 'Momo') {
            if (this.state.AccountHolderName.length == 0) {
              NotificationHelper.Notify("Vui lòng nhập tên tài khoản");
            
            } else if (this.state.AmountToWithdraw.length == 0) {
              NotificationHelper.Notify("Vui lòng nhập số tiền cần rút");
            } else if (this.state.BankAccountNumber.length == 0) {
              NotificationHelper.Notify("Vui lòng nhập số tài khoản");
            } else {
              return true;
            }
          } else if (this.state.AmountToWithdraw.length == 0) {
            NotificationHelper.Notify("Vui lòng nhập số tiền cần rút");
          } else if (this.state.PhoneNumber.length == 0) {
            NotificationHelper.Notify("Số điện thoại");
          } else {
            return true;
          }
          return false;         
      }
      return false;
    }
  _CancelRequest() {
    this.setState({
      BankAddress: '',
      AccountHolderName: '',
      BankAccountNumber: '',
      //PhoneNumber: '',
      AmountToWithdraw:''
    });
    this._setModalVisible(false);
  }
  _SubmitRequest() {

    try {
      
      if (this._VadidateWithDraw() == false) {
        return;
      } else {
        
        fetch('http://api-tmloyalty.yoong.vn/withdraw/requestWithdraw', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' +  this.props.User.AccessToken.split('__')[0]
          },
          body: JSON.stringify({
            AccountId :this.props.User.Id,
            FullName:this.props.User.FullName,
            //Email :this.props.User.Email!=null?this.props.User.Email:'noreply@noreply.com',
            BankAddress: this.state.BankAddress,
            AccountHolderName:this.state.AccountHolderName,
            BankAccountNumber : this.state.BankAccountNumber,
            AmountToWithdraw : this.state.AmountToWithdraw,
            WithdrawTypes : this.state.WithDrawTypeValue,
            PhoneNumber:this.state.PhoneNumber
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //console.error(responseJson);
            if(responseJson.StatusCode!=null && responseJson.StatusCode == 2){
              
              this.setState({
                BankAddress: '',
                AccountHolderName: '',
                BankAccountNumber: '',
                //PhoneNumber: '',
                AmountToWithdraw:'',
                modalVisible: false
              },()=>{
                this.GethistoryWithdraw();
                if (Platform.OS === "android") {
                  NotificationHelper.Notify(responseJson.Message);
                }
                
              });
              
            }else{
              NotificationHelper.Notify(responseJson.Message);
            }
          
          })
          .catch((error) => {
            if (__DEV__) {
            console.error(error);
            }
            NotificationHelper.Notify('Có lỗi xảy ra khi gửi yêu cầu rút tiền');
          });

      }
    }
    catch (error) {
      if (__DEV__) {
      console.error(error);
      }
    }
  };

  _getCardStyle(type) {
    // switch (type) {
    //   case 'visa':
    //     return {
    //       gradient: RkTheme.current.colors.gradients.visa,
    //       icon: require('../../assets/icons/visaIcon.png')
    //     };
    //   case 'mastercard':
    //     return {
    //       gradient: RkTheme.current.colors.gradients.mastercard,
    //       icon: require('../../assets/icons/masterCardIcon.png')
    //     };
    //   case 'axp':
    //     return {
    //       gradient: RkTheme.current.colors.gradients.axp,
    //       icon: require('../../assets/icons/americanExpressIcon.png')
    //     };
    // }

    if (type != null && type == 'Đang xử lý') {
      return {
        gradient: RkTheme.current.colors.gradients.mastercard,
        icon: require('../../assets/icons/masterCardIcon.png')
      };
     
    } if (type != null && type == 'Hoàn tất') {
      return {
        gradient: ['#cab607', '#ffeb3b'],
        icon: require('../../assets/icons/masterCardIcon.png')
      };
    } else {
      
      return {
        gradient: ['#303b46', '#3e4a56'],
        icon: require('../../assets/icons/masterCardIcon.png')
      };
      
    }
  }

  _formatCurrency(amount, currency) {
    let symbol;
    switch (currency) {
      case 'usd':
        symbol = '$';
        break;
      case 'eur':
        symbol = '€';
        break;
    }
    return `${symbol}${amount}`;
  }

  _prepareCardNo(cardNo) {
    let re = /\*+/;
    let parts = cardNo.split(re);
    return {firstPart: parts[0], lastPart: parts[1]}
  }

  _renderHeader() {
    return (
      <View rkCardContent >
        {this.props.User != null  &&   <UserInformationCard rkType='circle medium' 
        Component={this.state.service.ServiceAvailable != null? (<RkButton style={[styles.withDrawServiceButton,{backgroundColor:this.state.service.StateColor}]} 
        onPress={() => { this.onWithDrawBtnClick()}}>
            <RkText rkType='header6'>RÚT TIỀN</RkText>
        </RkButton>):(<View/>)} data={{ name: this.props.User.FullName, balance: this.props.User.LoyaltyAmount }} img={{ uri: this.props.User.AvatarUrl != null && this.props.User.AvatarUrl.length > 0 ? this.props.User.AvatarUrl : this.props.User.SocialPicture }} />}
        </View>
      
    )
  }

  onWithDrawBtnClick(){
    
    if(this.state.service!=null ){
      if(this.state.service.ServiceAvailable==true){
        this._setModalVisible(true);
      }
      else {
        this._setModalNoticeVisible(true);
      }     
    } 
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _setModalNoticeVisible(visible) {
    this.setState({modalNoticeVisible: visible});
  }

  _renderItem(info) {

    let {gradient, icon} = this._getCardStyle(info.item.WithdrawStatus);

    return (
      <RkCard rkType='credit' style={styles.card} key={info.item.Id}>
        <TouchableOpacity delayPressIn={70}
                          activeOpacity={0.8} >
          <LinearGradient colors={gradient}
                          start={{x: 0.0, y: 0.5}}
                          end={{x: 1, y: 0.5}}
                          style={styles.background}>
            <View rkCardHeader>
              <RkText rkType='header4 inverseColor'>{info.item.PhoneNumber}</RkText>
              <Image source={icon}/>
            </View>
            <View rkCardContent>
              <View style={styles.cardNoContainer}>
                <RkText style={styles.cardNo} rkType='header2 inverseColor'>{info.item.WithdrawTypes}</RkText>
              </View>
              <RkText style={styles.date} rkType='header6 inverseColor' numberOfLines={1}>{ `${info.item.AmountToWithdraw} Đ`}</RkText>
            </View>
            <View rkCardFooter>
              <View>
                {/* <RkText rkType='header4 inverseColor'>{info.item.date}</RkText> */}
                <RkText rkType='header6 inverseColor'>{info.item.FullName.toUpperCase()}</RkText>
              </View>
              <RkText
                rkType='header6 inverseColor'>{info.item.WithdrawStatus }</RkText>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </RkCard>
    )
  }

  renderWithDrawModel(){
    return(<Modal
      animationType={'fade'}
      transparent={true}
      onRequestClose={() => this._setModalVisible(false)}
      visible={this.state.modalVisible}>
      <ScrollView>
      <View style={styles.popupOverlay}>
     
        <View style={styles.popup}>
          <View style={styles.popupContent}>
              <View style={styles.popupHeader}>
              <RkText style={styles.popupHeaderText} rkType='header6'>{'Nhập nội dung rút tiền'.toUpperCase()}</RkText>
              </View>
              <Dropdown containerStyle={styles.dropdown}
                label={this.state.WithDrawTypeText}
                data={this.state.WithDrawTypes}
                onChangeText={(data)=>{ this.setState({WithDrawTypeValue:data})}}
                fontSize={18}
              />
              {
                this.state.WithDrawTypeValue != null && (this.state.WithDrawTypeValue == 'BankAccount' || this.state.WithDrawTypeValue == 'Momo') && 
                  <View>
                  <TextInput style={styles.textinput} underlineColorAndroid="transparent" placeholder='Tên tài khoản' maxLength={300} returnKeyLabel={"next"} value={this.state.AccountHolderName} onChangeText={(text) => this.setState({ AccountHolderName: text })} />
                  <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  placeholder={this.state.WithDrawTypeValue == 'BankAccount'? 'Số tài khoản':'Số tài khoản Momo'} maxLength={100}   value ={this.state.BankAccountNumber } onChangeText={(text) => this.setState({BankAccountNumber :text})}/>
                  </View>
              }
              {
                this.state.WithDrawTypeValue!=null && this.state.WithDrawTypeValue=='BankAccount' && <View>
                <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  placeholder='Ngân hàng & CN giao dịch' maxLength={300}  value ={this.state.BankAddress} onChangeText={(text) => this.setState({BankAddress :text})}/>
                
                
                  </View>
              }
              <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"   keyboardType='numeric'  placeholder='Số tiền' maxLength={100}   value ={this.state.AmountToWithdraw} onChangeText={(text) => this.setState({AmountToWithdraw:text})}/>
              <TextInput style={styles.textinput}  underlineColorAndroid = "transparent"  keyboardType='numeric'
                   placeholder='Số điện thoại'  maxLength={100} value ={this.state.PhoneNumber} onChangeText={(text) => this.setState({PhoneNumber:text})} />
          </View>
          <View style={styles.popupButtons}>
            <RkButton onPress={() => this._CancelRequest()}
                      style={styles.popupButtonCancel}
                      rkType='clear'>
              <RkText style={{color:'#FFFFFF'}} rkType='light'>HỦY</RkText>
            </RkButton>
            <View style={styles.separator}/>
           
            <RkButton onPress={() => this.SubmitRequest()}
                      style={styles.popupButtonOK}
                      rkType='clear'>
              <RkText style={{color:'#FFFFFF'}}>GỬI</RkText>
            </RkButton>
          </View>
        </View>
       
      </View>
      </ScrollView>
    </Modal>);
  }
  
  renderNoticeInformationModal(){
    return(<Modal
      animationType={'fade'}
      transparent={true}
      onRequestClose={() => this._setModalNoticeVisible(false)}
      visible={this.state.modalNoticeVisible}>
      <ScrollView>
      <View style={styles.popupOverlay}>
        <View style={styles.popup}>
          <View style={styles.popupContent}>
              <View style={styles.popupHeader}>
              <RkText style={styles.popupHeaderText} rkType='header6'>{'Thông báo trạng thái'.toUpperCase()}</RkText>
              </View>
              <View style={{paddingHorizontal:5}}>
                {this.state.service.Note!=null &&  this.state.service.Note.map((note)=>{
                  return(<RkText key={note}  rkType='header6'>{note}</RkText>)
                })}
              </View>
          </View>
          <View style={styles.popupButtons}>
           
           
            <RkButton onPress={() => this._setModalNoticeVisible(false)}
                      style={styles.popupButtonOK}
                      rkType='clear'>
              <RkText style={{color:'#FFFFFF'}}>Đóng</RkText>
            </RkButton>
          </View>
        </View>
       
      </View>
      </ScrollView>
    </Modal>);
  }
  render() {
    return (
      <View style={styles.root}>
        <FlatList 
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={() => this._renderHeader()}
                  keyExtractor={(item) => item.id}
                  data={this.state.data}
                  renderItem={(info) => this._renderItem(info)}/>
        {this.renderWithDrawModel()}
        {this.renderNoticeInformationModal()}
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  list: {
    marginHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  background: {
    borderRadius: 7,
  },
  cardNoContainer: {
    flexDirection: 'row'
  },
  cardNo: {
    marginHorizontal: 8,
  },
  cardPlaceholder: {
    paddingTop: 4,
  },
  date: {
    marginTop: scaleVertical(20)
  },
  footer: {
    marginTop: 8,
    marginBottom: scaleVertical(16),
    alignItems: 'center'
  },
  button: {
    height: 56,
    width: 56
  },
  innerTextInput: {
    textAlign: 'center'
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
    marginTop: UIConstants.HeaderHeight
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
  separator: {
    width: 3
  },
  balloon: {
    maxWidth: scale(250),
    padding: 15,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: theme.colors.border.solid,
  },
  withDrawServiceButton:{
    marginTop: 5, width:180, height:40, borderRadius: 20, backgroundColor:'#f9bc1a'
  },
  dropdown:{
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  textinput:{
      borderRadius: 5,
      marginHorizontal: 15,
      marginVertical: 10,
      height: 40,
      borderColor: '#f9bc1a',
      borderWidth: 1,
      fontSize:16,
      fontFamily: 'Roboto-Regular'
  },
  textArea:{
    minHeight: 80,
    borderRadius: 5,
    margin: 15,
    borderColor: '#f9bc1a',
    borderWidth: 1,
    fontSize:16,
    fontFamily: 'Roboto-Regular'
  }
}));


function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation})(WithdrawalHistoryPage);