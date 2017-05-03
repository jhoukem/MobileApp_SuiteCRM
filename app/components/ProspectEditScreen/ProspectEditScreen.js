import React, { Component } from 'react';
import { Text, ScrollView, View, Button, TextInput, Alert, Image } from 'react-native';

import { styles, images } from './index.js'


var DEBUG = true;
const HEADERS = 'method=set_entry&input_type=JSON&response_type=JSON&rest_data=';

export class ProspectEditScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {
        session: null,
        isPushing: false,
        last_name: null,
        first_name: null,
        function: null,
        service: null,
        account_name: null,
        phone_number: null,
        mobile_phone_number: null,
        website: null,
        email: null,
        address: null,
        description: null,
        };
  }
  
  handleCancel(){
	Alert.alert('Abandonner', "Êtes vous sur de vouloir abandonner vos modifications ?",
        [
        	{text: 'Non', },
          {text: 'Oui', onPress: () => this.props.navigator.pop()},
        ]
    )
  }



  pushToServer() {
    var updatedData = {session:"l1qdp6d49lasu3a6sd1n8ahsa5",
                        module_name:"Leads",
                        name_value_list:[
                                            {name:"id", value: this.props.item.name_value_list.id.value},
                                            {name:"last_name", value: this.state.last_name},
                                            {name:"first_name", value: this.state.first_name}
                                        ]
                      }

    var updatedDataJson = JSON.stringify(updatedData);                      
    var dataToSend = {  
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: HEADERS.concat(updatedDataJson),
    }

    this.setState({isPushing: true});

    fetch('http://'+ this.props.ip +'/SuiteCRM/service/v3_1/rest.php', dataToSend)  
    .then((response) => response.json())
    .then((responseData) => {
     
      this.setState({isPushing: false});
      if(responseData.entry_list){
        this.setState({success: true});
      }
      if(DEBUG){
        console.log("(EditScreen)");
        console.log(responseData);
      }
    })
    .done();
  }

  handleSave(){
  	var success = true;

    if(DEBUG){
      console.log("Nom: "+ this.state.last_name);
      console.log("Prenom: "+ this.state.first_name);
      console.log("Fonction: "+ this.state.fonction);
      console.log("Service: "+ this.state.service);
      console.log("Nom de compte: "+ this.state.account_name);
      console.log("Telephone: "+ this.state.phone_number);
      console.log("Mobile: "+ this.state.mobile_phone_number);
      console.log("Site web: "+ this.state.website);
      console.log("email: "+ this.state.email);
      console.log("Adresse: "+ this.state.address);
      console.log("Description: "+ this.state.description);
    }


    this.pushToServer();


    /*

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

    */
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

    navigator.__renderLeftNavButton = this.renderLeftNavButton.bind(this);
    navigator.__renderRightNavButton = this.renderRightNavButton.bind(this);

    navigator.__onLeftNavButtonPressed = this.handleCancel.bind(this);
    navigator.__onRightNavButtonPressed = this.handleSave.bind(this);
  }

  renderLeftNavButton(){
      return (      
                <Text style={styles.fontBasic2}>Back</Text>
      );
  }

  renderRightNavButton(){
      return (
         <Image source={require('../../images/icon_save.png')} style={styles.icon} />
               
      );
  }


  componentWillMount(){

      if(this.props.item){
          this.setState({
                last_name: this.props.item.name_value_list.last_name.value,
                first_name: this.props.item.name_value_list.first_name.value,
                fonction: this.props.item.name_value_list.title.value,
                service: this.props.item.name_value_list.department.value,
                account_name: this.props.item.name_value_list.account_name.value,
                phone_number: this.props.item.name_value_list.phone_work.value,
                mobile_phone_number: this.props.item.name_value_list.phone_mobile.value,
                //website: this.props.item.name_value_list.surname.value,
                email: this.props.item.name_value_list.email1.value,
                //address: this.props.item.name_value_list.surname.value,
                description: this.props.item.name_value_list.description.value,
          });
      }
  }

  update(){
      this.setNavActions();
  }


  render() {
    this.update();

    	return (
    		<View style={styles.container}>
    			
    					
    				<View style={styles.headerWrapper}>
                {/*Only display the prospect ID field if it exists*/}
                {this.props.item &&
    					       <Text>Prospect ID: {this.props.item.name_value_list.id.value} </Text>
    				    }
            </View>

    				<View style={styles.bodyWrapper}>
    					<ScrollView style={styles.scroll}>
    						<InputLabelRow label='Nom' value = {this.state.last_name} onChangeText = {(text) => this.setState({last_name: text})} placeholder='enter data'/>
    						<InputLabelRow label='Prénom' value = {this.state.first_name} onChangeText = {(text) => this.setState({first_name: text})} placeholder='enter data'/>
    						<InputLabelRow label='Fonction' value = {this.state.fonction} onChangeText = {(text) => this.setState({fonction: text})} placeholder='enter data'/>
    						<InputLabelRow label='Service' value = {this.state.service} onChangeText = {(text) => this.setState({service: text})} placeholder='enter data'/>
    						<InputLabelRow label='Nom de compte' value = {this.state.account_name} onChangeText = {(text) => this.setState({account_name: text})} placeholder='enter data'/>
    						<InputLabelRow label='Téléphone' value = {this.state.phone_number} onChangeText = {(text) => this.setState({phone_number: text})} placeholder='enter data'/>
    						<InputLabelRow label='Mobile' value = {this.state.mobile_phone_number} onChangeText = {(text) => this.setState({mobile_phone_number: text})} placeholder='enter data'/>
    						<InputLabelRow label='Site web' value = {this.state.website} onChangeText = {(text) => this.setState({website: text})} placeholder='enter data'/>
    						<InputLabelRow label='E-mail' value = {this.state.email} onChangeText = {(text) => this.setState({email: text})} placeholder='enter data'/>
    						<InputLabelRow label='Adresse' value = {this.state.address} onChangeText = {(text) => this.setState({address: text})} placeholder='enter data'/>
    						<InputLabelRow label='Description' value = {this.state.description} onChangeText = {(text) => this.setState({description: text})} placeholder='enter data'/>
    					</ScrollView>
    				</View>
    			
            {/*Only display the delete button when the screen is accessed from an existing prospect*/}
            {this.props.item &&

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
				    <TextInput style={styles.input} value = {this.props.value} onChangeText = {this.props.onChangeText} placeholder={this.props.placeholder} />
    		</View>

    	);
   	}
  });