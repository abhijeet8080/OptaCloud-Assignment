import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id:"",
    name:"",
    email:"",
    profile_pic:"",
    token:"",
    isLoggedIn:false,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser: (state,action)=>{
            state._id=action.payload._id;
            state.name=action.payload.name;
            state.email=action.payload.email;
            state.profile_pic=action.payload.profile_pic;
            state.isLoggedIn=true;
        },
        setToken:(state,action)=>{
            state.token=action.payload;
            state.isLoggedIn = true;
        },
        logout:(state,action)=>{
            state._id="";
            state.name="";
            state.email="";
            state.profile_pic="";
            localStorage.removeItem('token');
            state.isLoggedIn=false;
        },
    }
})

export const{setUser,logout,setToken} = userSlice.actions;

export default userSlice.reducer