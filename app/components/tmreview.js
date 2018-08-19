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

import {FontAwesome} from '../assets/icons';
const deviceHeight = Dimensions.get("window").height;

const deviceWidth = Dimensions.get("window").width;
function wp (percentage) {
  const value = (percentage * deviceWidth) / 100;
  return Math.round(value);
}

export class TMReview extends React.Component {
  
    constructor(props) {
      super(props);
    }

    render() {
      let navigation = this.props.navigation;
      let data = this.props.data;
      let colors = ['#FFFFFF', '#ff6f31' ,'#ff9f02','#ffcf02','#9ace6a','#57bb8a']
      let stars = [];
      for(let i = 1 ; i<=5; i++){
       
        stars.push(<RkText key={''+i} style={{color:i<=data.AverageRating?'yellow':'gray'}} rkType='awesome secondaryColor'>{FontAwesome.star}</RkText>);
      }

      let bars = data.Items.map((item)=>{
          let w = Math.round(item.Percent/100* wp(60));
        return (<View style={{ flexDirection: 'row', paddingVertical:2}} key={''+Math.random(1000)}>
        <RkText style={{paddingHorizontal:5}} rkType='hintColor secondary2'>{``+item.Star}</RkText>
        <View style={{ width:w==0?1:w, height:20, backgroundColor:colors[item.Star]}}/>
      </View>)
      });
      
      return (<View rkCardHeader style={styles.rootContainer}>
        <View style={styles.container}>
          <View style={styles.starReview}>
            <RkText  rkType='secondary6'>{'Đánh Giá'}</RkText>
            <RkText style={{paddingVertical:5, fontSize: 30, color:'red'}} rkType='header5'>{data.AverageRating.toString()+'/5'}</RkText>
          <View style={styles.stars}>
            {stars}
          </View>
            <View style={styles.summary}>
              <RkText style={{ paddingHorizontal:5}} rkType='awesome secondaryColor'>{FontAwesome.user}</RkText>
              <RkText  rkType='secondary2 hintColor'>{`Tổng :` + data.TotalCount}</RkText>
            </View>
          </View>
          <View style={styles.barReview}>
            {bars}
          </View>
        </View>
       
      </View>);
    }
}


let styles = RkStyleSheet.create(theme => ({
    
    rootContainer: {
        flexDirection: 'column',
    },
    container: { flexDirection: 'row', flex:1 },
    starReview:{ width:wp(35),flexDirection: 'column', alignItems:'center' },
    barReview:{ width:wp(65)},
    stars:{ flexDirection: 'row', flex:1,paddingVertical:5 },
    summary:{ flexDirection: 'row', flex: 1, alignItems:'flex-end' , paddingVertical:5}
  }));