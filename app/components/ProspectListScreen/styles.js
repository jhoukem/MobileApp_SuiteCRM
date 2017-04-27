import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	
	container: {
		flex: 1,
		backgroundColor: "white",
	},

	headerWrapper: {
		flex: 0.05,
		justifyContent: 'space-around',
		padding: 20,
	},

	bodyWrapper: {
		flex: 0.6,
		padding: 10,
	},


	buttonWrapper: {
		flex: 0.05,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 20,
		//backgroundColor: 'black',
	},

	scroll: {
		borderWidth: 2,
    	borderColor: '#CCCC',
	}

});