import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import EncryptHelper from '../utils/encryptHelper';

const saveFacebookAccessToken =async (token) => {
    try {

        await AsyncStorage.setItem('@FacebookAccessToken:key', JSON.stringify(token), (err, result) => { console.log(err); });
    } catch (error) {
        
        return false;
    }
    return true;
};
const getFacebookAccessToken = async () => {
        try {
            let posts = await AsyncStorage.getItem('@FacebookAccessToken:key')
            return posts;
           
        } catch (error) {
        // Error retrieving data
            
            return {};
        }
        
    }

module.exports =
{
    saveFacebookAccessToken: saveFacebookAccessToken,
    getFacebookAccessToken: getFacebookAccessToken
} ;
