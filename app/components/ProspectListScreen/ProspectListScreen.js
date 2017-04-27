import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight } from 'react-native';

import { styles, images } from './index.js'


var test = [{label: 'Title ok', key: 'item1'},
							  {label: 'Title Text2546456', key: 'item13'},
							  {label: 'Title Text3', key: 'item2'},
							  {label: 'Title Text4', key: 'item3'},
							  {label: 'Title Text5', key: 'item4'},
							  {label: 'Title Text6', key: 'item5'},
							  {label: 'Title Text7', key: 'item6'},
							  {label: 'Title Text8', key: 'item7'},
							  {label: 'Title Text9', key: 'item8'},
							  {label: 'Title Text5', key: 'item42'},
							  {label: 'Title Text6', key: 'item52'},
							  {label: 'Title Text7', key: 'item62'},
							  {label: 'Title Text8', key: 'item72'},
							  {label: 'Title Text9', key: 'item82'},
							  {label: 'Title Text5', key: 'item423'},
							  {label: 'Title Text6', key: 'item523'},
							  {label: 'Title Text7', key: 'item623'},
							  {label: 'Title Text8', key: 'item723'},
							  {label: 'Title Text9', key: 'item823'},
							  {label: 'Title Text5', key: 'item42333'},
							  {label: 'Title Text6', key: 'item525'},
							  {label: 'Title Text7', key: 'item625'},
							  {label: 'Title Text8', key: 'item725'},
							  {label: 'Title Text9', key: 'item825'},
							  {label: 'Title Text10', key: 'ite1'},
			];

	

export class ProspectListScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {status: ''};
    this.navigate = this.navigate.bind(this);
  }

  navigate(route, args){
    	this.props.navigator.push({
    		name: route,
      	arg: args,
    	}); 
  }

  goToEdit(){
    
  }
  
  render() {
    	return (
    		<View style={styles.container}>
    
    				{/*Header Part*/}
    				<View style={styles.headerWrapper}>
    					<Text>Prospect List:</Text>
    				</View>

    				{/*Body Part*/}
    				<View style={styles.bodyWrapper}>
    				    <ScrollView style={styles.scroll}>
							     <FlatList
							       data={test}
							       renderItem={ ({item}) => 
                        <TouchableHighlight onPress={() => this.goToEdit()}>
                            <Text>{item.label}</Text>
                        </TouchableHighlight>
                     }
							     />
          			</ScrollView>
    				</View>


	    			{/*Button Part*/}
    				<View style={styles.buttonWrapper}>
    					<Button
              				onPress={() => this.navigate("Edit", "Create")}
             				title="Create a new prospect"
              				color="green"
              				accessibilityLabel="Create a new contact"
            			/>
    				</View>

    		</View>
  		);
  }
}