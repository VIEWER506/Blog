import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
    const {data} = await axios.get("/posts");
    return data
})
export const fetchTags = createAsyncThunk("post/fetchTags", async () => {
    const {data} = await axios.get("/tags");
    return data
})
export const fetchRemovePosts = createAsyncThunk("post/fetchRemovePosts", async (id) => {
     axios.delete(`/posts/${id}`);
})
const initialState = {
    posts:{
        items: [],
        status: "loading"
    },
    tags:{
        items: [],
        status: "loading"
    }
}


const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers:{
        //Получение статей 
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = "loading"
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = "loaded";
        },
        [fetchTags.rejected]: (state, action) => {
            state.posts.items = [];
            state.posts.status = "error";
        },//Получение тегов
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = "loading"
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = "loaded";
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = "error";
        },//Удаление статей
        [fetchRemovePosts.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
        }
    }
})

export const postsReducer = postsSlice.reducer

