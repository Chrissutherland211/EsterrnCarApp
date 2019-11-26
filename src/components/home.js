import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,Dimensions,FlatList,NativeModules,
  Text,Linking,TextInput,StatusBar,AppState,Alert,
  View,Image,Button,TouchableHighlight,ScrollView,AsyncStorage
} from 'react-native';
// import { Navigation } from 'react-native-navigation';
import MapView, {Marker} from 'react-native-maps';
import Modal from "react-native-modal";
import axios from 'axios';
// import { Dropdown } from 'react-native-material-dropdown';
import Checkbox from 'react-native-modest-checkbox'
import {appName,homeheaderlogo,headerHeight,headerBackColor,API_ENDPOINT} from '../constant/const';
// import CheckBox from 'react-native-checkbox';
import io from 'socket.io-client';
import { BackHandler, DeviceEventEmitter } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Api from '../Api/Api';
import {CAR_API_ENDPOINT} from '../constant/const';
import MapViewDirections from 'react-native-maps-directions';
import Geocode from "react-geocode";
import TextFit from "react-native-textfit"
import Sound from 'react-native-sound';
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown';
import CheckBox from 'react-native-check-box'
import Geolocation from '@react-native-community/geolocation';
import * as Actions from '../redux/actions';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Dropdown } from 'react-native-material-dropdown';
import Reinput from 'reinput'


// const origin = {latitude: 23.0350, longitude: 72.5293};
// const destination = {latitude: 23.0120, longitude: 72.5108};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAvn6N_9AZXiYeZTAYgsRnGHPvYW5g9ar0';
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(GOOGLE_MAPS_APIKEY);
// Enable or disable logs. Its optional.
Geocode.enableDebug();
var session;
var flag = 0
var {width, height} = Dimensions.get('window')
var ASPECT_RATIO = width / height
var LATITUDE_DELTA = 0.0922
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
var soundVariable;
var bottomViewHeight = height/3;
var modalWidth;
var userpassword;
var currentDateTime;
var currentDateTimetype;
var BLUE = "#428AF8";
var InfoDataSet=[
  {'name': 'JOB NUMBER', 'value': '9'},
  {'name': 'PICK UP TYPE', 'value': '1'},
  {'name': 'PICK UP TIME', 'value': '2'},
  {'name': 'SERVICE TYPE', 'value': '3'},
  {'name': 'JOB STATUS', 'value': '4'},
  {'name': 'CHILD SEAT', 'value': '5'},
  {'name': 'PET', 'value': '6'},
  {'name': 'PICK UP LOCATION', 'value': '7'},
  {'name': 'DESTINATION', 'value': '8'}
];
var PriceDataSet=[
  {'name': 'FARE', 'value': '9'},
  {'name': 'TIPS', 'value': '1'},
  {'name': 'TOLLS', 'value': '2'},
  {'name': 'STOPS', 'value': '3'},
  {'name': 'WAIT TIME', 'value': '4'},
  {'name': 'MEET AND GREET', 'value': '5'},
  {'name': 'CHILD SEAT', 'value': '6'},
  {'name': 'OTHER', 'value': '7'},
  {'name': 'DISCOUNT', 'value': '8'},
  {'name': 'SUB TOTAL', 'value': '8'},
  {'name': 'SURCHARGE', 'value': '8'},
  {'name': 'TAX', 'value': '8'},
  {'name': 'TOTAL', 'value': '8'}
];
class home extends Component {

  static options(passProps) {
      return {
        topBar: {
          drawBehind: true,
          visible: false,
          animate: false
        },
        statusBar: {
          backgroundColor: '#004587',
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
      onDutyTabColor:'#e40000',
      isOnDuty:false,
      onDutyTabText:'OFF DUTY',
      onDutyTabTextColor:'#f28080',
      lat:0,
      lng:0, 

      passenger:'',
      pickup:'',
      dropoff:'',
      telephone:'',
      pickupRate:'',
      popupState:false,
      popup_id:'',

      job_id:0,
      code:'',
      drivername:'',
      origin:{latitude: 0, longitude: 0},
      destination:{latitude: 0, longitude: 0},

      isModalVisible:true,
      Childseats:false,
      Delivery:false,

      showJobUpdate:false,
      jobAccepted:false,
      isPickupJob:false,
      showPaymentView:false,
      showSMSCall:false,

      showMap:true,
      showMenu:false,
      showHistory:false,
      showLogout:false,
      historyData:[],

      isChildSeatChecked:false,
      isDeliveryChecked:false,
      job_offer_id:'',
      setIntervalTime:15000,
      allowPet:0,
      allowChildren:"",

      isConfirmJob:false,
      onShowMapMark:false,
      isPaymentConfirm:false,
      TipPrice:'',
      amountPay:'',

      onShowJobDetailValue:false,
      onShowListJob:false,
      tapColor:headerBackColor,
      onShowInfoValue:true,
      onShowPriceValue:false,
      onShowNotesValue:false,

      pick_up_type:'',
      pick_up_time:'',
      service_type:'',
      job_status:'',
      child_seat:'',
      pet:'',
      cashPaymentState:false,
      jobHistoryData:'',

      
    }
    commanWidth = width - 45;
    commanHeight = 45;
    modalWidth = width*85/100;
    session = this;
    // Enable playback in silence mode
    Sound.setCategory('Playback');
    // this.onHistory();
  }
  async componentDidMount() {

    clearInterval(this.interval);

    soundVariable = new Sound('tone.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        
        
        alert(JSON.stringify(error))
        return;
      }

    });


    AsyncStorage.getItem('@code')
      .then(value => {
        // alert(value);
        session.setState({code:value});
      })
    .catch(error => console.log(error));
    AsyncStorage.getItem('@driver_car_id')
      .then(value => {
        driver_car_id = value;
      })
    .catch(error => console.log(error));
    AsyncStorage.getItem('@user_id')
      .then(value => {
        user_id = value;
      })
    .catch(error => console.log(error));
    AsyncStorage.getItem('@password')
    .then(value => {
      // alert(value)
      userpassword = value;
    })
  .catch(error => console.log(error));
    AsyncStorage.getItem('@driver_name')
      .then(value => {
        session.setState({drivername:value});
        drivername = value;
      })
    .catch(error => console.log(error));
    
    if(this.state.isOnDuty){
      this.setState({isOnDuty:true,onDutyTabColor:'#05bf05', onDutyTabText:'ON DUTY', onDutyTabTextColor:'#82df82'})
    }else{
      this.setState({isOnDuty:false,onDutyTabColor:'#e40000', onDutyTabText:'OFF DUTY', onDutyTabTextColor:'#f28080'})
    }

  }

  onDropDownChangeText(value,index){
    this.setState({allowPet:index})
  }
  onChildrenDropDownChangeText(value,index){
    if (index == 0){
      this.setState({allowChildren:"0"})
    } else if (index == 1) {
      this.setState({allowChildren:"1B"})
    } else if (index == 2) {
      this.setState({allowChildren:"1I"})
    } else if (index == 3) {
      this.setState({allowChildren:"1T"})
    } else if (index == 4) {
      this.setState({allowChildren:"TBI"})
    } else if (index == 5) {
      this.setState({allowChildren:"1I1B"})
    } else if (index == 6) {
      this.setState({allowChildren:"1T1B"})
    } else if (index == 7) {
      this.setState({allowChildren:"1T1I"})
    } else if (index == 8) {
      this.setState({allowChildren:"2B"})
    } else if (index == 9) {
      this.setState({allowChildren:"2I"})
    } else if (index == 10) {
      this.setState({allowChildren:"2T"})
    } else if (index == 11) {
      this.setState({allowChildren:"2T1I"})
    } else if (index == 12) {
      this.setState({allowChildren:"2T1B"})
    } else if (index == 13) {
      this.setState({allowChildren:"2B1T"})
    } else if (index == 14) {
      this.setState({allowChildren:"2B1I"})
    } else if (index == 15) {
      this.setState({allowChildren:"2I1T"})
    } else if (index == 16) {
      this.setState({allowChildren:"2I1B"})
    } else if (index == 17) {
      this.setState({allowChildren:"3B"})
    } else if (index == 18) {
      this.setState({allowChildren:"3I"})
    } else if (index == 19) {
      this.setState({allowChildren:"3T"})
    } else if (index == 20) {
      this.setState({allowChildren:"3C"})
    } else if (index == 21) {
      this.setState({allowChildren:"23C"})
    } else if (index == 22) {
      this.setState({allowChildren:"33C"})
    } else if (index == 23) {
      this.setState({allowChildren:"TIC"})
    } else if (index == 24) {
      this.setState({allowChildren:"2TIC"})
    } else if (index == 25) {
      this.setState({allowChildren:"3TIC"})
    } else if (index == 26) {
      this.setState({allowChildren:"TBC"})
    } else if (index == 27) {
      this.setState({allowChildren:"2TBC"})
    } else if (index == 28) {
      this.setState({allowChildren:"3TBC"})
    } 
    
  }
  onCancelPopup(){
    this.setState({isModalVisible : false})
  }
  onConfirmPopup(){
    this.setState({showJobUpdate:false,jobAccepted:false,isConfirmJob:false,isPickupJob:false,showPaymentView:true});    
    this.onUpdateJob(3);
    flag = 1
    this.onChangeDuty()
  }
  onConfirmDeclinePopup(){
    this.setState({showJobUpdate:false,jobAccepted:false,isConfirmJob:false,isPickupJob:false,showPaymentView:false});
    // this.onUpdateJob(6);
    
  }
  onGoCash(){
    // this.setState({showJobUpdate:true,jobAccepted:true,isConfirmJob:false,isPickupJob:true});
    var that = this
    this.getCurrentLocation('first');
    setTimeout(function() {
      that.onGoPopup()
    }, 500);
  }
  onGoPopup(){  
    
    AsyncStorage.getItem('@password').then(pass => {
      var currentPosition = this.state.lat+","+this.state.lng     
  
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours()-4; //Current Hours
      if (hours<0){
        hours = 24 + hours
        date = date - 1
      }
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds
      currentDateTime = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec
      currentDateTimetype = year + '-' + month + '-' + date
    var obj = {"device_id": "AC56C002-B5D0",
                "password": pass,
                "position": currentPosition,
                "method": "set_service_info",
                "set_service_info": {
                  "on_duty": true,
                  "meet_greet": true,
                  "delivery": this.state.isDeliveryChecked,
                  "pets": this.state.allowPet,
                  "ezpass": true,
                  "childseats": this.state.allowChildren
                  },
                "update_time":currentDateTime}  
      console.log("==service-requests=="+JSON.stringify(obj)) 
          
      axios({
            method: 'post',
            url: CAR_API_ENDPOINT,
            headers: {"Content-Type":"application/json"},
            data: obj
          })
          .then(res => {
            console.log("===========Go Servivce========="+res.data.status)
            // alert()
            // alert("success")
    
          })
          .catch(err => {
            
          });
        var cangoObj = {
          "device_id": "AC56C002-B5D0",
          "password": pass,
          "position": currentPosition,
          "method": "can_go_on_duty",
          "update_time": currentDateTime
          }
          console.log("===========Can Go On Duty Requests========="+JSON.stringify(cangoObj))
          axios({
            method: 'post',
            url: CAR_API_ENDPOINT,
            headers: {"Content-Type":"application/json"},
            data: cangoObj
          })
          .then(res => {
            console.log("===========Can Go On Duty Response========="+res.data.status)
            // alert()
            // alert("success")
    
          })
          .catch(err => {
            
          });
    this.setState({isModalVisible : false})
    if(!this.state.isOnDuty){
      this.onChangeDuty()
    }
        
  })
  }
  _renderModalContent = () => (
      <View style={{width:modalWidth, height:height*60/100, backgroundColor: "white", borderRadius: 4, borderColor: "rgba(0, 0, 0, 0.1)"}}>
          {/*--- header part ----*/}
          <View style={{flex:0.15,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:headerBackColor}}>
              <View style={{flex: 0.15}}/>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color: "#fff",fontSize:20,padding:8}}>CAR FEATURES</Text>
              </View>
              <TouchableHighlight style={{flex: 0.15,alignItems: 'center',justifyContent:'center',backgroundColor:'transparent'}} underlayColor='transparent' onPress={() => { this.onCancelPopup(); }}>
                <Image style={{width: 20, height: 20}} source={require('../img/cancel.png')} resizeMode="contain" />
              </TouchableHighlight>
          </View>
          {/*--- bottom part ----*/}
          <View style={{flex:0.6,flexDirection: 'column',justifyContent:'center',backgroundColor:'transparent'}}>
              <View style={{flex:0.1}}/>
              {/* Allow pets*/}
              <View style={{flex:0.3,flexDirection: 'row',marginRight:12,marginLeft:12}}>
                  <View style={{width:modalWidth*25/100,justifyContent:'center'}}>
                      <Text style={{fontSize: 14,color: '#000'}} >Allow Pets</Text>
                  </View>
                  <View style={{width:modalWidth*68/100,marginBottom:4,marginLeft:2,justifyContent:'center'}}>
                  {/* <ModalDropdown
                    textStyle={{fontSize:14,padding:4}}
                    dropdownStyle={{flex:1,padding:2}}
                    dropdownTextStyle={{width:modalWidth*66/100,height:55,fontSize:14}}
                    options={['No', 'Yes (Must be Accompanied)', 'Yes (Pet can ride alone)']}
                    onSelect={(index,val) => this.onDropDownChangeText(index,val)}/> */}
                     <Dropdown                       
                       data={[{
                        value: 'No',
                      }, {
                        value: 'Yes(Must be Accompanied)',
                      }, {
                        value: 'Yes(Pet can ride alone)',
                      }]}
                      // onValueChange={alert()}
                      onChangeText={(value,index) => this.onDropDownChangeText(value,index)}
                     />
                  </View>
              </View>
              {/*Childseats*/}
              <View style={{flex:0.3,flexDirection: 'row',marginRight:16,marginLeft:16}}>
                  <View style={{width:modalWidth*25/100,justifyContent:'center'}}>
                      <Text style={{fontSize: 14,color: '#000'}} >Childseats</Text>
                  </View>
                  <View style={{width:modalWidth*68/100,marginBottom:4,marginLeft:2,justifyContent:'center'}}>
                  
                     <Dropdown                       
                       data={[{
                        value: 'None',
                      }, {
                        value: '1 Booster',
                      }, {
                        value: "1 Infant",
                      },
                      {
                        value: "1 Toddler",
                      },
                      {
                        value: "Toddler,Booster,Infant",
                      },
                      {
                        value: "1 Infant & 1 Booster",
                      },
                      {
                        value: "1 Toddler & 1 Booster",
                      },
                      {
                        value: "1 Toddler & 1 Infant",
                      },
                      {
                        value: "2 Booster",
                      },
                      {
                        value: "2 Infant",
                      },
                      {
                        value: "2 Toddler",
                      },
                      {
                        value: "2 Toddler, 1 Infant",
                      },
                      {
                        value: "2 Toddler, 1 Booster",
                      },
                      {
                        value: "2 Booster, 1 Toddler",
                      },
                      {
                        value: "2 Booster, 1 Infant",
                      },
                      {
                        value: "2 Infant, 1 Toddler",
                      },
                      {
                        value: "2 Infant, 1 Booster",
                      },
                      {
                        value: "3 Booster",
                      },
                      {
                        value: "3 Infant",
                      },
                      {
                        value: "3 Toddler",
                      },
                      {
                        value: "1 3-in-1",
                      },
                      {
                        value: "2 3-in-1",
                      },
                      {
                        value: "3 3-in-1",
                      },
                      {
                        value: "1 Tod/Inf Combo",
                      },
                      {
                        value: "2 Tod/Inf Combo",
                      },
                      {
                        value: "3 Tod/Inf Combo",
                      },
                      {
                        value: "1 Tod/Bos Combo",
                      },
                      {
                        value: "2 Tod/Bos Combo",
                      },
                      {
                        value: "3 Tod/Bos Combo",
                      },
                    ]}
                      // onValueChange={alert()}
                      onChangeText={(value,index) => this.onChildrenDropDownChangeText(value,index)}
                     />
                  </View>
              </View>
              {/*Delivery*/}
              <View style={{flex:0.3,flexDirection: 'row',marginRight:16,marginLeft:16}}>
                  <View style={{width:modalWidth*25/100,justifyContent:'center'}}>
                      <Text style={{fontSize: 14,color: '#000'}}>Delivery</Text>
                  </View>
                  <View style={{width:modalWidth*70/100,alignItems:'flex-end',justifyContent:'center'}}>
                    <CheckBox
                          style={{flex: 1, padding: 10}}
                          onClick={()=>{
                               this.setState({
                                   isDeliveryChecked:!this.state.isDeliveryChecked
                               })
                             }}
                          isChecked={this.state.isDeliveryChecked}
                          checkedImage={<Image source={require('../img/checkbox_selected.png')} style={{width:40,height:40}}/>}
                          unCheckedImage={<Image source={require('../img/checkbox.png')} style={{width:40,height:40}}/>}
                      />
                  </View>
              </View>
              <View style={{flex:0.1}}/>
          </View>
          {/*--- bottom button ---*/}
          <View style={{flex:0.3}}>
              <TouchableHighlight style={{width:width-80,height:50,borderRadius: 25,alignSelf: 'center',justifyContent:'center',marginTop:30,backgroundColor:'#05bf05'}} underlayColor='transparent' onPress={() => { this.onGoCash(); }}>
                    <Text style={{textAlign: 'center',fontSize: 16,color: '#FFF',fontWeight: 'bold'}} >GO!</Text>
              </TouchableHighlight>
          </View>
      </View>
  );
  _renderConfirmModalContent = () => (
    <View style={{width:modalWidth, height:height*30/100, backgroundColor: "white", borderRadius: 4, borderColor: "rgba(0, 0, 0, 0.1)"}}>
        {/*--- header part ----*/}
        <View style={{flex:0.3,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:headerBackColor}}>
            <View style={{flex: 0.15}}/>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color: "#ffff00",fontSize:20,padding:8}}>CONFIRM PICKUP</Text>
            </View>
            
        </View>

        {/*--- bottom button ---*/}
        
        <View style={{flex: 0.4,flexDirection:'row',alignItems: 'center',marginTop:35, justifyContent: "center"}}>
            <View style={{flex:0.1}}/>
              <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#e40000'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onConfirmDeclinePopup(); }}>
                <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>DECLINE</Text>
              </TouchableHighlight>              
            <View style={{flex:0.05}}/>
              <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#05bf05'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onConfirmPopup(); }}>
                <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>ACCEPT</Text>
              </TouchableHighlight>
            <View style={{flex:0.1}}/>
          </View>
        
        
    </View>
);
_renderConfirmPaymentModalContent = () => (
  <View style={{width:modalWidth, height:height*60/100, backgroundColor: "white", borderRadius: 4, borderColor: "rgba(0, 0, 0, 0.1)"}}>
        {/*--- header part ----*/}
        <View style={{flex:0.2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:headerBackColor}}>
            
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color: "#ffff00",fontSize:20,padding:8}}>Submit Payment?</Text>
            </View>
            
        </View>

        <View style={{flex: 0.6, flexDirection:'column'}}>
          <View style={{flex:1,flexDirection:'row', marginTop:10}}>
            <View style={{flex:0.5}}>
              <Text style={{color: "#000000",fontSize:20,textAlign: 'right'}}>Amount Owed:</Text>
            </View>
            <View style={{flex:0.5}}>
              <Text style={{color: "#000000",fontSize:20,textAlign: 'center'}}>{this.state.cashPaymentState ? this.state.pickupRate - 5 - this.state.congestionTax : this.state.pickupRate - this.state.congestionTax}$</Text>
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row', marginTop:10}}>
            <View style={{flex:0.5,textAlign: 'right'}}>
              <Text style={{color: "#000000",fontSize:20,textAlign: 'right'}}>Add Tip:</Text>
            </View>
            <View style={{flex:0.5,alignItems:'center'}}>
              <TextInput  
                style={{width:modalWidth/3,height:height*6/100, borderColor: 'gray', borderWidth: 1,borderRadius:4}} 
                                     
                onChangeText={(TipPrice) => this.setState({TipPrice})}
                value={this.state.TipPrice}                
              />
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row', marginTop:10}}>
            <View style={{flex:0.5,textAlign: 'right'}}>
              <Text style={{color: "#000000",fontSize:20,textAlign: 'right'}}>Amount to Pay:</Text>
            </View>
            <View style={{flex:0.5,alignItems:'center'}}>
              <TextInput   
                  style={{width:modalWidth/3,height:height*6/100, borderColor: 'gray', borderWidth: 1,borderRadius:4}} 
                  selectionColor = {BLUE}                                               
                  onChangeText={(amountPay) => this.setState({amountPay})}
                  value={this.state.amountPay}                
              />
            </View>
          </View>
        </View>
        
        <View style={{flex: 0.4,flexDirection:'row',alignItems: 'center',marginTop:10, justifyContent: "center"}}>
            <View style={{flex:0.1}}/>
              <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#e40000'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onPaymentDecline(); }}>
                <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>DECLINE</Text>
              </TouchableHighlight>              
            <View style={{flex:0.05}}/>
              <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#05bf05'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onPaymentSubmit(); }}>
                <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>ACCEPT</Text>
              </TouchableHighlight>
            <View style={{flex:0.1}}/>
          </View>
        
        
    </View>
);
  onPaymentSubmit(){
    flag = 0
    this.onChangeDuty(); 
    this.setState({showJobUpdate:true,jobAccepted:true,isConfirmJob:false,showPaymentView:false,isPickupJob:true,isPaymentConfirm:false});
  }
  onPaymentDecline(){
    this.setState({showJobUpdate:true,jobAccepted:true,isConfirmJob:false,showPaymentView:false,isPickupJob:true,isPaymentConfirm:false});    
    this.onUpdateJob(6)
  }
  onChangeDuty(){
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    var isDriverOnDuty;
    if (flag == 0){
      if(this.state.isOnDuty){
        isDriverOnDuty = false;
        this.setState({isOnDuty:false,onDutyTabColor:'#e40000', onDutyTabText:'OFF DUTY', onDutyTabTextColor:'#f28080'})
      }else{
        isDriverOnDuty = true;
        this.setState({isOnDuty:true,onDutyTabColor:'#05bf05', onDutyTabText:'ON DUTY', onDutyTabTextColor:'#82df82'})
      }
    }
    // alert(isDriverOnDuty)
    if(isDriverOnDuty){
      
      this.interval = setInterval(() => {
                    
                    session.getCurrentLocation('repeat');
                    // alert()
                 }, this.state.setIntervalTime)  // 1000 = 1 sec
    }else{
        clearInterval(this.interval);
    }
  }
  getCurrentLocation(from){
    
    // this.setState({showMenu:false,showHistory:true});
    // this.setState({showJobUpdate:false,jobAccepted:false,isConfirmJob:false,isPickupJob:false,showPaymentView:true}); 
    // const {getJobOffer} = this.props
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    }).then(function(success) {         
          Geolocation.getCurrentPosition((position) => {              
            
                console.log("=================CURRENT LOCATION=================="+position.coords.latitude+","+position.coords.longitude)
                session.setState({lat : position.coords.latitude, lng: position.coords.longitude});
                // alert( position.coords.latitude)
                AsyncStorage.getItem('@password').then(pass => {
                  
                  var obj = {   
                    "device_id": "AC56C002-B5D0",  
                    "password": pass,
                    "position": position.coords.latitude+","+position.coords.longitude,
                    "method": "driver_info",
                    "job_no":this.state.job_id,
                    "date": currentDateTimetype,
                    "update_time":currentDateTime
                  }
              
                  console.log("== GET DRIEVER INFO=="+JSON.stringify(obj)) 
              
                  axios({
                    method: 'post',
                    url: CAR_API_ENDPOINT,
                    headers: {"Content-Type":"application/json"},
                    data: obj
                  })
                  .then(res => {
                    session.setState({code:res.data.driver_info.dispatch_id})
                    console.log("===========GET DRIVER INFO========="+res.data.status)
                    // console.log("***************Redux Driver Data***********"+this.props.jobDetail)

                    // getJobOffer(res.data)
                    
                  })
                  .catch(err => {
              
                  });
                })
                if(this.state.showMap){
                  session.map.animateToRegion({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      });
                }
                if(from === 'repeat'){
                  session.sendDriverLocation(position.coords.latitude,position.coords.longitude,position.coords.accuracy);
                  
                }
            }, error => {
              this.getCurrentLocation('first');
      
            },{enableHighAccuracy: false});
        }.bind(this)
    ).catch((error) => {
      // alert(error)
    
    });

    DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
        // console.log('-------DeviceEventEmitter----->' + status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
    });
    BackHandler.addEventListener('hardwareBackPress', () => { //(optional) you can use it if you need it
       //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
       LocationServicesDialogBox.forceCloseDialog();
       // console.log('-------BackHandler----->');
    });
  }
  onSkipJob(){
    isJobCalled = false;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours()-4; //Current Hours
    if (hours<0){
      hours = 24 + hours
      date = date - 1
    }
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    currentDateTime = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec
    AsyncStorage.getItem('@password').then(pass => {
      obj = {
        "device_id": "AC56C002-B5D0",
        "password": pass,
        "update_time": currentDateTime,
        "method": "accept_job_offer",
        "job_offer_id": this.state.job_offer_id,
        "accept": false
        }
        console.log("===========SKIP JOB REQUESTS========="+JSON.stringify(obj))
        axios({
          method: 'post',
          url: CAR_API_ENDPOINT,
          headers: {"Content-Type":"application/json"},
          data: obj
          })
          .then(res => {
          console.log("===========SKIP JOB========="+res.data.status)
          
  
          })
          .catch(err => {
  
          });
    });
    
    this.setState({showJobUpdate:false,jobAccepted:false,isPickupJob:false});
    
  }
  sendDriverLocation(lat,lng,acr){
    // this.setState({showJobUpdate:false,jobAccepted:false,isConfirmJob:false,isPickupJob:false,showPaymentView:true});   
    var that = this;
    console.log(new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1]);
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours()-4; //Current Hours
    if (hours<0){
      hours = 24 + hours
      date = date - 1
    }
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    currentDateTime = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec
    currentDateTimetype = year + '-' + month + '-' + date
    var currentPosition = lat+","+lng
    AsyncStorage.getItem('@password').then(pass => {
      password = pass;
      var obj = {"device_id": "AC56C002-B5D0",
                "password": password,
                "position": currentPosition,
                "update_time":currentDateTime}
                console.log(JSON.stringify(obj))
      
      axios({
            method: 'post',
            url: CAR_API_ENDPOINT,
            headers: {"Content-Type":"application/json"},
            data: obj
          })
          .then(res => {
            // alert(JSON.stringify(res.data))
             
                 
            if (res.data.job_offer){
              soundVariable.play();         
              session.setState({showJobUpdate:true})
              session.setState({pickup:res.data.job_offer.on_demand.job_info.pickup.address+" "+res.data.job_offer.on_demand.job_info.pickup.city+" "+res.data.job_offer.on_demand.job_info.pickup.state}) 
              // session.setState({passenger:res.data.job_offer.on_demand.job_info.pickup.establishment})     
              session.setState({job_id:res.data.job_offer.on_demand.job_info.job_no})   
              session.setState({job_offer_id:res.data.job_offer.on_demand.job_offer_id})         
            }  
            if (res.data.popup[0]) {
              soundVariable.play();         
              session.setState({showJobUpdate:true})
              session.setState({pickup:res.data.popup[0].pick_up_address}) 
              session.setState({popupState:true})
              session.setState({popup_id:res.data.popup[0].call_popup_id})   
              session.setState({job_id:res.data.popup[0].call_id})   
              // session.setState({job_offer_id:res.data.job_offer.on_demand.job_offer_id})
            }
            console.log("===================send per 15s====================="+JSON.stringify(res.data.status));
            if(res.data.error.reason == "Invalid Password"){
              alert("You have to log out! Another driver using your driver account. You have to log in again with other driver account.")
              var that = this
              AsyncStorage.clear();
              that.props.navigation.navigate('LoginScreen')
              session.setState({showLogout:false})
              session.setState({showMap:true})
              if(this.state.isOnDuty == true){
                this.onChangeDuty()
              }
            } 
          })
          .catch(err => {            
            // alert(err);
            console.log(err)
            
          });
 
      if(!this.state.showJobUpdate){
        this.getJobUpdate();
      }
    })
  }
  getJobUpdate(){
  
  }
  getLatLngFromAddress(){
    // Get latidude & longitude from address.
    Geocode.fromAddress(this.state.pickup).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        
        
        var myData = {latitude: lat, longitude: lng}
        session.setState({origin:myData});
      },
      error => {console.error(error); }
    );
    Geocode.fromAddress(this.state.dropoff).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        
        
        var myData = {latitude: lat, longitude: lng}
        session.setState({destination:myData});
      },
      error => {console.error(error);}
    );
    
    
  }
  onUpdateJob(status){
    console.log("------DATA SET-----"+JSON.stringify(InfoDataSet))
    console.log("------PRICE DATA SET-----"+JSON.stringify(PriceDataSet))
    AsyncStorage.getItem('@password')
    .then(value => {
    var currentPosition = this.state.lat+","+this.state.lng
    var updatejobobj = {
      "device_id": "AC56C002-B5D0",
      "password": userpassword,
      "position": currentPosition,
      "method": "update_job",
      "update_job_info": {
      "job_no": this.state.job_id,
      "job_status": status
      },
      "date": currentDateTimetype,
      "update_time": currentDateTime
      }
      // alert(this.state.job_id)
      console.log("------->"+JSON.stringify(updatejobobj))
        axios({
          method: 'post',
          url: CAR_API_ENDPOINT,
          headers: {"Content-Type":"application/json"},
          data: updatejobobj
        })
        .then(res => {
          console.log("===================Updated "+status+"====================="+JSON.stringify(res.data.status)); 
          // alert(JSON.stringify(res.data))
        })
        .catch(err => {            
          console.log("===================Updated "+status+"====================="+err);        
          
        }); 
      })
  }
  onAcceptJob(){
    var that = this;
    const { getJobOffer } = this.props
    AppState.removeEventListener('change', this._handleAppStateChange);
    var currentPosition = this.state.lat+","+this.state.lng
 
    if (this.state.popupState) {
      methodType = "accept_popup"
    } else {
      methodType = "accept_job_offer"
    }
    AsyncStorage.getItem('@password')
    .then(value => {
      // alert(value)
      userpassword = value;
      if (this.state.popupState){
        console.log("===================Detect PopUP====================="); 
        var jobobj = {"device_id": "AC56C002-B5D0",
            "password" : userpassword,                
            "position" : currentPosition,
            "update_time" : currentDateTime,
            "method" : "accept_popup",               
            "popup_id": this.state.popup_id,
             }
      }else{
        console.log("===================Detect Job Offer=====================");
        var jobobj = {"device_id": "AC56C002-B5D0",
            "password" : userpassword,                
            "position" : currentPosition,
            "update_time" : currentDateTime,
            "method" : "accept_job_offer",               
            "job_offer_id": this.state.job_offer_id,
            "accept": true  }
      }      
      
            axios({
              method: 'post',
              url: CAR_API_ENDPOINT,
              headers: {"Content-Type":"application/json"},
              data: jobobj
            })
            .then(res => {          
                // alert(res.data.status)
                console.log("===================Success Accepted====================="+res.status);
                session.setState({showJobUpdate:true,jobAccepted:true,isPickupJob:false});      
            })
            .catch(err => {            
              // alert(err);
              
              
            }); 
            this.onUpdateJob(2)  
        var jobdetailobj = {"device_id": "AC56C002-B5D0",
            "password" : userpassword,                
            "position" : currentPosition,            
            "method" : "get_job_info",               
            "job_no": this.state.job_id,
            "date": currentDateTimetype,
            "update_time" : currentDateTime,
          }
            console.log("-------Job Info requests-------"+JSON.stringify(jobdetailobj))
              
              axios({
                method: 'post',
                url: CAR_API_ENDPOINT,
                headers: {"Content-Type":"application/json"},
                data: jobdetailobj
              })
              .then(res => {
                  console.log("========================Get Job detail===================="+JSON.stringify(res.data.job_info.pricing))
                  total = parseFloat(res.data.job_info.pricing.fare) +
                          parseFloat(res.data.job_info.pricing.tolls_parking) +
                          parseFloat(res.data.job_info.pricing.tip) +
                          parseFloat(res.data.job_info.pricing.stops) +
                          parseFloat(res.data.job_info.pricing.waiting) +
                          parseFloat(res.data.job_info.pricing.meet_greet) +
                          parseFloat(res.data.job_info.pricing.childseat) +
                          parseFloat(res.data.job_info.pricing.other) +
                          parseFloat(res.data.job_info.pricing.tax_congestion) -
                          parseFloat(res.data.job_info.pricing.discount) +
                          parseFloat(res.data.job_info.pricing.tax)
                  // console.log()
                  session.setState({congestionTax:res.data.job_info.pricing.tax_congestion})
                  pickupPlace = res.data.job_info.pickup.address+ ' '+res.data.job_info.pickup.city+" "+res.data.job_info.pickup.state
                  session.setState({passenger:res.data.job_info.passenger_info.name})     
                  session.setState({telephone:res.data.job_info.passenger_info.phone})  
                  session.setState({pickupRate:total}) 
                  session.setState({amountPay:total}) 
                  session.setState({pickup:pickupPlace}) 
                  session.setState({job_id:res.data.job_info.job_no})
                  session.setState({pick_up_type:res.data.job_info.pick_up_type})
                  session.setState({pick_up_time:res.data.job_info.pick_up_time})
                  session.setState({service_type:res.data.job_info.service_type})
                  session.setState({job_status:res.data.job_info.job_status})
                  session.setState({child_seat:res.data.job_info.extras.childseat})
                  session.setState({pet:res.data.job_info.extras.pet})
                  // session.setState({dropoff:res.data.job_info.destination.address+ ' '+res.data.job_info.destination.city+" "+res.data.job_info.destination.state})
                  
                  session.setState({onShowMapMark:true})
                  
                  InfoDataSet= [
                    {'name': 'JOB NUMBER', 'value': this.state.job_id},
                    {'name': 'PICK UP TYPE', 'value': this.state.pick_up_type},
                    {'name': 'PICK UP TIME', 'value': this.state.pick_up_time},
                    {'name': 'SERVICE TYPE', 'value': this.state.service_type},
                    {'name': 'JOB STATUS', 'value': 3},
                    {'name': 'CHILD SEAT', 'value': this.state.child_seat},
                    {'name': 'PET', 'value': this.state.pet},
                    {'name': 'PICK UP LOCATION', 'value': this.state.pickup},
                    {'name': 'DESTINATION', 'value': res.data.job_info.destination.address+ ' '+res.data.job_info.destination.city+" "+res.data.job_info.destination.state}
                 ]
                 PriceDataSet=[
                    {'name': 'FARE', 'value': res.data.job_info.pricing.fare},
                    {'name': 'TIPS', 'value': res.data.job_info.pricing.tip},
                    {'name': 'TOLLS', 'value': res.data.job_info.pricing.tolls_parking},
                    {'name': 'STOPS', 'value': res.data.job_info.pricing.stops},
                    {'name': 'WAIT TIME', 'value': res.data.job_info.pricing.waiting},
                    {'name': 'MEET AND GREET', 'value': res.data.job_info.pricing.meet_greet},
                    {'name': 'CHILD SEAT', 'value': res.data.job_info.pricing.childseat},
                    {'name': 'OTHER', 'value': res.data.job_info.pricing.other},
                    {'name': 'DISCOUNT', 'value': res.data.job_info.pricing.discount},
                    {'name': 'SUB TOTAL', 'value': res.data.job_info.pricing.sub_total},
                    {'name': 'SURCHARGE', 'value': res.data.job_info.pricing.surcharge},
                    {'name': 'TAX', 'value': res.data.job_info.pricing.tax},
                    {'name': 'TOTAL', 'value': res.data.job_info.pricing.total}
                ];
                console.log()
                //  getJobOffer(InfoDataSet)
                  // clearInterval(this.interval);
                          
                  // session.setState({jobAccepted:true})
                // }

              })
              .catch(err => {            
                alert(err);
               
                
              }); 
        })            
       

  }

  onCancelJob(){
    this.onUpdateJob(6);
    isJobCalled = false;
    this.setState({showJobUpdate:false,jobAccepted:false,isPickupJob:false});
    var jobId = this.state.job_id;

  }
  onNoShowJob(){
    this.onUpdateJob(5);
    isJobCalled = false;
    this.setState({showJobUpdate:false,jobAccepted:false,isPickupJob:false});
    var jobId = this.state.job_id;

  }
  onPickupJob(){
    // clearInterval(this.interval);
    var currentPosition = this.state.lat+","+this.state.lng
    
    var jobdetailobj = {"device_id": "AC56C002-B5D0",
    "password" : userpassword,                
    "position" : currentPosition,            
    "method" : "get_job_info",               
    "job_no": this.state.job_id,
    "date": currentDateTimetype,
    "update_time" : currentDateTime,
      }
    // alert(this.state.job_id)
    
      axios({
        method: 'post',
        url: CAR_API_ENDPOINT,
        headers: {"Content-Type":"application/json"},
        data: jobdetailobj
      })
      .then(res => {
        // alert()
       
        
        console.log("===================Picked UP====================="+res.data.status);
        // if (res.data.job_info){
          // soundVariable.play();
          pickupPlace = res.data.job_info.pickup.address+ ' '+res.data.job_info.pickup.city+" "+res.data.job_info.pickup.state
          dropoffPlace = res.data.job_info.destination.address+ ' '+res.data.job_info.destination.city+" "+res.data.job_info.destination.state
          var pickupData = {latitude: parseFloat(res.data.job_info.pickup.lat), longitude: parseFloat(res.data.job_info.pickup.lng)}
          var dropoffData = {latitude: parseFloat(res.data.job_info.destination.lat), longitude: parseFloat(res.data.job_info.destination.lng)}
          
          this.setState({showJobUpdate:true,jobAccepted:true,isConfirmJob:true});                 
          session.setState({passenger:res.data.job_info.passenger_info.name})     
          session.setState({telephone:res.data.job_info.passenger_info.phone})   
          // session.setState({pickupRate:res.data.job_info.pricing.total})
          session.setState({pickup:pickupPlace}) 
          session.setState({dropoff:dropoffPlace}) 
          session.setState({origin:pickupData})
          session.setState({destination:dropoffData})
          
          

      })
      .catch(err => {            
        
    
        
      }); 
        
      }
  onDoneJob(){ 
      
    this.setState({showJobUpdate:false,jobAccepted:false,isPickupJob:false});
    isJobCalled = false;
    var jobId = this.state.job_id;
    this.onUpdateJob(4);
    // flag = 0
    session.setState({onShowMapMark:false})
    this.onChangeDuty();
   
    
 
  }

  onCreditCardPayment(){
    this.setState({cashPaymentState:false})
    this.setState({showJobUpdate:true,jobAccepted:true,isConfirmJob:false,showPaymentView:true,isPaymentConfirm:true});
    this.setState({onShowListJob:false})
    console.log(this.state.cashPaymentState)
    // NativeModules.Square.startTransaction(10000, (error) => {
    //    console.log('----error------------> '+error);
    //  },
    //  (success) => {
    //    console.log('----success------------> '+ success);
    //  });
    this.setState({showPaymentView:false})
  }
  onCashPayment(){    
      this.setState({cashPaymentState:true})
      this.setState({showJobUpdate:true,jobAccepted:true,isConfirmJob:false,showPaymentView:true,isPaymentConfirm:true});
      this.setState({onShowListJob:false})
  }
  onShowJobDetail(){    
    this.setState({onShowJobDetailValue:true})
    this.setState({onShowListJob:true})
    console.log("==ON SHOW JOB==="+this.state.onShowListJob)
  }
  onHideJobDetail(){    
    this.setState({onShowJobDetailValue:false})
    this.setState({onShowListJob:false})
    console.log("==ON HIDE JOB==="+this.state.onShowListJob)
  }
  onChangeTapColor(){
    this.setState({tapColor:"#C0C0C0"})
  }
  _handleAppStateChange = (nextAppState) => {
   
    
    if(nextAppState === 'background'){
     
      console.log("========================STOP REAL TIME REQUEST!!!=========================")
      clearInterval(this.interval);
    }
    if(nextAppState === 'active'){
      
      
      if(this.state.isOnDuty){        
        this.interval = setInterval(() => {                
                session.getCurrentLocation();                
        }, 15000) 
      }
    }
  }
  componentWillUnmount() {
      // used only when "providerListener" is enabled
      
      LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener
      AppState.removeEventListener('change', this._handleAppStateChange);
  }
  

  // ---------------- side menu ---------------
  onLogoClick(){
    this.setState({showMap:false,showMenu:true,showHistory:false,showLogout:false})
  }
  onHistory(){
    this.setState({showMenu:false,showHistory:true});
    AsyncStorage.getItem('@AccessToken')
      .then(token => {
        var currentPosition = this.state.lat+","+this.state.lng 
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours()-4; //Current Hours
        if (hours<0){
          hours = 24 + hours
          date = date - 1
        }
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        currentDateTime = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec
        currentDateTimetype = year + '-' + month + '-' + date
        var getJobListObj = {  
          "device_id":"AC56C002-B5D0",                  
          "password":token,
          'position':currentPosition,
          "method":"get_job_list",
          "date":currentDateTimetype,
          "update_time":currentDateTime,
          
        }
        

        console.log("== GET JOB LIST REQUESTS =="+JSON.stringify(getJobListObj)) 

        axios({
          method: 'post',
          url: CAR_API_ENDPOINT,
          headers: {"Content-Type":"application/json"},
          data: getJobListObj
        })
        .then(res => {
        console.log("===========GET JOB LIST RESPONSE STATUS========="+Object.keys(res.data.job_list.results).length)
          // this.setState({jobHistoryData:res.data.job_list.results})
          var temp = []
          for (var i = 0; i < Object.keys(res.data.job_list.results).length; i++)          {
            
            temp.push({'pickup_time':res.data.job_list.results[i].pickup_time,
                      'job_no':res.data.job_list.results[i].job_no,
                      'address':res.data.job_list.results[i].address,
                      'city':res.data.job_list.results[i].city,
                      'state':res.data.job_list.results[i].state})
              
          }
          
          this.setState({ jobHistoryData:temp})
          // this.setState({jobHistoryData:this.state.jobHistoryData.cloneWithRow(res.data.job_list.results[1])})
          console.log("===========GET JOB LIST RESPONSE DATAS========="+JSON.stringify(temp))
          

        })
        .catch(err => {

        });
      })
    .catch(error => console.log(error));

  }
  _renderHistoryItem = ({ item: rowData, index }) => {
    var firstline = rowData.job_no;
    return(
      <View style={{flexDirection: 'row',marginTop:8,marginBottom:8,backgroundColor:'#fff'}}>
        <View style={{flex:0.02,backgroundColor:'#05bf05'}}/>
        <View style={{flex:1,flexDirection:'column',marginLeft:20,marginRight:8,paddingTop:4,paddingBottom:4}}>
            <View style={{flex:0.33,flexDirection:'row',alignItems: "center",marginTop:0,backgroundColor:'transparent'}}>
                <Text style={{fontSize: 14,color: '#7b7b7b',marginLeft:21,textAlign:'center'}} numberOfLines={1}>JOB NUMBER:{firstline}</Text>
            </View>
            <View style={{flex:0.33,flexDirection:'row',alignItems: "center",backgroundColor:'transparent'}}>
                {/* <Image style={{width: 15, height: 10}} source={require('../img/dash_green.png')} resizeMode="contain" /> */}
                <Text style={{fontSize: 14,color: '#7b7b7b',marginLeft:4}} numberOfLines={1}>PICK UP TIME:{rowData.pickup_time}</Text>
            </View>
            <View style={{flex:0.33,flexDirection:'row',alignItems: "center",backgroundColor:'transparent'}}>
                <Image style={{width: 15, height: 10}} source={require('../img/dash_red.png')} resizeMode="contain" />
                <Text style={{fontSize: 14,color: '#7b7b7b',marginLeft:4}} numberOfLines={1}>{rowData.address+" "+rowData.city+" "+rowData.state}</Text>
            </View>
        </View>
      </View>
    )
  }

  onRingtone(){}
  onSetCarFeature(){
    this.setState({showMap:true,showMenu:false,isModalVisible:true})
    
    console.log("----------SET CAR FEATURE---------")
    
    
  }
  onLogout(){
    this.setState({showMenu:false,showLogout:true});
  }
  onAcceptLogout(){
    var that = this
      AsyncStorage.clear();
      that.props.navigation.navigate('LoginScreen')
      session.setState({showLogout:false})
      session.setState({showMap:true})
      if(this.state.isOnDuty == true){
        this.onChangeDuty()
      }
  }
  onCancelLogout(){this.setState({showMap:true,showMenu:false,showLogout:false})}
  onMenuCloseBtn(){
    this.setState({showMap:true,showMenu:false,showHistory:false})
  }
  //---------------- side menu end ------------
  onShowInfo(){
    this.setState({onShowInfoValue:true,onShowPriceValue:false,onShowNotesValue:false})
  }
  onShowPrice(){
    this.setState({onShowInfoValue:false,onShowPriceValue:true,onShowNotesValue:false})
  }
  onShowNotes(){
    this.setState({onShowInfoValue:false,onShowPriceValue:false,onShowNotesValue:true})
  }

  render(){
      return (
        <View style={{ flex: 1,backgroundColor: '#fff' }}>
          <LoadingSpinnerOverlay style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} ref={ component => this._modalLoadingSpinnerOverLay = component } />
          {/*--------header--------*/}
          <View style={{height:headerHeight,backgroundColor:headerBackColor,flexDirection:'row',paddingLeft:16,paddingRight:16,alignItems:'center',justifyContent:'center',alignSelf:'center'}}>
              {/*left*/}
              <View style={{flex: 0.2,backgroundColor:'transparent',alignItems:'flex-start',justifyContent:'center'}}>
                <Text style={{fontSize: 12,color: '#FFF'}} >DN: {this.state.code}</Text>
              </View>
              {/*center*/}
              <TouchableHighlight style={{flex: 0.6,alignItems: 'center',justifyContent:'center',backgroundColor:'transparent'}} underlayColor='transparent' onPress={() => { this.onLogoClick(); }}>
                <Image style={{width: 110, height: 40}} source={homeheaderlogo} resizeMode="contain" />
              </TouchableHighlight>
              {/*right*/}
              <TouchableHighlight style={{flex: 0.2,backgroundColor:this.state.onDutyTabColor,borderRadius:25,padding:8,alignItems:'center',justifyContent:'center'}} underlayColor='transparent' onPress={() => { this.onChangeDuty(); }}>
                <Text style={{fontSize: 12,color: this.state.onDutyTabTextColor}} >{this.state.onDutyTabText}</Text>
              </TouchableHighlight>
          </View>
          
          {/*---------- content ------- */}
          
          {this.state.showMap ?
            <View style={{flex: 1}}>
              {/* --- map view ----*/}
              <MapView
                ref={ref => { this.map = ref; }}
                style={styles.map}
                onMapReady={this.onMapReady}
                initialRegion={{
                  latitude: this.state.lat,
                  longitude: this.state.lng,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                  }} >
                <MapView.Marker
                  key={0}
                  coordinate={{
                    latitude: this.state.lat,
                    longitude: this.state.lng}}
                  image={require('../img/car_marker.png')}
                  />
                  {this.state.onShowMapMark &&
                    <MapView.Marker coordinate={this.state.origin} image={require('../img/location_marker.png')}/>
                  }
                  {this.state.onShowMapMark &&
                      <MapView.Marker coordinate={this.state.destination} image={require('../img/location_marker.png')}/>
                  }
                  {this.state.onShowMapMark &&
                    <MapViewDirections
                      origin={this.state.pickup}
                      destination={this.state.dropoff}
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={3}
                      strokeColor="#e40000"
                      onReady={result => {
                        this.map.fitToCoordinates(result.coordinates, {});
                      }}
                    />
                  }
              </MapView>
              {/* --- detail view ----*/}
              {!this.state.isOnDuty &&
                <View style={{flex:0.1,backgroundColor:'#fb5656',marginLeft:20,marginRight:20,borderBottomLeftRadius:30,borderBottomRightRadius:30,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize: 16,color: '#FFF',fontWeight:'bold'}} >OFF DUTY</Text>
                </View>
              }
              {this.state.onShowListJob &&
                
                <View style={{height:height/3*1.7,flexDirection:"column", backgroundColor:'gray',justifyContent:'center',alignItems:'center'}}> 
                  <View style={{flexDirection:"row", height:headerHeight/2,width:width,backgroundColor:"#708090",justifyContent:'center',alignItems:'center'}}> 
                    <TouchableHighlight style={{flex:1, backgroundColor:"#708090",justifyContent:'center',alignItems:'center'}} underlayColor='transparent' onPress = {()=>this.onShowInfo()}>
                      <Text style={{fontSize: 16,color: '#FFF'}} >INFO</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex:1, backgroundColor:"#708090",justifyContent:'center',alignItems:'center'}} underlayColor='transparent' onPress = {()=>this.onShowPrice()}>
                      <Text style={{fontSize: 16,color: '#FFF'}} >PRICE</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex:1, backgroundColor:"#708090",justifyContent:'center',alignItems:'center'}} underlayColor='transparent' onPress = {()=>this.onShowNotes()}>
                      <Text style={{fontSize: 16,color: '#FFF'}} >NOTES</Text>
                    </TouchableHighlight>
                  </View>
                  {this.state.onShowInfoValue &&
                        <View style={{flex:8,width:width,backgroundColor:'#C0C0C0',justifyContent:'center',alignItems:'center'}}>
                           <ScrollView>
                              {
                                 InfoDataSet.map((item, index) => (
                                    <View key = {item.id} style = {styles.item}>
                                      <View style = {{flex:1}}>
                                       <Text>{item.name}:</Text>
                                      </View>
                                      <View style = {{flex:1,alignItems:'center',justifyContent:'center'}}>
                                       <Text>{item.value}</Text>
                                      </View>
                                    </View>
                                 ))
                              }
                           </ScrollView>
                        </View>
                  } 
                  {this.state.onShowPriceValue &&
                    <View style={{flex:8,width:width,backgroundColor:'#C0C0C0',justifyContent:'center',alignItems:'center'}}>
                    <ScrollView>
                       {
                          PriceDataSet.map((item, index) => (
                             <View key = {item.id} style = {styles.item}>
                               <View style = {{flex:1}}>
                                <Text>{item.name}:</Text>
                               </View>
                               <View style = {{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <Text>{item.value}$</Text>
                               </View>
                             </View>
                          ))
                       }
                    </ScrollView>
                 </View>
                  } 
                  {this.state.onShowNotesValue &&
                    <View style={{flex:8,width:width,backgroundColor:'#C0C0C0',justifyContent:'center',alignItems:'center'}}> 
                      <Text style={{fontSize: 16,color: '#FFF',fontWeight:'bold'}} >SHOW NOTES</Text>
                    </View>
                  } 
                                 
                  
                </View>
              }
              {/*---- accept/reject view ----- */}
              {this.state.showJobUpdate &&
                <View style={{backgroundColor: 'rgba(255,255,255,0.85)',position: 'absolute',bottom:0,width:width,height:bottomViewHeight}}>
                    {this.state.jobAccepted ?
                      <View style={{flex: 1,flexDirection:'column'}}>
                        {/*text details*/}
                        <View style={{flex: 0.5,justifyContent: "center",alignItems: "center",marginLeft:12,marginRight:12,backgroundColor:'transparent'}}>
                            {!this.state.isPickupJob ?
                              <View style={{justifyContent: "center",alignItems: "center"}}>
                                  <View style={{flex:0.4,width:width-80,flexDirection:'row',justifyContent: "center",alignItems: "center",marginTop:0,backgroundColor:'transparent'}}>
                                      <Image style={{width: 15, height: 10}} source={require('../img/dash_green.png')} resizeMode="contain" />
                                      <Text style={{fontSize: 15,color: '#7b7b7b',marginLeft:4,textAlign:'center'}} numberOfLines={2}>{this.state.pickup}</Text>
                                  </View>                                  
                                  <View style={{flex: 0.2,flexDirection:'row',justifyContent: "center",alignItems: "center",marginTop:4,marginLeft:12,marginRight:12,backgroundColor:'transparent'}}>
                                    <Text style={{fontSize: 18,color: '#000000',marginTop:6}}>Owed: </Text>
                                    <Text style={{fontSize: 18,color: '#000000',marginTop:6,marginRight:2}}>{this.state.pickupRate}$</Text>
                                    <Text style={{fontSize: 18,color: '#ff0000',marginTop:6,marginLeft:2}}>Cash: </Text>
                                    <Text style={{fontSize: 18,color: '#ff0000',marginTop:6}}>{parseFloat(this.state.pickupRate)-5}$</Text>
                                  </View>
                                  
                              </View>
                              :
                              <View style={{flex:1,flexDirection:'column',justifyContent: "center",alignItems: "center",backgroundColor:'transparent'}}>
                                <View style={{flex: 0.2,flexDirection:'column',justifyContent: "center",alignItems: "center",marginTop:20,marginLeft:12,marginRight:12,backgroundColor:'transparent'}}>
                                    <Text style={{fontSize: 18,color: '#000000',marginTop:6}}>Owed: {this.state.pickupRate}$</Text>
                                    
                                    <Text style={{fontSize: 18,color: '#000000',marginTop:6,marginLeft:2}}>Total: {parseFloat(this.state.pickupRate)}$</Text>
                                    
                                </View>
                           
                              </View>
                            }
                        </View>
                        {/*--- button ---*/}
                        <View style={{flex: 0.5,flexDirection:'row',justifyContent: "center",alignItems: "center",marginTop:0}}>
                            {this.state.isPickupJob ?
                              <View style={{flexDirection:'row',justifyContent: "center"}}>
                                  <TouchableHighlight style={[{flex: 0.8,backgroundColor:'#05bf05'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onDoneJob(); }}>
                                    <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>DONE</Text>
                                  </TouchableHighlight>
                              </View>
                              :
                              <View style={{flex:1,flexDirection:'column'}}>
                                  <View style={{flex:0.5,flexDirection:'row',justifyContent: "center"}}>
                                    <TouchableHighlight style={[{flex: 0.8,backgroundColor:'#0a55a4'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onPickupJob(); }}>
                                      <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>PICKED UP</Text>
                                    </TouchableHighlight>
                                  </View>
                                  <View style={{flex:0.5,flexDirection:'row'}}>
                                    <TouchableHighlight style={[{flex: 0.5,backgroundColor:'#fad400',margin:12},styles.smallBottomBtn]} underlayColor='transparent' onPress={() => { this.onNoShowJob(); }}>
                                      <Text style={{fontSize: 18,color: '#FFF',fontWeight:'bold'}}>NO SHOW</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[{flex: 0.5,backgroundColor:'#fa7000',margin:12},styles.smallBottomBtn]} underlayColor='transparent' onPress={() => { this.onCancelJob(); }}>
                                      <Text style={{fontSize: 18,color: '#FFF',fontWeight:'bold'}}>CANCELLED</Text>
                                    </TouchableHighlight>
                                  </View>
                              </View>
                            }
                        </View>
                      </View>
                      :
                      <View style={{flex: 1,flexDirection:'column'}}>
                        {/*text details*/}
                        <View style={{flex: 0.6,justifyContent: "center",alignItems: "center",marginTop:4,marginLeft:12,marginRight:12,backgroundColor:'transparent'}}>
                            <Text style={{fontSize: 16,color: '#0054a4'}} >Available Job</Text>
                            <Text style={{fontSize: 18,color: '#181818',fontWeight:'bold',marginTop:6}} >{this.state.passenger}</Text>
                            <Text style={{fontSize: 18,color: '#181818',fontWeight:'bold',marginTop:6}} >{this.state.pickup}</Text>
                            {/* <Text style={{fontSize: 16,color: '#0054a4',marginTop:6}} >{this.state.telephone}</Text> */}
                            {/*<TextFit  height={40} width={width-50} style={{fontSize: 16,color: '#7b7b7b',marginTop:6,backgroundColor:'transparent'}}>
                              {this.state.pickup}
                            </TextFit>*/}
                            {/* <Text style={{fontSize: 16,width:width-80,color: '#7b7b7b',marginTop:6,textAlign:'center'}} numberOfLines={2}>{this.state.pickup}</Text> */}
                        </View>
                        {/*--- button ---*/}
                        <View style={{flex: 0.4,flexDirection:'row',justifyContent: "center",alignItems: "center",marginTop:0,backgroundColor:'transparent'}}>
                            <View style={{flex:0.1}}/>
                            <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#05bf05'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onAcceptJob(); }}>
                              <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>ACCEPT</Text>
                            </TouchableHighlight>
                            <View style={{flex:0.05}}/>
                            <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#e40000'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onSkipJob(); }}>
                              <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>SKIP</Text>
                            </TouchableHighlight>
                            <View style={{flex:0.1}}/>
                        </View>
                      </View>
                    }
                </View>
              }
              {/*---- payment view ----- */}
              {this.state.showPaymentView &&

                <View style={{backgroundColor: 'rgba(255,255,255,0.85)',position: 'absolute',bottom:0,width:width,height:bottomViewHeight}}>
                  <View style={{flex: 1,flexDirection:'column'}}>
                    {/*text details*/}

                    <View style={{justifyContent: "center",alignItems: "center"}}>
                      <View style = {{flex:0.1,flexDirection:'row', justifyContent: "flex-end"}}>
                        {!this.state.onShowJobDetailValue ?
                        <TouchableHighlight style={[{flex: 0.2},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onShowJobDetail(); }}>
                          <Image style={{width: 50, height: 50}} source={require('../img/warning.png')} resizeMode="contain"/>
                        </TouchableHighlight>
                        :
                        <TouchableHighlight style={[{flex: 0.2},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onHideJobDetail(); }}>
                          <Image style={{width: 50, height: 50}} source={require('../img/close.png')} resizeMode="contain"/>
                        </TouchableHighlight>
                        }
                      </View>
                      <View style={{flex:0.4,width:width-80,flexDirection:'column',justifyContent: "center",alignItems: "center",marginTop:45,backgroundColor:'transparent'}}>
                          {/* <View style={{flexDirection:'row',width:width-80,justifyContent: "center",alignItems: "center",marginTop:25}}>
                              <Image style={{width: 15, height: 10}} source={require('../img/dash_green.png')} resizeMode="contain" />
                              <Text style={{fontSize: 15,color: '#7b7b7b',marginLeft:4,textAlign:'center'}} numberOfLines={2} >{this.state.pickup}</Text>                                    
                          </View> */}
                          <View style={{flexDirection:'row',width:width-80,justifyContent: "center",alignItems: "center"}}>                                    
                              <Image style={{width: 15, height: 10}} source={require('../img/dash_red.png')} resizeMode="contain" />
                              <Text style={{fontSize: 15,color: '#000000',marginLeft:4,textAlign:'center'}} numberOfLines={2} >{this.state.dropoff}</Text>
                          </View>
                      </View>
                      <View style={{flex: 0.2,flexDirection:'row',justifyContent: "center",alignItems: "center",marginTop:40,marginLeft:12,marginRight:12,backgroundColor:'transparent'}}>
                        <Text style={{fontSize: 18,color: '#000000',marginTop:6}}>Owed: </Text>
                        <Text style={{fontSize: 18,color: '#000000',marginTop:6}}>{this.state.pickupRate}$</Text>
                        <Text style={{fontSize: 18,color: '#ff0000',marginTop:6,marginLeft:4}}>Cash: </Text>
                        <Text style={{fontSize: 18,color: '#ff0000',marginTop:6}}>{parseFloat(this.state.pickupRate)-5}$</Text>
                        <Text style={{fontSize: 18,color: '#000000',marginTop:6,marginLeft:4}}>Total: </Text>
                        <Text style={{fontSize: 18,color: '#000000',marginTop:6}}>{this.state.pickupRate}$</Text>
                        
                      </View>
                      
                    </View>
                    {/*--- button ---*/}
                    <View style={{flex: 1,justifyContent: "flex-end",alignItems: "center",backgroundColor:'transparent'}}>
                        <View style={{flex: 0.1}}/>
                        <View style={{flex:0.4,flexDirection:'row',justifyContent: "center"}}>
                            <TouchableHighlight style={[{flex: 0.6,backgroundColor:'#05bf05'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onCashPayment(); }}>
                              <Text style={{fontSize: 20,color: '#FFF',fontWeight:'bold'}}>CASH</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex: 0.1}}/>
                        <View style={{flex:0.4,flexDirection:'row',justifyContent: "center"}}>
                            <TouchableHighlight style={[{flex: 0.6,backgroundColor:'#0054a4'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onCreditCardPayment(); }}>
                              <Text style={{fontSize: 20,color: '#FFF',fontWeight:'bold'}}>CREDIT CARD</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex: 0.1}}/>
                    </View>
                  </View>
                </View>
              }
              {/*---- sms/call view ----- */}
              {this.state.showSMSCall &&
                <View style={{height:height-headerHeight,position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                    <View style={{backgroundColor: 'rgba(255,255,255,0.85)',width:width*80/100,height:bottomViewHeight,elevation:2,borderRadius:10}}>
                        {/*--- cancel ---*/}
                        <View style={{flex: 0.2}}>
                            <View style={{flex: 0.8}}/>
                            <TouchableHighlight style={{flex: 0.2,alignItems: 'flex-end',justifyContent:'center'}} underlayColor='transparent' onPress={() => { this.onLogoClick(); }}>
                              <Image style={{width: 20, height: 20,backgroundColor:'#e40000',padding:8}} source={require('../img/cancel.png')} resizeMode="contain" />
                            </TouchableHighlight>
                        </View>
                        {/*--- text info ---*/}
                        <View style={{flex: 0.4,justifyContent: "center",alignItems: "center",marginTop:4,marginLeft:12,marginRight:12,backgroundColor:'transparent'}}>
                            <Text style={{fontSize: 18,color: '#181818',fontWeight:'bold',marginTop:6}} >{this.state.passenger}</Text>
                            {/* <Text style={{fontSize: 16,color: '#0054a4',marginTop:6}} >{this.state.telephone}</Text> */}
                        </View>
                        {/*--- button ---*/}
                        <View style={{flex: 0.4,flexDirection:'column',justifyContent: "center",alignItems: "center",marginTop:0,backgroundColor:'transparent'}}>
                            <View style={{flex:0.1}}/>
                            <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#05bf05'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onAcceptJob(); }}>
                              <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>ACCEPT</Text>
                            </TouchableHighlight>
                            <View style={{flex:0.05}}/>
                            <TouchableHighlight style={[{flex: 0.4,backgroundColor:'#e40000'},styles.bottomBtn]} underlayColor='transparent' onPress={() => { this.onSkipJob(); }}>
                              <Text style={{fontSize: 22,color: '#FFF',fontWeight:'bold'}}>SKIP</Text>
                            </TouchableHighlight>
                            <View style={{flex:0.1}}/>
                        </View>
                    </View>
                </View>
              }
              {/*-----------modal---------*/}
              <Modal animationIn={'fadeInDown'} animationOut={'fadeOutDown'} useNativeDriver={true}
                style={{flex: 1,justifyContent: "center",alignItems: "center"}} isVisible={this.state.isModalVisible}>
                {this._renderModalContent()}
              </Modal>
              <Modal animationIn={'fadeInDown'} animationOut={'fadeOutDown'} useNativeDriver={true}
                style={{flex: 1,justifyContent: "center",alignItems: "center"}} isVisible={this.state.isConfirmJob}>
                {this._renderConfirmModalContent()}
              </Modal>
              <Modal animationIn={'fadeInDown'} animationOut={'fadeOutDown'} useNativeDriver={true}
                style={{flex: 1,justifyContent: "center",alignItems: "center"}} isVisible={this.state.isPaymentConfirm}>
                {this._renderConfirmPaymentModalContent()}
              </Modal>
            </View>
            :
            <View style={{flex:1}}>
              {/* ---------- menu content ----------*/}
              {this.state.showMenu &&
                <View style={{flex:0.5,flexDirection:'row'}}>
                  <View style={{flex:0.4,backgroundColor:headerBackColor,flexDirection:'column'}}>
                      {/*---- driver detail ---*/}
                      <View style={{flex:0.2,backgroundColor:headerBackColor,justifyContent:'center'}}>
                        <Text style={{fontSize: 18,color: '#FFF',alignSelf:'center'}}>{this.state.drivername}</Text>
                        <Text style={{fontSize: 14,color: '#FFF',alignSelf:'center'}}>DN: {this.state.code}</Text>
                      </View>
                      {/*--- history ---*/}
                      <TouchableHighlight style={{flex: 0.2,backgroundColor:headerBackColor,justifyContent:'center',paddingLeft:25}} underlayColor='transparent' onPress={() => { this.onHistory(); }}>
                        <Text style={{fontSize: 16,color: '#FFF'}}>History</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={{flex: 0.2,backgroundColor:headerBackColor,justifyContent:'center',paddingLeft:25}} underlayColor='transparent' onPress={() => { this.onSetCarFeature(); }}>
                        <Text style={{fontSize: 16,color: '#FFF'}}>Set Car Features</Text>
                      </TouchableHighlight>
                      {/*--- ringtone ---*/}
                      <TouchableHighlight style={{flex: 0.2,backgroundColor:headerBackColor,justifyContent:'center',paddingLeft:25}} underlayColor='transparent' onPress={() => { this.onRingtone(); }}>
                        <Text style={{fontSize: 16,color: '#FFF'}}>Ring tone</Text>
                      </TouchableHighlight>
                      {/* --- logout ---*/}
                      <TouchableHighlight style={{flex: 0.2,backgroundColor:headerBackColor,justifyContent:'center',paddingLeft:25}} underlayColor='transparent' onPress={() => { this.onLogout(); }}>
                        <Text style={{fontSize: 16,color: '#FFF'}}>Log out</Text>
                      </TouchableHighlight>
                  </View>
                  <TouchableHighlight style={{flex: 0.1,alignItems: 'center',backgroundColor:'transparent',marginTop:6}} underlayColor='transparent' onPress={() => { this.onMenuCloseBtn(); }}>
                    <Image style={{width: 20, height: 20}} source={require('../img/nav.png')} resizeMode="contain" />
                  </TouchableHighlight>
                  
                </View>
              }
              
              {this.state.showHistory &&
                <View style={{flex:1,backgroundColor:'#f0f0ee'}}>
                  <FlatList
                    contentContainerStyle={{justifyContent:'center'}}
                    data={this.state.jobHistoryData}
                    keyExtractor={(item, index)=> index.toString()}
                    renderItem={this._renderHistoryItem}
                  />
                   {/* {
                                 this.state.jobHistoryData.map((item, index) => (
                                    <View key = {item.id} style = {styles.item}>
                                      <View style = {{flex:1}}>
                                       <Text>{item.job_no}:</Text>
                                      </View>
                                      <View style = {{flex:1,alignItems:'center',justifyContent:'center'}}>
                                       <Text>{item.address}</Text>
                                      </View>
                                    </View>
                                 ))
                              } */}
                </View>
              }
              {this.state.showLogout &&
                <View style={{flex:1,backgroundColor:headerBackColor}}>
                    <View style={{flex:0.3}}/>
                    <View style={{flex:0.4,justifyContent:'center', alignItems: "center"}}>
                        <View style={{flex:0.5,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                            <Text style={{color: "#fff",fontSize:25,padding:8, justifyContent:'center',alignItems:'center',textAlign:'center'}}>{'Are you sure \n you want log out?'}</Text>
                        </View>
                        <View style={{flex:0.5,flexDirection: 'row',justifyContent:'center',backgroundColor:'transparent',marginRight:16,marginLeft:16}}>
                            <TouchableHighlight style={{flex:0.4,borderRadius:25,alignSelf:'center',backgroundColor:'#05bf05',alignItems:'center',marginRight:8}} underlayColor='transparent' onPress={() => { this.onAcceptLogout(); }}>
                                <Text style={{padding: 12,textAlign: 'center',fontSize: 22,color: 'white'}}>Yes</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={{flex:0.4,borderRadius:25,alignSelf:'center',backgroundColor:'#e40001',alignItems:'center',marginLeft:8}} underlayColor='transparent' onPress={() => { this.onCancelLogout(); }}>
                                <Text style={{padding: 12,textAlign: 'center',fontSize: 22,color: 'white'}}>No</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{flex:0.3}}/>
                </View>
              }
            </View>
          }
        </View>
        
      );
  }
}
const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
     item: {
      width:width,
      flexDirection: 'row',      
      alignItems: 'center',
      padding: 10,      
      borderColor: '#C0C0C0',
      borderWidth: 0.2,
      backgroundColor: '#FFFAFA',
      paddingLeft:10,
      
   },
  bottomBtn:{borderRadius:20,paddingLeft:8,paddingRight:8,paddingTop:18,paddingBottom:18,alignItems:'center',justifyContent:'center'},
  smallBottomBtn:{borderRadius:10,paddingLeft:6,paddingRight:6,paddingTop:18,paddingBottom:18,alignItems:'center',justifyContent:'center'},
});
function mapStateToProps({ HomeApp }) {
  return {
    home: HomeApp
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setHomeData: Actions.setHomeData,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(home);
