import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight, ActivityIndicator } from 'react-native';

import { styles, images } from './index.js'
import * as constants from '../../config/const.js'


const HEADERS = "method=get_entry_list&input_type=JSON&response_type=JSON&rest_data=";

var DEBUG = true;
var cpt = 0;

export class ProspectListScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {session: undefined, isFetching: false, prospectList: []};
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

  update(){
    this.setNavActions();
  }

  /*componentWillMount(){ console.log("WillMount called");}
  componentDidMount(){ console.log("DidMount called");}
  componentWillUnmount(){ console.log("Unmount called");}
  */


  componentDidMount(){
    cpt++;
    if(cpt === 2){
    console.log("OK");
    this.fetchProspectList();
    } 
  }

  fetchProspectList(){

    console.log("(ListScreen) Session id received = " + this.props.session);

    var param = '{"session":"'+ this.props.session +'","module_name":"Leads","query":"","max_results":"100" }';

    var dataToSend = {  
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: HEADERS.concat(param),
    }

    this.setState({isFetching: true});

    fetch('http://10.32.15.51/SuiteCRM/service/v3_1/rest.php', dataToSend)  
    .then((response) => response.json())
    .then((responseData) => {
        if(DEBUG){
          console.log("(ListScreen) response data received");
          console.log(responseData);
        }
        this.setState({isFetching: false, prospectList: responseData.entry_list});
        if(DEBUG){
          console.log("(ListScreen) state prospect List");
          console.log(this.state.prospectList);
        }
    })
    .done();
  }


  render() {
    this.update();
    
    	return (
    		<View style={styles.container}>
    
    				{/*Header Part*/}
    				<View style={styles.headerWrapper}>
    					<Text style={styles.fontBasic}>Select a prospect to modify it</Text>
    				</View>

            

    				{/*Body Part*/}
    				<View style={styles.bodyWrapper}>

    				      <ScrollView style={styles.scroll}>
                      <FlatList 
                      data={this.state.prospectList} 
                      renderItem={({item}) =>
                          <TouchableHighlight onPress={() => this.goToEdit(item.key)}>
                              <Text style={styles.fontProspect}>{item.name_value_list.name.value}</Text>
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
              			accessibilityLabel="Create a new prospect"
            	  />
    				</View>

    		</View>
  		);
  }
}