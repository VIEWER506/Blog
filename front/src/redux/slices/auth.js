import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { Logout } from "@mui/icons-material";


export const fetchUserData = createAsyncThunk("auth/fetchUserData", async (params) => {
    const {data} = await axios.post("/log", params);
    
    return data
})
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
    const {data} = await axios.get("/auth/me");
    return data
})
export const fetchReister = createAsyncThunk("auth/fetchReister", async (params) => {
    const {data} = await axios.post("/reg", params);
    return data
})


const initialState = {
    data: null,
    status: "loading",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null
        },
        setAboutMe: (state, action) => {
      if (state.data?.UseData) {
        state.data.UseData.aboutMe = action.payload;
      }
    },  setFullName: (state,action) => {
        if(state.data?.UseData){
            state.data.UseData.fullName = action.payload
        }
    }
    },
    
    extraReducers: {
        [fetchUserData.pending]: (state) => {
            state.status = "loading"
            state.data = null
        },
        [fetchUserData.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "loaded";
        },
        [fetchUserData.rejected]: (state, action) => {
             state.status = "error"
            state.data = null
        },
        [fetchAuthMe.pending]: (state) => {
            state.status = "loading"
            state.data = null
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "loaded";
        },
        [fetchAuthMe.rejected]: (state, action) => {
             state.status = "error"
            state.data = null
        },
        [fetchReister.pending]: (state) => {
            state.status = "loading"
            state.data = null
        },
        [fetchReister.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = "loaded";
        },
        [fetchReister.rejected]: (state, action) => {
             state.status = "error"
            state.data = null
        }
}})

export const selectIsAuth = (state) => Boolean(state.auth.data)
export const authReducer = authSlice.reducer
export const {logout, setAboutMe, setFullName} = authSlice.actions 