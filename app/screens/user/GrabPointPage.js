import React from 'react';
import {
    ListView,
    FlatList,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal,
    TextInput
} from 'react-native';
import _ from 'lodash';
import {
    RkStyleSheet,
    RkText,
    RkTextInput,
    RkButton,
    RkTheme
} from 'react-native-ui-kitten';
import {
    RkSwitch,
    FindFriends
} from '../../components';
import { data } from '../../data';
import { Avatar } from '../../components/avatar';
import { FontAwesome } from '../../assets/icons';
import Facebook from '../other/Facebook';
import {UIConstants} from '../../config/appConstants';
import { connect } from 'react-redux';
import { loadingUserInformation } from '../../api/actionCreators';

import NotificationHelper from '../../utils/notificationHelper'
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import QRCodeScanner from 'react-native-qrcode-scanner';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
class GrabPointPage extends React.Component {
    static navigationOptions = {
        title: 'Quét mã tích điểm'.toUpperCase()
    };

    constructor(props) {
        super(props);
        this.state = {
            modalQRCodeVisible:false,
            Type: null,
            Value: ''
        }
        
        this.setModalQRCodeVisible = this._setModalQRCodeVisible.bind(this);      
        this.NavigateHome = this._navigateHome.bind(this);
    }
  
    _navigateHome() {
      let resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Home' })
        ]
      });
      this.props.navigation.dispatch(resetAction)
    }

    _ValidateWithDraw() {
        if (this.state.Value == null || this.state.Value == '') {
            return false;
        }

        return true;
    }
    _SubmitRequest() {

        try {
            let navigation = this.props.navigation;
            if (this._ValidateWithDraw() == false) {
                return;
            } else {
                if(__DEV__){
                    NotificationHelper.Notify(""+this.state.Value);
                }
                this.setModalVisible(false);
                this.setModalQRCodeVisible(false);
                fetch('http://api-tmloyalty.yoong.vn/Accumulate/AccumulatePoint', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.User.AccessToken.split('__')[0]
                    },
                    body: JSON.stringify({
                        AccountId: this.props.User.Id,
                        QRCodeValue: this.state.Value
                    }),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.error(responseJson);
                        if (responseJson.StatusCode != null && responseJson.StatusCode == 2) {
                           
                            NotificationHelper.Notify(responseJson.Message);
                            this.setState({
                                Value: ''
                            });
                            this.NavigateHome();
                            
                        } else {
                            NotificationHelper.Notify('Có lỗi xảy ra khi gửi yêu cầu');
                        }

                    })
                    .catch((error) => {
                        if (__DEV__) {
                            console.error(error);
                        }
                        NotificationHelper.Notify('Có lỗi xảy ra khi gửi yêu cầu');
                    });

            }
        }
        catch (error) {
            if (__DEV__) {
                console.error(error);
            }
        }
    };


    _setModalQRCodeVisible(visible) {
        this.setState({ modalQRCodeVisible: visible });
    }

    onActingVerification() {
      
        this.setState({ modalQRCodeVisible: true });
       
    }

    onCaptureQR(e){
        
      this.setState({Value:e.data},this._SubmitRequest());
    }
   

    renderQRCodeModal() {
        return (<Modal
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => this._setModalQRCodeVisible(true)}
            visible={this.state.modalQRCodeVisible}>
            <ScrollView>
                <View style={styles.popupOverlay}>

                    <View style={styles.popup}>
                        <View style={styles.popupContent}>
                            <View style={styles.popupHeader}>
                                <RkText style={styles.popupHeaderText} rkType='header6'>{'Quét mã QR'.toUpperCase()}</RkText>
                            </View>
                            <View style={{justifyContent:'center', alignSelf:'center', alignItems:'center',flex:1, flexDirection:'column'}}>
                            <QRCodeScanner showMarker={true} cameraStyle={{paddingHorizontal:10,justifyContent:'center', alignSelf:'center',   width: viewportWidth-60}} reactivate={true} onRead={this.onCaptureQR.bind(this)} />
                            </View>
                        </View>
                        <View style={styles.popupButtons}>
                           
                            <RkButton onPress={() => this._setModalQRCodeVisible(false)}
                                style={styles.popupButtonOK}
                                rkType='clear'>
                                <RkText style={{ color: '#FFFFFF' }}>Đóng</RkText>
                            </RkButton>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </Modal>);
    }

    render() {
        return (
            <ScrollView style={styles.root}>
                    
                    <View rkCardContent key='1'>
                        <View style={styles.box}>
                            <View style={styles.info}>
                                <RkText rkType='secondary6' >{'Bạn có thể tích điểm bằng cách sử dụng quét mã QR'}</RkText>
                                <View style={styles.actionButtons}>
                                        <TouchableOpacity style={styles.actionButtons} onPress={() => { this.onActingVerification() }}>
                                            <RkText rkType='awesome' style={[styles.icon, { color: '#41abe1' }]}>{FontAwesome.qrcode}</RkText>
                                            <RkText rkType='header6' style={{ color: '#41abe1' }}>{`Quét mã QR`}</RkText>
                                        </TouchableOpacity>
                                </View>
                                
                            </View>
                        </View>
                     

                    </View>
                {this.renderQRCodeModal()}
            </ScrollView>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base,
      },
    container: {
        backgroundColor: theme.colors.screen.base,
    },
    header: {
        paddingVertical: 25
    },
    section: {
        marginVertical: 25
    },
    box: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    info: {
        alignItems: 'center',
        flexDirection: 'column',
        padding: 15,
    },
    actionButtons:{ 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent:'center', 
        alignSelf: 'center', 
        padding: 20 
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 17.5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border.base,
        alignItems: 'center'
    },
    rowButton: {
        flex: 1,
        paddingVertical: 24
    },
    switch: {
        marginVertical: 14
    },
    wrapper: {
        flex: 1,
    },
    containerow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18
    },
    text: {
        flexDirection: 'row'
    },
    icon: {
        width: 35
    },
    popup: {
        backgroundColor: theme.colors.screen.base,
        marginTop: scaleVertical(20),
        marginHorizontal: 10,
        borderRadius: 3,
        
      },
    popupHeader: {
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
        padding:10,
    },
    separator: {
        width: 3
      },
    popupHeaderText: {
        //marginBottom: scaleVertical(5)
    },
    popupButtons: {
        marginHorizontal: 15,
        flexDirection: 'row',
        marginBottom: 5,
    },
    popupButtonCancel: {
        flex: 1,
        height:40,
        marginVertical: 10,
        backgroundColor: '#242424'
      },
    popupButtonOK: {
        flex: 1,
        height: 40,
        marginVertical: 10,
        backgroundColor: '#f9bc1a'
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
}));


function mapStateToProps(state) {
    return {
        User: state.UserManagement.User
    };
}

export default connect(mapStateToProps, { loadingUserInformation })(GrabPointPage);