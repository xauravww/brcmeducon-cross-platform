import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {textColor, appcolor} from '../constants';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

export default function TopBar() {
  return (
    <View style={styles.container}>
      <View>
        {/* <Icon name="air" size={25} /> */}
        <Icon2 name="hamburger" size={25} />
      </View>
      <View>
        <Text style={styles.text}>
          BRCM College Of Engineering and Technology
        </Text>
        <Text style={styles.text}>Bahal , Haryana</Text>
      </View>

      <View>
        <Icon2 name="bell" size={25} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appcolor,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  text: {
    color: '#fff',
    // textAlign: 'center',
  },
});
