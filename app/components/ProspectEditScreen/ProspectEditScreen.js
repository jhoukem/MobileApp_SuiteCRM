import React, { Component } from 'react';
import { Text, ScrollView, View, Button, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { Toolbar, ThemeProvider } from 'react-native-material-ui';

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
        email: null,
        address: null,
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

    console.log("ip = " + ip + "  session = "+ session);
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
                            {name:"email1", value: this.state.email},
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
      this.pushToServer("Le prospect à bien été enregistré dans votre CRM",
        "Le prospect n'a pas pu être enregistré dans votre CRM");
    }
  }

  handleDelete(){
    if(!this.state.isPushing){
      this.state.deleted = 1;
      this.pushToServer("Le prospect à bien été supprimé de votre CRM",
        "Le prospect n'a pas pu être supprimé de votre CRM");
    }
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

  componentWillMount(){
      var item = null;
      item = this.props.navigation.state.params.item;

      if(item){
          this.setState({
                last_name: item.name_value_list.last_name ? item.name_value_list.last_name.value : "",
                first_name: item.name_value_list.first_name ? item.name_value_list.first_name.value : "",
                title: item.name_value_list.title ? item.name_value_list.title.value : "",
                service: item.name_value_list.department ? item.name_value_list.department.value : "",
                account_name: item.name_value_list.account_name ? item.name_value_list.account_name.value : "",
                phone_number: item.name_value_list.phone_work ? item.name_value_list.phone_work.value : "",
                mobile_phone_number: item.name_value_list.phone_mobile ? item.name_value_list.phone_mobile.value : "",
                //website: this.props.item.name_value_list.surname ? this.props.item.name_value_list.surname.value : "",
                email: item.name_value_list.email1 ? item.name_value_list.email1.value : "",
                //address: this.props.item.name_value_list.surname.value,
                description: item.name_value_list.description ? item.name_value_list.description.value : "",
          });
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
                    leftElement="arrow-back"
                    onLeftElementPress={this.handleCancel}
                    rightElement="save"
                    onRightElementPress={this.handleSave}
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

				<Text style={defaultStyles.fontBasicMedium}>{this.props.label}:</Text>
				    <TextInput style={{flex: 1}} value = {this.props.value} onChangeText = {this.props.onChangeText} placeholder={this.props.placeholder} />
    		</View>

    	);
   	}
  });