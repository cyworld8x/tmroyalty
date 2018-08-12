import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import HTML from 'react-native-render-html';

var width = Dimensions.get('window').width;

class FAQDetailPage extends React.Component {
  static navigationOptions = {
    title: 'Hỏi đáp'
  };

  constructor(props) {
    super(props);
    let {params} = this.props.navigation.state;
    let _fqDetail =  params.fqDetail;

    this.state = {
        data: _fqDetail || [],
        activeSection: false,
        collapsed: true
    };
  }

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSection = section => {
    this.setState({ activeSection: section });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={200}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Text style={styles.headerText}>{section['Name']}</Text>
      </Animatable.View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <View style={styles.content} >
        <HTML html={section['FullDescription']} />
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Accordion
          activeSection={this.state.activeSection}
          sections={this.state.data}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={100}
          onChange={this.setSection}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 3,
    minHeight: 46,
    flex: 1,
    justifyContent: 'center'
  },
  headerText: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff'
  },
  content: {
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 14,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3
  },
  active: {
    backgroundColor: '#60bcd3',
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  inactive: {
    backgroundColor: '#60bcd3',
  },
});
  
export default FAQDetailPage;