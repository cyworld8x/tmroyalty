import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import {
  RkText,
  RkTheme
} from 'react-native-ui-kitten';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const dotSize = 8;
const lineTileWidth = wp(60);
const lineheight = 2;
export class TmTitle extends React.Component {

  constructor(props) {
    super(props);
    
  }

  render() {

    //CÁC DỊCH VỤ CỦA TM GROUP
    return (
        <View style={styles.container}>
            <RkText rkType='header6' style={{ color: '#8e8e8e' }} numberOfLines={1}>{this.props.text}</RkText>
            <View style={styles.area} >

                <View style={styles.line} >
                    <View style={styles.freespace} >

                    </View>
                </View>
            </View>
            <View style={styles.dot} >
            </View>
        </View>
    )
  }
}

let styles = StyleSheet.create({
    container: {
        alignItems: 'center', flexDirection: 'column',
        padding: 8,
    },
    area: {
        height: dotSize*4
    },
    line: {
        borderBottomWidth: lineheight,
        borderBottomColor: '#e8e8e8',
        alignSelf: 'center',
        height: dotSize*2,
        width: lineTileWidth
    },
    freespace: { alignSelf: 'center', height: dotSize*2, width: dotSize*4, backgroundColor: 'white' },
    dot: {
        alignSelf: 'center',
        height: dotSize,
        width: dotSize, 
        borderRadius: dotSize/2,
        marginTop: -Math.round(dotSize*2.5+lineheight/2),
        backgroundColor: '#ecb523'
    }

});