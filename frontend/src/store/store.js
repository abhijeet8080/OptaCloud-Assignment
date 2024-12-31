import {configureStore} from "@reduxjs/toolkit"
import locationReducer from "./Reducers/locationSlice"
import userReducer from "./Reducers/userSlice"
const store = configureStore({
    reducer:{
        location:locationReducer,
        user:userReducer
    }
})

export default store