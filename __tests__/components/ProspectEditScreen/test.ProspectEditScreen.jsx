import 'react-native';
import React from 'react';
import { ProspectEditScreen } from '../../../app/components/ProspectEditScreen/ProspectEditScreen'

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

var prospectMock = require('./prospectMock.json');

afterEach(() => {
  // Reload the default configuration after each test.
  arg = {
		state: {
			params:{
				item:null,
			}
		}
	}
});



describe('ProspectEditScreen', () => {
    it('renders without crashing', () => {
    	const tree = renderer.create(
    		<ProspectEditScreen navigation={arg}/>
    	);
    });
    it('renders without prospect infos', () => {
    	const tree = renderer.create(
    		<ProspectEditScreen navigation={arg}/>
    	);
    	const instance = tree.getInstance();
    	// Because the arg passed to the component doesn't have any item,
    	// we expect the state[key] of the instance to be set to null.
    	for (key in prospectMock.name_value_list) {
				expect(instance.state[key]).toBeNull();
		}
 	});
    it('renders with prospect info', () => {
    	arg.state.params.item = prospectMock;
    	const tree = renderer.create(
    		<ProspectEditScreen navigation={arg}/>
    	);

    	const instance = tree.getInstance();
		for (key in prospectMock.name_value_list) {
			
			// If the value is set then we expect to find it in the component state.
			if(prospectMock.name_value_list[key].value){
				expect(instance.state[key]).toBe(prospectMock.name_value_list[key].value);
			}
			// Otherwise, the value should be set to null.
			else {
				expect(instance.state[key]).toBeNull();
			}
		}
    });
    it('is editable by default on creation of prospect', () => {
    	const tree = renderer.create(
    		<ProspectEditScreen navigation={arg}/>
    	);
    	const instance = tree.getInstance();
		expect(instance.state.isEditable).toBeTruthy();
 	});
 	it('is not editable by default on consultation of prospect', () => {
    	arg.state.params.item = prospectMock;
    	const tree = renderer.create(
    		<ProspectEditScreen navigation={arg}/>
    	);
    	const instance = tree.getInstance();
    	expect(instance.state.isEditable).toBeFalsy();
 	});
});