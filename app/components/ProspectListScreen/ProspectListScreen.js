import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight, ActivityIndicator, Image } from 'react-native';


import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../lib/rest_api.js'

var DEBUG = false;

export class ProspectListScreen extends Component {

  static navigationOptions = {
        header: null,
  };

  constructor(props) {
    super(props);
    this.state = { error: false, isFetching: false, flatListNeedUpdate: 1, isSearching: false, prospectList: [], prospectSearch: []};
    this.navigate = this.navigate.bind(this);
    this.reload = this.reload.bind(this);
    this.logout = this.logout.bind(this);
  }

  /*item is used to know if the delete button should be present on the entry.*/
  navigate(route, item=null){
    	this.props.navigator.push({ 
    		  id: route,
          passProp: {
              item: item,
              ip: this.props.ip,
              sessionID: this.props.session,
              callback: this.updateProspectList.bind(this),
          },
    	}); 
  }

  updateProspectList(entry_list){
    // Set back the nav actions since the screen is going to be render again (navigator.pop())    
    this.setNavActions();
    
    // Return the index in the list of the item to be updated.
    var returnedItemID = entry_list["id"].value;

    var itemIndex = this.state.prospectList.findIndex((obj) => {return obj.name_value_list.id.value == returnedItemID}); 
    var item;

    // It was a prospect creation since it doesn't exist in the list.
    if(itemIndex === -1){
        item = new Object();
        item.id = returnedItemID;
        item.module_name = "Leads";
        this.state.prospectList.push(item);
    }
    // It was a prospect update.
    else {
        item = this.state.prospectList[itemIndex];
    }
    
    // We update the name_value_list.
    item.name_value_list = entry_list;


     // The prospect has been deleted. It is removed from the list.
     if(entry_list.deleted.value === 1 && itemIndex !== -1){
       this.state.prospectList.splice(itemIndex, 1);
     }
     // The prospect has been updated.
     else {
         if(DEBUG){
             console.log("updated item: ");
             console.log(item);
             // If it wasn't deleted then we display its value in the list.
             if(entry_list.deleted.value !== 1){
                 if(itemIndex !== -1){
                     console.log("this.prospectList["+itemIndex+"].name_value_list.name.value ");
                     console.log(this.state.prospectList[itemIndex].name_value_list.name.value);
                 } else {
                     console.log("this.prospectList["+(this.state.prospectList.length - 1)+"].name_value_list.name.value ");
                     console.log(this.state.prospectList[this.state.prospectList.length - 1].name_value_list.name.value);
                 }
             }
         }
     }

    console.log("List length = "+this.state.prospectList.length);
    // Usefull to re-render the flatList because it is a PureComponent.
    this.setState({flatListNeedUpdate: (-this.state.flatListNeedUpdate)});
  }

  logout(){
    var param = {session: this.props.session};
    var paramJSON = JSON.stringify(param);
    restCall("logout", paramJSON, this.props.ip, null, null);
    this.props.navigator.pop();
  }

  goToEdit(item){
    this.navigate(constants.editScreen, item);
  }

  reload(){
    this.fetchProspectList();
  }

  componentDidMount(){
    //this.fetchProspectList();
  }

  fetchProspectList(){

    var ip = this.props.navigation.state.params.ip;
    var session = this.props.navigation.state.params.session;

    if(DEBUG){
      console.log("(ListScreen) Session id received = " + session);
    }

    var param = '{"session":"'+ session +'","module_name":"Leads","query":"","max_results":"100" }';

    //this.disableNavButton(true);

    this.setState({isFetching: true});
    var onSuccess = function(responseData){
        this.setState({isFetching: false, error: false, prospectList: responseData.entry_list});
        //this.disableNavButton(false);
    }
    var onFailure = function(error){
        this.setState({isFetching: false, error: true});
        //this.disableNavButton(false);
    }

    restCall("get_entry_list", param, ip, onSuccess.bind(this), onFailure.bind(this));
  }


  handleResults(results){
    this.setState({flatListNeedUpdate: (-this.state.flatListNeedUpdate), prospectSearch: results});
  }



  render() {
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
                                data={this.state.isSearching ? this.state.prospectSearch : this.state.prospectList}
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
