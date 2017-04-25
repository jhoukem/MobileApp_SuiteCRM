import React, { Component } from 'react';
import { Text, TextInput, Image, View } from 'react-native';

import { styles, images } from './index.js'

export class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {status: ''};
  }

  render() {
    return (
    <View style={styles.container}>

        <View style={styles.logoWrap}>
            <Image source={images.logoExelcia} style={styles.logo} resizeMode="contain" />
        </View>

     
        <View style={styles.wrapper}>
            <View style={styles.inputWrap}>
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

            <View style={styles.inputWrap}>
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



    {/*
            

        
        
      */}

        
        <View style={styles.allCentered}>
          <Text style={styles.fontBasic}> { this.state.status } </Text>
 	      </View>
    </View>
    );
  }
}