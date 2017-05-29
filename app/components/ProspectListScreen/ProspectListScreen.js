import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native';
import { ThemeProvider, Toolbar, IconToggle, Avatar} from 'react-native-material-ui';

import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../core/rest_api.js'

var DEBUG = false;

export class ProspectListScreen extends Component {

  // Hide the navigation bar since we use a Toolbar on this component.
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

  /**
   * Navigate to the given screen.
   * item if set it is the prospect to consult/edit. Otherwise it mean it is a prospect creation (which it is by default).
   **/
  navigate(screen, item=null){

    var params = {
          session: this.props.navigation.state.params.session,
          ip: this.props.navigation.state.params.ip,
          item: item,
          // This is the function that will be called on EditScreen before going back to this screen.
          callback: this.updateProspectList.bind(this),
    };
    this.props.navigation.navigate(screen, params);
  }

  /**
   * Use the info returned by the EditScreen to update the prospectList without refetching the database.
   */
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

    // If the prospect has been deleted. It is removed from the list.
    if(entry_list.deleted.value === 1 && itemIndex !== -1){
        this.state.prospectList.splice(itemIndex, 1);
    } 
    // Else we update the prospect data.
    else {
      for(key in entry_list){
        if(DEBUG){
          console.log("item.name_value_list["+key+"]="+item.name_value_list[key]);
        }
        item.name_value_list[key] = entry_list[key];
      }
    }

    if(DEBUG){
        console.log("List length = "+this.state.prospectList.length);
    }

    // If we are in search mode we need to redo the search since an item has changed.
    if(this.state.isSearching){
        this.handleSearch(this.toolbar.state.searchValue);
    }
    // Resort the list in case a name has changed. 
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
    // Usefull for jest test as we don't want to fetch data in Jest. TODO: find a way to mock the fetch function.
    if(this.props.jest){
        this.setState({prospectList: this.props.jest.list.entry_list});
    } else {
        this.fetchProspectList();
      }
  }

  fetchProspectList(){

    var ip = this.props.navigation.state.params.ip;
    var session = this.props.navigation.state.params.session;

    if(DEBUG){
      console.log("(ListScreen) Session id received = " + session);
    }
    // Api request field
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
        var first_name;
        if(this.state.prospectList[idx].name_value_list[constants.first_name_key]){
          first_name = this.state.prospectList[idx].name_value_list[constants.first_name_key].value;
        }
        // Add to the searchList items which includes in their last_name/first_name the searchPattern.
        if(last_name.includes(pattern) || (first_name ? first_name.includes(pattern) : false)){
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
        <ThemeProvider uiTheme={constants.uiTheme}>
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
			                                                		style={{container:{backgroundColor:constants.avatarColors[index%constants.avatarColors.length]}}}
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
	                  				color={constants.uiTheme.palette.primaryColor}
	                        	disabled={this.state.isFetching}
	                	  />
        				</View>
        		</View>
      </ThemeProvider>
  		);
  }
}
