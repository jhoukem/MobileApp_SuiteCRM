import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight, ActivityIndicator, Image } from 'react-native';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../lib/rest_api.js'


var DEBUG = true;

export class ProspectListScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {session: undefined, error: false, isFetching: false, flatListNeedUpdate: 1,prospectList: []};
    this.navigate = this.navigate.bind(this);
    
  }

  /*item is used to know if the delete button should be present on the entry.*/
  navigate(route, item=null){
    	this.props.navigator.push({
    		  id: route,
          passProp: {
              item: item,
              ip: this.props.ip,
              sessionID: this.props.session,
              callback: this.updateProspect.bind(this),
          },
    	}); 
  }

  updateProspect(entry_list){
    
    // Return the index in the list of the item to be updated.
    var returnedItemID = entry_list["id"].value;

    var itemIndex = this.state.prospectList.findIndex((obj) => {return obj.name_value_list.id.value == returnedItemID}); 
    var item;
    var new_data;

    // It was a prospect creation since it doesn't exist in the list.
    if(itemIndex === -1){
        new_data = new Object();
        item = new Object();
        item.id = returnedItemID;
        item.module_name = "Leads";
        this.state.prospectList.push(item);
    }
    // It was a prospect update.
    else {
        item = this.state.prospectList[itemIndex];
        new_data = item.name_value_list;
    }
        // The prospect has been deleted. It is removed from the list.
        if(entry_list.deleted.value === 1 && itemIndex !== -1){
          this.state.prospectList.splice(itemIndex, 1);
        }
        // The prospect has been updated.
        else {
            for (var key in entry_list) {
                if (entry_list.hasOwnProperty(key)) {
                    if(DEBUG){
                        console.log("new_data["+ key +"]="+ this.state[key] +" -> "+ key + "=" + entry_list[key].value);
                    }
                    // Set all the updated values.
                    new_data[key] = {name:"", value:""};
                    new_data[key].name = key;
                    new_data[key].value = entry_list[key].value;
                }
            }
        }

    item.name_value_list = new_data;


    if(DEBUG){
        console.log("updated item: ");
        console.log(item);
        if(itemIndex !== -1){
            console.log("this.prospectList["+itemIndex+"].name_value_list.name.value ");
            console.log(this.state.prospectList[itemIndex].name_value_list.name.value);
        } else {
          console.log("this.prospectList["+(this.state.prospectList.length - 1)+"].name_value_list.name.value ");
          console.log(item);
        }
    }

    // Usefull to re-render the flatList because it is a PureComponent.
    this.setState({flatListNeedUpdate: (-this.state.flatListNeedUpdate)});
  }

  setNavActions(){
    var navigator = this.props.navigator;
   
    navigator.__renderLeftNavButton = this.renderLeftNavButton.bind(this);
    navigator.__renderRightNavButton = this.renderRightNavButton.bind(this);
   
    navigator.__onLeftNavButtonPressed = this.logout.bind(this);
    navigator.__onRightNavButtonPressed = this.reload.bind(this);

  }

  renderLeftNavButton(){
      return (      
          <Image source={images.logoutIcon} style={styles.icon} />
      );
  }

  renderRightNavButton(){
      return (
          <Image source={images.reloadIcon} style={styles.icon} />
      );
  }

  logout(){
    this.props.navigator.pop();
  }

  goToEdit(item){
    this.navigate(constants.editScreen, item);
  }

  reload(){
    this.fetchProspectList();
  }

  componentDidMount(){
    this.fetchProspectList();
  }

  fetchProspectList(){

    if(DEBUG){
      console.log("(ListScreen) Session id received = " + this.props.session);
    }

    var param = '{"session":"'+ this.props.session +'","module_name":"Leads","query":"","max_results":"100" }';

    this.setState({isFetching: true});
    navigator.__leftNavButtonDisabled = true;
    navigator.__rightNavButtonDisabled = true;

    var onSuccess = function(responseData){
        navigator.__leftNavButtonDisabled = false;
        navigator.__rightNavButtonDisabled = false;
        this.setState({isFetching: false, error: false, prospectList: responseData.entry_list});
    }
    var onFailure = function(error){
        navigator.__leftNavButtonDisabled = false;
        navigator.__rightNavButtonDisabled = false;
        this.setState({isFetching: false, error: true});
    }

    restCall("get_entry_list", param, this.props.ip, onSuccess.bind(this), onFailure.bind(this));
  }


  render() {
  this.setNavActions();
    	return (
    		<View style={styles.container}>
    
    				{/*Header Part*/}
    				<View style={styles.headerWrapper}>
              {this.state.error && 
                  <Text style={defaultStyles.fontBasicError}>Erreur de réseau</Text> ||
    					         <Text style={defaultStyles.fontBasicNote}>Selectionnez un prospect pour le modifier</Text>
              }
    				</View>

    				{/*Body Part*/}
    				<View style={styles.bodyWrapper}>

                { this.state.isFetching &&
                   <ActivityIndicator style={styles.activityIndicator} size="large" /> ||

                    <ScrollView style={styles.scroll}>
                        <FlatList 
                            data={this.state.prospectList}
                            keyExtractor = {(item, index) => item.name_value_list.id.value}
                            extraData = {this.state.flatListNeedUpdate}
                            renderItem={({item}) =>
                            <TouchableHighlight onPress={() => this.goToEdit(item)}>
                                <Text style={defaultStyles.fontBasicBig}>{item.name_value_list.name.value}</Text>
                            </TouchableHighlight>
                            }
                        />
          			    </ScrollView>
    				    }
            </View>

	    			{/*Button Part*/}
    				<View style={styles.buttonWrapper}>
    				    <Button
              			onPress={() => this.navigate(constants.editScreen)}
             				title="Créer un nouveau prospect"
              			color="#1F94B7"
              			accessibilityLabel="Créer un nouveau prospect"
                    disabled={this.state.isFetching}
            	  />
    				</View>

    		</View>
  		);
  }
}