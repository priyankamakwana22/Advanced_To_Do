import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {flex: 1},
    btn: {
      height: 60,
      width: 60,
      borderRadius: 30,
      backgroundColor: '#0080ff',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 10,
      right: 10,
      elevation: 5,
    },
    item: {
      marginHorizontal: 10,
      marginVertical: 7,
      paddingRight: 10,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 5,
    },
    title: {
      color: '#000000',
      fontSize: 30,
      margin: 5,
    },
    subTitle: {
      color: '#000000',
      fontSize: 20,
      margin: 5,
    },
    item_row: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  item_body: {
      flex: 1,
  },
  color: {width: 20, height: 100,borderTopLeftRadius: 10, borderBottomLeftRadius: 10},
  
});
  

  export default styles;