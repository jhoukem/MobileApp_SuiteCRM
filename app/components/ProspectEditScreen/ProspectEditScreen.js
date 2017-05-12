import React, { Component } from 'react';
import { Text, ScrollView, View, Button, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { Toolbar, ThemeProvider, Icon, IconToggle } from 'react-native-material-ui';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../lib/rest_api.js'

var DEBUG = false;

const uiTheme = {
    palette: {
        primaryColor: '#1F94B7',
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
  };


export class ProspectEditScreen extends Component {

  static navigationOptions = {
        header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
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
        email1: null,
        primary_address_street: null,
        primary_address_city: null,
        primary_address_postalcode: null,
        primary_address_country: null,
        description: null,
        deleted: 0,
        };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  pushToServer(onSuccessMessage, onFailureMessage) {
    
    if(DEBUG){
      this.debugState();
    }
    var ip = this.props.navigation.state.params.ip;
    var session = this.props.navigation.state.params.session;

    var itemID = null;
    var updateListScreenFlatList = this.props.navigation.state.params.callback;

    if(this.props.navigation.state.params.item){
        itemID = this.props.navigation.state.params.item.name_value_list.id.value;
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
                            {name:"website", value: this.state.website},
                            {name:"primary_address_street", value: this.state.primary_address_street},
                            {name:"primary_address_city", value: this.state.primary_address_city},
                            {name:"primary_address_postalcode", value: this.state.primary_address_postalcode},
                            {name:"primary_address_country", value: this.state.primary_address_country},
                            {name:"description", value: this.state.description},
                            {name:"email1", value: this.state.email1},
                            {name:"deleted", value: this.state.deleted},
                        ]
    var updatedData = {session: session,
                        module_name:"Leads",
                        name_value_list: nameValueList,
                      }

    var updatedDataJson = JSON.stringify(updatedData);                      
    
    this.setState({isPushing: true});

    var onSuccess = function(responseData){
        this.setState({isPushing: false});
        if(responseData.entry_list){

            console.log("(EditScreen received item) :");
            console.log(responseData.entry_list);
            this.setState({hasModifications: false});
            
            Alert.alert('Succès', onSuccessMessage,
                  [ 
                      {text: 'OK', onPress: () => {
                        updateListScreenFlatList(responseData.entry_list);
                        this.props.navigation.goBack();
                      }},
                  ],
                  {cancelable: false},
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
  
    restCall("set_entry", updatedDataJson, ip, onSuccess.bind(this), onFailure.bind(this));
  
  }

  handleCancel(){

    var possibilities =  [
                {text: 'Non', },
                {text: 'Oui', onPress: () => this.props.navigation.goBack()},
            ];

    if(this.state.hasModifications){
        Alert.alert('Abandonner', "Êtes vous sur de vouloir abandonner vos modifications ?", possibilities);
    } else {
        this.props.navigation.goBack();
    }
  
  }

  handleSave(){
   
   if(!this.state.isPushing){
      this.state.deleted = 0;

      // Check if the input field values are corrects.
      if(this.checkInputFields()){
          this.pushToServer("Le prospect à bien été enregistré dans votre CRM",
          "Le prospect n'a pas pu être enregistré dans votre CRM");
      } 
    }
  }

  handleDelete(){

  var deleteProspect = function(){
      if(!this.state.isPushing){
          this.state.deleted = 1;
          this.pushToServer("Le prospect à bien été supprimé de votre CRM",
            "Le prospect n'a pas pu être supprimé de votre CRM");
      }
  }

  Alert.alert('Attention', "Êtes vous sûr de vouloir supprimer ce prospect ?",
                  [ 
                      {text: 'Non', },
                      {text: 'Oui', onPress: deleteProspect.bind(this)},
                  ]
            )
  }

  debugState(){
      console.log("this.state=");
      console.log(this.state);
  }

  checkInputFields(){
    // Better regex but not needed here. 
    //  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Basic regex for email checking.
    var reg = /^[\w.-]+@[\w-]+\.[a-zA-Z]{2,4}$/;

    if(this.state.email1 && !reg.test(this.state.email1)){
       Alert.alert('Erreur', 'Format de l\'email incorrect',
                  [ 
                      {text: 'OK'},
                  ]
        )
        return false;
    }
    return true;
  }

  componentWillMount(){
      var item = this.props.navigation.state.params.item;

      if(item){
        item = item.name_value_list;
          for(key in item){
              if(item[key].value){
                  if(DEBUG){
                      console.log("Key retireved: "+ key + "   value =  "+ item[key].value);
                  }
                  this.setState({[key]: item[key].value});
              }
          }
      }
  }

  updateData(key, value){
      key.value = value;
      this.setState({[key]: value, hasModifications: true});
  }

  render() {
    	return (
        <ThemeProvider uiTheme={uiTheme}>
        		<View style={styles.container}>
        					
                <Toolbar
                    ref={toolbarComponent => this.toolbar = toolbarComponent}
                    key="toolbar"
                    leftElement={<IconToggle name="navigate-before" color="white" onPress={this.handleCancel} disabled={this.state.isPushing}/>}
                    rightElement={<IconToggle name="save" color="white" onPress={this.handleSave} disabled={this.state.isPushing}/>}
                    centerElement="Edition du prospect"
                />

        				<View style={styles.headerWrapper}>
                    {/*Only display the prospect ID field if it exists*/}
                    {this.props.navigation.state.params.item &&
        					       <Text>Prospect ID: {this.props.navigation.state.params.item.name_value_list.id.value} </Text>
        				    }
                </View>

        				<View style={styles.bodyWrapper}>
                  {this.state.isPushing &&
                  <ActivityIndicator style={styles.headerWrapper} size="large" /> ||

        					   <ScrollView style={styles.scroll}>
        						      <InputLabelRow icon='account-circle' value = {this.state.last_name} onChangeText = {(text) => this.updateData("last_name" ,text)} placeholder='Nom'/>
        						      <InputLabelRow icon={null} value = {this.state.first_name} onChangeText = {(text) => this.updateData("first_name", text)} placeholder='Prénom'/>
        						      <InputLabelRow icon={null} value = {this.state.title} onChangeText = {(text) => this.updateData("title",text)} placeholder='Fonction'/>
        						      <InputLabelRow icon={null} value = {this.state.department} onChangeText = {(text) => this.updateData("department", text)} placeholder='Service'/>
        						      <InputLabelRow icon={null} value = {this.state.account_name} onChangeText = {(text) => this.updateData("account_name", text)} placeholder='Nom de compte'/>
        					      	<InputLabelRow icon='phone' value = {this.state.phone_work} onChangeText = {(text) => this.updateData("phone_work", text)} placeholder='Téléphone fixe'/>
        					     	  <InputLabelRow icon={null} value = {this.state.phone_mobile} onChangeText = {(text) => this.updateData("phone_mobile", text)} placeholder='Téléphone mobile'/>
                          <InputLabelRow icon='mail' value = {this.state.email1} onChangeText = {(text) => this.updateData("email1", text)} placeholder='E-mail'/>
        						      <InputLabelRow icon={null} value = {this.state.website} onChangeText = {(text) => this.updateData("website", text)} placeholder='Site web'/>
        						      <InputLabelRow icon='add-location' value = {this.state.primary_address_street} onChangeText = {(text) => this.updateData("primary_address_street", text)} placeholder='Rue'/>
                          <InputLabelRow icon={null} value = {this.state.primary_address_city} onChangeText = {(text) => this.updateData("primary_address_city", text)} placeholder='Ville'/>
                          <InputLabelRow icon={null} value = {this.state.primary_address_postalcode} onChangeText = {(text) => this.updateData("primary_address_postalcode", text)} placeholder='Code Postal'/>
                          <InputLabelRow icon={null} value = {this.state.primary_address_country} onChangeText = {(text) => this.updateData("primary_address_country", text)} placeholder='Pays'/>
        						      <InputLabelRow icon='description' multiline={true} value = {this.state.description} onChangeText = {(text) => this.updateData("description", text)} placeholder='Description'/>
        					   </ScrollView>
                  }
        				</View>
        			
                {/*Only display the delete button when the screen is accessed from an existing prospect*/}
                {this.props.navigation.state.params.item &&

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
        </ThemeProvider>
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
            <View style={{
              height: 30,
              width: 30,
            }}>
                {this.props.icon &&
      				      <Icon name={this.props.icon}/>
                }
          </View>
				  <TextInput multiline={this.props.multiline} style={{flex: 1}} value = {this.props.value} onChangeText = {this.props.onChangeText} placeholder={this.props.placeholder} />
    		</View>

    	);
   	}
  });