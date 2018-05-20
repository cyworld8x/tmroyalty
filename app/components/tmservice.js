import React from 'react';
import {
  ScrollView,
  Dimensions,
  Image,
  View
} from 'react-native';
import {
  RkButton, RkStyleSheet,
  RkText
} from 'react-native-ui-kitten';
const paddingValue = 8;

export class TMService extends React.Component {
  
  constructor(props) {
    super(props);
  }


  _calculateItemSize() {
    let {height, width} = Dimensions.get('window');
    return (width - paddingValue * 6) / 2;
  }

  render() {
    let size = this._calculateItemSize();
    //console.error(this.props);
    let navigation = this.props.navigation;

    let items = this.props.data.map(function (item, index) {
      return (
          <View key={item.id} style={{flexDirection: 'column',alignItems: 'center' }}>
              <RkButton
                  rkType='square shadow'
                  style={{ width: size, height: size, }}
                  key={index}
                  onPress={() => {
                    navigation.navigate('Article', {id:item.id})
                  }}>

                  <Image rkCardImg source={{uri:item.image}} style={{width: size, height: size, borderRadius: 4 }} />

              </RkButton>
              <RkText rkType='header5' style={{ width: size, color: '#f2b81c', textAlign: 'center',}} numberOfLines={1}>{item.title.toUpperCase()}</RkText>
          </View>
      )
    });


    return (
      <ScrollView style={styles.root}
                  contentContainerStyle={styles.rootContainer}>
        {items}
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
    padding: paddingValue,
  },
  rootContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  icon: {
    marginBottom: 16
  }
}));