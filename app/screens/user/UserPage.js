import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView, Text,
  StyleSheet,
  Platform, 
  Dimensions,
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
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  }
import { Avatar } from '../../components/avatar';
import { FontAwesome } from '../../assets/icons';
import {NavigationActions} from 'react-navigation';
import {GradientButton} from '../../components/';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import NotificationHelper from '../../utils/notificationHelper';

import _ from 'lodash';
import { connect } from 'react-redux';
import { loadingUserInformation} from '../../api/actionCreators';
class UserPage extends React.Component {
  
  static navigationOptions = {
    title: 'Thông tin cá nhân'.toUpperCase()
  };

  constructor(props) {
    super(props);
  
  }

  render() {
   
    return (
        <ScrollView style={[styles.root]}>

            <View style={styles.container}>
               
                <View style={styles.section}>
                   
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProfilePage') }}>
                            <View style={styles.section}>
                                <View style={styles.avatar}>
                                    <Avatar img={{ uri: this.props.User.AvatarUrl }} style={{ justifyContent: 'center' }} rkType='medium rounded' />
                                </View>
                                <View style={styles.mainContent}>
                                    <RkText rkType='secondary2' >{this.props.User.FullName}</RkText>
                                    <RkText rkType='secondary6' >{`Cập nhật thông tin cá nhân`}</RkText>
                                </View>
                                {/* <RkText rkType='awesome' style={[styles.icon, { color: '#34a853' }]}>{FontAwesome.mobile}</RkText> */}
                                <View style={styles.rightContent}>
                                <RkText style={{  alignSelf: 'center',}}  rkType='awesome small'>{FontAwesome.chevronRight}</RkText>
                                </View>
                            </View>
                           
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.section}>
                    <Image style={styles.imageQR} source={{ uri: this.props.User.QRCodeUrl }} />
                </View>
            </View>
        </ScrollView>
    )
  }
 
}

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base,
      },
    container: {
        flex: 1,
        flexDirection: 'column',
    },    
    section: {
        paddingTop:10,
        flex:1,
        flexDirection: 'row',
    },
    imageQR:{
        paddingHorizontal: 10,
        width:viewportWidth,
        height:viewportWidth,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 17.5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border.base,
        alignItems: 'center'
    },
    content: {
        flex: 1,
        flexDirection: 'row',
      },
    avatar: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: wp(18),
    },
    mainContent: {
        justifyContent:'center',
        alignContent: 'center',
        padding: 10,
        width: wp(74),
        flexDirection:'column',
    },
    rightContent: {
        flexDirection: 'row',
        width:wp(8),
        alignSelf:'center',
        justifyContent: 'flex-end',
        position:'absolute',
        right:20
      }
    
}));
function mapStateToProps(state) {
  return { 
     User: state.UserManagement.User
  };
}

export default connect(mapStateToProps,{loadingUserInformation})(UserPage);