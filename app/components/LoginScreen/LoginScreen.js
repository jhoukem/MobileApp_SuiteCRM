import React, { Component } from 'react';
import { Text, TextInput, Image, View, Button } from 'react-native';

import { styles, images } from './index.js'
import * as constants from '../../config/const.js'


export class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {status: ''};
    this.navigate = this.navigate.bind(this);
  }


  authentify(login, password){


    var credentials = {
          user_auth:{
              user_name: login,
              password: password,
          },
          application: "RestTest",
    };




    var param = {  
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              'method': 'login',
              'input_type': 'JSON',
              'response_type': 'JSON',
              'rest_data': credentials,
        })
      }

    console.log("Param to send :");
    console.log(param);

    /**
    GET functionnal call
    http://localhost/SuiteCRM/service/v3_1/rest.php?method=login&input_type=JSON&response_type=JSON&rest_data={%22user_auth%22:{%22user_name%22:%22admin%22,%22password%22:%2221232f297a57a5a743894a0e4a801fc3%22},%22application_name%22:%22test%22}
    **/

    fetch('http://10.32.15.51/SuiteCRM/service/v2/rest.php', param)  
    .then(function(res) {
        console.log("Retour :");
        console.log(res);
    })
  
    console.log('end');
  }

  connect(){
    var success = false;

    success = this.authentify('admin', '21232f297a57a5a743894a0e4a801fc3');

    if(success){
      this.navigate(constants.listScreen);
    } else {
      this.setState({status: 'Cannot connect to the given server'});
    }
  }

  navigate(route){
    this.props.navigator.push({
      id: route,
    })
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
          <Text style={styles.fontError}> { this.state.status } </Text>
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