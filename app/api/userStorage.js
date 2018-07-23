import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import EncryptHelper from '../utils/encryptHelper';

const saveUserInformation = async (userInfo) => {
    try {
        
        await AsyncStorage.setItem('@UserInformation:key', JSON.stringify(userInfo), (err, result) => { console.log(err); });
    } catch (error) {
        return false;
    }
    return true;
};
const getUserInformation = async () => {
        try {
            let user = await AsyncStorage.getItem('@UserInformation:key')
            return  JSON.parse(user);
           
        } catch (error) {
        // Error retrieving data
            
            return {};
        }
    }

module.exports =
{
    saveUserInformation: saveUserInformation,
    getUserInformation: getUserInformation
} ;
