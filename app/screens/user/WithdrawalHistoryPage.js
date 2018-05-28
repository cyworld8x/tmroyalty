import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import {
  RkText,
  RkCard,
  RkButton,
  RkStyleSheet,
  RkTheme,
  RkTextInput
} from 'react-native-ui-kitten';
import LinearGradient from 'react-native-linear-gradient';
import {data} from '../../data';
import {PasswordTextInput} from '../../components/passwordTextInput';
import {UIConstants} from '../../config/appConstants';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

export default class WithdrawalHistoryPage extends React.Component {
  static navigationOptions = {
    title: 'Lịch sử rút tiền'.toUpperCase()
  };

  constructor(props) {
    super(props);
    this.data = data.getTransactions();
    this.state = {
      modalVisible: false,
      accountname:'',
      bankname:'',
      accountnumber:'',
      bankaddress:'',
      contnet:''
    }
  }

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
    if (type != null && type == 1) {
     
      return {
        gradient: ['#303b46', '#3e4a56'],
        icon: require('../../assets/icons/masterCardIcon.png')
      };
    } else {
      return {
        gradient: RkTheme.current.colors.gradients.mastercard,
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
      <View style={styles.footer}>
        <RkButton style={[styles.button, {backgroundColor:'#303b46'}]}  onPress={() => this._setModalVisible(true)} rkType='circle'>
          <Image source={require('../../assets/icons/iconPlus.png')}/>
        </RkButton>
      </View>
    )
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _renderItem(info) {

    let {gradient, icon} = this._getCardStyle(info.item.status);

    return (
      <RkCard rkType='credit' style={styles.card}>
        <TouchableOpacity delayPressIn={70}
                          activeOpacity={0.8}
                          onPress={() => this._setModalVisible(true)}>
          <LinearGradient colors={gradient}
                          start={{x: 0.0, y: 0.5}}
                          end={{x: 1, y: 0.5}}
                          style={styles.background}>
            <View rkCardHeader>
              <RkText rkType='header4 inverseColor'>{info.item.bankname}</RkText>
              <Image source={icon}/>
            </View>
            <View rkCardContent>
              <View style={styles.cardNoContainer}>
                <RkText style={styles.cardNo} rkType='header2 inverseColor'>{info.item.accountnumber}</RkText>
              </View>
              <RkText style={styles.date} rkType='header6 inverseColor' numberOfLines={1}>{ `${info.item.amount} Đ`}</RkText>
            </View>
            <View rkCardFooter>
              <View>
                <RkText rkType='header4 inverseColor'>{info.item.date}</RkText>
                <RkText rkType='header6 inverseColor'>{info.item.accountname.toUpperCase()}</RkText>
              </View>
              <RkText
                rkType='header6 inverseColor'>{info.item.status!=null && info.item.status==1?'Đã duyệt':'Chưa duyệt' }</RkText>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </RkCard>
    )
  }

  render() {
    return (
      <View style={styles.root}>
        <FlatList style={styles.list}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={() => this._renderHeader()}
                  keyExtractor={(item) => item.id}
                  data={this.data}
                  renderItem={(info) => this._renderItem(info)}/>
        <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => this._setModalVisible(false)}
          visible={this.state.modalVisible}>
          <ScrollView>
          <View style={styles.popupOverlay}>
         
            <View style={styles.popup}>
              <View style={styles.popupContent}>
                  <RkText style={styles.popupHeader} rkType='header4'>Nhập nội dung rút tiền</RkText>
                  <RkTextInput rkType='small' placeholder='Ngân hàng'  maxLength={100}  returnKeyLabel = {"next"} value ={this.state.bankname} onChangeText={(text) => this.setState({bankname:text})}/>
                  <RkTextInput rkType='' placeholder='Tên tài khoản' maxLength={100}  returnKeyLabel = {"next"} value ={this.state.accountname} onChangeText={(text) => this.setState({accountname:text})}/>
                  <RkTextInput rkType='' placeholder='Chi nhánh/PGD' maxLength={100}  value ={this.state.bankaddress} onChangeText={(text) => this.setState({bankaddress:text})}/>
                  <RkTextInput rkType='' placeholder='Số tài khoản' maxLength={100}   value ={this.state.accountnumber} onChangeText={(text) => this.setState({accountnumber:text})}/>
                  <RkTextInput rkType='' multiline={true}
                    numberOfLines={4} placeholder='Nội dung'  maxLength={300} value ={this.state.content} onChangeText={(text) => this.setState({content:text})} />
              </View>
              <View style={styles.popupButtons}>
                <RkButton onPress={() => this._setModalVisible(false)}
                          style={styles.popupButton}
                          rkType='clear'>
                  <RkText rkType='light'>HỦY</RkText>
                </RkButton>
                <View style={styles.separator}/>
                <RkButton onPress={() => this._setModalVisible(false)}
                          style={styles.popupButton}
                          rkType='clear'>
                  <RkText>GỬI</RkText>
                </RkButton>
              </View>
            </View>
           
          </View>
          </ScrollView>
        </Modal>
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
  popup: {
    backgroundColor: theme.colors.screen.base,
    marginTop: scaleVertical(30),
    marginHorizontal: 20,
    borderRadius: 3
  },
  popupOverlay: {
    backgroundColor: theme.colors.screen.overlay,
    flex: 1,
    marginTop: UIConstants.HeaderHeight
  },
  popupContent: {
    alignItems: 'center',
    margin: 5
  },
  popupHeader: {
    marginBottom: scaleVertical(45)
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: theme.colors.border.base
  },
  popupButton: {
    flex: 1,
    marginVertical: 16
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    width: 1
  }
}));