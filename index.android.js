import React, { Component } from 'react';
import { AppRegistry, View, Text, Button, TouchableHighlight, BackAndroid } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import { LoginScreen } from './app/components/LoginScreen/LoginScreen.js'
import { ProspectListScreen } from './app/components/ProspectListScreen/ProspectListScreen.js'
import { ProspectEditScreen } from './app/components/ProspectEditScreen/ProspectEditScreen.js'
import { HelloWorld } from './app/components/HelloWorld/HelloWorld.js'
import { styles } from './app/layout/styles.js'

import * as constants from './app/config/const.js'


var _navigator;

var mapper = {
              LeftButton: (route, navigator, index, navState) => {
                  if(route.id !== constants.loginScreen){
                      return (
                          <View style={styles.mainStyle}>
                              <TouchableHighlight disabled={navigator.__leftNavButtonDisabled} onPress={() => navigator.__onLeftNavButtonPressed()}>
                                  {navigator.__renderLeftNavButton()}
                              </TouchableHighlight>
                          </View>);
                  }
              },
              RightButton: (route, navigator, index, navState) => {
                  if(route.id !== constants.loginScreen){
                      return (
                          <View style={styles.mainStyle}>
                              <TouchableHighlight disabled={navigator.__rightNavButtonDisabled} onPress={() => navigator.__onRightNavButtonPressed()}>
                                  {navigator.__renderRightNavButton()}
                              </TouchableHighlight>
                          </View>);
                  }
              },
              Title: (route, navigator, index, navState) => {
                  switch(route.id){
                      case constants.loginScreen:
                          return (<View style={styles.mainStyle}><Text style={styles.fontNavBar}>ExelciaCRM Prospect Manager</Text></View>);
                      case constants.listScreen:
                          return (<View style={styles.mainStyle}><Text style={styles.fontNavBar}>Liste des prospects</Text></View>);
                      case constants.editScreen:
                          return (<View style={styles.mainStyle}><Text style={styles.fontNavBar}>Edition du prospect</Text></View>);
                  }
              },
};


class Main extends Component {
 
 constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
  }
  
  configureScene(route, routeStack){
   return Navigator.SceneConfigs.FloatFromRight;
  }

  render() {
    return ( 
        <Navigator 
          configureScene={ this.configureScene }
    			initialRoute={{id: constants.loginScreen}}
    			renderScene={ this.renderScene }
          navigationBar={
              <Navigator.NavigationBar 
                  routeMapper={ mapper }
                  style={styles.navigator}
              />
          }
        />
    );
  }

	renderScene(route, navigator) {
    _navigator = navigator;
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
		switch(route.id){
      case constants.loginScreen:
          return <LoginScreen navigator={navigator} />
      case constants.listScreen:
          return <ProspectListScreen navigator={navigator} ip={route.passProp.ip} session={route.passProp.sessionID} />
      case constants.editScreen:
        return <ProspectEditScreen navigator={navigator} ip={route.passProp.ip} session={route.passProp.sessionID} item={route.passProp.item} route={route}/>
    }
	}
}

AppRegistry.registerComponent('CRM_Prospect', () => Main);