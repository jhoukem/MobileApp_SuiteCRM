import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
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
var prospectUpdateMock = require('./prospectUpdateMock.json');
var newProspectMock = require('./newProspectMock.json');

var findProspectById = (prospect, idToMatch) => {
    return prospect.name_value_list.id.value == idToMatch;
}

afterEach(() => {
  // Reload the default configuration after each test.
  prospectUpdateMock = require('./prospectUpdateMock.json');
});

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
    it('update a prospect from the list', () => {
        const tree = renderer.create(
            <ProspectListScreen jest={{list: prospectListMock}} navigation={arg}/>
        );
        const instance = tree.getInstance();
        instance.updateProspectList(prospectUpdateMock);
        var updatedProspectIndex = instance.state.prospectList.findIndex((item) => findProspectById(item, prospectUpdateMock.id.value)); 
        var updatedProspect = instance.state.prospectList[updatedProspectIndex].name_value_list;
         
        // Ensure that the prospectList is updated with the corrects values.
        for(key in prospectUpdateMock){
            expect(prospectUpdateMock[key]).toEqual(updatedProspect[key])
        }
    });
    it('add a prospect to the list', () => {
        const tree = renderer.create(
            <ProspectListScreen jest={{list: prospectListMock}} navigation={arg}/>
        );
        const instance = tree.getInstance();
        var listSize = instance.state.prospectList.length;
        instance.updateProspectList(newProspectMock);
        // Ensure that the prospectList size has increased by one.
        expect(instance.state.prospectList.length).toBe(listSize + 1);

        var updatedProspectIndex = instance.state.prospectList.findIndex((item) => findProspectById(item, newProspectMock.id.value)); 
        var updatedProspect = instance.state.prospectList[updatedProspectIndex].name_value_list;
         
        // Ensure that the prospectList is updated with the corrects values.
        for(key in newProspectMock){
            expect(newProspectMock[key]).toEqual(updatedProspect[key])
        }
    });
    it('delete a prospect from the list', () => {
        const tree = renderer.create(
            <ProspectListScreen jest={{list: prospectListMock}} navigation={arg}/>
        );
        const instance = tree.getInstance();
        var listSize = instance.state.prospectList.length;
        // Set the deletion flag.
        prospectUpdateMock.deleted.value = 1; 

        instance.updateProspectList(prospectUpdateMock);
        var updatedProspectIndex = instance.state.prospectList.findIndex((item) => findProspectById(item, prospectUpdateMock.id.value)); 
         

        // Ensure that the prospectList is updated with the corrects values.
        expect(instance.state.prospectList.length).toBe(listSize - 1);
        expect(updatedProspectIndex).toBe(-1);
    });
    xit('Display an ActivityIndicator on fetching', () => {
        const wrapper = shallow(
            <ProspectListScreen jest={{list: prospectListMock}} navigation={arg}/>
        );
        const wrapper2 = wrapper.setState({isFecthing: true});
        //console.log(wrapper2);
        expect(wrapper2.contains(ActivityIndicator)).toBe(true);
    });
});