
export default class EncryptHelper{
    constructor(){
    }
   

    static decode_base(str) {
        try{
            var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=str.length;
            var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(i=0;i<64;i++){e[A.charAt(i)]=i;}
            for(x=0;x<L;x++){
                c=e[str.charAt(x)];b=(b<<6)+c;l+=6;
                while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
            }
            return r
        }
        catch(err){
            return {};
        }
        
    }
}