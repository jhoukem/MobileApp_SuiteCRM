import 'react-native';
import React from 'react';
import { ProspectListScreen } from '../../../app/components/ProspectListScreen/ProspectListScreen'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

/* Mock for the default props of the component. */
var arg = {
	state: {
		params:{
			item:null,
		}
	}
}

var prospectListMock = require('./prospectListMock.json');


describe('ProspectListScreen', () => {
    it('renders without crashing', () => {
       const tree = renderer.create(
       	<ProspectListScreen jest={{list: prospectListMock}} navigation={arg}/>
       	);

    });
  	it('display the search list with the correct values', () => {
       const tree = renderer.create(
       	<ProspectListScreen jest={{list: prospectListMock}} navigation={arg}/>
       	);
       const instance = tree.getInstance();
       const patternToSearch = "jean";

       instance.setSearching(true);
       instance.handleSearch(patternToSearch);

       // Ensure that the prospectSearchList only contains the prospect with the word "jean" in their first_name/last_name.
       expect(instance.state.prospectSearch.length).toBe(2);
       expect(instance.state.prospectSearch[0].name_value_list.last_name.value + " " +
        instance.state.prospectSearch[0].name_value_list.first_name.value).toBe("prospect 6 jean");
       expect(instance.state.prospectSearch[1].name_value_list.last_name.value + " " +
        instance.state.prospectSearch[1].name_value_list.first_name.value).toBe("jean jaures ");

    });
    

});