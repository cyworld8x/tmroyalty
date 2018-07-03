import { combineReducers } from 'redux';
import UserManagementReducer from './userManagementReducer';
import SettingReducer from './settingReducer';

const StorageReducer = combineReducers({
    UserManagement: UserManagementReducer,
    Settings: SettingReducer
});

export default StorageReducer;