import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	
	container: {
		flex: 1,
		backgroundColor: "white",
	},

	headerWrapper: {
		flex: 0.04,
		justifyContent: 'center',
		alignItems: 'flex-start',
		padding: 10,
	},

	searchWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
	},

	bodyWrapper: {
		flex: 0.4,
		padding: 20,
	},

	activityIndicator: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	buttonWrapper: {
		flex: 0.1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 20,
		//backgroundColor: 'black',
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