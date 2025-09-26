import { createSlice } from "@reduxjs/toolkit";

const postSilce = createSlice({
  name:'post',
  initialState:{
    posts:[],
    selectedPost:null
  },
  reducers:{
    //actions
    setPosts:(state,action)=>{
      state.posts = action.payload 
    },
    setSelectedPost:(state,action)=>{
      state.selectedPost = action.payload
    }
  }
});
export const {setPosts,setSelectedPost} = postSilce.actions;


export default postSilce.reducer;