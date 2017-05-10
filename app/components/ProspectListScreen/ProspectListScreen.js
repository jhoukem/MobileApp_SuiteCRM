import React, { Component } from 'react';
import { Text, ScrollView, View, Button, FlatList, ListItem, TouchableHighlight, ActivityIndicator, Image } from 'react-native';
import SearchBar from 'react-native-searchbar'


import { styles as defaultStyles } from '../../layout/styles.js'
import { styles, images } from './index.js'
import * as constants from '../../config/const.js'
import { restCall } from '../../lib/rest_api.js'

var DEBUG = false;

export class ProspectListScreen extends Component {


  constructor(props) {
    super(props);
    //this.state = {session: undefined, error: false, isFetching: false, flatListNeedUpdate: 1, isSearching: false, prospectList: [], prospectSearch: []};
    this.state = this.props.navigation.state.params;
    this.navigate = this.navigate.bind(this);
    this.reload = this.reload.bind(this);
  }

  componentWillMount(){
    // Set the NavBar Actions.
    const { state, setParams } = this.props.navigation;
    setParams({error: false, isFetching: false, flatListNeedUpdate: 1, isSearching: false, prospectList: [], prospectSearch: []});
    setParams({listScreen:{rightButton: this.reload.bind(this)}});
    setParams({listScreen:{leftButton: this.logout.bind(this)}});
  }

  static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: "Liste des prospects",
            headerRight: (
                    <Button
                        title={"Reload"}
                        disabled = { state.params.isFetching }
                        onPress={() => state.params.listScreen.rightButton()}
                    />
            ),
            headerLeft: (
                    <Button
                        title={"On"}
                        onPress={() => {console.log("Is fetching ? " + state.params.isFetching);state.params.listScreen.rightButton()}}
                    />
            ),
        };
  };

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

 /* renderLeftNavButton(){
      return (   
        <TouchableHighlight disabled={this.state.isFetching} onPress={() => this.logout.bind(this)}>
            <Image source={images.logoutIcon} style={styles.icon} />
        </TouchableHighlight>         
      );
  }

  renderRightNavButton(){
      return (
        <TouchableHighlight onPress={() => this.test.bind(this)}>
            <Image source={images.searchIcon} style={styles.icon} />
        </TouchableHighlight>

        
      );
  }*/

  logout(){
    var param = {session: this.props.session};
    var paramJSON = JSON.stringify(param);
    restCall("logout", paramJSON, this.props.ip, null, null);
    this.props.navigator.pop();
  }

  goToEdit(item){
    this.navigate(constants.editScreen, item);
  }

  /*onSearch(){
    console.log("on Search");
    this.state.isSearching = !this.state.isSearching;
    
    this.state.isSearching ? this.searchBar.show() : this.searchBar.hide();
    this.searchBar.show();
  }*/

  reload(){

    console.log("in reload !!!!!!!!!!!!!!!!!!!!!!");
   
    const { state, setParams } = this.props.navigation;
    setParams({isFetching2: !state.params.isFetching});

    //this.setState({isFetching: !this.state.isFetching});

    /*
    if(!this.state.isFetching){
        this.fetchProspectList();
    }
    */
   /* this.setState({isFetching: !this.state.isFetching});
    this.disableNavButton(!this.props.navBar.leftNavButtonDisabled);
    */
    
  }

  componentDidMount(){
    //this.fetchProspectList();
  }

  fetchProspectList(){
     const { navParams } = this.props.navigation.state;
     console.log("Nav params = ");
     console.log(navParams);

    var ip = navParams.ip;
    var session = navParams.session;

      console.log("(ListScreen) Session id received = " + session);
    if(DEBUG){
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

  onBack(input){

    this.setState({isSearching: false, flatListNeedUpdate: (-this.state.flatListNeedUpdate)});
    this.searchBar.hide();
    
  }


  render() {
    console.log("rendering");
    	return (
    		<View style={styles.container}>
    
    				{/*Header Part*/}
    				<View style={styles.headerWrapper}>
              {this.state.error && 
                  <Text style={defaultStyles.fontBasicError}>Erreur de réseau</Text> ||

                      <View>
                            <SearchBar
                            ref={(ref) => this.searchBar = ref}
                            data={this.state.prospectList}
                            handleResults={this.handleResults.bind(this)}
                            onBack={this.onBack.bind(this)}
                            backButton={<Image source={images.searchbarBackButtonIcon}/>}
                            closeButton={<Image source={images.searchbarCloseButtonIcon}/>}
                            />
        					         <Text style={defaultStyles.fontBasicNote}>Selectionnez un prospect pour le modifier</Text>
                       </View>
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
