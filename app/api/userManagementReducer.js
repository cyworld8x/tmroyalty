import UserStorage from './userStorage';


const UserManagementReducer = (state = {}, action) => {
    if (action.type === 'SAVE_USER_INFORMATION') {
        
        if(action.user!=null){
                (async () => {
                    await UserStorage.saveUserInformation(action.user);
                    })();
                    
                    return { ...state, User:action.user};;     
        }
        return state;      
    }
    if (action.type === 'LOAD_USER_INFORMATION') {
        
        return state;
       
    }
    if (action.type === 'VIEW_NOTIFICATION') {
        let user = state.User;
        user.NumberOfNotification = action.numberOfNotification;
        return { ...state, User:user};
       
    }
    return state;
};

export default UserManagementReducer;