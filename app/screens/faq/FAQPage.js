import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
  RkTheme,
  RkCard
} from 'react-native-ui-kitten';
import _ from 'lodash';

var width = Dimensions.get('window').width;

class FAQPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      faqCategoriesList: [],
      faqDetailList: []
    };

    this.renderFaqItem = this.renderFaqItem.bind(this);
  }

  componentWillMount(){
    this.setState({ loading:true }, this.getSettings)
  }

  getSettings(){
    var url = 'http://api-tmloyalty.yoong.vn/FAQ/getAllFAQ';
      return fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson != null) {
          this.setState({
              loading:false,
              faqDetailList: responseJson['ListDetailsFQA'] || [],
              faqCategoriesList: responseJson['ListFQACategory'] || []
          });
        }else{
          NotificationHelper.Notify('Kết nối không thành công!');
        }

      })
      .catch((error) => {
        if (__DEV__) {
          console.error(error);
        }
        NotificationHelper.Notify('Kết nối không thành công!');
      });
  }

  renderFaqItem(categoryItem) {
    var w = (width - 20 - 20) / 2;
    let _customStyle = _.assignIn({}, categoryItem.index % 2 ? {marginLeft: 7.5,} : {marginRight: 7.5});

    return (
      <TouchableOpacity
        style={[{ width: w }, _customStyle]}
        onPress={() => {
          let _faqDetail = _.filter(this.state.faqDetailList, {CategoryId: categoryItem['Value']});
          this.props.navigation.navigate('FAQDetailPage', { fqDetail: _faqDetail });
        }}
      >
        <RkCard>
          <View style={[styles.faq_contentItem]}>
            <View style={styles.faq_imgWrapper}>
              <Image style={styles.faq_imgItem}
                source={categoryItem['AvatarUrl'] ? { uri: categoryItem['AvatarUrl'] }  : require('../../assets/images/image-placeholder.jpg')}
              />
            </View>
            <View style={styles.faq_roomContentWrapper}>
              <Text numberOfLines={2} style={{ textAlign: 'center', fontSize: 13, fontWeight: '800', color: '#8e8e8e', flex: 1, marginBottom: 6 }}>
                  {categoryItem['Text'] || ''}
              </Text>
            </View>
          </View>
        </RkCard>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
         <FlatList
          style={{ marginTop: 25 }}
          contentContainerStyle={{ justifyContent: 'flex-start' }}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 15 }} />;
          }}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => this.getSettings()}
            />
          }
          numColumns={2}
          initialNumToRender={10}
          data={this.state.faqCategoriesList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => _.assign(item, {index})}
          renderItem={({item}) => this.renderFaqItem(item) }
        /> 
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  faq_contentItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  faq_imgWrapper: {
    borderRadius: 3,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  faq_imgItem: {
    width: 70,
    height: 70,
    borderRadius: 3
  },
  faq_roomContentWrapper: {
    marginTop: 5
  }
}));
  
export default FAQPage;