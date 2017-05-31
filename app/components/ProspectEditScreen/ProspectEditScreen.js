import React, { Component } from 'react';
import { Text, ScrollView, View, Button, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { ThemeProvider, Toolbar, Icon, IconToggle } from 'react-native-material-ui';
import { default as MIcon } from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../core/rest_api.js'

var DEBUG = false;

/**
 * Author: Jean-Hugo OUWE MISSI OUKEM
 *
 * Description: This is a React Native component used to show a prospect details.
 * It has an edit mode (disabled by default) that allow to modify a prospect details.
 *
 */
export class ProspectEditScreen extends Component {

  // Hide the navigation bar since we use a Toolbar on this component.
  static navigationOptions = {
        header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
        isPushing: false,
        saveSucceed: undefined,
        isEditable: false,
        hasModifications: false,
        [constants.id_key]: null,
        [constants.last_name_key]: null,
        [constants.first_name_key]: null,
        [constants.title_key]: null,
        [constants.department_key]: null,
        [constants.account_name_key]: null,
        [constants.work_phone_number_key]: null,
        [constants.mobile_phone_number_key]: null,
        [constants.website_key]: null,
        [constants.email_key]: null,
        [constants.country_key]: null,
        [constants.street_key]: null,
        [constants.city_key]: null,
        [constants.postalcode_key]: null,
        [constants.description_key]: null,
        [constants.deleted_key]: null,
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  pushToServer(onSuccessMessage, onFailureMessage) {
    
    if(DEBUG){
      this.debugState();
    }
    var ip = this.props.navigation.state.params.ip;
    var session = this.props.navigation.state.params.session;
    var updateListScreenFlatList = this.props.navigation.state.params.callback;

    var nameValueList = [
                            {name:constants.id_key, value: (this.state[constants.id_key]) ? this.state[constants.id_key] : ''},
                            {name:constants.last_name_key, value: this.state[constants.last_name_key]},
                            {name:constants.first_name_key, value: this.state[constants.first_name_key]},
                            {name:constants.title_key, value: this.state[constants.title_key]},
                            {name:constants.department_key, value: this.state[constants.department_key]},
                            {name:constants.account_name_key, value: this.state[constants.account_name_key]},
                            {name:constants.work_phone_number_key, value: this.state[constants.work_phone_number_key]},
                            {name:constants.mobile_phone_number_key, value: this.state[constants.mobile_phone_number_key]},
                            {name:constants.website_key, value: this.state[constants.website_key]},
                            {name:constants.country_key, value: this.state[constants.country_key]},
                            {name:constants.street_key, value: this.state[constants.street_key]},
                            {name:constants.city_key, value: this.state[constants.city_key]},
                            {name:constants.postalcode_key, value: this.state[constants.postalcode_key]},
                            {name:constants.description_key, value: this.state[constants.description_key]},
                            {name:constants.email_key, value: this.state[constants.email_key]},
                            {name:constants.deleted_key, value: this.state[constants.deleted_key]},
                        ]
    var updatedData = {session: session,
                        module_name:"Leads",
                        name_value_list: nameValueList,
                      }

    this.setState({isPushing: true});

    var onSuccess = function(responseData){
        // Received a server response.
        this.setState({isPushing: false});
        if(responseData.entry_list){
            if(DEBUG){
                console.log("(EditScreen received item) :");
                console.log(responseData.entry_list);
            }
            this.setState({hasModifications: false});
            
            Alert.alert('Succès', onSuccessMessage,
                  [ 
                      {text: 'OK', onPress: () => {
                        // Update the prospectList and go back to the previousScreen.
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
  
    restCall("set_entry", updatedData, ip, onSuccess.bind(this), onFailure.bind(this));
  
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
      this.state[constants.deleted_key] = 0;

      // Check if the input field values are corrects.
      if(this.checkInputFields()){
          this.pushToServer("Le prospect à bien été enregistré dans votre CRM",
          "Le prospect n'a pas pu être enregistré dans votre CRM");
          return true;
      } 
    }
    return false;
  }

  handleDelete(){

  var deleteProspect = function(){
      if(!this.state.isPushing){
          this.state[constants.deleted_key] = 1;
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
    // If the email field is set, it ensure that it has a correct format.
    if(this.state[constants.email_key] && !reg.test(this.state[constants.email_key])){
       Alert.alert('Erreur', 'Format de l\'email incorrect',
                  [ 
                      {text: 'OK'},
                  ]
        )
        return false;
    }

    // Insure that the prospect last_name is set and not with white space only.
    if(!this.state[constants.last_name_key] || !this.state[constants.last_name_key].replace(/\s/g, '').length){
       Alert.alert('Erreur', 'Le champ \'Nom\' est obligatoire',
                  [ 
                      {text: 'OK'},
                  ]
        )
        return false;
    }
    return true;
  }

  /**
   * It auto fill the prospect informations on the editScreen.
   */
  setStateToItem(){
    var item = this.props.navigation.state.params.item;

      if(item){
        item = item.name_value_list;
          for(key in item){
              if(item[key].value){
                  if(DEBUG){
                      console.log("item["+ key + "] =  "+ item[key].value);
                  }
                  // We don't use setState() here because it cause to re-render the screen for each key and thus slow the process.
                  this.state[key] = item[key].value;
              }
          }
      }
  }

  componentWillMount(){
      this.setStateToItem();
      // If it is a prospect creation, we want the field to be editable.
      this.state.isEditable = !this.props.navigation.state.params.item;
  }

  /**
   * It update the state key with the given value and set the hasModification flag to true.
   */
  updateData(key, value){
      this.setState({[key]: value, hasModifications: true});
  }

  handleEdit(){

        if(!this.state.isEditable){
            Alert.alert('Info', 'Voulez-vous activer le mode édition ?',
                  [ 
                      {text: 'Non', },
                      {text: 'Oui', onPress: () => this.setState({isEditable: true}) },
                  ],
                  {cancelable: false},
            )
        } else {
          // If there is any modifications, toggling the edit mode to off will ask to save the infos
          if(this.state.hasModifications){
              Alert.alert('Info', 'Sauvegarder les changements ?',
                  [ 
                      {text: 'Annuler', },
                      {text: 'Oui', onPress: () => { if(this.handleSave()){this.setState({isEditable: false})}} },
                      {text: 'Non', onPress: () => {this.setStateToItem(); this.setState({isEditable: false, hasModifications: false})} },
                  ],
                  {cancelable: false},
                )
          } else {
                  this.setState({isEditable: false})
          }
        }
  }

  render() {
    	return (
        <ThemeProvider uiTheme={constants.uiTheme}>
        		<View style={styles.container}>
                <Toolbar
                    ref={toolbarComponent => this.toolbar = toolbarComponent}
                    key="toolbar"
                    leftElement={<IconToggle name="navigate-before" color="white" onPress={this.handleCancel} disabled={this.state.isPushing}/>}
                    rightElement={
                      <View style={{flexDirection: 'row'}}>
                          <IconToggle name="mode-edit" color={this.state.isEditable ? "grey" : "white"} onPress={this.handleEdit} 
                            disabled={!this.props.navigation.state.params.item || this.state.isPushing}
                          />
                          <IconToggle name="save" color="white" onPress={this.handleSave}
                            disabled={this.state.isPushing ? true : this.props.navigation.state.params.item ? !this.state.isEditable : false }
                          />
                      </View>
                    }
                    centerElement={
                      <View style={{alignItems: 'center'}}>
                        <Text style={defaultStyles.fontNavBar}>
                            {this.props.navigation.state.params.item ? this.state.isEditable ? "Édition" : "Consultation" : "Création"}
                        </Text>
                      </View>
                    }
                />

        			<View style={styles.headerWrapper}>
                    	{/*Only display the prospect ID field if it exists*/}
                    	{this.state[constants.id_key] &&
        						<Text>Prospect ID: {this.state[constants.id_key]} </Text>
        				}
                	</View>

        			<View style={styles.bodyWrapper}>
                  	{this.state.isPushing &&
                  			<ActivityIndicator style={styles.headerWrapper} size="large" /> ||

        					   <ScrollView style={styles.scroll}>
        					   		<InputLabelRow icon='account-circle' value = {this.state[constants.last_name_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.last_name_key, text)} placeholder='Nom'/>
        						    <InputLabelRow icon={null} value = {this.state[constants.first_name_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.first_name_key, text)} placeholder='Prénom'/>
        						    <InputLabelRow icon={null} value = {this.state[constants.title_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.title_key, text)} placeholder='Fonction'/>
        						    <InputLabelRow icon={null} value = {this.state[constants.department_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.department_key, text)} placeholder='Département'/>
        						    <InputLabelRow icon={null} value = {this.state[constants.account_name_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.account_name_key, text)} placeholder='Nom de compte'/>
        					      	<InputLabelRow micon='phone-classic' value = {this.state[constants.work_phone_number_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.work_phone_number_key, text)} placeholder='Téléphone fixe' keyboardType='phone-pad'/>
        					     	<InputLabelRow micon='cellphone' value = {this.state[constants.mobile_phone_number_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.mobile_phone_number_key, text)} placeholder='Téléphone mobile' keyboardType='phone-pad'/>
                          			<InputLabelRow icon='mail-outline' value = {this.state[constants.email_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.email_key, text)} placeholder='E-mail'/>
        						    <InputLabelRow micon='web' value = {this.state[constants.website_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.website_key, text)} placeholder='Site web' keyboardType='url' />
                          			<InputLabelRow icon='edit-location' value = {this.state[constants.country_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.country_key, text)} placeholder='Pays'/>
                          			<InputLabelRow icon={null} value = {this.state[constants.city_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.city_key, text)} placeholder='Ville'/>
                          			<InputLabelRow icon={null} value = {this.state[constants.street_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.street_key, text)} placeholder='Rue'/>
                          			<InputLabelRow icon={null} value = {this.state[constants.postalcode_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.postalcode_key, text)} placeholder='Code Postal' keyboardType='numeric'/>
        						    <InputLabelRow icon='description' multiline={true} value = {this.state[constants.description_key]} editable={this.state.isEditable}
                          					onChangeText = {(text) => this.updateData(constants.description_key, text)} placeholder='Description'/>
        					   </ScrollView>
                  	}
        				</View>
        			
                {/*Only display the delete button when the screen is accessed from an existing prospect*/}
                {this.props.navigation.state.params.item &&

        				    <View style={styles.buttonWrapper}>
        						    <Button
                  				  		onPress={() => this.handleDelete()}
                 					  	title= "Supprimer"
                  				  		color="red"
                            			disabled={this.state.isPushing || !this.state.isEditable}
                		    		/>
        				    </View>
        		}
        		</View>
        </ThemeProvider>
    	);
  }

}

/**
 * This class is used to have an icon followed by an input text component.
 */
var InputLabelRow = React.createClass({

   	render() {
    	return (

    		<View style={{
    			flex: 1,
    			flexDirection: 'row',
				alignItems: 'center',
          		height: this.props.multiline ? 100 :50,
			}}>
            	<View style={{
              		height: 30,
              		width: 30,
            	}}>
                	{this.props.icon &&
      					<Icon name={this.props.icon} size={30}/>
                	}

                	{this.props.micon &&
                    	<MIcon name={this.props.micon} size={30}/>
                	}
          		</View>
				<TextInput 
              		multiline={this.props.multiline}
                  editable={this.props.editable}
              		style={{flex: 1, height: this.props.multiline ? 100 : 50}}
              		value = {this.props.value}
              		onChangeText = {this.props.onChangeText}
              		placeholder={this.props.placeholder}
              		keyboardType = {this.props.keyboardType ? this.props.keyboardType : 'default'}
          		/>
    		</View>

    	);
   	}
  });