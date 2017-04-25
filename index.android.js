import React, { Component } from 'react';
import { AppRegistry, View} from 'react-native';

import { LoginScreen } from './app/components/LoginScreen/LoginScreen.js'
import { styles } from './app/layout/styles.js'

class Main extends Component {

  render() {
    return ( 	
    	<View style={{flex: 1}}>
     		<LoginScreen/>
    	</View>
    );
  }
}


AppRegistry.registerComponent('CRM_Prospect', () => Main);