import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	
	container: {
		flex: 1,
	},

	fontBasic: {
		color: 'black',
		fontSize: 12,
  	},

  	fontMedium: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 15,
  	},

  	allCentered: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},


  	logoWrap: {
    	flex: 0.4,
        //padding: 30,
  	},
	
	logo: {
		flex: 1,
    	width: null,
    	height: null,
  	},

	wrapper: {
		flex: 0.5,
    	padding: 30,
  	},

  	inputWrap: {
    	flexDirection: 'row',
    	marginVertical: 10,
    	height: 40,
    	borderBottomWidth: 1,
    	borderBottomColor: '#CCCC',
  	},

  	iconWrap: {
    	paddingHorizontal: 7,
    	alignItems: 'center',
    	justifyContent: 'center',
  	},

  	icon: {
    	height: 20,
    	width: 20,
  	},

  	input: {
    	flex: 1,
    	paddingHorizontal: 10,
  	},

});