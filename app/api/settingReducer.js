import StoragePosts from './storagePosts';

const SettingReducer = (state = {}, action) => {
    
    if (action.type === 'SAVE_SETTINGS') {
       
        return action.settings;
       
    }

    if (action.type === 'LOAD_SETTINGS') {
        return  state;
       
    }

    if (action.type === 'VIEW_POST') {
       
        let counter = state.Views == null? 1: state.Views + 1;
        return {...state, Views: counter};
       
    }
    return state;
};

export default SettingReducer;