import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight } from 'react-native';

import { styles, images } from './index.js'
import * as constants from '../../config/const.js'

var test = [
                {label: 'Title ok', key: 'item1'},
							  {label: 'Jean Luc', key: 'item27'},
							  {label: 'Anakin', key: 'item2'},
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
							  {label: 'Title Text5', key: 'item427'},
							  {label: 'Title Text6', key: 'item525'},
							  {label: 'Title Text7', key: 'item625'},
							  {label: 'Title Text8', key: 'item725'},
							  {label: 'Title Text9', key: 'item825'},
							  {label: 'Title Text10', key: 'item86'},
			];

	

export class ProspectListScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {status: ''};
    this.navigate = this.navigate.bind(this);
  }

  /*isEdition is used to know if the delete button should be present on the entry.*/
  navigate(route, isEdition, itemID=undefined){
    	this.props.navigator.push({
    		  id: route,
          passProp: {
              isEdition: isEdition,
              itemID: itemID,
          },
    	}); 
  }

  logout(){
    this.props.navigator.pop();
  }

  goToEdit(itemID){
    this.navigate(constants.editScreen, true, itemID);
  }
  
  setNavActions(){
    var navigator = this.props.navigator;
    navigator.__onLeftNavButtonPressed = this.logout.bind(this);
    navigator.__onRightNavButtonPressed = undefined;
  }
  render() {
    this.setNavActions();

    	return (
    		<View style={styles.container}>
    
    				{/*Header Part*/}
    				<View style={styles.headerWrapper}>
    					<Text style={styles.fontBasic}>Select a prospect to start editing him</Text>
    				</View>

            

    				{/*Body Part*/}
    				<View style={styles.bodyWrapper}>
    				    <ScrollView style={styles.scroll}>
							     <FlatList
							       data={test}
							       renderItem={ ({item}) => 
                        <TouchableHighlight onPress={() => this.goToEdit(item.key)}>
                            <Text style={styles.fontProspect}>{item.label}</Text>
                        </TouchableHighlight>
                     }
							     />
          			</ScrollView>
    				</View>


	    			{/*Button Part*/}
    				<View style={styles.buttonWrapper}>
    				    <Button
              			onPress={() => this.navigate(constants.editScreen, false)}
             				title="Create a new prospect"
              			color="#1F94B7"
              			accessibilityLabel="Create a new contact"
            	  />
    				</View>

    		</View>
  		);
  }
}