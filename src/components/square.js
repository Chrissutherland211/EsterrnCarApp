import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,Linking,
  View,Image,Button,TouchableHighlight,ScrollView,AsyncStorage
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import {NativeModules} from 'react-native';

class square extends Component {

  constructor(props){
    super(props);
  }
  componentDidMount(){
    // clien's id -- sq0idp-mDsdUkLEDHkOLUhUKgsXeg
    // our id -- sq0idp-8aQ3lVGmdchPjPdGr4Gbyg
    // NativeModules.Square.setApplicationId('sq0idp-mDsdUkLEDHkOLUhUKgsXeg');
  }

  onGoPopup(){
     // NativeModules.Square.getDeviceName((err, name) => console.log('--------------------------> ' + err, name));
     NativeModules.Square.startTransaction(10000, (error) => {
        console.log('----error------------> '+error);
      },
      (success) => {
        console.log('----success------------> '+ success);
      });
  }

  render(){
      return (
        <View style={{ flex: 1,backgroundColor: '#fff',alignItems: 'center',justifyContent:'center' }}>
            <TouchableHighlight style={{borderRadius: 25,alignSelf: 'center',justifyContent:'center',marginTop:30,backgroundColor:'#05bf05'}} underlayColor='transparent' onPress={() => { this.onGoPopup(); }}>
                  <Text style={{textAlign: 'center',fontSize: 16,color: '#FFF',fontWeight: 'bold',padding:20}} >GO!</Text>
            </TouchableHighlight>
        </View>
      );
  }
}
module.exports = square;
