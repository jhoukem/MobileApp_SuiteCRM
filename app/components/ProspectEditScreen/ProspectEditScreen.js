import React, { Component } from 'react';
import { Text, ScrollView, View, Button, TextInput, Alert } from 'react-native';

import { styles, images } from './index.js'

export class ProspectEditScreen extends Component {

  constructor(props) {
    super(props);
    this.state= { prospectName: 'Jean' };
  }
  
  handleCancel(){
	Alert.alert('Abandonner', "Êtes vous sur de vouloir abandonner vos modifications ?",
        [
        	{text: 'Non', },
            {text: 'Oui', onPress: () => this.props.navigator.pop()},
        ]
    )
  }

  handleSave(){
  	var success = true;

  	if(success){
		Alert.alert('Succès', "Le prospect à bien été enregistré dans votre CRM",
    	[ 
    		{text: 'OK', onPress: () => this.props.navigator.pop()},
    	]
    )
  	} else {
  		Alert.alert('Erreur', "Le prospect n'a pas pu être enregistré dans votre CRM",
    	[ 
    		{text: 'OK', },
    	]
    )
  	}

	
  }

  render() {
    	return (
    		<View style={styles.container}>
    			
    					
    				<View style={styles.headerWrapper}>
    					<Text>Prospect name: {this.state.prospectName} </Text>
    				</View>

    				<View style={styles.bodyWrapper}>
    					<ScrollView style={styles.scroll}>
    						<InputLabelRow label='Nom' placeholder='enter data'/>
    						<InputLabelRow label='Prénom' placeholder='enter data'/>
    						<InputLabelRow label='Fonction' placeholder='enter data'/>
    						<InputLabelRow label='Service' placeholder='enter data'/>
    						<InputLabelRow label='Nom de compte' placeholder='enter data'/>
    						<InputLabelRow label='Téléphone' placeholder='enter data'/>
    						<InputLabelRow label='Mobile' placeholder='enter data'/>
    						<InputLabelRow label='Site web' placeholder='enter data'/>
    						<InputLabelRow label='E-mail' placeholder='enter data'/>
    						<InputLabelRow label='Adresse' placeholder='enter data'/>
    						<InputLabelRow label='Description' placeholder='enter data'/>
    					</ScrollView>
    				</View>
    			
    				<View style={styles.buttonWrapper}>

    					{/*Only display the delete button when the screen is accessed from an existing prospect*/}
    					{this.props.arg != "Create" &&

    						<Button
              					/*onPress={onConnect}*/
             					title= "Delete"
              					color="red"
              					accessibilityLabel="Create a new contact"
            				/>
            			}

    					<Button
              				onPress={() => this.handleCancel()}
             				title="Cancel"
              				color="orange"
              				accessibilityLabel="Modify the selected contact"
            			/>
            			<Button
              				onPress={() => this.handleSave()}
              				title="Save"
              				color="green"
              				accessibilityLabel="Delete the selected contact"
            			/>
    				</View>
    			
    		</View>
    		);
  }

}

var InputLabelRow = React.createClass({

   	render() {
    	return (

    		<View style={{
    			flex: 1,
    			flexDirection: 'row',
    			//justifyContent: 'space-around',
				alignItems: 'center',
			}}>

				<Text style={styles.label}>{this.props.label}:</Text>
				<TextInput style={styles.input} placeholder={this.props.placeholder} />
    		</View>

    	);
   	}
  });