// styles.js
import { StyleSheet } from 'react-native';


const primaryColor = '#1E3A8A';
const secondaryColor = '#60A5FA';
const textColorDark = '#FFFFFF';
const textColorLight = '#1E293B';
const backgroundColor = '#D9D9E2';

const accentColor = '#22C55E';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: backgroundColor,
    },
    heading: {
        color: textColorDark,
        fontSize: 22,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20,
        color: textColorLight,
    },
    scannerBox: {
        height: 300,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 10,
        marginVertical: 20,
    },
    scanner: {
        flex: 1,
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 10,
        color: textColorLight,
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: primaryColor,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 3, // for subtle shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonGroupButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D4D4D4',
        marginVertical: 5,
        alignItems: 'flex-start',
    },
    selectedButtonGroupButton: {
        backgroundColor: secondaryColor,
        color: textColorDark,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 0,
    },
    buttonGroupText: {
        color: textColorLight,
        textAlign: 'left',
        fontSize: 16
    },
    selectedButtonGroupText: {
        color: textColorDark,
        textAlign: 'left',
        fontSize: 16
    },
    errorText:{
        color: 'red',
        fontSize: 16,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    listItemTitle: {
        color: textColorLight,
        fontSize: 16,
    },
    listItemSubtitle: {
        color: '#6B7280',
        fontSize: 16
    },
    listItemContainer: {
        backgroundColor: '#FFFFFF',
        marginVertical: 3,
        borderRadius: 8,
         borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerStyle: {
        backgroundColor: primaryColor,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    }
});