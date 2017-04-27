import React, { Component } from 'react';
import { AppRegistry, View, Text, Navigator, Button, TouchableHighlight } from 'react-native';

import { LoginScreen } from './app/components/LoginScreen/LoginScreen.js'
import { ProspectListScreen } from './app/components/ProspectListScreen/ProspectListScreen.js'
import { ProspectEditScreen } from './app/components/ProspectEditScreen/ProspectEditScreen.js'
import { styles } from './app/layout/styles.js'


class Main extends Component {
 
 constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
  }
  render() {
    return ( 
      
      
        <Navigator 
          configureScene={ this.configureScene }
    			initialRoute={{name: "Login"}}
    			renderScene={ this.renderScene }
    		  
         
        />
    );
  }

  configureScene(route, routeStack){
   return Navigator.SceneConfigs.FloatFromRight;
  }

	renderScene(route, navigator) {
		if(route.name === 'Login') {
			return <LoginScreen navigator={navigator} />
		}
		else if(route.name === 'List') {
     		return <ProspectListScreen navigator={navigator} />
   	}
   	else if(route.name === 'Edit') {
     		return <ProspectEditScreen navigator={navigator} arg={route.arg} />
   	}
	}
}


AppRegistry.registerComponent('CRM_Prospect', () => Main);