import Colors from "./Colors";

const padding = 40;
export default {
    FONT_NAME: 'SVN-Product Sans',
    LAYOUT_PADDING: padding,
    commonContainer: {
        flex: 1
    },
    pageWrapper:{
        justifyContent: 'center',
        paddingLeft: padding,
        paddingRight: padding,
        overflow: 'hidden'
    },
    pageTitle:{
        fontSize: 34,
        fontWeight: 'bold',
        color: Colors.TEXT_DARK,
        fontFamily: this.FONT_NAME
    },
    textField: {
        borderBottomColor: Colors.SILVER_LIGHT,
        borderBottomWidth: 1,
        //backgroundColor: 'yellow',
        padding: 0,
        position: 'relative',
        marginBottom: 10
    },
    textFieldHasIcon: {
        paddingLeft: 20
    },
    textFieldLabel: {
      fontSize: 15,
      color: Colors.TEXT_DARK,
        fontFamily: this.FONT_NAME
    },
    textFieldInput: {
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
        height: 50,
        fontSize: 15,
        fontFamily: this.FONT_NAME
    },
    textFieldIconWrapper: {
        position: 'absolute',
        height: 50,
        top: 0,
        //backgroundColor: 'yellow',
        flex: 1,
        justifyContent: 'center',
        width: 15
    },
    textFieldIcon: {
        fontSize: 18,
        color: Colors.SILVER
    }
}