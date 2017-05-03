import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight, ActivityIndicator, Image } from 'react-native';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'



var cpt = 0;
var DEBUG = false;
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
              sessionID: this.props.session,
          },
    	}); 
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
                <Text style={[defaultStyles.fontNavBar]}>Logout</Text>
      );
  }

  renderRightNavButton(){
      return (
         <Image source={require('../../images/icon_refetch_data.png')} style={styles.icon} />
               
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

  componentWillUpdate(prevProps, prevState){
    this.setNavActions();
  }

  fetchProspectList(){

    if(DEBUG)
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

    	return (
    		<View style={styles.container}>
    
    				{/*Header Part*/}
    				<View style={styles.headerWrapper}>
    					<Text style={defaultStyles.fontBasicNote}>Select a prospect to modify it</Text>
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
             				title="Create a new prospect"
              			color="#1F94B7"
              			accessibilityLabel="Create a new prospect"
            	  />
    				</View>

    		</View>
  		);
  }
}