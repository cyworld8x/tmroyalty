import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  ShareDialog
} from 'react-native-fbsdk';
import {
  Platform
} from 'react-native';
export default class Facebook {
   static async Login(fields, callback,cancelCallback) {
    // native_only config will fail in the case that the user has
    // not installed in his device the Facebook app. In this case we
    // need to go for webview.
    let result;
    try {
      this.setState({ showLoadingModal: true });
      LoginManager.setLoginBehavior(Platform.OS === 'ios' ?'native': 'NATIVE_ONLY');
      result = await LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_posts']);
    } catch (nativeError) {
      try {
        LoginManager.setLoginBehavior(Platform.OS === 'ios' ?'web':'WEB_ONLY');
        result = await LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_posts']);
      } catch (webError) {
        console.log(webError);
        // show error message to the user if none of the FB screens
        // did not open
      }
    }
    // handle the case that users clicks cancel button in Login view
    if (result.isCancelled) {
      cancelCallback.bind(this);
    } else {
      // Create a graph request asking for user information
      this.GetUserInfo_FBGraphRequest(fields, callback);
    }
  }

   static async GetFriends_FBGraphRequest(fields, callback, userid) {
    const accessData = await AccessToken.getCurrentAccessToken();
    
    if(accessData ==null){
      this.Login(callback);
    }else{
      const infoRequest = new GraphRequest('/me/friends', {
        accessToken: accessData.accessToken,
        parameters: {
          fields: {
            string: fields
          }
        }
      }, callback.bind(this));
      // Execute the graph request created above
       // Create a graph request asking for user information
      new GraphRequestManager().addRequest(infoRequest).start();
    }
  }

  static async GetUserInfo_FBGraphRequest(fields, callback, cancelCallback) {
    const accessData = await AccessToken.getCurrentAccessToken();
    
    if(accessData ==null){
      this.Login(fields,callback,cancelCallback);
    }else{
      const infoRequest = new GraphRequest("/me", {
        accessToken: accessData.accessToken,
        parameters: {
          fields: {
            string: fields
          }
        }
      }, callback.bind(this));
      // Execute the graph request created above
       // Create a graph request asking for user information
      new GraphRequestManager().addRequest(infoRequest).start();
    }
  }

  static async share(shareLinkContent, callback) {
    const accessData = await AccessToken.getCurrentAccessToken();
    var tmp = this;
    ShareDialog.canShow(shareLinkContent).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }else{
          callback({Status:'Error'});
        }
      }
    ).then(
      function(result) {
       
        if (result.isCancelled) {
          callback({Status:'Cancelled'});
        } else {
          callback({Status:'Success',data:result.postid|null});
        }
      },
      function(error) {
        callback({Status:'Error'});
      }
    );
    
  }

  static LogOut(){
    LoginManager.logOut();
  }
}
