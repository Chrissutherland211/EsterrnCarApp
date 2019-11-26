import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,Linking,
  View,Image,Button,TouchableHighlight,ScrollView,AsyncStorage,
  TouchableOpacity
} from 'react-native';

import {headerlogo} from '../constant/const';

import * as Actions from '../redux/actions';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class splash extends Component {

  static options(passProps) {
      return {
        topBar: {
          drawBehind: true,
          visible: false,
          animate: false
        },
        statusBar: {
          backgroundColor: '#ffffff',
          drawBehind: true,
        },
      };
  }

  constructor(props) {
    super(props)    
 }
  goLoginPage = () => {
    
    this.props.navigation.navigate('LoginScreen');
    return;
  }
  goHomePage = () => {
    this.props.navigation.navigate('HomeScreen');
    return;
  }
  async componentDidMount() {
    var that = this;
    const {setSplashData} = this.props
    // AsyncStorage.clear();
    AsyncStorage.getItem('@AccessToken')
      .then(token => {
        var screenName = 'login';
        if(token == null){
          screenName = 'login';
          setTimeout(function() {
            that.props.navigation.navigate('HomeScreen')          
          }, 500);          
        }else{
          screenName = 'home';
          setTimeout(function() {           
            that.props.navigation.navigate('HomeScreen')
            
          }, 500); 
        }
        
      })
    .catch(error => console.log(error));
  }

  render(){
      return (

        <View style={{ flex: 1,backgroundColor: '#040404',alignItems: 'center',justifyContent:'center' }}>            
            <Image style={{width: 250, height: 400}} source={headerlogo} resizeMode="contain" />              
        </View>

      );
  }
}
function mapStateToProps({ SplashApp }) {
  return {
    spash: SplashApp
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSpashData: Actions.setSpashData,
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(splash);
