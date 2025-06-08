import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPost = createAsyncThunk("post/fetchPosts", async () => {
    const {data} = await axios.get("/posts");
    return data
})

const initialState = {
    post:{
        items: [],
        status: "loading"
    },
    tags:{
        items: [],
        status: "loading"
    }
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers:{
        [fetchPost.pending]: (state) => {
            state.posts.items = [];
            state.post.status = "loading"
        },
        [fetchPost.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.post.status = "loaded";
        },
        [fetchPost.rejected]: (state, action) => {
            state.posts.items = [];
            state.post.status = "error";
        },
    }
})

export const postsReducer = postSlice.reducer