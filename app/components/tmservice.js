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
          <View key={item.Id} style={styles.cardContainer}>
              <RkButton
                  rkType='square shadow'
                  style={{ width: size, height: size, }}
                  key={index}
                  onPress={() => {
                    navigation.navigate('Article', {id:item.Id})
                  }}>

                  <Image rkCardImg source={{uri:item.AvatarUrl}} style={{ width: size, height: size, borderRadius: 4 }} />

              </RkButton>
              <RkText rkType='header5' style={[styles.title,{width: size}]} numberOfLines={1}>{item.Name.toUpperCase()}</RkText>
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
  cardContainer:{flexDirection: 'column',alignItems: 'center' },
  icon: {
    marginBottom: 16
  },
  title:{  color: '#f2b81c', textAlign: 'center',}
}));