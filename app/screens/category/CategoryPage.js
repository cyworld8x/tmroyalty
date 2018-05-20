import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image
} from 'react-native';
import {
  RkText,
  RkButton,
  RkStyleSheet
} from 'react-native-ui-kitten';

import {Avatar} from '../../components/avatar';
import {MainRoutes} from '../../config/navigation/routes';

import { connect } from 'react-redux';
import { loadSettings } from '../../api/actionCreators';

import StoragePosts from '../../api/storagePosts';
import NetInfoHelper from '../../utils/netInfoHelper'
import NotificationHelper from '../../utils/notificationHelper'
import EncryptHelper from '../../utils/encryptHelper'
class CategoryPage extends React.Component {
  static navigationOptions = {
    title: 'GĐPT NEWS'.toUpperCase()
  };

  constructor(props) {
    super(props);

    
    this.state = {dimensions: undefined}
    this.loadingCategories = this.loadingCategories.bind(this);
    //this.props.loadSettings();
  };

  
  loadingCategories()
	{

		StoragePosts.loadingSettings().then((settings)=> {
			
			if(settings==null){
  				settings = {
 					ApiUrl : 'http://api.gdptthegioi.net',
 					WebsiteUrl : 'http://gdptthegioi.net'
  				}
  			}
  		
        console.error(settings.Categories);

		});
	}  
  _onLayout = event => {
    if (this.state.height)
      return;
    let dimensions = event.nativeEvent.layout;
    this.setState({dimensions})
  };

  _getEmptyCount(size) {
    let rowCount = Math.ceil((this.state.dimensions.height - 20) / size);
    return rowCount * 3 - MainRoutes.length;
  };

  render() {
    let navigate = this.props.navigation.navigate;
    let items = <View/>;
    //console.error(this.props.Categories);
    if (this.state.dimensions && this.props.Categories!=null) {
      let size = this.state.dimensions.width / 3;
      let emptyCount = this._getEmptyCount(size);

      items = this.props.Categories.map(function (route, index) {
        return (
          <RkButton rkType='tile'
                    style={{height: size, width: size}}
                    key={index}
                    onPress={() => {
                      navigate('NewsPage', {categoryid:route.id, categoryname:route.name })
                    }}>
                <Avatar img={{uri:route.thumbnail}} rkType='medium'/>
           
           
            <RkText numberOfLines = {1} rkType='small'>{route.name}</RkText>
          </RkButton>
        )
      });

      for (let i = 0; i < emptyCount; i++) {
        items.push(<View key={'empty' + i} style={[{height: size, width: size}, styles.empty]}/>)
      }

      
    }
    return (
      <ScrollView
        style={styles.root}
        onLayout={this._onLayout}
        contentContainerStyle={styles.rootContainer}>
        {items}
      </ScrollView>
    );
    
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  rootContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  empty: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base
  },
  icon: {
    marginBottom: 16
  }
}));


function mapStateToProps(state) {
  
  return { 
    Categories: state.Settings.Categories
  };
}

export default connect(mapStateToProps,{ loadSettings })(CategoryPage);