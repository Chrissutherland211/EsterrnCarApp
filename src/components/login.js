import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,Dimensions,Alert,
  Text,Linking,TextInput,StatusBar,KeyboardAvoidingView,
  View,Image,Button,TouchableHighlight,ScrollView,AsyncStorage,TouchableWithoutFeedback,Keyboard
} from 'react-native';
// import { Navigation } from 'react-native-navigation';
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay';
import {appName,headerlogo} from '../constant/const';
import Api from '../Api/Api';
import CarApi from '../Api/Api';
import * as Actions from '../redux/actions';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {CAR_API_ENDPOINT} from '../constant/const';
var width,height;
var commanWidth,commanHeight;

class login extends Component {

  static options(passProps) {
      return {
        topBar: {
          drawBehind: true,
          visible: false,
          animate: false
        },
        statusBar: {
          backgroundColor: '#0d253c',
          drawBehind: true,
        },
      };
  }

  constructor(props){
    height = Dimensions.get('window').height;
    width = Dimensions.get('window').width;
    super(props);
    this.state={
      username : '',
      password:'',
      deviceId:'',
    }
    commanWidth = width - 45;
    commanHeight = 45;
  }
  componentDidMount() {
    const {setUserData} = this.props;
    const deviceId = DeviceInfo.getDeviceId();
    setUserData(deviceId)
    
  }

  onRegister(){
    console.log("===========DO LOGGING=========")
    // const {setUserData} = this.props;
    var that = this;
    if(this.state.username != ''){
      if(this.state.password != ''){
        this._modalLoadingSpinnerOverLay.show();
      //  alert(JSON.stringify(this.props))
      // var obj = {   
      //   "method": "login",       
      //   "device_id": "AC56C002-B5D0",
      //   "username": this.state.username,
      //   "password": this.state.password

      // }

      // console.log("== LOG IN=="+JSON.stringify(obj)) 

      // axios({
      //   method: 'post',
      //   url: CAR_API_ENDPOINT,
      //   headers: {"Content-Type":"application/json"},
      //   data: obj
      // })
      // .then(res => {
      // console.log("===========DO LOGIN========="+res.data.status)
      //   AsyncStorage.setItem('@AccessToken', data.password);
      //   AsyncStorage.setItem('@password', data.password);
      //   that.props.navigation.navigate('HomeScreen')
        
      // })
      // .catch(err => {
        
      //   console.log("===========DO LOGIN ERROR========="+err)
      // });
        Api.doLogin(this, this.state.username, this.state.password, function(parent, data){
          
            parent._modalLoadingSpinnerOverLay.hide();
            // alert(JSON.stringify(data));
            if(data.error == '1'){
              
            }else{
                console.log('------ doLogin response --- '+ JSON.stringify(data));
                if(data.status == true){
                    try {
                      // alert(JSON.stringify(data))
                      AsyncStorage.setItem('@AccessToken', data.password);
                      AsyncStorage.setItem('@password', data.password);
                      // setUserData(data)
                      // AsyncStorage.setItem('@deviceId', data.body.user.id_driver_car.toString());
                      // AsyncStorage.setItem('@code', data.body.user.code.toString());
                      // AsyncStorage.setItem('@user_id', data.body.user.id_user.toString());
                      // AsyncStorage.setItem('@driver_name', data.body.user.first_name.toString() + " " + data.body.user.last_name.toString());
                    } catch (error) {
                      // alert('error - ' + error);
                      
                    }
                    
                    that.props.navigation.navigate('HomeScreen')
                }else{
                  // Alert.alert(appName,data.error);
                }

            }
        });
      }else{
        alert('Please add valid password!');
      }
    }else{
      alert('Please add valid name!');
    }
  }
  render(){
      return (       
        <ScrollView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
            <LoadingSpinnerOverlay style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} ref={ component => this._modalLoadingSpinnerOverLay = component } />
                <View style={{alignItems: 'center',justifyContent:'center',backgroundColor:'transparent'}}>
                   <Image style={{width: 250, height: 200}} source={headerlogo} resizeMode="contain" />
                </View>
                <TextInput
                        style={[{width:commanWidth,height:commanHeight,marginTop:10},styles.textInput]}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                        placeholder='Username'
                      />
                <TextInput
                        style={[{width:commanWidth,height:commanHeight,marginTop:10},styles.textInput]}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        placeholder='password'
                        secureTextEntry={true}
                      />
                           <View style={{flex:0.3}}>
                  <TouchableHighlight style={{width:commanWidth,height:commanHeight,borderRadius: 25,alignSelf: 'center',justifyContent:'center',marginTop:30,backgroundColor:'#fad343'}} underlayColor='transparent' onPress={() => { this.onRegister(); }}>
                        <Text style={{textAlign: 'center',fontSize: 16,color: '#0d253c',fontWeight: 'bold'}} >REGISTER DEVICE</Text>
                 </TouchableHighlight>
              </View>
                    <View style={{flex:0.3,alignSelf: 'center',justifyContent:'center',marginTop:30,backgroundColor:'transparent'}}>
                      <Text style={{padding: 4,textAlign: 'center',fontSize: 12,color: '#FFF'}} >{'If you do not know your username/password,\nget in touch with dispatch'}</Text>
                    </View>
            </View>
        </TouchableWithoutFeedback>
    </ScrollView>
      );
  }
}
const styles = StyleSheet.create({
  textInputView : {flex:0.2,backgroundColor: 'transparent',alignItems: 'center',justifyContent:'center'},
  textInput : {
    backgroundColor:'#fff',
    color:'#000',
    borderRadius:25,
    paddingLeft:12,
    paddingRight:12,
    paddingTop:8,
    paddingBottom:8,
    fontSize:15,
  },
  container: {
    flex: 1,
    backgroundColor:'#0d253c'
},
inner: {
    padding: 24,
},
header: {
    fontSize: 36,
    marginBottom: 48,
},
input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
},
btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
},

});
function mapStateToProps({ LoginApp }) {
  return {
    user: LoginApp
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setUserData: Actions.setUserData,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(login);
