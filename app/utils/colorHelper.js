
export default class ColorHelper{
    constructor(){
    }
   

    static getHexColor(id) {
        try{
            return '#' + ('000000' + Math.floor(id * 90000).toString(16)).slice(-6);
        }
        catch(err){
            return '#00b386';
        }
        
    }
}