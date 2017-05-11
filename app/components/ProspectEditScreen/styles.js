import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	
	container: {
		flex: 1,
		backgroundColor: "white",
	},

	headerWrapper: {
		flex: 0.05,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5,
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
	},

	input: {
		flex: 1,
	
	},

	scroll: {
		borderWidth: 2,
    	borderColor: '#CCCC',
	},

	icon: {
		height: 30,
		width: 30,
		backgroundColor: "#1F94B7",
	},

});