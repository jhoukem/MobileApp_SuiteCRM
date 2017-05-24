import 'react-native';
import React from 'react';
import { LoginScreen } from '../../../app/components/LoginScreen/LoginScreen'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';


describe('LoginScreen', () => {
    it('renders without crashing', () => {
       const tree = renderer.create(
       	<LoginScreen />
       	);
    });
});

describe('Snapshot testing', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            	<LoginScreen />
        ).toJSON();
    expect(tree).toMatchSnapshot();
    });
});