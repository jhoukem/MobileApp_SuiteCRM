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

describe('ProspectEditScreen', () => {
    it('renders without crashing', () => {
       const tree = renderer.create(
       	<ProspectEditScreen navigation={arg}/>
       	);
    });
});