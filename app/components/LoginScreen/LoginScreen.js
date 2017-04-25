import React, { Component } from 'react';
import { Text, TextInput, Image, View, Button } from 'react-native';

import { styles, images } from './index.js'

export class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {status: 'Wrong credential and a super long text that should end wrapping around that park in california'};
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
              /*onPress={onConnect}*/
              title="Connect"
              color="#1F94B7"
              accessibilityLabel="Connect to the CRM server"
            />
        </View>
    </View>
    );
  }
}