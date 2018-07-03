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
        let user = UserStorage.getUserInformation();
        
        return { ...state, User};
       
    }
    return state;
};

export default UserManagementReducer;