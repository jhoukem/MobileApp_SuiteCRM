import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight, ActivityIndicator, Image } from 'react-native';

import { styles, images } from './index.js'
import * as constants from '../../config/const.js'



var cpt = 0;
var DEBUG = true;
const HEADERS = "method=get_entry_list&input_type=JSON&response_type=JSON&rest_data=";

export class ProspectListScreen extends Component {

  constructor(props) {
    super(props);
    this.state= {session: undefined, isFetching: false, prospectList: []};
    this.navigate = this.navigate.bind(this);
    
  }

  /*isEdition is used to know if the delete button should be present on the entry.*/
  navigate(route, item=null){
    	this.props.navigator.push({
    		  id: route,
          passProp: {
              item: item,
              ip: this.props.ip,
          },
    	}); 
  }

  logout(){
    this.props.navigator.pop();
  }

  goToEdit(item){
    this.navigate(constants.editScreen, item);
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
                <Text style={styles.fontBasic2}> Logout </Text>
      );
  }

  // <Image source={require('../../images/icon_refetch_data.png')} style={style.icon} />
  renderRightNavButton(){
      return (
         <Image source={require('../../images/icon_refetch_data.png')} style={styles.icon} />
               
      );
  }

  reload(){
    this.fetchProspectList();
  }

  update(){
    this.setNavActions();
  }

  // Bad workaround
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

    fetch('http://'+ this.props.ip +'/SuiteCRM/service/v3_1/rest.php', dataToSend)  
    .then((response) => response.json())
    .then((responseData) => {
        if(DEBUG){
          console.log("(ListScreen) response data received");
          console.log(responseData);
        }
        this.setState({isFetching: false, prospectList: responseData.entry_list});
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

                { this.state.isFetching &&
                   <ActivityIndicator style={styles.activityIndicator} size="large" /> ||

                    <ScrollView style={styles.scroll}>
                        <FlatList 
                            data={this.state.prospectList}
                            keyExtractor = {(item, index) => item.name_value_list.id.value}
                            renderItem={({item}) =>
                            <TouchableHighlight onPress={() => this.goToEdit(item)}>
                                <Text style={styles.fontProspect}>{item.name_value_list.name.value}</Text>
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
             				title="Create a new prospect"
              			color="#1F94B7"
              			accessibilityLabel="Create a new prospect"
            	  />
    				</View>

    		</View>
  		);
  }
}