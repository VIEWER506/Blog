import {configureStore} from "@reduxjs/toolkit"
import { postsReducer } from "./slices/post"

const store = configureStore({
    reducer: {
        post: postsReducer
    }
})

export default store 