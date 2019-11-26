// Api.js
import {
    AsyncStorage,
    Alert,
} from 'react-native';
import {checkIntenetStatus,internetConnectionTitle,internetConnectionMessage} from '../constant/const';
import ApiUtils from './ApiUtils';
import {API_ENDPOINT} from '../constant/const';
import {CAR_API_ENDPOINT} from '../constant/const';
import RNFetchBlob from 'rn-fetch-blob'

// var API_ENDPOINT = 'http://166.62.116.126:88';

var fetchGetData = function(url, callback) {
    if(checkIntenetStatus){
      fetch(url, {
              method: 'GET',
          })
          .then(ApiUtils.checkStatus)
          .then(response => response.json())
          .then((response) => {
            // alert(response);
              // console.log('Poems -- *** ' + JSON.stringify(response));
              // out = JSON.parse(response._bodyText);
              out = response;
              callback(undefined, out);
          })
          .catch(e => {
              callback(e);
          })
    }else{
      var data = {error : '1'}
      callback(undefined,data);
      setTimeout(function() {
          Alert.alert(internetConnectionTitle,internetConnectionMessage);
      }, 500);
    }

}
var fetchPutData = function(url, formdata, callback) {
  if(checkIntenetStatus){
    fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            body: formdata
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then((response) => {
            console.log('Poems -- >> >>>>>  ' + JSON.stringify(response));
            // out = JSON.parse(response._bodyText);
            out = response;
            callback(undefined, out);
        })
        .catch(e => {
            callback(e);
        })
  }else{
    var data = {error : '1'}
    callback(undefined,data);
    setTimeout(function() {
        Alert.alert(internetConnectionTitle,internetConnectionMessage);
    }, 500);
  }
}
var fetchPostData = function(url, formdata, callback) {
  if(checkIntenetStatus){
    fetch(url, {
            method: 'POST',
            body: formdata
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then((response) => {
            out = response;
            callback(undefined, out);
        })
        .catch(e => {
          console.log('-------------------> post data error ---> ' + e);
            callback(e);
        })
  }else{
    var data = {error : '1'}
    callback(undefined,data);
    setTimeout(function() {
        Alert.alert(internetConnectionTitle,internetConnectionMessage);
    }, 500);
  }
}
var fetchDeleteData = function(url, callback) {
    if(checkIntenetStatus){
      fetch(url, {
              method: 'DELETE',
          })
          .then(ApiUtils.checkStatus)
          .then(response => response.json())
          .then((response) => {
              out = response;
              callback(undefined, out);
          })
          .catch(e => {
              callback(e);
          })
    }else{
      var data = {error : '1'}
      callback(undefined,data);
      setTimeout(function() {
          Alert.alert(internetConnectionTitle,internetConnectionMessage);
      }, 500);
    }
}

var fetchMyPostData = function(url, formdata, callback) {
    fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            body: formdata
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then((response) => {
            out = response;
            callback(undefined, out);
        })
        .catch(e => {
            callback(e);
        })
}
var fetchEasternCarPostData = function(url, formdata, callback) {
 
    fetch(url, {
            method: 'POST',
            headers: {                
                'Content-Type': 'application/json',
            },
            body: formdata
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then((response) => {
            out = response;
            // alert(response.data)
            callback(undefined, out);
        })
        .catch(e => {
            callback(e);
        })
}
var fetchMyPostWithoutData = function(url, token, callback) {
    fetch(url, {
      method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
              'Authorization' : 'Basic ' + token,
          },
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then((response) => {
            out = response;
            callback(undefined, out);
        })
        .catch(e => {
            callback(e);
        })
}
var fetchMyPostWithDataToken = function(url, formdata, token, callback) {
    fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization' : 'Basic ' + token,
            },
            body: formdata
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .then((response) => {
            out = response;
            callback(undefined, out);
        })
        .catch(e => {
            callback(e);
        })
}

function getFormData(obj){
  var formBody = [];
  for (var property in obj) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(obj[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
}

var Api = {
    formdata: new FormData(),
    doLogin: function(parent, code, password, callback) {
        
        url = CAR_API_ENDPOINT;
        var obj = {
            "method": "login",
            "device_id": "AC56C002-B5D0",
            "username":code,
            "password": password,
        };
        console.log(url)
        console.log("_____LOGIN requests____________"+JSON.stringify(obj))
        // var formBody = [];
        // for (var property in obj) {
        //   var encodedKey = encodeURIComponent(property);
        //   var encodedValue = encodeURIComponent(obj[property]);
        //   formBody.push(encodedKey + "=" + encodedValue);
        // }
        // formBody = formBody.join("&");
        
        console.log('--->>> doLogin method --- ' + url + '\n--- ' + JSON.stringify(getFormData(obj)));
        fetchEasternCarPostData(url, JSON.stringify(obj), function(err, data) {
            if (!err) {
                callback(parent, data);                
                
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('doLogin method error ---->> ' + err);
                alert(err)
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    getCurrentJob: function(parent, token, callback) {
        url = API_ENDPOINT + "/rest/driver/drv_back";

        console.log('--->>> getCurrentJob method --- ' + url + '\n--- ' + token);
        fetchMyPostWithoutData(url, token, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getCurrentJob method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    skipDriverJob: function(parent, token, callback) {
        url = API_ENDPOINT + "/rest/driver/drv_skip";

        console.log('--->>> skipDriverJob method --- ' + url + '\n--- ' + token);
        fetchMyPostWithoutData(url, token, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('skipDriverJob method error ---->> ' + err);
                // parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    cancelJob: function(parent, id_job, token, callback) {
        url = API_ENDPOINT + "/rest/driver/drv_cancel";
        var obj = {
            "id_job":id_job,
        };
        console.log('--->>> cancelJob method --- ' + url + '\n--- ' + token);
        fetchMyPostWithDataToken(url, getFormData(obj), token, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('cancelJob method error ---->> ' + err);
                // parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    nagativeJob: function(parent, id_job, token, callback) {
        url = API_ENDPOINT + "/rest/driver/drv_negative";
        var obj = {
            "id_job":id_job,
        };
        console.log('--->>> nagativeJob method --- ' + url + '\n--- ' + token);
        fetchMyPostWithDataToken(url, getFormData(obj), token, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('nagativeJob method error ---->> ' + err);
                // parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    pickupJob: function(parent, id_job, token, callback) {
        url = API_ENDPOINT + "/rest/driver/drv_pickup";
        var obj = {
            "id_job":id_job,
        };
        console.log('--->>> pickupJob method --- ' + url + '\n--- ' + token);
        fetchMyPostWithDataToken(url, getFormData(obj), token, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('pickupJob method error ---->> ' + err);
                // parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    dropoffJob: function(parent, id_job, token, callback) {
        url = API_ENDPOINT + "/rest/driver/drv_dropoff";
        var obj = {
            "id_job":id_job,
        };
        console.log('--->>> dropoffJob method --- ' + url + '\n--- ' + token);
        fetchMyPostWithDataToken(url, getFormData(obj), token, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('dropoffJob method error ---->> ' + err);
                // parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    getJobHistory: function(parent, token, callback) {
        url = API_ENDPOINT + "/rest/driver/drv_history";

        console.log('--->>> getJobHistory method --- ' + url + '\n--- ' + token);
        fetchMyPostWithoutData(url, token, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getJobHistory method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },


    // -------------------------- not useful api -------------------
    getUserProfile: function(parent, device_id, callback) {
        url = API_ENDPOINT + "profile?device_id="+device_id;

        console.log('--->>> getUserProfile method --- ' + url);
        fetchGetData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getUserProfile method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    saveUserProfile: function(parent, name, device_id, device_token, gender, should_be_notified, callback) {
        url = API_ENDPOINT + "profile/store";

        this.formdata = new FormData();
        this.formdata.append("name", name);
        this.formdata.append("device_id", device_id);
        this.formdata.append("device_token", device_token);
        this.formdata.append("gender", gender);
        this.formdata.append("should_be_notified", should_be_notified);

        console.log('--->>> saveUserProfile method --- ' + url + '\n--- ' + JSON.stringify(this.formdata));
        fetchPostData(url, this.formdata, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('saveUserProfile method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    editUserProfile: function(parent, name, device_id, gender, should_be_notified, callback) {
        url = API_ENDPOINT + "profile/update";

        // this.formdata = new FormData();
        // this.formdata.append("name", name);
        // this.formdata.append("device_id", device_id);
        // this.formdata.append("gender", gender);
        // this.formdata.append("should_be_notified", should_be_notified);
        var obj = {
            "name":name,
            "device_id": device_id,
            "gender": gender,
            "should_be_notified": should_be_notified,
        };

        var formBody = [];
        for (var property in obj) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(obj[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        console.log('--->>> editUserProfile method --- ' + url + '\n--- ' + JSON.stringify(formBody));
        fetchPutData(url, formBody, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('editUserProfile method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    // --- category ---
    getHomeCategories: function(parent, device_id, callback) {
        url = API_ENDPOINT + "home-categories?device_id="+device_id;

        console.log('--->>> getHomeCategories method --- ' + url);
        fetchGetData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getHomeCategories method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    getHomeFeedbackList: function(parent, device_id, callback) {
        url = API_ENDPOINT + "feedback?device_id="+device_id;

        console.log('--->>> getHomeFeedbackList method --- ' + url);
        fetchGetData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getHomeFeedbackList method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    setFeedbackStatus: function(parent, idFeedback, device_id, status, callback) {
      url = API_ENDPOINT + 'feedback/set-status/'+idFeedback+'?device_id='+device_id;

      var obj = {
          'status':status  //(accept/ignore)
      };
      var formBody = [];
      for (var property in obj) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(obj[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      console.log('--->>> setFeedbackStatus method --- ' + url);
      fetchPutData(url, formBody, function(err, data) {
          if (!err) {
              callback(parent, data);
          } else {
              // Alert.alert(mainTextApp, "Error communicating with server: " + err);
              console.log('setFeedbackStatus method error ---->> ' + err);
              parent._modalLoadingSpinnerOverLay.hide();
          }
      });
    },
    setAcceptAllFeedback: function(parent, device_id, callback) {
        url = API_ENDPOINT + "feedback/accept-all/?device_id="+device_id;

        console.log('--->>> setAcceptAllFeedback method --- ' + url);
        fetchGetData(url, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('setAcceptAllFeedback method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },

    // ---------------- get feedback ------------
    getPastRequest: function(parent, device_id, callback) {
        url = API_ENDPOINT + "request/past-requests?device_id="+device_id;

        console.log('--->>> getPastRequest method --- ' + url);
        fetchGetData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getPastRequest method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    deletePastRequest: function(parent, idFeedback, device_id, callback) {
        url = API_ENDPOINT + 'request/'+idFeedback+'?device_id='+device_id;

        console.log('--->>> deletePastRequest method --- ' + url);
        fetchDeleteData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('deletePastRequest method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    cancelPastRequest: function(parent, idFeedback, device_id, callback) {
        url = API_ENDPOINT + 'request/set-status/'+idFeedback+'?device_id='+device_id;

        var obj = {
            'status':'cancelled'
        };
        var formBody = [];
        for (var property in obj) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(obj[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        console.log('--->>> cancelPastRequest method --- ' + url);
        fetchPutData(url, formBody, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('cancelPastRequest method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    resendPastRequest: function(parent, idFeedback, device_id, callback) {
        url = API_ENDPOINT + 'request/re-send/'+idFeedback+'?device_id='+device_id;

        console.log('--->>> resendPastRequest method --- ' + url);
        fetchGetData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('resendPastRequest method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    getFeedbackUniqueUrl: function(parent, provider_name, device_id, callback) {
        url = API_ENDPOINT + "request/get-feedback?device_id="+device_id;

        this.formdata = new FormData();
        this.formdata.append("provider_name", provider_name);

        console.log('--->>> sendFeedback method --- ' + url + '\n--- ' + JSON.stringify(this.formdata));
        fetchPostData(url, this.formdata, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getFeedbackUniqueUrl method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },

    // -------------- give feedback ------------
    getThumbnailList: function(parent, callback) {
        url = API_ENDPOINT + "thumbnails";

        console.log('--->>> getThumbnailList method --- ' + url);
        fetchGetData(url, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('getThumbnailList method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    sendFeedback: function(parent, recipient_name, feedbackArr, device_id, callback) {
        url = API_ENDPOINT + "request/give-feedback?device_id="+device_id;

        this.formdata = new FormData();
        this.formdata.append("recipient_name", recipient_name);

        for(var i = 0; i < feedbackArr.length ; i++){
          var obj = {"thumbnail_id" : feedbackArr[i].id, "feedback" : feedbackArr[i].content};
          this.formdata.append("feedbacks["+i+"]",JSON.stringify(obj));
          // this.formdata.append("feedbacks["+i+"]","{thumbnail_id:"+feedbackArr[i].id+",feedback:"+feedbackArr[i].content+"}");
        }

        console.log('--->>> sendFeedback method --- ' + url + '\n--- ' + JSON.stringify(this.formdata));
        fetchPostData(url, this.formdata, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('sendFeedback method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },

    // --------------- deep link url -----------
    addRecipientForDeepLink: function(parent, token, device_id, callback) {
        url = API_ENDPOINT + "request/add-recipient?device_id="+device_id;

        this.formdata = new FormData();
        this.formdata.append("token", token);

        console.log('--->>> addRecipientForDeepLink method --- ' + url + '\n--- ' + JSON.stringify(this.formdata));
        fetchPostData(url, this.formdata, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('addRecipientForDeepLink method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },


    getFeedbackDeeplinkData: function(parent, token, callback) {
        url = API_ENDPOINT + "feedback/by-token/"+token;

        console.log('--->>> get Feedback DeeplinkData method --- ' + url);
        fetchGetData(url, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('get Feedback DeeplinkData method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },
    getSubmitFeedbackDeeplinkData: function(parent, token, callback) {
        url = API_ENDPOINT + "request/by-token/"+token;

        console.log('--->>> get Request DeeplinkData method --- ' + url);
        fetchGetData(url, function(err, data) {
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
                console.log('get Request DeeplinkData method error ---->> ' + err);
                parent._modalLoadingSpinnerOverLay.hide();
            }
        });
    },


    putUserKeyword: function(parent, device_id, keywordArr, keyword_nameArr, AccessToken, callback) {
        url = API_ENDPOINT + "user-keyword?device_id=" + device_id;
        console.log('--->>> putUserKeyword method --- ' + url );

        var obj = {
            "device_token": AccessToken,
        };
        for(var i = 0; i < keywordArr.length ; i++){
          obj["keywords["+i+"]"] = keywordArr[i];
        }
        for(var i = 0; i < keyword_nameArr.length ; i++){
          obj["keywords_name["+i+"]"] = keyword_nameArr[i].replace(/"/g,"");
        }

        var formBody = [];
        for (var property in obj) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(obj[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        console.log('--- ********************************** >> ' + JSON.stringify(formBody));

        fetchDataMyPut(url, formBody, function(err, data) {
            // alert(JSON.stringify(data));
          if (!err) {
              callback(parent, data);
          } else {
              // Alert.alert(mainTextApp, "Error communicating with server: " + err);
          }
        });
    },
    getHomeData: function(parent, device_id, callback) {
        url = API_ENDPOINT + "user-occurences?device_id=" + device_id;

          console.log('--->>> getHomeData --- ' + url );
            fetchGetData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if(data == undefined){
              callback(parent, data);
            }
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
            }
        });
    },
    setUserVideoClick: function(parent, occurance_id, callback) {
        url = API_ENDPOINT + "video-view/" + occurance_id;

          console.log('--->>> set occurance method --- ' + url );
            fetchGetData(url, function(err, data) {
            // alert(JSON.stringify(data));
            if (!err) {
                callback(parent, data);
            } else {
                // Alert.alert(mainTextApp, "Error communicating with server: " + err);
            }
        });
    },
};
module.exports = Api;
