import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Toolbar, ThemeProvider, IconToggle, Avatar} from 'react-native-material-ui';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../lib/rest_api.js'

var DEBUG = false;
var avatarColors = ["#e8d725", "#38579e", "#f9b6bf", "#ef64d8", "#c10f6e",
"#e57074", "#f9d1c0", "#2c55a3", "#611296", "#f22bcd", "#4a97ad", "#85f702",
"#f7a5a7", "#e4f7a0", "#81ef93", "#1cddb7", "#ea6267", "#91b7ff", "#91d613",
"#eac715", "#fcd292", "#a40bc6", "#ed38e4", "#605df7", "#c6008b", "#e0477d",
"#27dd95", "#d64f02", "#fc7bcf", "#f79283"];
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
    this.setSearching = this.setSearching.bind(this);
  }

  /*item is used to know if the delete button should be present on the entry.*/
  navigate(route, item=null){

    var params = {
          session: this.props.navigation.state.params.session,
          ip: this.props.navigation.state.params.ip,
          item: item,
          callback: this.updateProspectList.bind(this),
    };

    this.props.navigation.navigate(route, params);
  }

  updateProspectList(entry_list){
    
    // Return the index in the list of the item to be updated.
    var returnedItemID = entry_list["id"].value;

    var itemIndex = this.state.prospectList.findIndex((obj) => {return obj.name_value_list.id.value == returnedItemID}); 
    var item;

    // It was a prospect creation since it doesn't exist in the list.
    if(itemIndex === -1){
        item = new Object();
        item.name_value_list = new Object();
        item.id = returnedItemID;
        item.module_name = "Leads";
        this.state.prospectList.push(item);
    }
    // It was a prospect update.
    else {
        item = this.state.prospectList[itemIndex];
    }
    
    // We update the name_value_list.
    for(key in entry_list){
      item.name_value_list[key] = entry_list[key];
    }

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
     if(DEBUG){
        console.log("List length = "+this.state.prospectList.length);
     }

    // Resort the list in case the name has changed. 
    this.state.prospectList.sort(this.alphabeticalSort);
    // Usefull to re-render the flatList because it is a PureComponent.
    this.setState({flatListNeedUpdate: (-this.state.flatListNeedUpdate)});
  }

  logout(){
    var ip = this.props.navigation.state.params.ip;
    var session = this.props.navigation.state.params.session;

    var param = {session: session};
    var paramJSON = JSON.stringify(param);

    restCall("logout", paramJSON, ip, null, null);
    this.props.navigation.goBack();
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

    var ip = this.props.navigation.state.params.ip;
    var session = this.props.navigation.state.params.session;

    if(DEBUG){
      console.log("(ListScreen) Session id received = " + session);
    }

    var param = '{"session":"'+ session +'","module_name":"Leads","query":"","order_by":"","offset":"0",'+
    '"select_fields":["id","last_name","first_name","title","service","department","account_name","email1",'+
    '"phone_work","phone_mobile","website","primary_address_street","primary_address_city","primary_address_postalcode",'+
    '"primary_address_country","description"],"link_name_to_fields_array":[],"max_results":"1000"}';


    this.setState({isFetching: true});
    var onSuccess = function(responseData){
        // Set the state manually to sort before rendering.
        this.state.prospectList = responseData.entry_list;
        this.state.prospectList.sort(this.alphabeticalSort);
        this.setState({isFetching: false});
    }
    var onFailure = function(error){
        this.setState({isFetching: false, error: true});
    }

    restCall("get_entry_list", param, ip, onSuccess.bind(this), onFailure.bind(this));
  }


  alphabeticalSort(itemA, itemB){
    if(!itemA.name_value_list[constants.last_name_key] || !itemB.name_value_list[constants.last_name_key]) return 0;
    if(itemA.name_value_list[constants.last_name_key].value.toLowerCase() < itemB.name_value_list[constants.last_name_key].value.toLowerCase()) return -1;
    if(itemA.name_value_list[constants.last_name_key].value.toLowerCase() > itemB.name_value_list[constants.last_name_key].value.toLowerCase()) return 1;
    return 0;
  }

  handleSearch(pattern){
    var results = new Array();

    for(idx in this.state.prospectList){
        var last_name = this.state.prospectList[idx].name_value_list[constants.last_name_key].value;
        var first_name = this.state.prospectList[idx].name_value_list[constants.first_name_key].value;
        if(last_name.contains(pattern) || first_name.contains(pattern)){
          results.push(this.state.prospectList[idx]);
        }
    }
    this.setState({flatListNeedUpdate: (-this.state.flatListNeedUpdate), prospectSearch: results});
  }

  setSearching(bool){
    this.setState({isSearching: bool, prospectSearch: null});
  }

  render() {

    	return (
        <ThemeProvider uiTheme={uiTheme}>
        		<View style={styles.container}>
                		<Toolbar
			                    ref={toolbarComponent => this.toolbar = toolbarComponent}
			                    key="toolbar"
			                    leftElement="exit-to-app"
			                    onLeftElementPress={this.logout}
			                    rightElement={<IconToggle name="cloud-download" color="white" onPress={this.reload} disabled={this.state.isFetching}/>}
			                    centerElement="Liste des prospects"
			                    searchable={{ autoFocus: true,
			                                  placeholder: 'Rechercher dans la liste',
			                                  onSearchPressed: () => this.setSearching(true),
			                                  onSearchClosed: () => this.setSearching(false),
			                                  onChangeText: (text) => this.handleSearch(text),
			                                }}
                  		/>

        				{/*Header Part*/}
        				<View style={styles.headerWrapper}>
                  		{this.state.error && 
                      			<Text style={defaultStyles.fontBasicError}>Erreur de réseau</Text> ||
      				        	<Text style={defaultStyles.fontBasicNote}>Selectionnez un prospect pour le modifier</Text>
                  		}
        				</View>

        				{/*Body Part*/}
        				<View style={styles.bodyWrapper}>

                    	{this.state.isFetching &&
                        		<ActivityIndicator style={styles.activityIndicator} size="large" /> ||

	                            <ScrollView style={styles.scroll}>
	                                <FlatList 
	                                    data={this.state.isSearching ? this.state.prospectSearch : this.state.prospectList}
	                                    keyExtractor={(item, index) => item.name_value_list.id.value}
	                                    extraData={this.state.flatListNeedUpdate}
	                                    renderItem={({item, index}) =>
			                                    <TouchableHighlight onPress={() => this.goToEdit(item)}>
			                                        <View style={{flexDirection: 'row', backgroundColor:(index % 2) ? '#f1f2f4' : '#e2e6e9', alignItems: 'center'}}>
			                                            <View style={{width: 50, padding: 5}}>
			                                            		<Avatar
			                                                		style={{container:{backgroundColor:avatarColors[index%avatarColors.length]}}}
			                                                		text={item.name_value_list[constants.last_name_key].value.charAt(0).toUpperCase()} 
			                                                		size={40}
			                                                	/>
			                                            </View>
			                                        	<View>
				                                        		<Text style={[defaultStyles.fontBasicBig, {backgroundColor:'rgba(0,0,0,0)'}]}>
				                                                {item.name_value_list[constants.last_name_key].value} {item.name_value_list[constants.first_name_key] ? 
				                                                  item.name_value_list[constants.first_name_key].value : ''}
				                                                </Text>
				                                                {item.name_value_list[constants.email_key] &&
				                                                    <Text style={[defaultStyles.fontBasic, {backgroundColor:'rgba(0,0,0,0)'}]}>
				                                                    {item.name_value_list[constants.email_key].value}
				                                                    </Text>
				                                                }
			                                            </View>
			                                        </View>
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
        </ThemeProvider>
  		);
  }
}
