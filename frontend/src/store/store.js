import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./authSlice.js"
import nearbyUsersReducer from "./nearbyUsersSlice.js"

const store = configureStore({
    reducer:{
        auth:authReducer,
        nearbyUsers:nearbyUsersReducer,
    }
})

export default store