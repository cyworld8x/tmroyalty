import React from 'react';
import {
  Image,
  View
} from 'react-native';
import {
  RkComponent,
  RkText,
  RkTheme,
  RkCard,
  RkStyleSheet
} from 'react-native-ui-kitten';
import {FontAwesome} from '../../assets/icons';
import { Avatar} from '../../components';

import LinearGradient from 'react-native-linear-gradient';
const nothumbnail = require('../../assets/images/kittenImage.png');
export class UserInformationCard extends RkComponent {
  componentName = 'Avatar';
  typeMapping = {
    container: {},
    image: {},
    badge: {},
    badgeText: {}
  };

  constructor(props) {
    super(props);
  }

  renderImg(styles) {
    let {image, badge, badgeText} = styles;

    return (
      <View>
        <Image style={image} source={this.props.img} />
        { this.props.badge && this.renderBadge(badge, badgeText)}
      </View>
    )
  }

  renderBadge(style, textStyle) {
    let symbol;
    let backgroundColor;
    let color;

    switch (this.props.badge) {
      case 'like':
        symbol = FontAwesome.heart;
        backgroundColor = RkTheme.current.colors.badge.likeBackground;
        color = RkTheme.current.colors.badge.likeForeground;
        break;
      case 'follow':
        symbol = FontAwesome.plus;
        backgroundColor = RkTheme.current.colors.badge.plusBackground;
        color = RkTheme.current.colors.badge.plusForeground;
        break;
    }

    return (
      <View style={[style, {backgroundColor}]}>
        <RkText rkType='awesome' style={[textStyle, {color}]}>
          {symbol}
        </RkText>
      </View>
    )
  };

  render() {
    let {container, ...other} = this.defineStyles();
    return (
      <View rkCardContent>
        <LinearGradient colors={['#303b46', '#3e4a56']}
          style={styles.background}>

          <View style={[styles.header]}>


            <View style={[container, styles.info]}>
              {this.renderImg(other)}

               <RkText rkType='header5' style={styles.name}>
                  HI, {this.props.data.name.toUpperCase()}!
               </RkText>

               <RkText rkType='header5' style={styles.balance} >
                {this.props.data.balance} đ
               </RkText>

                <RkText rkType='secondary3' style={styles.tooltip} >
                  Số tiền bạn tích lũy được
                </RkText>
            </View>

          </View>
        </LinearGradient>
      </View>
    )
  }


}


let styles = RkStyleSheet.create(theme => ({
  background: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
  },

  info: {
    alignItems: 'center',
    flexDirection: 'column',
    padding: 5,
  },
  name: {
    padding: 5,
    color: '#ffffff',
  },
  balance: {
    padding: 5,
    color: '#f2b81c',
  },
  tooltip:{
    padding: 5,
    color: '#aeb9c3',
  }
  
}));
