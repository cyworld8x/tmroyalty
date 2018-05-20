import { combineReducers } from 'redux';
import PostReducer from './postReducer';
import SettingReducer from './settingReducer';

const StorageReducer = combineReducers({
    Storage: PostReducer,
    Settings: SettingReducer
});

export default StorageReducer;