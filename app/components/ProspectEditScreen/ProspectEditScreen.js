import React, { Component } from 'react';
import { Text, ScrollView, View, Button, TextInput, Alert } from 'react-native';

import { styles, images } from './index.js'

export class ProspectEditScreen extends Component {

  constructor(props) {
    super(props);
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

  handleDelete(){
    var success = true;

    if(success){
        Alert.alert('Succès', "Le prospect à bien été supprimé de votre CRM",
         [ 
            {text: 'OK', onPress: () => this.props.navigator.pop()},
         ]
        )
    } else {
        Alert.alert('Erreur', "Le prospect n'a pas pu être supprimé de votre CRM",
         [ 
            {text: 'OK', },
         ]
        )
    }
  }

  setNavActions(){
    var navigator = this.props.navigator;
    navigator.__onLeftNavButtonPressed = this.handleCancel.bind(this);
    navigator.__onRightNavButtonPressed = this.handleSave.bind(this);
  }

  render() {
    this.setNavActions();

    	return (
    		<View style={styles.container}>
    			
    					
    				<View style={styles.headerWrapper}>
                {/*Only display the prospect ID field if it exists*/}
                {this.props.itemID !== undefined &&
    					       <Text>Prospect ID: {this.props.itemID} </Text>
    				    }
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
    			
            {/*Only display the delete button when the screen is accessed from an existing prospect*/}
            {this.props.isEdition &&

    				    <View style={styles.buttonWrapper}>
    						    <Button
              				  onPress={() => this.handleDelete()}
             					  title= "Delete"
              				  color="red"
              				  accessibilityLabel="Delete a the prospect"
            		    />
    				    </View>
    			  }
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