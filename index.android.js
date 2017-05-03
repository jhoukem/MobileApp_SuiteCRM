import React, { Component } from 'react';
import { AppRegistry, View, Text, Navigator, Button, TouchableHighlight, BackAndroid } from 'react-native';

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
                              <TouchableHighlight onPress={() => navigator.__onLeftNavButtonPressed()}>
                                  {navigator.__renderLeftNavButton()}
                              </TouchableHighlight>
                          </View>);
                  }
              },
              RightButton: (route, navigator, index, navState) => {
                  if(route.id !== constants.loginScreen){
                      return (
                          <View style={styles.mainStyle}>
                              <TouchableHighlight onPress={() => navigator.__onRightNavButtonPressed()}>
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
                          return (<View style={styles.mainStyle}><Text style={styles.fontNavBar}>Prospects list</Text></View>);
                      case constants.editScreen:
                          return (<View style={styles.mainStyle}><Text style={styles.fontNavBar}>Prospect edition</Text></View>);
                  }
              },
};


class Main extends Component {
 
 constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.handleAndroidBackButton();
  }

  handleAndroidBackButton(){
      BackAndroid.addEventListener('hardwareBackPress', () => {
          if (_navigator.getCurrentRoutes().length === 1 ) {
              return false;
          } else {
              _navigator.pop();
              return true;
          }
      });
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
    console.log(route.id);
		switch(route.id){
      case constants.loginScreen:
          return <LoginScreen navigator={navigator} />
      case constants.listScreen:
          return <ProspectListScreen navigator={navigator} ip={route.passProp.ip} session={route.passProp.sessionID} />
      case constants.editScreen:
        return <ProspectEditScreen navigator={navigator} ip={route.passProp.ip} session={route.passProp.sessionID} item={route.passProp.item} />
    }
	}
}

AppRegistry.registerComponent('CRM_Prospect', () => Main);