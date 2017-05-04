import React, { Component } from 'react';
import { Text, ScrollView, View, Button, TextInput, Alert, Image, ActivityIndicator } from 'react-native';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../lib/rest_api.js'

var DEBUG = true;

export class ProspectEditScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {
        session: null,
        isPushing: false,
        saveSucceed: undefined,
        hasModifications: false,
        last_name: null,
        first_name: null,
        title: null,
        service: null,
        account_name: null,
        phone_number: null,
        mobile_phone_number: null,
        website: null,
        email: null,
        address: null,
        description: null,
        deleted: 0,
        };
  }

  pushToServer(onSuccessMessage, onFailureMessage) {
    
    if(DEBUG){
      this.debugState();
    }
    var itemID = null;
    if(this.props.item){
        itemID = this.props.item.name_value_list.id.value;
    }

    var nameValueList = [
                            // name:name only used to update the list screen with a proper value
                            {name:"name", value:''},
                            {name:"id", value: (itemID) ? itemID : ''},
                            {name:"last_name", value: this.state.last_name},
                            {name:"first_name", value: this.state.first_name},
                            {name:"title", value: this.state.title},
                            {name:"department", value: this.state.service},
                            {name:"account_name", value: this.state.account_name},
                            {name:"phone_work", value: this.state.phone_number},
                            {name:"phone_mobile", value: this.state.mobile_phone_number},
                            {name:"email1", value: this.state.email},
                            {name:"deleted", value: this.state.deleted},
                        ]
    var updatedData = {session: this.props.session,
                        module_name:"Leads",
                        name_value_list: nameValueList,
                      }

    var updatedDataJson = JSON.stringify(updatedData);                      
    
    this.setState({isPushing: true});
    var onSuccess = function(responseData){

        this.setState({isPushing: false});
        if(responseData.entry_list){
            this.setState({hasModifications: false});
            
            Alert.alert('Succès', onSuccessMessage,
                  [ 
                      {text: 'OK', onPress: () => {
                        this.props.route.passProp.callback(responseData.entry_list);
                        this.props.navigator.pop();
                      }},
                  ]
            )          
        } else {
            Alert.alert('Échec', onFailureMessage,
                  [ 
                      {text: 'OK', },
                  ]
            )
        }
    }

    var onFailure = function(error){
        this.setState({isPushing: false, error: true});
    }
  
    restCall("set_entry", updatedDataJson, this.props.ip, onSuccess.bind(this), onFailure.bind(this));
  
  }

  handleCancel(){

    var possibilities =  [
                {text: 'Non', },
                {text: 'Oui', onPress: () => this.props.navigator.pop()},
            ];

    if(this.state.hasModifications){
        Alert.alert('Abandonner', "Êtes vous sur de vouloir abandonner vos modifications ?", possibilities);
    } else {
        this.props.navigator.pop()
    }
  
  }

  handleSave(){
   
    this.state.deleted = 0;
    this.pushToServer("Le prospect à bien été enregistré dans votre CRM",
        "Le prospect n'a pas pu être enregistré dans votre CRM");
  }

  handleDelete(){

    this.state.deleted = 1;
    this.pushToServer("Le prospect à bien été supprimé de votre CRM",
        "Le prospect n'a pas pu être supprimé de votre CRM");
  }

  debugState(){
      console.log("Deleted: "+ this.state.deleted);
      console.log("Nom: "+ this.state.last_name);
      console.log("Prenom: "+ this.state.first_name);
      console.log("Fonction: "+ this.state.title);
      console.log("Service: "+ this.state.service);
      console.log("Nom de compte: "+ this.state.account_name);
      console.log("Telephone: "+ this.state.phone_number);
      console.log("Mobile: "+ this.state.mobile_phone_number);
      console.log("Site web: "+ this.state.website);
      console.log("email: "+ this.state.email);
      console.log("Adresse: "+ this.state.address);
      console.log("Description: "+ this.state.description);
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
          <Text style={defaultStyles.fontNavBar}>Back</Text>
      );
  }

  renderRightNavButton(){
      return (
          <Image source={images.saveIcon} style={styles.icon} />
      );
  }


  componentWillMount(){
      this.setNavActions();
      if(this.props.item){
          this.setState({
                last_name: this.props.item.name_value_list.last_name.value,
                first_name: this.props.item.name_value_list.first_name.value,
                title: this.props.item.name_value_list.title.value,
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

  updateData(key, value){
      key.value = value;
      this.setState({[key]: value, hasModifications: true});
  }

  render() {
    	return (
    		<View style={styles.container}>
    			
    					
    				<View style={styles.headerWrapper}>
                {/*Only display the prospect ID field if it exists*/}
                {this.props.item &&
    					       <Text>Prospect ID: {this.props.item.name_value_list.id.value} </Text>
    				    }
            </View>

    				<View style={styles.bodyWrapper}>
              {this.state.isPushing &&
              <ActivityIndicator style={styles.headerWrapper} size="large" /> ||

    					   <ScrollView style={styles.scroll}>
    						      <InputLabelRow label='Nom' value = {this.state.last_name} onChangeText = {(text) => this.updateData("last_name" ,text)} placeholder='enter data'/>
    						      <InputLabelRow label='Prénom' value = {this.state.first_name} onChangeText = {(text) => this.updateData("first_name", text)} placeholder='enter data'/>
    						      <InputLabelRow label='Fonction' value = {this.state.title} onChangeText = {(text) => this.updateData("title",text)} placeholder='enter data'/>
    						      <InputLabelRow label='Service' value = {this.state.service} onChangeText = {(text) => this.updateData("service", text)} placeholder='enter data'/>
    						      <InputLabelRow label='Nom de compte' value = {this.state.account_name} onChangeText = {(text) => this.updateData("account_name", text)} placeholder='enter data'/>
    					      	<InputLabelRow label='Téléphone' value = {this.state.phone_number} onChangeText = {(text) => this.updateData("phone_number", text)} placeholder='enter data'/>
    					     	  <InputLabelRow label='Mobile' value = {this.state.mobile_phone_number} onChangeText = {(text) => this.updateData("mobile_phone_number", text)} placeholder='enter data'/>
    						      <InputLabelRow label='Site web' value = {this.state.website} onChangeText = {(text) => this.updateData("website", text)} placeholder='enter data'/>
    						      <InputLabelRow label='E-mail' value = {this.state.email} onChangeText = {(text) => this.updateData("email", text)} placeholder='enter data'/>
    						      <InputLabelRow label='Adresse' value = {this.state.address} onChangeText = {(text) => this.updateData("address", text)} placeholder='enter data'/>
    						      <InputLabelRow label='Description' value = {this.state.description} onChangeText = {(text) => this.updateData("description", text)} placeholder='enter data'/>
    					   </ScrollView>
              }
    				</View>
    			
            {/*Only display the delete button when the screen is accessed from an existing prospect*/}
            {this.props.item &&

    				    <View style={styles.buttonWrapper}>
    						    <Button
              				  onPress={() => this.handleDelete()}
             					  title= "Delete"
              				  color="red"
              				  accessibilityLabel="Delete the current prospect"
                        disabled={this.state.isPushing}
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

				<Text style={defaultStyles.fontBasicMedium}>{this.props.label}:</Text>
				    <TextInput style={{flex: 1}} value = {this.props.value} onChangeText = {this.props.onChangeText} placeholder={this.props.placeholder} />
    		</View>

    	);
   	}
  });