
import { Platform, ToastAndroid,AlertIOS } from "react-native";
export default class NotificationHelper{
    constructor(){
    }
    static Notify(message){
        if (Platform.OS === "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else if (Platform.OS === "ios") {
            AlertIOS.alert(message);
        }
    }

}