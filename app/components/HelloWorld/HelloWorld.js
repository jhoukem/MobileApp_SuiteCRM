import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';

import { styles, images } from './index.js'

export class HelloWorld extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <View>
    	<Text style={styles.bigblue}> Hello World {this.props.name} ! </Text>
    	<Image source={images.helloWorld} />
 	  </View>
    );
  }
}