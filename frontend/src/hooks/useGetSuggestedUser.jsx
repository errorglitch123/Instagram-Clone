
import { setSugggestedUser } from "@/redux/authSlice";

import axios from "axios"
import React, {useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"


const useGetSuggestedUser = ()=>{
  const {userProfile} = useSelector(store=>store.auth)
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchSuggestedUser = async ()=>{
      try {
        const res = await axios.get('http://localhost:8281/api/v1/user/suggested',{withCredentials:true});
        if( res.data.success){
          dispatch(setSugggestedUser(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchSuggestedUser();
  },[] );
};
export default useGetSuggestedUser;
