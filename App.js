import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';
import { LoginScreen } from './app/components/LoginScreen/LoginScreen.js'
import { ProspectListScreen } from './app/components/ProspectListScreen/ProspectListScreen.js'
import { ProspectEditScreen } from './app/components/ProspectEditScreen/ProspectEditScreen.js'
import * as constants from './app/config/const.js'

// The style options for the navigation Bar.
const options = {
		navigationOptions: {
				title: constants.applicationTitle,
		        headerStyle: {
								backgroundColor: constants.uiTheme.palette.primaryColor,
								height: constants.uiTheme.toolbar.container.height,
		        			 },
		        headerTitleStyle: {
		        					color: 'white',
		        					alignSelf: 'center',
		        				  },
    }
  };

// The object used to navigate in the App. Here we register all our screens.
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
			// Here the props set to null is to avoid logging navigation infos on screen transitions. 
			<Navigator onNavigationStateChange={null}/>
			);
	}
}

AppRegistry.registerComponent('CRM_Prospect', () => App);