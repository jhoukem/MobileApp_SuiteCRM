import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	
	mainStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},


	navigator: {
		backgroundColor: '#1F94B7',
		borderBottomWidth: 1,
	},


	fontNavBar: {
	  color: 'white',
	  fontSize: 20,
	  fontWeight: 'bold',
	  backgroundColor: "rgba(0,0,0,0)",
  	},

	fontBasicDefault: {
	  color: 'black',
	  fontSize: 12,
	  backgroundColor: "white",
  	},

  	fontBasicMedium: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 15,
		backgroundColor: "white",
  	},

	fontBasicBig: {
		color: 'black',
		fontSize: 20,
		//fontWeight: 'bold',
		backgroundColor: "white",
	},

	fontBasicNote: {
		color: 'grey',
		fontSize: 15,
		backgroundColor: "white",
	},
  	
  	fontBasicError: {
		color: 'red',
		fontSize: 15,
		backgroundColor: "white",
  	},

});