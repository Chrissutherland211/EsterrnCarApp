import {NativeModules, Platform, Dimensions,NetInfo} from 'react-native';

export let appName = 'Eastern LX';
export let headerBackColor = "#0d253c";
export let headerlogo = require('../img/logo.png');
export let homeheaderlogo = require('../img/homelogo.png');
export let headerLeftMenuSize = 25;
export let headerHeight = 60;
export let API_ENDPOINT = 'http://166.62.116.126:88';
export let CAR_API_ENDPOINT = 'http://easterntaxi.com/api/v2/driver/init.php';
// export let CAR_API_ENDPOINT = 'http://easternride.com/api/v2/driver/init.php';
export let internetConnectionTitle = appName;
export let internetConnectionMessage = 'No Internet Connection available!! Please try later..';

export function checkIntenetStatus(){
  if(Platform.OS === 'android'){
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ---- @@@ --- ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType)
      if(connectionInfo.type === 'none'){
        return false;
      }else{
        return true;
      }
    });
  }else{
      fetch('https://www.google.com', {
        method: "Head",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        },
      })
      .then(() => {
        console.log('internet true');
        return true;
      })
      .catch(() => {
        console.log('internet false');
        return false;
      });
  }
}

let d = Dimensions.get('window');
export let { height, width } = d;

export let topbarTopMargin = 0;
export function checkIphoneX(){
  if(Platform.OS === 'ios' && (height === 812 || height === 896)){
    topbarTopMargin = 30;
  }
  return topbarTopMargin;
}
