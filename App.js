import { StackNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';

import { LoginScreen } from './app/components/LoginScreen/LoginScreen.js'
import { ProspectListScreen } from './app/components/ProspectListScreen/ProspectListScreen.js'
import { ProspectEditScreen } from './app/components/ProspectEditScreen/ProspectEditScreen.js'
//import * as constants from '../../config/const.js'

const Navigator = StackNavigator({
  Login: { screen: LoginScreen },
  List: { screen: ProspectListScreen },
  Edit: { screen: ProspectEditScreen },
});

AppRegistry.registerComponent('CRM_Prospect', () => Navigator);
