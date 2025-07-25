import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./authSlice.js"
import nearbyUsersReducer from "./nearbyUserSlice.js"
import emergencyReducer from './emergencySlice'; // Add this

const store = configureStore({
    reducer:{
        auth:authReducer,
        nearbyUsers:nearbyUsersReducer,
        emergency: emergencyReducer,
    }
})

export default store