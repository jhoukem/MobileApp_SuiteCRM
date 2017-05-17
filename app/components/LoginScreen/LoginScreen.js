import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { Text, TextInput, Image, View, ScrollView, Button, ActivityIndicator, AsyncStorage } from 'react-native';
import { default as Icon  } from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeProvider, Checkbox } from 'react-native-material-ui';
import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../lib/rest_api.js'


var DEBUG = false;
var MD5 = require("crypto-js/md5");

const uiTheme = {
    palette: {
        primaryColor: '#1F94B7',
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
  };

export class LoginScreen extends Component {

  static navigationOptions = {
    title: 'ExelciaCRM Prospect Manager',
  };

  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);

    this.state={
        status: '',
        session: null,
        isFetching: false,
        ip: null,
        login: null,
        password: null,
        isChecked: false,
        };
  }

  navigate(route){

    var params = {
          session: this.state.session,
          ip: this.state.ip,
    };

    this.props.navigation.navigate(route, params);
  }

  connect(){

    this.storeInfo();
    this.authentify(this.state.ip, this.state.login, MD5(this.state.password));
    
    if(DEBUG){
      console.log("(LoginScreen) parameters: ");
      console.log("ip = " + this.state.ip);
      console.log("login = " + this.state.login);
      console.log("passwd = " + this.state.password);
      console.log("(LoginScreen) credential (MD5): ");
      console.log(MD5(this.state.password));
    }
  }

  authentify(ip, login, password){

    //var credential = {"user_auth":{"user_name":login,"password":password}};
    var credential2 = '{"user_auth":{"user_name":"'+ login +'","password":"'+ password +'"}}';

    
    this.setState({isFetching: true});
    
    var onSuccess = function(responseData){

      this.setState({isFetching: false, session: responseData.id});
      // Got a session.
      if(this.state.session){
        fc = this.navigate.bind(this);
        fc(constants.listScreen); 
      } 
      // Wrong credential.
      else {
        this.setState({status: 'Bad credential', session: null});
      }
    }

    var onFailure = function(error){
        this.setState({isFetching: false, status: "Server injoignable", session: null});
    }

    restCall("login", credential2, this.state.ip, onSuccess.bind(this), onFailure.bind(this));
  }

  onCheckboxCheck(checked, value){
    this.setState({isChecked: checked})
    this.storeInfo(checked);
  }

  async storeInfo(isSaving=true){
    try {

      if(isSaving){
         await AsyncStorage.setItem('ip', this.state.ip);
         await AsyncStorage.setItem('login', this.state.login);
      } else {
         await AsyncStorage.removeItem('ip');
         await AsyncStorage.removeItem('login');        
      }
    } catch (error) {
        console.log("AsyncStorage error: "+ error);
    }
  }

  async getInfo(key){
    try {
        var value = await AsyncStorage.getItem(key);  
        return value;
    } catch (error) {
        console.log("AsyncStorage error: "+ error);
        return null;
    }
  }

  async componentWillMount(){
      var ip = await this.getInfo("ip");
      var login = await this.getInfo("login");
      this.setState({ip: ip ? ip : '', login: login ? login : '', isChecked: (ip || login) ? true : false});
  }

  render() {
    return (
        <ThemeProvider uiTheme={uiTheme}>
            <View style={styles.container}>

                <View style={styles.logoWrapper}>
                    <Image source={images.logoExelcia} style={styles.logo} resizeMode="contain" />
                </View>

                <View style={styles.inputWrapper}>
                <ScrollView>
                    {/* Server field*/}
                    <InputLabelRow icon='server-network' value={this.state.ip} placeholder="IP du serveur" isSecure={false}
                    onChangeText={(text) => this.setState({ip: text})} keyboardType='numeric'/>
                    {/* Login field*/}
                    <InputLabelRow icon='account-outline' value={this.state.login} placeholder="Nom d'utilisateur" isSecure={false}
                    onChangeText={(text) => this.setState({login: text})} />
                    {/* Password field*/}
                    <InputLabelRow icon='lock-outline' value={this.state.password} placeholder="Mot de passe" isSecure={true}
                    onChangeText={(text) => this.setState({password: text})} onSubmitEditing={() =>this.connect()}/>
                    <Checkbox  style={{height:40}}value="ok" checked={this.state.isChecked} onCheck={this.onCheckboxCheck.bind(this)} label="Retenir le login et l'adresse du serveur" />
                </ScrollView>
                </View>
                <View style={styles.statusWrapper}>
                    {this.state.isFetching &&
                        <ActivityIndicator style={styles.statusWrapper} size="large" /> ||
                        <Text style={defaultStyles.fontBasicError}> { this.state.status } </Text>
                    }
                </View>
                <View style={styles.buttonWrapper}>
                    <Button
                      onPress={() => this.connect()}
                      title="Connexion"
                      color="#1F94B7"
                      disabled={this.state.isFetching}
                      accessibilityLabel="Connect to the CRM server"
                    />
                </View>
            </View>
        </ThemeProvider>
    );
  }
}

var InputLabelRow = React.createClass({
    render() {
      return (
        <View style={styles.inputLineWrap}>
            <View style={styles.iconWrap}>
                  <Icon name={this.props.icon} size={30}/>
            </View>
                <TextInput 
                    keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
                    secureTextEntry={this.props.isSecure}
                    onChangeText={this.props.onChangeText}
                    onSubmitEditing={this.props.onSubmitEditing}
                    value={this.props.value}
                    placeholder={this.props.placeholder} 
                    placeholderTextColor="#CCC"
                    style={styles.input} 
                />
        </View>
      );
    }
  });