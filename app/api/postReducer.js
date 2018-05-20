import StoragePosts from './storagePosts';

const PostReducer = (state = {FavoritedPosts:[], Loaded:false}, action) => {
    if (action.type === 'BOOK_MARK_POST') {
        
        if(state.FavoritedPosts!=null && action.post!=null){
                (async () => {
                    await StoragePosts.addPost(action.post);
                    })();
                let existed =  StoragePosts.checkingExistedPost(action.post,state.FavoritedPosts);
                
                if(!existed){ 
                    return {...state,FavoritedPosts: [action.post].concat(state.FavoritedPosts)};
                }
                
        } 
        return state;      
    }
    if (action.type === 'UNBOOK_MARK_POST') {
        
        if (state.FavoritedPosts != null && action.post != null) {
            (async () => {
                await StoragePosts.deletePost(action.post);
            })();
            let posts = state.FavoritedPosts.filter((item) => Number(item.postid) != Number(action.post.postid))
            
            return { ...state, FavoritedPosts: posts };

        } 
        return state;      
    }
    if (action.type === 'LOAD_DATA_STORAGE') {
        state.FavoritedPosts = action.posts;
        return state;
       
    }

    
    if(action.type === 'CHECKING-BOOKMARK'){
        let existed =  StoragePosts.checkingExistedPost(action.post,state.FavoritedPosts);
        return { ...state, booked:true};
    }
    return state;
};

export default PostReducer;