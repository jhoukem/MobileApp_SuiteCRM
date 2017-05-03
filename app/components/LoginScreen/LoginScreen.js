import React, { Component } from 'react';
import { Text, TextInput, Image, View, Button, ActivityIndicator } from 'react-native';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'



var DEBUG = true;
var MD5 = require("crypto-js/md5");
const HEADERS = 'method=login&input_type=JSON&response_type=JSON&rest_data=';

export class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);

    this.state={
        status: '',
        session: null,
        isFetching: false,
        ip: "10.32.15.51",
        login: "admin",
        password: "admin",
        };
  }

  navigate(route){
    this.props.navigator.push({
      id: route,
      passProp: {
          sessionID: this.state.session,
          ip: this.state.ip,
      },
    })
  }

  connect(){

    this.authentify(this.state.ip, this.state.login, MD5(this.state.password));
    
    if(DEBUG){
      console.log("ip = " + this.state.ip);
      console.log("login = " + this.state.login);
      console.log("passwd = " + this.state.password);
    }
  }

  authentify(ip, login, password){

    var credential = '{"user_auth":{"user_name":"'+ login +'","password":"'+ password +'"}}';

    var dataToSend = {  
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: HEADERS.concat(credential),
    }

    this.setState({isFetching: true});

    fetch('http://'+ ip +'/SuiteCRM/service/v3_1/rest.php', dataToSend)  
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Got a server response");
      if(DEBUG){
        console.log("(LoginScreen)");
        console.log(responseData);
      }
     
      this.setState({isFetching: false, session: responseData.id});
      // Got a session.
      if(this.state.session){
        this.navigate(constants.listScreen); 
      } 
      // Wrong credential.
      else {
        this.setState({status: 'Bad credential', session: null});
      }

    })
    .catch((error) => {
        console.log("Got a network error");
        this.setState({isFetching: false, status: "Server unreachable", session: null});
        if(DEBUG){
            console.log(error);
        }
    });
  }

  render() {

    return (
    <View style={styles.container}>

        <View style={styles.logoWrapper}>
            <Image source={images.logoExelcia} style={styles.logo} resizeMode="contain" />
        </View>

     
        <View style={styles.inputWrapper}>
            
            {/* Server field*/}
            <View style={styles.inputLineWrap}>
                <View style={styles.iconWrap}>
                    <Image source={images.serverIcon} style={styles.icon} resizeMode="contain" />
                </View>
                <TextInput 
                  maxLength = {15}
                  onChangeText = { (text) => this.setState({ip: text})}
                  value = {this.state.ip }
                  keyboardType = "numeric"
                  placeholder = "IP server" 
                  placeholderTextColor = "#CCC"
                  style={styles.input} 
                />
            </View>

            {/* Login field*/}
            <View style={styles.inputLineWrap}>
                <View style={styles.iconWrap}>
                    <Image source={images.personIcon} style={styles.icon} resizeMode="contain" />
                </View>
                <TextInput 
                  maxLength = {20}
                  onChangeText = { (text) => this.setState({login: text})}
                  value = {this.state.login}
                  placeholder="Username" 
                  placeholderTextColor="#CCC"
                  style={styles.input} 
                />
            </View>
            
            {/* Password field*/}
            <View style={styles.inputLineWrap}>
                <View style={styles.iconWrap}>
                    <Image source={images.lockIcon} style={styles.icon} resizeMode="contain" />
                </View>
                <TextInput 
                  secureTextEntry={true}
                  onChangeText = { (text) => this.setState({password: text})}
                  value = {this.state.password}
                  placeholder="Password" 
                  placeholderTextColor="#CCC"
                  style={styles.input} 
                />
            </View>
        </View>
        <View style={styles.statusWrapper}>
          
          
          {this.state.isFetching &&
           <ActivityIndicator style={[styles.statusWrapper, {height: 80}]} size="large" /> ||
           <Text style={defaultStyles.fontBasicError}> { this.state.status } </Text>
          }

        </View>
        <View style={styles.buttonWrapper}>
            <Button
              onPress={() => this.connect()}
              title="Connection"
              color="#1F94B7"
              accessibilityLabel="Connect to the CRM server"
            />
        </View>
    </View>
    );
  }
}