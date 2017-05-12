import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';

import { LoginScreen } from './app/components/LoginScreen/LoginScreen.js'
import { ProspectListScreen } from './app/components/ProspectListScreen/ProspectListScreen.js'
import { ProspectEditScreen } from './app/components/ProspectEditScreen/ProspectEditScreen.js'
import * as constants from './app/config/const.js'


const options = {
		navigationOptions: {
		        title: "ExelciaCRM Prospect Manager",
		        headerStyle: {
								backgroundColor: '#1F94B7',
		        			 },
		        headerTitleStyle: {
		        					color: 'white',
		        					alignSelf: 'center',
		        				  },
    }
  };


const Navigator = StackNavigator({
			[constants.loginScreen]: { screen: LoginScreen },
			[constants.listScreen]: { screen: ProspectListScreen },
			[constants.editScreen]: { screen: ProspectEditScreen },
		},
		options
);

class App extends Component {


	render(){
		return ( 
			<Navigator onNavigationStateChange={null}/>
			);

	}

}



AppRegistry.registerComponent('CRM_Prospect', () => App);
