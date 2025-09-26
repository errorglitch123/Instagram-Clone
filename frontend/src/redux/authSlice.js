import suggestedUser from "@/components/suggestedUser";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name:'auth',
  initialState:{
    user:null,
    suggestedUser:[],
    userProfile:null
  },
  reducers:{
    //actions
    setAuthUser:(state,action)=>{
      state.user = { ...action.payload };
    },
    setSugggestedUser:(state,action)=>{
      state.suggestedUser = action.payload;
    },
    setUserProfile:(state,action)=>{
      state.userProfile = action.payload;
    }
  }
});

export const {setAuthUser , setSugggestedUser, setUserProfile} = authSlice.actions;
export default authSlice.reducer;