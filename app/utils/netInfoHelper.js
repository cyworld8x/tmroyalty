
import { NetInfo } from "react-native";
export default class NetInfoHelper {
    constructor(){
    }
    static Register(navigation) {
        this.navigation = navigation;
        NetInfo.isConnected.addEventListener(
            'change',
            this.handleConnectivityChange
        );
    }


    handleConnectivityChange(isConnected) {
        if(!isConnected){
            // console.error(isConnected);
            this.navigation.navigate("Version");
        }
        
    }

}