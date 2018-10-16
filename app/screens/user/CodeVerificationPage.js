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
class CodeVerificationPage extends React.Component {
    static navigationOptions = {
        title: 'Nhập mã giới thiệu'.toUpperCase()
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalQRCodeVisible:false,
            Type: null,
            Value: '',
            actived:false
        }

        this.setModalVisible = this._setModalVisible.bind(this);
        this.setModalQRCodeVisible = this._setModalQRCodeVisible.bind(this);      
    }

    componentDidMount(){
        if(this.props.User.TagById!=null&& this.props.User.TagById.length>0){
            this.setState({actived:false});
        } else{
            this.setState({actived:true});
        }
    }

    _ValidateWithDraw() {
        if (this.state.Value == null || this.state.Value == '') {
            //NotificationHelper.Notify("Chưa điền thông tin");
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
                fetch('http://api-tmloyalty.yoong.vn/account/addreferer', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.User.AccessToken.split('__')[0]
                    },
                    body: JSON.stringify({
                        AccountId: this.props.User.Id,
                        RefererCode: this.state.Value,
                        Type: this.state.Type,
                    }),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.error(responseJson);
                        if (responseJson.StatusCode != null) {
                           
                            NotificationHelper.Notify(responseJson.Message);
                            this.setState({
                                Value: '',
                                Type: ''
                            });
                            
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

    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _setModalQRCodeVisible(visible) {
        this.setState({ modalQRCodeVisible: visible });
    }

    onActingVerification(type) {
        if(type==1|| type ==2){
            this.setState({ modalVisible: true, Type: type });
        }
        else{
            this.setState({ modalQRCodeVisible: true, Type: type });
        }
       
    }

    onCaptureQR(e){
        
      this.setState({Value:e.data},this._SubmitRequest());
    }
    renderCodeModal() {
        return (<Modal
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => this._setModalVisible(false)}
            visible={this.state.modalVisible}>
            <ScrollView>
                <View style={styles.popupOverlay}>

                    <View style={styles.popup}>
                        <View style={styles.popupContent}>
                            <View style={styles.popupHeader}>
                                <RkText style={styles.popupHeaderText} rkType='header6'>{'Vui lòng nhập mã'.toUpperCase()}</RkText>
                            </View>
                             <TextInput style={styles.textinput} underlineColorAndroid="transparent" placeholder='' maxLength={300} returnKeyLabel={"next"} value={this.state.Value} onChangeText={(text) => this.setState({ Value: text })} />
                        </View>
                        <View style={styles.popupButtons}>
                            <RkButton onPress={() => this._setModalVisible(false)}
                                style={styles.popupButtonCancel}
                                rkType='clear'>
                                <RkText style={{ color: '#FFFFFF' }} rkType='light'>Đóng</RkText>
                            </RkButton>
                            <View style={styles.separator} />
                            <RkButton onPress={() => this._SubmitRequest()}
                                style={styles.popupButtonOK}
                                rkType='clear'>
                                <RkText style={{ color: '#FFFFFF' }}>GỬI</RkText>
                            </RkButton>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </Modal>);
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
            <ScrollView style={styles.container}>
                <View style={styles.root}>
                    
                   { this.state.actived==false && <View style={styles.section} key='1'>
                        <View style={[styles.row, styles.heading]}>
                            <RkText rkType='primary header6'>{'Chọn hình thức nhập mã giới thiệu:'.toUpperCase()}</RkText>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity style={[styles.wrapper]} onPress={() => { this.onActingVerification(1) }}>
                                <View style={styles.containerow}>
                                    <View style={styles.text}>
                                        <RkText rkType='awesome' style={[styles.icon, { color: '#34a853' }]}>{FontAwesome.mobile}</RkText>
                                        <RkText rkType='header6' style={{ color: '#34a853' }}>{`Nhập số điện thoại`}</RkText>
                                    </View>
                                    <RkText rkType='awesome small' style={{ color: '#34a853' }}>{FontAwesome.chevronRight}</RkText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row} key='2'>
                            <TouchableOpacity style={[styles.wrapper]} onPress={() => { this.onActingVerification(2) }}>
                                <View style={styles.containerow}>
                                    <View style={styles.text}>
                                        <RkText rkType='awesome' style={[styles.icon, { color: '#3b5998' }]}>{FontAwesome.cardmember}</RkText>
                                        <RkText rkType='header6' style={{ color: '#3b5998' }}>{`Nhập mã thành viên`}</RkText>
                                    </View>
                                    <RkText rkType='awesome small' style={{ color: '#3b5998' }}>{FontAwesome.chevronRight}</RkText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row} key='3'>
                            <TouchableOpacity style={[styles.wrapper]} onPress={() => { this.onActingVerification(3) }}>
                                <View style={styles.containerow}>
                                    <View style={styles.text}>
                                        <RkText rkType='awesome' style={[styles.icon, { color: '#41abe1' }]}>{FontAwesome.qrcode}</RkText>
                                        <RkText rkType='header6' style={{ color: '#41abe1' }}>{`Quét bằng mã QR`}</RkText>
                                    </View>
                                    <RkText rkType='awesome small' style={{ color: '#41abe1' }}>{FontAwesome.chevronRight}</RkText>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                   }
                    { this.state.actived==true && <View style={styles.section} key='1'>
                        <View style={[styles.row, styles.heading]}>
                            <RkText rkType='secondary6'>{'Bạn đã được giới thiệu bởi thành viên '+ this.props.User.RefererName}</RkText>
                        </View>
                        </View>
                    }
                </View>
                {this.renderCodeModal()}
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
    heading: {
        paddingBottom: 12.5
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

export default connect(mapStateToProps, { loadingUserInformation })(CodeVerificationPage);