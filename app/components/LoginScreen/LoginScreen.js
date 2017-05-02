import React, { Component } from 'react';
import { Text, TextInput, Image, View, Button, ActivityIndicator } from 'react-native';

import { styles, images } from './index.js'
import * as constants from '../../config/const.js'

var DEBUG = false;
var MD5 = require("crypto-js/md5");
const HEADERS = 'method=login&input_type=JSON&response_type=JSON&rest_data=';

export class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {status: '', session: null, isFetching: false};
    this.navigate = this.navigate.bind(this);
  }


  navigate(route){
    this.props.navigator.push({
      id: route,
      passProp: {
      sessionID: this.state.session,
      },
    })
  }

  connect(){
    this.authentify('admin', MD5('admin'));
  }


    /*    création/update si name= id.
    {"session": "28cs3kenqt4ifec6ghd6a0buj7", "module_name":"Prospects","name_value_list":{"name":"test","name":"ok","assigned_user_name":"toto"}}
    
    pr delete il suffit de mettre le flag delete a true

    module-> prospects, method: get_entry_list
    **/
  authentify(login, password){

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

    fetch('http://10.32.15.51/SuiteCRM/service/v3_1/rest.php', dataToSend)  
    .then((response) => response.json())
    .then((responseData) => {
      if(DEBUG){
        console.log("(LoginScreen)");
        console.log(responseData);
      }
      this.setState({isFetching: false, session: responseData.id});
      if(DEBUG){
        console.log("(LoginScreen) fetched session id = " + this.state.session);
      }
    })
    .done();
  }

  update(){
    
    // Wrong credential.
    if(this.state.session === undefined && this.state.status === ""){
       this.setState({status: 'Cannot connect to the given server', session: null});
    }
    // Successful connection.
    else if(this.state.session){
        this.navigate(constants.listScreen); 
    }
  }

  

  render() {

    this.update();

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
                  keyboardType = "numeric"
                  placeholder="IP server" 
                  placeholderTextColor="#CCC"
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
                  placeholder="Password" 
                  placeholderTextColor="#CCC"
                  style={styles.input} 
                />
            </View>
        </View>
        <View style={styles.statusWrapper}>
          
          
          {this.state.isFetching &&
           <ActivityIndicator style={[styles.statusWrapper, {height: 80}]} size="large" /> ||
           <Text style={styles.fontError}> { this.state.status } </Text>
          }

        </View>
        <View style={styles.buttonWrapper}>
            <Button
              onPress={() => this.connect()}
              title="Connect"
              color="#1F94B7"
              accessibilityLabel="Connect to the CRM server"
            />
        </View>
    </View>
    );
  }
}